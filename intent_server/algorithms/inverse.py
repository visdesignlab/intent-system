import pandas as pd

from ..intent import Intent
from typing import Optional, Dict, Any


# TODO: Only works for binary intents!
class Inverse(Intent):
    def __init__(self, intent: Intent, prefix: str = "Non-") -> None:
        super().__init__()
        self.intent = intent
        self.prefix = prefix

    def info(self) -> Optional[Dict[str, Any]]:
        return self.intent.info()

    def to_string(self) -> str:
        return self.prefix + self.intent.to_string()

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        result = self.intent.compute(df)
        result = result ^ 1  # XOR
        result.rename(columns={self.intent.to_string(): self.to_string()}, inplace=True)
        return result
