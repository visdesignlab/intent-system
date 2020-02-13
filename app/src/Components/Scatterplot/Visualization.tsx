import React, {
  FC,
  useRef,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';
import IntentStore from '../../Store/IntentStore';
import {style} from 'typestyle';
import {inject, observer} from 'mobx-react';
import {ProvenanceActions} from '../../Store/Provenance';
import PlotsGrid from './PlotsGrid';
import {DataContext} from '../../App';
import {symbols, symbol} from 'd3';
import _ from 'lodash';

export interface Props {
  store?: IntentStore;
  actions: ProvenanceActions;
}

export type SymbolMap = {[key: string]: any};

export const SymbolContext = createContext<SymbolMap>({});

const Visualization: FC<Props> = ({store, actions}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({height: 0, width: 0});

  const {showCategories, categoryColumn} = store!;

  const data = useContext(DataContext);

  const symbolCount = symbols.length;

  const categorySymbolMap: SymbolMap = {};

  if (showCategories && data.categoricalColumns.includes(categoryColumn)) {
    _.chain(data.values)
      .map(d => d[categoryColumn])
      .uniq()
      .value()
      .forEach((val, idx) => {
        if (idx >= symbolCount) {
          categorySymbolMap[val] = symbol().type(symbols[symbolCount - 1]);
        } else {
          categorySymbolMap[val] = symbol().type(symbols[idx]);
        }
      });
  }

  useEffect(() => {
    const {height, width} = dims;
    const current = ref.current;
    if (current && height === 0 && width === 0) {
      if (current) {
        setDims({
          height: current.clientHeight,
          width: current.clientWidth,
        });
      }
    }
  }, [dims]);

  const {height, width} = dims;
  const adjustedHeight = height * 1;
  const adjustedWidth = width * 1;

  return (
    <div ref={ref} className={plotStyle}>
      <SymbolContext.Provider value={categorySymbolMap}>
        <PlotsGrid height={adjustedHeight} width={adjustedWidth} />
      </SymbolContext.Provider>
    </div>
  );
};

(Visualization as any).whyDidYouRender = true;
export default inject('store')(observer(Visualization));

const plotStyle = style({
  gridArea: 'plot',
});
