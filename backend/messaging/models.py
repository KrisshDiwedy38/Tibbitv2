from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class Conversation(models.Model):
   """
   Conversation between two users. Can be tied to a listing, startup project, 
   community post, or be a plain direct message (polymorphic).
   """
   # Participants
   buyer = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='conversations_as_buyer'
   )
   seller = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='conversations_as_seller'
   )
   
   # Polymorphic relation
   content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True)
   object_id = models.PositiveIntegerField(null=True, blank=True)
   content_object = GenericForeignKey('content_type', 'object_id')
   
   # Timestamps
   created_at = models.DateTimeField(auto_now_add=True)
   updated_at = models.DateTimeField(auto_now=True)  # Updates when new message sent
   
   class Meta:
      db_table = 'conversations'
      verbose_name = 'Conversation'
      verbose_name_plural = 'Conversations'
      unique_together = ['buyer', 'seller', 'content_type', 'object_id']
      ordering = ['-updated_at']
      indexes = [
         models.Index(fields=['buyer', '-updated_at']),
         models.Index(fields=['seller', '-updated_at']),
         models.Index(fields=['content_type', 'object_id']),
      ]
   
   def __str__(self):
      context = f"about {self.content_object}" if self.content_object else "Direct Message"
      return f"Conversation: {self.buyer.email} & {self.seller.email} - {context}"
   
   def get_other_user(self, current_user):
      """Getting the other participant in the conversation"""

      return self.seller if current_user == self.buyer else self.buyer

   def unread_count(self, user):
      """Number of unread messages a user has"""
      return self.messages.filter(is_read = False).exclude(sender=user).count()


class Message(models.Model):
   """
   Individual messages within a conversation
   """
   conversation = models.ForeignKey(
      Conversation,
      on_delete=models.CASCADE,
      related_name='messages'
   )
   sender = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='sent_messages'
   )
   content = models.TextField()
   is_read = models.BooleanField(default=False)
   timestamp = models.DateTimeField(auto_now_add=True)
   
   class Meta:
      db_table = 'messages'
      verbose_name = 'Message'
      verbose_name_plural = 'Messages'
      ordering = ['timestamp']
      indexes = [
         models.Index(fields=['conversation', 'timestamp']),
      ]
   
   def __str__(self):
      return f"Message from {self.sender.email} at {self.timestamp}"
   
   def mark_as_read(self):
      """Marking message as seen/read"""

      if not self.is_read:
         self.is_read=True
         self.save(update_fields=['is_read'])
