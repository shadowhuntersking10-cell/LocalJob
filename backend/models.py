"""SQLAlchemy models — the LocalJob data layer (MySQL / SQLite compatible)."""
from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base

BigIntPK = BigInteger().with_variant(Integer, "sqlite")
BigIntFK = BigInteger().with_variant(Integer, "sqlite")


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


ROLES = ("job_seeker", "employer", "admin")
APPLICATION_STATUSES = ("submitted", "review", "shortlisted", "interview", "rejected", "hired")
JOB_STATUSES = ("active", "paused", "closed")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigIntPK, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str] = mapped_column(String(190), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="job_seeker", index=True)
    phone: Mapped[str | None] = mapped_column(String(40))
    location: Mapped[str | None] = mapped_column(String(120))
    avatar: Mapped[str | None] = mapped_column(String(255))
    telegram_id: Mapped[int | None] = mapped_column(BigIntFK, unique=True, index=True)
    telegram_username: Mapped[str | None] = mapped_column(String(120))
    language: Mapped[str] = mapped_column(String(5), default="uz")
    theme: Mapped[str] = mapped_column(String(10), default="dark")
    prefs: Mapped[dict] = mapped_column(JSON, default=dict)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    company: Mapped["Company | None"] = relationship(back_populates="owner", uselist=False)
    profile: Mapped["Profile | None"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    jobs: Mapped[list["Job"]] = relationship(back_populates="posted_by_user", foreign_keys="Job.posted_by")
    applications: Mapped[list["Application"]] = relationship(
        back_populates="applicant", foreign_keys="Application.applicant_id", cascade="all, delete-orphan"
    )
    saved_jobs: Mapped[list["SavedJob"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    notifications: Mapped[list["Notification"]] = relationship(back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<User {self.id} {self.email} {self.role}>"


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(BigIntPK, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    slug: Mapped[str] = mapped_column(String(180), unique=True, index=True, nullable=False)
    industry: Mapped[str | None] = mapped_column(String(120))
    location: Mapped[str | None] = mapped_column(String(120))
    size: Mapped[str | None] = mapped_column(String(60))
    website: Mapped[str | None] = mapped_column(String(190))
    about: Mapped[str | None] = mapped_column(Text)
    logo: Mapped[str | None] = mapped_column(String(16))          # emoji / initials
    color: Mapped[str] = mapped_column(String(20), default="#1D4ED8")
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    owner_id: Mapped[int | None] = mapped_column(BigIntFK, ForeignKey("users.id", ondelete="SET NULL"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    owner: Mapped[User | None] = relationship(back_populates="company")
    jobs: Mapped[list["Job"]] = relationship(back_populates="company", cascade="all, delete-orphan")


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(BigIntPK, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(60), index=True)
    location: Mapped[str] = mapped_column(String(120), index=True)
    is_remote: Mapped[bool] = mapped_column(Boolean, default=False)
    salary_min: Mapped[int | None] = mapped_column(Integer)
    salary_max: Mapped[int | None] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(8), default="USD")
    salary_period: Mapped[str] = mapped_column(String(12), default="month")
    employment_type: Mapped[str] = mapped_column(String(30), index=True)
    experience_level: Mapped[str] = mapped_column(String(30), index=True)
    description: Mapped[str] = mapped_column(Text)
    responsibilities: Mapped[list] = mapped_column(JSON, default=list)
    requirements: Mapped[list] = mapped_column(JSON, default=list)
    benefits: Mapped[list] = mapped_column(JSON, default=list)
    skills: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(16), default="active", index=True)
    views: Mapped[int] = mapped_column(Integer, default=0)
    applications_count: Mapped[int] = mapped_column(Integer, default=0)
    company_id: Mapped[int | None] = mapped_column(BigIntFK, ForeignKey("companies.id", ondelete="SET NULL"))
    posted_by: Mapped[int | None] = mapped_column(BigIntFK, ForeignKey("users.id", ondelete="SET NULL"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)

    company: Mapped[Company | None] = relationship(back_populates="jobs")
    posted_by_user: Mapped[User | None] = relationship(back_populates="jobs", foreign_keys=[posted_by])
    applications: Mapped[list["Application"]] = relationship(back_populates="job", cascade="all, delete-orphan")

    @property
    def salary_label(self) -> str:
        if not self.salary_min and not self.salary_max:
            return "Negotiable"

        def fmt(v: int | None) -> str:
            if not v:
                return ""
            if v >= 1_000_000:
                return f"{v / 1_000_000:.1f}M".replace(".0M", "M")
            if v >= 1000:
                return f"{v // 1000}k"
            return str(v)

        if self.salary_min and self.salary_max:
            return f"{fmt(self.salary_min)} – {fmt(self.salary_max)} {self.currency}/{self.salary_period}"
        value = self.salary_min or self.salary_max
        return f"{fmt(value)} {self.currency}/{self.salary_period}"


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (UniqueConstraint("job_id", "applicant_id", name="uq_application_job_user"),)

    id: Mapped[int] = mapped_column(BigIntPK, primary_key=True, autoincrement=True)
    job_id: Mapped[int] = mapped_column(BigIntFK, ForeignKey("jobs.id", ondelete="CASCADE"), index=True)
    applicant_id: Mapped[int] = mapped_column(BigIntFK, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    employer_id: Mapped[int | None] = mapped_column(BigIntFK, ForeignKey("users.id", ondelete="SET NULL"), index=True)
    status: Mapped[str] = mapped_column(String(16), default="submitted", index=True)
    full_name: Mapped[str | None] = mapped_column(String(160))
    email: Mapped[str | None] = mapped_column(String(190))
    phone: Mapped[str | None] = mapped_column(String(40))
    cover_letter: Mapped[str | None] = mapped_column(Text)
    portfolio_url: Mapped[str | None] = mapped_column(String(255))
    resume_name: Mapped[str | None] = mapped_column(String(255))
    match_score: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)

    job: Mapped[Job] = relationship(back_populates="applications")
    applicant: Mapped[User] = relationship(back_populates="applications", foreign_keys=[applicant_id])


class SavedJob(Base):
    __tablename__ = "saved_jobs"
    __table_args__ = (UniqueConstraint("user_id", "job_id", name="uq_saved_user_job"),)

    id: Mapped[int] = mapped_column(BigIntPK, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigIntFK, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    job_id: Mapped[int] = mapped_column(BigIntFK, ForeignKey("jobs.id", ondelete="CASCADE"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    user: Mapped[User] = relationship(back_populates="saved_jobs")
    job: Mapped[Job] = relationship()


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(BigIntPK, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigIntFK, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    title: Mapped[str | None] = mapped_column(String(160))
    bio: Mapped[str | None] = mapped_column(Text)
    location: Mapped[str | None] = mapped_column(String(120))
    phone: Mapped[str | None] = mapped_column(String(40))
    category: Mapped[str | None] = mapped_column(String(60))
    skills: Mapped[list] = mapped_column(JSON, default=list)
    experience: Mapped[list] = mapped_column(JSON, default=list)
    education: Mapped[list] = mapped_column(JSON, default=list)
    languages: Mapped[list] = mapped_column(JSON, default=list)
    portfolio: Mapped[str | None] = mapped_column(String(255))
    linkedin: Mapped[str | None] = mapped_column(String(255))
    github: Mapped[str | None] = mapped_column(String(255))
    telegram: Mapped[str | None] = mapped_column(String(255))
    website: Mapped[str | None] = mapped_column(String(255))
    expected_salary: Mapped[int | None] = mapped_column(Integer)
    experience_level: Mapped[str | None] = mapped_column(String(30))
    views: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)

    user: Mapped[User] = relationship(back_populates="profile")


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(BigIntPK, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigIntFK, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    kind: Mapped[str] = mapped_column(String(30), default="info")
    title: Mapped[str] = mapped_column(String(190))
    message: Mapped[str | None] = mapped_column(Text)
    link: Mapped[str | None] = mapped_column(String(190))
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    user: Mapped[User] = relationship(back_populates="notifications")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(BigIntPK, primary_key=True, autoincrement=True)
    actor_id: Mapped[int | None] = mapped_column(BigIntFK)
    actor: Mapped[str | None] = mapped_column(String(160))
    action: Mapped[str] = mapped_column(String(120))
    detail: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
