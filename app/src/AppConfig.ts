export type Mode = 'default' | 'study';
export type ShowCategories = 'show' | 'hide';

export type AppConfig = {
  mode: Mode;
  datasetName: string;
  showCategories: ShowCategories;
};
