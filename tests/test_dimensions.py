from intent_server.properties import Dimensions


def test_hash_equal():
    a = Dimensions(['A', 'B'])
    b = Dimensions(['B', 'A'])
    assert hash(a) == hash(b)


def test_dimension_dict():
    a = Dimensions(['A', 'B'])
    b = Dimensions(['B', 'A'])
    dictionary = {}
    dictionary[a] = 42
    assert dictionary[b] == 42
