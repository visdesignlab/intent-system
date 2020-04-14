import React, { FC, useContext, useState } from 'react';
import { Button, Image, List, Modal } from 'semantic-ui-react';

import { StudyActionContext } from '../../Contexts';

type Props = {
  manual?: boolean;
  secondTime?: boolean;
};

const Instructions: FC<Props> = ({
  manual = false,
  secondTime = false
}: Props) => {
  const [showModal, setShowModal] = useState(true);
  const { actions } = useContext(StudyActionContext);

  const supportedContent = (
    <>
      <Modal.Header>
        {secondTime
          ? "We are ready to begin the study with COMPUTER SUPPORTED MODE."
          : "We will now train for tasks in COMPUTER SUPPORTED MODE."}
      </Modal.Header>
      <Modal.Content>
        <List bulleted>
          <List.Item>
            After the first selection, predictions appear on the screen as show
            below.
          </List.Item>
          <List.Item>
            After the first selection, predictions appear on the screen as show
            below. The top three predictions pop-up near your mouse cursor on
            the scatterplot; on the right of the scatterplot, there is a
            complete list of predictions.
          </List.Item>
          <List.Item>
            Hovering on the prediction highlights the points which are part of
            the prediction; clicking on the prediction selects them. You can use
            the predictions to speed up or improve your selection.
          </List.Item>
          <List.Item>
            Hovering on the prediction highlights the points which are part of
            the prediction; clicking on the prediction selects them. You can use
            the predictions to improve your selection or directly submit if you
            feel your original selection is a better fit for the answer.
          </List.Item>
        </List>
      </Modal.Content>
      {showModal && (
        <Modal.Content>
          <Image src="/imgs/supported_prediction.gif" />
        </Modal.Content>
      )}
    </>
  );

  const manualContent = (
    <>
      <Modal.Header>
        {secondTime
          ? "We are ready to begin the study with USER DRIVEN MODE."
          : "We will now train for tasks in USER DRIVEN MODE."}{" "}
      </Modal.Header>
      <Modal.Content>
        <List bulleted>
          <List.Item>
            Please select the patterns as described in the task instruction.
          </List.Item>
          <List.Item>
            You will use your best judgement while making these selections.
          </List.Item>
        </List>
      </Modal.Content>
    </>
  );

  return (
    <Modal open={showModal} dimmer="blurring">
      {manual ? manualContent : supportedContent}
      <Modal.Actions>
        <Button
          positive
          onClick={() => {
            actions.acceptedInstructions(manual ? "Manual" : "Supported");
            setShowModal(false);
          }}
        >
          Proceed to task
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Instructions;
