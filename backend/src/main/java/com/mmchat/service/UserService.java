package com.mmchat.service;

import com.mmchat.dto.AuthResponse;
import com.mmchat.dto.LoginRequest;
import com.mmchat.dto.RegisterRequest;
import com.mmchat.dto.UserDTO;
import com.mmchat.model.User;
import com.mmchat.repository.UserRepository;
import com.mmchat.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
// import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * User Service
 * Handles user-related business logic including registration, login, and profile management
 */
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    /**
     * Register a new user
     */
    public AuthResponse register(RegisterRequest request) throws Exception {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new Exception("Email already registered");
        }
        
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new Exception("Username already taken");
        }
        
        // Create new user
        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getDisplayName()
        );
        
        user = userRepository.save(user);
        
        // Generate tokens
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        
        return new AuthResponse(
                token,
                refreshToken,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                "User registered successfully",
                jwtUtil.getTokenExpiration(),
                jwtUtil.getRefreshTokenExpiration()
        );
    }
    
    /**
     * Login user with email and password
     */
    public AuthResponse login(LoginRequest request) throws Exception {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new Exception("User not found"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new Exception("Invalid password");
        }
        
        // Update user status to online
        user.setStatus("online");
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        
        // Generate tokens
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        
        return new AuthResponse(
                token,
                refreshToken,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                "Login successful",
                jwtUtil.getTokenExpiration(),
                jwtUtil.getRefreshTokenExpiration()
        );
    }
    
    /**
     * Get user by ID
     */
    public User getUserById(String userId) throws Exception {
        return userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
    }
    
    /**
     * Get user profile as DTO (safe to send to frontend)
     */
    public UserDTO getUserProfile(String userId) throws Exception {
        User user = getUserById(userId);
        return convertToDTO(user);
    }
    
    /**
     * Get all active users (for contacts list)
     */
    public List<UserDTO> getAllActiveUsers() {
        List<User> users = userRepository.findAllByActive(true);
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Update user status (online/offline/away)
     */
    public void updateUserStatus(String userId, String status) throws Exception {
        User user = getUserById(userId);
        user.setStatus(status);
        user.setLastSeen(Instant.now());
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }
    
    /**
     * Logout user (set offline)
     */
    public void logout(String userId) throws Exception {
        User user = getUserById(userId);
        user.setStatus("offline");
        user.setLastSeen(Instant.now());
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }
    
    /**
     * Refresh JWT token using refresh token
     */
    public AuthResponse refreshToken(String userId, String refreshToken) throws Exception {
        // First verify that the refresh token is valid
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new Exception("Invalid or expired refresh token");
        }
        
        // Verify the userId in the refresh token matches
        if (!jwtUtil.extractUserId(refreshToken).equals(userId)) {
            throw new Exception("User ID mismatch in refresh token");
        }
        
        // Get user and generate new tokens
        User user = getUserById(userId);
        
        String newToken = jwtUtil.generateToken(user.getId(), user.getEmail());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getId());
        
        return new AuthResponse(
                newToken,
                newRefreshToken,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                "Token refreshed successfully",
                jwtUtil.getTokenExpiration(),
                jwtUtil.getRefreshTokenExpiration()
        );
    }
    
    /**
     * Convert User to UserDTO
     */
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getProfileImage(),
                user.getBio(),
                user.getStatus(),
                user.getLastSeen()
        );
    }
}
