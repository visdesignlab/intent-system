import React, {FC, CSSProperties, useState} from 'react';
import {Card, Header, Form} from 'semantic-ui-react';

interface Props {
  initialText: string;
}

const LiveIntent: FC<Props> = ({initialText}: Props) => {
  const [intentText, setIntentText] = useState(Math.random().toString());

  const [showAdvance, setShowAdvance] = useState(false);

  return (
    <Card fluid style={intentDivStyle}>
      <Card.Content>
        <Header as="h1" textAlign="center">
          Intent
        </Header>
      </Card.Content>
      <Card.Content>
        <Form>
          <Form.TextArea
            value={intentText}
            placeholder="Please interact"
            onChange={(_, data) => {
              setIntentText(data.value as string);
            }}
          />
          <Form.Group widths="equal">
            <Form.Radio
              toggle
              checked={showAdvance}
              onChange={(_, data) =>
                setShowAdvance(data.checked || !showAdvance)
              }
              label="Advance View"
            />
            <Form.Button disabled={intentText.length < 1} positive>
              Annotate
            </Form.Button>
          </Form.Group>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default LiveIntent;

const intentDivStyle: CSSProperties = {
  margin: '0',
};
