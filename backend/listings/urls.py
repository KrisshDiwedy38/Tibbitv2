from django.urls import path, include
from backend.routers import OptionalSlashRouter
from .views import CategoryViewSet, ListingViewSet, SavedListingViewSet

router = OptionalSlashRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'saved', SavedListingViewSet, basename='saved-listing')
router.register(r'items', ListingViewSet, basename='listing')

urlpatterns = [
    path('', include(router.urls)),
]
