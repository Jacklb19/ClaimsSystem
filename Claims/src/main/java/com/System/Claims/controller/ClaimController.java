package com.System.Claims.controller;

import com.System.Claims.dto.CreateClaimDto;
import com.System.Claims.dto.ResponseClaimDto;
import com.System.Claims.dto.UpdateClaimDto;
import com.System.Claims.mapper.ClaimMapper;
import com.System.Claims.model.Claim;
import com.System.Claims.service.ClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService service;
    private final ClaimMapper mapper;

    @PostMapping
    public ResponseEntity<ResponseClaimDto> create(@RequestBody CreateClaimDto dto, Authentication authentication) {
        String username = authentication.getName();
        Claim saved = service.create(username, dto);
        return ResponseEntity.status(201).body(mapper.toDto(saved));
    }

    @GetMapping
    public ResponseEntity<List<ResponseClaimDto>> list(Authentication authentication){
        String username = authentication.getName();
        boolean isAgent = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_AGENTE"));

        List<Claim> claims;

        if (isAgent) {
            claims = service.listAll();
        } else {
            claims = service.listByOwner(username);
        }

        List<ResponseClaimDto> result = claims.stream().map(mapper::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseClaimDto> getOne(@PathVariable String id, Authentication authentication){
        String username = authentication.getName();
        boolean isAgent = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_AGENTE"));

        Claim claim;

        if (isAgent) {
            claim = service.findOne(id); // sin validar owner
        } else {
            claim = service.findOne(id, username); // valida owner
        }

        return ResponseEntity.ok(mapper.toDto(claim));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseClaimDto> update(@PathVariable String id, @RequestBody UpdateClaimDto dto, Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_AGENTE"))) {
            return ResponseEntity.status(403).build();
        }

        try {
            service.findOne(id); // validar existencia
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }

        Claim updated = service.update(id, dto);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<ResponseClaimDto> close(@PathVariable String id, Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_AGENTE"))) {
            return ResponseEntity.status(403).build();
        }

        try {
            service.findOne(id);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }

        Claim closed = service.close(id);
        return ResponseEntity.ok(mapper.toDto(closed));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ResponseClaimDto> resolve(@PathVariable String id, Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_AGENTE"))) {
            return ResponseEntity.status(403).build();
        }

        try {
            service.findOne(id);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }

        Claim resolved = service.resolve(id);
        return ResponseEntity.ok(mapper.toDto(resolved));
    }
}
