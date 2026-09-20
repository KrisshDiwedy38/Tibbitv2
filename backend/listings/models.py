from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class Category(models.Model):
   """
   Categories for listings ( Electronics, Books, Furniture, etc.)
   """

   name = models.CharField(max_length=100, unique=True)
   slug = models.SlugField(max_length=100, unique=True, blank=True, null=True)
   description = models.TextField(blank=True, null=True)
   icon = models.CharField(max_length=50, blank=True, null=True)
   is_active = models.BooleanField(default=True)
   created_at = models.DateTimeField(auto_now_add=True)
   
   class Meta:
      verbose_name = 'Category'
      verbose_name_plural = 'Categories'
      ordering = ['name']
   
   def __str__(self):
      return self.name
      
   def save(self, *args, **kwargs):
      if not self.slug:
         from django.utils.text import slugify
         self.slug = slugify(self.name)
      super().save(*args, **kwargs)
   
class Listings(models.Model):
   """
   Main listing model for items being sold/bought.
   """

   # Status choices
   STATUS_CHOICES = [
      ('active', 'Active'),
      ('sold', 'Sold'),
      ('expired', 'Expired'),
      ('deleted', 'Deleted'),
   ]
   
   LISTING_TYPE_CHOICES = [
      ('product', 'Product'),
      ('service', 'Service'),
   ]

   PRICING_UNIT_CHOICES = [
      ('fixed', 'Fixed'),
      ('hourly', 'Per Hour'),
   ]

   # Condition choices
   CONDITION_CHOICES = [
      ('new', 'New'),
      ('like_new', 'Like New'),
      ('good', 'Good'),
      ('fair', 'Fair'),
      ('poor', 'Poor'),
   ]

   # Basic Info
   title = models.CharField(max_length=200)
   slug = models.SlugField(max_length=220, blank=True, null=True)  # readability only; id is the authoritative lookup key
   description = models.TextField()
   price = models.DecimalField(
      max_digits=10,
      decimal_places=2,
      validators= [MinValueValidator(0)]
      )
   quantity = models.PositiveIntegerField(default=1)

   # Categorization 
   category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='listings'
    )
   listing_type = models.CharField(
      max_length=20,
      choices=LISTING_TYPE_CHOICES,
      default='product'
   )
   pricing_unit = models.CharField(
      max_length=20,
      choices=PRICING_UNIT_CHOICES,
      default='fixed'
   )
   condition = models.CharField(
      max_length=20,
      choices=CONDITION_CHOICES,
      default='good',
      blank=True,
      null=True
   )
   
   # Seller info
   seller = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='listings'
   )
   
   # Location
   location = models.CharField(max_length=200) 
   
   # Status
   status = models.CharField(
      max_length=20,
      choices=STATUS_CHOICES,
      default='active'
   )
   
   # Metrics
   views_count = models.IntegerField(default=0)
   
   # Timestamps
   created_at = models.DateTimeField(auto_now_add=True)
   updated_at = models.DateTimeField(auto_now=True)
   expires_at = models.DateTimeField(blank=True, null=True)  # Auto-expire old listings
   
   class Meta:
      db_table = 'listings'
      verbose_name = 'Listing'
      verbose_name_plural = 'Listings'
      ordering = ['-created_at']
      indexes = [
         models.Index(fields=['status', '-created_at']),
         models.Index(fields=['category', 'status']),
         models.Index(fields=['seller', 'status']),
      ]
   
   def __str__(self):
      return f"{self.title} - ${self.price}"

   def save(self, *args, **kwargs):
      if not self.slug:
         from django.utils.text import slugify
         self.slug = slugify(self.title)
      # Services are always priced hourly — enforce it here rather than trusting
      # every caller (frontend forms, admin, scripts) to set it consistently.
      if self.listing_type == 'service':
         self.pricing_unit = 'hourly'
      super().save(*args, **kwargs)

   def increment_views(self):
      """Increment listing view count"""
      self.views_count += 1
      self.save(update_fields=['views_count'])

   def reduce_quantity(self, amount=1):
      """Reduce remaining quantity after a completed trade; mark sold/booked out at zero."""
      self.quantity = max(0, self.quantity - amount)
      if self.quantity == 0:
         self.status = 'sold'
      self.save(update_fields=['quantity', 'status'])

   def is_active(self):
      """Checking if the listing is active"""
      return self.status == 'active'

from backend.storage_backends import MediaStorage

class ListingImage(models.Model):
   """
   Images for listings (multiple images per listing)
   """
   listing = models.ForeignKey(
      Listings,
      on_delete=models.CASCADE,
      related_name='images'
   )
   image = models.ImageField(storage=MediaStorage(), upload_to='listing_images/')
   order = models.IntegerField(default=0)  # For ordering images (first image is thumbnail)
   uploaded_at = models.DateTimeField(auto_now_add=True)
   
   class Meta:
      db_table = 'listing_images'
      verbose_name = 'Listing Image'
      verbose_name_plural = 'Listing Images'
      ordering = ['order', 'uploaded_at']
   
   def __str__(self):
      return f"Image {self.order} for {self.listing.title}"
   

class SavedListing(models.Model):
   """
   Users can save/favorite listings for later
   """
   user = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='saved_listings'
   )
   listing = models.ForeignKey(
      Listings,
      on_delete=models.CASCADE,
      related_name='saved_by'
   )
   saved_at = models.DateTimeField(auto_now_add=True)
   
   class Meta:
      db_table = 'saved_listings'
      verbose_name = 'Saved Listing'
      verbose_name_plural = 'Saved Listings'
      unique_together = ['user', 'listing']  # User can only save a listing once
      ordering = ['-saved_at']
   
   def __str__(self):
      return f"{self.user.email} saved {self.listing.title}"