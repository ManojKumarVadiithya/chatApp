package com.mmchat.dto;

// import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
// import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {

    private String id;
    private String conversationId;
    private String senderId;
    private String senderName;
    private String content;
    private String messageType;
    private String fileUrl;
    private String fileName;

    // @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Instant createdAt;

    private boolean isRead;

    // @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Instant readAt;
}
