from flask import Blueprint
import nltk

emotions = Blueprint('emotions', __file__, url_prefix='/emotion')

from . import type, views, sybil