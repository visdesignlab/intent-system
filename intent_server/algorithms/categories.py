import pandas as pd
import numpy as np

from ..intent import Intent, IntentMulticlassInstance
from ..dataset import Dataset
from ..vendor.interactions import Prediction

from typing import List


def expand_column(col: pd.DataFrame, description: str) -> pd.DataFrame:
    values = col.iloc[:,0].unique()
    result = pd.concat(map(lambda v: pd.DataFrame(data=(col.iloc[:,0] == v).astype('int').values,
                                                  columns=[description + ":" + v],
                                                  index=col.index, dtype=int),
                           values), axis='columns')
    return result


class Categories(Intent):
    def __init__(self, data: Dataset) -> None:
        baseName = 'Category'
        self.baseName = baseName
        cats = data.categorical()
        self.expanded = pd.concat(map(lambda c: expand_column(cats[[c]], baseName + ":" + c + ":"), cats.columns), axis='columns')

    def to_string(self) -> str:
        return self.baseName

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        return self.expanded

    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> List[Prediction]:
        computed = self.compute(df)
        instances = map(lambda i: IntentMulticlassInstance(computed[i]).to_prediction(selection, df),
                        computed.columns) 



