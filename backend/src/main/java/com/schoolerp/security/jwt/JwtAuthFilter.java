package com.schoolerp.security.jwt;

import com.schoolerp.security.service.UserDetailsServiceImpl;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String servletPath = req.getServletPath();
        log.debug("[JwtAuthFilter] servletPath={}", servletPath);

        // Skip any sub-path under /api/auth
        if (servletPath != null && servletPath.startsWith("/api/auth/")) {
            chain.doFilter(req, res);
            return;
        }

        // Skip preflight CORS requests
        if (req.getMethod() != null && req.getMethod().equalsIgnoreCase("OPTIONS")) {
            chain.doFilter(req, res);
            return;
        }

        String token = parseJwt(req);

        if (token != null) {
            boolean valid = jwtUtils.validateToken(token);
            log.debug("[JwtAuthFilter] Authorization token present. valid={}", valid);
            log.debug("[JwtAuthFilter] token={}", token);

            if (valid) {
                String email = jwtUtils.extractEmail(token);
                String role = jwtUtils.extractRole(token);

                log.debug("[JwtAuthFilter] extracted email={}", email);
                log.debug("[JwtAuthFilter] extracted role(claim)={}", role);

                // Still load user details for potential additional info, but build authorities from JWT role claim.
                UserDetails ud = userDetailsService.loadUserByUsername(email);

                String normalizedRole = role == null ? null : role.trim();
                String springRole = normalizedRole == null ? null : (normalizedRole.startsWith("ROLE_") ? normalizedRole : "ROLE_" + normalizedRole);

                if (springRole == null || springRole.isBlank()) {
                    log.warn("[JwtAuthFilter] Missing/blank role in JWT. Not setting authentication.");
                } else {
                    var grantedAuthorities = java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(springRole));
                    log.debug("[JwtAuthFilter] grantedAuthorities={}", grantedAuthorities);

                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        ud,
                        null,
                        grantedAuthorities
                    );
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }
        chain.doFilter(req, res);

    }

    private String parseJwt(HttpServletRequest req) {
        String header = req.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer "))
            return header.substring(7);
        return null;
    }
}

