from ..intent import Intent
import sys
from sklearn import preprocessing
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression as LR
from sklearn.pipeline import Pipeline
import pandas as pd
import numpy as np

from typing import Optional, Dict, Any


class QuadraticRegression(Intent):
    def __init__(self, threshold: float) -> None:
        super().__init__()
        self.threshold = threshold
        self.reg = Pipeline([('quad', PolynomialFeatures(degree=2)),
                             ('linear', LR(fit_intercept=False))])
        self.min_max_scaler_x = preprocessing.MinMaxScaler()
        self.min_max_scaler_y = preprocessing.MinMaxScaler()
        self.dimCount = 0

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        vs = df.values
        numDims = np.size(vs, 1)
        self.dimCount = numDims
        X = vs[:, 0:numDims-1]
        y = vs[:, numDims-1].reshape(-1, 1)

        X_scaled = self.min_max_scaler_x.fit_transform(X)
        y_scaled = self.min_max_scaler_y.fit_transform(y).flatten()

        ndf = df.copy(deep=True)
        ndf['X'] = X_scaled
        ndf['Y'] = y_scaled

        ndf['Filter'] = True
        old_length = 0
        for i in range(10):
            curr_idx = ndf.index[ndf.loc[:, 'Filter']]
            curr = ndf.iloc[curr_idx, :]
            if old_length == curr.shape[0]:
                break
            old_length = curr.shape[0]

            x,y = curr['X'].values.reshape(-1,1), curr['Y'].values
            self.reg.fit(x, y)
            ts = self.reg.predict(X_scaled)

            # compute residuals
            rs = ts - y_scaled
            rs = np.absolute(rs)

            m = np.median(rs)

            within = rs < (3 * m)
            ndf['Filter'] = within


        # self.reg.fit(X_scaled, y_scaled)
        self.dimCount = X_scaled.shape[1]
        # ts = self.reg.predict(X_scaled)
        # sqdist = pd.DataFrame(data=np.square(ts - y_scaled), index=df.index)
        # within = sqdist < (self.threshold * self.threshold)
        within = pd.DataFrame(data=within)

        result = pd.concat([within, within ^ 1], axis=1)
        result.columns = [self.to_string() + ":within_threshold",
                          self.to_string() + ":outside_threshold"]
        return result

        # self.reg.fit(X_scaled, y_scaled)

        # ts = self.reg.predict(X_scaled)
        # sqdist = pd.DataFrame(data=np.square(ts - y_scaled), index=df.index)
        # within = sqdist < (self.threshold * self.threshold)
        # result = pd.concat([within, within ^ 1], axis=1)
        # result.columns = [self.to_string() + ":within_threshold",
        #                   self.to_string() + ":outside_threshold"]
        # return result

    def to_string(self) -> str:
        return "QuadraticRegression"

    def info(self) -> Optional[Dict[str, Any]]:
        try:
            min_value = self.min_max_scaler_x.data_min_
            max_value = self.min_max_scaler_x.data_max_
            num_points = 10  # will lead to `num_points + 1` samples
            step = (max_value - min_value) / num_points

            xs = map(lambda i: min_value + i * step, range(num_points+1))  # type: ignore
            if (self.dimCount == 1):
                xs = np.concatenate(list(xs), axis=0).reshape(-1, 1)
            else:
                xs = np.concatenate(list(xs), axis=0)
            xs_scaled = self.min_max_scaler_x.transform(xs)
            ys = self.min_max_scaler_y.inverse_transform(self.reg.predict(xs_scaled).reshape(-1, 1))
        except:
            return {
            "threshold": self.threshold,
            "points": {"xs": [], "ys": []}}

        return {
            "threshold": self.threshold,
            "points": {"xs": xs.tolist(), "ys": ys.tolist()}}  # type: ignore
