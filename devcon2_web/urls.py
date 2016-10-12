import os

from django.conf.urls import url
from django.views.generic import TemplateView


def lets_encrypt(request):
    from django.http import HttpResponse
    return HttpResponse(os.environ.get('LETS_ENCRYPT_SECRET', ''))


urlpatterns = [
    url(
        r'^\.well-known/acme-challenge/{0}$'.format(
            os.environ.get('LETS_ENCRYPT_SECRET_PATH'),
        ),
        lets_encrypt,
    ),
    url(
        r'^',
        TemplateView.as_view(template_name='index.html'),
        name='site-index',
    ),
]
