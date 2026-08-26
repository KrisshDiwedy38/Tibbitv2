from rest_framework import serializers
from .models import Transaction, Review
from users.models import CustomUser
from listings.models import Listings

class TransactionSerializer(serializers.ModelSerializer):
    seller_email = serializers.CharField(source='seller.email', read_only=True)
    seller_name = serializers.SerializerMethodField()
    seller_avatar = serializers.SerializerMethodField()
    buyer_email = serializers.CharField(source='buyer.email', read_only=True)
    buyer_name = serializers.SerializerMethodField()
    buyer_avatar = serializers.SerializerMethodField()
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    listing_image = serializers.SerializerMethodField()
    my_otp = serializers.SerializerMethodField()
    i_verified = serializers.SerializerMethodField()
    other_party_verified = serializers.SerializerMethodField()
    has_reviewed = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'id', 'seller', 'seller_email', 'seller_name', 'seller_avatar',
            'buyer', 'buyer_email', 'buyer_name', 'buyer_avatar',
            'listing', 'listing_title', 'listing_image', 'agreed_price',
            'status', 'seller_verified', 'buyer_verified', 'i_verified',
            'other_party_verified', 'my_otp', 'has_reviewed', 'notes',
            'created_at', 'completed_at', 'cancelled_at'
        ]
        read_only_fields = [
            'seller', 'buyer', 'status', 'seller_verified', 'buyer_verified',
            'created_at', 'completed_at', 'cancelled_at'
        ]

    def get_seller_name(self, obj):
        name = obj.seller.get_full_name()
        return name.strip() if name and name.strip() else obj.seller.email.split('@')[0]

    def get_seller_avatar(self, obj):
        if obj.seller.profile_picture:
            try:
                return obj.seller.profile_picture.url
            except Exception:
                return None
        return None

    def get_buyer_name(self, obj):
        name = obj.buyer.get_full_name()
        return name.strip() if name and name.strip() else obj.buyer.email.split('@')[0]

    def get_buyer_avatar(self, obj):
        if obj.buyer.profile_picture:
            try:
                return obj.buyer.profile_picture.url
            except Exception:
                return None
        return None

    def get_listing_image(self, obj):
        if obj.listing and obj.listing.images.exists():
            try:
                return obj.listing.images.first().image.url
            except Exception:
                return None
        return None

    def get_my_otp(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        if obj.status != 'pending':
            return None
        if request.user == obj.seller:
            return obj.seller_otp
        if request.user == obj.buyer:
            return obj.buyer_otp
        return None

    def get_i_verified(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        if request.user == obj.seller:
            return obj.seller_verified
        if request.user == obj.buyer:
            return obj.buyer_verified
        return False

    def get_other_party_verified(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        if request.user == obj.seller:
            return obj.buyer_verified
        if request.user == obj.buyer:
            return obj.seller_verified
        return False

    def get_has_reviewed(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return Review.objects.filter(transaction=obj, reviewer=request.user).exists()


class TransactionCreateSerializer(serializers.ModelSerializer):
    buyer = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)

    class Meta:
        model = Transaction
        fields = ['listing', 'buyer', 'agreed_price', 'notes']

    def validate(self, attrs):
        request = self.context.get('request')
        listing = attrs.get('listing')
        buyer = attrs.get('buyer')

        if not buyer and request.user == listing.seller:
            raise serializers.ValidationError({"buyer": "Buyer ID is required when seller initiates transaction."})
        
        actual_buyer = buyer if buyer else request.user
        if actual_buyer == listing.seller:
            raise serializers.ValidationError("Buyer and seller cannot be the same person.")

        return attrs


class OTPVerifySerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6, min_length=6)


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_email = serializers.CharField(source='reviewer.email', read_only=True)
    reviewer_name = serializers.SerializerMethodField()
    reviewer_avatar = serializers.SerializerMethodField()
    reviewee_email = serializers.CharField(source='reviewee.email', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'transaction', 'reviewer', 'reviewer_email', 'reviewer_name',
            'reviewer_avatar', 'reviewee', 'reviewee_email', 'rating', 'comment', 'created_at'
        ]
        read_only_fields = ['reviewer', 'reviewee', 'created_at']

    def get_reviewer_name(self, obj):
        name = obj.reviewer.get_full_name()
        return name.strip() if name and name.strip() else obj.reviewer.email.split('@')[0]

    def get_reviewer_avatar(self, obj):
        if obj.reviewer.profile_picture:
            try:
                return obj.reviewer.profile_picture.url
            except Exception:
                return None
        return None
