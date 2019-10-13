import React, {FC} from 'react';
import styled from 'styled-components';
import {updateParticipant} from '../Stores/Visualization/Setup/ParticipantRedux';
import {connect} from 'react-redux';
import {VisualizationProvenance} from '..';
import VisualizationState from '../Stores/Visualization/VisualizationState';

interface OwnProps {
  test?: string;
}

interface StateProps {
  somthingToPrint: string;
}

interface DispatchProps {
  update: any;
}

type Props = OwnProps & DispatchProps & StateProps;

const Visualization: FC<Props> = ({test, update, somthingToPrint}: Props) => {
  console.table(Object.values(VisualizationProvenance.graph().nodes));
  return (
    <MainSvg>
      <g
        transform={'translate(50, 50)'}
        onClick={() => update(Math.random().toString())}>
        <text>{test ? test : somthingToPrint}</text>
      </g>
    </MainSvg>
  );
};

const mapDispatchToProps = (): DispatchProps => ({
  update: (name: string) => {
    console.log('Hello');
    VisualizationProvenance.apply(updateParticipant({name: name}));
  },
});

const mapStateToProps = (state: VisualizationState): StateProps => ({
  somthingToPrint: state.participant.name,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Visualization);

const MainSvg = styled('svg')`
  width: 100%;
  height: 100%;
`;
