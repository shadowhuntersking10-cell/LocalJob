-- LocalJob MySQL schema (generated equivalent of the SQLAlchemy models).
-- `python main.py` creates these tables automatically; this file is provided for
-- DBAs who prefer to provision the schema manually.

CREATE DATABASE IF NOT EXISTS localjob CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE localjob;

CREATE TABLE IF NOT EXISTS users (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(160) NOT NULL,
  email           VARCHAR(190) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(20) NOT NULL DEFAULT 'job_seeker',
  phone           VARCHAR(40)  NULL,
  location        VARCHAR(120) NULL,
  avatar          VARCHAR(255) NULL,
  telegram_id     BIGINT       NULL UNIQUE,
  telegram_username VARCHAR(120) NULL,
  language        VARCHAR(5)   NOT NULL DEFAULT 'uz',
  theme           VARCHAR(10)  NOT NULL DEFAULT 'dark',
  prefs           JSON         NULL,
  is_active       TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      DATETIME     NOT NULL,
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS companies (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(160) NOT NULL,
  slug        VARCHAR(180) NOT NULL UNIQUE,
  industry    VARCHAR(120) NULL,
  location    VARCHAR(120) NULL,
  size        VARCHAR(60)  NULL,
  website     VARCHAR(190) NULL,
  about       TEXT         NULL,
  logo        VARCHAR(16)  NULL,
  color       VARCHAR(20)  NOT NULL DEFAULT '#1D4ED8',
  verified    TINYINT(1)   NOT NULL DEFAULT 0,
  owner_id    BIGINT       NULL,
  created_at  DATETIME     NOT NULL,
  CONSTRAINT fk_company_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS jobs (
  id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
  title               VARCHAR(200) NOT NULL,
  category            VARCHAR(60)  NOT NULL,
  location            VARCHAR(120) NOT NULL,
  is_remote           TINYINT(1)   NOT NULL DEFAULT 0,
  salary_min          INT NULL,
  salary_max          INT NULL,
  currency            VARCHAR(8)   NOT NULL DEFAULT 'USD',
  salary_period       VARCHAR(12)  NOT NULL DEFAULT 'month',
  employment_type     VARCHAR(30)  NOT NULL,
  experience_level    VARCHAR(30)  NOT NULL,
  description         TEXT NOT NULL,
  responsibilities    JSON NULL,
  requirements        JSON NULL,
  benefits            JSON NULL,
  skills              JSON NULL,
  status              VARCHAR(16) NOT NULL DEFAULT 'active',
  views               INT NOT NULL DEFAULT 0,
  applications_count  INT NOT NULL DEFAULT 0,
  company_id          BIGINT NULL,
  posted_by           BIGINT NULL,
  created_at          DATETIME NOT NULL,
  INDEX idx_jobs_title (title),
  INDEX idx_jobs_category (category),
  INDEX idx_jobs_location (location),
  CONSTRAINT fk_job_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
  CONSTRAINT fk_job_user FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS applications (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id        BIGINT NOT NULL,
  applicant_id  BIGINT NOT NULL,
  employer_id   BIGINT NULL,
  status        VARCHAR(16) NOT NULL DEFAULT 'submitted',
  full_name     VARCHAR(160) NULL,
  email         VARCHAR(190) NULL,
  phone         VARCHAR(40)  NULL,
  cover_letter  TEXT NULL,
  portfolio_url VARCHAR(255) NULL,
  resume_name   VARCHAR(255) NULL,
  match_score   INT NOT NULL DEFAULT 0,
  created_at    DATETIME NOT NULL,
  updated_at    DATETIME NOT NULL,
  UNIQUE KEY uq_application_job_user (job_id, applicant_id),
  CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  CONSTRAINT fk_app_user FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS saved_jobs (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT NOT NULL,
  job_id     BIGINT NOT NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_saved_user_job (user_id, job_id),
  CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_saved_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS profiles (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id          BIGINT NOT NULL UNIQUE,
  title            VARCHAR(160) NULL,
  bio              TEXT NULL,
  location         VARCHAR(120) NULL,
  phone            VARCHAR(40)  NULL,
  category         VARCHAR(60)  NULL,
  skills           JSON NULL,
  experience       JSON NULL,
  education        JSON NULL,
  languages        JSON NULL,
  portfolio        VARCHAR(255) NULL,
  linkedin         VARCHAR(255) NULL,
  github           VARCHAR(255) NULL,
  telegram         VARCHAR(255) NULL,
  website          VARCHAR(255) NULL,
  expected_salary  INT NULL,
  experience_level VARCHAR(30) NULL,
  views            INT NOT NULL DEFAULT 0,
  updated_at       DATETIME NOT NULL,
  CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notifications (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT NOT NULL,
  kind       VARCHAR(30) NOT NULL DEFAULT 'info',
  title      VARCHAR(190) NOT NULL,
  message    TEXT NULL,
  link       VARCHAR(190) NULL,
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  CONSTRAINT fk_note_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_logs (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  actor_id   BIGINT NULL,
  actor      VARCHAR(160) NULL,
  action     VARCHAR(120) NOT NULL,
  detail     TEXT NULL,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
