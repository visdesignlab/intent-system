from ..intent import Intent

import pandas as pd
import numpy as np
import itertools
import typing

from typing import Optional, Dict, Any


##################################################################################
# From: https://maxhalford.github.io/blog/skyline-queries-in-python/
def count_diffs(a: typing.Any, b: typing.Any, to_min: typing.Any, to_max: typing.Any) -> typing.Any:
    n_better = 0
    n_worse = 0

    for f in to_min:
        n_better += a[f] < b[f]
        n_worse += a[f] > b[f]

    for f in to_max:
        n_better += a[f] > b[f]
        n_worse += a[f] < b[f]

    return n_better, n_worse


def find_skyline_bnl(df: typing.Any, to_min: typing.Any, to_max: typing.Any) -> typing.Any:
    """Finds the skyline using a block-nested loop."""

    rows = df.to_dict(orient='index')

    # Use the first row to initialize the skyline
    skyline = {df.index[0]}

    # Loop through the rest of the rows
    for i in df.index[1:]:

        to_drop = set()
        is_dominated = False

        for j in skyline:

            n_better, n_worse = count_diffs(rows[i], rows[j], to_min, to_max)

            # Case 1
            if n_worse > 0 and n_better == 0:
                is_dominated = True
                break

            # Case 3
            if n_better > 0 and n_worse == 0:
                to_drop.add(j)

        if is_dominated:
            continue

        skyline = skyline.difference(to_drop)
        skyline.add(i)

    return pd.Series(df.index.isin(skyline), index=df.index)
##################################################################################


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
        super().__init__()

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
        if (len(data.columns) == 2):
            vs = data.dot(np.diag(signs))
            skyline = find_skyline_bnl(vs, to_min=[], to_max=vs.columns)
        else:
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
