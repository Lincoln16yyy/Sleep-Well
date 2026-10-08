package br.dev.noiteboa.goal;

import br.dev.noiteboa.auth.User;
import br.dev.noiteboa.auth.UserRepository;
import br.dev.noiteboa.goal.dto.GoalRequest;
import org.springframework.stereotype.Service;

@Service
public class GoalService {

    private final SleepGoalRepository sleepGoalRepository;
    private final UserRepository userRepository;

    public GoalService(SleepGoalRepository sleepGoalRepository, UserRepository userRepository) {
        this.sleepGoalRepository = sleepGoalRepository;
        this.userRepository = userRepository;
    }

    public SleepGoal getOrDefault(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED));
        return sleepGoalRepository.findById(user.getId())
            .orElseGet(() -> {
                // não persiste o default; retorna uma instância não anexada
                SleepGoal g = new SleepGoal(user.getId(), 480, null, null);
                return g;
            });
    }

    public SleepGoal upsert(String email, GoalRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED));
        SleepGoal goal = sleepGoalRepository.findById(user.getId())
            .map(existing -> {
                existing.update(request.getTargetMinutes(), request.getBedtime(), request.getWakeTime());
                return existing;
            })
            .orElseGet(() -> new SleepGoal(user.getId(), request.getTargetMinutes(), request.getBedtime(), request.getWakeTime()));
        return sleepGoalRepository.save(goal);
    }
}
