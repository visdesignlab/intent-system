from abc import ABC, abstractmethod

import numpy as np
import pandas as pd

from scipy.spatial.distance import jaccard


class Intent(ABC):
    @abstractmethod
    def to_string(self) -> str:
        pass

    @abstractmethod
    def rank(self, selection: np.ndarray, df: pd.DataFrame) -> float:
        pass


class IntentBinary(Intent, ABC):
    @abstractmethod
    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        pass

    def rank(self, selection: np.ndarray, df: pd.DataFrame) -> float:
        belongs_to = self.compute(df)
        return float(1 - jaccard(belongs_to, selection))
