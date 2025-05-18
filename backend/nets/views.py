from core import compress
from flask import send_file
from nets import nets
import os

@nets.route('/json-model/<model_type>')
@compress.compressed()
def get_model(model_type):
    return send_file(f'{__file__}/../models/{model_type}/model.json')

@nets.route('/binary-model/<model_type>/<name>')
def get_binary(model_type, name):
    return send_file(f'{__file__}/../models/{model_type}/{name}', as_attachment=True)