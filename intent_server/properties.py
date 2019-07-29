from abc import ABC, abstractmethod
from .dataset import Dataset
from .dimensions import Dimensions
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

    def to_string(self) -> str:
        return ':'.join(self.dims)

    def indices(self) -> List[str]:
        return self.dims


class Measure(ABC):
    @abstractmethod
    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        pass

    @abstractmethod
    def normalize(self, df: pd.DataFrame) -> pd.DataFrame:
        pass

    @abstractmethod
    def to_string(self) -> str:
        pass

    def evaluate(self, df: pd.DataFrame) -> pd.DataFrame:
        self.normalize(self.compute(df))

class Properties:
    def __init__(self, dataset: Dataset, measures: List[Measure]) -> None:
        self.dataset = dataset
        self.measures = measures

    def for_dims(self, dims: Dimensions) -> pd.DataFrame:
        sel = self.dataset.data[dims.indices()]
        fn: Callable[[Measure], pd.DataFrame] = lambda m: m.evaluate(sel)
        comp_measures = map(fn, self.measures)
        return pd.concat(comp_measures, axis='columns')

    def labels(self) -> pd.DataFrame:
        return self.dataset.data[self.dataset.label]
