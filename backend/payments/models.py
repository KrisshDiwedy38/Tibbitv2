from django.db import models

# Create your models here.

class Payment(models.Model):
    id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(
        "orders.Orders",
        on_delete=models.CASCADE
        )
    processor = "Razorpay"
    processor_pay_id = models.CharField(null=False,blank=False,max_length=100)
    amount = models.PositiveIntegerField()
    currency = models.CharField(max_length=3, default='INR')
    STATUS_CHOICES = [
        ('pending','Pending'),
        ('cancelled', 'Cancelled'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('succeesed', 'Succeesed')
    ]
    payment_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
       default='pending'       
      )
    PAYOUT_STATUS = [
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid'),
        ('held','Held')
    ]
    payout_status = models.CharField(
        max_length=20,
        choices= PAYOUT_STATUS,
       default='unpaid'       
      )
    initiated_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField()
    details = models.JSONField()
    
