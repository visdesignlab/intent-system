from intent_server.properties import Measure, Outlier

import pandas as pd


def test_measure_outlier():
    d = {'col1': [1, 2, 1, 2, 1000], 'col2': [2, 1, 1, 2, 1000]}
    df = pd.DataFrame(data=d)
    outls = Outlier(2, 0.1)
    assert (outls.compute(df) == [1, 1, 1, 1, -1]).all()
