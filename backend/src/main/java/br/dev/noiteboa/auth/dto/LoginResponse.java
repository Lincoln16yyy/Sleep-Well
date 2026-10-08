package br.dev.noiteboa.auth.dto;

public class LoginResponse {

    private final String accessToken;
    private final long expiresInSeconds;

    public LoginResponse(String accessToken, long expiresInSeconds) {
        this.accessToken = accessToken;
        this.expiresInSeconds = expiresInSeconds;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public long getExpiresInSeconds() {
        return expiresInSeconds;
    }
}
