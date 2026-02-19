package com.mmchat.controller;

import com.mmchat.dto.AuthResponse;
import com.mmchat.dto.LoginRequest;
import com.mmchat.dto.RegisterRequest;
import com.mmchat.dto.UserDTO;
import com.mmchat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Authentication Controller
 * Handles user registration, login, and profile endpoints
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    /**
     * POST /api/auth/register
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = userService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, null, null, null, null, e.getMessage(), null, null));
        }
    }
    
    /**
     * POST /api/auth/login
     * Login user with email and password
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, null, null, null, null, e.getMessage(), null, null));
        }
    }
    
    /**
     * POST /api/auth/logout
     * Logout user (set offline)
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestParam String userId) {
        try {
            userService.logout(userId);
            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * POST /api/auth/refresh
     * Refresh JWT token using refresh token
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestParam String userId, @RequestParam String refreshToken) {
        try {
            AuthResponse response = userService.refreshToken(userId, refreshToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, null, null, null, null, e.getMessage(), null, null));
        }
    }
}
