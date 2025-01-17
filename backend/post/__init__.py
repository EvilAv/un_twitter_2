from flask import Blueprint

post = Blueprint('post', __file__, url_prefix='/post')

from . import models, views, serializers