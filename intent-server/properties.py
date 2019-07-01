from abc import ABC, abstractmethod
from dataset import Dataset

import pandas as pd
import itertools


class Measure(ABC):
    @abstractmethod
    def compute(self, a: str, b: str) -> str:
        pass


class Properties:
    def __init__(self, dataset: Dataset):
        combs = itertools.combinations(dataset.numerical().columns, 2)
        print(list(combs))
