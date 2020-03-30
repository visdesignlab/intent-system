import Vimeo from '@u-wave/react-vimeo';
import React, { FC, useContext, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ConfigContext } from '../Contexts';
import { StudyActions } from '../Store/StudyStore/StudyProvenance';

type Props = {
  actions: StudyActions;
};

const PassiveTraining: FC<Props> = ({ actions }: Props) => {
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
      <div className={centerThings}>
        <Button
          onClick={() => actions.nextPhase("Training Tasks")}
          disabled={!enableButton && !debugMode}
          primary
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default PassiveTraining;

const centerThings = style({
  display: "flex",
  justifyContent: "center"
});
