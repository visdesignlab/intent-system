import {Reducer, Action} from 'redux';

export const CHANGE_HIDE_ZERO = 'CHANGE_HIDE_ZERO';
export type CHANGE_HIDE_ZERO = typeof CHANGE_HIDE_ZERO;

export interface ChangeHideZeroAction extends Action<CHANGE_HIDE_ZERO> {
  type: CHANGE_HIDE_ZERO;
  args: boolean;
}

export const toggleHideZero = (hide: boolean): ChangeHideZeroAction => ({
  type: CHANGE_HIDE_ZERO,
  args: hide,
});

export const HideZeroPredictionsReducer: Reducer<
  boolean,
  ChangeHideZeroAction
> = (current: boolean = false, action: ChangeHideZeroAction) => {
  switch (action.type) {
    case CHANGE_HIDE_ZERO:
      return action.args;
    default:
      return current;
  }
};
