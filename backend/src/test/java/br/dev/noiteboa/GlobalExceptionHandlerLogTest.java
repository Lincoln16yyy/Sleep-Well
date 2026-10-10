package br.dev.noiteboa;

import br.dev.noiteboa.common.GlobalExceptionHandler;
import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.ThrowableProxy;
import ch.qos.logback.core.read.ListAppender;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Issue #84: toda resposta 500 precisa deixar a stack completa nos logs.
 * Sem isso, um 500 intermitente (ex.: GET /stats/summary em produção) é
 * indeterminável a partir do dashboard, pois o corpo vira "Erro interno".
 */
class GlobalExceptionHandlerLogTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();
    private Logger logger;
    private ListAppender<ILoggingEvent> captured;

    @BeforeEach
    void attachAppender() {
        logger = (Logger) LoggerFactory.getLogger(GlobalExceptionHandler.class);
        captured = new ListAppender<>();
        captured.start();
        logger.addAppender(captured);
    }

    @AfterEach
    void detachAppender() {
        logger.detachAppender(captured);
    }

    @Test
    void erroInesperadoRegistraStackComRotaEDevolve500Generico() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/stats/summary");
        IllegalStateException causa = new IllegalStateException("falha simulada no stats");

        ResponseEntity<org.springframework.http.ProblemDetail> response =
                handler.handleUnexpected(causa, request);

        // o contrato da resposta não muda: 500 genérico, sem vazar detalhes
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getDetail()).isEqualTo("Erro interno");

        // exatamente um evento ERROR, com método e rota para localizar a origem
        assertThat(captured.list).hasSize(1);
        ILoggingEvent evento = captured.list.get(0);
        assertThat(evento.getLevel()).isEqualTo(Level.ERROR);
        assertThat(evento.getFormattedMessage()).contains("GET").contains("/api/stats/summary");

        // a exceção original fica preservada: classe, mensagem e frames = stack completa
        assertThat(evento.getThrowableProxy()).isNotNull();
        assertThat(evento.getThrowableProxy().getClassName())
                .isEqualTo(IllegalStateException.class.getName());
        assertThat(evento.getThrowableProxy().getMessage()).isEqualTo("falha simulada no stats");
        assertThat(((ThrowableProxy) evento.getThrowableProxy()).getStackTraceElementProxyArray())
                .isNotEmpty();
    }
}
