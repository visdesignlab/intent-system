import json

import pandas as pd

from typing import Dict


class Dataset:
    def __init__(self, label: str, data: pd.DataFrame) -> None:
        self.label: str = label
        self.data: pd.DataFrame = data

    def to_dict(self) -> Dict:
        output = {'labelColumn': self.label}
        output['values'] = self.data.T.to_dict()
        return output

    def numerical(self) -> pd.DataFrame:
        return self.data.select_dtypes(include='number')

    @staticmethod
    def from_json_file(filename: str) -> 'Dataset':
        with open(filename) as read_file:
            raw_json = json.load(read_file)
            label = raw_json['labelColumn']
            data = pd.DataFrame.from_dict(raw_json['values'], orient='index')
            return Dataset(label, data)
