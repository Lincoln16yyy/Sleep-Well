CREATE TABLE sleep_goals (
    user_id        uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    target_minutes int NOT NULL,
    bedtime        time,
    wake_time      time,
    updated_at     timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT chk_target_reasonable CHECK (target_minutes BETWEEN 240 AND 720)
);
