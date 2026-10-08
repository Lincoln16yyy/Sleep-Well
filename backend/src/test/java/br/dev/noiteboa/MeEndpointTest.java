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
class MeEndpointTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    UserRepository userRepository;

    @AfterEach
    void cleanup() {
        userRepository.findAll().stream()
            .filter(u -> u.getEmail().endsWith("@example.com"))
            .forEach(userRepository::delete);
    }

    private String loginToken(String email) throws Exception {
        String register = "{\"displayName\":\"Lincoln\",\"email\":\"" + email + "\",\"password\":\"segredo123\"}";
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(register));
        String login = "{\"email\":\"" + email + "\",\"password\":\"segredo123\"}";
        MvcResult res = mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(login))
            .andExpect(status().isOk())
            .andReturn();
        String json = res.getResponse().getContentAsString();
        return com.fasterxml.jackson.databind.json.JsonMapper.builder().build()
            .readTree(json).get("accessToken").asText();
    }

    @Test
    void noTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void validTokenReturnsUser() throws Exception {
        String token = loginToken("me@example.com");
        mockMvc.perform(get("/api/me").header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("me@example.com"))
            .andExpect(jsonPath("$.displayName").value("Lincoln"))
            .andExpect(jsonPath("$.timezone").value("America/Sao_Paulo"));
    }

    @Test
    void tamperedTokenReturns401() throws Exception {
        String token = loginToken("me2@example.com");
        String tampered = token.substring(0, token.length() - 2) + "xx";
        mockMvc.perform(get("/api/me").header("Authorization", "Bearer " + tampered))
            .andExpect(status().isUnauthorized());
    }
}
