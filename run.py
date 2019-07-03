from intent_server import create_app


(socket_io, app) = create_app()
socket_io.run(app)
