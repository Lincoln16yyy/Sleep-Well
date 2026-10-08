package br.dev.noiteboa.goal.dto;

import java.time.LocalTime;

public class GoalResponse {
    private final int targetMinutes;
    private final LocalTime bedtime;
    private final LocalTime wakeTime;

    public GoalResponse(int targetMinutes, LocalTime bedtime, LocalTime wakeTime) {
        this.targetMinutes = targetMinutes;
        this.bedtime = bedtime;
        this.wakeTime = wakeTime;
    }

    public int getTargetMinutes() { return targetMinutes; }
    public LocalTime getBedtime() { return bedtime; }
    public LocalTime getWakeTime() { return wakeTime; }
}
