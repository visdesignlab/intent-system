import json
import pandas as pd
import numpy as np
from .dimensions import Dimensions
from typing import Dict, Set


class Dataset:
    def __init__(self,
                 label: str,
                 data: pd.DataFrame,
                 name: str,
                 columnHeaderMap: Dict = {}) -> None:
        self.label: str = label
        self.data: pd.DataFrame = data.reset_index(drop=True)
        self.name: str = name
        self.columnHeaderMap = columnHeaderMap

    def to_dict(self) -> Dict:
        output = {'labelColumn': self.label,
                  'name': self.name,
                  'column_header_map': self.columnHeaderMap}
        output['values'] = self.data.T.to_dict()
        return output

    def labels(self) -> pd.DataFrame:
        return self.data[self.label]

    def numerical(self) -> pd.DataFrame:
        return self.data.select_dtypes(include='number')

    def categorical(self) -> pd.DataFrame:
        cats = list(self.data.select_dtypes(exclude='number').columns)
        cats.remove(self.label)
        return self.data[cats]

    def subset(self, dims: Dimensions) -> pd.DataFrame:
        return self.data[dims.indices()]

    def selection(self, rows: Set[int]) -> np.ndarray:
        arr = np.zeros((len(self.data), 1))
        for r in rows:
            arr.itemset((r, 0), 1)
        return arr

    @staticmethod
    def from_json_file(filename: str, name: str) -> 'Dataset':
        with open(filename) as read_file:
            raw_json = json.load(read_file)
            label = raw_json['labelColumn']
            data = pd.DataFrame.from_dict(raw_json['values'], orient='index')
            return Dataset(label, data, name)

    @staticmethod
    def load_nba_data() -> 'Dataset':
        df = pd.read_csv('data/nba_all_seasons.csv')
        is_season = df['season'] == '2016-17'
        return Dataset('player_name', df[is_season].drop(columns=[
            'Unnamed: 0',
            'season',
            'college',
            'country',
            'team_abbreviation',
            'draft_year',
            'draft_number',
        ]), 'NBA Players')

    @staticmethod
    def load_coculture_control() -> 'Dataset':
        df = pd.read_csv('data/MDAMB231MacrophageCocultureControl.csv')

        df['cat'] = '1'

        return Dataset('Label', df.astype({"Label": str}),
                       'MDAMB231 Macrophage Coculture Control', {
            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Mass': {
                'text': "Mass",
                'unit': '',
                'short': 'B',
                'type': 'numeric'
            },
            'GrowthRate': {
                'text': "Growth Rate",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_coculture_mito() -> 'Dataset':
        df = pd.read_csv('data/MDAMB231MacrophageCocultureMitoTransfer.csv')

        df['cat'] = '1'

        return Dataset('Label', df.astype({"Label": str}),
                       'MDAMB231 Macrophage Coculture Mito Transfer', {
            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Mass': {
                'text': "Mass",
                'unit': '',
                'short': 'B',
                'type': 'numeric'
            },
            'GrowthRate': {
                'text': "Growth Rate",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_macro_control() -> 'Dataset':
        df = pd.read_csv('data/MDAMB231MacrophageInjectedControl.csv')

        df['cat'] = '1'

        return Dataset('Label', df.astype({"Label": str}),
                       'MDAMB231 Macrophage Injected Control', {
            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Mass': {
                'text': "Mass",
                'unit': '',
                'short': 'B',
                'type': 'numeric'
            },
            'GrowthRate': {
                'text': "Growth Rate",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_quad_easy_training_1() -> 'Dataset':
        df = pd.read_csv('data/quad_easy_training_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Quadratic Easy Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_quad_easy_task_1() -> 'Dataset':
        df = pd.read_csv('data/quad_easy_task_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Quadratic Easy 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_quad_easy_task_2() -> 'Dataset':
        df = pd.read_csv('data/quad_easy_task_2.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Quadratic Easy 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_quad_med_training_1() -> 'Dataset':
        df = pd.read_csv('data/quad_med_training_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Quadratic Medium Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_quad_med_task_1() -> 'Dataset':
        df = pd.read_csv('data/quad_med_task_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Quadratic Medium 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_quad_med_task_2() -> 'Dataset':
        df = pd.read_csv('data/quad_med_task_2.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Quadratic Medium 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_quad_hard_training_1() -> 'Dataset':
        df = pd.read_csv('data/quad_hard_training_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Quadratic Hard Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_quad_hard_task_1() -> 'Dataset':
        df = pd.read_csv('data/quad_hard_task_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Quadratic Hard 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_quad_hard_task_2() -> 'Dataset':
        df = pd.read_csv('data/quad_hard_task_2.csv')


        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Quadratic Hard 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_sky_easy_training_1() -> 'Dataset':
        df = pd.read_csv('data/sky_easy_training_1.csv')

        df['cat'] = '1'



        convert_dict = {
            'Distance': 'float',
            'CostPerNight': 'float',
            'Label': 'category',
            'cat':'category'
        }

        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'MVO Easy Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Distance': {
                'text': 'Distance',
                'unit': 'Miles',
                'short': 'B',
                'type': 'numeric',
            },
            'CostPerNight': {
                'text': "Cost Per Night",
                'unit': 'Dollars',
                'short': 'C',
                'type': 'numeric'
            },
            'cat': {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_sky_easy_task_1() -> 'Dataset':
        df = pd.read_csv('data/sky_easy_task_1.csv')

        df['cat'] = '1'


        convert_dict = {
            'Distance': 'float',
            'CostPerNight': 'float',
            'Label': 'category',
            'cat':'category'
        }

        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'MVO Easy 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Distance': {
                'text': 'Distance',
                'unit': 'Miles',
                'short': 'B',
                'type': 'numeric',
            },
            'CostPerNight': {
                'text': "Cost Per Night",
                'unit': 'Dollars',
                'short': 'C',
                'type': 'numeric'
            },
            'cat': {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_sky_easy_task_2() -> 'Dataset':
        df = pd.read_csv('data/sky_easy_task_2.csv')

        df['cat'] = '1'



        convert_dict = {
            'Distance': 'float',
            'CostPerNight': 'float',
            'Label': 'category',
            'cat':'category'
        }

        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'MVO Easy 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Distance': {
                'text': 'Distance',
                'unit': 'Miles',
                'short': 'B',
                'type': 'numeric',
            },
            'CostPerNight': {
                'text': "Cost Per Night",
                'unit': 'Dollars',
                'short': 'C',
                'type': 'numeric'
            },
            'cat': {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_sky_med_training_1() -> 'Dataset':
        df = pd.read_csv('data/sky_med_training_1.csv')

        df['cat'] = '1'



        convert_dict = {
            'Distance': 'float',
            'CostPerNight': 'float',
            'Label': 'category',
            'cat':'category'
        }

        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'MVO Medium Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Distance': {
                'text': 'Distance',
                'unit': 'Miles',
                'short': 'B',
                'type': 'numeric',
            },
            'CostPerNight': {
                'text': "Cost Per Night",
                'unit': 'Dollars',
                'short': 'C',
                'type': 'numeric'
            },
            'cat': {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_sky_med_task_1() -> 'Dataset':
        df = pd.read_csv('data/sky_med_task_1.csv')

        df['cat'] = '1'


        convert_dict = {
            'Distance': 'float',
            'CostPerNight': 'float',
            'Label': 'category',
            'cat':'category'
        }

        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'MVO Medium 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Distance': {
                'text': 'Distance',
                'unit': 'Miles',
                'short': 'B',
                'type': 'numeric',
            },
            'CostPerNight': {
                'text': "Cost Per Night",
                'unit': 'Dollars',
                'short': 'C',
                'type': 'numeric'
            },
            'cat': {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_sky_med_task_2() -> 'Dataset':
        df = pd.read_csv('data/sky_med_task_2.csv')

        df['cat'] = '1'



        convert_dict = {
            'Distance': 'float',
            'CostPerNight': 'float',
            'Label': 'category',
            'cat':'category'
        }

        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'MVO Medium 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Distance': {
                'text': 'Distance',
                'unit': 'Miles',
                'short': 'B',
                'type': 'numeric',
            },
            'CostPerNight': {
                'text': "Cost Per Night",
                'unit': 'Dollars',
                'short': 'C',
                'type': 'numeric'
            },
            'cat': {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_sky_hard_training_1() -> 'Dataset':
        df = pd.read_csv('data/sky_hard_training_1.csv')

        df['cat'] = '1'



        convert_dict = {
            'Distance': 'float',
            'CostPerNight': 'float',
            'Label': 'category',
            'cat':'category'
        }

        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'MVO Hard Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Distance': {
                'text': 'Distance',
                'unit': 'Miles',
                'short': 'B',
                'type': 'numeric',
            },
            'CostPerNight': {
                'text': "Cost Per Night",
                'unit': 'Dollars',
                'short': 'C',
                'type': 'numeric'
            },
            'cat': {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_sky_hard_task_1() -> 'Dataset':
        df = pd.read_csv('data/sky_hard_task_1.csv')

        df['cat'] = '1'



        convert_dict = {
            'Distance': 'float',
            'CostPerNight': 'float',
            'Label': 'category',
            'cat':'category'
        }

        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'MVO Hard 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Distance': {
                'text': 'Distance',
                'unit': 'Miles',
                'short': 'B',
                'type': 'numeric',
            },
            'CostPerNight': {
                'text': "Cost Per Night",
                'unit': 'Dollars',
                'short': 'C',
                'type': 'numeric'
            },
            'cat': {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_sky_hard_task_2() -> 'Dataset':
        df = pd.read_csv('data/sky_hard_task_2.csv')

        df['cat'] = '1'



        convert_dict = {
            'Distance': 'float',
            'CostPerNight': 'float',
            'Label': 'category',
            'cat':'category'
        }

        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'MVO Hard 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Distance': {
                'text': 'Distance',
                'unit': 'Miles',
                'short': 'B',
                'type': 'numeric',
            },
            'CostPerNight': {
                'text': "Cost Per Night",
                'unit': 'Dollars',
                'short': 'C',
                'type': 'numeric'
            },
            'cat': {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })



    @staticmethod
    def load_cluster_easy_training_1() -> 'Dataset':
        df = pd.read_csv('data/cluster_easy_training_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Cluster Easy Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cluster_easy_task_1() -> 'Dataset':
        df = pd.read_csv('data/cluster_easy_task_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Cluster Easy 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cluster_easy_task_2() -> 'Dataset':
        df = pd.read_csv('data/cluster_easy_task_2.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Cluster Easy 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cluster_med_training_1() -> 'Dataset':
        df = pd.read_csv('data/cluster_med_training_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Cluster Medium Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cluster_med_task_1() -> 'Dataset':
        df = pd.read_csv('data/cluster_med_task_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Cluster Medium 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cluster_med_task_2() -> 'Dataset':
        df = pd.read_csv('data/cluster_med_task_2.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Cluster Medium 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cluster_hard_training_1() -> 'Dataset':
        df = pd.read_csv('data/cluster_hard_training_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Cluster Hard Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cluster_hard_task_1() -> 'Dataset':
        df = pd.read_csv('data/cluster_hard_task_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Cluster Hard 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cluster_hard_task_2() -> 'Dataset':
        df = pd.read_csv('data/cluster_hard_task_2.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Cluster Hard 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cat_easy_task_1() -> 'Dataset':
        df = pd.read_csv('data/cat_easy_task_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Easy 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_cat_easy_task_2() -> 'Dataset':
        df = pd.read_csv('data/cat_easy_task_2.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Easy 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cat_easy_training_1() -> 'Dataset':
        df = pd.read_csv('data/cat_easy_training_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Easy Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cat_hard_task_1() -> 'Dataset':
        df = pd.read_csv('data/cat_hard_task_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Hard 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cat_hard_task_2() -> 'Dataset':
        df = pd.read_csv('data/cat_hard_task_2.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Hard 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cat_hard_task_3() -> 'Dataset':
        df = pd.read_csv('data/cat_hard_task_3.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Hard 3', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cat_hard_task_4() -> 'Dataset':
        df = pd.read_csv('data/cat_hard_task_4.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Hard 4', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cat_hard_training_1() -> 'Dataset':
        df = pd.read_csv('data/cat_hard_training_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Hard Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cat_med_task_1() -> 'Dataset':
        df = pd.read_csv('data/cat_med_task_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Medium 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_cat_med_task_2() -> 'Dataset':
        df = pd.read_csv('data/cat_med_task_2.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Medium 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cat_med_task_3() -> 'Dataset':
        df = pd.read_csv('data/cat_med_task_3.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Medium 3', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cat_med_task_4() -> 'Dataset':
        df = pd.read_csv('data/cat_med_task_4.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Medium 4', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_cat_med_training_1() -> 'Dataset':
        df = pd.read_csv('data/cat_med_training_1.csv')


        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'Cluster': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Cluster'] = df['Cluster'].apply(str)

        return Dataset('Label', df,
                       'Category Medium Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Cluster': {
                'text': "Cluster",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_lin_easy_task_1() -> 'Dataset':
        df = pd.read_csv('data/lin_easy_task_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Linear Easy 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_lin_easy_training_1() -> 'Dataset':
        df = pd.read_csv('data/lin_easy_training_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Linear Easy Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })


    @staticmethod
    def load_lin_easy_task_2() -> 'Dataset':
        df = pd.read_csv('data/lin_easy_task_2.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Linear Easy 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_lin_hard_task_1() -> 'Dataset':
        df = pd.read_csv('data/lin_hard_task_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Linear Hard 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_lin_hard_task_2() -> 'Dataset':
        df = pd.read_csv('data/lin_hard_task_2.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Linear Hard 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_lin_hard_training_1() -> 'Dataset':
        df = pd.read_csv('data/lin_hard_training_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Linear Hard Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_lin_med_task_1() -> 'Dataset':
        df = pd.read_csv('data/lin_med_task_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Linear Medium 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_lin_med_task_2() -> 'Dataset':
        df = pd.read_csv('data/lin_med_task_2.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Linear Medium 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_lin_med_training_1() -> 'Dataset':
        df = pd.read_csv('data/lin_med_training_1.csv')

        df['cat'] = '1'

        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Linear Medium Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_out_easy_training_1() -> 'Dataset':
        df = pd.read_csv('data/out_easy_training_1.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Cluster) Easy Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_easy_task_1() -> 'Dataset':
        df = pd.read_csv('data/out_easy_task_1.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Cluster) Easy 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_easy_task_2() -> 'Dataset':
        df = pd.read_csv('data/out_easy_task_2.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Cluster) Easy 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })
    @staticmethod
    def load_out_easy_task_3() -> 'Dataset':
        df = pd.read_csv('data/out_easy_task_3.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Linear) Easy 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_easy_task_4() -> 'Dataset':
        df = pd.read_csv('data/out_easy_task_4.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Linear) Easy 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_easy_task_5() -> 'Dataset':
        df = pd.read_csv('data/out_easy_task_5.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Quadratic) Easy', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })



    @staticmethod
    def load_out_med_training_1() -> 'Dataset':
        df = pd.read_csv('data/out_med_training_1.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Cluster) Medium Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_med_task_1() -> 'Dataset':
        df = pd.read_csv('data/out_med_task_1.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Cluster) Medium 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_med_task_2() -> 'Dataset':
        df = pd.read_csv('data/out_med_task_2.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Cluster) Medium 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })
    @staticmethod
    def load_out_med_task_3() -> 'Dataset':
        df = pd.read_csv('data/out_med_task_3.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Linear) Medium 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_med_task_4() -> 'Dataset':
        df = pd.read_csv('data/out_med_task_4.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Linear) Medium 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_med_task_5() -> 'Dataset':
        df = pd.read_csv('data/out_med_task_5.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Quadratic) Medium', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })



    @staticmethod
    def load_out_hard_training_1() -> 'Dataset':
        df = pd.read_csv('data/out_hard_training_1.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Cluster) Hard Training', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_hard_task_1() -> 'Dataset':
        df = pd.read_csv('data/out_hard_task_1.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Cluster) Hard 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_hard_task_2() -> 'Dataset':
        df = pd.read_csv('data/out_hard_task_2.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Cluster) Hard 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })
    @staticmethod
    def load_out_hard_task_3() -> 'Dataset':
        df = pd.read_csv('data/out_hard_task_3.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Linear) Hard 1', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_hard_task_4() -> 'Dataset':
        df = pd.read_csv('data/out_hard_task_4.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Linear) Hard 2', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })

    @staticmethod
    def load_out_hard_task_5() -> 'Dataset':
        df = pd.read_csv('data/out_hard_task_5.csv')

        df['cat'] = '1'
        df["Label"] = 0

        for i in range(0, len(df["Label"])):
            df.loc[i, ('Label')] = i


        convert_dict = {
            'X': 'float',
            'Y': 'float',
            'Label': 'category',
            'cat': 'category'
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Outlier (Curve) Hard', {

            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'X': {
                'text': 'X',
                'unit': '',
                'short': 'B',
                'type': 'numeric',
            },
            'Y': {
                'text': "Y",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            },
        })



    @staticmethod
    def load_macro_mito() -> 'Dataset':
        df = pd.read_csv('data/MDAMB231MacrophageInjectedMitoTransfer.csv')

        df['cat'] = '1'

        return Dataset('Label', df.astype({"Label": str}),
                       'MDAMB231 Macrophage Injected Mito Transfer', {
            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'A',
                'type': 'label',
            },
            'Mass': {
                'text': "Mass",
                'unit': '',
                'short': 'B',
                'type': 'numeric'
            },
            'GrowthRate': {
                'text': "Growth Rate",
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            "cat": {
                'text': "cat",
                'unit': '',
                'short': 'D',
                'type': 'categorical'
            }
        })

    @staticmethod
    def load_draft_combine_data() -> 'Dataset':
        df = pd.read_csv(
            'data/2018_draft_combine.csv',
            usecols=[
                'Name',
                'Draft Grade',
                '40 Yard Dash',
                'Bench Press',
                'Vertical Jump',
                'Broad Jump',
                'Three Cone Drill',
                '20 Yard Shuttle',
                '60 Yard Shuttle',
                'Height',
                'Weight',
                'Arm Length',
                'Hand Size',
                'Position',
            ],
        )
        df['Name'] = df['Name'] + ' (' + df['Position'] + ')'
        return Dataset('Name', df, 'NFL Draft Combine')

    @staticmethod
    def load_gapminderworld_data() -> 'Dataset':
        df = pd.read_csv('data/gapminderworld.csv')
        return Dataset('country', df, 'Gapminder World', {
            'cmu': {
                'text': 'Child Mortality Rate',
                'unit': '0-5 year-old dying per 1000 born',
                'short': 'A',
                'type': 'numeric',
            },
            'gdp': {
                'text': "GDP",
                'unit': 'per capita',
                'short': 'B',
                'type': 'numeric'
            },
            'life': {
                'text': 'Life Expectancy',
                'unit': 'Years',
                'short': 'C',
                'type': 'numeric'
            },
            'tfr': {
                'text': 'Total Fertility Rate',
                'unit': 'babies per woman',
                'short': 'D',
                'type': 'numeric'
            },
            'population': {
                'text': 'Population',
                'unit': 'number of people',
                'short': 'E',
                'type': 'numeric'
            },
            'continent': {
                'text': 'Continent',
                'unit': 'Categorical',
                'short': 'F',
                'type': 'categorical'
            },
            'country': {
                'text': 'Country',
                'unit': 'label',
                'short': 'G',
                'type': 'label'
            }
        })

    @staticmethod
    def load_cluster_data() -> 'Dataset':
        df = pd.read_csv('data/clusters.csv')
        convert_dict = {
            'Math': 'float',
            'Physics': 'float',
            'CS': 'float',
            'Label': 'category',
            'Profession': 'category',
        }
        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)
        df['Profession'] = df['Profession'].apply(str)

        return Dataset('Label', df, 'Clusters', {
            'Math': {
                'text': 'Math',
                'unit': "",
                'short': 'A',
                'type': 'numeric'
            },

            'Physics': {
                'text': 'Physics',
                'unit': "",
                'short': 'B',
                'type': 'numeric'
            },
            'CS': {
                'text': 'CS',
                'unit': "",
                'short': 'C',
                'type': 'numeric'
            },
            'Profession': {
                'text': 'Profession',
                'unit': 'Categorical',
                'short': 'D',
                'type': 'categorical'
            },
            'Label': {
                'text': 'Label',
                'unit': 'label',
                'short': 'E',
                'type': 'label'
            },
        })

    @staticmethod
    def load_depression_data() -> 'Dataset':
        df = pd.read_csv('data/depression_dataset.csv')
        convert_dict = {
            "rsn": 'category',
            "age": 'int',
            "gender": 'category',
            "race": 'category',
                    "bmi": 'float',
                    "srwcurr": 'float',
                    "srw1yr": 'float',
                    "vitd": 'float',
                    "glyco": 'float',
                    "sys1": 'float',
                    "sys2": 'float',
                    "sys3": 'float',
                    "cholestrol": 'float',
                    "sodium": 'float',
                    "depression": 'float'
        }
        df = df.astype(convert_dict)

        return Dataset('rsn', df, 'Depression Dataset', {
            "rsn": {
                'text': 'Respondent sequence number',
                'unit': '',
                "short": "A",
                "type": ""

            },
            "gender": {
                'text': 'Gender',
                'unit': '',
                "short": "C",
                "type": "categorical"

            },
            "race": {
                'text': 'Race',
                'unit': '',
                "short": "D",
                "type": "categorical"

            },
            "depression": {
                'text': 'Depression',
                'unit': '',
                "short": "O",
                "type": "numeric"
            },
            "bmi": {
                'text': 'BMI',
                'unit': 'kg/m**2',
                "short": "E",
                "type": "numeric"

            },
            "srwcurr": {
                'text': 'Current Weight (self reported)',
                'unit': 'pounds',
                "short": "F",
                "type": "numeric"

            },
            "age": {
                'text': 'Age',
                'unit': 'Years',
                "short": "B",
                "type": "numeric"

            },
            "srw1yr": {
                'text': 'Weight 1 year ago (self reported)',
                'unit': 'pounds',
                "short": "G",
                "type": "numeric"

            },
            "vitd": {
                'text': 'Vitamin D',
                'unit': 'ng/mL',
                "short": "H",
                "type": "numeric"

            },
            "glyco": {
                'text': 'Glycohemoglobin',
                'unit': '%',
                "short": "I",
                "type": "numeric"

            },
            "sys1": {
                'text': 'Systolic BP 1st rdg',
                'unit': 'mm Hg',
                "short": "J",
                "type": "numeric"

            },
            "sys2": {
                'text': 'Systolic BP 2nd rdg',
                'unit': 'mm Hg',
                "short": "K",
                "type": "numeric"

            },
            "sys3": {
                'text': 'Systolic BP 3rd rdg',
                'unit': 'mm Hg',
                "short": "L",
                "type": "numeric"

            },
            "cholestrol": {
                'text': 'Cholesterol',
                'unit': 'mmol/L',
                "short": "M",
                "type": "numeric"

            },
            "sodium": {
                'text': 'Sodium',
                'unit': 'mmol/L',
                "short": "N",
                "type": "numeric"

            },
        })

    @staticmethod
    def load_housing_data() -> 'Dataset':
        df = pd.read_csv('data/housing.csv')

        selection = df[[
            'ListNo',
            'Acres',
            'BsmntFin',
            'Deck',
            'Style',
            'EWCoord',
            'GaragCap',
            'HouseNbr',
            'LstPrice',
            'NSCoord',
            'Taxes',
            'TotBed',
            'TotBth',
            'TotSqf',
            'YearBlt',
        ]]
        # Remove some outliers
        selection = selection[selection.Acres < 1]
        selection = selection[selection.Deck < 6]
        selection = selection[selection.Taxes < 50000]

        return Dataset('ListNo', selection.astype({'ListNo': str}), 'SLC Housing', {
            'ListNo': {
                'text': 'Listing No',
                'unit': 'label',
                'short': 'A',
                'type': 'label'
            },
            'Acres': {
                'text': 'Acres',
                'unit': '',
                'short': 'B',
                'type': 'numeric'
            },
            'BsmntFin': {
                'text': 'Basement Finish',
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Deck': {
                'text': 'Deck',
                'unit': '',
                'short': 'D',
                'type': 'numeric'
            },
            'Style': {
                'text': 'Style',
                'unit': '',
                'short': 'E',
                'type': 'categorical'
            },
            'EWCoord': {
                'text': 'Longitude',
                'unit': '',
                'short': 'F',
                'type': 'numeric'
            },
            'GaragCap': {
                'text': 'Garage Capcity',
                'unit': '',
                'short': 'G',
                'type': 'numeric'
            },
            'HouseNbr': {
                'text': 'House Number',
                'unit': '',
                'short': 'H',
                'type': 'numeric'
            },
            'LstPrice': {
                'text': 'List Price',
                'unit': '$',
                'short': 'I',
                'type': 'numeric'
            },
            'NSCoord': {
                'text': 'Latitude',
                'unit': '',
                'short': 'J',
                'type': 'numeric'
            },
            'Taxes': {
                'text': 'Taxes',
                'unit': '$',
                'short': 'K',
                'type': 'numeric'
            },
            'TotBed': {
                'text': 'Total Bedrooms',
                'unit': '#',
                'short': 'L',
                'type': 'numeric'
            },
            'TotBth': {
                'text': 'Total Bathrooms',
                'unit': '',
                'short': 'M',
                'type': 'numeric'
            },
            'TotSqf': {
                'text': 'Total Square Footage',
                'unit': 'sq. ft.',
                'short': 'N',
                'type': 'numeric'
            },
            'YearBlt': {
                'text': 'Year Built',
                'unit': '',
                'short': 'O',
                'type': 'numeric'
            },
        })

    @staticmethod
    def load_nba_raptor_data() -> 'Dataset':
        df = pd.read_csv('data/modern_RAPTOR_by_player.csv')
        # is_season = df['season'] == 2019

        # df = df[is_season]
        enough_mp = df[(df['season'] == 2019) & (df["mp"] >= 1500)]

        df = enough_mp

        df.astype({'season': str})
        df["player_name"] = df["player_name"].map(
            str) + df["season"].map(lambda x: " (" + str(x) + ")")

        selection = df[[
            'player_name',
            'raptor_offense',
            'raptor_defense',
            'war_reg_season',
            'war_playoffs',
            'PPG',
            'BPG',
            'APG',
            'SPG',
            '3P%',
            'season'
        ]]

        convert_dict = {
            'player_name': 'category',
            'raptor_offense': 'float',
            'raptor_defense': 'float',
            'war_reg_season': 'float',
            'war_playoffs': 'float',
            'PPG': 'float',
            'BPG': 'float',
            'APG': 'float',
            'SPG': 'float',
            '3P%': 'float',
            'season': 'category'
        }

        return Dataset('player_name', selection.astype(convert_dict),
                       'NBA Raptor Scores (Top Players)', {
            'player_name': {
                'text': 'Name',
                'unit': '',
                'short': 'A',
                'type': 'label'
            },
            'raptor_offense': {
                'text': 'Raptor Offense',
                'unit': '',
                'short': 'B',
                'type': 'numeric'
            },
            'raptor_defense': {
                'text': 'Raptor Defense',
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'war_reg_season': {
                'text': 'WAR Regular Season',
                'unit': '',
                'short': 'D',
                'type': 'numeric'
            },
            'war_playoffs': {
                'text': 'WAR Playoffs',
                'unit': '',
                'short': 'E',
                'type': 'numeric'
            },

            'PPG': {
                'text': 'Points Per Game',
                'unit': '',
                'short': 'F',
                'type': 'numeric'
            },
            'BPG': {
                'text': 'Blocks Per Game',
                'unit': '',
                'short': 'G',
                'type': 'numeric'
            },
            'APG': {
                'text': 'Assists Per Game',
                'unit': '',
                'short': 'H',
                'type': 'numeric'
            },
            'SPG': {
                'text': 'Steals Per Game',
                'unit': '',
                'short': 'I',
                'type': 'numeric'
            },
            '3P%': {
                'text': 'Three Point Percentage',
                'unit': '',
                'short': 'J',
                'type': 'numeric'
            },
            'season': {
                'text': 'Season',
                'unit': '',
                'short': 'K',
                'type': 'categorical'
            },
        })


    @staticmethod
    def load_iris_data() -> 'Dataset':
        df = pd.read_csv('data/iris.csv')

        df['Label'] = 0

        for i in range(0, len(df['Label'])):
            df.loc[i, ('Label')] = i

        convert_dict = {
            'Label': 'category',
            'sepal_length': 'float',
            'sepal_width': 'float',
            'petal_length': 'float',
            'petal_width': 'float',
            'species': 'category'
        }

        df = df.astype(convert_dict)
        df['Label'] = df['Label'].apply(str)

        return Dataset('Label', df,
                       'Iris Dataset', {
            'Label': {
                'text': 'Index',
                'unit': '',
                'short': 'A',
                'type': 'label'
            },
            'sepal_length': {
                'text': 'Sepal Length',
                'unit': '',
                'short': 'B',
                'type': 'numeric'
            },
            'sepal_width': {
                'text': 'Sepal Width',
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'petal_length': {
                'text': 'Petal Length',
                'unit': '',
                'short': 'D',
                'type': 'numeric'
            },
            'petal_width': {
                'text': 'Petal Width',
                'unit': '',
                'short': 'E',
                'type': 'numeric'
            },

            'species': {
                'text': 'Species',
                'unit': '',
                'short': 'F',
                'type': 'category'
            },
        })

    @staticmethod
    def load_sp500_data() -> 'Dataset':
        df = pd.read_csv('data/sp500/constituents-financials.csv')

        selection = df[[
            'Name',
            'Price',
            'Earnings/Share',
            'Price/Sales',
            'Price/Earnings',
            'Market Cap',
            'Sector'
        ]]

        convert_dict = {
            'Name': 'category',
                    'Price': 'float',
                    'Earnings/Share': 'float',
                    'Price/Sales': 'float',
                    'Price/Earnings': 'float',
                    'Market Cap': 'float',
                    'Sector': 'category'
        }

        return Dataset('Name', selection.astype(convert_dict), 'S&P 500 Companies', {
            'Name': {
                'text': 'Name',
                'unit': '',
                'short': 'A',
                'type': 'label'
            },
            'Price': {
                'text': 'Price',
                'unit': '$',
                'short': 'B',
                'type': 'numeric'
            },
            'Earnings/Share': {
                'text': 'Earnings per Share',
                'unit': '',
                'short': 'C',
                'type': 'numeric'
            },
            'Price/Sales': {
                'text': 'Price per Sales',
                'unit': '',
                'short': 'D',
                'type': 'numeric'
            },
            'Price/Earnings': {
                'text': 'Price per Earnings',
                'unit': '',
                'short': 'E',
                'type': 'numeric'
            },
            'Market Cap': {
                'text': 'Market Cap',
                'unit': '$',
                'short': 'F',
                'type': 'numeric'
            },
            'Sector': {
                'text': 'Sector',
                'unit': '',
                'short': 'G',
                'type': 'categorical'
            },
        })
