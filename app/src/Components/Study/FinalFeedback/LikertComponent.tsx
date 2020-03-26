import * as crypto from 'crypto';
import React, { useEffect, useMemo } from 'react';
import { Form } from 'semantic-ui-react';

type Props = {
  question: string;
  leftText: string;
  rightText: string;
  count: number;
};

const LikertComponent = ({ question, leftText, rightText, count }: Props) => {
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
      <Form.Field as="h1">{question}</Form.Field>
      <Form.Group inline>
        <Form.Field as="h3">{leftText}</Form.Field>
        {scores.map(score => (
          <Form.Radio key={score} value={score} name={groupName} />
        ))}
        <Form.Field as="h3">{rightText}</Form.Field>
      </Form.Group>
    </>
  );
};

export default LikertComponent;
