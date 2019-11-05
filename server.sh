#! /bin/bash
source activate intent_server
if [ "$#" -eq "0" ];  then
    python3 run.py
else
    FLASK_APP=run.py FLASK_DEBUG=1 python3 -m flask run
fi
