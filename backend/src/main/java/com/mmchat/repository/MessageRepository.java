package com.mmchat.repository;

import com.mmchat.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Message entity
 * Handles database operations for messages
 * Supports pagination for loading message history
 */
@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    Page<Message> findByConversationIdAndIsDeletedFalse(String conversationId, Pageable pageable);
    List<Message> findByConversationIdAndIsDeletedFalse(String conversationId);
    long countByConversationIdAndIsReadFalseAndSenderIdNot(String conversationId, String userId);
}
