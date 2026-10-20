---
title: "Add request validation with Zod"
labels: "validation,backend"
---

## Goal
Validate incoming data before business logic.

## Tasks
- [ ] Add Zod.
- [ ] Create reusable request-validation middleware.
- [ ] Define create/update schemas for each module.
- [ ] Validate route parameters such as MongoDB ObjectIds.
- [ ] Return clear `400 Bad Request` responses for invalid input.

## Acceptance criteria
- [ ] Invalid payloads are rejected before service logic runs.
- [ ] Validation errors use a consistent format.
- [ ] Mongoose validation remains enabled as a second layer.
