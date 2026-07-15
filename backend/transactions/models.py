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
      
   def clean(self):
      from django.core.exceptions import ValidationError
      if self.buyer == self.seller:
         raise ValidationError("Buyer and seller cannot be the same person.")
         
   def save(self, *args, **kwargs):
      self.clean()
      super().save(*args, **kwargs)
    
   def generate_otps(self):
      """
      Generate OTPs for both seller and buyer
      Returns (seller_otp, buyer_otp)
      """
      # Generate seller OTP
      self.seller_otp = str(secrets.randbelow(1000000)).zfill(6)
      self.seller_otp_created_at = timezone.now()
      
      # Generate buyer OTP
      self.buyer_otp = str(secrets.randbelow(1000000)).zfill(6)
      self.buyer_otp_created_at = timezone.now()
      
      self.save()
      return self.seller_otp, self.buyer_otp
   
   def is_seller_otp_valid(self):
      """Check if seller OTP is still valid (24 hours)"""
      if not self.seller_otp_created_at:
         return False
      expiry_time = timedelta(hours=24)
      return timezone.now() - self.seller_otp_created_at < expiry_time
   
   def is_buyer_otp_valid(self):
      """Check if buyer OTP is still valid (24 hours)"""
      if not self.buyer_otp_created_at:
         return False
      expiry_time = timedelta(hours=24)
      return timezone.now() - self.buyer_otp_created_at < expiry_time
   
   def verify_seller_otp(self, entered_otp):
      """
      Verify seller's OTP (entered by buyer)
      Returns (success: bool, message: str)
      """
      if not self.seller_otp:
         return False, "No OTP found for seller."
      
      if not self.is_seller_otp_valid():
         return False, "Seller OTP has expired."
      
      if self.seller_otp != entered_otp:
         return False, "Invalid seller OTP."
      
      # Mark seller as verified
      self.seller_verified = True
      self.seller_verified_at = timezone.now()
      self.save()
      
      # Check if both parties verified
      self._check_completion()
      
      return True, "Seller verified successfully!"
   
   def verify_buyer_otp(self, entered_otp):
      """
      Verify buyer's OTP (entered by seller)
      Returns (success: bool, message: str)
      """
      if not self.buyer_otp:
         return False, "No OTP found for buyer."
      
      if not self.is_buyer_otp_valid():
         return False, "Buyer OTP has expired."
      
      if self.buyer_otp != entered_otp:
         return False, "Invalid buyer OTP."
      
      # Mark buyer as verified
      self.buyer_verified = True
      self.buyer_verified_at = timezone.now()
      self.save()
      
      # Check if both parties verified
      self._check_completion()
      
      return True, "Buyer verified successfully!"
   
   def _check_completion(self):
      """Internal method to check if transaction is complete"""
      if self.seller_verified and self.buyer_verified:
         self.status = 'completed'
         self.completed_at = timezone.now()
         
         # Mark listing as sold
         if self.listing:
               self.listing.mark_as_sold()
         
         self.save()
   
   def cancel(self, cancelled_by):
      """
      Cancel the transaction
      cancelled_by: User instance who cancelled
      """
      self.status = 'cancelled'
      self.cancelled_at = timezone.now()
      self.notes = f"Cancelled by {cancelled_by.email} at {timezone.now()}"
      self.save()
   
   def is_completed(self):
      """Check if transaction is completed"""
      return self.status == 'completed'


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
