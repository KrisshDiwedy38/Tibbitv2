from django.core.exceptions import ValidationError
from .models import University

def validate_uni_email(email):
   """
   Validating that the entered email domain belongs to an approved university.
   """

   if not email:
      raise ValidationError("Email is required.")
   
   try: 
      domain = email.split('@')[1].lower()
   except IndexError:
      raise ValidationError("Invalid email format")
   
   if not University.objects(email_domain= domain, in_active =True).exists():
      raise ValidationError(
         f"Email domain {domain} is not from a supported university. Please take your official university email"
      )
   
   return email