import React, { FC, useState } from 'react';
import { Button, Image, List, Modal } from 'semantic-ui-react';

type Props = {
  manual?: boolean;
};

const Instructions: FC<Props> = ({ manual = false }: Props) => {
  const [showModal, setShowModal] = useState(true);

  const supportedContent = (
    <>
      <Modal.Header>
        You are doing tasks in computer supported mode now.
      </Modal.Header>
      <Modal.Content>
        <List bulleted>
          <List.Item>
            After the first selection, predictions appear on the screen as show
            below.
          </List.Item>
          <List.Item>
            The top three predictions pop-up near your mouse cursor on the
            scatterplot; on the left of the scatterplot, there is a complete
            list of predictions.
          </List.Item>
          <List.Item>
            Hovering on the prediction highlights the points which are part of
            the prediction; clicking on the prediction selected them. You can
            use the predictions to improve your selection or directly submit if
            you feel your original selection is a better fit for the answer.
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
        You are doing tasks without computer support now.
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
        <Button positive onClick={() => setShowModal(false)}>
          Proceed to task
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Instructions;
