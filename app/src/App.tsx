import axios from 'axios';
import { Provider } from 'mobx-react';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { style } from 'typestyle';

import Navbar from './Components/Navbar';
import Predictions from './Components/Predictions/Predictions';
import ProvenanceVisualization from './Components/ProvenanceVisualization';
import Visualization from './Components/Scatterplot/Visualization';
import { ActionContext, DataContext } from './Contexts';
import IntentStore from './Store/IntentStore';
import { setupProvenance } from './Store/Provenance';
import { Data, Dataset, Datasets, loadData } from './Utils/Dataset';
import getPlotId from './Utils/PlotIDGen';

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

  const { provenance, actions } = useMemo(() => {
    const { provenance, actions } = setupProvenance(store);
    const ds: Dataset = JSON.parse(selectedDatasetString);
    if (ds.key.length > 0) {
      actions.setDataset(ds);
    }
    return { provenance, actions };
  }, [selectedDatasetString]);

  useEffect(() => {
    if (selectedDataset.key.length > 0) {
      axios.get(`/dataset/${selectedDataset.key}`).then((d) => {
        const data = loadData(d.data);
        setData(data);
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
  }, [selectedDataset, actions]);

  useEffect(() => {
    axios.get("./dataset").then((response) => {
      const datasets: any[] = response.data;

      if (datasetString !== JSON.stringify(datasets)) {
        const url = new URLSearchParams(window.location.search);
        const datasetName = url.get("datasetName");
        let datasetNum = getRandomNumber(datasets.length - 1) * 0 + 1;
        setDatasets(datasets);

        for (let j in datasets) {
          if (datasets[j].key === datasetName) {
            datasetNum = +j;
          }
        }

        let datasetIdx = datasetNum;
        setSelectedDataset(datasets[datasetIdx]);
        actions.setDataset(datasets[datasetIdx]);
      }
    });
  }, [datasetString, actions]);

  (window as any).printProv = () => {
    const node = Object.values(provenance.graph().nodes);
    console.table(node);
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
