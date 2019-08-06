from abc import ABC, abstractmethod
from .vendor.interactions import Prediction

import numpy as np
import pandas as pd

from scipy.spatial.distance import jaccard


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

    def rank(self, selection: np.ndarray, df: pd.DataFrame) -> float:
        belongs_to = self.compute(df)
        return float(1 - jaccard(belongs_to, selection))

    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> Prediction:
        return Prediction(
            self.to_string(),
            self.rank(selection, df))
