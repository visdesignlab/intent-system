import { Action, Reducer } from "redux";

export interface BrushArea {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface BrushID {
  space: string;
  key: string;
}

export interface Brush extends BrushID {
  brushArea: BrushArea;
  selectedIndices: number[];
}

export type BrushDictionary = { [key: string]: Brush[] };

export enum ScatterPlotBrushActions {
  ADD_BRUSH = "ADD_BRUSH",
  UPDATE_BRUSH = "UPDATE_BRUSH",
  REMOVE_BRUSH = "REMOVE_BRUSH"
}

export interface BrushAction extends Action<ScatterPlotBrushActions> {
  type: ScatterPlotBrushActions;
  args:
    | Brush
    | BrushArea
    | BrushID
    | [BrushID, BrushArea]
    | [BrushID, BrushArea, number[]];
}

export const ScatterPlotBrushActionsReducer: Reducer<
  BrushDictionary,
  BrushAction
> = (current: BrushDictionary = {} as any, action: BrushAction) => {
  switch (action.type) {
    case ScatterPlotBrushActions.ADD_BRUSH:
      const arg = action.args as Brush;
      if (!current[arg.space]) current[arg.space] = [];
      current[arg.space].push(arg);
      const newDictionary = { ...current };
      return newDictionary;
    case ScatterPlotBrushActions.REMOVE_BRUSH:
      const { space, key } = action.args as BrushID;
      current[space] = current[space].filter(br => br.key !== key);
      return { ...current };
    case ScatterPlotBrushActions.UPDATE_BRUSH:
      const [id, area, selectedIndices] = action.args as [
        BrushID,
        BrushArea,
        number[]
      ];
      current[id.space].forEach(br => {
        if (br.key === id.key) {
          br.brushArea = area;
          br.selectedIndices = selectedIndices;
        }
      });
      return { ...current };
    default:
      return current;
  }
};
