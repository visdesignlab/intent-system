# To use this code, make sure you
#
#     import json
#
# and then, to convert JSON from a string, do
#
#     result = visualization_type_from_dict(json.loads(json_string))
#     result = selection_from_dict(json.loads(json_string))
#     result = point_selection_from_dict(json.loads(json_string))
#     result = point_deselection_from_dict(json.loads(json_string))
#     result = rectangular_selection_from_dict(json.loads(json_string))
#     result = change_axis_from_dict(json.loads(json_string))
#     result = clear_all_selections_from_dict(json.loads(json_string))
#     result = multi_brush_behavior_from_dict(json.loads(json_string))
#     result = plot_from_dict(json.loads(json_string))
#     result = prediction_request_from_dict(json.loads(json_string))
#     result = plots_interaction_from_dict(json.loads(json_string))
#     result = add_plot_interaction_from_dict(json.loads(json_string))
#     result = remove_plot_interaction_from_dict(json.loads(json_string))
#     result = update_plot_interaction_from_dict(json.loads(json_string))
#     result = interaction_type_from_dict(json.loads(json_string))
#     result = interaction_from_dict(json.loads(json_string))
#     result = interaction_history_from_dict(json.loads(json_string))
#     result = prediction_from_dict(json.loads(json_string))
#     result = prediction_set_from_dict(json.loads(json_string))

from dataclasses import dataclass
from typing import Any, List, Optional, Dict, TypeVar, Callable, Type, cast
from enum import Enum


T = TypeVar("T")
EnumT = TypeVar("EnumT", bound=Enum)


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


def from_list(f: Callable[[Any], T], x: Any) -> List[T]:
    assert isinstance(x, list)
    return [f(y) for y in x]


def from_float(x: Any) -> float:
    assert isinstance(x, (float, int)) and not isinstance(x, bool)
    return float(x)


def from_none(x: Any) -> Any:
    assert x is None
    return x


def from_union(fs, x):
    for f in fs:
        try:
            return f(x)
        except:
            pass
    assert False


def to_float(x: Any) -> float:
    assert isinstance(x, float)
    return x


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


def to_enum(c: Type[EnumT], x: Any) -> EnumT:
    assert isinstance(x, c)
    return x.value


def from_dict(f: Callable[[Any], T], x: Any) -> Dict[str, T]:
    assert isinstance(x, dict)
    return { k: f(v) for (k, v) in x.items() }


@dataclass
class Plot:
    color: str
    id: str
    x: str
    y: str

    @staticmethod
    def from_dict(obj: Any) -> 'Plot':
        assert isinstance(obj, dict)
        color = from_str(obj.get("color"))
        id = from_str(obj.get("id"))
        x = from_str(obj.get("x"))
        y = from_str(obj.get("y"))
        return Plot(color, id, x, y)

    def to_dict(self) -> dict:
        result: dict = {}
        result["color"] = from_str(self.color)
        result["id"] = from_str(self.id)
        result["x"] = from_str(self.x)
        result["y"] = from_str(self.y)
        return result


@dataclass
class Selection:
    data_ids: List[float]
    plot: Plot
    dimensions: Optional[List[str]] = None

    @staticmethod
    def from_dict(obj: Any) -> 'Selection':
        assert isinstance(obj, dict)
        data_ids = from_list(from_float, obj.get("dataIds"))
        plot = Plot.from_dict(obj.get("plot"))
        dimensions = from_union([lambda x: from_list(from_str, x), from_none], obj.get("dimensions"))
        return Selection(data_ids, plot, dimensions)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_list(to_float, self.data_ids)
        result["plot"] = to_class(Plot, self.plot)
        result["dimensions"] = from_union([lambda x: from_list(from_str, x), from_none], self.dimensions)
        return result


class PointSelectionKind(Enum):
    SELECTION = "selection"


@dataclass
class PointSelection:
    data_ids: List[float]
    kind: PointSelectionKind
    plot: Plot
    dimensions: Optional[List[str]] = None

    @staticmethod
    def from_dict(obj: Any) -> 'PointSelection':
        assert isinstance(obj, dict)
        data_ids = from_list(from_float, obj.get("dataIds"))
        kind = PointSelectionKind(obj.get("kind"))
        plot = Plot.from_dict(obj.get("plot"))
        dimensions = from_union([lambda x: from_list(from_str, x), from_none], obj.get("dimensions"))
        return PointSelection(data_ids, kind, plot, dimensions)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_list(to_float, self.data_ids)
        result["kind"] = to_enum(PointSelectionKind, self.kind)
        result["plot"] = to_class(Plot, self.plot)
        result["dimensions"] = from_union([lambda x: from_list(from_str, x), from_none], self.dimensions)
        return result


