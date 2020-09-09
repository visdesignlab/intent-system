from sklearn.cluster import DBSCAN
from sklearn import preprocessing
import sys

import pandas as pd

from ..intent import Intent
from typing import Optional, Dict, Any


class DBSCANOutlier(Intent):
    def __init__(self, eps: float) -> None:
        super().__init__()
        self.dbscan = DBSCAN(eps)

    def to_string(self) -> str:
        return 'Cluster:DBSCAN'

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        nan_dropped = df.dropna()

        min_max_scaler = preprocessing.MinMaxScaler()
        scaled = min_max_scaler.fit_transform(nan_dropped.values)

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
        result[result >= 0] = 0
        result[result == -1] = 1
        print(result, file=sys.stderr)
        return result

    def info(self) -> Optional[Dict[str, Any]]:
        return {"params": self.dbscan.get_params()}