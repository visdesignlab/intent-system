from .dataset import Dataset
from .dimensions import Dimensions
from .intent import IntentBinary, IntentMulticlass
from .algorithms import Outlier, Skyline, Range, KMeansCluster, Categories

from .vendor.interactions import Interaction, InteractionTypeKind, Prediction

from typing import List, Set

import pandas as pd


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

    def predict(self, interactions: List[Interaction]) -> List[Prediction]:

        ids = relevant_ids(interactions)
        if len(ids) == 0:
            return []

        sel_array = self.dataset.selection(ids)

        filtered = list(filter(lambda x: x.interaction_type.data_ids, interactions))
        list_of_dims = map(lambda x: x.interaction_type.dimensions, filtered)
        dims = Dimensions(list(set([y for x in list_of_dims for y in x])))

        relevant_data = self.dataset.subset(dims)

        # Perform ranking
        ranks = map(lambda m: m.to_prediction(sel_array, relevant_data), self.intents)
        return [p for preds in ranks for p in preds]

    def info(self, dims: Dimensions) -> pd.DataFrame:
        sel = self.dataset.data[dims.indices()]
        bin_comp_measures = map(lambda i: i.compute(sel),  # type: ignore
                                filter(lambda x: isinstance(x, IntentBinary),
                                       self.intents))  # type: ignore

        multiclass = filter(lambda x: isinstance(x, IntentMulticlass), self.intents)
        multiclass_instances = [item for sublist in
                                map(lambda x: x.instances(sel),  # type: ignore
                                    multiclass) for item in sublist]
        multi_comp_measures = map(lambda i: i.compute(sel), multiclass_instances)  # type: ignore

        comp_measures = list(bin_comp_measures) + list(multi_comp_measures) + \
            [self.dataset.labels()]
        concated = pd.concat(comp_measures, axis='columns')
        return concated
