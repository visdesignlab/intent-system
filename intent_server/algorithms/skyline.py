from ..intent import Intent

import pandas as pd
import numpy as np
import itertools

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


def permutation_to_str(data: np.ndarray) -> str:
    return ';'.join(map(lambda x: 'Max' if x == -1 else 'Min', data))


class Skyline(Intent):
    def __init__(self) -> None:
        pass

    def to_string(self) -> str:
        return 'Skyline'

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        data = df.select_dtypes(include=['number'])

        permutations = []  # type: ignore

        if len(df.columns) > 2:
            permutations = [list(itertools.repeat(-1, len(data.columns))),
                            list(itertools.repeat(1, len(data.columns)))]
        else:
            permutations = [list(i) for i in itertools.product([-1, 1], repeat=len(data.columns))]

        result = pd.concat(map(lambda perm: self.skyline_for_permutation(  # type: ignore
            np.array(perm), data), permutations), axis='columns')
        return result

    def info(self) -> Optional[Dict[str, Any]]:
        return None

    def skyline_for_permutation(self, signs: np.ndarray, data: pd.DataFrame) -> pd.DataFrame:
        vs = data.values.dot(np.diag(signs))
        skyline = np.apply_along_axis(lambda x: belongs_to_skyline(vs, x), 1, vs)
        return pd.DataFrame(
            index=data.index,
            data=skyline,
            columns=[
                self.to_string() +
                ":" +
                permutation_to_str(signs)]).applymap(
            lambda x: 1 if x else 0)
