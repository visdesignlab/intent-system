from flask import Flask

from .views import views


def create_app() -> Flask:

    app = Flask(
      __name__,
      static_url_path='',
      static_folder='../app/build',
    )

    app.register_blueprint(views)

    return app
