CREATE TABLE users (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email         varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    display_name  varchar(120) NOT NULL,
    timezone      varchar(64)  NOT NULL DEFAULT 'America/Sao_Paulo',
    created_at    timestamptz  NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_users_email_ci ON users (lower(email));
