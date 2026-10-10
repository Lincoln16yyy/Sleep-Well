package br.dev.noiteboa.friends;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {

    Optional<Friendship> findByRequesterIdAndAddresseeId(UUID requesterId, UUID addresseeId);

    List<Friendship> findByRequesterIdAndStatus(UUID requesterId, FriendshipStatus status);

    List<Friendship> findByAddresseeIdAndStatus(UUID addresseeId, FriendshipStatus status);

    /** Amizades de um usuário nos dois sentidos do par (requester/addressee), com a linha completa. */
    @Query("SELECT f FROM Friendship f "
         + "WHERE f.status = :status AND (f.requester.id = :userId OR f.addressee.id = :userId)")
    List<Friendship> findFriendships(@Param("userId") UUID userId, @Param("status") FriendshipStatus status);
}
