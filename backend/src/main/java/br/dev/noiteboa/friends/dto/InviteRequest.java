package br.dev.noiteboa.friends.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Convite de amizade por e-mail (identificador já existente na conta). */
public record InviteRequest(
    @NotBlank @Email @Size(max = 255) String email
) {
}
