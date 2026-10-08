package br.dev.noiteboa.auth.dto;

import java.util.UUID;

public class RegisterResponse {

    private final UUID id;
    private final String email;
    private final String displayName;

    public RegisterResponse(UUID id, String email, String displayName) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getDisplayName() {
        return displayName;
    }
}
