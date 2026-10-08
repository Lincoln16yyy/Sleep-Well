package br.dev.noiteboa.sleep.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

public class CreateSleepLogRequest {

    @NotNull
    private OffsetDateTime sleepStart;

    @NotNull
    private OffsetDateTime sleepEnd;

    @NotNull
    @Min(1)
    @Max(5)
    private Short quality;

    @Size(max = 2000)
    private String notes;

    public OffsetDateTime getSleepStart() { return sleepStart; }
    public void setSleepStart(OffsetDateTime sleepStart) { this.sleepStart = sleepStart; }
    public OffsetDateTime getSleepEnd() { return sleepEnd; }
    public void setSleepEnd(OffsetDateTime sleepEnd) { this.sleepEnd = sleepEnd; }
    public Short getQuality() { return quality; }
    public void setQuality(Short quality) { this.quality = quality; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
