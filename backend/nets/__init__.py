from flask import Blueprint

nets = Blueprint('nets', __file__, url_prefix='/nets')

from . import views