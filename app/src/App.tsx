import React, {useState, useEffect, useMemo} from 'react';
import {Provider} from 'mobx-react';
import {setupProvenance} from './Store/Provenance';
import IntentStore from './Store/IntentStore';
import Navbar from './Components/Navbar';
import axios from 'axios';

const store = new IntentStore();

const App = () => {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const datasetString = JSON.stringify(datasets);

  const {provenance, actions} = useMemo(() => {
    const {provenance, actions} = setupProvenance(store);
    if (selectedDataset.length > 0) {
      actions.setDataset(selectedDataset);
    }
    return {provenance, actions};
  }, [selectedDataset]);

  useEffect(() => {
    axios.get('./dataset').then(response => {
      const datasets = response.data;
      if (datasetString !== JSON.stringify(datasets)) {
        setDatasets(datasets);
        actions.setDataset(datasets[0].name);
      }
    });
  }, [datasetString, actions]);

  return datasets.length > 0 ? (
    <div>
      <Provider store={store}>
        <Navbar
          actions={actions}
          datasets={datasets}
          setDataset={setSelectedDataset}
        />
      </Provider>
    </div>
  ) : null;
};

(App as any).whyDidYouRender = true;

export default App;
