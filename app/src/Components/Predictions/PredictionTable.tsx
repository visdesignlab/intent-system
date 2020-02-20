import React, {FC} from 'react';
import {inject, observer} from 'mobx-react';
import IntentStore from '../../Store/IntentStore';
import {Table} from 'semantic-ui-react';
import {PredictionRowType} from './PredictionRowType';

type Props = {
  store?: IntentStore;
  predictions: PredictionRowType[];
};

const PredictionTable: FC<Props> = ({store, predictions}: Props) => {
  const {annotation} = store!;

  return (
    <Table celled sortable textAlign="center">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Prediction: {annotation}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {predictions.map(pred => {
          return (
            <Table.Row key={pred.intent}>
              <Table.Cell>
                {pred.type} | {pred.similarity.toFixed(2)} |
                {pred.probability.toFixed(2)}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default inject('store')(observer(PredictionTable));
