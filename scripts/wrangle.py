import json
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

import sys

def project_data(data_frame, model):
    values = data_frame.select_dtypes(include=['number'])
    values /= values.max(axis=0) # normalize
    return model.fit_transform(values)

def append_similarity(data_frame, projection, model):
    column_prefix = type(model).__name__ + '-' + str(model.get_params()['n_components']) + 'd_';
    for idx, v in enumerate(projection.T):
        data_frame.insert(len(data_frame.columns), column_prefix + str(idx), projection[:,idx])
    return data_frame

def load_nba_data():
    df = pd.read_csv('data/all_seasons.csv')
    is_season = df['season'] == '2016-17'
    return [df[is_season].drop(columns=[
      'Unnamed: 0',
      'season',
      'college',
      'draft_year',
      'draft_round',
      'draft_number',
    ]), 'player_name']

def load_housing_data():
    df = pd.concat([
      pd.read_csv('data/housing/train1.csv', thousands=','),
      pd.read_csv('data/housing/train2.csv', thousands=','),
    ])
    selection = df[[
      'ListNo',
      'Acres',
      'BsmntFin',
      'Deck',
      'EWCoord',
      'GaragCap',
      'HouseNbr',
      'LstPrice',
      'NSCoord',
      'Taxes',
      'TotBed',
      'TotBth',
      'TotSqf',
      'YearBlt',
    ]]
    if selection.isna().values.any():
        print('Encountered NAN values. They have been replaced by \'0\'.')
        selection = selection.fillna(0)

    return [selection.astype({'ListNo': str}), 'ListNo']
    

def main():
    # [data, labelColumn] = load_nba_data()
    [data, labelColumn] = load_housing_data()

    if(true):
        model = TSNE(
        	n_components=2,
            n_iter=10000,
            early_exaggeration=24,
        	init='pca',
        )

        projection = project_data(data, model);
        data = append_similarity(data, projection, model)

    data.reset_index(drop=True, inplace=True)

    if len(sys.argv) == 2:
        output = { 'labelColumn': labelColumn }
       output['values'] = data.T.to_dict()
        j = json.dumps(output);
        open(sys.argv[1],"w").write(j)
    else:
        plt.scatter(projection[:,0], projection[:,1])
        plt.show()

main()
