from intent_server.properties import Outlier

import pandas as pd
import numpy as np


def test_measure_outlier():
    d = {'col1': [1, 2, 1, 2, 1000], 'col2': [2, 1, 1, 2, 1000]}
    df = pd.DataFrame(data=d)
    outls = Outlier(2, 0.1).compute(df).values.transpose()
    assert np.array_equal(outls, np.array([1, 1, 1, 1, -1]).reshape([1, 5]))
