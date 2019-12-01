import React, {FC, CSSProperties} from 'react';
import {Card, Header, Form} from 'semantic-ui-react';

interface Props {
  initialText: string;
}

const LiveIntent: FC<Props> = ({initialText}: Props) => {
  return (
    <Card fluid style={intentDivStyle}>
      <Card.Content>
        <Header as="h1" textAlign="center">
          Intent
        </Header>
      </Card.Content>
      <Card.Content>
        <Form>
          <Form.TextArea value={initialText} />
        </Form>
      </Card.Content>
    </Card>
  );
};

export default LiveIntent;

const intentDivStyle: CSSProperties = {
  margin: '0',
};