class PointDeselectionKind(Enum):
    DESELECTION = "deselection"


@dataclass
class PointDeselection:
    data_ids: List[float]
    kind: PointDeselectionKind
    plot: Plot
    dimensions: Optional[List[str]] = None

    @staticmethod
    def from_dict(obj: Any) -> 'PointDeselection':
        assert isinstance(obj, dict)
        data_ids = from_list(from_float, obj.get("dataIds"))
        kind = PointDeselectionKind(obj.get("kind"))
        plot = Plot.from_dict(obj.get("plot"))
        dimensions = from_union([lambda x: from_list(from_str, x), from_none], obj.get("dimensions"))
        return PointDeselection(data_ids, kind, plot, dimensions)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_list(to_float, self.data_ids)
        result["kind"] = to_enum(PointDeselectionKind, self.kind)
        result["plot"] = to_class(Plot, self.plot)
        result["dimensions"] = from_union([lambda x: from_list(from_str, x), from_none], self.dimensions)
        return result


@dataclass
class RectangularSelection:
    bottom: float
    brush_id: str
    data_ids: List[float]
    left: float
    plot: Plot
    right: float
    top: float
    dimensions: Optional[List[str]] = None

    @staticmethod
    def from_dict(obj: Any) -> 'RectangularSelection':
        assert isinstance(obj, dict)
        bottom = from_float(obj.get("bottom"))
        brush_id = from_str(obj.get("brushId"))
        data_ids = from_list(from_float, obj.get("dataIds"))
        left = from_float(obj.get("left"))
        plot = Plot.from_dict(obj.get("plot"))
        right = from_float(obj.get("right"))
        top = from_float(obj.get("top"))
        dimensions = from_union([lambda x: from_list(from_str, x), from_none], obj.get("dimensions"))
        return RectangularSelection(bottom, brush_id, data_ids, left, plot, right, top, dimensions)

    def to_dict(self) -> dict:
        result: dict = {}
        result["bottom"] = to_float(self.bottom)
        result["brushId"] = from_str(self.brush_id)
        result["dataIds"] = from_list(to_float, self.data_ids)
        result["left"] = to_float(self.left)
        result["plot"] = to_class(Plot, self.plot)
        result["right"] = to_float(self.right)
        result["top"] = to_float(self.top)
        result["dimensions"] = from_union([lambda x: from_list(from_str, x), from_none], self.dimensions)
        return result


@dataclass
class ChangeAxis:
    dimensions: List[str]

    @staticmethod
    def from_dict(obj: Any) -> 'ChangeAxis':
        assert isinstance(obj, dict)
        dimensions = from_list(from_str, obj.get("dimensions"))
        return ChangeAxis(dimensions)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dimensions"] = from_list(from_str, self.dimensions)
        return result


class ClearAllSelectionsKind(Enum):
    CLEARALL = "clearall"


@dataclass
class ClearAllSelections:
    data_ids: List[float]
    kind: ClearAllSelectionsKind
    plot: Plot
    dimensions: Optional[List[str]] = None

    @staticmethod
    def from_dict(obj: Any) -> 'ClearAllSelections':
        assert isinstance(obj, dict)
        data_ids = from_list(from_float, obj.get("dataIds"))
        kind = ClearAllSelectionsKind(obj.get("kind"))
        plot = Plot.from_dict(obj.get("plot"))
        dimensions = from_union([lambda x: from_list(from_str, x), from_none], obj.get("dimensions"))
        return ClearAllSelections(data_ids, kind, plot, dimensions)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_list(to_float, self.data_ids)
        result["kind"] = to_enum(ClearAllSelectionsKind, self.kind)
        result["plot"] = to_class(Plot, self.plot)
        result["dimensions"] = from_union([lambda x: from_list(from_str, x), from_none], self.dimensions)
        return result


