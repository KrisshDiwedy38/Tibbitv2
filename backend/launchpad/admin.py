from django.contrib import admin
from .models import StartupProject, ProjectRole

@admin.register(StartupProject)
class StartupProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'founder', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'tagline', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(ProjectRole)
class ProjectRoleAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'is_filled')
    list_filter = ('is_filled',)
    search_fields = ('title', 'project__name')
