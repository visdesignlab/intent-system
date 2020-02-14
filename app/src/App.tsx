import React, {useState, useEffect, useMemo, createContext} from 'react';
import {Provider} from 'mobx-react';
import {setupProvenance, ProvenanceActions} from './Store/Provenance';
import IntentStore from './Store/IntentStore';
import Navbar from './Components/Navbar';
import axios from 'axios';
import {style} from 'typestyle';
import {Datasets, Dataset, loadData, Data} from './Utils/Dataset';
import ProvenanceVisualization from './Components/ProvenanceVisualization';
import Visualization from './Components/Scatterplot/Visualization';
import getPlotId from './Utils/PlotIDGen';
import Legend from './Components/Scatterplot/Legend';
import _ from 'lodash';

const store = new IntentStore();

export const DataContext = createContext<Data>(null as any);
export const ActionContext = createContext<ProvenanceActions>(null as any);

const App = () => {
  const [datasets, setDatasets] = useState<Datasets>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset>({
    key: '',
    name: '',
  });

  const [data, setData] = useState<Data>(null as any);

  const selectedDatasetString = JSON.stringify(selectedDataset);

  const datasetString = JSON.stringify(datasets);

  const {provenance, actions} = useMemo(() => {
    const {provenance, actions} = setupProvenance(store);
    const ds: Dataset = JSON.parse(selectedDatasetString);
    if (ds.key.length > 0) {
      actions.setDataset(ds);
    }
    return {provenance, actions};
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
            brushes: {},
          });
        }
        setData(data);
      });
    }
  }, [selectedDataset, actions]);

  useEffect(() => {
    axios.get('./dataset').then(response => {
      const datasets = response.data;
      if (datasetString !== JSON.stringify(datasets)) {
        setDatasets(datasets);
        setSelectedDataset(datasets[2]);
        actions.setDataset(datasets[2]);
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
              <Visualization actions={actions} />
            </div>
            <div className={predStyle}>Predictions</div>
            <ProvenanceVisualization actions={actions} />
          </div>
        </ActionContext.Provider>
      </DataContext.Provider>
    </Provider>
  ) : null;
};

(App as any).whyDidYouRender = true;

export default App;

const layoutStyle = style({
  display: 'grid',
  height: '100vh',
  width: '100vw',
  gridTemplateColumns: '5fr 1fr 1fr',
  gridTemplateAreas: `
  "vis pred prov"
  `,
});

const visStyle = style({
  gridArea: 'vis',
  display: 'grid',
  gridTemplateRows: 'min-content auto',
  overflow: 'hidden',
  gridTemplateAreas: `
  "nav"
  "vis"
  `,
});

const predStyle = style({gridArea: 'pred'});
