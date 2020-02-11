import React, {FC, useEffect} from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Dropdown} from 'semantic-ui-react';
import {ProvVis} from '@visdesignlab/provvis';

interface NavbarProps {
  store?: any;
  datasets: any[];
  actions: any;
  setDataset: (d: string) => void;
}

function Navbar({store, actions, datasets, setDataset}: NavbarProps) {
  const {dataset, graph, multiBrushBehaviour} = store!;

  const datasetOptions = datasets.map(d => ({
    key: d.key,
    value: d.name,
    text: d.name,
  }));

  return (
    <div>
      <div>{dataset}</div>
      <Dropdown
        key={dataset}
        options={datasetOptions}
        defaultValue={dataset}
        onChange={(_, data: any) => {
          setDataset(data.value);
        }}
      />
      <Button
        onClick={() =>
          actions.setMulti(
            multiBrushBehaviour === 'Union' ? 'Intersection' : 'Union',
          )
        }>
        Update
      </Button>
      {graph && (
        <ProvVis
          graph={graph}
          current={graph.current}
          root={graph.root}
          nodeMap={graph.nodes}
        />
      )}
    </div>
  );
}

export default inject('store')(observer(Navbar));
