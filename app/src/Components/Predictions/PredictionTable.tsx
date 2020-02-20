import React, {FC} from 'react';
import {inject, observer} from 'mobx-react';
import IntentStore from '../../Store/IntentStore';
import {Table} from 'semantic-ui-react';
import {Prediction} from '../../contract';

type Props = {
  store?: IntentStore;
  predictions: Prediction[];
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
              <Table.Cell>{pred.intent}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default inject('store')(observer(PredictionTable));
