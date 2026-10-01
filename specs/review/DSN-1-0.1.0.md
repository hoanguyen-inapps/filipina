# Review DSN-1 0.1.0

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-10-01
- Files read: DSN-1, SPEC-1 0.2.0, BRIEF-1, SRC-30, SRC-31, SRC-32, SRC-6, SRC-10 in full; cited lines of SRC-8, SRC-11; SPEC-5 data, states and rules; SPEC-8 R-05 and its ACs; reference/spec-logic.md
- Coverage: every SPEC-1 rule has an RZ row and every field a DM row; each DEC matches the owner's reply except DEC-14 and DEC-16

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | RZ-11, RZ-16, API-12, RZ-09 | 3 / 2 | Account expired inside registration is never cleaned or audited | AC-84 path | Fixed: shared expireAccount procedure used by RZ-11 and RZ-16 |
| 2 | RZ-07, API-06, RZ-05 | 5 / 2 | Reset link never marked used; token kind not checked | AC-55; confirm token used for reset | Fixed: RZ-05, RZ-07 check kind, set used_at; unknown token 410 |
| 3 | RZ-08, RZ-15 | 5 | Counter writes may roll back with the rejection | AC-63, AC-109 | Fixed: counters committed in their own transaction before the error |
| 4 | RZ-08 | 1 | Active check before password breaks "kể cả khi bị từ chối vì lý do khác" | Unconfirmed correct password then wrong login | Fixed: password checked first |
| 5 | RZ-16, API-03, DEC-17 | 2 | Sessions survive expiry; resend ignores status | AC-110 | Fixed: RZ-10 guard checks effective status every request; RZ-16 deletes sessions; API-03 403 |
| 6 | RZ-04, DM-04 | 2 | District of Columbia has no alpha-2 code | AC-101 | Fixed: list entry "US-DC"; DM-04 text |
| 7 | RZ-01 | 4 / 2 | Flag restored by backup; flag moment | AC-05, AC-96 | Fixed: flag excluded from backup; moment: Owner question AA1 |
| 8 | RZ-13, API-03 | 5 | Limiter asynchronous; window boundary | AC-29 | Fixed: counted on request time, window (t−60 s, t]; API-03 synchronous |
| 9 | RZ-05, DM-10, IC-05 | 5 | sent_at moment, second precision, now() after lock wait | Link at 10:00:00.700 opened next day 10:00:00.300 | Fixed: sent_at = request time; whole-second comparison; clock_timestamp() after locks |
| 10 | RZ-07, RZ-09 | 5 | Activation via reset writes one audit record | AC-72; G-03 count | Fixed: two records |
| 11 | RZ-02, RZ-03, IC-05 | 5 | App age pre-check uses device date | California 20:00 PDT | Fixed: app does not pre-check age |
| 12 | RZ-18, RISK-03 | 4 | Acceptance of UI-only R-18 is the owner's call | curl with app header | Owner question AA2 |
| 13 | RZ-19, API-11 | 2 | adminDelete does not check role and blank reference or reason | SPEC-8 AC-19, AC-20 | Fixed: RZ-19 checks role and non-whitespace inputs |
| 14 | RZ-08, RZ-19 | 5 / 2 | Events not durable; plan end not immediate | Crash after commit | Fixed: outbox in the deletion transaction; plan Ended in the same transaction for admin deletion |
| 15 | RZ-08 | 2 | Payment changes do not take the account lock (inference) | Resume while deleting | Fixed: RZ-08 requires subscription changes to lock the account row first |
| 16 | RZ-16, CMP-09 | 2 | Schedule creation not atomic with the insert | CreateSchedule fails after commit | Fixed: schedule created from the outbox with retry; API-12 ignores a missing account |
| 17 | RZ-15 | 5 | Attempts during a lock | AC-46, AC-47 | Fixed: not stored |
| 18 | RZ-06 | 1 | NFC only on login | AC-107 | Fixed: every comparison |
| 19 | RZ-10 | 5 | Guard only on verification endpoints | Unconfirmed on website | Fixed: default on every member endpoint with an allow-list |
| 20 | API-01, RZ-02 | 2 | Gender not validated | gender "other" | Fixed: 422 SPEC-1/R-01 |
| 21 | RZ-05, RZ-07 | 2 | Confirm link landing and link scanners | Scanner prefetch | Fixed: website page calls API-02 by script; no GET side effect; "Mở trong app" button |
| 22 | DEC-16 | 1 | Parameters not in the source | p unspecified | Owner question AA3 |
| 23 | DEC-14 | 1 / 5 | Dropped no-UPDATE/DELETE clause; Object Lock mode and period | Retention unknown | Fixed: clause restored; mode and period: Owner question AA4 |
| 24 | DEC-17 | 5 | Session lifetime, web storage, open sockets | AC-53, AC-66 | Owner question AA5 |
| 25 | IC-08 | 1 | Wrong citation | — | Fixed: SRC-32#L23, SRC-32#L25 |
| 26 | IC-05 | 1 / 4 | UTC storage source; DB clock unsourced | — | Fixed: SRC-8#L58, SRC-8#L70; DB clock moved to RZ text |
| 27 | DM-11 vs SPEC-1/DF-11 | 3 | SPEC field description cannot express the sliding window | AC-108 | Owner question AA6 |
| 28 | RZ-14, RZ-17 | 7 | Timing guarantee and old/new values invented | — | Fixed: both removed |
| 29 | CMP-04 | 3 | "Nơi duy nhất kiểm các rule" contradicts app, trigger and worker | — | Fixed: reworded |
| 30 | API rows | 2 | SPEC-1/P-08 in no Covers | — | Fixed: API-01 covers P-08 |
| 31 | RZ-17 | 5 | validateRegistration for a partial edit | PATCH with city only | Fixed: only submitted fields |
| 32 | DM-12 | 2 | HMAC key rotation or loss (inference) | AC-80 after rotation | Fixed: key never rotated, replicated and backed up |

## Top three

1. Expiry inside registration leaves data and no audit (#1).
2. Reset link never marked used; token kind unchecked (#2).
3. Counter writes around rejected requests and the delete-screen check order (#3, #4).

Process note: SRC-30, SRC-31 and SRC-32 are draft; they are approved together with DSN-1 (`--with-sources`).
