---
title: "Validate model references and deletion behavior"
labels: "database,integrity"
---

## Goal
Keep related school records consistent.

## Tasks
- [ ] Confirm Mongoose `ref` names match registered model names.
- [ ] Verify referenced records exist when accepting related IDs.
- [ ] Decide behavior when deleting a class that has students or timetable entries.
- [ ] Decide behavior when deleting a teacher or subject referenced by timetables.
- [ ] Implement and test the chosen deletion policy.

## Acceptance criteria
- [ ] The API does not silently create dangling references.
- [ ] Related-record deletion behavior is documented and tested.
