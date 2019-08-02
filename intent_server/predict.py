from .properties import Measure, Properties
from .dataset import Dataset
from .dimensions import Dimensions
from .vendor.interactions import Interaction, InteractionTypeKind, Prediction

import numpy as np
import pandas as pd

from scipy.spatial.distance import jaccard
from typing import List, Set


def selection_array(df: pd.DataFrame, ids: Set[int]) -> np.ndarray:
    arr = np.zeros((len(df), 1))
    for i in ids:
        arr.itemset((i, 0), 1)
    return arr


def rank(selection: np.ndarray, measure: Measure, df: pd.DataFrame) -> float:
    measure_arr = measure.evaluate(df)
    return float(1 - jaccard(selection, measure_arr))


def is_selection(interaction: Interaction) -> bool:
    return (
        interaction.interaction_type.kind is InteractionTypeKind.SELECTION) or (
        interaction.interaction_type.brush_id is not None)


def relevant_ids(interactions: List[Interaction]) -> Set[int]:
    active_ids: Set[int] = set()
    for ix in interactions:
        if is_selection(ix):
            active_ids.update([int(x) for x in ix.interaction_type.data_ids])  # type: ignore
        elif ix.interaction_type.kind is InteractionTypeKind.DESELECTION:
            for id in ix.interaction_type.data_ids:  # type: ignore
                active_ids.remove(int(id))
    return active_ids


def predict(
        dataset: Dataset,
        properties: Properties,
        interactions: List[Interaction]) -> List[Prediction]:

    ids = relevant_ids(interactions)
    if len(ids) == 0:
        return []

    sel_array = selection_array(dataset.data, ids)

    filtered = list(filter(lambda x: x.interaction_type.data_ids, interactions))
    list_of_dims = map(lambda x: x.interaction_type.dimensions, filtered)
    dims = Dimensions(list(set([y for x in list_of_dims for y in x])))

    relevant_data = dataset.subset(dims)

    # Perform ranking
    ranks = map(lambda m: Prediction(
        m.to_string(),
        rank(sel_array, m, relevant_data),
    ), properties.measures)

    return list(ranks)
