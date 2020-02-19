import React, {FC, Fragment} from 'react';
import IntentStore from '../../Store/IntentStore';
import {Table, Loader, Segment, Dimmer, Card, Header} from 'semantic-ui-react';
import {inject, observer} from 'mobx-react';
import {style} from 'typestyle';
import {Prediction} from '../../contract';

export interface Props {
  store?: IntentStore;
  predictions: Prediction[];
  annotation: string;
}

const PredictionList: FC<Props> = ({store, predictions, annotation}: Props) => {
  const {isLoadingPredictions} = store!;

  const predictionTable = (
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

  const loadingComponent = (
    <Segment placeholder basic>
      <Dimmer active inverted>
        <Loader inverted active>
          Recompute
        </Loader>
      </Dimmer>
    </Segment>
  );

  return (
    <div className={listStyle}>
      {isLoadingPredictions ? (
        loadingComponent
      ) : predictions.length ? (
        predictionTable
      ) : (
        <Segment basic placeholder textAlign="center">
          <Header>Interact to load predictions</Header>
        </Segment>
      )}
    </div>
  );
};

export default inject('store')(observer(PredictionList));

const listStyle = style({
  gridArea: 'predictions',
  overflow: 'scroll',
});
