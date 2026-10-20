---
title: "Implement Timetable CRUD API"
labels: "feature,timetable"
---

## Goal
Create API endpoints for timetable entries.

## Tasks
- [ ] Implement timetable service and controller methods.
- [ ] Register routes under `/api/v1/timetables`.
- [ ] Support create, list, get by ID, update, and delete.
- [ ] Validate class, teacher, and subject references.
- [ ] Validate day of week and `HH:mm` time format.
- [ ] Ensure start time is earlier than end time.

## Acceptance criteria
- [ ] Timetable CRUD endpoints work.
- [ ] Referenced records must exist.
- [ ] Invalid time ranges are rejected.
