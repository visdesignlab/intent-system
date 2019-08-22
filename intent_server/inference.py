from .dataset import Dataset
from .dimensions import Dimensions
from .algorithms import Outlier, Skyline, Range, KMeansCluster, Categories

from .vendor.interactions import Interaction, InteractionTypeKind, PredictionSet

from typing import List, Set

import pandas as pd


def is_point_selection(interaction: Interaction) -> bool:
    return interaction.interaction_type.kind is InteractionTypeKind.SELECTION

def is_point_deselection(interaction: Interaction) -> bool:
    return interaction.interaction_type.kind is InteractionTypeKind.DESELECTION

def is_brush_selection(interaction: Interaction) -> bool:
    return interaction.interaction_type.brush_id is not None

def relevant_ids(interactions: List[Interaction]) -> Set[int]:
    points: Set[int] = set()
    rects = dict()

    for ix in interactions:
        if is_point_selection(ix):
            points.update([int(x) for x in ix.interaction_type.data_ids])  # type: ignore
        elif is_point_deselection(ix):
            for id in ix.interaction_type.data_ids:  # type: ignore
                print(len(ix.interaction_type.data_ids))
                active_ids.remove(int(id))
        elif is_brush_selection(ix):
            rects.update({ix.interaction_type.brush_id: ix})

    for ix in rects:
        points.update([int(x) for x in rects[ix].interaction_type.data_ids])  # type: ignore

    return points


class Inference:
    def __init__(self, dataset: Dataset) -> None:
        self.dataset = dataset
        self.intents = [
            Outlier(),
            Skyline(),
            Range(),
            KMeansCluster(),
            Categories(dataset),
        ]

    def predict(self, interactions: List[Interaction]) -> PredictionSet:

        ids = relevant_ids(interactions)

        filtered = list(filter(lambda x: x.interaction_type.data_ids, interactions))
        list_of_dims = map(lambda x: x.interaction_type.dimensions, filtered)
        dims = Dimensions(list(set([y for x in list_of_dims for y in x])))

        if len(ids) == 0:
            return PredictionSet(
                predictions=[],
                dimensions=dims.dims,
                selected_ids=list(map(float, ids)))

        sel_array = self.dataset.selection(ids)

        relevant_data = self.dataset.subset(dims)

        # Perform ranking
        ranks = map(lambda m: m.to_prediction(sel_array, relevant_data), self.intents)
        return PredictionSet(
            predictions=[p for preds in ranks for p in preds],
            dimensions=dims.dims,
            selected_ids=list(map(float, ids)))

    def info(self, dims: Dimensions) -> pd.DataFrame:
        subset = self.dataset.data[dims.indices()]
        computed = pd.concat(map(lambda intent: intent.compute(subset),  # type: ignore
                                 self.intents), axis='columns')
        return pd.concat([computed, self.dataset.labels()], axis='columns')
