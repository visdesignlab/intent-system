from flask import Blueprint, jsonify, render_template, request

import pandas as pd

from .dataset import Dataset
from .properties import Outlier, Properties


# Load and preprocess the dataset
datasets = {
    'slc_housing': Dataset.load_housing_data(),
    'draft_combine': Dataset.load_draft_combine_data(),
    'nba_players': Dataset.load_nba_data(),
}

views = Blueprint('views', __name__)


@views.route('/')
def index():  # type: ignore
    return render_template('index.html')


@views.route('/dataset', methods=['GET'])
def route_dataset_list():  # type: ignore
    return jsonify(list(datasets.keys()))


@views.route('/dataset/<dataset_name>', methods=['GET'])
def route_dataset(dataset_name):  # type: ignore
    return jsonify(datasets[dataset_name].to_dict())


@views.route('/dataset/<dataset_name>/info', methods=['POST'])
def route_dataset_info(dataset_name):  # type: ignore
    ds = datasets[dataset_name]
    props = Properties(ds, [Outlier(1, 0.1), Outlier(2, 0.1)])
    df = pd.concat([
        props.labels(),
        props.for_dims(request.json),
    ], axis='columns')
    return jsonify(df.T.to_dict())


@views.route('/dataset/<dataset_name>/predict', methods=['POST'])
def route_dataset_predict(dataset_name):  # type: ignore
    return jsonify(request.json)
