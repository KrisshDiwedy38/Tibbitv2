from rest_framework import serializers
from .models import Category, Listings, ListingImage, SavedListing

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'is_active', 'created_at']

class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'order', 'uploaded_at']

class ListingSerializer(serializers.ModelSerializer):
    images = ListingImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    seller_name = serializers.SerializerMethodField()
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    seller_avatar = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Listings
        fields = [
            'id', 'slug', 'title', 'description', 'price', 'quantity', 'category', 'category_name',
            'listing_type', 'pricing_unit', 'condition', 'seller', 'seller_name', 'seller_username', 'seller_avatar',
            'location', 'status', 'views_count', 'is_saved', 'created_at',
            'updated_at', 'expires_at', 'images'
        ]
        read_only_fields = ['seller', 'status', 'views_count', 'created_at', 'updated_at']

    def get_seller_name(self, obj):
        name = obj.seller.get_full_name()
        return name if name.strip() else obj.seller.email.split('@')[0]

    def get_seller_avatar(self, obj):
        return obj.seller.avatar_url

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedListing.objects.filter(user=request.user, listing=obj).exists()
        return False

MAX_LISTING_IMAGES = 5
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB, matching the create/edit form's own copy


class ListingCreateUpdateSerializer(serializers.ModelSerializer):
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )

    class Meta:
        model = Listings
        fields = [
            'id', 'slug', 'title', 'description', 'price', 'quantity', 'category',
            'listing_type', 'pricing_unit', 'condition',
            'location', 'status', 'uploaded_images'
        ]
        read_only_fields = ['slug']

    def validate_uploaded_images(self, value):
        if len(value) > MAX_LISTING_IMAGES:
            raise serializers.ValidationError(f"A listing can have at most {MAX_LISTING_IMAGES} photos.")
        for image in value:
            if image.size > MAX_IMAGE_SIZE_BYTES:
                raise serializers.ValidationError(f"'{image.name}' is over the 5MB limit per photo.")
        return value

    def validate(self, attrs):
        listing_type = attrs.get('listing_type', getattr(self.instance, 'listing_type', 'product'))
        if listing_type == 'service':
            attrs['condition'] = None
            attrs['category'] = None
            attrs['pricing_unit'] = 'hourly'
        return attrs

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        listing = Listings.objects.create(**validated_data)
        for index, image in enumerate(uploaded_images):
            ListingImage.objects.create(listing=listing, image=image, order=index)
        return listing

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if uploaded_images:
            instance.images.all().delete()
            for index, image in enumerate(uploaded_images):
                ListingImage.objects.create(listing=instance, image=image, order=index)
        
        return instance

class SavedListingSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)
    
    class Meta:
        model = SavedListing
        fields = ['id', 'user', 'listing', 'saved_at']
        read_only_fields = ['user']
