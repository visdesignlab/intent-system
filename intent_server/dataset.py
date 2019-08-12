import json

import pandas as pd

from .dimensions import Dimensions
from typing import Dict


class Dataset:
    def __init__(self, label: str, data: pd.DataFrame, name: str) -> None:
        self.label: str = label
        self.data: pd.DataFrame = data
        self.name: str = name

    def to_dict(self) -> Dict:
        output = {'labelColumn': self.label, 'name': self.name}
        output['values'] = self.data.T.to_dict()
        return output

    def numerical(self) -> pd.DataFrame:
        return self.data.select_dtypes(include='number')

    def subset(self, dims: Dimensions) -> pd.DataFrame:
        return self.data[dims.indices()]

    @staticmethod
    def from_json_file(filename: str, name: str) -> 'Dataset':
        with open(filename) as read_file:
            raw_json = json.load(read_file)
            label = raw_json['labelColumn']
            data = pd.DataFrame.from_dict(raw_json['values'], orient='index')
            return Dataset(label, data, name)

    @staticmethod
    def load_housing_data() -> 'Dataset':
        df = pd.concat([
            pd.read_csv('data/housing/train1.csv', thousands=','),
            pd.read_csv('data/housing/train2.csv', thousands=','),
        ], ignore_index=True)
        selection = df[[
            'ListNo',
            'Acres',
            'BsmntFin',
            'Deck',
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
        return Dataset('ListNo', selection.astype({'ListNo': str}), 'SLC Housing')

    @staticmethod
    def load_nba_data() -> 'Dataset':
        df = pd.read_csv('data/nba_all_seasons.csv')
        is_season = df['season'] == '2016-17'
        return Dataset('player_name', df[is_season].drop(columns=[
            'Unnamed: 0',
            'season',
            'college',
            'draft_year',
            'draft_round',
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
        df = df.drop(columns=['Position'])
        return Dataset('Name', df, 'NFL Draft Combine')
