package br.dev.noiteboa;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.dev.noiteboa.auth.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class StatsSummaryTest {

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

    private void create(String token, String start, String end, int quality) throws Exception {
        String body = "{\"sleepStart\":\"" + start + "\",\"sleepEnd\":\"" + end + "\",\"quality\":" + quality + "}";
        mockMvc.perform(post("/api/sleep-logs").header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON).content(body))
            .andExpect(status().isCreated());
    }

    @Test
    void summaryIsOkAndReturnsDailySeries() throws Exception {
        String token = token("stats@example.com");
        create(token, "2026-10-06T22:00:00Z", "2026-10-07T06:00:00Z", 4);
        create(token, "2026-10-07T22:00:00Z", "2026-10-08T06:00:00Z", 5);

        mockMvc.perform(get("/api/stats/summary?days=7").header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.days").value(7))
            .andExpect(jsonPath("$.averageHours").value(8.0))
            .andExpect(jsonPath("$.daily").isArray());
    }

    @Test
    void daysMustBe7Or30() throws Exception {
        String token = token("stats2@example.com");
        mockMvc.perform(get("/api/stats/summary?days=15").header("Authorization", "Bearer " + token))
            .andExpect(status().isBadRequest());
    }

    @Test
    void noDataReturnsZeroedSummary() throws Exception {
        String token = token("stats3@example.com");
        mockMvc.perform(get("/api/stats/summary?days=30").header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.averageHours").value(0.0))
            .andExpect(jsonPath("$.sleepDebtMinutes").value(3360));
    }
}
