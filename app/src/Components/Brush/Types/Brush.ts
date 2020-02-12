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

// export type BrushAffectType = "Add" | "Remove" | "Change" |
export enum BrushAffectType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  CHANGE = 'CHANGE',
  REMOVE_ALL = 'REMOVE_ALL',
}
