import React, {FC} from 'react';
import {inject, observer} from 'mobx-react';
import IntentStore from '../../Store/IntentStore';
import {Table, Label} from 'semantic-ui-react';
import {PredictionRowType} from './PredictionRowType';
import JaccardBar from './JaccardBar';
import ProbabilityBar from './ProbabilityBar';

type Props = {
  store?: IntentStore;
  predictions: PredictionRowType[];
};

const PredictionTable: FC<Props> = ({store, predictions}: Props) => {
  const {annotation} = store!;

  const barHeight = 30;

  return (
    <Table sortable textAlign="center" compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Dims</Table.HeaderCell>
          <Table.HeaderCell>M</Table.HeaderCell>
          <Table.HeaderCell>NP</Table.HeaderCell>
          <Table.HeaderCell>NS</Table.HeaderCell>
          <Table.HeaderCell>Similarity</Table.HeaderCell>
          <Table.HeaderCell>Probability</Table.HeaderCell>
          <Table.HeaderCell>Misc</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {predictions.map(pred => {
          return (
            <Table.Row key={pred.intent}>
              <Table.Cell>
                {pred.dims.map(dim => (
                  <Label size="mini" circular key={dim}>
                    {dim}
                  </Label>
                ))}
              </Table.Cell>
              <Table.Cell>{pred.matches.length}</Table.Cell>
              <Table.Cell>{pred.isnp.length}</Table.Cell>
              <Table.Cell>{pred.ipns.length}</Table.Cell>
              <Table.Cell>
                <JaccardBar
                  height={barHeight}
                  score={pred.similarity}
                  label={pred.type}
                />
              </Table.Cell>
              <Table.Cell>
                <ProbabilityBar
                  height={barHeight}
                  score={pred.probability}
                  label={pred.probability.toFixed(2)}
                />
              </Table.Cell>
              <Table.Cell>Extra</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default inject('store')(observer(PredictionTable));
