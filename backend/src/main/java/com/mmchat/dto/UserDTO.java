package com.mmchat.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
// import java.time.LocalDateTime;

/**
 * DTO for user profile (public information)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String displayName;
    private String profileImage;
    private String bio;
    private String status; // online, offline, away
    private Instant lastSeen;
}
