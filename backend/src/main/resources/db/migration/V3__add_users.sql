-- =============================================================
-- V3: Thêm bảng users cho tính năng đăng nhập
-- =============================================================

CREATE TABLE users (
    id            SERIAL       PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),               -- NULL với Google users
    full_name     VARCHAR(255) NOT NULL,
    phone         VARCHAR(20),
    avatar_url    VARCHAR(500),               -- Google profile picture URL
    auth_provider VARCHAR(20)  NOT NULL DEFAULT 'local',  -- 'local' | 'google'
    role          VARCHAR(20)  NOT NULL DEFAULT 'customer',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
