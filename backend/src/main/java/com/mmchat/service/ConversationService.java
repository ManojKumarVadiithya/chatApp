package com.mmchat.service;

import com.mmchat.dto.ConversationDTO;
import com.mmchat.model.Conversation;
// import com.mmchat.model.User;
import com.mmchat.repository.ConversationRepository;
import com.mmchat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Conversation Service
 * Handles conversation management including creating and retrieving conversations
 */
@Service
public class ConversationService {
    
    @Autowired
    private ConversationRepository conversationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get or create a direct conversation between two users
     */
    public Conversation getOrCreateDirectConversation(String userId1, String userId2) throws Exception {
        // Verify both users exist
        userRepository.findById(userId1).orElseThrow(() -> new Exception("User 1 not found"));
        userRepository.findById(userId2).orElseThrow(() -> new Exception("User 2 not found"));
        
        // Check if conversation already exists
        java.util.Optional<Conversation> existingConversation = 
                conversationRepository.findDirectConversation(userId1, userId2);
        
        if (existingConversation.isPresent()) {
            return existingConversation.get();
        }
        
        // Create new direct conversation
        Conversation conversation = new Conversation(userId1, userId2);
        return conversationRepository.save(conversation);
    }
    
    /**
     * Get all conversations for a user
     */
    public List<ConversationDTO> getUserConversations(String userId) {
        List<Conversation> conversations = conversationRepository.findByParticipantId(userId);
        
        return conversations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get conversation by ID
     */
    public Conversation getConversation(String conversationId) throws Exception {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new Exception("Conversation not found"));
    }
    
    /**
     * Convert Conversation to ConversationDTO
     */
    private ConversationDTO convertToDTO(Conversation conversation) {
        return new ConversationDTO(
                conversation.getId(),
                conversation.getName(),
                conversation.getType(),
                conversation.getParticipantIds(),
                conversation.getCreatedAt(),
                conversation.getLastMessageAt(),
                conversation.getLastMessageContent(),
                "" // Will be populated from message sender name
        );
    }
}
