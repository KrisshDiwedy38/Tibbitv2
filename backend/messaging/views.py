from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(Q(buyer=user) | Q(seller=user)).select_related('buyer', 'seller', 'listing')

    def perform_create(self, serializer):
        listing = serializer.validated_data['listing']
        serializer.save(buyer=self.request.user, seller=listing.seller)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.all().order_by('timestamp')
        
        # Mark unread messages as read
        unread_messages = messages.filter(is_read=False).exclude(sender=request.user)
        for msg in unread_messages:
            msg.mark_as_read()
            
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(conversation__buyer=user) | Q(conversation__seller=user)
        ).select_related('conversation', 'sender')

    def perform_create(self, serializer):
        conversation = serializer.validated_data['conversation']
        if self.request.user not in [conversation.buyer, conversation.seller]:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You are not a participant in this conversation.")
        serializer.save(sender=self.request.user)
