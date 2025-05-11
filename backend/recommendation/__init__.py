from flask import Blueprint

recommendation = Blueprint('recommendation', __file__, url_prefix='/recommendation')

from . import models, views