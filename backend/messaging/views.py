from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from listings.models import Listings

User = get_user_model()

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(
            Q(buyer=user) | Q(seller=user)
        ).select_related('buyer', 'seller', 'content_type').prefetch_related('messages')

    def create(self, request, *args, **kwargs):
        buyer = request.user
        seller_id = request.data.get('seller')
        
        if not seller_id:
            return Response({'seller': 'Seller ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            seller = User.objects.get(id=seller_id)
        except User.DoesNotExist:
            return Response({'seller': 'Seller not found.'}, status=status.HTTP_404_NOT_FOUND)

        if buyer == seller:
            return Response({'error': 'You cannot start a conversation with yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        # Handle listing / polymorphic context
        content_type = None
        object_id = None

        listing_id = request.data.get('listing') or request.data.get('listing_id')
        if listing_id:
            try:
                listing = Listings.objects.get(id=listing_id)
                content_type = ContentType.objects.get_for_model(Listings)
                object_id = listing.id
            except Listings.DoesNotExist:
                return Response({'listing': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)
        elif request.data.get('content_type') and request.data.get('object_id'):
            try:
                content_type = ContentType.objects.get(id=request.data.get('content_type'))
                object_id = request.data.get('object_id')
            except ContentType.DoesNotExist:
                pass

        # Check if conversation already exists (either direction)
        existing_conversation = Conversation.objects.filter(
            (Q(buyer=buyer, seller=seller) | Q(buyer=seller, seller=buyer)),
            content_type=content_type,
            object_id=object_id
        ).first()

        if existing_conversation:
            serializer = self.get_serializer(existing_conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Create new conversation
        conversation = Conversation.objects.create(
            buyer=buyer,
            seller=seller,
            content_type=content_type,
            object_id=object_id
        )
        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.all().order_by('timestamp').select_related('sender')
        
        # Mark unread messages as read
        unread_messages = messages.filter(is_read=False).exclude(sender=request.user)
        for msg in unread_messages:
            msg.mark_as_read()
            
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unread_total(self, request):
        user = request.user
        total = Message.objects.filter(
            (Q(conversation__buyer=user) | Q(conversation__seller=user)),
            is_read=False
        ).exclude(sender=user).count()
        return Response({'unread_total': total})

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

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
        
        # Save message and touch conversation updated_at
        message = serializer.save(sender=self.request.user)
        conversation.save(update_fields=['updated_at'])
