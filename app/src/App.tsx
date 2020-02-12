import React, {useState, useEffect, useMemo} from 'react';
import {Provider} from 'mobx-react';
import {setupProvenance} from './Store/Provenance';
import IntentStore from './Store/IntentStore';
import Navbar from './Components/Navbar';
import axios from 'axios';
import {style} from 'typestyle';
import {Datasets, Dataset, loadData, Data} from './Utils/Dataset';
import ProvenanceVisualization from './Components/ProvenanceVisualization';

const store = new IntentStore();

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
        setData(data);
      });
    }
  }, [selectedDataset]);

  useEffect(() => {
    axios.get('./dataset').then(response => {
      const datasets = response.data;
      if (datasetString !== JSON.stringify(datasets)) {
        setDatasets(datasets);
        setSelectedDataset(datasets[0]);
        actions.setDataset(datasets[0]);
      }
    });
  }, [datasetString, actions]);

  (window as any).printProv = () => {
    const node = Object.values(provenance.graph().nodes);
    console.table(node);
  };

  return datasets.length > 0 && data ? (
    <Provider store={store}>
      <div className={layoutStyle}>
        <div className={visStyle}>
          <Navbar
            data={data}
            actions={actions}
            datasets={datasets}
            setDataset={setSelectedDataset}
          />
          <div className={plotStyle}>Visualization</div>
          <div className={legendStyle}>Yay</div>
        </div>
        <div className={predStyle}>Predictions</div>
        <ProvenanceVisualization />
      </div>
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
  gridTemplateRows: 'min-content min-content auto',
  gridTemplateAreas: `
  "nav"
  "legend"
  "plot"
  `,
});

const plotStyle = style({gridArea: 'plot'});

const predStyle = style({gridArea: 'pred'});

const legendStyle = style({gridArea: 'legend'});
