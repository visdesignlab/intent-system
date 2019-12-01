import React, {FC, useState, useMemo, useEffect} from 'react';
import {Prediction} from '../../contract';
import {Dataset} from '../../Stores/Types/Dataset';
import {selectAll, scaleLinear} from 'd3';
import {Header, Popup, Table, Icon, Label} from 'semantic-ui-react';
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
import _ from 'lodash';
import {pure} from 'recompose';
import {areEqual} from '../../Utils';

interface Props {
  dataset: Dataset;
  barHeight: number;
  predictions: Prediction[];
  selectionRecord: SelectionRecord;
}

export interface TypedPrediction extends Prediction {
  type: PredictionType;
  hash: string;
  dimensions: string;
  intentName: string;
  intentDetails: string;
  _info: string;
  matches: number[];
  isnp: number[];
  ipns: number[];
  probability: number;
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

  function onContainmentHover(countries: string[], show: boolean = true) {
    if (!show) {
      selectAll('.mark').classed('containment_highlight', false);
    } else {
      countries.forEach(code => {
        selectAll(`.${code}`).classed('containment_highlight', true);
      });
    }
  }

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

  const predictionString = JSON.stringify(predictions);

  type SortDirections = 'ascending' | 'descending' | undefined;

  const [sortDirection, setSortDirection] = useState<SortDirections>(undefined);

  type SortOptions =
    | 'matches'
    | 'isnp'
    | 'ipns'
    | 'similarity'
    | 'probability'
    | '';

  const [column, setColumn] = useState<SortOptions>('');
  const [extendedPredictions, setExtendedPredictions] = useState<
    TypedPrediction[]
  >([]);

  useEffect(() => {
    const memoizedPredictions: Prediction[] = JSON.parse(predictionString);

    const exP = memoizedPredictions.map(pred => {
      let exPred: TypedPrediction = {
        ...pred,
        type: null as any,
        matches: [],
        isnp: [],
        ipns: [],
      } as any;

      exPred.type = getPredictionType(pred.intent);

      let probability = 0;

      if (pred.info) probability = (pred.info as any).probability || 0;

      const {dataIds = []} = pred;

      const {intent} = pred;
      const [
        hash = '',
        dimensions = '',
        intentName = '',
        intentDetails = '',
        info = '',
      ] =
        exPred.type === PredictionType.Range
          ? ['', '', intent, '', '']
          : intent.split(':');

      exPred = {
        ...exPred,
        hash,
        dimensions,
        intentName,
        intentDetails,
        _info: info,
        probability,
      };

      const matches = _.intersection(dataIds, selectedIds);
      const ipns = _.difference(dataIds, selectedIds);
      const isnp = _.difference(selectedIds, dataIds);

      exPred.matches = matches;
      exPred.ipns = ipns;
      exPred.isnp = isnp;

      return exPred;
    });
    if (!areEqual(extendedPredictions, exP)) setExtendedPredictions(exP);
  }, [predictionString, selectedIds, extendedPredictions]);

  function handleSort(clickedColumn: SortOptions) {
    return () => {
      if (column !== clickedColumn) {
        setColumn(clickedColumn);

        if (clickedColumn === 'similarity') clickedColumn = 'rank' as any;

        setExtendedPredictions(_.sortBy(extendedPredictions, [clickedColumn]));
        setSortDirection('ascending');
      } else {
        setExtendedPredictions(extendedPredictions.reverse());
        setSortDirection(
          sortDirection === 'ascending' ? 'descending' : 'ascending',
        );
      }
    };
  }

  return (
    <Table sortable compact>
      {extendedPredictions.length > 0 && (
        <>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="two">Dims</Table.HeaderCell>
              <Popup
                trigger={
                  <Table.HeaderCell
                    width="one"
                    onClick={handleSort('matches')}
                    sorted={column === 'matches' ? sortDirection : undefined}>
                    M
                  </Table.HeaderCell>
                }
                content={'Matches'}></Popup>
              <Popup
                trigger={
                  <Table.HeaderCell
                    width="one"
                    onClick={handleSort('isnp')}
                    sorted={column === 'isnp' ? sortDirection : undefined}>
                    NP
                  </Table.HeaderCell>
                }
                content={'In Selection But Not Predicted'}></Popup>
              <Popup
                trigger={
                  <Table.HeaderCell
                    width="one"
                    onClick={handleSort('ipns')}
                    sorted={column === 'ipns' ? sortDirection : undefined}>
                    NS
                  </Table.HeaderCell>
                }
                content={'In Prediction But Not Selected'}></Popup>
              <Table.HeaderCell
                width="ten"
                onClick={handleSort('similarity')}
                sorted={column === 'similarity' ? sortDirection : undefined}>
                Similarity
              </Table.HeaderCell>
              <Table.HeaderCell
                width="two"
                onClick={handleSort('probability')}
                sorted={column === 'probability' ? sortDirection : undefined}>
                Probability
              </Table.HeaderCell>
              <Table.HeaderCell width="one"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {extendedPredictions.map(pred => {
              const {dataIds = []} = pred;

              const countries = dataIds.map(d => dataset.indexHash[d]);

              const {intent, dimensions, intentName} = pred;

              const dimensionArr = [...dimensions.matchAll(/\w+/g)].flatMap(
                d => d,
              );

              const fullDimensionName = dimensionArr.map(
                d => dataset.columnMaps[d].text,
              );

              const {matches, ipns, isnp} = pred;

              const matchCountries = matches.map(m => dataset.indexHash[m]);
              const ipnsCountries = ipns.map(i => dataset.indexHash[i]);
              const isnpCountries = isnp.map(i => dataset.indexHash[i]);

              return (
                <Table.Row
                  active={
                    (selectedPrediction &&
                      selectedPrediction.intent === pred.intent) as any
                  }
                  key={intent}
                  onClick={() => {
                    console.log(pred);
                    onPredictionClick(pred, countries, dimensionArr);
                  }}>
                  <Table.Cell>
                    {dimensionArr.map(name => {
                      return (
                        <Popup
                          key={name}
                          content={dataset.columnMaps[name].text}
                          trigger={
                            <Label circular size="mini">
                              {dataset.columnMaps[name].short}
                            </Label>
                          }></Popup>
                      );
                    })}
                  </Table.Cell>
                  <Table.Cell
                    onMouseEnter={() => {
                      onContainmentHover(matchCountries);
                    }}
                    onMouseLeave={() => {
                      onContainmentHover(matchCountries, false);
                    }}
                    className="containtment_hover_cell">
                    {matches.length}
                  </Table.Cell>
                  <Table.Cell
                    className="containtment_hover_cell"
                    onMouseEnter={() => {
                      onContainmentHover(isnpCountries);
                    }}
                    onMouseLeave={() => {
                      onContainmentHover(isnpCountries, false);
                    }}>
                    {isnp.length}
                  </Table.Cell>
                  <Table.Cell
                    className="containtment_hover_cell"
                    onMouseEnter={() => {
                      onContainmentHover(ipnsCountries);
                    }}
                    onMouseLeave={() => {
                      onContainmentHover(ipnsCountries, false);
                    }}>
                    {ipns.length}
                  </Table.Cell>
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

(PredictionList as any).whyDidYouRender = true;

export default pure(PredictionList);
