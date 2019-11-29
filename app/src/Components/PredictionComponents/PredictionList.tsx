import React, {FC, useState, useMemo} from 'react';
import {Prediction} from '../../contract';
import {Dataset} from '../../Stores/Types/Dataset';
import {selectAll, scaleLinear} from 'd3';
import {Header, Popup, Table, Icon} from 'semantic-ui-react';
import {hashCode} from '../../Utils';
import {
  PredictionListJaccardItem,
  PredictionListNBItem,
} from './PredictionListItem';
import {
  PredictionType,
  getPredictionType,
} from '../../Stores/Predictions/PredictionsState';
import {SelectionRecord} from '../../App';
import {Plots, SinglePlot} from '../../Stores/Types/Plots';
import {useSelector} from 'react-redux';
import {AppState} from '../../Stores/CombinedStore';
import {ScaleStorage} from '../Scatterplot';

interface Props {
  dataset: Dataset;
  barHeight: number;
  predictions: Prediction[];
  selectionRecord: SelectionRecord;
}

export interface TypedPrediction extends Prediction {
  type: PredictionType;
}

const PredictionList: FC<Props> = ({
  dataset,
  barHeight,
  predictions,
  selectionRecord,
}: Props) => {
  const [
    selectedPrediction,
    setSelectedPrediction,
  ] = useState<Prediction | null>(null);

  const plots: Plots = useSelector((state: AppState) => state.plots);

  const selectedIds: number[] = useMemo(() => {
    const {brushSelections, pointSelections} = selectionRecord;

    return [
      ...new Set([
        ...Object.keys(brushSelections).map(d => parseInt(d)),
        ...pointSelections,
      ]),
    ];
  }, [selectionRecord]);

  function onPredictionClick(
    pred: TypedPrediction,
    countries: string[],
    dimensions: string[],
  ) {
    const isThisSelected =
      selectedPrediction && pred.intent === selectedPrediction.intent;

    showRegressionLine(isThisSelected, pred, dimensions);

    if (isThisSelected) {
      selectAll('.mark').classed('tone_down_others', false);
      setSelectedPrediction(null);
    } else {
      selectAll('.mark').classed('tone_down_others', true);
      countries.forEach(code => {
        selectAll(`.${code}`).classed('tone_down_others', false);
      });
      setSelectedPrediction(pred);
    }
  }

  function lineGenerator(intercept: number, coeff: number) {
    return (x: number) => coeff * x + intercept;
  }

  function showRegressionLine(
    isThisSelected: boolean | null,
    pred: TypedPrediction,
    dimensions: string[],
  ) {
    const plotCombinations = plots.filter(
      p => dimensions.includes(p.x) && dimensions.includes(p.y),
    );

    let validPlot: SinglePlot = null as any;

    if (plotCombinations.length > 0) validPlot = plotCombinations[0];
    else return;

    const plotSelection = selectAll(`.plot${validPlot.id}`);
    const regressionArea = plotSelection.selectAll('.regression_line');

    if (!isThisSelected && pred.type === PredictionType.LinearRegression) {
      const scales: ScaleStorage = JSON.parse(
        regressionArea.attr('data-scale'),
      );

      const xScale = scaleLinear()
        .domain(scales.x.domain)
        .range(scales.x.range);
      const yScale = scaleLinear()
        .domain(scales.y.domain)
        .range(scales.y.range);

      let {intercept, coef} = pred.info as any;

      if (!intercept || !coef) return;

      coef = coef.length > 0 ? coef[0] : coef;

      const lineGen = lineGenerator(intercept, coef);

      const x1 = scales.x.domain[0];
      const x2 = scales.x.domain[1];

      const y1 = lineGen(x1);
      const y2 = lineGen(x2);

      regressionArea
        .selectAll('.regression-line')
        .data([1])
        .join(
          enter =>
            enter
              .append('line')
              .attr('x1', xScale(x1))
              .attr('x2', xScale(x2))
              .attr('y1', yScale(y1))
              .attr('y2', yScale(y2))
              .classed('regression-line', true),
          update =>
            update
              .attr('x1', xScale(x1))
              .attr('x2', xScale(x2))
              .attr('y1', yScale(y1))
              .attr('y2', yScale(y2)),
          exit => exit.remove(),
        );
      setSelectedPrediction(pred);
    } else {
      regressionArea.html('');
      setSelectedPrediction(null);
    }
  }

  const extendedPredictions: TypedPrediction[] = predictions.map(pred => {
    const exPred: TypedPrediction = {...pred, type: null as any};

    exPred.type = getPredictionType(pred.intent);
    return exPred;
  });

  const {data, labelColumn} = dataset;

  return (
    <Table compact>
      {extendedPredictions.length > 0 && (
        <>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="ten">Similarity</Table.HeaderCell>
              <Table.HeaderCell width="one">Probability</Table.HeaderCell>
              <Table.HeaderCell width="one"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {extendedPredictions.map(pred => {
              const {dataIds = []} = pred;
              const countries = dataIds.map(d =>
                hashCode(data[d][labelColumn]),
              );

              const {intent, type} = pred;
              const [
                hash = '',
                dimensions = '',
                intentName = '',
                intentDetails = '',
                info = '',
              ] =
                type === PredictionType.Range
                  ? ['', '', intent, '', '']
                  : intent.split(':');

              const dimensionArr = [...dimensions.matchAll(/\w+/g)].flatMap(
                d => d,
              );

              const fullDimensionName = dimensionArr.map(
                d => dataset.columnMaps[d].text,
              );

              return (
                <Table.Row
                  active={
                    (selectedPrediction &&
                      selectedPrediction.intent === pred.intent) as any
                  }
                  key={`${intent}${hash}${dimensions}${intentName}${intentDetails}${info}`}
                  onClick={() =>
                    onPredictionClick(pred, countries, dimensionArr)
                  }>
                  <Table.Cell>
                    <PredictionListJaccardItem
                      selectedIds={selectedIds}
                      dataset={dataset}
                      barHeight={barHeight}
                      prediction={pred}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <PredictionListNBItem
                      selectedIds={selectedIds}
                      dataset={dataset}
                      barHeight={barHeight}
                      prediction={pred}
                    />
                  </Table.Cell>
                  <Popup
                    hoverable
                    position="top right"
                    trigger={
                      <Table.Cell>
                        <Icon name="info circle"></Icon>
                      </Table.Cell>
                    }
                    content={
                      <>
                        <Header>{intentName}</Header>
                        <Header as="h3">{fullDimensionName.join(' | ')}</Header>
                        <pre>
                          {JSON.stringify(
                            pred,
                            (k, v) => (k === 'dataIds' ? undefined : v),
                            2,
                          )}
                        </pre>
                      </>
                    }></Popup>
                </Table.Row>
              );
            })}
          </Table.Body>
        </>
      )}
    </Table>
  );
};

// const intentTextStyle:CSSProperties = {
//     textTransform
// }

export default PredictionList;
