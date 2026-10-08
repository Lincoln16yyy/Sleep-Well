package br.dev.noiteboa.goal.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public class GoalRequest {

    @NotNull
    @Min(240)
    @Max(720)
    private Integer targetMinutes;

    private LocalTime bedtime;
    private LocalTime wakeTime;

    public Integer getTargetMinutes() { return targetMinutes; }
    public void setTargetMinutes(Integer targetMinutes) { this.targetMinutes = targetMinutes; }
    public LocalTime getBedtime() { return bedtime; }
    public void setBedtime(LocalTime bedtime) { this.bedtime = bedtime; }
    public LocalTime getWakeTime() { return wakeTime; }
    public void setWakeTime(LocalTime wakeTime) { this.wakeTime = wakeTime; }
}
