import Vimeo from "@u-wave/react-vimeo";
import React, { FC, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Message } from "semantic-ui-react";
import { style } from "typestyle";

import { ConfigContext } from "../Contexts";
import { StudyActions } from "../Store/StudyStore/StudyProvenance";

type Props = {
  actions: StudyActions;
};

const Video: FC<Props> = ({ actions }: Props) => {
  const [enableButton, setEnableButton] = useState(true);
  const { debugMode } = useContext(ConfigContext);

  return (
    <>
    <div className={centerThings}>
      <video width="750" height="500" controls >
        <source src="video/training-deck-with-vids_anon_small.m4v" type="video/mp4"/>
      </video>
    </div>
      <Container textAlign="center">
        <Message compact>
          We have included this video in supplementary material for review
          purposes.
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
