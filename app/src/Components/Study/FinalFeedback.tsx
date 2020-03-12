import React from 'react';
import { Form } from 'semantic-ui-react';
import { style } from 'typestyle';

const FinalFeedback = () => {
  const scores = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className={finalFeedbackStyle}>
      <Form>
        <Form.Field>
          <label>Test</label>
          <Form.Input></Form.Input>
        </Form.Field>
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
