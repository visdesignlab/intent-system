from abc import ABC, abstractmethod
from .vendor.interactions import Prediction

import numpy as np
import pandas as pd

from scipy.spatial.distance import jaccard
from typing import Optional, Dict, Any, List


def rank_jaccard(intent: pd.DataFrame, selection: pd.DataFrame) -> float:
    return float(1-jaccard(intent, selection))


class Intent(ABC):
    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> List[Prediction]:
        computed = self.compute(df)
        # print(hash(self.__class__))

        predictions = []
        for column in computed: 
            rank = rank_jaccard(computed[column].T, selection.T)
            ids = computed.loc[computed.loc[:, column] == 1].index.values
            predictions.append(Prediction(
                intent=column,
                rank=rank,
                info=self.info(),
                data_ids=list(map(float, ids)),
                suggestion=None))

        return predictions

    @abstractmethod
    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        pass

    @abstractmethod
    def to_string(self) -> str:
        pass