from abc import ABC, abstractmethod
from intent_server.dataset import Dataset
from typing import List

import pandas as pd
import numpy as np
import itertools

class Dimensions:
    def __init__(self, dims: List[str]) -> None:
        self.dims = sorted(dims)

    def __hash__(self) -> int:
        return hash("".join(self.dims))

    def __eq__(self, other) -> bool:
        return self.dims == other.dims

class Measure(ABC):
    @abstractmethod
    def compute(self, df: pd.DataFrame) -> str:
        pass


class Properties:
    def __init__(self, dataset: Dataset):
        combs = itertools.combinations(dataset.numerical().columns, 2)
        self.measures = set()
        print(list(combs))
