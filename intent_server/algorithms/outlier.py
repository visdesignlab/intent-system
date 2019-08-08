from sklearn.neighbors import LocalOutlierFactor

from ..intent import IntentBinary

import pandas as pd

from typing import Optional, Dict, Any


class Outlier(IntentBinary):
    def __init__(self, n_neighbors: int, contamination: float) -> None:
        self.clf = LocalOutlierFactor(n_neighbors=n_neighbors, contamination=contamination)

    def to_string(self) -> str:
        return 'Outlier'

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:

        df = df.fillna(df.mean())

        pred = self.clf.fit_predict(df)
        return pd.DataFrame(data=pred, columns=[self.to_string()]).replace({-1: 1, 1: 0})

    def info(self) -> Optional[Dict[str, Any]]:
        return {
            "type": "Local Outlier Factory",
            "params": self.clf.get_params()}
