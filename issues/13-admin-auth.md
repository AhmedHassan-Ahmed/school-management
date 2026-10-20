---
title: "Implement admin authentication with JWT"
labels: "auth,security"
---

## Goal
Provide admin login without public registration.

## Tasks
- [ ] Add Admin model and interface.
- [ ] Add a secure seed script for the initial admin.
- [ ] Hash passwords with bcrypt.
- [ ] Implement `POST /api/v1/auth/login`.
- [ ] Sign and verify JWTs using environment-based secrets and sensible expiry.
- [ ] Implement `GET /api/v1/auth/me`.
- [ ] Validate login input and handle invalid credentials.

## Acceptance criteria
- [ ] No public admin registration endpoint exists.
- [ ] Passwords are never stored in plaintext.
- [ ] Invalid credentials return `401 Unauthorized`.
- [ ] Secrets are not committed.
