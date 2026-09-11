"""Pydantic request/response schemas for the LocalJob API."""
from __future__ import annotations

from typing import Any, Literal

from pydantic import AliasChoices, BaseModel, EmailStr, Field, field_validator

Role = Literal["job_seeker", "employer"]


class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    confirm_password: str | None = None
    role: Role = "job_seeker"
    phone: str | None = Field(default=None, max_length=40)
    location: str | None = Field(default=None, max_length=120)
    language: str = "uz"

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str | None, info) -> str | None:
        if v is not None and info.data.get("password") and v != info.data["password"]:
            raise ValueError("passwords_do_not_match")
        return v


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TelegramAuthIn(BaseModel):
    init_data: str


class PasswordChangeIn(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


class ProfileIn(BaseModel):
    name: str | None = None
    title: str | None = None
    bio: str | None = None
    location: str | None = None
    phone: str | None = None
    category: str | None = None
    skills: list[str] | None = None
    experience: list[dict[str, Any]] | None = None
    education: list[dict[str, Any]] | None = None
    languages: list[str] | None = None
    portfolio: str | None = None
    linkedin: str | None = None
    github: str | None = None
    telegram: str | None = None
    website: str | None = None
    expected_salary: int | None = None
    experience_level: str | None = None
    avatar: str | None = None


class SettingsIn(BaseModel):
    name: str | None = None
    phone: str | None = None
    location: str | None = None
    language: str | None = None
    theme: str | None = None


class JobIn(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    category: str
    location: str
    is_remote: bool = False
    salary_min: int | None = None
    salary_max: int | None = None
    currency: str = "USD"
    salary_period: str = "month"
    employment_type: str
    experience_level: str
    description: str = Field(min_length=20)
    responsibilities: list[str] = []
    requirements: list[str] = []
    benefits: list[str] = []
    skills: list[str] = []
    company_id: int | None = Field(default=None, validation_alias=AliasChoices("company_id", "companyId"))
    company_name: str | None = Field(default=None, validation_alias=AliasChoices("company_name", "companyName"))


class JobUpdateIn(BaseModel):
    title: str | None = None
    category: str | None = None
    location: str | None = None
    is_remote: bool | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    currency: str | None = None
    employment_type: str | None = None
    experience_level: str | None = None
    description: str | None = None
    responsibilities: list[str] | None = None
    requirements: list[str] | None = None
    benefits: list[str] | None = None
    skills: list[str] | None = None
    status: str | None = None


class ApplicationIn(BaseModel):
    job_id: int
    full_name: str = Field(min_length=2)
    email: EmailStr
    phone: str | None = None
    cover_letter: str = Field(min_length=10)
    portfolio_url: str | None = None
    resume_name: str | None = None


class ApplicationStatusIn(BaseModel):
    status: Literal["submitted", "review", "shortlisted", "interview", "rejected", "hired"]


class CompanyIn(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    industry: str | None = None
    location: str | None = None
    size: str | None = None
    website: str | None = None
    about: str | None = None
    logo: str | None = None


class NotificationReadIn(BaseModel):
    ids: list[int] | None = None
    all: bool = False


class BroadcastIn(BaseModel):
    message: str = Field(min_length=3)
    audience: Literal["all", "job_seekers", "employers", "telegram"] = "telegram"


class AdminUserPatchIn(BaseModel):
    role: str | None = None
    is_active: bool | None = Field(default=None, validation_alias=AliasChoices("is_active", "isActive"))


class AdminJobPatchIn(BaseModel):
    status: str | None = None
    is_featured: bool | None = Field(default=None, validation_alias=AliasChoices("is_featured", "isFeatured"))
