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
  schemeSet3,
  schemeSet2,
  axisBottom,
  select,
  axisLeft,
} from 'd3';

interface OwnProps {
  plot: SinglePlot;
  size: number;
}

interface StateProps {
  dataset: Dataset;
}

interface DispatchProps {}

type Props = OwnProps & StateProps & DispatchProps;

const Scatterplot: FC<Props> = ({plot, size, dataset}: Props) => {
  const xAxisRef: RefObject<SVGGElement> = createRef();
  const yAxisRef: RefObject<SVGGElement> = createRef();

  const {x, y, color, id, brushes} = plot;
  const data = dataset.data.map(v => ({
    x: v[x],
    y: v[y],
    color: v[color],
  }));

  const padding = 10;

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
  }, [plot.x, plot.y, size]);

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
    </g>
  );
};

const mapStateToProps = (state: VisualizationState): StateProps => ({
  dataset: state.dataset,
});

export default connect(mapStateToProps)(Scatterplot);
