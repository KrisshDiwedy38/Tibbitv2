from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
   """
   Custom user manager to set email as the unique identifier instead of username.
   """

   def create_user(self, email, password=None, **extra_fields):
      if not email:
         raise ValueError('Email field must be set')
      
      email = self.normalize_email(email)
      user = self.model(email=email, **extra_fields)
      user.set_password(password)
      user.save(using=self._db)
      return user
   

   def create_superuser(self, email, password=None, **extra_fields):
      """
      Create and save superuser with given email,password and necessary flags.
      """

      extra_fields.setdefault('is_staff', True)
      extra_fields.setdefault('is_superuser', True)
      extra_fields.setdefault('is_active', True)
      extra_fields.setdefault('is_email_verified', True)

      if extra_fields.get('is_staff') is not True:
         raise ValueError('Superuser must have is_staff=True.')
      
      if extra_fields.get('is_superuser') is not True:
         raise ValueError('Superuser must have is_superuser=True.')
      
      return self.create_user(email, password, **extra_fields)