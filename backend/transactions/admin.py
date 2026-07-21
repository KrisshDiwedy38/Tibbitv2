from django.contrib import admin
from .models import Transaction, Review


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
   list_display = [
      'id',
      'seller',
      'buyer',
      'listing',
      'agreed_price',
      'status',
      'seller_verified',
      'buyer_verified',
      'created_at'
   ]
   list_filter = [
      'status',
      'seller_verified',
      'buyer_verified',
      'created_at'
   ]
   search_fields = [
      'seller__email',
      'buyer__email',
      'listing__title'
   ]
   ordering = ['-created_at']
   readonly_fields = [
      'seller_otp',
      'buyer_otp',
      'seller_otp_created_at',
      'buyer_otp_created_at',
      'seller_verified_at',
      'buyer_verified_at',
      'created_at',
      'completed_at',
      'cancelled_at'
   ]
   
   fieldsets = (
      ('Transaction Details', {
         'fields': (
               'seller',
               'buyer',
               'listing',
               'agreed_price',
               'status'
         )
      }),
      ('Seller Verification', {
         'fields': (
               'seller_otp',
               'seller_otp_created_at',
               'seller_verified',
               'seller_verified_at'
         )
      }),
      ('Buyer Verification', {
         'fields': (
               'buyer_otp',
               'buyer_otp_created_at',
               'buyer_verified',
               'buyer_verified_at'
         )
      }),
      ('Additional Info', {
         'fields': ('notes',)
      }),
      ('Timestamps', {
         'fields': ('created_at', 'completed_at', 'cancelled_at')
      }),
   )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
   list_display = [
      'id',
      'reviewer',
      'reviewee',
      'rating',
      'transaction',
      'created_at'
   ]
   list_filter = ['rating', 'created_at']
   search_fields = [
      'reviewer__email',
      'reviewee__email',
      'comment'
   ]
   ordering = ['-created_at']
   readonly_fields = ['created_at']