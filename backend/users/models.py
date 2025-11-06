from django.db import models

# Create your models here.
class UserDetails(models.Model):
   name = models.TextField()
   email = models.EmailField()


   def __str__(self):
      return 
   