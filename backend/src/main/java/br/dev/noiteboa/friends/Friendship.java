package br.dev.noiteboa.friends;

import br.dev.noiteboa.auth.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Amizade por consentimento duplo: o requester convidou; o addressee precisa
 * aceitar. A amizade por si não expõe dado de sono — exposição depende do
 * opt-in share_with_friends do usuário que aparece no ranking.
 */
@Entity
@Table(name = "friendships")
public class Friendship {

    @Id
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(optional = false)
    @JoinColumn(name = "addressee_id", nullable = false)
    private User addressee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private FriendshipStatus status;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected Friendship() {
    }

    public Friendship(UUID id, User requester, User addressee) {
        this.id = id;
        this.requester = requester;
        this.addressee = addressee;
        this.status = FriendshipStatus.PENDING;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public User getRequester() { return requester; }
    public User getAddressee() { return addressee; }
    public FriendshipStatus getStatus() { return status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }

    public void accept() {
        this.status = FriendshipStatus.ACCEPTED;
        this.updatedAt = OffsetDateTime.now();
    }

    public void decline() {
        this.status = FriendshipStatus.DECLINED;
        this.updatedAt = OffsetDateTime.now();
    }

    /** Reconvite após recusa: o pedido volta para a fila de espera. */
    public void resend() {
        this.status = FriendshipStatus.PENDING;
        this.updatedAt = OffsetDateTime.now();
    }
}
