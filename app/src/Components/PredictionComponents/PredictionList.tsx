import React, {FC, useState} from 'react';
import {Prediction} from '../../contract';
import {Dataset} from '../../Stores/Types/Dataset';
import {selectAll} from 'd3';
import {Header, Popup, Table, Icon} from 'semantic-ui-react';
import {hashCode} from '../../Utils';
import {
  PredictionListJaccardItem,
  PredictionListNBItem,
} from './PredictionListItem';

interface Props {
  dataset: Dataset;
  barHeight: number;
  predictions: Prediction[];
}

const PredictionList: FC<Props> = ({
  dataset,
  barHeight,
  predictions,
}: Props) => {
  const [
    selectedPrediction,
    setSelectedPrediction,
  ] = useState<Prediction | null>(null);

  function onPredictionClick(pred: Prediction, countries: string[]) {
    const isThisSelected =
      selectedPrediction && pred.intent === selectedPrediction.intent;

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

  const {data, labelColumn} = dataset;

  return (
    <Table compact>
      {predictions.length > 0 && (
        <>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="one"></Table.HeaderCell>
              <Table.HeaderCell width="ten">Similarity</Table.HeaderCell>
              <Table.HeaderCell width="one">Probability</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {predictions.map(pred => {
              const {dataIds = []} = pred;
              const countries = dataIds.map(d =>
                hashCode(data[d][labelColumn]),
              );

              return (
                <Table.Row
                  active={
                    (selectedPrediction &&
                      selectedPrediction.intent === pred.intent) as any
                  }
                  key={pred.intent}
                  onClick={() => onPredictionClick(pred, countries)}>
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
                        <Header>{pred.intent}</Header>
                        <pre>
                          {JSON.stringify(
                            pred,
                            (k, v) => (k === 'dataIds' ? undefined : v),
                            2,
                          )}
                        </pre>
                      </>
                    }></Popup>
                  <Table.Cell>
                    <PredictionListJaccardItem
                      barHeight={barHeight}
                      prediction={pred}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <PredictionListNBItem
                      barHeight={barHeight}
                      prediction={pred}
                    />
                  </Table.Cell>
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
