package com.mmchat.repository;

import com.mmchat.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

/**
 * Repository for User entity
 * Handles database operations for users
 * Abstracted to allow easy switching from MongoDB to SQL
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    List<User> findAllByActive(boolean active);
}
