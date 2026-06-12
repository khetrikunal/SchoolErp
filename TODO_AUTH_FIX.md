# TODO_AUTH_FIX

- [x] Identified this is a Spring Boot backend (Java), not Express.
- [x] Verified CORS is configured in `backend/src/main/java/com/schoolerp/config/SecurityConfig.java`.
- [x] Added Render production origin `https://schoolerp-tgqx.onrender.com` to `allowedOrigins`.
- [ ] Commit and push changes to trigger Render auto-deploy.
- [ ] Wait 2-3 minutes for Render redeploy.
- [ ] Verify login: `POST /api/auth/login` from `https://schoolerp-tgqx.onrender.com`.

