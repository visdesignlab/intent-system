from ..intent import Intent

from sklearn import preprocessing
from sklearn.linear_model import LinearRegression as LR
import pandas as pd
import numpy as np

from typing import Optional, Dict, Any


class LinearRegression(Intent):
    def __init__(self, threshold: float) -> None:
        super().__init__()
        self.threshold = threshold
        self.reg = LR()
        self.min_max_scaler_x = preprocessing.MinMaxScaler()
        self.min_max_scaler_y = preprocessing.MinMaxScaler()

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        vs = df.values
        numDims = np.size(vs, 1)

        X = vs[:, 0:numDims-1]
        y = vs[:, numDims-1].reshape(-1, 1)

        X_scaled = self.min_max_scaler_x.fit_transform(X)
        y_scaled = self.min_max_scaler_y.fit_transform(y).flatten()

        self.reg.fit(X_scaled, y_scaled)

        ts = self.reg.predict(X_scaled)
        sqdist = pd.DataFrame(data=np.square(ts - y_scaled), index=df.index)
        within = sqdist < (self.threshold * self.threshold)
        result = pd.concat([within, within ^ 1], axis=1)
        result.columns = [self.to_string() + ":within_threshold",
                          self.to_string() + ":outside_threshold"]
        return result

    def to_string(self) -> str:
        return "LinearRegression"

    def info(self) -> Optional[Dict[str, Any]]:
        x1 = self.min_max_scaler_x.data_min_
        x2 = self.min_max_scaler_x.data_max_
        y1 = self.min_max_scaler_y.inverse_transform(self.reg.predict([[0]]).reshape(1, -1))
        y2 = self.min_max_scaler_y.inverse_transform(self.reg.predict([[1]]).reshape(1, -1))
        return {
            "threshold": self.threshold,
            "points": {"x1s": x1.tolist(),
                       "y1": y1.tolist(),
                       "x2s": x2.tolist(),
                       "y2": y2.tolist()}}
