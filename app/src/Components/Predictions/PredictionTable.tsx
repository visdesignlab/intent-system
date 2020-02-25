import React, {FC} from 'react';
import {inject, observer} from 'mobx-react';
import IntentStore from '../../Store/IntentStore';
import {Table, Label} from 'semantic-ui-react';
import {PredictionRowType} from './PredictionRowType';
import JaccardBar from './JaccardBar';
import ProbabilityBar from './ProbabilityBar';
import hoverable from '../UtilComponent/hoverable';
import {FADE_OUT, FADE_COMP_IN} from '../Styles/MarkStyle';

type Props = {
  store?: IntentStore;
  predictions: PredictionRowType[];
};

const PredictionTable: FC<Props> = ({store, predictions}: Props) => {
  const barHeight = 30;

  const HoverTableCell = hoverable(Table.Cell);

  function predRowRender(pred: PredictionRowType) {
    const {matches, isnp, ipns, similarity, type, probability} = pred;

    return (
      <Table.Row key={pred.intent}>
        <Table.Cell>
          {pred.dims.map(dim => (
            <Label size="mini" circular key={dim}>
              {dim}
            </Label>
          ))}
        </Table.Cell>
        <HoverTableCell
          configs={
            matches.length === 0
              ? []
              : [
                  {
                    selector: '.base-mark',
                    classToApply: FADE_OUT,
                  },
                  {
                    selector: matches.map(m => `#mark-${m}`).join(','),
                    classToApply: FADE_COMP_IN,
                  },
                ]
          }>
          {matches.length}
        </HoverTableCell>
        <HoverTableCell
          configs={
            isnp.length === 0
              ? []
              : [
                  {
                    selector: '.base-mark',
                    classToApply: FADE_OUT,
                  },
                  {
                    selector: isnp.map(m => `#mark-${m}`).join(','),
                    classToApply: FADE_COMP_IN,
                  },
                ]
          }>
          {isnp.length}
        </HoverTableCell>
        <HoverTableCell
          configs={
            ipns.length === 0
              ? []
              : [
                  {
                    selector: '.base-mark',
                    classToApply: FADE_OUT,
                  },
                  {
                    selector: ipns.map(m => `#mark-${m}`).join(','),
                    classToApply: FADE_COMP_IN,
                  },
                ]
          }>
          {ipns.length}
        </HoverTableCell>
        <Table.Cell>
          <JaccardBar height={barHeight} score={similarity} label={type} />
        </Table.Cell>
        <Table.Cell>
          <ProbabilityBar
            height={barHeight}
            score={probability}
            label={probability.toFixed(2)}
          />
        </Table.Cell>
        <Table.Cell>Extra</Table.Cell>
      </Table.Row>
    );
  }

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
      <Table.Body>{predictions.map(predRowRender)}</Table.Body>
    </Table>
  );
};

export default inject('store')(observer(PredictionTable));

type ValueDivProps = {
  val: number;
};

const ValueDiv: FC<ValueDivProps> = (props: ValueDivProps) => {
  return (
    <div {...props} style={{height: '100%', width: '100%'}}>
      {props.val}
    </div>
  );
};
