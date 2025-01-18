from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from sqlalchemy import MetaData

from config import Configuration

convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

app = Flask(__name__)
app.config.from_object(Configuration)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

CORS(app, origins=["http://localhost:8081",])
bcrypt = Bcrypt(app)
db = SQLAlchemy(app, metadata=metadata)
migrate = Migrate(app, db, render_as_batch=True)

test_pass = 'test'
pass_hash = bcrypt.generate_password_hash(test_pass).decode('utf8')
print(f'Test hash: {pass_hash}')

jwt = JWTManager(app)

from post import post as post_blueprint

app.register_blueprint(post_blueprint)

from emotions import emotions as emo_blueprint
app.register_blueprint(emo_blueprint)

from core import views, models