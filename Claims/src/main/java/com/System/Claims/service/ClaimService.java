package com.System.Claims.service;

import com.System.Claims.dto.CreateClaimDto;
import com.System.Claims.dto.UpdateClaimDto;
import com.System.Claims.mapper.ClaimMapper;
import com.System.Claims.model.Claim;
import com.System.Claims.model.ClaimStatus;
import com.System.Claims.repository.ClaimsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ClaimService {

    private final ClaimsRepository repo;
    private final ClaimMapper mapper;

    public ClaimService(ClaimsRepository repo, ClaimMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public Claim create(String owner, CreateClaimDto dto) {
        Claim toSave = mapper.toEntity(dto, owner);
        return repo.save(toSave);
    }

    public List<Claim> listByOwner(String owner) {
        return repo.findByOwner(owner);
    }

    public Claim listByIdOrThrow(String id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reclamo no encontrado"));
    }

    public Claim findOne(String id, String owner) {
        Claim claim = listByIdOrThrow(id);

        if (!claim.getOwner().equals(owner)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para acceder a este reclamo");
        }

        return claim;
    }

    public Claim findOne(String id) {
        return listByIdOrThrow(id);
    }

    public Claim close(String id) {
        Claim existing = listByIdOrThrow(id);

        try {
            existing.close();
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        return repo.save(existing);
    }

    public Claim resolve(String id) {
        Claim existing = listByIdOrThrow(id);

        try {
            existing.resolve();
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        return repo.save(existing);
    }

    public Claim update(String id, UpdateClaimDto dto) {
        Claim existing = listByIdOrThrow(id);

        if (existing.getStatus() == ClaimStatus.RESOLVED || existing.getStatus() == ClaimStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede actualizar un reclamo resuelto o cerrado.");
        }

        try {
            mapper.updateFromDto(dto, existing);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        return repo.save(existing);
    }

    public List<Claim> listAll() {
        return repo.findAll();
    }
}
