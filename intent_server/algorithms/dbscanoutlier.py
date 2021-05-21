from sklearn.cluster import DBSCAN
from sklearn import preprocessing
import sys
import numpy as np
import pandas as pd

from ..intent import Intent
from typing import Optional, Dict, Any


class DBSCANOutlier(Intent):
    def __init__(self, eps: float) -> None:
        super().__init__()
        self.dbscan = DBSCAN(eps)

    def to_string(self) -> str:
        return 'Outlier:DBSCAN'

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        nan_dropped = df.select_dtypes(include=['number']).dropna()

        scaler = preprocessing.RobustScaler()
        scaled = scaler.fit_transform(nan_dropped.values)

        labels = self.dbscan.fit_predict(scaled)

        labels[labels >= 0] = 0
        labels[labels == -1] = 1

        result = pd.DataFrame(data=labels,
                              index=nan_dropped.index, columns=[self.to_string()])
        return result

    def info(self) -> Optional[Dict[str, Any]]:
        return {"params": self.dbscan.get_params(), "type": "DBSCAN Outliers" }
