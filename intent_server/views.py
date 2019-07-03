from flask import Blueprint, jsonify

from .dataset import Dataset


# Load and preprocess the dataset
ds = Dataset.from_json_file('data/slc_housing.json')

views = Blueprint('views', __name__)


@views.route('/dataset')
def route_dataset():  # type: ignore
    print(jsonify(ds.to_dict()))
    return jsonify(ds.to_dict())
