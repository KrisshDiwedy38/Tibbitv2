from django.urls import path, include
from backend.routers import OptionalSlashRouter
from .views import ConversationViewSet, MessageViewSet

router = OptionalSlashRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
]
