[![Build Status](https://travis-ci.com/visdesignlab/intent-system.svg?branch=master)](https://travis-ci.com/visdesignlab/intent-system)

# intent-system

The server is deployed to: https://intent-system.herokuapp.com/

## Development

The bindings between the frontend and the backend can be automatically created using:

    yarn run bindgen
    
This step should be performed after every change to `intent_contract/contract.ts`.

To start the frontend along with the prediction server, we provide a thin starter script that uses `yarn`:

    yarn install
    yarn run start
    
The server can also be started without the frontend to allow debugging, for example with _Postman_:

    python3 -m run.py
