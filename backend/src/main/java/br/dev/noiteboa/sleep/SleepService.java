package br.dev.noiteboa.sleep;

import br.dev.noiteboa.auth.User;
import br.dev.noiteboa.auth.UserRepository;
import br.dev.noiteboa.sleep.dto.CreateSleepLogRequest;
import br.dev.noiteboa.sleep.dto.SleepLogResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.UUID;

@Service
public class SleepService {

    private final SleepLogRepository sleepLogRepository;
    private final UserRepository userRepository;

    public SleepService(SleepLogRepository sleepLogRepository, UserRepository userRepository) {
        this.sleepLogRepository = sleepLogRepository;
        this.userRepository = userRepository;
    }

    public SleepLogResponse create(String email, CreateSleepLogRequest request) {
        if (request.getSleepEnd().isBefore(request.getSleepStart()) || request.getSleepEnd().isEqual(request.getSleepStart())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fim deve ser após o início");
        }
        Duration duration = Duration.between(request.getSleepStart(), request.getSleepEnd());
        if (duration.toHours() > 24) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duração máxima é 24h");
        }
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        SleepLog log = new SleepLog(UUID.randomUUID(), user, request.getSleepStart(), request.getSleepEnd(), request.getQuality(), request.getNotes());
        sleepLogRepository.save(log);
        return new SleepLogResponse(log.getId(), log.getSleepStart(), log.getSleepEnd(), log.getQuality(), log.getNotes());
    }
}
