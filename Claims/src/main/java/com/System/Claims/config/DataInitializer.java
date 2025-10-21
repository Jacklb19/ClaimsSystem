package com.System.Claims.config;

import com.System.Claims.model.Role;
import com.System.Claims.model.User;
import com.System.Claims.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verifica si ya existe un admin
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(Role.AGENTE))
                    .build();
            userRepository.save(admin);
            System.out.println("Usuario administrador creado: admin / admin123");
        }
    }
}
