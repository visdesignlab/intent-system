from typing import List


class Dimensions:
    def __init__(self, dims: List[str]) -> None:
        self.dims = dims

    def __hash__(self) -> int:
        return hash("".join(self.dims))

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Dimensions):
            return NotImplemented
        return self.dims == other.dims

    def to_string(self) -> str:
        return ':'.join(self.dims)

    def indices(self) -> List[str]:
        return self.dims

    def dim_count(self) -> int:
        return len(self.dims)
