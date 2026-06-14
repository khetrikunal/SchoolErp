package com.schoolerp.service.ratelimit;

import io.github.bucket4j.Bucket;

public interface RateLimitingService {
    Bucket resolveAuthBucket(String ip);
    Bucket resolveUploadBucket(String ip);
    Bucket resolveGeneralBucket(String ip);
    Bucket resolveAiBucket(String userId);
}
