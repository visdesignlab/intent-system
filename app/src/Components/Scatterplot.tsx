import React, {FC, useEffect, RefObject, createRef} from 'react';
import {SinglePlot} from '../Stores/Types/Plots';
import {Dataset} from '../Stores/Types/Dataset';
import VisualizationState from '../Stores/Visualization/VisualizationState';
import {connect} from 'react-redux';
import {
  scaleLinear,
  min,
  max,
  scaleOrdinal,
  schemeSet2,
  axisBottom,
  select,
  axisLeft,
} from 'd3';
import styled from 'styled-components';
import {VisualizationProvenance} from '..';
import {removePlot} from '../Stores/Visualization/Setup/PlotsRedux';

interface OwnProps {
  plot: SinglePlot;
  size: number;
  lastPlot: boolean;
}

interface StateProps {
  dataset: Dataset;
}

interface DispatchProps {
  removePlot: (plot: SinglePlot) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const Scatterplot: FC<Props> = ({
  plot,
  size,
  dataset,
  lastPlot,
  removePlot,
}: Props) => {
  const xAxisRef: RefObject<SVGGElement> = createRef();
  const yAxisRef: RefObject<SVGGElement> = createRef();

  const {x, y, color, id, brushes} = plot;
  const data = dataset.data.map(v => ({
    x: v[x],
    y: v[y],
    color: v[color],
  }));

  const padding = 50;

  const xScale = scaleLinear()
    .domain([min(data.map(d => d.x)), max(data.map(d => d.x))])
    .range([0, size - 2 * padding]);

  const yScale = scaleLinear()
    .domain([max(data.map(d => d.y)), min(data.map(d => d.y))])
    .range([0, size - 2 * padding]);

  const colorScale = scaleOrdinal()
    .domain([...new Set(data.map(d => d.color))])
    .range(schemeSet2);

  useEffect(() => {
    if (xAxisRef.current) {
      const xAxis = axisBottom(xScale);
      select(xAxisRef.current).call(xAxis);
    }
    if (yAxisRef.current) {
      const yAxis = axisLeft(yScale);
      select(yAxisRef.current).call(yAxis);
    }
  }, [size, xAxisRef, xScale, yAxisRef, yScale]);

  return (
    <g>
      <g transform={`translate(${padding}, ${padding})`}>
        <g className="axis">
          <g
            ref={xAxisRef}
            transform={`translate(0, ${xScale.range()[1]})`}
            className="x"></g>
          <g ref={yAxisRef} className="y"></g>
        </g>
        <g className="plot">
          {data.map((d, i) => (
            <circle
              key={i}
              fill={colorScale(d.color) as string}
              cx={xScale(d.x)}
              cy={yScale(d.y)}
              r={5}></circle>
          ))}
        </g>
      </g>
      <g className="close" transform={`translate(0, ${size - padding})`}>
        {!lastPlot && (
          <CloseCircle
            fill="red"
            r={10}
            onClick={() => removePlot(plot)}></CloseCircle>
        )}
      </g>
    </g>
  );
};

const mapStateToProps = (state: VisualizationState): StateProps => ({
  dataset: state.dataset,
});

const mapDispatchToProps = (): DispatchProps => ({
  removePlot: (plot: SinglePlot) => {
    VisualizationProvenance.apply(removePlot(plot));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Scatterplot);

const CloseCircle = styled('circle')`
  cursor: pointer;
`;
