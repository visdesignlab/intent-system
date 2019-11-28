from .dataset import Dataset
from .dimensions import Dimensions
from .algorithms import LinearRegression, Outlier, Skyline, Range, KMeansCluster
from .algorithms import Categories, DBSCANCluster, Inverse

from .vendor.interactions import Interaction, InteractionTypeKind, PredictionSet, MultiBrushBehavior

from sklearn.naive_bayes import MultinomialNB
from typing import List, Set
import pandas as pd
import itertools


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
            Inverse(Outlier()),
            Skyline(),
            KMeansCluster(2),
            KMeansCluster(3),
            KMeansCluster(4),
            KMeansCluster(5),
            KMeansCluster(6),
            KMeansCluster(7),
            DBSCANCluster(0.25),
            DBSCANCluster(0.5),
            DBSCANCluster(0.75),
            DBSCANCluster(1),
            Categories(dataset),
            LinearRegression(0.05),
            LinearRegression(0.08),
            LinearRegression(0.1),
        ]
        self.special_intents = [
            Range(),
        ]

    def predict(self, interactions: List[Interaction], op: MultiBrushBehavior) -> PredictionSet:

        ids = relevant_ids(interactions, op)

        # Filters removed plots
        inactive_plots = set()
        for inter in interactions:
            if inter.interaction_type.kind is InteractionTypeKind.REMOVE:
                inactive_plots.add(inter.interaction_type.plot.id)
            elif inter.interaction_type.kind is InteractionTypeKind.ADD:
                inactive_plots.discard(inter.interaction_type.plot.id)

        filtered = list(filter(lambda x: x.interaction_type.data_ids and not (
            x.interaction_type.plot.id in inactive_plots), interactions))

        list_of_dims = list(map(lambda interaction: [interaction.interaction_type.plot.x,  # type: ignore
                                                     interaction.interaction_type.plot.y]  # type: ignore
                                if interaction.interaction_type.plot  # type: ignore
                                else ["", ""], filtered))  # type: ignore

        tuple_dims = set(map(lambda x: Dimensions(x), list_of_dims))
        dims = Dimensions(list(set([y for x in list_of_dims for y in x])))
        tuple_dims.discard(dims)
        tuple_dims = list(tuple_dims)

        print(dims)
        print(tuple_dims)

        if len(ids) == 0:
            return PredictionSet(
                predictions=[],
                dimensions=dims.dims,
                selected_ids=list(map(float, ids)))

        sel_array = self.dataset.selection(ids)
        relevant_data = self.dataset.subset(dims)

        list_of_predictions = []
        list_of_computed = []

        for intent in self.intents:
            # All dimensions
            pred, comp = intent.to_prediction(sel_array, relevant_data)
            list_of_predictions.extend(pred)
            list_of_computed.append(comp)

            for d in tuple_dims:
                pred, comp = intent.to_prediction(sel_array, self.dataset.subset(d))
                list_of_predictions.extend(pred)
                list_of_computed.append(comp)

        # Add probailities
        outputs = pd.concat(list_of_computed, axis='columns')
        train = outputs.T.to_numpy()
        labels = outputs.columns.values.tolist()

        clf = MultinomialNB(fit_prior=False)
        clf.fit(train, labels)

        # dictionary containing the probabilities
        probs = dict(zip(
            clf.classes_.flatten().tolist(),
            clf.predict_proba(sel_array.transpose()).flatten().tolist()))

        for p in list_of_predictions:
            if p.intent in probs:
                if p.info is None:
                    p.info = dict()
                p.info['probability'] = probs[p.intent]

        # Some intents don't have a probability so we add them seperately.
        special_predictions = list(map(lambda si: si.to_prediction(
            sel_array, relevant_data), self.special_intents))
        flat_list = [item for sublist in special_predictions for item in sublist]
        list_of_predictions.extend(flat_list)

        return PredictionSet(
            predictions=list_of_predictions,
            dimensions=dims.dims,
            selected_ids=list(map(float, ids)))

    def info(self, dims: Dimensions) -> pd.DataFrame:
        subset = self.dataset.data[dims.indices()]
        computed = pd.concat(map(lambda intent: intent.compute(subset),  # type: ignore
                                 self.intents), axis='columns')
        return pd.concat([computed, self.dataset.labels()], axis='columns')
