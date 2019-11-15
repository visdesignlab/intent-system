from .dataset import Dataset
from .dimensions import Dimensions
from .algorithms import Outlier, Skyline, Range, KMeansCluster, Categories, DBSCANCluster

from .vendor.interactions import Interaction, InteractionTypeKind, PredictionSet, MultiBrushBehavior

from sklearn.naive_bayes import MultinomialNB
from typing import List, Set
import pandas as pd
import sys


def is_point_selection(interaction: Interaction) -> bool:
    return interaction.interaction_type.kind is InteractionTypeKind.SELECTION


def is_point_deselection(interaction: Interaction) -> bool:
    return interaction.interaction_type.kind is InteractionTypeKind.DESELECTION


def is_brush_selection(interaction: Interaction) -> bool:
    return interaction.interaction_type.brush_id is not None


def relevant_ids(interactions: List[Interaction], op: MultiBrushBehavior) -> Set[int]:
    points: Set[int] = set()
    rects = dict()

    for ix in interactions:
        if is_point_selection(ix):
            points.update([int(x) for x in ix.interaction_type.data_ids])  # type: ignore
        elif is_point_deselection(ix):
            # should actually be only one point :)
            for id in ix.interaction_type.data_ids:  # type: ignore
                points.remove(int(id))
        elif is_brush_selection(ix):
            rects.update({ix.interaction_type.brush_id: ix})

    if op is MultiBrushBehavior.UNION:
        for brush_id in rects:
            points.update(
                [int(x) for x in rects[brush_id].interaction_type.data_ids or []])  # type: ignore
    if op is MultiBrushBehavior.INTERSECTION:
        setlist = []
        for brush_id in rects:
            id_list = map(lambda x: int(x),  # type: ignore
                          rects[brush_id].interaction_type.data_ids or [])
            setlist.append(set(id_list))
        setlist = [d for d in setlist if d != set()]
        if len(setlist) > 0:
            points.update(set.intersection(*setlist))

    return points


class Inference:
    def __init__(self, dataset: Dataset) -> None:
        self.dataset = dataset
        self.intents = [
            Outlier(),
            Skyline(),
            Range(),
            KMeansCluster(),
            DBSCANCluster(),
            Categories(dataset),
        ]

    def predict(self, interactions: List[Interaction], op: MultiBrushBehavior) -> PredictionSet:

        ids = relevant_ids(interactions, op)

        filtered = list(filter(lambda x: x.interaction_type.data_ids, interactions))
        list_of_dims = map(lambda interaction: [interaction.interaction_type.plot.x,  # type: ignore
                                                interaction.interaction_type.plot.y]  # type: ignore
                           if interaction.interaction_type.plot  # type: ignore
                           else ["", ""], filtered)  # type: ignore

        dims = Dimensions(list(set([y for x in list_of_dims for y in x])))

        if len(ids) == 0:
            return PredictionSet(
                predictions=[],
                dimensions=dims.dims,
                selected_ids=list(map(float, ids)))

        sel_array = self.dataset.selection(ids)

        relevant_data = self.dataset.subset(dims)

        outputs = pd.concat(
            map(lambda intent: intent.compute(relevant_data), self.intents),  # type: ignore
            axis='columns')

        # Perform ranking
        ranks = map(lambda m: m.to_prediction(sel_array, relevant_data), self.intents)
        print(self.info(dims), file=sys.stderr)

        predictions = [p for preds in ranks for p in preds]

        # Add probailities
        train = outputs.T.to_numpy()
        labels = outputs.columns.values.tolist()

        clf = MultinomialNB(fit_prior=False)
        clf.fit(train, labels)

        # dictionary containing the probabilities
        probs = dict(zip(
            clf.classes_.flatten().tolist(),
            clf.predict_proba(sel_array.astype(bool).transpose()).flatten().tolist()))

        for p in predictions:
            if p.intent in probs:
                if p.info is None:
                    p.info = dict()
                p.info['probability'] = probs[p.intent]

        return PredictionSet(
            predictions=predictions,
            dimensions=dims.dims,
            selected_ids=list(map(float, ids)))

    def info(self, dims: Dimensions) -> pd.DataFrame:
        subset = self.dataset.data[dims.indices()]
        computed = pd.concat(map(lambda intent: intent.compute(subset),  # type: ignore
                                 self.intents), axis='columns')
        return pd.concat([computed, self.dataset.labels()], axis='columns')
