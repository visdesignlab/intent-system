import {Dataset, ColumnMap, emptyDataset} from '../../Types/Dataset';
import {Action, Reducer} from 'redux';
import {text} from 'd3';
import {VisualizationProvenance} from '../../..';
import {recordableReduxActionCreator} from '@visdesignlab/provenance-lib-core/lib/src';

export const DATASET_UPDATE = 'DATASET_UPDATE';
export type DATASET_UPDATE = typeof DATASET_UPDATE;

interface DatasetUpdateAction extends Action<DATASET_UPDATE> {
  type: DATASET_UPDATE;
  args: Dataset;
}

export const updateDataset = (dataset: Dataset) =>
  recordableReduxActionCreator(
    `Load Dataset: ${dataset.name}`,
    DATASET_UPDATE,
    dataset,
  );

export const DatasetReducer: Reducer<Dataset, DatasetUpdateAction> = (
  current: Dataset = emptyDataset(),
  action: DatasetUpdateAction,
) => {
  switch (action.type) {
    case DATASET_UPDATE:
      return action.args;
    default:
      return current;
  }
};

export const loadDataset = async (url: string) => {
  const rawDataset = await text(url);
  const dataset = rawDataset.replace(/\bNaN\b/g, 'null');
  let {
    labelColumn,
    name,
    values,
    column_header_map,
  }: {
    labelColumn: string;
    name: string;
    values: any[];
    column_header_map: ColumnMap;
  } = JSON.parse(dataset);

  const columns: string[] = Object.keys(column_header_map);
  const numericColumns: string[] = Object.keys(column_header_map).filter(
    col => column_header_map[col].type === 'numeric',
  );
  const categoricalColumns: string[] = Object.keys(column_header_map).filter(
    col => column_header_map[col].type === 'categorical',
  );
  values = Object.keys(values).map((r: any) => values[r]);

  const parsedDataset: Dataset = {
    ...emptyDataset(),
    labelColumn,
    name,
    columns,
    numericColumns,
    categoricalColumns,
    data: values,
    columnMaps: column_header_map,
  };

  VisualizationProvenance.apply(updateDataset(parsedDataset));

  // console.log(VisualizationProvenance.graph().current.state);
  // console.table(Object.values(VisualizationProvenance.graph().nodes));
  return parsedDataset;
};
