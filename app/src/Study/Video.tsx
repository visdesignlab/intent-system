import Vimeo from '@u-wave/react-vimeo';
import React, { FC, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Message } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ConfigContext } from '../Contexts';
import { StudyActions } from '../Store/StudyStore/StudyProvenance';

type Props = {
  actions: StudyActions;
};

const Video: FC<Props> = ({ actions }: Props) => {
  const [enableButton, setEnableButton] = useState(false);
  const { debugMode } = useContext(ConfigContext);

  return (
    <>
      <div className={centerThings}>
        <Vimeo
          video="401985009"
          width="800"
          autoplay={false}
          showTitle={false}
          showByline={false}
          showPortrait={false}
          onEnd={() => {
            setEnableButton(true);
          }}
        />
      </div>
      <Container textAlign="center">
        <Message compact>
          Please watch this video as part of the study. You will be able to
          proceed once you have completed watching the video.
        </Message>
      </Container>
      <br />
      <div className={centerThings}>
        <Link
          to="/trainingm/"
          style={{
            pointerEvents: enableButton || debugMode ? "all" : "none",
          }}
        >
          <Button
            onClick={() => actions.nextPhase("Training - Manual")}
            disabled={!enableButton && !debugMode}
            primary
            content="Next"
          />
        </Link>
      </div>
    </>
  );
};

export default Video;

const centerThings = style({
  display: "flex",
  justifyContent: "center",
});
