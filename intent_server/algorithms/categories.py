import pandas as pd

from ..intent import IntentMulticlassInstance

from typing import List


def build_instances(df: pd.DataFrame, column: str) -> List[IntentMulticlassInstance]:
    values = df[column].unique()
    return list(
        map(
            lambda v: IntentMulticlassInstance(df[column] == v, 'Category:' + column + ':' + v),
            values))


class CategoriesBuilder():
    def build(df: pd.DataFrame) -> List[IntentMulticlassInstance]:
        cats = df.columns
        instances = map(lambda c: build_instances(df, c), cats)
        return [i for column_instances in instances for i in column_instances]
