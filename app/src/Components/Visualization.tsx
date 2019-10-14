import React, {FC, useState, createRef, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import {updateParticipant} from '../Stores/Visualization/Setup/ParticipantRedux';
import {connect} from 'react-redux';
import {VisualizationProvenance} from '..';
import VisualizationState from '../Stores/Visualization/VisualizationState';
import {Dataset} from '../Stores/Types/Dataset';
import {Plots} from '../Stores/Types/Plots';

interface OwnProps {
  test?: string;
}

interface StateProps {
  dataset: Dataset;
  plots: Plots;
}

interface DispatchProps {
  update: any;
}

type Props = OwnProps & DispatchProps & StateProps;

const Visualization: FC<Props> = ({dataset, plots}: Props) => {
  const [dimensions, setDimensions] = useState<{height: number; width: number}>(
    {height: -1, width: -1},
  );

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setDimensions({
        height: node.getBoundingClientRect().height,
        width: node.getBoundingClientRect().width,
      });
    }
  }, []);

  const margin = 50;
  const height = dimensions.height - 2 * margin;
  const width = dimensions.width - 2 * margin;

  return (
    <MainSvg ref={measuredRef}>
      <g transform={`translate(${margin}, ${margin})`}>
        {height >= 0 && width >= 0 && (
          <BorderRectangle width={width} height={height}></BorderRectangle>
        )}
      </g>
    </MainSvg>
  );
};

const mapDispatchToProps = (): DispatchProps => ({
  update: (name: string) => {
    VisualizationProvenance.apply(updateParticipant({name: name}));
  },
});

const mapStateToProps = (state: VisualizationState): StateProps => ({
  dataset: state.dataset,
  plots: state.plots,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Visualization);

const MainSvg = styled('svg')`
  width: 100%;
  height: 100%;
`;

const BorderRectangle = styled('rect')`
  fill: none;
  stroke: black;
  stroke-width: 1px;
`;
