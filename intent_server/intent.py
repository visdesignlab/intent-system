from abc import ABC, abstractmethod
from .vendor.interactions import Prediction

import numpy as np
import pandas as pd
import uuid
import hashlib

from scipy.spatial.distance import jaccard
from typing import Optional, Dict, Any, List, Tuple


def rank_jaccard(intent: pd.DataFrame, selection: pd.DataFrame) -> float:
    return float(1-jaccard(intent, selection))


class Intent(ABC):
    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> List[Prediction]:  # noqa: E501
        computed = self.compute(df)
        hasher = hashlib.md5((str(uuid.uuid1())).encode('utf-8')).hexdigest()[:10]
        axes = str(list(df.columns))
        computed.columns = [hasher + ":" + axes + ":" + str(col) for col in computed.columns]

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

    @abstractmethod
    def info(self) -> Optional[Dict[str, Any]]:
        pass
