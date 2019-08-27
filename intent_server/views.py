from flask import Blueprint, jsonify, request, redirect

from .dataset import Dataset
from .dimensions import Dimensions
from .inference import Inference
from .vendor.interactions import prediction_request_from_dict

# Load and preprocess the dataset
datasets = {
    'slc_housing': Dataset.load_housing_data(),
    'draft_combine': Dataset.load_draft_combine_data(),
    'nba_players': Dataset.load_nba_data(),
}

views = Blueprint('views', __name__)


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
    dims = Dimensions(request.json)
    info = Inference(ds).info(dims)
    dct = {
        'measures': info.T.to_dict(),
        'dimensions': dims.to_string(),
    }
    return jsonify(dct)


@views.route('/dataset/<dataset_name>/predict', methods=['POST'])
def route_dataset_predict(dataset_name):  # type: ignore
    prediction_request = prediction_request_from_dict(request.json)
    interaction_hist = prediction_request.interaction_history
    ds = datasets[dataset_name]
    predictions = Inference(ds).predict(interaction_hist, prediction_request.multi_brush_behavior)
    return jsonify(predictions.to_dict())
