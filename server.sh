#! /bin/bash
source activate intent_server
FLASK_APP=run.py python3 -m flask run
