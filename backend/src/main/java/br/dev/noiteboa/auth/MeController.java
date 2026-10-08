package br.dev.noiteboa.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MeController {

    private final UserRepository userRepository;

    public MeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/api/me")
    public ResponseEntity<?> me(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        var user = userRepository.findByEmailIgnoreCase(email).orElseThrow();
        return ResponseEntity.ok(new MeResponse(user.getId(), user.getEmail(), user.getDisplayName(), user.getTimezone()));
    }

    record MeResponse(java.util.UUID id, String email, String displayName, String timezone) {}
}
