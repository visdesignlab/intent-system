export enum DimensionType {
  X = "X",
  Y = "Y",
  SPM = "SPM"
}

export type Dimension<T> = {
  type: DimensionType;
  label: string;
  values: T[];
};
