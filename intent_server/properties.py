from .dataset import Dataset
from .dimensions import Dimensions
from .intent import IntentBinary, IntentMulticlass

from typing import Callable, List

import pandas as pd


class Properties:
    def __init__(self, dataset: Dataset, measures: List[IntentBinary]) -> None:
        self.dataset = dataset
        self.measures = measures

    def for_dims(self, dims: Dimensions) -> pd.DataFrame:
        sel = self.dataset.data[dims.indices()]
        fn: Callable[[IntentBinary], pd.DataFrame] = lambda m: m.compute(sel)
        bin_comp_measures = map(fn,
                                filter(lambda x: isinstance(x, IntentBinary),
                                       self.measures))  # type: ignore

        multiclass = filter(lambda x: isinstance(x, IntentMulticlass), self.measures)
        multiclass_instances = [item for sublist in
                                map(lambda x: x.instances(sel),  # type: ignore
                                    multiclass) for item in sublist]
        multi_comp_measures = map(fn, multiclass_instances)

        comp_measures = list(bin_comp_measures) + list(multi_comp_measures)
        concated = pd.concat(comp_measures, axis='columns')
        return concated

    def labels(self) -> pd.DataFrame:
        return self.dataset.data[self.dataset.label]
