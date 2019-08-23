from sklearn.cluster import KMeans

import pandas as pd

from ..intent import IntentMulticlass


class KMeansCluster(IntentMulticlass):
    def __init__(self) -> None:
        self.kmeans = KMeans(n_clusters=3, random_state=0)

    def to_string(self) -> str:
        return 'Cluster:KMeans'

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        nan_dropped = df.dropna()
        self.kmeans.fit(nan_dropped)

        labels = pd.DataFrame(data=self.kmeans.labels_,
                              index=nan_dropped.index).applymap(str)

        inc_nan = labels.reindex(index=df.index, fill_value='NaN')
        values = inc_nan.iloc[:, 0].unique()
        result = pd.concat(
            map(lambda v: pd.DataFrame(  # type: ignore
                data=(inc_nan.iloc[:, 0] == v).astype('int').values,
                columns=[self.to_string() + ":" + v],
                index=df.index, dtype=int),
                values), axis='columns')
        return result
