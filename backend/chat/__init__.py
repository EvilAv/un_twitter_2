from flask import Blueprint

chat = Blueprint('chat', __file__, url_prefix='/chat')

from . import models, views