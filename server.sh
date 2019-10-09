#! /bin/bash
source activate intent_server
FLASK_APP=run.py FLASK_DEBUG=1 python3 -m flask run
