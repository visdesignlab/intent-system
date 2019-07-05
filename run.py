import os

from intent_server import create_app


app = create_app()
port = int(os.environ.get('PORT', 5000))
app.run(
    host='0.0.0.0',
    port=port,
)
