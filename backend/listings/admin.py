from django.contrib import admin
from .models import Category, Listings, ListingImage, SavedListing


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
   list_display = ['name', 'is_active', 'created_at']
   list_filter = ['is_active', 'created_at']
   search_fields = ['name', 'description']
   ordering = ['name']


class ListingImageInline(admin.TabularInline):
   """Inline admin for listing images"""
   model = ListingImage
   extra = 1
   fields = ['image', 'order']


@admin.register(Listings)
class ListingAdmin(admin.ModelAdmin):
   list_display = [
      'title',
      'seller',
      'price',
      'category',
      'condition',
      'status',
      'views_count',
      'created_at'
   ]
   list_filter = ['status', 'condition', 'category', 'created_at']
   search_fields = ['title', 'description', 'seller__email', 'location']
   ordering = ['-created_at']
   readonly_fields = ['views_count', 'created_at', 'updated_at']
   inlines = [ListingImageInline]
   
   fieldsets = (
      ('Basic Information', {
         'fields': ('title', 'description', 'price', 'category', 'condition')
      }),
      ('Seller & Location', {
         'fields': ('seller', 'location')
      }),
      ('Status & Metrics', {
         'fields': ('status', 'views_count', 'created_at', 'updated_at')
      }),
   )


@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
   list_display = ['listing', 'order', 'uploaded_at']
   list_filter = ['uploaded_at']
   ordering = ['listing', 'order']


@admin.register(SavedListing)
class SavedListingAdmin(admin.ModelAdmin):
   list_display = ['user', 'listing', 'saved_at']
   list_filter = ['saved_at']
   search_fields = ['user__email', 'listing__title']
   ordering = ['-saved_at']