from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
]
