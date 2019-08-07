from sklearn.neighbors import LocalOutlierFactor

from ..intent import IntentBinary

import pandas as pd
import numpy as np


class Outlier(IntentBinary):
    def __init__(self, n_neighbors: int, contamination: float) -> None:
        self.n_neighbors = n_neighbors
        self.contamination = contamination

    def to_string(self) -> str:
        return 'Outlier:LOF:' + str(self.n_neighbors) + ':' + str(self.contamination)

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        clf = LocalOutlierFactor(n_neighbors=self.n_neighbors, contamination=self.contamination)

        df = df.fillna(df.mean())

        pred = clf.fit_predict(df)
        return pd.DataFrame(data=pred, columns=[self.to_string()]).replace({-1: 1, 1: 0})
