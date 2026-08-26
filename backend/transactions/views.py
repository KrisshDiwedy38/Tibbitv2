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

    def get_queryset(self):
        user = self.request.user
        queryset = Transaction.objects.filter(
            Q(buyer=user) | Q(seller=user)
        ).select_related('buyer', 'seller', 'listing').order_by('-created_at')
        
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return TransactionCreateSerializer
        return TransactionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        listing = serializer.validated_data['listing']
        buyer = serializer.validated_data.get('buyer')

        if buyer:
            seller = request.user
        else:
            seller = listing.seller
            buyer = request.user

        transaction = serializer.save(buyer=buyer, seller=seller)
        transaction.generate_otps()
        
        # Log DEV OTP to terminal for convenient local testing
        print(f"[DEV TRADE OTP] Transaction #{transaction.id} | Seller OTP: {transaction.seller_otp} | Buyer OTP: {transaction.buyer_otp}")

        out_serializer = TransactionSerializer(transaction, context={'request': request})
        return Response(out_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def for_context(self, request):
        """
        Fetch existing transaction for a specific listing and other user (used in chat)
        """
        listing_id = request.query_params.get('listing_id')
        other_user_id = request.query_params.get('other_user_id')
        user = request.user

        if not listing_id or not other_user_id:
            return Response({"error": "listing_id and other_user_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        transaction = Transaction.objects.filter(
            listing_id=listing_id
        ).filter(
            (Q(buyer=user, seller_id=other_user_id) | Q(seller=user, buyer_id=other_user_id))
        ).order_by('-created_at').first()

        if not transaction:
            return Response(None, status=status.HTTP_200_OK)

        serializer = TransactionSerializer(transaction, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], serializer_class=OTPVerifySerializer)
    def verify_otp(self, request, pk=None):
        """
        Unified OTP verification endpoint for on-campus physical exchange.
        Seller enters Buyer's OTP; Buyer enters Seller's OTP.
        """
        transaction = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entered_otp = serializer.validated_data['otp'].strip()

        if request.user not in [transaction.buyer, transaction.seller]:
            return Response({"error": "You are not a party in this transaction."}, status=status.HTTP_403_FORBIDDEN)

        if transaction.status != 'pending':
            return Response({"error": f"Transaction is already {transaction.status}."}, status=status.HTTP_400_BAD_REQUEST)

        # If user is seller, verify buyer's OTP (entered by seller)
        if request.user == transaction.seller:
            success, message = transaction.verify_buyer_otp(entered_otp)
        else:
            # If user is buyer, verify seller's OTP (entered by buyer)
            success, message = transaction.verify_seller_otp(entered_otp)

        if success:
            # Reload from DB to get updated status and timestamps
            transaction.refresh_from_db()
            response_serializer = TransactionSerializer(transaction, context={'request': request})
            return Response({
                "message": message,
                "transaction": response_serializer.data
            }, status=status.HTTP_200_OK)

        return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        transaction = self.get_object()
        if request.user not in [transaction.buyer, transaction.seller]:
            return Response({"error": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
        
        if transaction.status != 'pending':
            return Response({"error": "Only pending transactions can be cancelled."}, status=status.HTTP_400_BAD_REQUEST)
            
        transaction.cancel(cancelled_by=request.user)
        response_serializer = TransactionSerializer(transaction, context={'request': request})
        return Response({
            "message": "Transaction cancelled successfully.",
            "transaction": response_serializer.data
        }, status=status.HTTP_200_OK)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Review.objects.all().select_related('transaction', 'reviewer', 'reviewee').order_by('-created_at')
        user_id = self.request.query_params.get('user')
        if user_id:
            queryset = queryset.filter(reviewee_id=user_id)
        return queryset

    def perform_create(self, serializer):
        transaction = serializer.validated_data['transaction']
        
        if self.request.user not in [transaction.buyer, transaction.seller]:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only review a transaction you participated in.")
            
        if not transaction.is_completed():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You can only leave a review for a completed transaction.")
            
        if Review.objects.filter(transaction=transaction, reviewer=self.request.user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You have already reviewed this transaction.")

        reviewee = transaction.seller if self.request.user == transaction.buyer else transaction.buyer
        serializer.save(reviewer=self.request.user, reviewee=reviewee)
