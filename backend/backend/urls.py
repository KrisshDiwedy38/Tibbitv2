"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path, include
from users.views import HealthCheckView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', HealthCheckView.as_view(), name='health-check'),
    # re_path with an optional trailing slash on the *prefix* itself (not just
    # within each app's own patterns): Vercel's edge strips a request's final
    # trailing slash before it reaches Django, so a request for an app's bare
    # root endpoint (e.g. POST /api/transactions/, which has nothing after the
    # prefix) arrives as "api/transactions" — a plain path('api/transactions/')
    # prefix requires that literal slash and never matches it, so Django's
    # APPEND_SLASH redirects back to the slash version, which Vercel strips
    # again, forever (net::ERR_TOO_MANY_REDIRECTS). Matching the optional slash
    # here means the prefix always matches regardless of which form arrives.
    re_path(r'^api/users/?', include('users.urls')),
    re_path(r'^api/listings/?', include('listings.urls')),
    re_path(r'^api/messaging/?', include('messaging.urls')),
    re_path(r'^api/transactions/?', include('transactions.urls')),
]

if settings.DEBUG:
    # Serves the local FileSystemStorage fallback used when Supabase S3 credentials
    # are missing/incomplete (see backend/storage_backends.py's ProxyStorage).
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
