"""
WSGI config for <%= projectName %> project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "<%= projectName %>.settings.prod")

from django.core.wsgi import get_wsgi_application
<% if (_.contains(features, 'heroku')) { %>
from dj_static import Cling
application = Cling(get_wsgi_application())
<% } else { %>
application = get_wsgi_application()
<% } %>
