from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

# Create your models here.
   
class University(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(unique=True)
    domain = models.CharField(
       max_length= 255,
       unique=True,
       db_index=True
    )
    
    additional_domains = ArrayField(
       models.CharField(max_length=255),
       default=list,
       blank=True
    )
    
    geo_fence = models.JSONField(null=True, blank=True)

class User(AbstractUser):
    university_id = models.ForeignKey(
        "University",
         on_delete=models.CASCADE
      )
    is_verified = models.BooleanField(default=False)
    verification_expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    