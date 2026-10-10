package br.dev.noiteboa.friends;

/** Estados de uma amizade. `blocked` fica reservado para bloqueio (issue futura). */
public enum FriendshipStatus {
    PENDING,
    ACCEPTED,
    DECLINED,
    BLOCKED
}
