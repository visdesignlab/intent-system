import React, {FC, CSSProperties, useState, useEffect} from 'react';
import {Card, Header, Form} from 'semantic-ui-react';
import {useSelector} from 'react-redux';
import {AppState} from '../Stores/CombinedStore';

interface Props {
  initialText: string;
}

type Rule = {
  dimension: string;
  exp: string;
  value: string | number;
};

type Rules = Rule[];

function convertStringToRule(ruleString: string): Rule {
  const [dimension, exp, value] = ruleString.split(' ');

  return {
    dimension,
    value,
    exp,
  };
}

function convertStringArrToRules(strs: string[]): Rules {
  const rules = strs.map(r => convertStringToRule(r));
  return rules;
}

const LiveIntent: FC<Props> = ({initialText}: Props) => {
  const [intentText, setIntentText] = useState(initialText);

  const [showAdvance, setShowAdvance] = useState(false);

  const predictions = useSelector(
    (state: AppState) => state.predictionSet.predictions || [],
  );

  const dataset = useSelector((state: AppState) => state.dataset);

  const columnMapsString = JSON.stringify(dataset.columnMaps);

  const rangePrediction = predictions.find(pred =>
    pred.intent.includes('Range'),
  );

  useEffect(() => {
    const columnMaps = JSON.parse(columnMapsString);
    let text = '';
    if (rangePrediction) {
      const {info} = rangePrediction;
      if (info) {
        const {rules} = info as any;
        const res = convertStringArrToRules(rules.reverse()[0]);
        text = `Select points where ${res
          .map(rule => {
            const {dimension, exp, value} = rule;
            const fullDimension = columnMaps[dimension].text;

            return `${fullDimension} ${exp} ${value}`;
          })
          .join(' and ')}`;
      }
    }
    if (text !== intentText) setIntentText(text);
  }, [rangePrediction, columnMapsString, intentText]);

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
