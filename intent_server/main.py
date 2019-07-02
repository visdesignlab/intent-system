import sys

from typing import List

# from sklearn.neighbors import LocalOutlierFactor

# import pandas as pd
from vendor.interactions import Interaction
from dataset import Dataset
from properties import Properties

from flask import Flask, jsonify, request
from flask_socketio import SocketIO

# Load and preprocess the dataset
ds = Dataset.from_json_file(sys.argv[1])

# Setting up flask and SocketIO
app = Flask(__name__)
socketio = SocketIO(app)

reqs: List[Interaction] = []


@app.route('/dataset')
def route_dataset():  # type: ignore
    print(jsonify(ds.to_dict()))
    return jsonify(ds.to_dict())


@app.route('/api/predict', methods=['GET'])
def hello():  # type: ignore
    data = request.get_json()
    reqs.append(data)
    print(reqs)
    return jsonify(data)


def main() -> None:

    # numeric_data = data.drop(columns=['ListNo'])
    # clf = LocalOutlierFactor(n_neighbors=20, contamination=0.1)
    # pred = clf.fit_predict(numeric_data)
    # # add outlier information
    # data.insert(len(data.columns), 'Outlier', pred)
    # print(data.loc[data['ListNo'] == '1352624'])
    # dataset = Dataset.from_json_file(sys.argv[1])
    ps = Properties(ds)

    socketio.run(app)


main()
