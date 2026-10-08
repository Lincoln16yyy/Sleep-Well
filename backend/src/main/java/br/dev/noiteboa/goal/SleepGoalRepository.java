package br.dev.noiteboa.goal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SleepGoalRepository extends JpaRepository<SleepGoal, UUID> {
}
