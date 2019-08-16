import numpy as np
import pandas as pd

from ..intent import IntentMulticlass, IntentMulticlassInstance
from ..vendor.interactions import Prediction
from ..dataset import Dataset

from typing import List


def build_instances(df: pd.DataFrame, column: str) -> List[IntentMulticlassInstance]:
    values = df[column].unique()
    return list(
        map(
            lambda v: IntentMulticlassInstance(df[column] == v, 'Category:' + column + ':' + v),
            values))

class Categories(IntentMulticlass):
    def __init__(self, data: Dataset) -> None:
        cats = data.categorical()
        instancesList = map(lambda c: build_instances(data.data, c), cats)
        self.insts = [item for sublist in instancesList for item in sublist]

    def instances(self, df: pd.DataFrame) -> List[IntentMulticlassInstance]:
        return self.insts
