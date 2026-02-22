package com.mmchat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
// import java.time.LocalDateTime;
// import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Conversation model represents a one-to-one or group chat
 * Maintains list of participants and metadata
 */
@Document(collection = "conversations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {
    @Id
    private String id;
    
    private String name; // For group chats; for 1-to-1, derived from other user's name
    private String type; // "direct" for 1-to-1, "group" for groups
    private List<String> participantIds; // List of user IDs
    private String createdById;
    
    private Instant createdAt;
    private Instant updatedAt;
    private Instant lastMessageAt;
    
    private String lastMessageId;
    private String lastMessageContent; // Preview
    
    private boolean isActive;
    
    // For one-to-one conversations
    public Conversation(String userId1, String userId2) {
        this.type = "direct";
        this.participantIds = new ArrayList<>();  // Changed from List.of() to new ArrayList<>()
        this.participantIds.add(userId1);
        this.participantIds.add(userId2);
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.isActive = true;
    }
}
