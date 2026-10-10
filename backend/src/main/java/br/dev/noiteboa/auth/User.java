package br.dev.noiteboa.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    private UUID id;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "display_name", nullable = false, length = 120)
    private String displayName;

    @Column(nullable = false, length = 64)
    private String timezone;

    /** Opt-in explícito: só quem marca aparece no ranking de amigos (padrão desligado). */
    @Column(name = "share_with_friends", nullable = false)
    private boolean shareWithFriends;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected User() {
    }

    public User(UUID id, String email, String passwordHash, String displayName, OffsetDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
        this.timezone = "America/Sao_Paulo";
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getTimezone() {
        return timezone;
    }

    public void updateTimezone(String timezone) {
        this.timezone = timezone;
    }

    public boolean isShareWithFriends() {
        return shareWithFriends;
    }

    public void setShareWithFriends(boolean shareWithFriends) {
        this.shareWithFriends = shareWithFriends;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
