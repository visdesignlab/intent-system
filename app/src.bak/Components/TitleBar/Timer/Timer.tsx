import * as React from "react";
import { useState } from "react";

import styled from "styled-components";
import { Icon } from "semantic-ui-react";

interface TimerProps {
  timeLimit: number;
  start?: boolean;
  reset?: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeLimit, start, reset }) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  React.useEffect(() => {
    let secInterval: number = null as any;
    if (start) {
      secInterval = setInterval(() => {
        setSeconds(sec => {
          if (sec < 59) {
            return sec + 1;
          } else {
            setMinutes(min => {
              if (min < 59) return min + 1;
              else {
                setHours(h => h + 1);
                return 0;
              }
            });
            return 0;
          }
        });
      }, 100);
    } else if (seconds !== 0 || minutes !== 0) {
      if (reset) {
        setSeconds(0);
        setMinutes(0);
        setHours(0);
      }
    }
    return () => {
      clearInterval(secInterval);
    };
  }, [start, reset, seconds, minutes]);

  return (
    <TimerDiv>
      <Icon name="hourglass half" size="big" />
      <TimerDigits>{hours < 10 ? `0${hours}` : hours}</TimerDigits>
      <TimerDigits>:</TimerDigits>
      <TimerDigits>{minutes < 10 ? `0${minutes}` : minutes}</TimerDigits>
      <TimerDigits />
      <TimerDigits>:</TimerDigits>
      <TimerDigits>{seconds < 10 ? `0${seconds}` : seconds}</TimerDigits>
    </TimerDiv>
  );
};

export default Timer;

const TimerDiv = styled.div`
  display: flex;
  align-items: center;
`;

const TimerDigits = styled.div`
  font-size: 2em;
`;
