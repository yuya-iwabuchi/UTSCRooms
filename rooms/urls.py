from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^(?P<day>[0-9]*)$', views.index),
    url(r'^(?P<day>[0-9]*)/(?P<time>[0-9]*)$', views.index),
    url(r'test/', views.test),
]
