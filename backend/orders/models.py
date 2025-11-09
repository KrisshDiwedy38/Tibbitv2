from django.db import models
# Create your models here.

class Orders(models.Model):
    id = models.AutoField(primary_key=True)
    listing_id = models.ForeignKey(
       "listings.Listings",
       on_delete=models.CASCADE
   )
    buyer_id = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='buyer_orders')
    seller_id = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='seller_orders')
    STATUS_CHOICES = [
        ('requested','Requested'),
        ('completed','Completed'),
        ('accepted','Accepted'),
        ('rejected','Rejected')
    ]
    order_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
       default='requested'       
      ) 
    amount = models.PositiveIntegerField()
    escrow_id = models.ForeignKey(
          "payments.Payment",
          on_delete=models.CASCADE
          )
    created_at =models.DateTimeField(auto_now_add=True)
