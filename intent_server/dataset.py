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
