import {Action, Reducer} from 'redux';
import {SinglePlot, Plots} from '../../Types/Plots';
import {recordableReduxActionCreator} from '@visdesignlab/provenance-lib-core/lib/src';
import {VisualizationStore, VisualizationProvenance} from '../../..';
import {ADD_INTERACTION} from './InteractionsRedux';

export const ADD_PLOT = 'ADD_PLOT';
export const REMOVE_PLOT = 'REMOVE_PLOT';
export const UPDATE_PLOT = 'UPDATE_PLOT';

export type ADD_PLOT = typeof ADD_PLOT;
export type REMOVE_PLOT = typeof REMOVE_PLOT;
export type UPDATE_PLOT = typeof UPDATE_PLOT;

interface AddPlotAction extends Action<ADD_PLOT> {
  type: ADD_PLOT;
  args: SinglePlot;
}

interface UpdatePlotAction extends Action<UPDATE_PLOT> {
  type: UPDATE_PLOT;
  args: SinglePlot;
}

interface RemovePlotAction extends Action<REMOVE_PLOT> {
  type: REMOVE_PLOT;
  args: SinglePlot;
}

export type PlotAction = AddPlotAction | UpdatePlotAction | RemovePlotAction;

export const addPlot = (plot: SinglePlot) => (dispatch: any, getState: any) => {
  VisualizationProvenance.apply(
    recordableReduxActionCreator(`Add Plot: ${plot.id}`, ADD_PLOT, plot),
  );
  dispatch({
    type: ADD_INTERACTION,
    args: {} as any,
  });
  console.log(getState());
};

export const updatePlot = (plot: SinglePlot) =>
  recordableReduxActionCreator(`Update Plot: ${plot.id}`, UPDATE_PLOT, plot);

export const removePlot = (plot: SinglePlot) =>
  recordableReduxActionCreator(`Remove Plot: ${plot.id}`, REMOVE_PLOT, plot);

export const PlotsReducer: Reducer<Plots, PlotAction> = (
  current: Plots = [],
  action: PlotAction,
) => {
  switch (action.type) {
    case ADD_PLOT:
      return [...current, action.args];
    case UPDATE_PLOT:
      const idx = current.findIndex(d => d.id === action.args.id);
      current[idx] = action.args;
      return [...current];
    case REMOVE_PLOT:
      return current.filter(plot => plot.id !== action.args.id);
    default:
      return current;
  }
};
