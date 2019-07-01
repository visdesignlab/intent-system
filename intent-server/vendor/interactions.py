# To use this code, make sure you
#
#     import json
#
# and then, to convert JSON from a string, do
#
#     result = visualization_type_from_dict(json.loads(json_string))
#     result = selection_from_dict(json.loads(json_string))
#     result = point_selection_from_dict(json.loads(json_string))
#     result = rectangular_selection_from_dict(json.loads(json_string))
#     result = change_axis_from_dict(json.loads(json_string))
#     result = interaction_from_dict(json.loads(json_string))
#     result = interaction_history_from_dict(json.loads(json_string))

from dataclasses import dataclass
from typing import List, Any, Optional, TypeVar, Callable, Type, cast
from enum import Enum


T = TypeVar("T")
EnumT = TypeVar("EnumT", bound=Enum)


def from_list(f: Callable[[Any], T], x: Any) -> List[T]:
    assert isinstance(x, list)
    return [f(y) for y in x]


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


def from_float(x: Any) -> float:
    assert isinstance(x, (float, int)) and not isinstance(x, bool)
    return float(x)


def to_float(x: Any) -> float:
    assert isinstance(x, float)
    return x


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


def to_enum(c: Type[EnumT], x: Any) -> EnumT:
    assert isinstance(x, c)
    return x.value


@dataclass
class Selection:
    dimensions: List[str]

    @staticmethod
    def from_dict(obj: Any) -> 'Selection':
        assert isinstance(obj, dict)
        dimensions = from_list(from_str, obj.get("dimensions"))
        return Selection(dimensions)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dimensions"] = from_list(from_str, self.dimensions)
        return result


@dataclass
class PointSelection:
    data_ids: List[str]
    dimensions: List[str]

    @staticmethod
    def from_dict(obj: Any) -> 'PointSelection':
        assert isinstance(obj, dict)
        data_ids = from_list(from_str, obj.get("dataIds"))
        dimensions = from_list(from_str, obj.get("dimensions"))
        return PointSelection(data_ids, dimensions)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_list(from_str, self.data_ids)
        result["dimensions"] = from_list(from_str, self.dimensions)
        return result


@dataclass
class RectangularSelection:
    data_ids: List[str]
    dimensions: List[str]
    height: float
    width: float
    x: float
    y: float

    @staticmethod
    def from_dict(obj: Any) -> 'RectangularSelection':
        assert isinstance(obj, dict)
        data_ids = from_list(from_str, obj.get("dataIds"))
        dimensions = from_list(from_str, obj.get("dimensions"))
        height = from_float(obj.get("height"))
        width = from_float(obj.get("width"))
        x = from_float(obj.get("x"))
        y = from_float(obj.get("y"))
        return RectangularSelection(data_ids, dimensions, height, width, x, y)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_list(from_str, self.data_ids)
        result["dimensions"] = from_list(from_str, self.dimensions)
        result["height"] = to_float(self.height)
        result["width"] = to_float(self.width)
        result["x"] = to_float(self.x)
        result["y"] = to_float(self.y)
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


@dataclass
class InteractionType:
    data_ids: Optional[List[str]]
    dimensions: List[str]
    height: Optional[float]
    width: Optional[float]
    x: Optional[float]
    y: Optional[float]

    @staticmethod
    def from_dict(obj: Any) -> 'InteractionType':
        assert isinstance(obj, dict)
        data_ids = from_union([lambda x: from_list(from_str, x), from_none], obj.get("dataIds"))
        dimensions = from_list(from_str, obj.get("dimensions"))
        height = from_union([from_float, from_none], obj.get("height"))
        width = from_union([from_float, from_none], obj.get("width"))
        x = from_union([from_float, from_none], obj.get("x"))
        y = from_union([from_float, from_none], obj.get("y"))
        return InteractionType(data_ids, dimensions, height, width, x, y)

    def to_dict(self) -> dict:
        result: dict = {}
        result["dataIds"] = from_union([lambda x: from_list(from_str, x), from_none], self.data_ids)
        result["dimensions"] = from_list(from_str, self.dimensions)
        result["height"] = from_union([to_float, from_none], self.height)
        result["width"] = from_union([to_float, from_none], self.width)
        result["x"] = from_union([to_float, from_none], self.x)
        result["y"] = from_union([to_float, from_none], self.y)
        return result


class VisualizationType(Enum):
    SCATTER_PLOT = "ScatterPlot"
    SCATTER_PLOT_MATRIX = "ScatterPlotMatrix"
    TABLE = "Table"


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


def rectangular_selection_from_dict(s: Any) -> RectangularSelection:
    return RectangularSelection.from_dict(s)


def rectangular_selection_to_dict(x: RectangularSelection) -> Any:
    return to_class(RectangularSelection, x)


def change_axis_from_dict(s: Any) -> ChangeAxis:
    return ChangeAxis.from_dict(s)


def change_axis_to_dict(x: ChangeAxis) -> Any:
    return to_class(ChangeAxis, x)


def interaction_from_dict(s: Any) -> Interaction:
    return Interaction.from_dict(s)


def interaction_to_dict(x: Interaction) -> Any:
    return to_class(Interaction, x)


def interaction_history_from_dict(s: Any) -> List[Interaction]:
    return from_list(Interaction.from_dict, s)


def interaction_history_to_dict(x: List[Interaction]) -> Any:
    return from_list(lambda x: to_class(Interaction, x), x)
