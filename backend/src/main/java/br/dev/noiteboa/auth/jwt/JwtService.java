package br.dev.noiteboa.auth.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtService {

    private final SecretKey key;
    private final long expirationSeconds;

    public JwtService(@Value("${JWT_SECRET:dev-only-secret-change-me-in-production-0123456789abcdef}") String secret,
                      @Value("${JWT_EXPIRATION_SECONDS:3600}") long expirationSeconds) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(String email) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
            .subject(email)
            .issuedAt(new Date(now))
            .expiration(new Date(now + expirationSeconds * 1000))
            .signWith(key)
            .compact();
    }

    public long getExpirationSeconds() {
        return expirationSeconds;
    }

    public String parseEmail(String token) {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }
}
