import axios from 'axios';
import { Provider } from 'mobx-react';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { ajax } from 'rxjs/ajax';
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

const App: FC<Props> = (_: Props) => {
  const [datasets, setDatasets] = useState<Datasets>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset>({
    key: "",
    name: ""
  });

  const [data, setData] = useState<Data>(null as any);

  const selectedDatasetString = JSON.stringify(selectedDataset);

  const datasetString = JSON.stringify(datasets);

  const getName = (dataset: string) => `${dataset}`;

  useEffect(() => {
    const names$ = ajax("./dataset");
  });

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
      axios.get(`/dataset/${selectedDataset.key}`).then(d => {
        const data = loadData(d.data);
        if (data.numericColumns.length >= 2) {
          actions.addPlot({
            id: getPlotId(),
            x: data.numericColumns[0],
            y: data.numericColumns[1],
            selectedPoints: [],
            brushes: {}
          });
        }
        setData(data);
      });
    }
  }, [selectedDataset, actions]);

  useEffect(() => {
    axios.get("./dataset").then(response => {
      const datasets: any[] = response.data;
      if (datasetString !== JSON.stringify(datasets)) {
        setDatasets(datasets);
        let datasetIdx = 2;
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
    <Provider store={store}>
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
            <Predictions />
            <ProvenanceVisualization />
          </div>
        </ActionContext.Provider>
      </DataContext.Provider>
    </Provider>
  ) : null;
};

export default App;

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
  gridTemplateRows: "min-content auto",
  overflow: "hidden",
  gridTemplateAreas: `
  "nav"
  "vis"
  `
});
