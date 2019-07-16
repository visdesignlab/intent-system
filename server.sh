#! /bin/bash
cd app
yarn install
yarn run build
cd ..

source activate intent_server
python3 run.py
