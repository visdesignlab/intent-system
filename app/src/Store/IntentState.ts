export type MultiBrushBehaviour = 'Union' | 'Intersection';

export interface IntentState {
  dataset: string;
  multiBrushBehaviour: MultiBrushBehaviour;
}

export const defaultState: IntentState = {
  dataset: '',
  multiBrushBehaviour: 'Intersection',
};
