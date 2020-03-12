import Axios from 'axios';
import { Provider } from 'mobx-react';
import React, { useEffect, useMemo, useState } from 'react';
import { style } from 'typestyle';

import Navbar from './Components/Navbar';
import Predictions from './Components/Predictions/Predictions';
import Visualization from './Components/Scatterplot/Visualization';
import TaskComponent from './Components/Study/TaskComponent';
import { ActionContext, DataContext, ProvenanceContext, TaskConfigContext } from './Contexts';
import IntentStore from './Store/IntentStore';
import { setupProvenance } from './Store/Provenance';
import { TaskDescription } from './Study/TaskList';
import { Data, loadData } from './Utils/Dataset';
import getPlotId from './Utils/PlotIDGen';

type Props = {
  task: TaskDescription;
};

const StudyApp = ({ task }: Props) => {
  const { dataset, plots, category } = task;
  const [data, setData] = useState<Data>(null as any);

  useEffect(() => {
    Axios.get(`/dataset/${dataset}`).then(d => {
      const data = loadData(d.data);
      setData(data);
    });
  }, [dataset]);

  const { store, provenance, actions } = useMemo(() => {
    const store = new IntentStore();
    const { provenance, actions } = setupProvenance(store);
    return { store, provenance, actions };
  }, []);

  useEffect(() => {
    if (!data) return;
    actions.setDataset({ key: dataset, name: data.name });
    plots.forEach(plot => {
      actions.addPlot({
        id: getPlotId(),
        x: plot.x,
        y: plot.y,
        selectedPoints: [],
        brushes: {}
      });
    });
    actions.toggleCategories(category.show, [category.column]);
  }, [data, actions, dataset, plots, category]);

  const isManual = task.taskType === "manual";
  const isTraining = task.training === "yes";
  const hasCenter =
    task.type === "cluster" &&
    task.center !== null &&
    task.center !== undefined;
  const hasCategory = task.type === "category" && task.symbol !== "None";

  return dataset && data ? (
    <Provider store={store}>
      <DataContext.Provider value={data}>
        <ActionContext.Provider value={actions}>
          <TaskConfigContext.Provider
            value={{ task, isManual, isTraining, hasCenter, hasCategory }}
          >
            <ProvenanceContext.Provider value={() => provenance.graph()}>
              <div className={layoutStyle(!isManual)}>
                <TaskComponent taskDesc={task} />
                <div className={visStyle}>
                  <Navbar
                    data={data}
                    datasets={[{ key: dataset, name: dataset }]}
                    setDataset={() => {}}
                  />
                  <Visualization />
                </div>
                {!isManual && <Predictions />}
              </div>
            </ProvenanceContext.Provider>
          </TaskConfigContext.Provider>
        </ActionContext.Provider>
      </DataContext.Provider>
    </Provider>
  ) : (
    <div />
  );
};

export default StudyApp;

const layoutStyle = (isGuide: boolean) =>
  style({
    display: "grid",
    height: "100vh",
    width: "100vw",
    gridTemplateColumns: isGuide ? "min-content 3fr 1fr" : "min-content 1fr",
    gridTemplateAreas: isGuide
      ? `
  "question vis pred"
  `
      : `"question vis"`
  });

const visStyle = style({
  gridArea: "vis",
  display: "grid",
  gridTemplateRows: "min-content auto",
  overflow: "hidden",
  gridTemplateAreas: `
  "nav"
  "vis"
  `
});
