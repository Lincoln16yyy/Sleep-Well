package br.dev.noiteboa;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.dev.noiteboa.auth.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class DeleteAccountTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;
    @Autowired br.dev.noiteboa.sleep.SleepLogRepository sleepLogRepository;

    @AfterEach
    void cleanup() {
        sleepLogRepository.deleteAll();
        userRepository.findAll().stream().filter(u -> u.getEmail().endsWith("@example.com")).forEach(userRepository::delete);
    }

    private String token(String email) throws Exception {
        String register = "{\"displayName\":\"Lincoln\",\"email\":\"" + email + "\",\"password\":\"segredo123\"}";
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(register));
        String login = "{\"email\":\"" + email + "\",\"password\":\"segredo123\"}";
        MvcResult res = mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(login))
            .andExpect(status().isOk()).andReturn();
        String json = res.getResponse().getContentAsString();
        return com.fasterxml.jackson.databind.json.JsonMapper.builder().build().readTree(json).get("accessToken").asText();
    }

    @Test
    void deletingAccountRemovesDataAndTokenStops() throws Exception {
        String token = token("excluir@example.com");
        String body = "{\"sleepStart\":\"2026-10-01T22:00:00Z\",\"sleepEnd\":\"2026-10-02T06:00:00Z\",\"quality\":4}";
        mockMvc.perform(post("/api/sleep-logs").header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON).content(body))
            .andExpect(status().isCreated());

        mockMvc.perform(delete("/api/me").header("Authorization", "Bearer " + token))
            .andExpect(status().isNoContent());

        Assertions.assertTrue(userRepository.findAll().stream().noneMatch(u -> u.getEmail().equals("excluir@example.com")));
        Assertions.assertTrue(sleepLogRepository.findAll().isEmpty());

        mockMvc.perform(get("/api/me").header("Authorization", "Bearer " + token))
            .andExpect(status().isUnauthorized());
    }
}
