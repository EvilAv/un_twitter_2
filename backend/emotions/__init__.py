from flask import Blueprint
import os

emotions = Blueprint('emotions', __file__, url_prefix='/emotion')


if os.environ.get('EMOTION_RECOGNITION') == 'True':
    from . import type, views, sybil
    print('true prediction')
else:
    from . import type, views
    print('random prediction')