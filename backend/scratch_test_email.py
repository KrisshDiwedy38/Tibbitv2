import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.email_utils import send_contact_email
from django.conf import settings

print(f"FOUNDER_EMAIL: {settings.FOUNDER_EMAIL}")
print(f"RESEND_API_KEY: {settings.ANYMAIL.get('RESEND_API_KEY')[:10]}...")

try:
    print("Attempting to send test email...")
    send_contact_email("test@example.com", "This is a local debug test.")
    print("Success! Email sent.")
except Exception as e:
    print(f"FAILED: {str(e)}")
    import traceback
    traceback.print_exc()
