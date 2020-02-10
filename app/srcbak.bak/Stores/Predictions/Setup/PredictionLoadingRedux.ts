import {Action, Reducer} from 'redux';

export const UPDATE_IS_LOADING = 'UPDATE_IS_LOADING';

export type UPDATE_IS_LOADING = typeof UPDATE_IS_LOADING;

export interface UpdatePredictionLoadingAction
  extends Action<UPDATE_IS_LOADING> {
  type: UPDATE_IS_LOADING;
  args: boolean;
}

export const updatePredictionLoading = (
  isLoading: boolean,
): UpdatePredictionLoadingAction => ({
  type: UPDATE_IS_LOADING,
  args: isLoading,
});

export const PredictionLoadingReducer: Reducer<
  boolean,
  UpdatePredictionLoadingAction
> = (current: boolean = false, action: UpdatePredictionLoadingAction) => {
  switch (action.type) {
    case UPDATE_IS_LOADING:
      return action.args;
    default:
      return current;
  }
};
