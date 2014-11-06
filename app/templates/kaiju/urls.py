from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic.base import TemplateView

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', '<%= projectName %>.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', TemplateView.as_view(template_name='core/index.html')),

    url(r'^admin/', include(admin.site.urls)),
)
