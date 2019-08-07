from ..intent import IntentBinary

import pandas as pd
import numpy as np

from typing import Optional, Dict, Any


def dominates(slf: np.ndarray, other: np.ndarray) -> bool:
    if np.isnan(slf).any():
        return False
    if np.isnan(other).any():
        return True

    fst: bool = all(map(lambda a, b: b > a, slf, other))  # type: ignore
    snd: bool = all(map(lambda a, b: a < b, slf, other))  # type: ignore
    return fst and snd


def belongs_to_skyline(data: np.ndarray, pt: np.ndarray) -> bool:
    return np.apply_along_axis(lambda x: not(dominates(x, pt)), 1, data).all()  # type: ignore


class Skyline(IntentBinary):
    def __init__(self) -> None:
        pass

    def to_string(self) -> str:
        return 'Skyline'

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        data = df.values
        skyline = np.apply_along_axis(lambda x: belongs_to_skyline(data, x), 1, data)
        return pd.DataFrame(
            data=skyline,
            columns=[self.to_string()]).applymap(lambda x: 1 if x else 0)

    def info(self) -> Optional[Dict[str,Any]]:
        return None
