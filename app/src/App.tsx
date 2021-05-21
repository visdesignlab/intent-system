import axios from "axios";
import { Provider } from "mobx-react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Icon, Modal } from "semantic-ui-react";
import { style } from "typestyle";
import Navbar from "./Components/Navbar";
import Predictions from "./Components/Predictions/Predictions";
import ProvenanceVisualization from "./Components/ProvenanceVisualization";
import Visualization from "./Components/Scatterplot/Visualization";
import { ActionContext, DataContext } from "./Contexts";
import IntentStore from "./Store/IntentStore";
import { setupProvenance } from "./Store/Provenance";
import { Data, Dataset, Datasets, loadData } from "./Utils/Dataset";
import getPlotId from "./Utils/PlotIDGen";

type Props = {};

const store = new IntentStore();

function getRandomNumber(num: number): number {
  const floor = Math.random() > 0.5;

  let randomNumber = Math.random();

  randomNumber = randomNumber * num;

  if (floor) return Math.floor(randomNumber);
  return Math.ceil(randomNumber);
}

let firstLoad = true;

const App: FC<Props> = (_: Props) => {
  const [datasets, setDatasets] = useState<Datasets>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset>({
    key: "",
    name: "",
  });

  const [data, setData] = useState<Data>(null as any);

  const selectedDatasetString = JSON.stringify(selectedDataset);

  const datasetString = JSON.stringify(datasets);

  const location = useLocation();

  const url = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);

  const { provenance, actions } = useMemo(() => {
    const { provenance, actions } = setupProvenance(store, url);
    const ds: Dataset = JSON.parse(selectedDatasetString);
    if (ds.key.length > 0) {
      actions.setDataset(ds);
    }
    return { provenance, actions };
  }, [selectedDatasetString, url]);

  useEffect(() => {
    if (selectedDataset.key.length > 0) {
      axios.get(`/dataset/${selectedDataset.key}`).then((d) => {
        const data = loadData(d.data);
        setData(data);

        if (url.get("paperFigure")) return;

        if (data.numericColumns.length >= 2) {
          actions.addPlot({
            id: getPlotId(),
            x: data.numericColumns[0],
            y: data.numericColumns[1],
            selectedPoints: [],
            brushes: {},
          });
          if (firstLoad) {
            actions.addPlot({
              id: getPlotId(),
              x: data.numericColumns[2],
              y: data.numericColumns[4],
              selectedPoints: [],
              brushes: {},
            });
            firstLoad = false;
          }
        }
      });
    }
  }, [selectedDataset, actions, url]);

  useEffect(() => {
    axios.get("./dataset").then((response) => {
      const datasets: any[] = response.data;

      if (datasetString !== JSON.stringify(datasets)) {
        let datasetName = url.get("datasetName");
        const paperFigure = url.get("paperFigure");

        if (paperFigure === "auto-complete") datasetName = "out_hard_task_3";
        if (paperFigure === "paper-teaser") datasetName = "cluster";
        if (paperFigure === "prediction-interface") datasetName = "gapminder";
        if (paperFigure === "study-example") datasetName = "out_hard_task_4";
        if (paperFigure === "iris") datasetName = "iris";

        let datasetNum = getRandomNumber(datasets.length - 1) * 0 + 1;
        setDatasets(datasets);

        for (let j in datasets) {
          if (datasets[j].key === datasetName) {
            datasetNum = +j;
          }
        }

        let datasetIdx = datasetNum;
        setSelectedDataset(datasets[datasetIdx]);
        actions.setDataset(datasets[datasetIdx], true);
      }
    });
  }, [datasetString, actions, url]);

  (window as any).printProv = () => {
    const node = provenance.graph();
    console.log(node);
  };

  return datasets.length > 0 && data ? (
    <>
      <Provider key={store.dataset.key} store={store}>
        <DataContext.Provider value={data}>
          <ActionContext.Provider value={actions}>
            <div className={layoutStyle}>
              <div className={visStyle}>
                <Navbar
                  data={data}
                  datasets={datasets}
                  setDataset={setSelectedDataset}
                />
                <Visualization />
              </div>
              <div className={sideLayout}>
                <Predictions />
                <ProvenanceVisualization />
              </div>
            </div>
          </ActionContext.Provider>
        </DataContext.Provider>
      </Provider>
      <Modal
        trigger={
          <Button className={infoQuestion} circular icon>
            <Icon name="question" />
          </Button>
        }
      >
        <Modal.Header>Intent Inference System</Modal.Header>
        <Modal.Content>
          <p>
            The purpose of this tool is to predict user intents in the form of
            patterns when brushing in scatterplots.
          </p>
          <p>
            This project is developed at the{" "}
            <a href="https://vdl.sci.utah.edu/">Visualization Design Lab</a> at
            the <a href="https://www.sci.utah.edu/">SCI Institute</a> at the
            University of Utah by Kiran Gadhave, Jochen Görtler, Zach Cutler,
            and Alexander Lex, with contributions by Jeff Phillips, Miriah
            Meyer, and Oliver Deussen.
          </p>{" "}
          <p>
            Please visit the{" "}
            <a href="https://vdl.sci.utah.edu/publications/2020_intent/">
              publication page
            </a>{" "}
            for more details and information on how to cite this work. The
            source code and documentation is available{" "}
            <a href="https://github.com/visdesignlab/intent-system">here</a>.
            This project is funded by the National Science Foundation trough
            grant{" "}
            <a href="https://vdl.sci.utah.edu/projects/2018-nsf-reproducibility/">
              IIS 1751238
            </a>
            .
          </p>
        </Modal.Content>
      </Modal>
    </>
  ) : null;
};

export default App;

const infoQuestion = style({
  position: "absolute",
  bottom: 5,
  left: 5,
});

const layoutStyle = style({
  display: "grid",
  height: "100vh",
  width: "100vw",
  gridTemplateColumns: "5fr 3fr",
  gridTemplateAreas: `
  "vis side"
  `,
});

const sideLayout = style({
  display: "grid",
  gridArea: "side",
  gridTemplateColumns: "auto min-content",
  gridTemplateAreas: `
    "pred prov"
  `,
});

const visStyle = style({
  gridArea: "vis",
  display: "grid",
  gridTemplateRows: "min-content auto",
  overflow: "hidden",
  gridTemplateAreas: `
  "nav"
  "vis"
  `,
});