class InteractionTypeKind(Enum):
    ADD = "ADD"
    CLEARALL = "clearall"
    DESELECTION = "deselection"
    REMOVE = "REMOVE"
    SELECTION = "selection"
    UPDATE = "UPDATE"


@dataclass
class InteractionType:
    data_ids: Optional[List[float]] = None
    dimensions: Optional[List[str]] = None
    kind: Optional[InteractionTypeKind] = None
    plot: Optional[Plot] = None
    bottom: Optional[float] = None
    brush_id: Optional[str] = None
    left: Optional[float] = None
    right: Optional[float] = None
    top: Optional[float] = None

    @staticmethod
    def from_dict(obj: Any) -> 'InteractionType':
        assert isinstance(obj, dict)
        data_ids = from_union([lambda x: from_list(from_float, x), from_none], obj.get("dataIds"))
        dimensions = from_union([lambda x: from_list(from_str, x), from_none], obj.get("dimensions"))
        kind = from_union([InteractionTypeKind, from_none], obj.get("kind"))
        plot = from_union([Plot.from_dict, from_none], obj.get("plot"))
        bottom = from_union([from_float, from_none], obj.get("bottom"))
        brush_id = from_union([from_str, from_none], obj.get("brushId"))
        left = from_union([from_float, from_none], obj.get("left"))
        right = from_union([from_float, from_none], obj.get("right"))
        top = from_union([from_float, from_none], obj.get("top"))
        return InteractionType(data_ids, dimensions, kind, plot, bottom, brush_id, left, right, top)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_union([lambda x: from_list(to_float, x), from_none], self.data_ids)
        result["dimensions"] = from_union([lambda x: from_list(from_str, x), from_none], self.dimensions)
        result["kind"] = from_union([lambda x: to_enum(InteractionTypeKind, x), from_none], self.kind)
        result["plot"] = from_union([lambda x: to_class(Plot, x), from_none], self.plot)
        result["bottom"] = from_union([to_float, from_none], self.bottom)
        result["brushId"] = from_union([from_str, from_none], self.brush_id)
        result["left"] = from_union([to_float, from_none], self.left)
        result["right"] = from_union([to_float, from_none], self.right)
        result["top"] = from_union([to_float, from_none], self.top)
        return result


class VisualizationType(Enum):
    GRID = "Grid"
    NONE = "None"
    PARALLEL_COORDINATE_PLOT = "ParallelCoordinatePlot"
    SCATTERPLOT = "Scatterplot"
    SCATTERPLOT_MATRIX = "ScatterplotMatrix"


@dataclass
class Interaction:
    interaction_type: InteractionType
    visualization_type: VisualizationType

    @staticmethod
    def from_dict(obj: Any) -> 'Interaction':
        assert isinstance(obj, dict)
        interaction_type = InteractionType.from_dict(obj.get("interactionType"))
        visualization_type = VisualizationType(obj.get("visualizationType"))
        return Interaction(interaction_type, visualization_type)

    def to_dict(self) -> dict:
        result: dict = {}
        result["interactionType"] = to_class(InteractionType, self.interaction_type)
        result["visualizationType"] = to_enum(VisualizationType, self.visualization_type)
        return result


class MultiBrushBehavior(Enum):
    INTERSECTION = "INTERSECTION"
    UNION = "UNION"


@dataclass
class PredictionRequest:
    interaction_history: List[Interaction]
    multi_brush_behavior: MultiBrushBehavior

    @staticmethod
    def from_dict(obj: Any) -> 'PredictionRequest':
        assert isinstance(obj, dict)
        interaction_history = from_list(Interaction.from_dict, obj.get("interactionHistory"))
        multi_brush_behavior = MultiBrushBehavior(obj.get("multiBrushBehavior"))
        return PredictionRequest(interaction_history, multi_brush_behavior)

    def to_dict(self) -> dict:
        result: dict = {}
        result["interactionHistory"] = from_list(lambda x: to_class(Interaction, x), self.interaction_history)
        result["multiBrushBehavior"] = to_enum(MultiBrushBehavior, self.multi_brush_behavior)
        return result


@dataclass
class PlotsInteraction:
    plot: Plot

    @staticmethod
    def from_dict(obj: Any) -> 'PlotsInteraction':
        assert isinstance(obj, dict)
        plot = Plot.from_dict(obj.get("plot"))
        return PlotsInteraction(plot)

    def to_dict(self) -> dict:
        result: dict = {}
        result["plot"] = to_class(Plot, self.plot)
        return result


