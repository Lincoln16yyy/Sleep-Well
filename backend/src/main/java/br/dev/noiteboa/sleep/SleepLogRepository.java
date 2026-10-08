package br.dev.noiteboa.sleep;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SleepLogRepository extends JpaRepository<SleepLog, UUID> {
}
