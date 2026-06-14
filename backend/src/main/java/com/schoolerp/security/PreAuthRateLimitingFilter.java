package com.schoolerp.security;

import com.schoolerp.service.ratelimit.RateLimitingService;
import com.schoolerp.util.IpUtils;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class PreAuthRateLimitingFilter extends OncePerRequestFilter {

    private final RateLimitingService rateLimitingService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        
        // Only rate limit API paths
        if (!uri.startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // PostAuth filter will handle AI endpoints, bypass here
        if (uri.startsWith("/api/ai/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = IpUtils.getClientIpAddress(request);
        Bucket bucket;

        if (uri.startsWith("/api/auth/")) {
            bucket = rateLimitingService.resolveAuthBucket(ip);
        } else if (uri.startsWith("/api/upload/")) {
            bucket = rateLimitingService.resolveUploadBucket(ip);
        } else {
            bucket = rateLimitingService.resolveGeneralBucket(ip);
        }

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            response.setHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));
            response.setHeader("Retry-After", String.valueOf(waitForRefill));
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too many requests. Please try again later.\"}");
        }
    }
}
