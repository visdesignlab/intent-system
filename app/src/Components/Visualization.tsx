import React, {FC, useState, useCallback} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Dataset} from '../Stores/Types/Dataset';
import {Plots} from '../Stores/Types/Plots';
import Scatterplot from './Scatterplot';
import Legend from './Legend';
import {scaleOrdinal, schemeSet2, symbols, symbol} from 'd3';
import {pure} from 'recompose';
import _ from 'lodash';
import {AppState} from '../Stores/CombinedStore';

export enum PointSelectionEnum {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

interface OwnProps {
  showCategories: boolean;
  isSubmitted: boolean;
  clearAllHandlerSetup: (handler: () => void) => void;
  selectedCategory: string;
}

interface StateProps {
  dataset: Dataset;
  plots: Plots;
}

interface DispatchProps {}

type Props = OwnProps & DispatchProps & StateProps;

const Visualization: FC<Props> = ({
  isSubmitted,
  showCategories,
  dataset,
  plots,
  clearAllHandlerSetup,
  selectedCategory,
}: Props) => {
  const [dimensions, setDimensions] = useState<{
    height: number;
    width: number;
  }>({height: -1, width: -1});

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

  const breakCount = 3;
  const actualCount = plots.length;

  let rowCount = Math.floor(actualCount / breakCount);
  if (rowCount === 0) {
    rowCount += 1;
  } else if (actualCount > breakCount && actualCount % breakCount !== 0) {
    rowCount += 1;
  }

  const columnCount = actualCount >= 3 ? 3 : actualCount;
  const dividedHeight = height / rowCount;
  const dividedWidth = width / columnCount;

  const plotDimension =
    dividedWidth < dividedHeight ? dividedWidth : dividedHeight;

  const totalHeight = plotDimension * rowCount;
  const totalWidth = plotDimension * columnCount;

  const xPosGen = getNextXPosition(breakCount);

  const uniqueValues = _.chain(dataset.data)
    .map(n => n[dataset.categoricalColumns[0]])
    .uniq()
    .value();

  const colorScale = scaleOrdinal()
    .domain(uniqueValues)
    .range(schemeSet2);

  const clearBrushDictionary: {[key: string]: () => void} = {};

  function clearAllBrushes() {
    Object.values(clearBrushDictionary).forEach(handler => handler());
  }

  clearAllHandlerSetup(clearAllBrushes);

  function clearBrushDictionarySetup(plotid: string, handler: () => void) {
    clearBrushDictionary[plotid] = handler;
  }

  const totalSymbolCount = symbols.length;

  const categorySymbolMap: any = {};

  _.chain(dataset.data)
    .map(n => n[selectedCategory])
    .uniq()
    .value()
    .forEach((val, idx) => {
      if (idx >= totalSymbolCount) {
        categorySymbolMap[val] = symbol()
          .type(symbols[totalSymbolCount - 1])
          .size(80)();
      } else
        categorySymbolMap[val] = symbol()
          .type(symbols[idx])
          .size(80)();
    });

  return (
    <MainSvg ref={measuredRef}>
      {showCategories && (
        <g transform={`translate(${margin}, 0)`}>
          <Legend
            colorScale={colorScale}
            height={margin}
            width={width}
            values={uniqueValues}
            categorySymbolMap={categorySymbolMap}
          />
        </g>
      )}
      <g transform={`translate(${margin}, ${margin})`}>
        {height >= 0 && width >= 0 && (
          <>
            {false && (
              <BorderRectangle width={width} height={height}></BorderRectangle>
            )}
            <g
              transform={`translate(${width / 2 - totalWidth / 2}, ${height /
                2 -
                totalHeight / 2})`}>
              {plots.map((plot, i) => {
                const xPos = plotDimension * xPosGen();

                const otherPlots = plots.filter(p => p.id !== plot.id);

                return (
                  <g
                    key={`${plot.id} ${i}`}
                    transform={`translate(${xPos}, ${plotDimension *
                      Math.floor(i / breakCount)})`}>
                    <rect
                      height={plotDimension}
                      width={plotDimension}
                      fill="none"
                      opacity={0}
                      stroke="red"></rect>
                    <Scatterplot
                      plot={plot}
                      categorySymbolMap={categorySymbolMap}
                      clearBrushDictionarySetup={clearBrushDictionarySetup}
                      otherPlots={otherPlots}
                      size={plotDimension}
                      showCategories={showCategories}
                      lastPlot={plots.length === 1}
                      markSize={`${0.35 / rowCount}em`}
                      selectedCategory={selectedCategory}
                      colorScale={colorScale}></Scatterplot>
                  </g>
                );
              })}
            </g>
          </>
        )}
        )
      </g>
      {isSubmitted && (
        <rect
          height={dimensions.height}
          width={dimensions.width}
          fill="none"
          pointerEvents="all"></rect>
      )}
    </MainSvg>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  dataset: state.dataset,
  plots: state.plots,
});

export default connect(mapStateToProps)(pure(Visualization));

const MainSvg = styled('svg')`
  width: 100%;
  height: 100%;
`;

const BorderRectangle = styled('rect')`
  fill: none;
  stroke: black;
  stroke-width: 1px;
  opacity: 0.4;
`;

function getNextXPosition(breakCount: number) {
  let pos = 0;

  return () => {
    const currPos = pos;
    pos += 1;
    if (pos >= breakCount) pos = 0;
    return currPos;
  };
}
