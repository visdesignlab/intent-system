from sklearn.cluster import KMeans

import numpy as np
import pandas as pd

from ..intent import IntentMulticlass, IntentMulticlassInstance
from ..vendor.interactions import Prediction

from typing import List


class KMeansCluster(IntentMulticlass):
    def __init__(self) -> None:
        self.kmeans = KMeans(n_clusters=3, random_state=0)

    def to_string(self) -> str:
        return 'Cluster'

    def instances(self, df: pd.DataFrame) -> List[IntentMulticlassInstance]:
        nan_dropped = df.dropna()
        self.kmeans.fit(nan_dropped)
        columnName = 'Labels'
        labels = pd.DataFrame(data=self.kmeans.labels_, index=nan_dropped.index, columns=[columnName]).applymap(str)
        inc_nan = labels.reindex(index=df.index, fill_value='NaN')
        values = inc_nan[columnName].unique()
        return list(
            map(
                lambda v: IntentMulticlassInstance(inc_nan[columnName] == v, self.to_string() + ':' + columnName + ':' + str(v)),
                values))
