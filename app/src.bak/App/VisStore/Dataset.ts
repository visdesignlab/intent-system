export interface Dataset {
  name: string;
  labelColumn: string;
  numericColumns: string[];
  data: any[];
  columns: string[];
  columnMaps: {[key: string]: ColumnMetaData};
  categoricalColumns: string[];
}

export type ColumnMap = {[key: string]: ColumnMetaData};

export interface ColumnMetaData {
  text: string;
  unit: string;
  type: string;
  short: string;
}

export function emptyDataset(): Dataset {
  return {
    name: '',
    labelColumn: '',
    numericColumns: [],
    columns: [],
    data: [],
    columnMaps: {},
    categoricalColumns: [],
  };
}
