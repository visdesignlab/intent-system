from sklearn.cluster import DBSCAN
from sklearn import preprocessing

import pandas as pd

from ..intent import IntentMulticlass


class DBSCANCluster(IntentMulticlass):
    def __init__(self) -> None:
        self.dbscan = DBSCAN()

    def to_string(self) -> str:
        return 'Cluster:DBSCAN'

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        nan_dropped = df.dropna()

        min_max_scaler = preprocessing.MinMaxScaler()
        scaled = min_max_scaler.fit_transform(nan_dropped.values);

        self.dbscan.fit(scaled)

        labels = pd.DataFrame(data=self.dbscan.labels_,
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
