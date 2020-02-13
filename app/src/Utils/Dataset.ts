export interface Dataset {
  key: string;
  name: string;
}

export type Datasets = Dataset[];

export type ColumnDef = {
  short: string;
  text: string;
  type: string;
  unit: string;
};

export type ColumnMap = {[key: string]: ColumnDef};

export interface Data {
  name: string;
  labelColumn: string;
  values: any[];
  columnMap: ColumnMap;
  columns: string[];
  categoricalColumns: string[];
  numericColumns: string[];
}

export function loadData(dataset: any): Data {
  const {name, labelColumn, values, column_header_map} = dataset;
  const columnMap: ColumnMap = column_header_map;

  const columns: string[] = Object.keys(columnMap);
  const numericColumns: string[] = Object.keys(columnMap).filter(
    col => columnMap[col].type === 'numeric',
  );
  const categoricalColumns: string[] = Object.keys(columnMap).filter(
    col => columnMap[col].type === 'categorical',
  );

  return {
    name,
    labelColumn,
    columnMap,
    values: Object.values(values),
    columns,
    categoricalColumns,
    numericColumns,
  };
}
