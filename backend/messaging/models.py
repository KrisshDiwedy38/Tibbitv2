from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Conversation(models.Model):
    id = models.AutoField(primary_key=True)
    listing_id = models.ForeignKey(
        "listings.Listings",
        on_delete=models.CASCADE
      )
    participants = models.ManyToManyField('users.User', related_name='conversations')
    last_message_at = models.DateTimeField(auto_now=True)

class Messages(models.Model):
    id = models.AutoField(primary_key=True)
    convo_id = models.ForeignKey(
        "messaging.Conversation",
         on_delete=models.CASCADE   
      )
    sender_id = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='sent_messages')
    recipient_id = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    attachment = models.CharField(blank=True, null= True)
    created_at = models.DateTimeField(auto_now_add=True)