package com.mmchat.service;

import com.mmchat.dto.ConversationDTO;
import com.mmchat.dto.MessageDTO;
import com.mmchat.model.Conversation;
import com.mmchat.model.Message;
import com.mmchat.model.User;
import com.mmchat.repository.ConversationRepository;
import com.mmchat.repository.MessageRepository;
import com.mmchat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
// import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Message Service
 * Handles message-related business logic including sending, retrieving, and managing messages
 */
@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private ConversationRepository conversationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Send a message in a conversation
     */
    public MessageDTO sendMessage(String conversationId, String senderId, String content) throws Exception {
        // Verify conversation exists and user is participant
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new Exception("Conversation not found"));
        
        if (!conversation.getParticipantIds().contains(senderId)) {
            throw new Exception("User is not a participant of this conversation");
        }
        
        // Get sender info
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new Exception("Sender not found"));
        
        // Create message
        Message message = new Message(conversationId, senderId, sender.getDisplayName(), content);
        message = messageRepository.save(message);
        
        // Update conversation's last message
        conversation.setLastMessageAt(Instant.now());
        conversation.setLastMessageId(message.getId());
        conversation.setLastMessageContent(content);
        conversationRepository.save(conversation);
        
        return convertToDTO(message);
    }
    
    /**
     * Get message history for a conversation (paginated)
     */
    public List<MessageDTO> getMessageHistory(String conversationId, int page, int size) throws Exception {
        // Verify conversation exists
        conversationRepository.findById(conversationId)
                .orElseThrow(() -> new Exception("Conversation not found"));
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Message> messagesPage = messageRepository.findByConversationIdAndIsDeletedFalse(conversationId, pageable);
        
        return messagesPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Mark message as read
     */
    public void markMessageAsRead(String messageId, String userId) throws Exception {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new Exception("Message not found"));
        
        if (!message.isRead()) {
            message.setRead(true);
            message.setReadAt(Instant.now());
            messageRepository.save(message);
        }
    }
    
    /**
     * Mark all messages in conversation as read for a user
     */
    public void markConversationAsRead(String conversationId, String userId) throws Exception {
        // Verify user is participant
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new Exception("Conversation not found"));
        
        if (!conversation.getParticipantIds().contains(userId)) {
            throw new Exception("User is not a participant of this conversation");
        }
        
        List<Message> unreadMessages = messageRepository.findByConversationIdAndIsDeletedFalse(conversationId)
                .stream()
                .filter(m -> !m.isRead() && !m.getSenderId().equals(userId))
                .collect(Collectors.toList());
        
        for (Message message : unreadMessages) {
            message.setRead(true);
            message.setReadAt(Instant.now());
            messageRepository.save(message);
        }
    }
    
    /**
     * Get unread message count for a conversation
     */
    public long getUnreadMessageCount(String conversationId, String userId) {
        return messageRepository.countByConversationIdAndIsReadFalseAndSenderIdNot(conversationId, userId);
    }
    
    /**
     * Delete message (soft delete)
     */
    public void deleteMessage(String messageId, String userId) throws Exception {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new Exception("Message not found"));
        
        if (!message.getSenderId().equals(userId)) {
            throw new Exception("You can only delete your own messages");
        }
        
        message.setDeleted(true);
        message.setUpdatedAt(Instant.now());
        messageRepository.save(message);
    }
    
    /**
     * Convert Message to MessageDTO
     */
    private MessageDTO convertToDTO(Message message) {
        return new MessageDTO(
                message.getId(),
                message.getConversationId(),
                message.getSenderId(),
                message.getSenderName(),
                message.getContent(),
                message.getMessageType(),
                message.getFileUrl(),
                message.getFileName(),
                message.getCreatedAt(),
                message.isRead(),
                message.getReadAt()
        );
    }
}
