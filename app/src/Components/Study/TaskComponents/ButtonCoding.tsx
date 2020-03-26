import { inject, observer } from 'mobx-react';
import React, { FC, useContext } from 'react';
import { Button } from 'semantic-ui-react';

import { ProvenanceContext, StudyActionContext } from '../../../Contexts';

type Props = {
  disabled: boolean;
  values: number[];
};

const ButtonCoding: FC<Props> = ({ disabled, values }: Props) => {
  const { endTask } = useContext(StudyActionContext);
  const graph = useContext(ProvenanceContext);

  return (
    <Button
      content="Submit"
      primary
      disabled={disabled}
      onClick={() => {
        if (disabled)
          throw new Error("Something went wrong with coding button.");
        endTask(values, graph(), 0, 0, "Coding");
      }}
    />
  );
};

export default inject("store")(observer(ButtonCoding));
