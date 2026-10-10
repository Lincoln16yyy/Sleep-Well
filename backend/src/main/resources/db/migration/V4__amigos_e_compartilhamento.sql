-- Opt-in de compartilhamento de consistência com amigos (padrão desligado: privacidade primeiro).
ALTER TABLE users ADD COLUMN share_with_friends boolean NOT NULL DEFAULT false;

-- Amizade por consentimento duplo: quem convida (requester) propõe; quem recebe (addressee) aceita.
-- A amizade por si só não libera dado nenhum: exposição depende de share_with_friends.
CREATE TABLE friendships (
    id           uuid PRIMARY KEY,
    requester_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status       varchar(16) NOT NULL DEFAULT 'PENDING',
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_friendship_pair UNIQUE (requester_id, addressee_id),
    CONSTRAINT chk_friendship_distinct CHECK (requester_id <> addressee_id),
    CONSTRAINT chk_friendship_status CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED'))
);

CREATE INDEX idx_friendships_addressee ON friendships (addressee_id, status);
CREATE INDEX idx_friendships_requester ON friendships (requester_id, status);
