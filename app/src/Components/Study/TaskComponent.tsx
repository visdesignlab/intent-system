import { inject, observer } from 'mobx-react';
import React, { FC, useContext, useState } from 'react';
import { Button, Card, Progress } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ProvenanceContext, StudyActionContext, TaskConfigContext } from '../../Contexts';
import IntentStore from '../../Store/IntentStore';
import { TaskDescription } from '../../Study/TaskList';
import { getAllSelections, UserSelections } from '../Predictions/PredictionRowType';
import Feedback from './Feedback';

type Props = {
  store?: IntentStore;
  taskDesc: TaskDescription;
};

const TaskComponent: FC<Props> = ({ taskDesc, store }: Props) => {
  const { plots, multiBrushBehaviour } = store!;
  const { task } = taskDesc;
  const { isManual = false } = useContext(TaskConfigContext);
  const [selections, setSelections] = useState<UserSelections | null>(null);

  const computedSelections = getAllSelections(
    plots,
    multiBrushBehaviour === "Union"
  );

  if (JSON.stringify(selections) !== JSON.stringify(computedSelections))
    setSelections(computedSelections);

  const { currentTaskNumber, totalTasks } = useContext(StudyActionContext);

  const graph = useContext(ProvenanceContext);

  return (
    <div className={taskStyle}>
      <Card>
        <Card.Content textAlign="left" className={headerStyle}>
          <Card.Header className={whiteText}>
            Task {currentTaskNumber}
          </Card.Header>
          <Card.Meta className={`${whiteText} ${metaSize}`}>
            {!isManual ? "Guided" : "Manual"}
          </Card.Meta>
        </Card.Content>
        <Card.Content className={questionTextSize}>{task}</Card.Content>
        <Card.Content textAlign="center">
          <Feedback
            trigger={
              <Button
                disabled={!selections || selections.values.length === 0}
                primary
                content="Submit"
              />
            }
            graph={graph()}
            selections={selections ? selections.values : []}
          />
        </Card.Content>
        <Card.Content extra>
          <Progress
            value={currentTaskNumber}
            total={totalTasks}
            progress="value"
            color="blue"
          />
        </Card.Content>
      </Card>
    </div>
  );
};

export default inject("store")(observer(TaskComponent));

const taskStyle = style({
  gridArea: "question"
});

const questionTextSize = style({
  fontSize: "1.5em !important",
  textAlign: "left"
});

const metaSize = style({
  fontSize: "0.8em !important"
});

const whiteText = style({
  color: "whitesmoke !important"
});

const headerStyle = style({
  fontSize: "1.5em !important",
  backgroundColor: "#2185d0 !important"
});
