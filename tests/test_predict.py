from intent_server.vendor.interactions import Interaction, InteractionType, InteractionTypeKind, MultiBrushBehavior
from intent_server.inference import relevant_ids

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


def create_brush_selection(ids: List[int], brush_id: str):
    return Interaction(
        InteractionType(
            data_ids=ids,
            dimensions=['A', 'B'],
            bottom=None,
            brush_id=brush_id,
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
    res = relevant_ids([a, b], MultiBrushBehavior.UNION)
    assert res == {1, 2, 4, 3}


def test_brush_selections_intersection():
    a = create_brush_selection([1, 4, 2], 'a')
    b = create_brush_selection([2, 3, 1], 'b')
    res = relevant_ids([a, b], MultiBrushBehavior.INTERSECTION)
    assert res == {1, 2}


def test_deselections():
    a = create_selection([1, 4])
    b = create_selection([2, 3])
    c = create_deselection([1, 2])
    res = relevant_ids([a, b, c], MultiBrushBehavior.UNION)
    assert res == {4, 3}
