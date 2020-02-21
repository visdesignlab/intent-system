import React, {FC, useContext} from 'react';
import {Divider, Header, Statistic} from 'semantic-ui-react';
import {style} from 'typestyle';
import {DataContext} from '../../App';
import IntentStore from '../../Store/IntentStore';
import {inject, observer} from 'mobx-react';
import {Selection} from './Predictions';

export interface Props {
  store?: IntentStore;
  selections: Selection;
}

const Selections: FC<Props> = ({store, selections}: Props) => {
  const {multiBrushBehaviour} = store!;
  const data = useContext(DataContext);

  return (
    <div className={selectionStyle}>
      <div>
        <Header textAlign="center" as="h1">
          Selections
        </Header>
        <Statistic.Group widths="4">
          <Statistic color="orange">
            <Statistic.Value>{selections.union}</Statistic.Value>
            <Statistic.Label>Union</Statistic.Label>
          </Statistic>
          <Statistic
            color={multiBrushBehaviour === 'Union' ? 'orange' : 'blue'}>
            <Statistic.Value>{selections.intersection}</Statistic.Value>
            <Statistic.Label>Intersection</Statistic.Label>
          </Statistic>
          <Statistic color="red">
            <Statistic.Value>{selections.individual}</Statistic.Value>
            <Statistic.Label>Individual</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{selections.total}</Statistic.Value>
            <Statistic.Label>Total</Statistic.Label>
          </Statistic>
        </Statistic.Group>
        <Divider />
      </div>
      <div className={selectionList}>
        {selections.values.map(idx => (
          <div key={idx}>{data.values[idx][data.labelColumn]}</div>
        ))}
      </div>
    </div>
  );
};

export default inject('store')(observer(Selections));

const selectionStyle = style({
  gridArea: 'selections',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateRows: 'min-content auto',
});

const selectionList = style({
  overflow: 'auto',
});
