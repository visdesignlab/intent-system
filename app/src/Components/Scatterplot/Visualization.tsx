import { symbol, symbols } from "d3";
import _ from "lodash";
import { inject, observer } from "mobx-react";
import React, {
  createContext,
  FC,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { style } from "typestyle";

import { DataContext } from "../../Contexts";
import IntentStore from "../../Store/IntentStore";
import Legend from "./Legend";
import PlotsGrid from "./PlotsGrid";

export interface Props {
  store?: IntentStore;
}

export type SymbolMap = { [key: string]: any };

export const SymbolContext = createContext<SymbolMap>({});

const Visualization: FC<Props> = ({ store }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ height: 0, width: 0 });
  const { height, width } = dims;
  const { showCategories, categoryColumn } = store!;

  const data = useContext(DataContext);

  const symbolCount = symbols.length;

  const categorySymbolMap: SymbolMap = {};

  if (showCategories && data.categoricalColumns.includes(categoryColumn)) {
    _.chain(data.values)
      .map((d) => d[categoryColumn])
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
    const current = ref.current;
      if (current) {
        setDims({
          height: current.clientHeight,
          width: current.clientWidth,
        });
      }
  }, [height, width]);

  let adjustedHeight = height * 1;
  let adjustedWidth = width * 1;
  // adjustedWidth = adjustedHeight = 1000;

  return (
    <div ref={ref} className={visStyle}>
      <SymbolContext.Provider value={categorySymbolMap}>
        <div className={legendStyle}>
          <Legend />
        </div>
        <div className={plotStyle}>
          <PlotsGrid height={adjustedHeight} width={adjustedWidth} />
        </div>
      </SymbolContext.Provider>
    </div>
  );
};

(Visualization as any).whyDidYouRender = true;
export default memo(inject("store")(observer(Visualization)));

const visStyle = style({
  gridArea: "vis",
  display: "grid",
  overflow: "hidden",
  gridTemplateRows: "min-content auto",
  gridTemplateAreas: `
    "legend"
    "plot"
    `,
});

const legendStyle = style({ gridArea: "legend" });
const plotStyle = style({
  gridArea: "plot",
  overflow: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
