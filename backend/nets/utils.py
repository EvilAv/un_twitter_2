import numpy as np

from nets import NEURAL_NET
from nets.preprocess import words_to_vector


def convert_to_input(text: str):
  return np.array([words_to_vector(text)])


def get_emotion(raw_text):
  t = NEURAL_NET.predict(convert_to_input(raw_text))
  idx = np.argmax(t)
  return idx
