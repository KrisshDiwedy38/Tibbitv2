from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, University


@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
   list_display = ['name', 'slug', 'email_domain', 'location', 'is_active', 'created_at']
   list_filter = ['is_active', 'created_at']
   search_fields = ['name', 'email_domain', 'location']
   ordering = ['name']
   prepopulated_fields = {'slug': ('name',)}


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = [
        'email',
        'first_name',
        'last_name',
        'role',
        'university',
        'is_email_verified',
        'is_active',
        'created_at'
    ]
    list_filter = [
        'role',
        'is_email_verified',
        'is_active',
        'is_staff',
        'university',
        'created_at'
    ]
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {
            'fields': (
                'first_name',
                'last_name',
                'phone_number',
                'bio',
                'profile_picture',
                'graduation_year',
                'role'
            )
        }),
        ('University', {'fields': ('university',)}),
        ('Verification', {
            'fields': (
                'is_email_verified',
                'email_otp',
                'otp_created_at',
                'otp_attempts'
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions'
            )
        }),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'first_name',
                'last_name',
                'password1',
                'password2',
                'is_email_verified'
            ),
        }),
    )