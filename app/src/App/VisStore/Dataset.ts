export interface Dataset {
  name: string;
  labelColumn: string;
  numericColumns: string[];
  data: any[];
  columns: string[];
}

export function emptyDataset(): Dataset {
  return {
    name: "",
    labelColumn: "",
    numericColumns: [],
    columns: [],
    data: []
  };
}
