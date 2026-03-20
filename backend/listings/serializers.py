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
    seller_name = serializers.CharField(source='seller.get_full_name', read_only=True)

    class Meta:
        model = Listings
        fields = [
            'id', 'title', 'description', 'price', 'category', 'category_name',
            'condition', 'seller', 'seller_name', 'location', 'status',
            'views_count', 'created_at', 'updated_at', 'expires_at', 'images'
        ]
        read_only_fields = ['seller', 'status', 'views_count', 'created_at', 'updated_at']

class ListingCreateUpdateSerializer(serializers.ModelSerializer):
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )

    class Meta:
        model = Listings
        fields = [
            'id', 'title', 'description', 'price', 'category', 'condition',
            'location', 'uploaded_images'
        ]

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
