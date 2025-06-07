from flask import Blueprint
import nltk
import json

import os
os.environ["TF_USE_LEGACY_KERAS"] = "1"

import tensorflow as tf
from tensorflow import keras

from colorama import init as colorama_init

colorama_init()  # включаем цвета для Windows


nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('wordnet')

WORD_INDEX = {}
NEURAL_NET = keras.models.load_model(f'{__file__}/../models/final/model.h5')

with open(f'{__file__}/../dict.json', 'r') as file:
    WORD_INDEX = json.load(file)

nets = Blueprint('nets', __file__, url_prefix='/nets')

from . import views