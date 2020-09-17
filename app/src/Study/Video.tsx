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
      {/* <div className={centerThings}> */}
      {/* <Vimeo */}
      {/*     video="459045008" */}
      {/*     // {/1* video="457094075" *1/} */}
      {/*     // video="401985009" */}
      {/*     width="800" */}
      {/*     autoplay={false} */}
      {/*     showTitle={false} */}
      {/*     showByline={false} */}
      {/*     showPortrait={false} */}
      {/* onEnd={() => { */}
      {/* setEnableButton(true); */}
      {/*     }} */}
      {/* /> */}
      {/* </div> */}
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
