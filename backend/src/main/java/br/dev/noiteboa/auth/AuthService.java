package br.dev.noiteboa.auth;

import br.dev.noiteboa.auth.dto.RegisterRequest;
import br.dev.noiteboa.auth.dto.RegisterResponse;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateEmailException();
        }
        String hash = passwordEncoder.encode(request.getPassword());
        User user = new User(UUID.randomUUID(), request.getEmail(), hash, request.getDisplayName(), OffsetDateTime.now());
        try {
            userRepository.save(user);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // índice único case-insensitive do banco bloqueia corrida de e-mails simultâneos
            throw new DuplicateEmailException();
        }
        return new RegisterResponse(user.getId(), user.getEmail(), user.getDisplayName());
    }
}
