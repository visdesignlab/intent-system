from abc import ABC, abstractmethod
from dataset import Dataset
from sklearn.neighbors import LocalOutlierFactor
from typing import List

import pandas as pd
import numpy as np
import itertools


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
    def compute(self, df: pd.DataFrame) -> np.ndarray:
        pass


class Outlier(Measure):
    def __init__(self, n_neighbors: int, contamination: float):
        self.n_neighbors = n_neighbors
        self.contamination = contamination

    def compute(self, df: pd.DataFrame) -> np.ndarray:
        clf = LocalOutlierFactor(n_neighbors=self.n_neighbors, contamination=self.contamination)
        return clf.fit_predict(df)


class Properties:
    def __init__(self, dataset: Dataset):
        combs = itertools.combinations(dataset.numerical().columns, 2)
        print(list(combs))
