import {Action, Reducer} from 'redux';
import ParticipantDetails from '../../Types/ParticipantDetails';
import {recordableReduxActionCreator} from '@visdesignlab/provenance-lib-core/lib/src';

export const UPDATE_PARTICIPANT = 'UPDATE_PARTICIPANT';
export type UPDATE_PARTICIPANT = typeof UPDATE_PARTICIPANT;

interface ParticipantUpdateAction extends Action<UPDATE_PARTICIPANT> {
  type: UPDATE_PARTICIPANT;
  args: ParticipantDetails;
}

const dummyParticipant: ParticipantDetails = {
  name: 'UNKNOWN',
};

export const updateParticipant = (participant: ParticipantDetails) =>
  recordableReduxActionCreator(
    'Participant Update',
    UPDATE_PARTICIPANT,
    participant,
  );

export const ParticipantDetailsReducer: Reducer<
  ParticipantDetails,
  ParticipantUpdateAction
> = (
  current: ParticipantDetails = dummyParticipant,
  action: ParticipantUpdateAction,
) => {
  switch (action.type) {
    case UPDATE_PARTICIPANT:
      console.log(action.args, 'Test');
      return action.args;
    default:
      return current;
  }
};
