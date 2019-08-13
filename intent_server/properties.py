from .dataset import Dataset
from .dimensions import Dimensions
from .intent import IntentBinary

from typing import Callable, List

import pandas as pd


class Properties:
    def __init__(self, dataset: Dataset, measures: List[IntentBinary]) -> None:
        self.dataset = dataset
        self.measures = measures

    def for_dims(self, dims: Dimensions) -> pd.DataFrame:
        sel = self.dataset.data[dims.indices()]
        fn: Callable[[IntentBinary], pd.DataFrame] = lambda m: m.compute(sel)
        comp_measures = map(fn, filter(lambda x: isinstance(x, IntentBinary), self.measures))
        concated = pd.concat(comp_measures, axis='columns')
        return concated

    def labels(self) -> pd.DataFrame:
        return self.dataset.data[self.dataset.label]
