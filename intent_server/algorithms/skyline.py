from ..properties import Measure

import pandas as pd
import numpy as np


def dominates(slf: np.ndarray, other: np.ndarray) -> bool:
    fst: bool = all(map(lambda a, b: b > a, slf, other))
    snd: bool = all(map(lambda a, b: a < b, slf, other))
    return fst and snd


class Skyline(Measure):
    def __init__(self) -> None:
        pass


    def belongs_to_skyline(rowIdx, df) -> bool:
        pass


    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        # The following implementation comes from
        # `Computational Geometry: an introduction` by Preparata and Shamos.
        
        

        return pd.DataFrame(data=[42], columns=['Skyline']) 

