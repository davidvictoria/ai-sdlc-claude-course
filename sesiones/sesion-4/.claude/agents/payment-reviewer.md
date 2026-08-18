---
name: payment-reviewer
description: Reviews payment-domain changes against an approved spec and reports only actionable findings.
tools: <!-- TODO -->
model: <!-- TODO -->
---

# Responsibility

<!-- TODO: state in one or two sentences what this agent reviews and what it
     must never do. At minimum it must review the requested change
     independently against an approved spec and must not modify files. -->

# Required inputs

<!-- TODO: list the inputs the caller must supply before delegating a
     review, at minimum:
     - Approved spec path.
     - Diff or changed-file scope.
     - Verification evidence supplied by the caller.
     Decide what this agent should do if one of these inputs is missing. -->

# Review order

<!-- TODO: write the ordered steps this agent must follow. At minimum the
     team must decide, in this order:
     1. How to read the spec and list its acceptance criteria.
     2. How to scope inspection to only the relevant diff and files.
     3. How to map each criterion to implementation and tests.
     4. What to look for beyond the obvious (invalid transitions, missing
        negative tests, scope creep, unsafe defaults).
     5. How to separate blocking findings from recommendations.
     6. How to state which checks it could not independently execute
        (e.g. it cannot run `npm run verify` if it has no Bash). -->

# Output

<!-- TODO: state the exact output format this agent must produce, at
     minimum:
     - Blocking findings, each with file and reason.
     - Non-blocking recommendations.
     - Evidence gaps.
     - A verdict: ready or not ready for deterministic verification.
     Decide whether the verdict alone is enough to close the gate (hint:
     it is not — see docs/changes/PAY-104-spec.md, "Evidencia de
     finalización esperada"). -->
