import nltk
import numpy as np
from nets import WORD_INDEX

WORD_CNT = 40

EMPTY_TOKEN = '<pad>'

stopwords = {
  'and','but','for',
  'or','nor','so',
  'yet','after','before',
  'since','than','that',
  'though','unless','until',
  'when','where','while',
  'both','either','neither',
  'the', 'a'
}

def get_wordnet_pos(treebank_tag):

    if treebank_tag.startswith('J'):
        return 'a'
    elif treebank_tag.startswith('V'):
        return 'v'
    elif treebank_tag.startswith('N'):
        return 'n'
    elif treebank_tag.startswith('R'):
        return 'r'
    else:
        return 'n'

def text_preprocess(text: str):
    tokens = nltk.word_tokenize(text.lower())
    filtered_tokens = [t for t in tokens if t not in stopwords and len(t) > 1]

    pos_tokens = nltk.pos_tag(filtered_tokens)

    lemmatizer = nltk.stem.WordNetLemmatizer()
    lemms = [lemmatizer.lemmatize(t[0], pos=get_wordnet_pos(t[1])) for t in pos_tokens]
    return lemms

def prepare_text_for_embeding(text: str):
    tokens = text_preprocess(text)
    padded = tokens + [EMPTY_TOKEN] * (WORD_CNT - len(tokens))
    return padded

def words_to_vector(sentence: str):
  tokens = prepare_text_for_embeding(sentence)
#   print(tokens)
  return np.array([WORD_INDEX.get(w, 0) for w in tokens])