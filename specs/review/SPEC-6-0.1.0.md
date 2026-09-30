---
review_of: SPEC-6
version: 0.1.0
reviewed_hash: sha256:f6638e059a65508ac3d57b4c
---

# Review SPEC-6 0.1.0

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-29
- Files read: specs/spec/SPEC-6-an-toan.md, specs/brief/BRIEF-1-filipinaconnect-us-mvp.md, SRC-1, SRC-15, SRC-16, SRC-19, SPEC-3, SPEC-4, reference/spec-logic.md
- R-08, R-10 and R-12 were open CLARIFY markers at review time (owner questions L1, L2, L3).

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | R-02, AC-06 | 3 / 4 | Blocking needs SPEC-4 transitions that approved SPEC-4 does not define; resend rule after unblock chosen without source | maria blocks john with a Pending request, then unblocks | Fixed from SRC-20 L4: R-02, R-03; SPEC-4 revision 0.2.0 adds X-09, X-10, R-22; AC-01, AC-03, AC-08 |
| 2 | R-02, R-05, AC-39 | 3 | After a block the blocker cannot reach anything to report; history vs SPEC-4/R-14 | Victim blocks first, then reports | Fixed from SRC-20 L5: R-16; AC-54 |
| 3 | P-06, AC-43 | 3 | Admin refused access to blocks, though SRC-1#L64 puts blocks on the dashboard | Admin investigates harassment | Fixed from SRC-20 L6: P-06 admin Y; AC-59 refuses another member only |
| 4 | AC-17 vs R-08 | 3 / 6 | "WhatsApp me" has no account name or number | "Drop me a line" | Fixed from SRC-20 L7: R-08; AC-24 |
| 5 | R-12(c) | 1 | Refused bio saves not counted as detections | 5 bio attempts with a phone number | Fixed from SRC-20 L8: R-12(c); AC-40 |
| 6 | R-05, R-07 | 2 | Block when the report itself is refused | 21st report with "chặn" yes | Fixed from SRC-20 L9: R-05; AC-15 |
| 7 | R-02 | 2 / 6 | What the blocked person sees; blocker acting on the blocked | "Bạn đã bị chặn" message | Fixed from SRC-20 L10: R-02; AC-02, AC-04, AC-05 |
| 8 | R-11 | 5 / 2 | Screen closed without ack; auto-send after ack; accept time | Accept tapped at 335 h 59 m, acked at 336 h 01 m | Fixed from SRC-20 L11: R-11; AC-30..AC-34 |
| 9 | R-12 | 4 / 6 | Rolling windows, boundaries, "same content", keywords per message | 24:00:00 edge | Fixed from SRC-20 L12: R-12; AC-35..AC-42 |
| 10 | R-14 | 2 / 4 | Effect of Accepted appeal; minimum and counting | Accepted appeal, still locked out | Fixed from SRC-20 L13: R-14, DF-07; AC-48, AC-49 |
| 11 | AC-07 | 6 | Tests no existing block | john removes maria's block | Fixed: AC-09 (john refused removing maria's block) |
| 12 | DF-01 | 2 | Double block, re-block, mutual blocks | Two phones block at once | Fixed from SRC-20 L14: R-17; AC-55, AC-56, AC-57 |
| 13 | R-07 | 2 | Refused attempts; concurrency | Two reports at 19 | Fixed from SRC-20 L15: R-07; AC-22 |
| 14 | R-10 | 5 | Substring or whole word | "bankrupt" | Fixed from SRC-20 L16: R-10; AC-28 |
| 15 | R-08, R-09 | 5 / 2 | Any URL; name and city unchecked | "mysite.com/maria" | Fixed from SRC-20 L17: R-08, R-09; AC-23, AC-26 |
| 16 | R-05, DF-04 | 2 | Snapshot of reported content; self-report | Photo deleted after report | Fixed from SRC-20 L18: R-05, DF-04; AC-16, AC-17 |
| 17 | R-11 | 1 | Scam warning on the safety screen (K7(3)) omitted | Client text lacks the warning | Fixed from SRC-20 L19: R-11; AC-30 |
| 18 | DF-06 | 2 | SuspicionFlag has no state machine | Flag closed, same signal again | Fixed: SuspicionFlag machine S-08, S-09, X-05; AC-44 |
| 19 | R-01 | 2 | Search results and opened profiles not in "đã từng thấy" | Seen only in search | Fixed from SRC-20 L20: T-08; AC-07 |
| 20 | R-15 | 1 / 2 | Safety ack and block-caused ends not audited | IMBRA audit | Fixed from SRC-20 L21: R-15; SPEC-4 revision R-17; AC-32 |
| 21 | R-02 | 2 | Block racing another action | Message 50 ms after block | Fixed from SRC-20 L22: R-18; AC-58 |
| 22 | R-04, DF-03 | 5 | Counting of 1000 characters; whitespace-only description | NFD description | Fixed from SRC-20 L23: R-04, DF-03; AC-12 |

Process note: SRC-19 is draft; it is approved together with SPEC-6 (`--with-sources`).

## Top three

1. Blocking needs SPEC-4 transitions and a resend rule (#1).
2. Block then report is impossible as written (#2).
3. Admin access to blocks refused by an AC (#3).

Resolution: all 22 findings changed the SPEC (SRC-20, answered "theo đề xuất"); R-08, R-10 and R-12 were filled from SRC-20 L1–L3. Finding 1 also required revision 0.2.0 of SPEC-4, reviewed separately. The changes were checked against SRC-20 by the drafting agent, not by a fresh reviewer.

## Re-stamps

| Date | From | To | Note |
| --- | --- | --- | --- |
| 2026-09-29 | sha256:9160fb15434e01f6e81ea60b | sha256:f6638e059a65508ac3d57b4c | R-03 and R-18 aligned with SPEC-4 0.2.0 R-22 per SRC-21 (M1, M4); AC-60 added; checked against SRC-21 by the drafting agent |
