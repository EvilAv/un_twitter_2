from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Configuration

app = Flask(__name__)
app.config.from_object(Configuration)
CORS(app, origins=["http://localhost:8081",])

jwt = JWTManager(app)

from core import views