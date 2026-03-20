from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ListingViewSet, SavedListingViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'saved', SavedListingViewSet, basename='saved-listing')
router.register(r'items', ListingViewSet, basename='listing')

urlpatterns = [
    path('', include(router.urls)),
]
