from intent_server.algorithms.skyline import belongs_to_skyline, dominates, Skyline

import numpy as np
import pandas as pd


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

    assert not belongs_to_skyline(data, np.array(c))
    assert not belongs_to_skyline(data, np.array(e))
    assert not belongs_to_skyline(data, np.array(f))


def test_skyline():
    a = [10, 30]
    b = [20, 20]
    c = [22, 28]
    d = [28, 8]
    e = [30, 18]
    f = [39, 15]
    data = np.array([a, b, c, d, e, f])
    df = pd.DataFrame(data=data)
    skyline = Skyline().compute(df).iloc[:, 3].transpose().values
    assert np.array_equal(skyline, np.array([1, 0, 1, 0, 1, 1]))


def test_skyline_unordered():
    a = [10, 30]
    b = [20, 20]
    c = [22, 28]
    d = [28, 8]
    e = [30, 18]
    f = [39, 15]
    data = np.array([f, e, b, d, a, c])
    df = pd.DataFrame(data=data)
    skyline = Skyline().compute(df).iloc[:, 3].transpose().values
    assert np.array_equal(skyline, np.array([1, 1, 0, 0, 1, 1]))


def test_skyline_nan():
    a = [10, 30]
    b = [20, 20]
    c = [22, 28]
    d = [28, 8]
    e = [30, 18]
    f = [39, 15]
    g = [24, np.nan]
    h = [np.nan, 5]
    data = np.array([a, b, c, d, e, f, g, h])
    df = pd.DataFrame(data=data)
    skyline = Skyline().compute(df).iloc[:, 3].transpose().values
    assert np.array_equal(skyline, np.array([1,0,1,0,1,1,1,1]))
