import {Action, Reducer} from 'redux';
import {recordableReduxActionCreator} from '@visdesignlab/provenance-lib-core/lib/src';
import {
  Interaction,
  InteractionHistory,
  MultiBrushBehavior,
  PredictionRequest,
} from '../../../contract';
import axios from 'axios';
import {datasetName, studyProvenance, AppStore} from '../../..';
import {updatePredictions} from '../../Predictions/Setup/PredictionRedux';
import {updatePredictionLoading} from '../../Predictions/Setup/PredictionLoadingRedux';
import Events from '../../Types/EventEnum';
import {StudyState} from '../../Study/StudyState';

export const ADD_INTERACTION = 'ADD_INTERACTION';
export type ADD_INTERACTION = typeof ADD_INTERACTION;

export const UPDATE_INTERACTION_HISTORY = 'UPDATE_INTERACTION_HISTORY';
export type UPDATE_INTERACTION_HISTORY = typeof UPDATE_INTERACTION_HISTORY;

export interface AddInteractionAction extends Action<ADD_INTERACTION> {
  type: ADD_INTERACTION;
  args: {
    interaction: Interaction;
    multiBrushBehavior: MultiBrushBehavior;
  };
}

export interface UpdateInteractionHistoryAction
  extends Action<UPDATE_INTERACTION_HISTORY> {
  type: UPDATE_INTERACTION_HISTORY;
  args: {
    interaction: Interaction[];
    multiBrushBehavior: MultiBrushBehavior;
  };
}

export const addInteraction = (interaction: Interaction) =>
  recordableReduxActionCreator('Add Interaction', ADD_INTERACTION, interaction);

let cancel: any;

let previousPredictionRequest: PredictionRequest = {
  multiBrushBehavior: MultiBrushBehavior.UNION,
  interactionHistory: [],
};

export function getPredictionAfterBrushSwitch(
  multiBrushBehavior: MultiBrushBehavior,
) {
  previousPredictionRequest.multiBrushBehavior = multiBrushBehavior;
  getPredictions(previousPredictionRequest);
}

export function getPredictions(request: PredictionRequest) {
  previousPredictionRequest = request;
  cancel && cancel();

  const interactions = request.interactionHistory;

  console.log(request);

  setTimeout(() => {
    AppStore.dispatch(updatePredictionLoading(true));

    axios
      .post(`/dataset/${datasetName}/predict`, request, {
        cancelToken: new axios.CancelToken(c => (cancel = c)),
      })
      .then(response => {
        AppStore.dispatch(updatePredictions(response.data));
        AppStore.dispatch(updatePredictionLoading(false));
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          AppStore.dispatch(updatePredictionLoading(false));
          console.log(err);
        }
      });

    studyProvenance.applyAction({
      label: Events.ADD_INTERACTION,
      action: () => {
        let currentState = studyProvenance.graph().current.state;
        if (currentState) {
          currentState = {...currentState, interactions};
        }
        return currentState as StudyState;
      },
      args: [],
    });
  });
}

export type InteractionActions =
  | AddInteractionAction
  | UpdateInteractionHistoryAction;

export const InteractionsReducer: Reducer<
  InteractionHistory,
  InteractionActions
> = (current: InteractionHistory = [], action: InteractionActions) => {
  let interactions: Interaction[] = [];
  let request: PredictionRequest = {
    multiBrushBehavior: MultiBrushBehavior.UNION,
    interactionHistory: [],
  };
  switch (action.type) {
    case ADD_INTERACTION:
      interactions = [...current, action.args.interaction];
      request = {
        multiBrushBehavior: action.args.multiBrushBehavior,
        interactionHistory: interactions,
      };

      getPredictions(request);

      return interactions;
    case UPDATE_INTERACTION_HISTORY:
      interactions = [...action.args.interaction];
      request = {
        multiBrushBehavior: action.args.multiBrushBehavior,
        interactionHistory: interactions,
      };

      getPredictions(request);
      return interactions;
    default:
      return current;
  }
};
