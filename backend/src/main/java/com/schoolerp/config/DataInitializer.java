package com.schoolerp.config;

import com.schoolerp.model.*;
import com.schoolerp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed admin login user if they don't exist
        seedUser("Dr. Rajesh Kumar",  "admin@school.edu",   "Admin@123",   Role.ADMIN,   "Principal");
        log.info("=== Seed admin user initialized ===");
        log.info("Admin → admin@school.edu / Admin@123");
    }


    private void seedUser(String name, String email, String password, Role role, String designation) {
        if (!userRepository.existsByEmail(email)) {
            userRepository.save(User.builder()
                .name(name).email(email)
                .password(passwordEncoder.encode(password))
                .role(role).designation(designation)
                .build());
            log.info("Seeded user: {}", email);
        }
    }
}
