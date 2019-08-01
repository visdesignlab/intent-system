from intent_server.vendor.interactions import Interaction, InteractionType, InteractionTypeKind
from intent_server.predict import relevant_ids

from typing import List


def create_selection(ids: List[int]):
    return Interaction(
        InteractionType(
            data_ids=ids,
            dimensions=['A', 'B'],
            kind=InteractionTypeKind.SELECTION,
            bottom=None,
            brush_id=None,
            left=None,
            right=None,
            top=None,
        ),
        "ScatterPlot")


def create_deselection(ids: List[int]):
    return Interaction(
        InteractionType(
            data_ids=ids,
            dimensions=['A', 'B'],
            kind=InteractionTypeKind.DESELECTION,
            bottom=None,
            brush_id=None,
            left=None,
            right=None,
            top=None,
        ),
        "ScatterPlot")


def test_only_selections():
    a = create_selection([1, 4])
    b = create_selection([2, 3])
    res = relevant_ids([a, b])
    assert res == {1, 2, 4, 3}


def test_deselections():
    a = create_selection([1, 4])
    b = create_selection([2, 3])
    c = create_deselection([1, 2])
    res = relevant_ids([a, b, c])
    assert res == {4, 3}
