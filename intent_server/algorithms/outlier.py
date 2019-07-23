from sklearn.neighbors import LocalOutlierFactor
from ..properties import Measure

import pandas as pd


class Outlier(Measure):
    def __init__(self, n_neighbors: int, contamination: float) -> None:
        self.n_neighbors = n_neighbors
        self.contamination = contamination

    def columnName(self) -> str:
        return 'Outlier:LOF:' + str(self.n_neighbors) + ':' + str(self.contamination)

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        clf = LocalOutlierFactor(n_neighbors=self.n_neighbors, contamination=self.contamination)

        df=df.fillna(df.mean())

        pred = clf.fit_predict(df)
        return pd.DataFrame(data=pred, columns=[self.columnName()])
