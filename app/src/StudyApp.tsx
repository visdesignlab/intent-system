import React, { useState, useEffect, useMemo } from "react";
import { TaskDescription } from "./Study/TaskList";
import { Data, loadData } from "./Utils/Dataset";
import Axios from "axios";
import { setupProvenance } from "./Store/Provenance";
import IntentStore from "./Store/IntentStore";
import { Provider } from "mobx-react";
import {
  DataContext,
  ActionContext,
  TaskConfigContext,
  ProvenanceContext
} from "./Contexts";
import { style } from "typestyle";
import ProvenanceVisualization from "./Components/ProvenanceVisualization";
import Predictions from "./Components/Predictions/Predictions";
import Visualization from "./Components/Scatterplot/Visualization";
import Navbar from "./Components/Navbar";
import getPlotId from "./Utils/PlotIDGen";
import TaskComponent from "./Components/Study/TaskComponent";

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

  return dataset && data ? (
    <Provider store={store}>
      <DataContext.Provider value={data}>
        <ActionContext.Provider value={actions}>
          <TaskConfigContext.Provider value={task}>
            <ProvenanceContext.Provider value={() => provenance.graph()}>
              <div className={layoutStyle}>
                <div className={visStyle}>
                  <TaskComponent task={task.task} />
                  <Navbar
                    data={data}
                    datasets={[{ key: dataset, name: dataset }]}
                    setDataset={() => {}}
                  />
                  <Visualization />
                </div>
                <Predictions />
                <ProvenanceVisualization />
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

const layoutStyle = style({
  display: "grid",
  height: "100vh",
  width: "100vw",
  gridTemplateColumns: "5fr 2fr 1fr",
  gridTemplateAreas: `
  "vis pred prov"
  `
});

const visStyle = style({
  gridArea: "vis",
  display: "grid",
  gridTemplateRows: "min-content min-content auto",
  overflow: "hidden",
  gridTemplateAreas: `
  "question"
  "nav"
  "vis"
  `
});
