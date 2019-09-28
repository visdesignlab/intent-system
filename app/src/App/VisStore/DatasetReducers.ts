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

        let columns: string[] = [];
        let numericColumns: string[] = [];
        values = Object.keys(values).map((r: any) => values[r]);

        if (values.length > 0) {
          columns = Object.keys(values[0]);
          numericColumns = columns.filter(
            col => col !== labelColumn && !isNaN(values[0][col])
          );
        }
        dispatch({
          type: DatasetActions.LOAD_DATASET,
          args: {
            ...emptyDataset(),
            labelColumn,
            name,
            columns,
            numericColumns,
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
