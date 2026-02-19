package com.mmchat.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * WebSocket message model for real-time communication
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String type; // message, typing, read_receipt, status_update
    private String conversationId;
    private String senderId;
    private String senderName;
    private String content;
    private String messageId; // For read receipts
    private LocalDateTime timestamp;
    
    public ChatMessage(String type, String conversationId, String senderId, String senderName, String content) {
        this.type = type;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }
}
