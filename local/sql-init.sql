-- local/sql-init.sql
-- Local development bootstrap for PostgreSQL.
-- This script is intended for local use only.
-- Run as a superuser in psql, for example: psql -U postgres -f local/sql-init.sql

-- IMPORTANT:
-- Change credentials for non-local environments.
-- The password below is kept aligned with local defaults in application-local.yml.

-- 1) Create application role/user (idempotent)
DO
$$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'odilo') THEN
        CREATE ROLE odilo LOGIN PASSWORD 'odilo';
    ELSE
        RAISE NOTICE 'Role "odilo" already exists. Skipping creation.';
    END IF;
END
$$;

-- 2) Create application database (idempotent)
-- CREATE DATABASE cannot run inside a transaction block, so we use psql's \gexec.
SELECT 'CREATE DATABASE odilo_tech_challenge OWNER odilo'
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'odilo_tech_challenge'
)\gexec

-- Ensure ownership is correct even if DB already existed.
ALTER DATABASE odilo_tech_challenge OWNER TO odilo;

-- 3) Grant database privileges
GRANT ALL PRIVILEGES ON DATABASE odilo_tech_challenge TO odilo;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
GRANT ALL ON TABLES TO odilo;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO odilo;

-- 4) Connect to the target database
\c odilo_tech_challenge

-- 5) Core schema for library loan management
-- Recreate tables to keep local schema aligned with JPA model.
DROP TABLE IF EXISTS loan;
DROP TABLE IF EXISTS library_user;
DROP TABLE IF EXISTS book;

CREATE TABLE IF NOT EXISTS library_user (
    id_card BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS book (
    isbn VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    total_copies INTEGER NOT NULL,
    available_copies INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT book_total_copies_chk CHECK (total_copies >= 0),
    CONSTRAINT book_available_copies_chk CHECK (
        available_copies >= 0
        AND available_copies <= total_copies
    )
);

CREATE TABLE IF NOT EXISTS loan (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id_card BIGINT NOT NULL,
    book_isbn VARCHAR(20) NOT NULL,
    expected_return_date TIMESTAMPTZ NOT NULL,
    actual_return_date TIMESTAMPTZ,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT loan_user_fk
        FOREIGN KEY (user_id_card) REFERENCES library_user(id_card)
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT loan_book_fk
        FOREIGN KEY (book_isbn) REFERENCES book(isbn)
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT loan_active_return_date_chk CHECK (
        (active = TRUE AND actual_return_date IS NULL)
        OR
        (active = FALSE AND actual_return_date IS NOT NULL)
    )
);

-- Enforce one active loan per user and ISBN at a time.
CREATE UNIQUE INDEX IF NOT EXISTS loan_user_book_active_uq
    ON loan (user_id_card, book_isbn)
    WHERE active = TRUE;

CREATE INDEX IF NOT EXISTS loan_user_active_idx
    ON loan (user_id_card, active);

CREATE INDEX IF NOT EXISTS loan_book_active_idx
    ON loan (book_isbn, active);

-- 6) Useful grants for existing objects in public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO odilo;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO odilo;
