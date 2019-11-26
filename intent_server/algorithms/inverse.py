import pandas as pd

from ..intent import IntentBinary
from typing import Optional, Dict, Any, List


class Inverse(IntentBinary):
    def __init__(self, intent: IntentBinary) -> None:
        self.intent = intent

    def info(self) -> Optional[Dict[str, Any]]:
        return self.intent.info()

    def to_string(self) -> str:
        return "Non-" + self.intent.to_string()

    def compute(self, df: pd.DataFrame) -> pd.DataFrame:
        result = self.intent.compute(df)
        result = result ^ 1
        return result
