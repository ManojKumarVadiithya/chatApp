package com.mmchat.repository;

import com.mmchat.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Conversation entity
 * Handles database operations for conversations (one-to-one and groups)
 * Supports querying conversations by participants
 */
@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    // Find all conversations for a user
    @Query("{ 'participantIds': ?0, 'isActive': true }")
    List<Conversation> findByParticipantId(String userId);
    
    // Find direct conversation between two users
    @Query("{ 'type': 'direct', 'participantIds': { $all: [?0, ?1] }, 'isActive': true }")
    Optional<Conversation> findDirectConversation(String userId1, String userId2);
}
