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
#     result = prediction_request_from_dict(json.loads(json_string))
#     result = interaction_type_from_dict(json.loads(json_string))
#     result = interaction_from_dict(json.loads(json_string))
#     result = interaction_history_from_dict(json.loads(json_string))
#     result = prediction_from_dict(json.loads(json_string))
#     result = prediction_set_from_dict(json.loads(json_string))

from typing import List, Any, Optional, Dict, TypeVar, Callable, Type, cast
from enum import Enum


T = TypeVar("T")
EnumT = TypeVar("EnumT", bound=Enum)


def from_list(f: Callable[[Any], T], x: Any) -> List[T]:
    assert isinstance(x, list)
    return [f(y) for y in x]


def from_float(x: Any) -> float:
    assert isinstance(x, (float, int)) and not isinstance(x, bool)
    return float(x)


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


def to_float(x: Any) -> float:
    assert isinstance(x, float)
    return x


def to_enum(c: Type[EnumT], x: Any) -> EnumT:
    assert isinstance(x, c)
    return x.value


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


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


def from_dict(f: Callable[[Any], T], x: Any) -> Dict[str, T]:
    assert isinstance(x, dict)
    return { k: f(v) for (k, v) in x.items() }


class Selection:
    data_ids: List[float]
    dimensions: List[str]

    def __init__(self, data_ids: List[float], dimensions: List[str]) -> None:
        self.data_ids = data_ids
        self.dimensions = dimensions

    @staticmethod
    def from_dict(obj: Any) -> 'Selection':
        assert isinstance(obj, dict)
        data_ids = from_list(from_float, obj.get("dataIds"))
        dimensions = from_list(from_str, obj.get("dimensions"))
        return Selection(data_ids, dimensions)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_list(to_float, self.data_ids)
        result["dimensions"] = from_list(from_str, self.dimensions)
        return result


class PointSelectionKind(Enum):
    SELECTION = "selection"


class PointSelection:
    data_ids: List[float]
    dimensions: List[str]
    kind: PointSelectionKind

    def __init__(self, data_ids: List[float], dimensions: List[str], kind: PointSelectionKind) -> None:
        self.data_ids = data_ids
        self.dimensions = dimensions
        self.kind = kind

    @staticmethod
    def from_dict(obj: Any) -> 'PointSelection':
        assert isinstance(obj, dict)
        data_ids = from_list(from_float, obj.get("dataIds"))
        dimensions = from_list(from_str, obj.get("dimensions"))
        kind = PointSelectionKind(obj.get("kind"))
        return PointSelection(data_ids, dimensions, kind)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_list(to_float, self.data_ids)
        result["dimensions"] = from_list(from_str, self.dimensions)
        result["kind"] = to_enum(PointSelectionKind, self.kind)
        return result


class PointDeselectionKind(Enum):
    DESELECTION = "deselection"


class PointDeselection:
    data_ids: List[float]
    dimensions: List[str]
    kind: PointDeselectionKind

    def __init__(self, data_ids: List[float], dimensions: List[str], kind: PointDeselectionKind) -> None:
        self.data_ids = data_ids
        self.dimensions = dimensions
        self.kind = kind

    @staticmethod
    def from_dict(obj: Any) -> 'PointDeselection':
        assert isinstance(obj, dict)
        data_ids = from_list(from_float, obj.get("dataIds"))
        dimensions = from_list(from_str, obj.get("dimensions"))
        kind = PointDeselectionKind(obj.get("kind"))
        return PointDeselection(data_ids, dimensions, kind)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_list(to_float, self.data_ids)
        result["dimensions"] = from_list(from_str, self.dimensions)
        result["kind"] = to_enum(PointDeselectionKind, self.kind)
        return result


class RectangularSelection:
    bottom: float
    brush_id: str
    data_ids: List[float]
    dimensions: List[str]
    left: float
    right: float
    top: float

    def __init__(self, bottom: float, brush_id: str, data_ids: List[float], dimensions: List[str], left: float, right: float, top: float) -> None:
        self.bottom = bottom
        self.brush_id = brush_id
        self.data_ids = data_ids
        self.dimensions = dimensions
        self.left = left
        self.right = right
        self.top = top

    @staticmethod
    def from_dict(obj: Any) -> 'RectangularSelection':
        assert isinstance(obj, dict)
        bottom = from_float(obj.get("bottom"))
        brush_id = from_str(obj.get("brushId"))
        data_ids = from_list(from_float, obj.get("dataIds"))
        dimensions = from_list(from_str, obj.get("dimensions"))
        left = from_float(obj.get("left"))
        right = from_float(obj.get("right"))
        top = from_float(obj.get("top"))
        return RectangularSelection(bottom, brush_id, data_ids, dimensions, left, right, top)

    def to_dict(self) -> dict:
        result: dict = {}
        result["bottom"] = to_float(self.bottom)
        result["brushId"] = from_str(self.brush_id)
        result["dataIds"] = from_list(to_float, self.data_ids)
        result["dimensions"] = from_list(from_str, self.dimensions)
        result["left"] = to_float(self.left)
        result["right"] = to_float(self.right)
        result["top"] = to_float(self.top)
        return result


class ChangeAxis:
    dimensions: List[str]

    def __init__(self, dimensions: List[str]) -> None:
        self.dimensions = dimensions

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


