import {Action, Reducer} from 'redux';
import ParticipantDetails from '../../Types/ParticipantDetails';

export const UPDATE_PARTICIPANT = 'UPDATE_PARTICIPANT';
export type UPDATE_PARTICIPANT = typeof UPDATE_PARTICIPANT;

interface ParticipantUpdateAction extends Action<UPDATE_PARTICIPANT> {
  type: UPDATE_PARTICIPANT;
  args: ParticipantDetails;
}

const dummyParticipant: ParticipantDetails = {
  name: 'UNKNOWN',
};

export const updateParticipant = (
  participant: ParticipantDetails,
): ParticipantUpdateAction => ({
  type: UPDATE_PARTICIPANT,
  args: participant,
});

export const ParticipantDetailsReducer: Reducer<
  ParticipantDetails,
  ParticipantUpdateAction
> = (
  current: ParticipantDetails = dummyParticipant,
  action: ParticipantUpdateAction,
) => {
  switch (action.type) {
    case UPDATE_PARTICIPANT:
      return action.args;
    default:
      return current;
  }
};
