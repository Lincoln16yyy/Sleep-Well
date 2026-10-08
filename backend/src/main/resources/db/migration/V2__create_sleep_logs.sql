CREATE TABLE sleep_logs (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sleep_start timestamptz NOT NULL,
    sleep_end   timestamptz NOT NULL,
    quality     smallint NOT NULL,
    notes       text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT chk_sleep_end_after_start CHECK (sleep_end > sleep_start),
    CONSTRAINT chk_quality_range CHECK (quality BETWEEN 1 AND 5)
);

CREATE INDEX idx_sleep_logs_user_start ON sleep_logs (user_id, sleep_start DESC);
