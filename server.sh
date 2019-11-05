#! /bin/bash
source activate intent_server
if [ "$#" -eq "0" ];  then
    FLASK_APP=run.py python3 -m flask run
else
    FLASK_APP=run.py FLASK_DEBUG=1 python3 -m flask run
fi
