---
paths:
  - "src/domain/**"
  - "src/service/**"
  - "tests/**"
---

# Payment domain

- State transitions must be explicit and covered by tests. Use
  `ALLOWED_TRANSITIONS` (`src/domain/transitions.ts`) as the single source
  of truth; do not encode a transition anywhere else.
- An invalid transition must throw `InvalidTransitionError` (extends
  `DomainError`) and must not mutate the stored payment.
- Moving to the same status is idempotent: no error, no change. This applies
  to every status, including `REVERSED`.
- `REVERSED` (session 4, `PAY-104`) is already implemented and verified in
  this snapshot: `APPROVED -> REVERSED` is the only valid route into it, and
  it is terminal. Treat it as a stable dependency for `PAY-105`; do not
  modify its transition rules as a side effect of an unrelated change.
- New domain errors follow the existing `DomainError` pattern
  (`src/domain/errors.ts`); do not throw generic `Error` from the domain.
- Do not add production dependencies to implement domain logic.
- Do not log a value that could contain a full free-text field a human
  typed (for example, an operational reason) without first deciding, in the
  spec, what may safely appear in a log.
