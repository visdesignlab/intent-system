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

        is_selected = np.array(selection[:, 0], dtype=bool)
        selected_rows = df[is_selected]

        decision_path = model.decision_path(selected_rows)

        # create human readable output
        paths = set()

        leave_id = model.apply(selected_rows)
        feature = model.tree_.feature
        threshold = model.tree_.threshold

        # TODO: This does a lot of unnecessary computations because a lot of
        # sample probably fall into the same brush
        for sample_id in range(len(selected_rows.index)):
            node_index = decision_path.indices[decision_path.indptr[sample_id]:
                                               decision_path.indptr[sample_id + 1]]

            rules = []
            for node_id in node_index:
                if leave_id[sample_id] == node_id:
                    continue

                if (selected_rows.iloc[sample_id, feature[node_id]] <= threshold[node_id]):
                    threshold_sign = " <= "
                else:
                    threshold_sign = " > "

                rule = df.columns[feature[node_id]] + \
                    threshold_sign + str(round(threshold[node_id], 2))
                rules.append(rule)

            paths.add(tuple(rules))

        return [Prediction(self.to_string(), 0.3, info={"rules": list(paths)})]
