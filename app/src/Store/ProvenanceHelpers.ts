import { VisualizationType } from '../contract';
import { ExtendedBrush, IntentState, Plot } from './IntentState';

export function addDummyInteraction(state: IntentState) {
  state.interactionHistory.push(null as any);
}

export function addPointSelectionInteraction(
  state: IntentState,
  plot: Plot,
  points: number[]
) {
  state.interactionHistory.push({
    visualizationType: VisualizationType.Scatterplot,
    interactionType: {
      kind: "selection",
      plot: {
        id: plot.id,
        x: plot.x,
        y: plot.y,
        color: state.categoryColumn
      },
      dimensions: [plot.x, plot.y],
      dataIds: points
    }
  });
}

export function addInvertSelectionInteraction(
  state: IntentState,
  points: number[]
) {
  state.interactionHistory = [];
  state.plots.forEach(plot => addPlotInteraction(state, plot));
  addPointSelectionInteraction(state, state.plots[0], points);
}

export function clearSelectionInteraction(state: IntentState) {
  state.interactionHistory = [];
  state.plots.forEach(plot => addPlotInteraction(state, plot));
}

export function removePointSelectionInteraction(
  state: IntentState,
  plot: Plot,
  points: number[]
) {
  state.interactionHistory.push({
    visualizationType: VisualizationType.Scatterplot,
    interactionType: {
      kind: "deselection",
      plot: {
        id: plot.id,
        x: plot.x,
        y: plot.y,
        color: state.categoryColumn
      },
      dimensions: [plot.x, plot.y],
      dataIds: points
    }
  });
}

export function brushInteraction(
  state: IntentState,
  plot: Plot,
  affectedBrush: ExtendedBrush
) {
  state.interactionHistory.push({
    visualizationType: VisualizationType.Scatterplot,
    interactionType: {
      brushId: affectedBrush.id,
      left: affectedBrush.extents.x1,
      right: affectedBrush.extents.x2,
      top: affectedBrush.extents.y1,
      bottom: affectedBrush.extents.y2,
      dimensions: [plot.x, plot.y],
      dataIds: affectedBrush.points,
      plot: {
        id: plot.id,
        x: plot.x,
        y: plot.y,
        color: state.categoryColumn
      }
    }
  });
}

export function removeBrushInteraction(
  state: IntentState,
  plot: Plot,
  affectedBrush: ExtendedBrush
) {
  brushInteraction(state, plot, {
    ...affectedBrush,
    extents: {
      x1: null as any,
      x2: null as any,
      y1: null as any,
      y2: null as any
    },
    points: []
  });
}

export function addPlotInteraction(state: IntentState, plot: Plot) {
  state.interactionHistory.push({
    visualizationType: VisualizationType.Scatterplot,
    interactionType: {
      kind: "ADD",
      plot: {
        id: plot.id,
        x: plot.x,
        y: plot.y,
        color: state.categoryColumn
      }
    }
  });
}

export function removePlotInteraction(state: IntentState, plot: Plot) {
  const points = plot.selectedPoints;
  if (points.length > 0) {
    removePointSelectionInteraction(state, plot, points);
  }

  const brushes = Object.values(plot.brushes);
  if (brushes.length > 0) {
    brushes.forEach(affectedBrush => {
      removeBrushInteraction(state, plot, affectedBrush);
    });
  }

  state.interactionHistory.push({
    visualizationType: VisualizationType.Scatterplot,
    interactionType: {
      kind: "REMOVE",
      plot: {
        id: plot.id,
        x: plot.x,
        y: plot.y,
        color: state.categoryColumn
      }
    }
  });
}
