import {Interaction, InteractionHistory} from '@visdesignlab/intent-contract';
import {Action, Reducer} from 'redux';

export const ADD_INTERACTION = 'ADD_INTERACTION';
export type ADD_INTERACTION = typeof ADD_INTERACTION;

interface AddInteractionAction extends Action<ADD_INTERACTION> {
  type: ADD_INTERACTION;
  args: Interaction;
}

export const addInteraction = (interaction: Interaction) => ({
  type: ADD_INTERACTION,
  args: interaction,
});

export const InteractionsReducer: Reducer<
  InteractionHistory,
  AddInteractionAction
> = (current: InteractionHistory = [], action: AddInteractionAction) => {
  switch (action.type) {
    case ADD_INTERACTION:
      return [...current, action.args];
    default:
      return current;
  }
};
