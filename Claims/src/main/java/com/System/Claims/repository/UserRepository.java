package com.System.Claims.repository;

import com.System.Claims.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User ,String> {
    Optional<User> findByUsername(String username);
}
