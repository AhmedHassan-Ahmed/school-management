---
title: "Verify MongoDB connection and server startup"
labels: "database,setup"
---

## Goal
Make startup and database connection behavior predictable.

## Tasks
- [ ] Read `MONGODB_URI` from environment variables.
- [ ] Connect to MongoDB before listening for requests.
- [ ] Log successful connection.
- [ ] Log startup failures and exit with a non-zero status.
- [ ] Verify startup against a local MongoDB instance.

## Acceptance criteria
- [ ] Server does not listen if the initial database connection fails.
- [ ] Missing `MONGODB_URI` produces a clear error.
