import re
from typing import Any, Optional
from fastapi import HTTPException, status


# input sanitization and validation utilities
class InputSanitizer:

    # Remove HTML tags and potentially harmful content
    @staticmethod
    def sensitive_html(text: str) -> str:
        if not text:
            return ""

        # remove html tags
        html_pattern = re.compile(r"<[^>]+>")
        text = html_pattern.sub("", text)

        # remove script tags
        script_pattern = re.compile(
            r"<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>", re.IGNORECASE
        )
        text = script_pattern.sub("", text)

        # remove harmful characters
        text = text.replace("<", "&lt;").replace(">", "&gt;")
        text = text.replace('"', "&quot;").replace("'", "&#x27;")

        return text.strip()

    # validate and sanitize Indian phone number
    @staticmethod
    def validate_phone(phone: str) -> str:
        if not phone:
            raise ValueError("Phone number is required")

        # Remove all non-digit characters
        phone = re.sub(r"\D", "", phone)

        # Remove leading country code variants
        if phone.startswith("0091"):
            phone = phone[4:]
        elif phone.startswith("091"):
            phone = phone[3:]
        elif phone.startswith("91"):
            phone = phone[2:]

        # Remove leading zero if present
        if phone.startswith("0") and len(phone) == 11:
            phone = phone[1:]

        # Now, phone should be exactly 10 digits and start with 6-9
        if len(phone) == 10 and phone[0] in "6789":
            return phone
        else:
            raise ValueError("Invalid Indian phone number format")

    # Validate email format
    @staticmethod
    def validate_email(email: str) -> str:
        if not email:
            raise ValueError("Email is required")

        email = email.lower().strip()
        email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

        if not re.match(email_pattern, email):
            raise ValueError("Invalid email format")

        return email

    # validate and sanitize name
    @staticmethod
    def validate_name(name: str) -> str:
        if not name:
            raise ValueError("Name is required")

        name = InputSanitizer.sensitive_html(name).strip()

        if len(name) < 2:
            raise ValueError("Name must be at least 2 characters long")
        if len(name) > 100:
            raise ValueError("Name must not exceed 100 characters")

        # allow only letters, spaces and common name characters
        if not re.match(r"^[a-zA-Z\s\.\-']+$", name):
            raise ValueError("Name contains invalid characters")

        return name

    # Validate and sanitize location
    @staticmethod
    def validate_location(location: str) -> str:
        if not location:
            return location

        location = InputSanitizer.sensitive_html(location).strip()

        if len(location) > 200:
            raise ValueError("Location must not exceed 200 characters")

        return location

    # validate and sanitize service instructions
    @staticmethod
    def validate_service_instructions(instructions: str) -> str:
        if not instructions:
            return instructions

        instructions = InputSanitizer.sensitive_html(instructions).strip()

        if len(instructions) > 1000:
            raise ValueError("Instructions must not exceed 1000 characters")

        return instructions
