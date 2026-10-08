package br.dev.noiteboa.sleep.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class SleepLogResponse {
    private final UUID id;
    private final OffsetDateTime sleepStart;
    private final OffsetDateTime sleepEnd;
    private final Short quality;
    private final String notes;

    public SleepLogResponse(UUID id, OffsetDateTime sleepStart, OffsetDateTime sleepEnd, Short quality, String notes) {
        this.id = id;
        this.sleepStart = sleepStart;
        this.sleepEnd = sleepEnd;
        this.quality = quality;
        this.notes = notes;
    }

    public UUID getId() { return id; }
    public OffsetDateTime getSleepStart() { return sleepStart; }
    public OffsetDateTime getSleepEnd() { return sleepEnd; }
    public Short getQuality() { return quality; }
    public String getNotes() { return notes; }
}
