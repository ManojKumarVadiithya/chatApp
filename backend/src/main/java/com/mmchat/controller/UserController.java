package com.mmchat.controller;

import com.mmchat.dto.UserDTO;
import com.mmchat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * User Controller
 * Handles user profile and contacts endpoints
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * GET /api/users/profile/{userId}
     * Get user profile information
     */
    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserDTO> getUserProfile(@PathVariable String userId) {
        try {
            UserDTO profile = userService.getUserProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * GET /api/users/all
     * Get all active users (for contacts list)
     */
    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        try {
            List<UserDTO> users = userService.getAllActiveUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * PUT /api/users/status/{userId}
     * Update user status (online/offline/away)
     */
    @PutMapping("/status/{userId}")
    public ResponseEntity<String> updateUserStatus(
            @PathVariable String userId,
            @RequestParam String status) {
        try {
            userService.updateUserStatus(userId, status);
            return ResponseEntity.ok("Status updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
