from intent_server.algorithms.skyline import belongs_to_skyline, dominates, Skyline

import pandas as pd
import numpy as np


def test_dominates():
    a = np.array([10, 30])
    b = np.array([20, 20])
    c = np.array([22, 28])
    d = np.array([28, 8])
    e = np.array([30, 18])
    f = np.array([39, 15])

    assert(not(dominates(a, b)))

    assert(dominates(b, c))
    assert(dominates(d, e))
    assert(dominates(d, f))


def test_belongs_to_skyline():
    a = [10, 30]
    b = [20, 20]
    c = [22, 28]
    d = [28, 8]
    e = [30, 18]
    f = [39, 15]
    data = np.array([a, b, c, d, e, f])

    assert belongs_to_skyline(data, np.array(a))
    assert belongs_to_skyline(data, np.array(b))
    assert belongs_to_skyline(data, np.array(d))

    assert belongs_to_skyline(data, np.array(c)) == False
    assert belongs_to_skyline(data, np.array(e)) == False
    assert belongs_to_skyline(data, np.array(f)) == False


def test_skyline():
    df = pd.DataFrame(data={'x': [10, 20, 22, 28, 30, 39], 'y': [30, 20, 28, 8, 18, 15]})
    skyline = Skyline().compute(df)
    assert False
