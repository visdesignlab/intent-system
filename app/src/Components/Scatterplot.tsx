import React, {FC, useEffect, RefObject, createRef, useState} from 'react';
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
import {Popup} from 'semantic-ui-react';
import BrushComponent from './Brush/Components/BrushComponent';

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

  const [mouseIsDown, setMouseIsDown] = useState(false);

  const padding = 50;
  const paddedSize = size - 2 * padding;
  const xScale = scaleLinear()
    .domain([min(data.map(d => d.x)), max(data.map(d => d.x))])
    .range([0, paddedSize]);

  const yScale = scaleLinear()
    .domain([max(data.map(d => d.y)), min(data.map(d => d.y))])
    .range([0, paddedSize]);

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

  const BrushLayer = (
    <g
      onMouseDown={() => setMouseIsDown(true)}
      onMouseUp={() => setMouseIsDown(false)}
      onMouseOut={() => setMouseIsDown(false)}>
      <BrushComponent
        extents={{
          left: -5,
          top: -5,
          right: paddedSize + 5,
          bottom: paddedSize + 5,
        }}
        onBrushUpdate={(brushes, affectedBrush, affectType) => {
          console.log(brushes, affectedBrush, affectType);
        }}
      />
    </g>
  );

  const MarksLayer = (
    <g style={{pointerEvents: mouseIsDown ? 'none' : 'all'}} className="marks">
      {data.map((d, i) => (
        <Popup
          key={i}
          trigger={
            <circle
              fill={colorScale(d.color) as string}
              cx={xScale(d.x)}
              cy={yScale(d.y)}
              r={5}></circle>
          }
          content={
            <div>
              <h1>{dataset.data[i].country}</h1>
              <pre>{JSON.stringify(dataset.data[i], null, 2)}</pre>
            </div>
          }></Popup>
      ))}
    </g>
  );

  const [first, second] = [BrushLayer, MarksLayer];

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
          {first}
          {second}
        </g>
      </g>
      <g className="close" transform={`translate(0, ${size - padding})`}>
        {!lastPlot && (
          <CloseCircle
            fill="red"
            r={10}
            onClick={() => removePlot(plot)}></CloseCircle>
        )}
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
