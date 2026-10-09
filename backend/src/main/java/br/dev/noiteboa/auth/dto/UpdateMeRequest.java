package br.dev.noiteboa.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateMeRequest {

    /** Identificador IANA, ex.: America/Sao_Paulo (validado com ZoneId no controller). */
    @NotBlank
    @Size(max = 64)
    private String timezone;

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
}
