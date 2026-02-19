package com.mmchat.controller;

import com.mmchat.dto.ConversationDTO;
import com.mmchat.dto.MessageDTO;
import com.mmchat.service.ConversationService;
import com.mmchat.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * Message Controller
 * Handles message and conversation endpoints
 */
@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private ConversationService conversationService;
    
    /**
     * GET /api/messages/conversations/{userId}
     * Get all conversations for a user
     */
    @GetMapping("/conversations/{userId}")
    public ResponseEntity<List<ConversationDTO>> getUserConversations(@PathVariable String userId) {
        try {
            List<ConversationDTO> conversations = conversationService.getUserConversations(userId);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * POST /api/messages/conversation
     * Get or create a direct conversation
     */
    @PostMapping("/conversation")
    public ResponseEntity<?> getOrCreateConversation(
            @RequestParam String userId1,
            @RequestParam String userId2) {
        try {
            var conversation = conversationService.getOrCreateDirectConversation(userId1, userId2);
            return ResponseEntity.ok(conversation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * GET /api/messages/history/{conversationId}
     * Get message history for a conversation
     */
    @GetMapping("/history/{conversationId}")
    public ResponseEntity<List<MessageDTO>> getMessageHistory(
            @PathVariable String conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            List<MessageDTO> messages = messageService.getMessageHistory(conversationId, page, size);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * PUT /api/messages/read/{messageId}
     * Mark message as read
     */
    @PutMapping("/read/{messageId}")
    public ResponseEntity<String> markMessageAsRead(
            @PathVariable String messageId,
            @RequestParam String userId) {
        try {
            messageService.markMessageAsRead(messageId, userId);
            return ResponseEntity.ok("Message marked as read");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * DELETE /api/messages/{messageId}
     * Delete a message (soft delete)
     */
    @DeleteMapping("/{messageId}")
    public ResponseEntity<String> deleteMessage(
            @PathVariable String messageId,
            @RequestParam String userId) {
        try {
            messageService.deleteMessage(messageId, userId);
            return ResponseEntity.ok("Message deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
