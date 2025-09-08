from twilio.rest import Client as TwilioClient
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from fastapi import HTTPException, status
from typing import List, Optional, Dict
import asyncio

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("notifications")


# handle sms and email notifications
class NotificationService:
    def __init__(self):
        # Initialize twilio
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            self.twilio_client = TwilioClient(
                settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN
            )
            self.twilio_phone = settings.TWILIO_PHONE_NUMBER
        else:
            self.twilio_client = None

        # Initialize SendGrid
        if settings.SENDGRID_API_KEY:
            self.sendgrid_client = SendGridAPIClient(settings.SENDGRID_API_KEY)
            self.from_email = settings.SENDGRID_FROM_EMAIL
        else:
            self.sendgrid_client = None

    # send sms notifications
    async def send_sms(self, to_phone: str, message: str) -> bool:
        if not self.twilio_client:
            logger.warning("SMS service not configured")
            return False

        try:
            message = self.twilio_client.message.create(
                body=message, from_=self.twilio_phone, to=to_phone
            )

            logger.info(
                f"SMS sent successfully", phone=to_phone, message_id=message.sid
            )
            return True

        except Exception as e:
            logger.error(f"Failed to send SMS", error=str(e), phone=to_phone)
            return False

    # Send email notification
    async def send_email(
        self, to_email: str, subject: str, content: str, is_html: bool = True
    ) -> bool:
        if not self.sendgrid_client:
            logger.warning("Email service not configured")
            return False

        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=to_email,
                subject=subject,
                html_content=content if is_html else None,
                plain_text_content=content if not is_html else None,
            )

            response = self.sendgrid_client.send(message)

            logger.info(
                f"Email sent successfully",
                email=to_email,
                status_code=response.status_code,
            )

            return True

        except Exception as e:
            logger.error(f"Failed to send email", error=str(e), email=to_email)
            return False

    # send booking confirmation notifications
    async def send_booking_confirmation(
        self, customer_phone: str, customer_email: str, booking_details: Dict
    ):
        sms_message = f"Booking confirmed! Service: {booking_details['service']} on {booking_details['date']}. Booking ID: {booking_details['id']}"

        email_content = f"""
        <h2>Booking Confirmation</h2>
        <p>Your booking has been confirmed!</p>
        <ul>
            <li><strong>Service:</strong> {booking_details['service']}</li>
            <li><strong>Date:</strong> {booking_details['date']}</li>
            <li><strong>Provider:</strong> {booking_details['provider_name']}</li>
            <li><strong>Booking ID:</strong> {booking_details['id']}</li>
        </ul>
        <p>We'll notify you once the provider accepts your request.</p>
        """

        # send both SMS and Email concurrently
        await asyncio.gather(
            self.send_sms(customer_phone, sms_message),
            self.send_email(
                customer_email, "Booking Confirmation - HomeHero", email_content
            ),
            return_exceptions=True,
        )

    # Send booking status update notifications
    async def send_booking_update(
        self, phone: str, email: str, booking_details: Dict, status: str
    ):
        status_messages = {
            "accepted": "Your booking has been accepted by the provider!",
            "declined": "Unfortunately, your booking was declined. We're finding you another provider.",
            "completed": "Your service has been completed. Please rate your experience!",
            "canceled": "Your booking has been canceled.",
        }

        sms_message = f"{status_messages.get(status, 'Booking status updated')} Booking ID: {booking_details['id']}"

        email_content = f"""
        <h2>Booking Status Update</h2>
        <p>{status_messages.get(status, 'Your booking status has been updated.')}</p>
        <p><strong>Booking ID:</strong> {booking_details['id']}</p>
        <p><strong>Service:</strong> {booking_details['service']}</p>
        <p><strong>New Status:</strong> {status.title()}</p>
        """

        await asyncio.gather(
            self.send_sms(phone, sms_message),
            self.send_email(email, f"Booking Update - HomeHero", email_content),
            return_exceptions=True,
        )


# instance
notification_service = NotificationService()
