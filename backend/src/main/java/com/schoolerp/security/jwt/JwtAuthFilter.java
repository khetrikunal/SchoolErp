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
            log.debug("[JwtAuthFilter] JWT validation result={}", valid);
            if (valid) {
                String email = jwtUtils.extractEmail(token);
                UserDetails ud = userDetailsService.loadUserByUsername(email);
                var auth = new UsernamePasswordAuthenticationToken(ud, null, ud.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(auth);
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

