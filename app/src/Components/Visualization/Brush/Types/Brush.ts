export interface Brush {
  id: string;
  extents: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export type BrushCollection = {[key: string]: Brush};

export enum BrushAffectType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  CHANGE = 'CHANGE',
}
