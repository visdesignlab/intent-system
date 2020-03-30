import * as crypto from 'crypto';
import React, { useMemo } from 'react';
import { Divider, Form, Label } from 'semantic-ui-react';

type Props = {
  id: number;
  question: string;
  leftText: string;
  rightText: string;
  count: number;
  val: number;
  setFeedback: (id: number, val: number) => void;
};

const LikertComponent = ({
  question,
  leftText,
  rightText,
  count,
  val,
  id,
  setFeedback
}: Props) => {
  const scores: number[] = useMemo(() => {
    const scores: number[] = [];
    let input = 0;
    while (scores.length < count) {
      scores.push(input++);
    }
    return scores;
  }, [count]);

  const groupName = useMemo(
    () =>
      crypto
        .createHash("md5")
        .update(question)
        .digest("hex"),
    [question]
  );

  return (
    <>
      <Form.Field as="h1" required>
        {question}
      </Form.Field>
      <Form.Group inline>
        <Form.Field as="h3">
          <Label>{leftText}</Label>
        </Form.Field>
        {scores.map(score => (
          <Form.Radio
            key={score}
            value={score}
            name={groupName}
            checked={score === val}
            onChange={(_, { value }) => {
              if (typeof value !== "number") return;
              setFeedback(id, value);
            }}
          />
        ))}
        <Form.Field as="h3">
          <Label>{rightText}</Label>
        </Form.Field>
      </Form.Group>
      <Divider />
    </>
  );
};

export default LikertComponent;
