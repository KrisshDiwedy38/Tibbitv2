from rest_framework import serializers
from .models import Conversation, Message
from listings.models import Listings

class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source='sender.email', read_only=True)
    sender_name = serializers.SerializerMethodField()
    sender_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'sender', 'sender_email', 'sender_name', 
            'sender_avatar', 'content', 'is_read', 'timestamp'
        ]
        read_only_fields = ['sender', 'is_read', 'timestamp']

    def get_sender_name(self, obj):
        name = obj.sender.get_full_name()
        return name.strip() if name and name.strip() else obj.sender.email.split('@')[0]

    def get_sender_avatar(self, obj):
        if obj.sender.profile_picture:
            try:
                return obj.sender.profile_picture.url
            except Exception:
                return None
        return None

class ConversationSerializer(serializers.ModelSerializer):
    buyer_email = serializers.CharField(source='buyer.email', read_only=True)
    seller_email = serializers.CharField(source='seller.email', read_only=True)
    other_user = serializers.SerializerMethodField()
    context_object_str = serializers.SerializerMethodField()
    context_details = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    latest_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'buyer', 'buyer_email', 'seller', 'seller_email',
            'other_user', 'content_type', 'object_id', 'context_object_str',
            'context_details', 'created_at', 'updated_at', 'unread_count', 'latest_message'
        ]
        read_only_fields = ['buyer', 'created_at', 'updated_at']

    def get_other_user(self, obj):
        request = self.context.get('request')
        current_user = request.user if request and hasattr(request, 'user') else None
        
        if not current_user or not current_user.is_authenticated:
            other = obj.seller
        else:
            other = obj.seller if current_user == obj.buyer else obj.buyer

        name = other.get_full_name()
        name_display = name.strip() if name and name.strip() else other.email.split('@')[0]
        
        avatar_url = None
        if other.profile_picture:
            try:
                avatar_url = other.profile_picture.url
            except Exception:
                avatar_url = None

        return {
            'id': other.id,
            'name': name_display,
            'email': other.email,
            'avatar': avatar_url,
            'university': other.university.name if other.university else None
        }

    def get_context_object_str(self, obj):
        if obj.content_object:
            return str(obj.content_object)
        return None

    def get_context_details(self, obj):
        if not obj.content_object:
            return None
            
        if isinstance(obj.content_object, Listings):
            listing = obj.content_object
            first_image = listing.images.order_by('order', 'uploaded_at').first()
            image_url = first_image.image.url if first_image else None
            return {
                'id': listing.id,
                'title': listing.title,
                'price': str(listing.price),
                'image': image_url,
                'status': listing.status,
                'type': 'listing'
            }
            
        return {
            'id': getattr(obj.content_object, 'id', None),
            'title': str(obj.content_object),
            'type': 'other'
        }

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return obj.unread_count(request.user)
        return 0

    def get_latest_message(self, obj):
        latest = obj.messages.order_by('-timestamp').first()
        if latest:
            return MessageSerializer(latest).data
        return None
