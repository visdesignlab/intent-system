import { inject, observer } from 'mobx-react';
import React, { FC, useContext, useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Button, Card, Form, Message, TextArea } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ActionContext } from '../../Contexts';
import IntentStore from '../../Store/IntentStore';
import { PredictionRowType } from './PredictionRowType';

interface Props {
  store?: IntentStore;
}

export const topPred$ = new BehaviorSubject<PredictionRowType | null>(null);

const AnnotationBox: FC<Props> = ({ store }: Props) => {
  const { annotation = "" } = store!;
  const [annotationText, setAnnotationText] = useState(annotation);
  const [topPrediction, setTopPrediction] = useState<PredictionRowType | null>(
    null
  );
  const [hideError, setHideError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const sub = topPred$.subscribe((next) => setTopPrediction(next));
    return () => sub.unsubscribe();
  }, []);

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
              onChange={(_, { value }) => {
                if (!hideError) setHideError(true);
                setAnnotationText(value as string);
              }}
            />
          </Form.Field>
          <Form.Field className={centerButton}>
            <Button
              basic
              color="green"
              onClick={() => {
                if (annotationText.length === 0) {
                  setHideError(false);
                  setErrorMessage("Please annotate something.");
                  return;
                }
                actions.annotateNode(annotationText);
              }}
            >
              Annotate
            </Button>
            <Button
              basic
              color="green"
              disabled={topPrediction === null}
              onClick={() => {
                if (annotationText.length === 0) {
                  setHideError(false);
                  setErrorMessage(
                    "Please describe how well the prediction you are locking matches your intent."
                  );
                  return;
                }
                if (topPrediction) {
                  actions.annotateNode(annotationText);
                  actions.lockPrediction(topPrediction);
                }
              }}
            >
              Annotate & lock {topPrediction?.type || "...."}
            </Button>
            <Button
              basic
              color="green"
              onClick={() => {
                if (annotationText.length === 0) {
                  setHideError(false);
                  setErrorMessage("Please describe your intent.");
                  return;
                }
                actions.annotateNode(annotationText);
                actions.lockPrediction("Other");
              }}
            >
              Annotate & lock other
            </Button>
          </Form.Field>
          {!hideError && errorMessage.length > 0 && (
            <Form.Field>
              <Message negative>{errorMessage}</Message>
            </Form.Field>
          )}
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
