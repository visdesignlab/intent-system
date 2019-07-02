from flask import Flask
from flask_socketio import SocketIO
from typing import Tuple

from .views import views


def create_app() -> Tuple[SocketIO, Flask]:
    app = Flask(__name__)
    socket_io = SocketIO(app)

    app.register_blueprint(views)

    return (socket_io, app)
