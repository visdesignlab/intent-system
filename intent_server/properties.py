from abc import ABC, abstractmethod
from .dataset import Dataset
from sklearn.neighbors import LocalOutlierFactor
from typing import Callable, List

import pandas as pd


class Dimensions:
    def __init__(self, dims: List[str]) -> None:
        self.dims = sorted(dims)

    def __hash__(self) -> int:
        return hash("".join(self.dims))

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Dimensions):
            return NotImplemented
        return self.dims == other.dims


class Measure(ABC):
    @abstractmethod
    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        pass


class Outlier(Measure):
    def __init__(self, n_neighbors: int, contamination: float) -> None:
        self.n_neighbors = n_neighbors
        self.contamination = contamination

    def columnName(self) -> str:
        return 'Outlier:' + str(self.n_neighbors) + ':' + str(self.contamination)

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        clf = LocalOutlierFactor(n_neighbors=self.n_neighbors, contamination=self.contamination)
        pred = clf.fit_predict(df)
        return pd.DataFrame(data=pred, columns=[self.columnName()])


class Properties:
    def __init__(self, dataset: Dataset, measures: List[Measure]) -> None:
        self.dataset = dataset
        self.measures = measures

    def for_dims(self, dims: Dimensions) -> pd.DataFrame:
        sel = self.dataset.data[dims]
        fn: Callable[[Measure], pd.DataFrame] = lambda m: m.compute(sel)
        comp_measures = map(fn, self.measures)
        print(comp_measures)
        return pd.concat(comp_measures, axis='columns').T
