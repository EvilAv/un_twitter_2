from core import compress
from flask import jsonify, send_file
from nets import WORD_INDEX, nets

@nets.route('/json-model/<model_type>')
@compress.compressed()
def get_model(model_type):
    return send_file(f'{__file__}/../models/{model_type}/model.json')

@nets.route('/get-dict')
@compress.compressed()
def get_dict():
    return jsonify(WORD_INDEX)

@nets.route('/binary-model/<model_type>/<name>')
def get_binary(model_type, name):
    return send_file(f'{__file__}/../models/{model_type}/{name}', as_attachment=True)