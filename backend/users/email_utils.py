import resend
from html import escape
from django.conf import settings

resend.api_key = settings.ANYMAIL.get("RESEND_API_KEY")

def send_contact_email(user_email: str, message: str):
    """Send a contact form message to the founder.
    
    User inputs are HTML-escaped to prevent injection attacks
    since they are interpolated directly into an HTML email template.
    """
    safe_email = escape(user_email)
    safe_message = escape(message)

    resend.Emails.send({
        "from": "Tibbit <onboarding@resend.dev>",
        "to": [settings.FOUNDER_EMAIL],
        "reply_to": user_email,
        "subject": f"[Tibbit] Message from {safe_email}",
        "html": f"""
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 2px solid #000; background-color: #fff;">
                <h2 style="color: #000; text-transform: uppercase; letter-spacing: 1px; border-bottom: 4px solid #ff51fa; padding-bottom: 10px; margin-top: 0;">NEW CONTACT MESSAGE</h2>
                <p style="color: #555; font-size: 14px;"><strong>FROM:</strong> <a href="mailto:{safe_email}" style="color: #ff51fa; font-weight: bold; text-decoration: none;">{safe_email}</a></p>
                <div style="background-color: #f9f9f9; padding: 20px; border: 2px solid #000; margin-top: 25px;">
                    <p style="color: #000; margin: 0; white-space: pre-wrap; font-size: 16px; line-height: 1.5;">{safe_message}</p>
                </div>
                <p style="color: #999; font-size: 11px; margin-top: 40px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Sent from the Tibbit Platform</p>
            </div>
        """,
    })

def send_bug_report(user_email: str, description: str):
    """Send a bug report to the founder.
    
    User inputs are HTML-escaped to prevent injection attacks
    since they are interpolated directly into an HTML email template.
    """
    safe_email = escape(user_email)
    safe_description = escape(description)

    resend.Emails.send({
        "from": "Tibbit <onboarding@resend.dev>",
        "to": [settings.FOUNDER_EMAIL],
        "reply_to": user_email,
        "subject": f"[Tibbit] Bug report from {safe_email}",
        "html": f"""
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 4px solid #ff3333; background-color: #fff;">
                <h2 style="color: #ff3333; text-transform: uppercase; letter-spacing: 1px; border-bottom: 4px solid #000; padding-bottom: 10px; margin-top: 0;">🚨 CRITICAL BUG REPORT</h2>
                <p style="color: #555; font-size: 14px;"><strong>REPORTED BY:</strong> <a href="mailto:{safe_email}" style="color: #ff3333; font-weight: bold; text-decoration: none;">{safe_email}</a></p>
                <div style="background-color: #fff5f5; padding: 20px; border: 2px solid #000; border-left: 6px solid #ff3333; margin-top: 25px;">
                    <p style="color: #000; margin: 0; white-space: pre-wrap; font-size: 16px; line-height: 1.5;">{safe_description}</p>
                </div>
                <p style="color: #999; font-size: 11px; margin-top: 40px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Sent from the Tibbit Bug Reporter</p>
            </div>
        """,
    })