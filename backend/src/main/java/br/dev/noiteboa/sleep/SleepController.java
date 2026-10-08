package br.dev.noiteboa.sleep;

import br.dev.noiteboa.sleep.dto.CreateSleepLogRequest;
import br.dev.noiteboa.sleep.dto.SleepLogResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SleepController {

    private final SleepService sleepService;

    public SleepController(SleepService sleepService) {
        this.sleepService = sleepService;
    }

    @PostMapping("/api/sleep-logs")
    public ResponseEntity<SleepLogResponse> create(Authentication authentication, @Valid @RequestBody CreateSleepLogRequest request) {
        String email = (String) authentication.getPrincipal();
        SleepLogResponse response = sleepService.create(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @org.springframework.web.bind.annotation.GetMapping("/api/sleep-logs")
    public ResponseEntity<org.springframework.data.domain.Page<SleepLogResponse>> list(
            Authentication authentication,
            @org.springframework.web.bind.annotation.RequestParam(required = false) java.time.OffsetDateTime from,
            @org.springframework.web.bind.annotation.RequestParam(required = false) java.time.OffsetDateTime to,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "20") int size) {
        String email = (String) authentication.getPrincipal();
        int cappedSize = Math.min(size, 100);
        var result = sleepService.list(email, from, to, page, cappedSize);
        return ResponseEntity.ok(result);
    }
}
