package com.mmchat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for authentication response (after login)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String userId;
    private String username;
    private String email;
    private String displayName;
    private String message;
    private Long tokenExpiration;  // Expiration time in milliseconds (epoch time)
    private Long refreshTokenExpiration;  // Refresh token expiration in milliseconds (epoch time)
}
