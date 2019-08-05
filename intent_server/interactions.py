import pandas as pd
import numpy as np

from typing import Set


def selection_array(df: pd.DataFrame, ids: Set[int]) -> np.ndarray:
    arr = np.zeros((len(df), 1))
    for i in ids:
        arr.itemset((i, 0), 1)
    return arr
