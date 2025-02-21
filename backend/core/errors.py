from flask import make_response


def make_json_error(text, code):
    return make_response({
        'error-message': text,
    }, code)