---
paths:
  - "src/domain/**"
  - "tests/**"
---

# Payment domain

- State transitions must be explicit and covered by tests. Use
  `ALLOWED_TRANSITIONS` (`src/domain/transitions.ts`) as the single source
  of truth; do not encode a transition anywhere else.
- An invalid transition must throw `InvalidTransitionError` (extends
  `DomainError`) and must not mutate the stored payment.
- Moving to the same status is idempotent: no error, no change.
- Do not add production dependencies to implement domain logic.
