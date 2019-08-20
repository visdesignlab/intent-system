from sklearn.cluster import KMeans

import pandas as pd
import numpy as np

from ..intent import Intent, IntentMulticlassInstance
from ..vendor.interactions import Prediction

from typing import List


class KMeansCluster(Intent):
    def __init__(self) -> None:
        self.kmeans = KMeans(n_clusters=3, random_state=0)

    def to_string(self) -> str:
        return 'Cluster'

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        nan_dropped = df.dropna()
        self.kmeans.fit(nan_dropped)

        labels = pd.DataFrame(data=self.kmeans.labels_,
                              index=nan_dropped.index).applymap(str)

        inc_nan = labels.reindex(index=df.index, fill_value='NaN')
        values = inc_nan.iloc[:,0].unique()
        result = pd.concat(map(lambda v: pd.DataFrame(data=(inc_nan.iloc[:,0] == v).astype('int').values,
                                                      columns=[self.to_string() + ":" + v],
                                                      index=df.index, dtype=int),
                               values), axis='columns')
        return result

    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> List[Prediction]:
        computed = self.compute(df)
        instances = map(lambda i: IntentMulticlassInstance(computed[i]).to_prediction(selection, df),
                        computed.columns) 

    
