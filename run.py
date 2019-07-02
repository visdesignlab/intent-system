from intent_server import create_app
from intent_server.dataset import Dataset

(socket_io, app) = create_app()
socket_io.run(app)
