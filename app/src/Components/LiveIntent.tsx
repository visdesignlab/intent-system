import React, {FC, CSSProperties, useState, useEffect} from 'react';
import {Card, Header, Form} from 'semantic-ui-react';
import {Prediction} from '../contract';
import {useSelector} from 'react-redux';
import {AppState} from '../Stores/CombinedStore';
import {
  getPredictionType,
  PredictionType,
} from '../Stores/Predictions/PredictionsState';
import {pure} from 'recompose';
import {studyProvenance, logToFirebase} from '..';
import Events from '../Stores/Types/EventEnum';

interface Props {
  initialText?: string;
}

const LiveIntent: FC<Props> = ({initialText}: Props) => {
  const [intentText, setIntentText] = useState(Math.random().toString());
  const [showAdvance, setShowAdvance] = useState(false);

  const predictions = useSelector<AppState, Prediction[]>(
    state => state.predictionSet.predictions || [],
  );

  const predText = JSON.stringify(predictions);

  let temp: any = '';

  useEffect(() => {
    const predictions: Prediction[] = JSON.parse(predText);

    if (predictions.length > 0) {
      predictions.sort((a, b) => b.rank - a.rank);
      const topPrediction = predictions[0];
      const type = getPredictionType(topPrediction.intent);
      const {intent} = topPrediction;

      let [
        hash = '',
        dimensions = '',
        intentName = '',
        intentDetails = '',
        info = '',
      ] =
        type === PredictionType.Range
          ? ['', '', intent, '', '']
          : intent.split(':');

      temp = JSON.stringify([
        hash,
        dimensions,
        intentName,
        intentDetails,
        info,
      ]);

      let text = '';
      switch (type) {
        case PredictionType.Cluster:
          text = `Selected Points in a Cluster`;
          break;
        case PredictionType.Outlier:
          text = `Selected outliers`;
          break;
        case PredictionType.Skyline:
          text = `Selected points on a skyline`;
          break;
        case PredictionType.Category:
          const splitNames = intentName.split('|');
          if (splitNames.length > 0)
            text = `Selected points belonging to the category:${
              splitNames.reverse()[0]
            } `;
          else text = `Selected points belonging to a category`;
          break;
        case PredictionType.NonOutlier:
          text = `Selected points which are not outliers`;
          break;
        case PredictionType.LinearRegression:
          if (intentDetails.includes('outside'))
            text = `Selected points which are outside linear regression`;
          else text = `Selected points which are on linear regression`;
          break;
        case PredictionType.QuadraticRegression:
          if (intentDetails.includes('outside'))
            text = `Selected points which are outside quadratic regression`;
          else text = `Selected points which are on quadratic regression`;
          break;
        case PredictionType.Range:
          text = `Selected points based on a range selection`;
          break;
        default:
          setIntentText('');
          break;
      }

      if (intentText !== text) setIntentText(text);
    } else {
      if (intentText !== '') setIntentText('');
    }
  }, [predText]);

  return (
    <Card fluid style={intentDivStyle}>
      <div style={{visibility: 'hidden', height: 0}}>{temp}</div>
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
            <Form.Button
              onClick={() => {
                const t = new Date();
                studyProvenance.applyAction({
                  label: Events.ANNOTATE,
                  action: () => {
                    let currentState = studyProvenance.graph().current.state;
                    if (currentState) {
                      currentState = {
                        ...currentState,
                        event: Events.ANNOTATE,
                        startTime: t,
                        eventTime: t,
                        annotation: intentText,
                      };
                    }
                    return currentState as any;
                  },
                  args: [],
                });
                console.log('Logged', intentText);
                logToFirebase();
              }}
              disabled={intentText.length < 1}
              positive>
              Annotate
            </Form.Button>
          </Form.Group>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default pure(LiveIntent);

(LiveIntent as any).whyDidYouRender = true;

const intentDivStyle: CSSProperties = {
  margin: '0',
};
