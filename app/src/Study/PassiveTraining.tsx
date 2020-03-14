import React, { FC } from 'react';
import { Button } from 'semantic-ui-react';

import { StudyActions } from '../Store/StudyStore/StudyProvenance';

type Props = {
  actions: StudyActions;
};

const PassiveTraining: FC<Props> = ({ actions }: Props) => {
  return (
    <div>
      This screen will hold passive training.
      <Button onClick={() => actions.nextPhase("Training Tasks")}>Next</Button>
    </div>
  );
};

export default PassiveTraining;
