from intent_server.algorithms.skyline import dominates

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
