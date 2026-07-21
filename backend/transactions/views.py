from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Transaction, Review
from .serializers import (
    TransactionSerializer,
    TransactionCreateSerializer,
    OTPVerifySerializer,
    ReviewSerializer
)

class TransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(
            Q(buyer=user) | Q(seller=user)
        ).select_related('buyer', 'seller', 'listing')

    def get_serializer_class(self):
        if self.action == 'create':
            return TransactionCreateSerializer
        return TransactionSerializer

    def perform_create(self, serializer):
        listing = serializer.validated_data['listing']
        transaction = serializer.save(buyer=self.request.user, seller=listing.seller)
        # Generate OTPs automatically when transaction is created
        transaction.generate_otps()
        # In a real scenario, we'll email OTPs to buyer and seller here
        # For this stage, we simply generate and store them.

    @action(detail=True, methods=['post'], serializer_class=OTPVerifySerializer)
    def verify_seller_otp(self, request, pk=None):
        transaction = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Usually the buyer enters the seller's OTP to state they met the seller
        if request.user != transaction.buyer:
            return Response({"error": "Only the buyer can verify the seller's OTP."}, status=status.HTTP_403_FORBIDDEN)
            
        success, message = transaction.verify_seller_otp(serializer.validated_data['otp'])
        if success:
            return Response({"message": message}, status=status.HTTP_200_OK)
        return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], serializer_class=OTPVerifySerializer)
    def verify_buyer_otp(self, request, pk=None):
        transaction = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Usually the seller enters the buyer's OTP to state they met the buyer
        if request.user != transaction.seller:
            return Response({"error": "Only the seller can verify the buyer's OTP."}, status=status.HTTP_403_FORBIDDEN)
            
        success, message = transaction.verify_buyer_otp(serializer.validated_data['otp'])
        if success:
            return Response({"message": message}, status=status.HTTP_200_OK)
        return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        transaction = self.get_object()
        if request.user not in [transaction.buyer, transaction.seller]:
            return Response({"error": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
        
        if transaction.status != 'pending':
            return Response({"error": "Only pending transactions can be cancelled."}, status=status.HTTP_400_BAD_REQUEST)
            
        transaction.cancel(cancelled_by=request.user)
        return Response({"message": "Transaction cancelled successfully."}, status=status.HTTP_200_OK)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        return Review.objects.filter(
            Q(reviewer=user) | Q(reviewee=user)
        ).select_related('transaction', 'reviewer', 'reviewee')

    def perform_create(self, serializer):
        transaction = serializer.validated_data['transaction']
        
        if self.request.user not in [transaction.buyer, transaction.seller]:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only review a transaction you participated in.")
            
        if not transaction.is_completed():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You can only leave a review for a completed transaction.")
            
        reviewee = transaction.seller if self.request.user == transaction.buyer else transaction.buyer
        serializer.save(reviewer=self.request.user, reviewee=reviewee)
