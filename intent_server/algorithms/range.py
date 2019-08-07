from sklearn import tree

from ..intent import Intent
from ..vendor.interactions import Prediction

import pandas as pd
import numpy as np


class Range(Intent):
    def __init__(self) -> None:
        pass

    def to_string(self) -> str:
        return 'Range'

    def to_prediction(self, selection: np.ndarray, df: pd.DataFrame) -> Prediction:

        # TODO: Revise this assumption
        df = df.fillna(0)

        model = tree.DecisionTreeClassifier()
        model.fit(df, selection)

        #tree.export_graphviz(model, out_file='tree.dot', feature_names=df.columns, rounded=True)
        #desc = tree.export_text(model)
        #print(desc)

        is_selected = np.array(selection[:,0], dtype=bool)
        selected_rows = df[is_selected]

        decision_path = model.decision_path(selected_rows)

	# create human readable output
        sample_id = 0 # TODO only unique ids
        paths = set()

        leave_id = model.apply(selected_rows)
        feature = model.tree_.feature
        threshold = model.tree_.threshold

        # TODO: This does a lot of unnecessary computations because a lot of sample probably fall into the same brush
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

                rule = df.columns[feature[node_id]] + threshold_sign + str(round(threshold[node_id], 2))
                rules.append(rule)

            paths.add(tuple(rules))

        return Prediction(self.to_string(), 42, info={"rules": list(paths)})


