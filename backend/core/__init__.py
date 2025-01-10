from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt

from config import Configuration

app = Flask(__name__)
app.config.from_object(Configuration)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

CORS(app, origins=["http://localhost:8081",])
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

test_pass = 'test'
pass_hash = bcrypt.generate_password_hash(test_pass).decode('utf8')
print(f'Test hash: {pass_hash}')

jwt = JWTManager(app)

from core import views, models