import { BrushCollection } from "../../Components/Brush/Types/Brush";

export type Plots = SinglePlot[];

export interface SinglePlot {
  id: string;
  x: string;
  y: string;
  color: string;
  brushes: BrushCollection;
  selectedPoints: number[];
}
