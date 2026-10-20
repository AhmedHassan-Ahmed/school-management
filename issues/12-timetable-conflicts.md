---
title: "Prevent timetable overlaps for teachers and classes"
labels: "timetable,integrity"
---

## Goal
Prevent overlapping timetable entries for the same teacher or class on the same day.

## Tasks
- [ ] Detect overlaps for the same teacher and day.
- [ ] Detect overlaps for the same class and day.
- [ ] Use interval logic: existing start < new end AND existing end > new start.
- [ ] Exclude the current record when checking updates.
- [ ] Return `409 Conflict` for a conflict.
- [ ] Document a concurrency strategy; check-then-insert alone can race.
- [ ] Test adjacent, overlapping, contained, and identical intervals.

## Acceptance criteria
- [ ] Adjacent lessons such as `09:00–10:00` and `10:00–11:00` are allowed.
- [ ] Overlapping entries for the same teacher or class are rejected.
- [ ] Update checks ignore the record being updated.
- [ ] Concurrency limitations and strategy are documented.
