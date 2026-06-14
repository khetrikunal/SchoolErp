package com.schoolerp.security.jwt;

import com.schoolerp.model.User;
import com.schoolerp.model.Teacher;
import com.schoolerp.model.Student;
import com.schoolerp.model.Role;
import com.schoolerp.repository.TeacherRepository;
import com.schoolerp.repository.StudentRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Collections;

@Component
public class JwtUtils {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private StudentRepository studentRepository;

    private SecretKey cachedKey;

    @PostConstruct
    public void init() {
        this.cachedKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(User user) {
        var builder = Jwts.builder()
            .subject(user.getEmail())
            .claim("role", user.getRole().name())
            .claim("name", user.getName())
            .claim("id",   user.getId());

        if (user.getRole() == Role.TEACHER) {
            teacherRepository.findByEmail(user.getEmail()).ifPresent(teacher -> {
                builder.claim("classes", teacher.getClasses() != null ? teacher.getClasses() : Collections.emptyList());
                builder.claim("subjects", teacher.getSubjects() != null ? teacher.getSubjects() : Collections.emptyList());
                builder.claim("teacherId", teacher.getTeacherId());
            });
        } else if (user.getRole() == Role.STUDENT) {
            studentRepository.findByEmail(user.getEmail()).ifPresent(student -> {
                builder.claim("class", student.getClassName());
                builder.claim("section", student.getSection());
                builder.claim("rollNo", student.getRollNo());
                builder.claim("phone", student.getPhone());
                builder.claim("admissionYear", student.getAdmissionYear());
                builder.claim("parentName", student.getParentName());
                builder.claim("studentId", student.getStudentId());
            });
        }

        return builder
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(getSigningKey())
            .compact();
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try { parseClaims(token); return true; }
        catch (JwtException | IllegalArgumentException e) { return false; }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
    }

    private SecretKey getSigningKey() {
        return cachedKey;
    }
}

