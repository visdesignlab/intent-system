from sklearn import tree

from ..intent import Intent
from ..vendor.interactions import Prediction

import pandas as pd
import numpy as np

from typing import List


class Range(Intent):
    def __init__(self) -> None:
        pass

    def to_string(self) -> str:
        return 'Range'

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        return pd.DataFrame(index=df.index)

    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> List[Prediction]:
        # TODO: Revise this assumption
        df = df.fillna(0)
        model = tree.DecisionTreeClassifier()
        model.fit(df, selection)
        rules = tree.export.export_text(model, feature_names=list(df.columns))
        return [Prediction(self.to_string(), 0.3, info={"rules": rules})]
