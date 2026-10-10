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

    /**
     * Segredo apenas para desenvolvimento. Quando JWT_SECRET_REQUIRED=true
     * (perfil prod), este valor — ou ausência/branco de JWT_SECRET — derruba a
     * inicialização em vez de assinar tokens silenciosamente com ele.
     */
    public static final String DEV_ONLY_SECRET = "dev-only-secret-change-me-in-production-0123456789abcdef";

    private final SecretKey key;
    private final long expirationSeconds;

    public JwtService(@Value("${JWT_SECRET:" + DEV_ONLY_SECRET + "}") String secret,
                      @Value("${JWT_EXPIRATION_SECONDS:3600}") long expirationSeconds,
                      @Value("${JWT_SECRET_REQUIRED:false}") boolean jwtSecretRequired) {
        if (jwtSecretRequired && (secret == null || secret.isBlank() || DEV_ONLY_SECRET.equals(secret))) {
            throw new IllegalStateException(
                "JWT_SECRET não configurada (perfil prod): defina a variável de ambiente JWT_SECRET "
                + "no serviço da Render. O segredo de desenvolvimento não é aceito em produção.");
        }
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
