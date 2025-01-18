from flask import Blueprint

emotions = Blueprint('emotions', __file__, url_prefix='/emotion')

from . import views, types