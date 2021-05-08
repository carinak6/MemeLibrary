import os
from dotenv import load_dotenv

load_dotenv()

ACCOUNT_NAME = os.environ.get('ACCOUNT_NAME')
ACCOUNT_KEY = os.environ.get('ACCOUNT_KEY')
CONNECTION_STRING = os.environ.get('CONNECTION_STRING')
CONTAINER = os.environ.get('CONTAINER')
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
MAX_CONTENT_LENGTH = 20 * 1024 * 1024    # 20 Mb limit
