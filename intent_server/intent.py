from abc import ABC, abstractmethod
from .vendor.interactions import Prediction

import numpy as np
import pandas as pd

from scipy.spatial.distance import jaccard
from typing import Optional, Dict, Any, List


class Intent(ABC):
    @abstractmethod
    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> List[Prediction]:
        pass

    @abstractmethod
    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        pass

    @abstractmethod
    def to_string(self) -> str:
        pass


class IntentBinary(Intent, ABC):
    @abstractmethod
    def info(self) -> Optional[Dict[str, Any]]:
        pass

    def __rank(self, selection: np.ndarray, computed: pd.DataFrame) -> float:
        return float(1 - jaccard(computed, selection))

    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> List[Prediction]:
        belongs_to = self.compute(df)
        ids = belongs_to.loc[belongs_to.iloc[:, 0] == 1].index.values

        return [Prediction(
            intent=self.to_string(),
            rank=self.__rank(selection, belongs_to),
            info=self.info(),
            data_ids=list(map(float, ids)), suggestion=None)]


class IntentMulticlassInstance(IntentBinary):
    def __init__(self, parent: 'IntentMulticlass', reference: pd.DataFrame):
        self.reference = reference
        self.parent = parent

    def to_string(self) -> str:
        return self.reference.columns[0]  # type: ignore

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        return self.reference.applymap(int)

    def info(self) -> Optional[Dict[str, Any]]:
        return self.parent.info()


class IntentMulticlass(Intent, ABC):
    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> List[Prediction]:
        computed = self.compute(df)
        outputs = map(lambda i:
                      IntentMulticlassInstance(self,
                                               computed[[i]]).to_prediction(selection, df),
                      computed.columns)
        return [x for y in outputs for x in y]

    @abstractmethod
    def info(self) -> Optional[Dict[str, Any]]:
        pass
