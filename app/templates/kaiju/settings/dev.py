"""Development settings
"""

from <%= projectName %>.settings.base import *

# This key should only be used on development
SECRET_KEY = '<%= secretKey %>'

# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'apps', 'core', 'assets', 'app'),
)

# Import machine specific dev settings
try:
    from <%= projectName %>.settings.local import *
except ImportError:
    pass
