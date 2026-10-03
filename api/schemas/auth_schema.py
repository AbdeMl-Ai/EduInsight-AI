import re

from pydantic import BaseModel, ConfigDict, field_validator


class RegistrationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: str
    email: str
    phone_number: str
    password: str

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        value = value.strip()
        if not value or len(value) > 120:
            raise ValueError("Full name must be between 1 and 120 characters.")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip().lower()
        if len(value) > 254 or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError("Enter a valid email address.")
        return value

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str) -> str:
        value = value.strip()
        digits = re.sub(r"\D", "", value)
        if (
            len(digits) < 7
            or len(digits) > 15
            or not re.fullmatch(r"\+?[\d\s().-]+", value)
        ):
            raise ValueError("Enter a valid phone number.")
        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be no more than 72 bytes.")
        return value


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
