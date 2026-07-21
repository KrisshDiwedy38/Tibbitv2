from rest_framework import serializers
from .models import Conversation, Message
from users.serializers import RegistrationSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source='sender.email', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_email', 'content', 'is_read', 'timestamp']
        read_only_fields = ['sender', 'is_read', 'timestamp']

class ConversationSerializer(serializers.ModelSerializer):
    buyer_email = serializers.CharField(source='buyer.email', read_only=True)
    seller_email = serializers.CharField(source='seller.email', read_only=True)
    context_object_str = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    latest_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'buyer', 'buyer_email', 'seller', 'seller_email',
            'content_type', 'object_id', 'context_object_str', 'created_at', 'updated_at',
            'unread_count', 'latest_message'
        ]
        read_only_fields = ['buyer', 'created_at', 'updated_at']

    def get_context_object_str(self, obj):
        if obj.content_object:
            return str(obj.content_object)
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.unread_count(request.user)
        return 0

    def get_latest_message(self, obj):
        latest = obj.messages.order_by('-timestamp').first()
        if latest:
            return MessageSerializer(latest).data
        return None
