import { BrushBehavior } from "d3";

export interface Brush {
  id: string;
  brush: BrushBehavior<unknown>;
  selectedPoints: number[];
  extents: number[][];
}

export type BrushDictionary = { [key: string]: Brush[] };
