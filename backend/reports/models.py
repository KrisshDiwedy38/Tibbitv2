from django.db import models

# Create your models here.
class Report(models.Model):
    id = models.AutoField(primary_key=True)
    reporter_id =  models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="report_made"
        )
    target_id =  models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="report_received"
        )
    target_type = models.CharField()
    reason = models.TextField()
    STATUS_CHOICES = [
        ('open','Open'),
        ('closed', 'Closed'),
        ('ongoing', 'Ongoing')
    ]
    report_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,  
        default='open'    
      ) 
    handled_by = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    
