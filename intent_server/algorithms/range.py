from ..intent import Intent

import pandas as pd


class Range(Intent):
    def __init__(self) -> None:
        pass

    def to_string(self) -> str:
        return 'Outlier:LOF:' + str(self.n_neighbors) + ':' + str(self.contamination)

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        clf = LocalOutlierFactor(n_neighbors=self.n_neighbors, contamination=self.contamination)

        df = df.fillna(df.mean())

        pred = clf.fit_predict(df)
        return pd.DataFrame(data=pred, columns=[self.to_string()])
