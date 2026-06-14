package com.schoolerp.service.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InMemoryRateLimitingService implements RateLimitingService {

    private final Map<String, Bucket> authCache = new ConcurrentHashMap<>();
    private final Map<String, Bucket> uploadCache = new ConcurrentHashMap<>();
    private final Map<String, Bucket> generalCache = new ConcurrentHashMap<>();
    private final Map<String, Bucket> aiCache = new ConcurrentHashMap<>();

    @Override
    public Bucket resolveAuthBucket(String ip) {
        return authCache.computeIfAbsent(ip, this::newAuthBucket);
    }

    @Override
    public Bucket resolveUploadBucket(String ip) {
        return uploadCache.computeIfAbsent(ip, this::newUploadBucket);
    }

    @Override
    public Bucket resolveGeneralBucket(String ip) {
        return generalCache.computeIfAbsent(ip, this::newGeneralBucket);
    }

    @Override
    public Bucket resolveAiBucket(String userId) {
        return aiCache.computeIfAbsent(userId, this::newAiBucket);
    }

    private Bucket newAuthBucket(String ip) {
        // 5 requests per 15 minutes
        Bandwidth limit = Bandwidth.builder()
                .capacity(5)
                .refillIntervally(5, Duration.ofMinutes(15))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket newUploadBucket(String ip) {
        // 5 requests per minute
        Bandwidth limit = Bandwidth.builder()
                .capacity(5)
                .refillIntervally(5, Duration.ofMinutes(1))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket newGeneralBucket(String ip) {
        // 60 requests per minute
        Bandwidth limit = Bandwidth.builder()
                .capacity(60)
                .refillIntervally(60, Duration.ofMinutes(1))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket newAiBucket(String userId) {
        // 10 requests per minute
        Bandwidth limit = Bandwidth.builder()
                .capacity(10)
                .refillIntervally(10, Duration.ofMinutes(1))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }
}
