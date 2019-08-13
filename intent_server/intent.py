from abc import ABC, abstractmethod
from .vendor.interactions import Prediction

import numpy as np
import pandas as pd

from scipy.spatial.distance import jaccard
from typing import Optional, Dict, Any


class Intent(ABC):
    @abstractmethod
    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> Prediction:
        pass


class IntentBinary(Intent, ABC):
    @abstractmethod
    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        pass

    @abstractmethod
    def to_string(self) -> str:
        pass

    @abstractmethod
    def info(self) -> Optional[Dict[str, Any]]:
        pass

    def rank(self, selection: np.ndarray, df: pd.DataFrame) -> float:
        belongs_to = self.compute(df)
        return float(1 - jaccard(belongs_to, selection))

    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> Prediction:
        return Prediction(
            self.to_string(),
            self.rank(selection, df),
            info=self.info())


class IntentMulticlassInstance(IntentBinary):
    def __init__(self, reference: pd.DataFrame, description: str):
        self.reference = reference
        self.description = description

    def to_string(self) -> str:
        return self.description

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        res = pd.DataFrame(data=self.reference.astype('int').values,
                           index=df.index, columns=[self.to_string()])
        return res

    def info(self) -> Optional[Dict[str, Any]]:
        return None
