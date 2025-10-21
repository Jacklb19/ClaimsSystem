package com.System.Claims.config.dto;

import com.System.Claims.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    private String token;
    private UserPayload user;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserPayload {
        private String username;
        private Role role;
    }
}
