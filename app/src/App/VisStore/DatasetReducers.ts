import { text } from 'd3';
import { Action, Dispatch, Reducer } from 'redux';

import { ColumnMetaData, Dataset, emptyDataset } from './Dataset';

export enum DatasetActions {
  LOAD_DATASET = "LOAD_DATASET"
}

export interface DatasetAction extends Action<DatasetActions> {
  type: DatasetActions;
  args: Dataset;
}

export const DatasetReducer: Reducer<Dataset, DatasetAction> = (
  current: Dataset = emptyDataset(),
  action: DatasetAction
) => {
  switch (action.type) {
    case DatasetActions.LOAD_DATASET:
      return action.args;
    default:
      return current;
  }
};

export function loadDataset(url: string) {
  return (dispatch: Dispatch<DatasetAction>) => {
    text(url)
      .then(d => {
        const rawData = d.replace(/\bNaN\b/g, "null");
        let {
          labelColumn,
          name,
          values,
          column_header_map
        }: {
          labelColumn: string;
          name: string;
          values: any[];
          column_header_map: { [key: string]: ColumnMetaData };
        } = JSON.parse(rawData);

        const columns: string[] = Object.keys(column_header_map);
        const numericColumns: string[] = Object.keys(column_header_map).filter(
          k => column_header_map[k].type === "numeric"
        );
        const categoricalColumns: string[] = Object.keys(
          column_header_map
        ).filter(k => column_header_map[k].type === "categorical");
        values = Object.keys(values).map((r: any) => values[r]);

        dispatch({
          type: DatasetActions.LOAD_DATASET,
          args: {
            ...emptyDataset(),
            labelColumn,
            name,
            columns,
            numericColumns,
            categoricalColumns,
            data: values,
            columnMaps: column_header_map
          }
        });
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  };
}