class ClearAllSelections:
    data_ids: List[float]
    dimensions: List[str]
    kind: ClearAllSelectionsKind

    def __init__(self, data_ids: List[float], dimensions: List[str], kind: ClearAllSelectionsKind) -> None:
        self.data_ids = data_ids
        self.dimensions = dimensions
        self.kind = kind

    @staticmethod
    def from_dict(obj: Any) -> 'ClearAllSelections':
        assert isinstance(obj, dict)
        data_ids = from_list(from_float, obj.get("dataIds"))
        dimensions = from_list(from_str, obj.get("dimensions"))
        kind = ClearAllSelectionsKind(obj.get("kind"))
        return ClearAllSelections(data_ids, dimensions, kind)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_list(to_float, self.data_ids)
        result["dimensions"] = from_list(from_str, self.dimensions)
        result["kind"] = to_enum(ClearAllSelectionsKind, self.kind)
        return result


class InteractionTypeKind(Enum):
    CLEARALL = "clearall"
    DESELECTION = "deselection"
    SELECTION = "selection"


class InteractionType:
    data_ids: Optional[List[float]]
    dimensions: List[str]
    kind: Optional[InteractionTypeKind]
    bottom: Optional[float]
    brush_id: Optional[str]
    left: Optional[float]
    right: Optional[float]
    top: Optional[float]

    def __init__(self, data_ids: Optional[List[float]], dimensions: List[str], kind: Optional[InteractionTypeKind], bottom: Optional[float], brush_id: Optional[str], left: Optional[float], right: Optional[float], top: Optional[float]) -> None:
        self.data_ids = data_ids
        self.dimensions = dimensions
        self.kind = kind
        self.bottom = bottom
        self.brush_id = brush_id
        self.left = left
        self.right = right
        self.top = top

    @staticmethod
    def from_dict(obj: Any) -> 'InteractionType':
        assert isinstance(obj, dict)
        data_ids = from_union([lambda x: from_list(from_float, x), from_none], obj.get("dataIds"))
        dimensions = from_list(from_str, obj.get("dimensions"))
        kind = from_union([InteractionTypeKind, from_none], obj.get("kind"))
        bottom = from_union([from_float, from_none], obj.get("bottom"))
        brush_id = from_union([from_str, from_none], obj.get("brushId"))
        left = from_union([from_float, from_none], obj.get("left"))
        right = from_union([from_float, from_none], obj.get("right"))
        top = from_union([from_float, from_none], obj.get("top"))
        return InteractionType(data_ids, dimensions, kind, bottom, brush_id, left, right, top)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_union([lambda x: from_list(to_float, x), from_none], self.data_ids)
        result["dimensions"] = from_list(from_str, self.dimensions)
        result["kind"] = from_union([lambda x: to_enum(InteractionTypeKind, x), from_none], self.kind)
        result["bottom"] = from_union([to_float, from_none], self.bottom)
        result["brushId"] = from_union([from_str, from_none], self.brush_id)
        result["left"] = from_union([to_float, from_none], self.left)
        result["right"] = from_union([to_float, from_none], self.right)
        result["top"] = from_union([to_float, from_none], self.top)
        return result


class VisualizationType(Enum):
    NONE = "None"
    PARALLEL_COORDINATE_PLOT = "ParallelCoordinatePlot"
    SCATTERPLOT = "Scatterplot"
    SCATTERPLOT_MATRIX = "ScatterplotMatrix"


class Interaction:
    interaction_type: InteractionType
    visualization_type: VisualizationType

    def __init__(self, interaction_type: InteractionType, visualization_type: VisualizationType) -> None:
        self.interaction_type = interaction_type
        self.visualization_type = visualization_type

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


class PredictionRequest:
    interaction_history: List[Interaction]
    multi_brush_behavior: MultiBrushBehavior

    def __init__(self, interaction_history: List[Interaction], multi_brush_behavior: MultiBrushBehavior) -> None:
        self.interaction_history = interaction_history
        self.multi_brush_behavior = multi_brush_behavior

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


class Prediction:
    data_ids: Optional[List[float]]
    info: Optional[Dict[str, Any]]
    intent: str
    rank: float
    suggestion: Optional[List['Prediction']]

    def __init__(self, data_ids: Optional[List[float]], info: Optional[Dict[str, Any]], intent: str, rank: float, suggestion: Optional[List['Prediction']]) -> None:
        self.data_ids = data_ids
        self.info = info
        self.intent = intent
        self.rank = rank
        self.suggestion = suggestion

    @staticmethod
    def from_dict(obj: Any) -> 'Prediction':
        assert isinstance(obj, dict)
        data_ids = from_union([lambda x: from_list(from_float, x), from_none], obj.get("dataIds"))
        info = from_union([lambda x: from_dict(lambda x: x, x), from_none], obj.get("info"))
        intent = from_str(obj.get("intent"))
        rank = from_float(obj.get("rank"))
        suggestion = from_union([lambda x: from_list(Prediction.from_dict, x), from_none], obj.get("suggestion"))
        return Prediction(data_ids, info, intent, rank, suggestion)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_union([lambda x: from_list(to_float, x), from_none], self.data_ids)
        result["info"] = from_union([lambda x: from_dict(lambda x: x, x), from_none], self.info)
        result["intent"] = from_str(self.intent)
        result["rank"] = to_float(self.rank)
        result["suggestion"] = from_union([lambda x: from_list(lambda x: to_class(Prediction, x), x), from_none], self.suggestion)
        return result


class PredictionSet:
    dimensions: List[str]
    predictions: List[Prediction]
    selected_ids: List[float]

    def __init__(self, dimensions: List[str], predictions: List[Prediction], selected_ids: List[float]) -> None:
        self.dimensions = dimensions
        self.predictions = predictions
        self.selected_ids = selected_ids

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


def prediction_request_from_dict(s: Any) -> PredictionRequest:
    return PredictionRequest.from_dict(s)


def prediction_request_to_dict(x: PredictionRequest) -> Any:
    return to_class(PredictionRequest, x)


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
