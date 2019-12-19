from abc import ABC, abstractmethod
from .vendor.interactions import Prediction

import numpy as np
import pandas as pd
import uuid
import hashlib
import typing

from scipy.spatial.distance import jaccard
from typing import Optional, Dict, Any, List


def rank_jaccard(intent: pd.DataFrame, selection: pd.DataFrame) -> float:
    return float(1-jaccard(intent, selection))


class Intent(ABC):
    def __init__(self) -> None:
        self.hasher = hashlib.md5((str(uuid.uuid1())).encode('utf-8')).hexdigest()[:10]
        self.cache: Dict[typing.Any, typing.Any] = dict()

    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> List[Prediction]:  # noqa: E501
        # hashing columns should be enough
        cache_hash = str(list(df.columns))
        if(cache_hash in self.cache):
            computed = self.cache[cache_hash]
            print("Cache hit")
        else:
            computed = self.compute(df)
            self.cache[cache_hash] = computed

        axes = cache_hash
        computed.columns = [self.hasher + ":" + axes + ":" + str(col) for col in computed.columns]

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
