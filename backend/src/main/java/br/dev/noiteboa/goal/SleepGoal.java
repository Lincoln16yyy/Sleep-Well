package br.dev.noiteboa.goal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "sleep_goals")
public class SleepGoal {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "target_minutes", nullable = false)
    private Integer targetMinutes;

    private LocalTime bedtime;

    @Column(name = "wake_time")
    private LocalTime wakeTime;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected SleepGoal() {
    }

    public SleepGoal(UUID userId, Integer targetMinutes, LocalTime bedtime, LocalTime wakeTime) {
        this.userId = userId;
        this.targetMinutes = targetMinutes;
        this.bedtime = bedtime;
        this.wakeTime = wakeTime;
        this.updatedAt = OffsetDateTime.now();
    }

    public UUID getUserId() { return userId; }
    public Integer getTargetMinutes() { return targetMinutes; }
    public LocalTime getBedtime() { return bedtime; }
    public LocalTime getWakeTime() { return wakeTime; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }

    public void update(Integer targetMinutes, LocalTime bedtime, LocalTime wakeTime) {
        this.targetMinutes = targetMinutes;
        this.bedtime = bedtime;
        this.wakeTime = wakeTime;
        this.updatedAt = OffsetDateTime.now();
    }
}
