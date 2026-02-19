package com.mmchat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/**
 * Message model represents a message sent between users
 * Supports both one-to-one and group messages
 */
@Document(collection = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    private String id;
    
    private String conversationId; // Links to Conversation
    private String senderId; // User ID of sender
    private String senderName; // Cached sender name for quick display
    private String content;
    
    private String messageType; // text, image, video, file
    private String fileUrl; // URL for media files
    private String fileName; // Original filename
    private long fileSize; // Size in bytes
    private String mimeType; // MIME type of file
    
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime updatedAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime readAt;

    
    private boolean isRead; // Read status
    
    
    private boolean isDeleted; // Soft delete
    
    public Message(String conversationId, String senderId, String senderName, String content) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.messageType = "text";
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
        this.isDeleted = false;
    }
}
