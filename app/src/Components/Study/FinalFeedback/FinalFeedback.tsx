import React, { useContext } from 'react';
import { Form } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ConfigContext } from '../../../Contexts';
import { Questions } from './FeedbackQuestions';
import LikertComponent from './LikertComponent';

const FinalFeedback = () => {
  const scores = [1, 2, 3, 4, 5, 6, 7];
  const config = useContext(ConfigContext);

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
      <Form>
        {Questions.map(({ question, lowText, highText }) => (
          <LikertComponent
            key={question}
            question={question}
            leftText={lowText}
            rightText={highText}
            count={5}
          />
        ))}
      </Form>
    </div>
  );
};

export default FinalFeedback;

const finalFeedbackStyle = style({
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});
