from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, University, WaitlistEntry


class UniversitySerializer(serializers.ModelSerializer):
   class Meta:
      model = University
      fields = ['id', 'name', 'email_domain', 'location','created_at']


# Registration 

class RegistrationSerializer(serializers.ModelSerializer):
   password = serializers.CharField(write_only = True, required = True, validators = [validate_password])
   password2 = serializers.CharField(write_only = True, required = True, label = 'Confirm Password')

   class Meta: 
      model = CustomUser
      fields = ['email', 'first_name','last_name', 'password', 'password2']

   def validate(self, attrs):
      if attrs['password'] != attrs['password2']:
         raise serializers.ValidationError({"password" : "Passwords do not match."})
      return attrs
   
   def validate_email(self, value):
      domain = value.split('@')[-1]
      if not University.objects.filter(email_domain = domain, is_active = True).exists():
         raise serializers.ValidationError("Entered email is not of a registered university.")
      
      return value
   
   def create(self, validated_data):
      user = CustomUser.objects.create_user(**validated_data)

      user.generate_otp()
      return user
   

# OTP Verification

class OTPVerifySerializer(serializers.Serializer):
   email = serializers.EmailField()
   otp = serializers.CharField(max_length = 6, min_length = 6)

   def validate(self, attrs):
      try: 
         user = CustomUser.objects.get(email = attrs['email'])
      except CustomUser.DoesNotExist:
         raise serializers.ValidationError({"email": "User not found!"})
      
      success, message = user.verify_otp(attrs['otp'])

      if not success:
         raise serializers.ValidationError({"otp": message})
      
      # When OTP passes
      refresh = RefreshToken.for_user(user)
      attrs['user']= user
      attrs['tokens']= {
         'refresh' : str(refresh),
         'access':str(refresh.access_token),
      }
      return attrs
   

class ResendOTPSerializer(serializers.Serializer):
   email = serializers.EmailField()

   def validate_email(self, value):
      try:
         user = CustomUser.objects.get(email= value)
      except CustomUser.DoesNotExist:
         raise serializers.ValidationError("User not found.")
      if user.is_email_verified:
         raise serializers.ValidationError("Email is already verified.")
      self.context['user'] = user
      return value
      

# Login 


class LoginSerializer(serializers.Serializer):
   email = serializers.EmailField()
   password = serializers.CharField(write_only = True)

   def validate(self, attrs):
      try:
         user = CustomUser.objects.get(email=attrs['email'])
      except CustomUser.DoesNotExist:
         raise serializers.ValidationError({'email' :"Invalid Credentials."})
      
      if not user.check_password(attrs['password']):
         raise serializers.ValidationError({'password': "Invalid Credentials."})

      if not user.is_email_verified:
         raise serializers.ValidationError({'email': 'Email not verified, Verify email before logging in again.'})
      
      if not user.is_active:
         raise serializers.ValidationError({'email': 'This account has been disabled.'})
      
      # Verification Passed 

      refresh = RefreshToken.for_user(user)
      attrs['user']= user
      attrs['tokens']= {
         'refresh' : str(refresh),
         'access':str(refresh.access_token),
      }
      return attrs


class WaitlistEntrySerializer(serializers.ModelSerializer):
   email = serializers.EmailField()

   class Meta:
      model = WaitlistEntry
      fields = ['email', 'university_name', 'created_at', 'is_verified']
      read_only_fields = ['created_at', 'is_verified']

   def validate_email(self, value):
      if WaitlistEntry.objects.filter(email=value).exists():
         raise serializers.ValidationError("Hey! Love the excitement but you're already on the waitlist")
      if CustomUser.objects.filter(email=value).exists():
         raise serializers.ValidationError("This email is already registered with an account.")
      return value

   def create(self, validated_data):
      email = validated_data['email']
      domain = email.split('@')[-1]
      uni_name = validated_data['university_name']

      # Ensure university exists and is marked as not verified if newly created (and set active=False too to be safe)
      university, created = University.objects.get_or_create(
          email_domain=domain,
          defaults={'name': uni_name, 'is_verified': False, 'is_active': False}
      )

      # Create WaitlistEntry marked as not verified
      # Note: is_verified defaults to False already, but setting to be explicit
      validated_data['is_verified'] = False
      entry = WaitlistEntry.objects.create(**validated_data)
      return entry

class ContactFormSerializer(serializers.Serializer):
   email = serializers.EmailField()
   message = serializers.CharField()
