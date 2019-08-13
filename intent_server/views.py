from flask import Blueprint, jsonify, request, redirect

import pandas as pd

from .dataset import Dataset
from .properties import Dimensions, Properties
from .predict import predict
from .intent import Intent
from .algorithms.outlier import Outlier
from .algorithms.skyline import Skyline
from .algorithms.range import Range
from .algorithms.categories import CategoriesBuilder
from .vendor.interactions import interaction_history_from_dict

from typing import List

# Load and preprocess the dataset
datasets = {
    'slc_housing': Dataset.load_housing_data(),
    'draft_combine': Dataset.load_draft_combine_data(),
    'nba_players': Dataset.load_nba_data(),
}

views = Blueprint('views', __name__)

measures: List[Intent] = [
    Outlier(),
    Skyline(),
    Range(),
]


def all_measures(data: Dataset) -> List[Intent]:
    categories = CategoriesBuilder.build(data.categorical())
    all = measures + categories  # type: ignore
    return all


@views.route('/')
def index():  # type: ignore
    return redirect('index.html')


@views.route('/dataset', methods=['GET'])
def route_dataset_list():  # type: ignore
    return jsonify(list(datasets.keys()))


@views.route('/dataset/<dataset_name>', methods=['GET'])
def route_dataset(dataset_name):  # type: ignore
    return jsonify(datasets[dataset_name].to_dict())


@views.route('/dataset/<dataset_name>/info', methods=['POST'])
def route_dataset_info(dataset_name):  # type: ignore
    ds = datasets[dataset_name]
    props = Properties(ds, all_measures(ds))
    dims = Dimensions(request.json)
    df = pd.concat([
        props.labels(),
        props.for_dims(dims),
    ], axis='columns')
    dct = {
        'measures': df.T.to_dict(),
        'dimensions': dims.to_string(),
    }
    return jsonify(dct)


@views.route('/dataset/<dataset_name>/predict', methods=['POST'])
def route_dataset_predict(dataset_name):  # type: ignore
    interaction_hist = interaction_history_from_dict(request.json)
    ds = datasets[dataset_name]
    props = Properties(ds, all_measures(ds))
    predictions = list(map(lambda x: x.__dict__, predict(ds, props, interaction_hist)))
    return jsonify(predictions)
