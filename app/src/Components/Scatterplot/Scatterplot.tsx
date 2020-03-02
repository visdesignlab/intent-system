import React, {
  FC,
  useRef,
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
  memo,
} from 'react';
import {inject, observer} from 'mobx-react';
import IntentStore from '../../Store/IntentStore';
import {style} from 'typestyle';
import {DataContext, ActionContext} from '../../App';
import {Plot} from '../../Store/IntentState';
import {scaleLinear} from 'd3';
import translate from '../../Utils/Translate';
import RawPlot from './RawPlot';
import {Button, Input, Menu, Header} from 'semantic-ui-react';
import {UserSelections} from '../Predictions/PredictionRowType';
import {Data} from '../../Utils/Dataset';

export interface Props {
  store?: IntentStore;
  height: number;
  width: number;
  plot: Plot;
  selections: UserSelections;
}

export const FreeFromRadiusContext = createContext<number>(20);

const Scatterplot: FC<Props> = ({
  width,
  height,
  plot,
  store,
  selections,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const data = useContext(DataContext);
  const actions = useContext(ActionContext);

  const minBrushRange = 20;
  const maxBrushRange = 100;

  const [freeFormBrushRadius, setFreeFormBrushRadius] = useState(20);

  const {categoryColumn, plots, brushType} = store!;

  const [dim, setDim] = useState({height: 0, width: 0});

  useEffect(() => {
    const {height, width} = dim;
    const {current} = svgRef;
    if (current && height === 0 && width === 0) {
      const size = current.getBoundingClientRect();
      setDim({height: size.height, width: size.width});
    }
  }, [dim]);

  let reducePercentage = 0.9;

  if (plots.length > 1) reducePercentage = 0.85;
  if (plots.length > 2) reducePercentage = 0.75;

  const adjustedWidth = dim.width * reducePercentage;
  const adjustedHeight = dim.height * reducePercentage;
  const xPadding = (dim.width - adjustedWidth) / 2;
  const yPadding = (dim.height - adjustedHeight) / 2;

  const {x, y} = plot;

  const dataString = JSON.stringify(data);

  const xyData = useMemo(() => {
    const data: Data = JSON.parse(dataString);

    return data.values.map(d => ({
      x: d[x],
      y: d[y],
      category: categoryColumn ? d[categoryColumn] : null,
    }));
  }, [dataString, categoryColumn, x, y]);

  const [xMin, xMax] = [
    Math.min(...xyData.map(d => d.x)),
    Math.max(...xyData.map(d => d.x)),
  ];

  const [yMin, yMax] = [
    Math.min(...xyData.map(d => d.y)),
    Math.max(...xyData.map(d => d.y)),
  ];

  const xScale = useMemo(() => {
    return scaleLinear()
      .domain([xMin, xMax])
      .range([0, adjustedWidth])
      .nice();
  }, [adjustedWidth, xMax, xMin]);

  const yScale = useMemo(() => {
    return scaleLinear()
      .domain([yMax, yMin])
      .range([0, adjustedHeight])
      .nice();
  }, [adjustedHeight, yMax, yMin]);

  return (
    <div className={surroundDiv} style={{height, width}}>
      <Menu className={brushButtonStyle} borderless fluid secondary size="mini">
        <Menu.Item className={itemStyle}>
          <Button.Group size="mini">
            <Button
              icon="square outline"
              content="Rectangular"
              disabled={brushType === 'Rectangular'}
              onClick={() => actions.changeBrushType('Rectangular')}
            />
            <Button.Or />
            <Button
              icon="magic"
              content="Freeform"
              disabled={brushType === 'Freeform'}
              onClick={() => actions.changeBrushType('Freeform')}
            />
          </Button.Group>
        </Menu.Item>
        {brushType === 'Freeform' && (
          <>
            <Menu.Item className={itemStyle}>
              <Input
                type="range"
                min={minBrushRange}
                max={maxBrushRange}
                step={1}
                value={freeFormBrushRadius}
                onChange={(_, data) => {
                  setFreeFormBrushRadius(parseInt(data.value) || 0);
                }}
              />
            </Menu.Item>
            <Menu.Item className={itemStyle}>
              <Header>Brush Size: </Header> {freeFormBrushRadius}
            </Menu.Item>
          </>
        )}
        {plots.length > 1 && (
          <Menu.Menu position="right">
            <Menu.Item className={itemStyle}>
              <Button
                icon="close"
                onClick={() => actions.removePlot(plot)}
                size="mini"
                negative
                compact
                className={closeButtonStyle}
              />
            </Menu.Item>
          </Menu.Menu>
        )}
      </Menu>
      <svg className={svgStyle} ref={svgRef}>
        <rect height={dim.height} width={dim.width} fill="#ccc" opacity="0.1" />
        <FreeFromRadiusContext.Provider value={freeFormBrushRadius}>
          <RawPlot
            plot={plot}
            height={adjustedHeight}
            width={adjustedWidth}
            data={xyData}
            transform={translate(xPadding, yPadding)}
            xScale={xScale}
            yScale={yScale}
            selections={selections}
          />
        </FreeFromRadiusContext.Provider>
      </svg>
    </div>
  );
};

export default memo(inject('store')(observer(Scatterplot)));

const surroundDiv = style({
  padding: '1em',
  position: 'relative',
});

const svgStyle = style({
  height: '100%',
  width: '100%',
});

const closeButtonStyle = style({
  opacity: 0.4,
  transition: 'opacity 0.5s',
  $nest: {
    '&:hover': {
      opacity: 1,
      transition: 'opacity 0.5s',
    },
  },
});

const brushButtonStyle = style({
  position: 'absolute',
  left: 0,
  top: 0,
});

const itemStyle = style({
  paddingTop: '0 !important',
  paddingBottom: '0 !important',
});
