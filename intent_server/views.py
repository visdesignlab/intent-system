from flask import Blueprint, jsonify, request, redirect
import sys
from .dataset import Dataset
from .dimensions import Dimensions
from .inference import Inference
from .vendor.interactions import prediction_request_from_dict

import time

# Load and preprocess the dataset
# datasets = {
#     'slc_housing': Dataset.load_housing_data(),
#     'draft_combine': Dataset.load_draft_combine_data(),
#     'nba_players': Dataset.load_nba_data(),
#     'gapminder_world': Dataset.load_gapminderworld_data(),
#     'cluster': Dataset.load_cluster_data()
# }

datasets = {
    'slc_housing': Dataset.load_housing_data(),
    'gapminder_world': Dataset.load_gapminderworld_data(),
    'cluster': Dataset.load_cluster_data(),
    'depression_dataset': Dataset.load_depression_data(),
    'MDAMB231MacrophageCocultureControl': Dataset.load_coculture_control(),
    'MDAMB231MacrophageCocultureMito': Dataset.load_coculture_mito(),
    'MDAMB231MacrophageMacroControl': Dataset.load_macro_control(),
    'MDAMB231MacrophageMacroMito': Dataset.load_macro_mito(),
    'nba_raptor': Dataset.load_nba_raptor_data(),
    'sp500': Dataset.load_sp500_data(),


    'sky_easy_training_1': Dataset.load_sky_easy_training_1(),
    'sky_easy_task_1': Dataset.load_sky_easy_task_1(),
    'sky_easy_task_2': Dataset.load_sky_easy_task_2(),
    'sky_med_training_1': Dataset.load_sky_med_training_1(),
    'sky_med_task_2': Dataset.load_sky_med_task_1(),
    'sky_med_task_2': Dataset.load_sky_med_task_2(),
    'sky_hard_training_1': Dataset.load_sky_hard_training_1(),
    'sky_hard_task_1': Dataset.load_sky_hard_task_1(),
    'sky_hard_task_2': Dataset.load_sky_hard_task_2(),

    'quad_easy_training_1': Dataset.load_cluster_easy_training_1(),
    'quad_easy_task_1': Dataset.load_quad_easy_task_1(),
    'quad_easy_task_2': Dataset.load_quad_easy_task_2(),
    'quad_med_training_1': Dataset.load_quad_med_training_1(),
    'quad_med_task_2': Dataset.load_quad_med_task_1(),
    'quad_med_task_2': Dataset.load_quad_med_task_2(),
    'quad_hard_training_1': Dataset.load_quad_hard_training_1(),
    'quad_hard_task_1': Dataset.load_quad_hard_task_1(),
    'quad_hard_task_2': Dataset.load_quad_hard_task_2(),


    'out_easy_task_1': Dataset.load_out_easy_task_1(),
    'out_easy_task_2': Dataset.load_out_easy_task_2(),
    'out_easy_task_3': Dataset.load_out_easy_task_3(),
    'out_easy_task_4': Dataset.load_out_easy_task_4(),
    'out_easy_task_5': Dataset.load_out_easy_task_5(),
    'out_med_task_1': Dataset.load_out_med_task_1(),
    'out_med_task_2': Dataset.load_out_med_task_2(),
    'out_med_task_3': Dataset.load_out_med_task_3(),
    'out_med_task_4': Dataset.load_out_med_task_4(),
    'out_med_task_5': Dataset.load_out_med_task_5(),
    'out_hard_task_1': Dataset.load_out_hard_task_1(),
    'out_hard_task_2': Dataset.load_out_hard_task_2(),
    'out_hard_task_3': Dataset.load_out_hard_task_3(),
    'out_hard_task_4': Dataset.load_out_hard_task_4(),
    'out_hard_task_5': Dataset.load_out_hard_task_5(),
    'out_hard_training_1': Dataset.load_out_easy_task_1(),
    'out_med_training_1': Dataset.load_out_easy_task_1(),
    'out_easy_training_1': Dataset.load_out_easy_task_1(),


    'cluster_easy_training_1': Dataset.load_cluster_easy_training_1(),
    'cluster_easy_task_1': Dataset.load_cluster_easy_task_1(),
    'cluster_easy_task_2': Dataset.load_cluster_easy_task_2(),
    'cluster_med_training_1': Dataset.load_cluster_med_training_1(),
    'cluster_med_task_2': Dataset.load_cluster_med_task_1(),
    'cluster_med_task_2': Dataset.load_cluster_med_task_2(),
    'cluster_hard_training_1': Dataset.load_cluster_hard_training_1(),
    'cluster_hard_task_1': Dataset.load_cluster_hard_task_1(),
    'cluster_hard_task_2': Dataset.load_cluster_hard_task_2(),


    'cat_easy_training_1': Dataset.load_cat_easy_training_1(),
    'cat_easy_task_1': Dataset.load_cat_easy_task_1(),
    'cat_easy_task_2': Dataset.load_cat_easy_task_2(),
    'cat_med_training_1': Dataset.load_cat_med_training_1(),
    'cat_med_task_1': Dataset.load_cat_med_task_1(),
    'cat_med_task_2': Dataset.load_cat_med_task_2(),
    'cat_med_task_3': Dataset.load_cat_med_task_3(),
    'cat_med_task_4': Dataset.load_cat_med_task_4(),
    'cat_hard_training_1': Dataset.load_cat_hard_training_1(),
    'cat_hard_task_1': Dataset.load_cat_hard_task_1(),
    'cat_hard_task_2': Dataset.load_cat_hard_task_2(),
    'cat_hard_task_3': Dataset.load_cat_hard_task_3(),
    'cat_hard_task_4': Dataset.load_cat_hard_task_4(),
    'lin_easy_training_1': Dataset.load_lin_easy_training_1(),
    'lin_easy_task_1': Dataset.load_lin_easy_task_1(),
    'lin_easy_task_2': Dataset.load_lin_easy_task_2(),
    'lin_med_training_1': Dataset.load_lin_med_training_1(),
    'lin_med_task_1': Dataset.load_lin_med_task_1(),
    'lin_med_task_2': Dataset.load_lin_med_task_2(),
    'lin_hard_training_1': Dataset.load_lin_hard_training_1(),
    'lin_hard_task_1': Dataset.load_lin_hard_task_1(),
    'lin_hard_task_2': Dataset.load_lin_hard_task_2()


}

views = Blueprint('views', __name__)


@views.route('/')
def index():  # type: ignore
    return redirect('index.html')


@views.route('/dataset', methods=['GET'])
def route_dataset_list():  # type: ignore
    finalDatasets = []
    for key in list(datasets.keys()):
        finalDatasets.append({
            'key': key,
            'name': datasets[key].name
        })
    return jsonify(finalDatasets)


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

    start = time.time()
    predictions = Inference(ds).predict(interaction_hist,
                                        prediction_request.multi_brush_behavior)
    end = time.time()

    dct = predictions.to_dict()
    dct['time'] = end - start



    return jsonify(dct)
