import pandas as pd
from emotions.type import Emotion
import nltk
import numpy as np
import string
import gensim.downloader as g_api
import keras

# TODO: refactor all this part, cause it works weird as hell

WORD_CNT = 40

# really loooooooong even if it downloaded before
model = g_api.load("glove-twitter-25")
# print(model.most_similar("cat"))
# # print(model['cat'])
# print(model.has_index_for('кошка'), model.most_similar('кошка'))

def word_to_vector(word):
    if model.has_index_for(word) and word != '':
        return model[word]
    return np.zeros(25)

# looks like sometimes it causes errors, maybe need to use something another
# it causes race conditions, so first few requests will fail with 500

nltk.download('punkt_tab')
# is it really needed?
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('wordnet')

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

def prepocess(text: str):
    tokens = nltk.word_tokenize(text.lower())
    tokens = [t for t in tokens if t not in string.punctuation]

    stop_words = set(nltk.corpus.stopwords.words('english'))
    filtered_tokens = [t for t in tokens if t not in stop_words]

    pos_tokens = nltk.pos_tag(filtered_tokens)

    lemmatizer = nltk.stem.WordNetLemmatizer()
    lemms = [lemmatizer.lemmatize(t[0], pos=get_wordnet_pos(t[1])) for t in pos_tokens]

    for _ in range(WORD_CNT - len(lemms)):
        lemms.append('')
    return lemms


def get_data(path):
    df = pd.read_csv(path, sep=';', header=None, names=['Text', 'Emotion'])
    emotion_set = set(df['Emotion'].to_list())
    emotion_code = {i.name: i.value for i in Emotion}

    matrix = np.eye(len(emotion_set))

    df['Emotion'] = df['Emotion'].replace(emotion_code)

    text_arr = df['Text']
    # tokens_arr = map(prepocess, text_arr)
    tokens_arr = map(prepocess, text_arr)
    X = [[ word_to_vector(t) for t in sent] for sent in tokens_arr]
    X = np.array([np.array(x_i) for x_i in X])
    Y = matrix[df['Emotion']]
    return X, Y

# maybe it will fix race condition
# it works?
prepocess('fix')

def train():
    [X_train, Y_train] = get_data('./data/train.csv')
    [X_test, Y_test] = get_data('./data/test.csv')

    net = keras.Sequential()
    # net.add(keras.layers.Bidirectional(keras.layers.Embedding()))
    # False cause we use only one layer, if we use more, then False should be only in the last one
    # net.add(keras.layers.Bidirectional(keras.layers.LSTM(WORD_CNT * 2, return_sequences=True)))
    # net.add(keras.layers.Dropout(0.2))
    net.add(keras.layers.Bidirectional(keras.layers.LSTM(100, return_sequences=True)))
    net.add(keras.layers.Dropout(0.2))
    net.add(keras.layers.Bidirectional(keras.layers.LSTM(WORD_CNT, return_sequences=False)))
    # net.add(keras.layers.Dropout(0.2))
    # number of emotions
    net.add(keras.layers.Dense(6))
    net.compile(optimizer='Adam', loss='categorical_crossentropy', metrics=['accuracy'])

    net.fit(X_train,Y_train, epochs=30, batch_size=64)

    net.save('./a.keras')
    print()
    net.evaluate(X_test,Y_test, batch_size=1)

# train()

# df = pd.read_csv('./data/train.csv', sep=';', header=None, names=['Text', 'Emotion'])
# print(df.groupby(['Emotion']).count())

# test = pd.read_csv('./data/test.csv', sep=';', header=None, names=['Text', 'Emotion'])

# emotion_set = set(test['Emotion'].to_list())
# emotion_code = {i.name: i.value for i in Emotion}

# matrix = np.eye(len(emotion_set))

# test['Emotion'] = test['Emotion'].replace(emotion_code)

# text_arr = test['Text']
# # tokens_arr = map(prepocess, text_arr)
# tokens_arr = map(prepocess, text_arr)
# X = [[ word_to_vector(t) for t in sent] for sent in tokens_arr]
# Y = matrix[test['Emotion']]

# print(test.head())
# print(word_to_vector(prepocess(text_arr[0])))
# print(Y)
# print(list(map(word_to_vector, prepocess(text_arr[0]))))