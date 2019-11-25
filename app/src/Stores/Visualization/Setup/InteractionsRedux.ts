import {Action, Reducer} from 'redux';
import {recordableReduxActionCreator} from '@visdesignlab/provenance-lib-core/lib/src';
import {
  Interaction,
  InteractionHistory,
  MultiBrushBehavior,
  PredictionRequest,
} from '../../../contract';
import axios from 'axios';
import {datasetName, predictionStore, studyProvenance} from '../../..';
import {updatePredictions} from '../../Predictions/Setup/PredictionRedux';
import {updatePredictionLoading} from '../../Predictions/Setup/PredictionLoadingRedux';
import Events from '../../Types/EventEnum';
import {StudyState} from '../../Study/StudyState';

export const ADD_INTERACTION = 'ADD_INTERACTION';
export type ADD_INTERACTION = typeof ADD_INTERACTION;

export interface AddInteractionAction extends Action<ADD_INTERACTION> {
  type: ADD_INTERACTION;
  args: {
    interaction: Interaction;
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

  predictionStore.dispatch(updatePredictionLoading(true));
  axios
    .post(`/dataset/${datasetName}/predict`, request, {
      cancelToken: new axios.CancelToken(c => (cancel = c)),
    })
    .then(response => {
      predictionStore.dispatch(updatePredictions(response.data));
      predictionStore.dispatch(updatePredictionLoading(false));
    })
    .catch(err => {
      if (!axios.isCancel(err)) {
        predictionStore.dispatch(updatePredictionLoading(false));
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
}

export const InteractionsReducer: Reducer<
  InteractionHistory,
  AddInteractionAction
> = (current: InteractionHistory = [], action: AddInteractionAction) => {
  switch (action.type) {
    case ADD_INTERACTION:
      const interactions = [...current, action.args.interaction];
      const request: PredictionRequest = {
        multiBrushBehavior: action.args.multiBrushBehavior,
        interactionHistory: interactions,
      };

      getPredictions(request);

      return interactions;
    default:
      return current;
  }
};
