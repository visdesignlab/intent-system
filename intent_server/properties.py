from abc import ABC, abstractmethod
from .dataset import Dataset
from .dimensions import Dimensions
from typing import Callable, List

import pandas as pd


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
        return self.normalize(self.compute(df))


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
