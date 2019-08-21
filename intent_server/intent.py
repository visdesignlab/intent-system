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

    def to_unique_string(self) -> str:
        return str(hash(self)) + "|" + self.to_string()


class IntentBinary(Intent, ABC):
    @abstractmethod
    def info(self) -> Optional[Dict[str, Any]]:
        pass

    def rank(self, selection: np.ndarray, df: pd.DataFrame) -> float:
        belongs_to = self.compute(df)
        return float(1 - jaccard(belongs_to, selection))

    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> List[Prediction]:
        return [Prediction(
            self.to_unique_string(),
            self.rank(selection, df),
            info=self.info())]


class IntentMulticlassInstance(IntentBinary):
    def __init__(self, reference: pd.DataFrame):
        self.reference = reference

    def to_string(self) -> str:
        return self.reference.columns[0]  # type: ignore

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        return self.reference.applymap(int)

    def info(self) -> Optional[Dict[str, Any]]:
        return None


class IntentMulticlass(Intent, ABC):
    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> List[Prediction]:
        computed = self.compute(df)
        outputs = map(lambda i: IntentMulticlassInstance(
            computed[[i]]).to_prediction(selection, df), computed.columns)
        return [x for y in outputs for x in y]
