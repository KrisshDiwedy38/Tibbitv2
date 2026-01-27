from django.db import models
from django.conf import settings
from listings.models import Listings


class Conversation(models.Model):
   """
   Conversation between two users about a specific listing
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
   
   # Related listing
   listing = models.ForeignKey(
      Listings,
      on_delete=models.CASCADE,
      related_name='conversations'
   )
   
   # Timestamps
   created_at = models.DateTimeField(auto_now_add=True)
   updated_at = models.DateTimeField(auto_now=True)  # Updates when new message sent
   
   class Meta:
      db_table = 'conversations'
      verbose_name = 'Conversation'
      verbose_name_plural = 'Conversations'
      unique_together = ['buyer', 'seller', 'listing']  # One conversation per buyer-seller-listing
      ordering = ['-updated_at']
      indexes = [
         models.Index(fields=['buyer', '-updated_at']),
         models.Index(fields=['seller', '-updated_at']),
      ]
   
   def __str__(self):
      return f"Conversation: {self.buyer.email} & {self.seller.email} about {self.listing.title}"
   

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