class AddPlotInteractionKind(Enum):
    ADD = "ADD"


@dataclass
class AddPlotInteraction:
    kind: AddPlotInteractionKind
    plot: Plot

    @staticmethod
    def from_dict(obj: Any) -> 'AddPlotInteraction':
        assert isinstance(obj, dict)
        kind = AddPlotInteractionKind(obj.get("kind"))
        plot = Plot.from_dict(obj.get("plot"))
        return AddPlotInteraction(kind, plot)

    def to_dict(self) -> dict:
        result: dict = {}
        result["kind"] = to_enum(AddPlotInteractionKind, self.kind)
        result["plot"] = to_class(Plot, self.plot)
        return result


class RemovePlotInteractionKind(Enum):
    REMOVE = "REMOVE"


@dataclass
class RemovePlotInteraction:
    kind: RemovePlotInteractionKind
    plot: Plot

    @staticmethod
    def from_dict(obj: Any) -> 'RemovePlotInteraction':
        assert isinstance(obj, dict)
        kind = RemovePlotInteractionKind(obj.get("kind"))
        plot = Plot.from_dict(obj.get("plot"))
        return RemovePlotInteraction(kind, plot)

    def to_dict(self) -> dict:
        result: dict = {}
        result["kind"] = to_enum(RemovePlotInteractionKind, self.kind)
        result["plot"] = to_class(Plot, self.plot)
        return result


class UpdatePlotInteractionKind(Enum):
    UPDATE = "UPDATE"


@dataclass
class UpdatePlotInteraction:
    kind: UpdatePlotInteractionKind
    plot: Plot

    @staticmethod
    def from_dict(obj: Any) -> 'UpdatePlotInteraction':
        assert isinstance(obj, dict)
        kind = UpdatePlotInteractionKind(obj.get("kind"))
        plot = Plot.from_dict(obj.get("plot"))
        return UpdatePlotInteraction(kind, plot)

    def to_dict(self) -> dict:
        result: dict = {}
        result["kind"] = to_enum(UpdatePlotInteractionKind, self.kind)
        result["plot"] = to_class(Plot, self.plot)
        return result


@dataclass
class Prediction:
    intent: str
    rank: float
    data_ids: Optional[List[float]] = None
    info: Optional[Dict[str, Any]] = None
    suggestion: Optional[List['Prediction']] = None

    @staticmethod
    def from_dict(obj: Any) -> 'Prediction':
        assert isinstance(obj, dict)
        intent = from_str(obj.get("intent"))
        rank = from_float(obj.get("rank"))
        data_ids = from_union([lambda x: from_list(from_float, x), from_none], obj.get("dataIds"))
        info = from_union([lambda x: from_dict(lambda x: x, x), from_none], obj.get("info"))
        suggestion = from_union([lambda x: from_list(Prediction.from_dict, x), from_none], obj.get("suggestion"))
        return Prediction(intent, rank, data_ids, info, suggestion)

    def to_dict(self) -> dict:
        result: dict = {}
        result["intent"] = from_str(self.intent)
        result["rank"] = to_float(self.rank)
        result["dataIds"] = from_union([lambda x: from_list(to_float, x), from_none], self.data_ids)
        result["info"] = from_union([lambda x: from_dict(lambda x: x, x), from_none], self.info)
        result["suggestion"] = from_union([lambda x: from_list(lambda x: to_class(Prediction, x), x), from_none], self.suggestion)
        return result


@dataclass
class PredictionSet:
    dimensions: List[str]
    predictions: List[Prediction]
    selected_ids: List[float]

    @staticmethod
    def from_dict(obj: Any) -> 'PredictionSet':
        assert isinstance(obj, dict)
        dimensions = from_list(from_str, obj.get("dimensions"))
        predictions = from_list(Prediction.from_dict, obj.get("predictions"))
        selected_ids = from_list(from_float, obj.get("selectedIds"))
        return PredictionSet(dimensions, predictions, selected_ids)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dimensions"] = from_list(from_str, self.dimensions)
        result["predictions"] = from_list(lambda x: to_class(Prediction, x), self.predictions)
        result["selectedIds"] = from_list(to_float, self.selected_ids)
        return result


