""" Production settings

See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/
"""

import os
<% if(_.contains(features, 'heroku')){ %>
import dj_database_url
<% } %>

from <%= projectName %>.settings.base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# TODO: Set your ALLOWED_HOSTS
<% if(_.contains(features, 'heroku')){ %>
ALLOWED_HOSTS = ['.herokuapp.com']

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
<% } else { %>
ALLOWED_HOSTS = []
<% } %>

<% if(_.contains(features, 'heroku')){ %>
# Parse database configuration from $DATABASE_URL
DATABASES = {
    'default': dj_database_url.config()
}
<% } else { %>
# TODO: Configure production database
DATABASES = {}
<% } %>

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'apps', 'core', 'assets', 'dist'),
)
