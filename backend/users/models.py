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
   is_verified = models.BooleanField(default=False)
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
      upload_to='backend/media/profile_pictures/',
      blank=True,
      null=True,
      default='profile_pictures/default.jpg'
   )
        
   bio = models.TextField(max_length=500, blank=True, null=True)
   graduation_year = models.IntegerField(
      blank=True,
      null=True,
      validators=[MinValueValidator(2020), MaxValueValidator(2035)]
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

   def __str__(self):
      return self.email

   def save(self, *args, **kwargs):
      """
      Overiding Save to auto-generate username
      """

      if not self.username:
         self.username = self.email.split('@')[0]
      super().save(*args, **kwargs)

   def get_full_name(self):
      
      full_name = f'{self.first_name} {self.last_name}'
      return full_name.strip()

   def generate_otp(self):
      """
      Generating a secure 6-digit OTP to very student email.
      Returns the generated OTP 
      """

      otp = str(secrets.randbelow(1000000)).zfill(6)

      self.email_otp = otp
      self.otp_created_at = timezone.now()
      self.otp_attempts= 0
      self.save()

      from django.core.mail import send_mail
      from django.conf import settings
      
      subject = 'Your Tibbit Verification OTP'
      message = f'Your OTP (One Time Password) is {otp}. It is valid for 10 minutes.'
      email_from = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@tibbit.com')
      
      try:
          send_mail(subject, message, email_from, [self.email])
      except Exception:
          pass

      return otp
   
   def is_otp_valid(self):
      """
      Checking if the OTP has not expired.
      """

      if not self.otp_created_at:
         return False
      
      expiry_time = timedelta(minutes=10)
      return timezone.now() - self.otp_created_at < expiry_time
   
   def verify_otp(self, entered_otp):
      """
      Verifying entered OTP.
      Returns (success : bool , message : str)
      """

      if not self.email_otp:
         return False, "No OTP found, Please request a new OTP"
      
      if self.otp_attempts >= 5:
         return False, "Too many failed attempts, Please request a new OTP"

      if not self.is_otp_valid():
         return False, "OTP has expired, Please request a new OTP"
      
      if self.email_otp != entered_otp:
         self.otp_attempts += 1
         self.save()
         return False, f"Invalid OTP , {5 - self.otp_attempts} attempts remaining."
      
      self.is_email_verified = True
      self.email_otp = None
      self.otp_created_at = None
      self.otp_attempts = 0
      self.save()

      return True, "Email Verified successfully!"

class WaitlistEntry(models.Model):
   """
   Model to store waitlist signups before full registration.
   """
   email = models.EmailField(unique=True)
   university_name = models.CharField(max_length=200)
   is_verified = models.BooleanField(default=False)
   created_at = models.DateTimeField(auto_now_add=True)

   class Meta:
      verbose_name = 'Waitlist Entry'
      verbose_name_plural = 'Waitlist Entries'
      ordering = ['-created_at']

   def __str__(self):
      return f"{self.email} - {self.university_name}"
