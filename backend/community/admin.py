from django.contrib import admin
from .models import ForumBoard, ForumPost, ForumComment

@admin.register(ForumBoard)
class ForumBoardAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'board', 'author', 'upvotes', 'created_at')
    list_filter = ('board', 'created_at')
    search_fields = ('title', 'content')

@admin.register(ForumComment)
class ForumCommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__email', 'post__title')
