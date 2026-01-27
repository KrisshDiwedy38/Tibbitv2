from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from datetime import timedelta
from .managers import CustomUserManager

import secrets

class University(models.Model):
   """
   Model to store university details and their email domains.
   """

   name = models.CharField(max_length=200)
   email_domain = models.CharField(max_length=100, unique=True)
   location = models.CharField(max_length=200, blank=True, null=True)
   is_active = models.BooleanField(default=True)
   created_at = models.DateTimeField(auto_now_add=True)

   class Meta:
      verbose_name = 'University'
      verbose_name_plural = 'Universities'
      ordering = ['name']

   def __str__(self):
      return self.name
   

class CustomUser(AbstractUser):
   """
   Custom User model that uses email as the primary identificator, includes OTP verification for student email validation
   """

   # Making username optional/auto-generated
   username = models.CharField(max_length=100, unique=True, blank=True, null=True)
   # Email as primary identifier 
   email = models.EmailField(unique=True)
   # Setting relation from User to University
   university = models.ForeignKey(
      University,
      on_delete=models.PROTECT,
      related_name='students',
      null=True,
      blank=True
   )

   #Email Verification Fields
   is_email_verified = models.BooleanField(default=False)
   email_otp = models.CharField(max_length=6, blank=True, null=True)
   otp_created_at = models.DateTimeField(blank=True, null=True)
   otp_attempts = models.IntegerField(default=0)

   #Profile Fields
   phone_number = models.CharField(max_length=15, blank=True, null=True)
   profile_picture = models.ImageField(
      upload_to='profile_pictures/',
      blank=True,
      null=True,
      default='profile_pictures/default.jpg'
   )
        
   bio = models.TextField(max_length=500, blank=True, null=True)
   graduation_year = models.IntegerField(
      blank=True,
      null=True,
      validators=[MaxValueValidator(2020), MaxValueValidator(2035)]
   )

   #Timestamps
   created_at = models.DateTimeField(auto_now_add=True)
   updated_at = models.DateTimeField(auto_now=True)

   # Use custom manager
   objects = CustomUserManager()
    
   # setting email for authentication instead of username
   USERNAME_FIELD = 'email'
   REQUIRED_FIELDS = ['first_name', 'last_name']
    
   class Meta:
      db_table = 'users'
      verbose_name = 'User'
      verbose_name_plural = 'Users'
      ordering = ['-created_at']

   

