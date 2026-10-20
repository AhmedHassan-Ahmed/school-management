---
title: "Add centralized error handling"
labels: "backend,errors"
---

## Goal
Standardize API error responses.

## Tasks
- [ ] Add a not-found handler for unknown routes.
- [ ] Add centralized Express error middleware.
- [ ] Define a consistent JSON error format.
- [ ] Handle Mongoose validation and cast errors.
- [ ] Map MongoDB duplicate-key error `11000` to HTTP `409`.
- [ ] Avoid exposing stack traces in production.

## Acceptance criteria
- [ ] Errors return consistent JSON.
- [ ] Unknown routes return `404 Not Found`.
- [ ] Duplicate unique values return `409 Conflict`.
