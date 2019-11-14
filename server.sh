#! /bin/bash
if [ "$#" -eq "0" ];  then
    pipenv run python3 run.py
else
    FLASK_APP=run.py FLASK_DEBUG=1 pipenv run python3 -m flask run
fi
