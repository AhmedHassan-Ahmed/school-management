---
title: "Protect management endpoints with admin authentication"
labels: "auth,security"
---

## Goal
Require an authenticated admin for management operations.

## Tasks
- [ ] Add reusable JWT authentication middleware.
- [ ] Protect student, teacher, class, subject, and timetable routes.
- [ ] Keep login public.
- [ ] Return `401` for missing, invalid, or expired tokens.
- [ ] Document bearer-token usage.

## Acceptance criteria
- [ ] Protected endpoints cannot be accessed without a valid token.
- [ ] Login remains public.
- [ ] Authentication errors use the common error format.
