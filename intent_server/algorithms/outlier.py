from sklearn.neighbors import LocalOutlierFactor
from sklearn import preprocessing

from ..intent import Intent

import pandas as pd

from typing import Optional, Dict, Any, Union


class Outlier(Intent):
    def __init__(self, n_neighbors: int = 20, contamination: Union[float, str] = 'auto') -> None:
        super().__init__()
        self.clf = LocalOutlierFactor(n_neighbors=n_neighbors, contamination=contamination)

    def to_string(self) -> str:
        return 'Outlier'

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        nan_dropped = df.select_dtypes(include=['number']).dropna()

        min_max_scaler = preprocessing.MinMaxScaler()
        scaled = min_max_scaler.fit_transform(nan_dropped.values)

        outliers = self.clf.fit_predict(scaled)
        result = pd.DataFrame(data=outliers, index=nan_dropped.index, columns=[
                              self.to_string()]).replace({-1: 1, 1: 0})
        return result.loc[result.iloc[:, 0] == 1].reindex(index=df.index, fill_value=0)

    def info(self) -> Optional[Dict[str, Any]]:
        return {
            "type": "Local Outlier Factory",
            "params": self.clf.get_params()}
