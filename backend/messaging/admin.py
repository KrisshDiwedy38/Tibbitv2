from django.contrib import admin
from .models import Conversation, Message


class MessageInline(admin.TabularInline):
   """Inline admin for messages in a conversation"""
   model = Message
   extra = 0
   fields = ['sender', 'content', 'is_read', 'timestamp']
   readonly_fields = ['timestamp']
   ordering = ['timestamp']


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
   list_display = [
      'id',
      'buyer',
      'seller',
      'listing',
      'created_at',
      'updated_at'
   ]
   list_filter = ['created_at', 'updated_at']
   search_fields = [
      'buyer__email',
      'seller__email',
      'listing__title'
   ]
   ordering = ['-updated_at']
   readonly_fields = ['created_at', 'updated_at']
   inlines = [MessageInline]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
   list_display = [
      'id',
      'conversation',
      'sender',
      'is_read',
      'timestamp'
   ]
   list_filter = ['is_read', 'timestamp']
   search_fields = ['sender__email', 'content']
   ordering = ['-timestamp']
   readonly_fields = ['timestamp']