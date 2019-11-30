export interface Dataset {
  name: string;
  labelColumn: string;
  numericColumns: string[];
  data: any[];
  columns: string[];
  columnMaps: {[key: string]: ColumnMetaData};
  categoricalColumns: string[];
  hashLookup: {[key: string]: any};
  indexHash: {[key: number]: string};
}

export type ColumnMap = {[key: string]: ColumnMetaData};

export interface ColumnMetaData {
  text: string;
  unit: string;
  type: string;
  short: string;
}

export const HASH = 'HASH';

export function emptyDataset(): Dataset {
  return {
    name: '',
    labelColumn: '',
    numericColumns: [],
    columns: [],
    data: [],
    columnMaps: {},
    categoricalColumns: [],
    hashLookup: {},
    indexHash: {},
  };
}
