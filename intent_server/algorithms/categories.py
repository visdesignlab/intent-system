import pandas as pd

from ..dataset import Dataset
from ..intent import Intent
from typing import Optional, Dict, Any


def expand_column(col: pd.DataFrame, description: str) -> pd.DataFrame:
    values = col.iloc[:, 0].unique()
    result = pd.concat(map(lambda v: pd.DataFrame(  # type: ignore
        data=(col.iloc[:, 0] == v).astype('int').values,
        columns=[description + ":" + v],
        index=col.index, dtype=int),
        values), axis='columns')
    return result


class Categories(Intent):
    def __init__(self, data: Dataset) -> None:
        baseName = 'Category'
        self.baseName = baseName
        cats = data.categorical()
        self.expanded = pd.concat(map(lambda c: expand_column(  # type: ignore
            cats[[c]], baseName + ":" + c + ":"), cats.columns), axis='columns')

    def to_string(self) -> str:
        return self.baseName

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        return self.expanded

    def info(self) -> Optional[Dict[str, Any]]:
        return None
