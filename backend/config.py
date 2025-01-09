import os
from dotenv import load_dotenv

load_dotenv()
basedir = os.path.abspath(os.path.dirname(__file__))

class Configuration(object):
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
