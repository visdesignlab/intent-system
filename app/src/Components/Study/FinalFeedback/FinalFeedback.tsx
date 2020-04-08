import React, { useCallback, useContext, useState } from 'react';
import { Container, Divider, Form, Header, Modal } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ConfigContext } from '../../../Contexts';
import { StudyActions } from '../../../Store/StudyStore/StudyProvenance';
import { FeedbackQuestionStructure, Questions, SectionHeader } from './FeedbackQuestions';
import LikertComponent from './LikertComponent';

type Props = {
  actions: StudyActions;
};

const redirectUrl = "https://app.prolific.co/submissions/complete?cc=6623E474";

const FinalFeedback = ({ actions }: Props) => {
  const config = useContext(ConfigContext);

  const arr = new Array(
    Questions.filter((d) => d.type === "Question").length
  ).fill(-1);
  const [finalFeedback, setFinalFeedback] = useState<number[]>(arr);
  const [feedbackText, setFeedbackText] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const setFeedback = useCallback((id: number, val: number) => {
    setFinalFeedback((feed) => {
      const newFeedback = [...feed];
      newFeedback[id] = val;
      return newFeedback;
    });
  }, []);

  if (config.coding === "yes")
    return (
      <div className={finalFeedbackStyle}>
        <Form>
          <Form.Field>
            Thank you for participating. Please share this code with the
            experimenter: {config.sessionId}
          </Form.Field>
        </Form>
      </div>
    );

  return (
    <div className={finalFeedbackStyle}>
      <Container style={{ paddingBottom: "2em" }}>
        <Form>
          {Questions.map((comp) => {
            if (comp.type === "Question") {
              const {
                question,
                lowText,
                highText,
                id,
              } = comp as FeedbackQuestionStructure;
              return (
                <LikertComponent
                  key={question}
                  question={question}
                  leftText={lowText}
                  rightText={highText}
                  count={5}
                  val={finalFeedback[id]}
                  id={id}
                  setFeedback={setFeedback}
                />
              );
            } else {
              const { header } = comp as SectionHeader;

              return (
                <Form.Field key={header}>
                  <Divider />
                  <Header as="h1" floated="left">
                    {header}
                  </Header>
                  <Divider clearing />
                </Form.Field>
              );
            }
          })}
          <Divider />
          <Form.Field as="h1">
            Please enter any other comments below.
          </Form.Field>
          <Form.TextArea
            value={feedbackText}
            onChange={(_, { value }) => {
              if (typeof value !== "string") return;
              setFeedbackText(value);
            }}
          />
          <Form.Button
            primary
            disabled={finalFeedback.includes(-1)}
            onClick={() => {
              actions.submitFinalFeedback(finalFeedback, feedbackText);
              window.onbeforeunload = function() {
                return;
              };
              setOpenModal(true);
            }}
          >
            Submit
          </Form.Button>
        </Form>
      </Container>
      <Modal open={openModal}>
        <Modal.Header>Congratulations!</Modal.Header>
        <Modal.Content>
          {/* Click on the following link to go back to Prolific and complete the
          study.
          <p>
            <a href={redirectUrl}>{redirectUrl}</a>
          </p> */}
          Thank you for participating. Please share this code with the
          experimenter: {config.sessionId}
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default FinalFeedback;

const finalFeedbackStyle = style({
  // height: "100vh",
  // width: "100vw",
  // display: "flex",
  // // alignItems: "center",
  // justifyContent: "center",
  // overflow: "scroll"
});
