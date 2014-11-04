""" Production settings

See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/
"""

import os

import dj_database_url

from kaiju.settings.base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['.herokuapp.com']

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Parse database configuration from $DATABASE_URL
DATABASES = {
    'default': dj_database_url.config()
}

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'apps', 'core', 'assets', 'dist'),
)
