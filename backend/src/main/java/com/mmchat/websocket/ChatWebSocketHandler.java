package com.mmchat.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mmchat.model.Conversation;
import com.mmchat.service.ConversationService;
import com.mmchat.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    // Active user sessions (userId -> session)
    private static final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    @Autowired
    private MessageService messageService;

    @Autowired
    private ConversationService conversationService;

    private final ObjectMapper objectMapper;

    public ChatWebSocketHandler() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    /**
     * When WebSocket connection is established
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {

        String userId = extractUserIdFromSession(session);

        if (userId == null) {
            try {
                session.close(CloseStatus.NOT_ACCEPTABLE);
            } catch (Exception ignored) {}
            return;
        }

        userSessions.put(userId, session);

        // 1️⃣ Send currently online users to the newly connected user
        sendCurrentOnlineUsers(session);

        // 2️⃣ Broadcast that this user is now online
        broadcastOnlineStatus(userId, "online");
    }

    private void sendCurrentOnlineUsers(WebSocketSession session) {

        try {
            for (String onlineUserId : userSessions.keySet()) {

                Map<String, String> statusUpdate = new HashMap<>();
                statusUpdate.put("type", "status_update");
                statusUpdate.put("userId", onlineUserId);
                statusUpdate.put("status", "online");

                String payload = objectMapper.writeValueAsString(statusUpdate);
                session.sendMessage(new TextMessage(payload));
            }

        } catch (Exception e) {
            System.err.println("Error sending current online users: " + e.getMessage());
        }
    }

    /**
     * Handle incoming messages
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {

        String userId = extractUserIdFromSession(session);

        if (userId == null) {
            try {
                session.close(CloseStatus.NOT_ACCEPTABLE);
            } catch (Exception ignored) {}
            return;
        }

        try {
            ChatMessage chatMessage =
                    objectMapper.readValue(message.getPayload(), ChatMessage.class);

            switch (chatMessage.getType()) {
                case "message":
                    handleChatMessage(chatMessage, userId);
                    break;

                case "typing":
                    handleTypingIndicator(chatMessage);
                    break;

                case "read_receipt":
                    handleReadReceipt(chatMessage, userId);
                    break;

                default:
                    System.out.println("Unknown message type: " + chatMessage.getType());
            }

        } catch (Exception e) {
            System.err.println("Error handling WS message: " + e.getMessage());
        }
    }

    /**
     * When WebSocket closes
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {

        String userId = extractUserIdFromSession(session);

        if (userId != null) {
            userSessions.remove(userId);
            broadcastOnlineStatus(userId, "offline");
        }
    }

    /**
     * Handle chat message
     */
    private void handleChatMessage(ChatMessage message, String userId) {

        try {
            var savedMessage = messageService.sendMessage(
                    message.getConversationId(),
                    userId,
                    message.getContent()
            );

            Map<String, Object> broadcastMessage = new HashMap<>();
            broadcastMessage.put("type", "message");
            broadcastMessage.put("id", savedMessage.getId());
            broadcastMessage.put("conversationId", savedMessage.getConversationId());
            broadcastMessage.put("senderId", savedMessage.getSenderId());
            broadcastMessage.put("senderName", savedMessage.getSenderName());
            broadcastMessage.put("content", savedMessage.getContent());
            broadcastMessage.put("createdAt", savedMessage.getCreatedAt());
            broadcastMessage.put("isRead", savedMessage.isRead());

            broadcastToConversation(message.getConversationId(), broadcastMessage);

        } catch (Exception e) {
            System.err.println("Error handling chat message: " + e.getMessage());
        }
    }

    /**
     * Handle typing indicator
     */
    private void handleTypingIndicator(ChatMessage message) {
        broadcastToConversation(message.getConversationId(), message);
    }

    /**
     * Handle read receipt
     */
    private void handleReadReceipt(ChatMessage message, String userId) {
        try {
            messageService.markMessageAsRead(message.getMessageId(), userId);
            broadcastToConversation(message.getConversationId(), message);
        } catch (Exception e) {
            System.err.println("Error handling read receipt: " + e.getMessage());
        }
    }

    /**
     * Broadcast message to all participants of a conversation
     */
    private void broadcastToConversation(String conversationId, Object data) {

        try {
            String payload = objectMapper.writeValueAsString(data);

            Conversation conversation =
                    conversationService.getConversation(conversationId);

            for (String participantId : conversation.getParticipantIds()) {

                WebSocketSession session = userSessions.get(participantId);

                if (session != null && session.isOpen()) {
                    session.sendMessage(new TextMessage(payload));
                }
            }

        } catch (Exception e) {
            System.err.println("Error broadcasting message: " + e.getMessage());
        }
    }

    /**
     * Broadcast online/offline status
     */
    private void broadcastOnlineStatus(String userId, String status) {

        Map<String, String> statusUpdate = new HashMap<>();
        statusUpdate.put("type", "status_update");
        statusUpdate.put("userId", userId);
        statusUpdate.put("status", status);

        try {
            String payload = objectMapper.writeValueAsString(statusUpdate);

            for (WebSocketSession session : userSessions.values()) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(payload));
                }
            }

        } catch (Exception e) {
            System.err.println("Error sending status update: " + e.getMessage());
        }
    }

    /**
     * Extract userId from session attributes
     */
    private String extractUserIdFromSession(WebSocketSession session) {
        Object userId = session.getAttributes().get("userId");
        return userId != null ? userId.toString() : null;
    }
}
