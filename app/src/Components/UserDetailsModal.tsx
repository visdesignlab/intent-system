import React, {FC} from 'react';
import {Modal, Container, Segment, Button} from 'semantic-ui-react';
import {getRandomUserCode} from '../Utils';
import {studyProvenance} from '..';
import Events from '../Stores/Types/EventEnum';
import {StudyState} from '../Stores/Study/StudyState';

interface OwnProps {
  temp?: string;
}

type Props = OwnProps;

const UserDetailsModal: FC<Props> = ({temp}: Props) => {
  const randomCode = getRandomUserCode();
  if (temp) console.log(temp);
  return (
    <Container textAlign="center">
      <Segment>Consent Letter</Segment>

      <Modal
        trigger={
          <Button primary>
            I have read the consent letter and agree to go forward with the
            study.
          </Button>
        }>
        <Modal.Header>Participant Details</Modal.Header>
        <Modal.Content>
          <p>
            You are randomly assigned the following code for duration of this
            study: <strong>{randomCode}</strong>
          </p>
          <p>Click Next to proceed with the study.</p>
          <Button
            positive
            onClick={() => {
              studyProvenance.applyAction({
                label: Events.SET_PARTICIPANT,
                action: () => {
                  let currentState = studyProvenance.graph().current.state;
                  if (currentState) {
                    currentState = {
                      ...currentState,
                      participant: {
                        uniqueId: randomCode,
                      },
                      event: Events.SET_PARTICIPANT,
                      eventTime: new Date(),
                    };
                  }

                  return currentState as StudyState;
                },
                args: [],
              });
            }}>
            Next
          </Button>
        </Modal.Content>
      </Modal>
    </Container>
  );
};

export default UserDetailsModal;
