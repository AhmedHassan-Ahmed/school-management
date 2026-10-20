---
title: "Add search and pagination to list endpoints"
labels: "api,enhancement"
---

## Goal
Make list endpoints useful as data grows.

## Tasks
- [ ] Add `page` and `limit` query parameters.
- [ ] Set defaults and a maximum page size.
- [ ] Add documented search filters for students, teachers, classes, and subjects.
- [ ] Return current page, page size, total items, and total pages.
- [ ] Validate query parameters.

## Acceptance criteria
- [ ] List endpoints return consistent pagination metadata.
- [ ] Invalid pagination values are handled predictably.
- [ ] Search only applies to documented fields.
