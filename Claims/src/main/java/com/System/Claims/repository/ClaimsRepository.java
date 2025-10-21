package com.System.Claims.repository;

import com.System.Claims.model.Claim;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ClaimsRepository extends MongoRepository<Claim, String> {
    List<Claim> findByOwner(String owner);
}
