from .properties import Measure, Properties
from .dataset import Dataset
from .dimensions import Dimensions
from .vendor.interactions import Interaction, Prediction

import numpy as np
import pandas as pd

from scipy.spatial.distance import jaccard
from typing import List


def selection_array(df: pd.DataFrame, ids: List[int]) -> np.ndarray:
    arr = np.zeros((len(df), 1))
    for i in ids:
      arr.itemset((i, 0), 1)
    return arr

def rank(selection: np.ndarray, measure: Measure, df: pd.DataFrame) -> float:
    measure_arr = measure.evaluate(df)
    np.savetxt('sel.txt', np.append(selection, measure_arr, 1), delimiter=',')
    return 1 - jaccard(selection, measure_arr)

def predict(dataset: Dataset, properties: Properties, interactions: List[Interaction]) -> List[Prediction]:

    # TODO: respect deselections
    # TODO: Use sets
    filtered = list(filter(lambda x: x.interaction_type.data_ids, interactions))
    list_of_ids = map(lambda x: x.interaction_type.data_ids, filtered)

    # Python's weird way of flattening
    ids = [int(y) for x in list_of_ids for y in x]

    sel_array = selection_array(dataset.data, ids)

    # TODO extract dimensions
    list_of_dims = map(lambda x: x.interaction_type.dimensions, filtered)
    dims = Dimensions(list(set([y for x in list_of_dims for y in x])))

    relevant_data = dataset.subset(dims)

    # Perform ranking
    ranks = map(lambda m: Prediction(
      m.to_string(),
      rank(sel_array, m, relevant_data),
      ), properties.measures)

    return list(ranks)
