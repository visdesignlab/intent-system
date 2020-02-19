import React, {FC, useState, useContext} from 'react';
import {inject, observer} from 'mobx-react';
import IntentStore from '../../Store/IntentStore';
import {Form, TextArea, Button, Card} from 'semantic-ui-react';
import {ActionContext} from '../../App';
import {style} from 'typestyle';

interface Props {
  store?: IntentStore;
  annotation: string;
}

const AnnotationBox: FC<Props> = ({store, annotation}: Props) => {
  const [annotationText, setAnnotationText] = useState(annotation);

  const actions = useContext(ActionContext);

  return (
    <Card fluid>
      <Card.Content>
        <Form>
          <Form.Field>
            <TextArea
              placeholder="Annotate with your thoughts..."
              value={annotationText}
              onChange={(_, {value}) => setAnnotationText(value as string)}
            />
          </Form.Field>
          <Form.Field className={centerButton}>
            <Button
              basic
              color="green"
              onClick={() => actions.annotateNode(annotationText)}>
              Annotate
            </Button>
          </Form.Field>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default inject('store')(observer(AnnotationBox));

const centerButton = style({
  display: 'flex',
  justifyContent: 'center',
});
