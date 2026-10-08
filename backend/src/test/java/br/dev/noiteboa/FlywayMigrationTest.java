package br.dev.noiteboa;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;

/**
 * Valida que a migração Flyway roda em um banco limpo.
 * Requer um Postgres acessível (ver docker-compose.yml).
 */
class FlywayMigrationTest {

    private static final String ADMIN_URL =
        "jdbc:postgresql://localhost:5432/sono?user=sono&password=sono_dev_only";
    private static final String SCHEMA = "flyway_test";

    @Test
    void migrationV1AppliesOnCleanDatabase() throws SQLException {
        try (Connection c = DriverManager.getConnection(ADMIN_URL);
             Statement s = c.createStatement()) {
            s.execute("DROP SCHEMA IF EXISTS " + SCHEMA + " CASCADE");
            s.execute("CREATE SCHEMA " + SCHEMA);
        }

        Flyway flyway = Flyway.configure()
            .dataSource("jdbc:postgresql://localhost:5432/sono?user=sono&password=sono_dev_only"
                , "sono", "sono_dev_only")
            .schemas(SCHEMA)
            .load();
        flyway.migrate();

        assertEquals("3", flyway.info().current().getVersion().toString());

        try (Connection c = DriverManager.getConnection(
                "jdbc:postgresql://localhost:5432/sono?user=sono&password=sono_dev_only", "sono", "sono_dev_only");
             Statement s = c.createStatement()) {
            s.execute("SET search_path TO " + SCHEMA);
            s.execute("INSERT INTO users (email, password_hash, display_name) VALUES ('a@b.com','x','A')");
            try {
                s.execute("INSERT INTO users (email, password_hash, display_name) VALUES ('A@B.com','x','B')");
                throw new AssertionError("esperava violação de email único case-insensitive");
            } catch (SQLException expected) {
                // OK: e-mail duplicado ignorando caso deve falhar
            }

            s.execute("INSERT INTO sleep_logs (user_id, sleep_start, sleep_end, quality) " +
                      "SELECT id, '2026-10-01 22:00:00+00', '2026-10-02 06:00:00+00', 4 FROM users LIMIT 1");

            assertInsertFails(s, "INSERT INTO sleep_logs (user_id, sleep_start, sleep_end, quality) " +
                "SELECT id, '2026-10-02 06:00:00+00', '2026-10-01 22:00:00+00', 4 FROM users LIMIT 1");
            assertInsertFails(s, "INSERT INTO sleep_logs (user_id, sleep_start, sleep_end, quality) " +
                "SELECT id, '2026-10-01 22:00:00+00', '2026-10-02 06:00:00+00', 7 FROM users LIMIT 1");
        }
    }

    private void assertInsertFails(Statement s, String sql) throws SQLException {
        try {
            s.execute(sql);
            throw new AssertionError("esperava violação de constraint");
        } catch (SQLException expected) {
            // OK
        }
    }
}