def visualization_type_from_dict(s: Any) -> VisualizationType:
    return VisualizationType(s)


def visualization_type_to_dict(x: VisualizationType) -> Any:
    return to_enum(VisualizationType, x)


def selection_from_dict(s: Any) -> Selection:
    return Selection.from_dict(s)


def selection_to_dict(x: Selection) -> Any:
    return to_class(Selection, x)


def point_selection_from_dict(s: Any) -> PointSelection:
    return PointSelection.from_dict(s)


def point_selection_to_dict(x: PointSelection) -> Any:
    return to_class(PointSelection, x)


def point_deselection_from_dict(s: Any) -> PointDeselection:
    return PointDeselection.from_dict(s)


def point_deselection_to_dict(x: PointDeselection) -> Any:
    return to_class(PointDeselection, x)


def rectangular_selection_from_dict(s: Any) -> RectangularSelection:
    return RectangularSelection.from_dict(s)


def rectangular_selection_to_dict(x: RectangularSelection) -> Any:
    return to_class(RectangularSelection, x)


def change_axis_from_dict(s: Any) -> ChangeAxis:
    return ChangeAxis.from_dict(s)


def change_axis_to_dict(x: ChangeAxis) -> Any:
    return to_class(ChangeAxis, x)


def clear_all_selections_from_dict(s: Any) -> ClearAllSelections:
    return ClearAllSelections.from_dict(s)


def clear_all_selections_to_dict(x: ClearAllSelections) -> Any:
    return to_class(ClearAllSelections, x)


def multi_brush_behavior_from_dict(s: Any) -> MultiBrushBehavior:
    return MultiBrushBehavior(s)


def multi_brush_behavior_to_dict(x: MultiBrushBehavior) -> Any:
    return to_enum(MultiBrushBehavior, x)


def plot_from_dict(s: Any) -> Plot:
    return Plot.from_dict(s)


def plot_to_dict(x: Plot) -> Any:
    return to_class(Plot, x)


def prediction_request_from_dict(s: Any) -> PredictionRequest:
    return PredictionRequest.from_dict(s)


def prediction_request_to_dict(x: PredictionRequest) -> Any:
    return to_class(PredictionRequest, x)


def plots_interaction_from_dict(s: Any) -> PlotsInteraction:
    return PlotsInteraction.from_dict(s)


def plots_interaction_to_dict(x: PlotsInteraction) -> Any:
    return to_class(PlotsInteraction, x)


def add_plot_interaction_from_dict(s: Any) -> AddPlotInteraction:
    return AddPlotInteraction.from_dict(s)


def add_plot_interaction_to_dict(x: AddPlotInteraction) -> Any:
    return to_class(AddPlotInteraction, x)


def remove_plot_interaction_from_dict(s: Any) -> RemovePlotInteraction:
    return RemovePlotInteraction.from_dict(s)


def remove_plot_interaction_to_dict(x: RemovePlotInteraction) -> Any:
    return to_class(RemovePlotInteraction, x)


def update_plot_interaction_from_dict(s: Any) -> UpdatePlotInteraction:
    return UpdatePlotInteraction.from_dict(s)


def update_plot_interaction_to_dict(x: UpdatePlotInteraction) -> Any:
    return to_class(UpdatePlotInteraction, x)


def interaction_type_from_dict(s: Any) -> InteractionType:
    return InteractionType.from_dict(s)


def interaction_type_to_dict(x: InteractionType) -> Any:
    return to_class(InteractionType, x)


def interaction_from_dict(s: Any) -> Interaction:
    return Interaction.from_dict(s)


def interaction_to_dict(x: Interaction) -> Any:
    return to_class(Interaction, x)


def interaction_history_from_dict(s: Any) -> List[Interaction]:
    return from_list(Interaction.from_dict, s)


def interaction_history_to_dict(x: List[Interaction]) -> Any:
    return from_list(lambda x: to_class(Interaction, x), x)


def prediction_from_dict(s: Any) -> Prediction:
    return Prediction.from_dict(s)


def prediction_to_dict(x: Prediction) -> Any:
    return to_class(Prediction, x)


def prediction_set_from_dict(s: Any) -> PredictionSet:
    return PredictionSet.from_dict(s)


def prediction_set_to_dict(x: PredictionSet) -> Any:
    return to_class(PredictionSet, x)

