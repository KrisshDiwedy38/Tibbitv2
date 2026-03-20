from rest_framework import serializers
from .models import Transaction, Review

class TransactionSerializer(serializers.ModelSerializer):
    seller_email = serializers.CharField(source='seller.email', read_only=True)
    buyer_email = serializers.CharField(source='buyer.email', read_only=True)
    listing_title = serializers.CharField(source='listing.title', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'seller', 'seller_email', 'buyer', 'buyer_email', 'listing',
            'listing_title', 'agreed_price', 'status', 'seller_verified',
            'buyer_verified', 'notes', 'created_at', 'completed_at', 'cancelled_at'
        ]
        read_only_fields = [
            'seller', 'buyer', 'status', 'seller_verified', 'buyer_verified',
            'created_at', 'completed_at', 'cancelled_at'
        ]

class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['listing', 'agreed_price', 'notes']

class OTPVerifySerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_email = serializers.CharField(source='reviewer.email', read_only=True)
    reviewee_email = serializers.CharField(source='reviewee.email', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'transaction', 'reviewer', 'reviewer_email',
            'reviewee', 'reviewee_email', 'rating', 'comment', 'created_at'
        ]
        read_only_fields = ['reviewer', 'reviewee', 'created_at']
