import {BrushCollection} from '@bit/kirangadhave.multi_brush_component.brush';

export type Plots = SinglePlot[];

export interface SinglePlot {
  id: string;
  x: string;
  y: string;
  color: string;
  brushes: BrushCollection;
}
