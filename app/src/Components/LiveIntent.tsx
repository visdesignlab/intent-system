import React, {FC, CSSProperties} from 'react';
import {Card, Header, Form} from 'semantic-ui-react';

interface Props {}

const LiveIntent: FC<Props> = ({}: Props) => {
  return (
    <Card fluid style={intentDivStyle}>
      <Card.Content>
        <Header as="h1" textAlign="center">
          Intent
        </Header>
      </Card.Content>
      <Card.Content>
        <Form>
          <Form.TextArea />
        </Form>
      </Card.Content>
    </Card>
  );
};

export default LiveIntent;

const intentDivStyle: CSSProperties = {
  display: 'grid',
  gridTemplateRows: 'min-content min-content',
  margin: '0',
};
