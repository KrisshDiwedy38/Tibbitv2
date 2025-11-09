from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class Listings(models.Model):
    id = models.AutoField(primary_key=True)
    owner_id = models.ForeignKey("users.User", on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.PositiveIntegerField()
    currency = models.CharField(max_length=3, default='INR')
    category = models.CharField()
    tags = ArrayField(
        models.CharField(max_length=20),
        blank=True,
        default=list
    )
    STATUS_CHOICES = [
        ('sold','Sold'),
        ('active','Active'),
        ('inactive','Inactive'),
        ('pending','Pending')
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
       default='pending'       
      )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class Listing_Image(models.Model):
    id = models.AutoField(primary_key=True)
    listing_id = models.ForeignKey(
        "Listings",
        on_delete=models.CASCADE
      )
    s3_key = models.CharField()
    thumbnail_key = models.CharField()
    
    