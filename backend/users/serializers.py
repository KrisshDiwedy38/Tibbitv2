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
      domain = value.split('@')[-1].lower()
      generic_domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'mail.com']
      if domain in generic_domains:
         raise serializers.ValidationError("Please use your university or institutional email address.")
      
      return value
   
   def create(self, validated_data):
      validated_data.pop('password2', None)
      email = validated_data.get('email')
      domain = email.split('@')[-1].lower()
      
      # Find or passively create the university
      university, created = University.objects.get_or_create(
          email_domain=domain,
          defaults={'name': domain, 'is_verified': False, 'is_active': False}
      )
      
      validated_data['university'] = university
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
      attrs['user'] = user
      
      is_uni_approved = bool(user.university and user.university.is_active and user.university.is_verified)
      
      if is_uni_approved:
         refresh = RefreshToken.for_user(user)
         attrs['tokens'] = {
            'refresh' : str(refresh),
            'access': str(refresh.access_token),
         }
         attrs['university_pending'] = False
      else:
         attrs['tokens'] = None
         attrs['university_pending'] = True
         uni_name = user.university.name if user.university else "Your campus"
         attrs['waitlist_message'] = f"Your email has been verified! However, {uni_name} is not yet approved on Tibbit. We will notify you via email as soon as your campus goes live."
         
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
         
      if user.university and (not user.university.is_active or not user.university.is_verified):
         uni_name = user.university.name or "Your university"
         raise serializers.ValidationError({'email': f"Your university ({uni_name}) is pending approval. You will receive an email once campus access is activated."})
      
      # Verification Passed 

      refresh = RefreshToken.for_user(user)
      attrs['user']= user
      attrs['tokens']= {
         'refresh' : str(refresh),
         'access':str(refresh.access_token),
      }
      return attrs

class PasswordResetRequestSerializer(serializers.Serializer):
   email = serializers.EmailField()

   def validate_email(self, value):
      try:
         user = CustomUser.objects.get(email=value)
      except CustomUser.DoesNotExist:
         raise serializers.ValidationError("User not found.")
      if not user.is_active:
         raise serializers.ValidationError("Account is disabled.")
      self.context['user'] = user
      return value

class PasswordResetConfirmSerializer(serializers.Serializer):
   email = serializers.EmailField()
   otp = serializers.CharField(max_length=6, min_length=6)
   password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
   password2 = serializers.CharField(write_only=True, required=True, label='Confirm Password')

   def validate(self, attrs):
      if attrs['password'] != attrs['password2']:
         raise serializers.ValidationError({"password": "Passwords do not match."})
      
      try:
         user = CustomUser.objects.get(email=attrs['email'])
      except CustomUser.DoesNotExist:
         raise serializers.ValidationError({"email": "User not found."})
      
      success, message = user.verify_otp(attrs['otp'])
      if not success:
         raise serializers.ValidationError({"otp": message})
      
      self.context['user'] = user
      return attrs
class UserProfileUpdateSerializer(serializers.ModelSerializer):
   class Meta:
      model = CustomUser
      fields = ['first_name', 'last_name', 'phone_number', 'bio', 'profile_picture', 'graduation_year']

   def to_representation(self, instance):
      data = super().to_representation(instance)
      if instance.profile_picture:
         try:
            data['profile_picture'] = instance.profile_picture.url
         except Exception:
            data['profile_picture'] = None
      else:
         data['profile_picture'] = None
      return data


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
   message = serializers.CharField(max_length=2000)

class PublicUserProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    university = serializers.CharField(source='university.name', read_only=True, default=None)
    reviews = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    listings = serializers.SerializerMethodField()
    member_since = serializers.DateTimeField(source='date_joined', read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'name', 'first_name', 'last_name', 'avatar', 'university',
            'bio', 'graduation_year', 'reputation_score', 'reviews_count',
            'reviews', 'listings', 'member_since'
        ]

    def get_name(self, obj):
        full_name = obj.get_full_name().strip()
        return full_name if full_name else obj.email.split('@')[0]

    def get_avatar(self, obj):
        if obj.profile_picture:
            try:
                return obj.profile_picture.url
            except Exception:
                return None
        return None

    def get_reviews_count(self, obj):
        from transactions.models import Review
        return Review.objects.filter(reviewee=obj).count()

    def get_reviews(self, obj):
        from transactions.serializers import ReviewSerializer
        from transactions.models import Review
        reviews = Review.objects.filter(reviewee=obj).select_related('transaction', 'reviewer', 'reviewee').order_by('-created_at')[:20]
        return ReviewSerializer(reviews, many=True).data

    def get_listings(self, obj):
        from listings.serializers import ListingSerializer
        from listings.models import Listings
        listings = Listings.objects.filter(seller=obj, status='active').select_related('category', 'seller').prefetch_related('images').order_by('-created_at')
        return ListingSerializer(listings, many=True, context=self.context).data
