package com.mmchat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
// import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for conversation (for listing and details)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private String id;
    private String name;
    private String type; // direct, group
    private List<String> participantIds;
    private Instant createdAt;
    private Instant lastMessageAt;
    private String lastMessageContent;
    private String lastMessageSenderName;
}
