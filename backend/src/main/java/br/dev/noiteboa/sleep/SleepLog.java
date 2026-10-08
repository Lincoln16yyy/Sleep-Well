package br.dev.noiteboa.sleep;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import br.dev.noiteboa.auth.User;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "sleep_logs")
public class SleepLog {

    @Id
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "sleep_start", nullable = false)
    private OffsetDateTime sleepStart;

    @Column(name = "sleep_end", nullable = false)
    private OffsetDateTime sleepEnd;

    @Column(nullable = false)
    private Short quality;

    @Column
    private String notes;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected SleepLog() {
    }

    public SleepLog(UUID id, User user, OffsetDateTime sleepStart, OffsetDateTime sleepEnd, Short quality, String notes) {
        this.id = id;
        this.user = user;
        this.sleepStart = sleepStart;
        this.sleepEnd = sleepEnd;
        this.quality = quality;
        this.notes = notes;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public OffsetDateTime getSleepStart() { return sleepStart; }
    public OffsetDateTime getSleepEnd() { return sleepEnd; }
    public Short getQuality() { return quality; }
    public String getNotes() { return notes; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
