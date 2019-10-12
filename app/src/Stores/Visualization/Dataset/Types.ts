import {Dataset, ColumnMap, emptyDataset} from '../../Types/Dataset';
import {Action, Dispatch, Reducer} from 'redux';
import {text} from 'd3';

export const DATASET_UPDATE = 'DATASET_UPDATE';
export type DATASET_UPDATE = typeof DATASET_UPDATE;

interface DatasetUpdateAction extends Action<DATASET_UPDATE> {
  type: DATASET_UPDATE;
  args: Dataset;
}

export const updateDataset = (dataset: Dataset): DatasetUpdateAction => {
  return {
    type: DATASET_UPDATE,
    args: dataset,
  };
};

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

export const loadDataset = (url: string) => {
  return (dispatch: Dispatch<DatasetUpdateAction>) => {
    text(url)
      .then(rawDataset => {
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
        const categoricalColumns: string[] = Object.keys(
          column_header_map,
        ).filter(col => column_header_map[col].type === 'categorical');
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

        console.log(parsedDataset);

        dispatch({
          type: DATASET_UPDATE,
          args: parsedDataset,
        });
      })
      .catch(err => {
        console.error(err);
        throw new Error(err);
      });
  };
};
