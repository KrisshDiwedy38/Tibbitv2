from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from listings.models import Listings
import secrets


class Transaction(models.Model):
   """
   Records of completed/in-progress transactions with OTP verification
   """
   # Status choices
   STATUS_CHOICES = [
      ('pending', 'Pending'),          # Transaction initiated, waiting for OTP verification
      ('completed', 'Completed'),      # Both OTPs verified
      ('cancelled', 'Cancelled'),      # Either party cancelled
      ('disputed', 'Disputed'),        # Issue reported
   ]
   
   # Parties involved
   seller = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='transactions_as_seller'
   )
   buyer = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='transactions_as_buyer'
   )
   
   # Related listing
   listing = models.ForeignKey(
      Listings,
      on_delete=models.SET_NULL,
      null=True,
      related_name='transactions'
   )
   
   # Transaction details
   agreed_price = models.DecimalField(max_digits=10, decimal_places=2)
   status = models.CharField(
      max_length=20,
      choices=STATUS_CHOICES,
      default='pending'
   )
   
   # OTP verification for seller
   seller_otp = models.CharField(max_length=6, blank=True, null=True)
   seller_otp_created_at = models.DateTimeField(blank=True, null=True)
   seller_verified = models.BooleanField(default=False)
   seller_verified_at = models.DateTimeField(blank=True, null=True)
   
   # OTP verification for buyer
   buyer_otp = models.CharField(max_length=6, blank=True, null=True)
   buyer_otp_created_at = models.DateTimeField(blank=True, null=True)
   buyer_verified = models.BooleanField(default=False)
   buyer_verified_at = models.DateTimeField(blank=True, null=True)
   
   # Notes
   notes = models.TextField(blank=True, null=True)
   
   # Timestamps
   created_at = models.DateTimeField(auto_now_add=True)
   completed_at = models.DateTimeField(blank=True, null=True)
   cancelled_at = models.DateTimeField(blank=True, null=True)
   
   class Meta:
      db_table = 'transactions'
      verbose_name = 'Transaction'
      verbose_name_plural = 'Transactions'
      ordering = ['-created_at']
      indexes = [
         models.Index(fields=['seller', '-created_at']),
         models.Index(fields=['buyer', '-created_at']),
         models.Index(fields=['status', '-created_at']),
      ]
   
   def __str__(self):
      return f"Transaction #{self.id}: {self.seller.email} → {self.buyer.email}"
    
class Review(models.Model):
   """
   Reviews/ratings after transaction completion
   """
   # Rating choices
   RATING_CHOICES = [
      (1, '1 Star'),
      (2, '2 Stars'),
      (3, '3 Stars'),
      (4, '4 Stars'),
      (5, '5 Stars'),
   ]
   
   transaction = models.ForeignKey(
      Transaction,
      on_delete=models.CASCADE,
      related_name='reviews'
   )
   reviewer = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='reviews_given'
   )
   reviewee = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='reviews_received'
   )
   rating = models.IntegerField(choices=RATING_CHOICES)
   comment = models.TextField(blank=True, null=True)
   created_at = models.DateTimeField(auto_now_add=True)
   
   class Meta:
      db_table = 'reviews'
      verbose_name = 'Review'
      verbose_name_plural = 'Reviews'
      unique_together = ['transaction', 'reviewer']  # One review per person per transaction
      ordering = ['-created_at']
   
   def __str__(self):
      return f"{self.reviewer.email} → {self.reviewee.email}: {self.rating} stars"
