import React, { useContext } from 'react';
import { Form } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ConfigContext } from '../../Contexts';

const FinalFeedback = () => {
  // const scores = [1, 2, 3, 4, 5, 6, 7];
  const config = useContext(ConfigContext);
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
};

export default FinalFeedback;

const finalFeedbackStyle = style({
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});
