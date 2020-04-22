import { inject, observer } from 'mobx-react';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Button, Card, Form, TextArea } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ActionContext } from '../../Contexts';
import IntentStore from '../../Store/IntentStore';

interface Props {
  store?: IntentStore;
}

const AnnotationBox: FC<Props> = ({ store }: Props) => {
  const { annotation = "" } = store!;
  const [annotationText, setAnnotationText] = useState(annotation);

  useEffect(() => {
    setAnnotationText((text) => {
      if (text !== annotation) return annotation;
      return text;
    });
  }, [annotation]);

  const actions = useContext(ActionContext);

  return (
    <Card fluid>
      <Card.Content>
        <Form>
          <Form.Field>
            <TextArea
              placeholder="Annotate with your thoughts..."
              value={annotationText}
              onChange={(_, { value }) => setAnnotationText(value as string)}
            />
          </Form.Field>
          <Form.Field className={centerButton}>
            <Button
              basic
              color="green"
              onClick={() => actions.annotateNode(annotationText)}
            >
              Annotate
            </Button>
            <Button basic color="green" disabled>
              Annotate & lock prediction
            </Button>
            <Button basic color="green">
              Annotate & lock other
            </Button>
          </Form.Field>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default inject("store")(observer(AnnotationBox));

const centerButton = style({
  display: "flex",
  justifyContent: "center",
});
