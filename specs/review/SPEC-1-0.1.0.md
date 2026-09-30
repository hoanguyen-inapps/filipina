---
review_of: SPEC-1
version: 0.1.0
reviewed_hash: sha256:dfc6a2c96d4b0aabcc43f124
---

# Review SPEC-1 0.1.0

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-29
- Files read: specs/spec/SPEC-1-onboarding-tai-khoan-va-xac-minh.md, specs/brief/BRIEF-1-filipinaconnect-us-mvp.md, specs/src/SRC-1-developer-project-brief-rev-8-31-26.md, specs/src/SRC-3-user-journey-rev-8-26-26.md, specs/src/SRC-6-owner-answers-spec-1-spec-2-2026-09-29.md, reference/spec-logic.md

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | R-03..R-14 | 1 Unsupported | Owner decisions cite SRC-6, which is still draft | SRC-6 edited before approval | No change: SRC-6 is approved together with SPEC-1 (`--with-sources`); owner accepted Q12 as a whole |
| 2 | R-11 / S-03 | 5 Ambiguity | Unclear whether a Deleted account's email blocks re-registration | john@ deletes and registers again | Owner question A2 |
| 3 | S-01 / R-08 / R-11 | 2 Missing path | Unconfirmed account never expires, cannot be deleted; email locked for good | Someone squats maria@ and never confirms | Owner question A1 |
| 4 | R-11 vs R-14 | 3 Contradiction | Registration reveals whether an email exists while reset hides it | Attacker enumerates via registration form | Owner question A3 |
| 5 | X-02 / R-08 | 3 Contradiction | Deletion with an active membership is decided (allowed) although deferred to payment SPEC | Man with active recurring plan deletes account | Owner question A4 |
| 6 | P-03 / R-07 | 2 Missing path | Reset for Unconfirmed/Deleted accounts undefined | Deleted john@ requests reset | Owner question A5 |
| 7 | DF-08 / R-05 / R-07 / R-13 | 2 Missing path | Links not single-use; older links not cancelled | Reset link reused within 24 h | Owner question A6 |
| 8 | AC-09/10/19/27 | 6 Weak AC | Exactly 24:00:00 untested; "≤" is the SPEC's choice | Opened at exactly 24 h | Owner question A7 |
| 9 | T-04 / R-03 | 6 Weak AC / 2 | No AC off UTC; leap-day birthdays undefined | Manila 07:00 on 18th birthday; born 29 Feb | Owner question A8; AC for Manila case added after answer |
| 10 | T-05 / R-04 | 5 Ambiguity | How country is read from free text; territories | "Austin, TX", "Guam", "Cebu" | Owner question A9 |
| 11 | R-03 / R-04 | 2 Missing path | Editing location/DOB after registration | Man changes location to Manila | Owner question A10 |
| 12 | R-11 | 2 Missing path | Email case, whitespace, simultaneous registrations | John@Example.com vs john@example.com | Owner question A11 |
| 13 | R-06 | 4 Hidden decision | Email + password as the only login method is unsourced | Client expects Apple/Google sign-in | Owner question A12 |
| 14 | R-06 | 5 Ambiguity | Which characters count; maximum length; spaces | "ñandú123", 500-char password | Owner question A13 |
| 15 | R-06 / R-07 | 2 Missing path | No failed-login limit; other devices after reset/deletion | 10,000 guesses; stolen tablet stays logged in | Owner question A14 |
| 16 | R-06 | 6 Weak AC | Unknown-email login message untested | nobody@ / "Correct1" | Owner question A15 |
| 17 | R-06 / R-07 | 6 Weak AC | Invalid new password on reset untested | Reset accepts "short1" | Fixed: AC-28 added |
| 18 | R-05 | 6 Weak AC | Sending of the confirmation email untested | Account created, no email sent | Fixed: AC-29 added |
| 19 | R-13 | 5 Silent default | No resend limit | 500 resends | Owner question A16 |
| 20 | R-08 | 5 Ambiguity | "hồ sơ" undefined: which personal fields are erased | Audit still shows name after deletion | Owner question A17 |
| 21 | R-08 / P-04 | 4 Hidden decision | No confirmation/undo on deletion | Accidental delete | Owner question A18 |
| 22 | R-09 | 2 Missing path | Source list is open ("such as"); reset/deletion not logged | Dispute over who deleted account | Owner question A19 |
| 23 | Permissions | 2 Missing path | Admin column missing | Support asked to fix wrong gender | Owner question A20 |
| 24 | P-01 / P-02 | 6 Weak | Cells name one rule while several gate the action | Man in Manila passes R-03, fails R-04 | Fixed: cells set to Y; the rules decide |
| 25 | AC-08 | 6 Weak AC | Does not assert no account created; no third country | Woman in Dubai | Fixed: AC-08 tightened, AC-30 added |
| 26 | AC-25 | 6 Weak AC | "tìm cách đổi" is not a concrete action | No screen offers the change | Fixed: AC-25 names profile edit and account settings |
| 27 | R-01 / AC-01 | 6 / 2 | Onboarding repeat/skip; website registration | Returning user; web visitor | Owner question A21 |
| 28 | T-02 / R-01 | 4 Hidden decision (inference) | Screen 4 treated as one choice screen | Client meant separate content pages | Owner question A22 |
| 29 | Scope / R-09 | 5 Scope leak | R-09 implements BRIEF-1/C-40 but Scope omits it | Traceability misses C-40 | Fixed: Scope lists BRIEF-1/C-40 (audit events of this SPEC) |
| 30 | §9 NFR | 2 Missing path | BRIEF-1/G-02 (300 concurrent) not in SPEC | 300 simultaneous logins | No change: system-wide goal, realised and tested in the DSN |
| 31 | R-02 | 2 Missing path | Malformed values not covered | "maria@", name of spaces | Owner question A23 |

## Top three

1. Unconfirmed accounts are a dead end and lock the email (#3).
2. Deleted accounts: re-registration and password reset undefined (#2, #6).
3. Links reusable and 24 h boundary untested (#7, #8).

## Round 2 (fresh-context reviewer, 2026-09-29, after SRC-8)

Files read: SPEC-1, BRIEF-1, SRC-1, SRC-3, SRC-6, SRC-8, spec-logic.md.

| # | Item | Category | Finding | Resolution |
| --- | --- | --- | --- | --- |
| 1 | R-05, R-07, T-06 | 2 / 3 | Valid link could reactivate an Expired account or reset a Deleted one | Fixed: R-05, R-07 refuse links on Expired/Deleted; AC-64, AC-65 |
| 2 | R-01, AC-03 | 2 / 4 | No way back to registration after the first app open | Open: owner question C1 |
| 3 | R-07 | 1 | "mọi thiết bị khác" narrower than SRC-8#L32 "mọi thiết bị" | Fixed: R-07, F-03, AC-39 |
| 4 | R-08 | 1 / 5 | "không còn gói hiệu lực" vs source "huỷ gói trước" | Fixed: cancelled plan suffices; guard `not uncancelledPlan`; AC-66 |
| 5 | R-08 vs R-11 | 3 | Deleted-email block lost when retained records are purged | Open: C2 |
| 6 | R-15 | 5 / 2 | Lock message leaks existence; re-lock and reset behaviour | Open: C3 |
| 7 | R-09 | 2 / 1 | X-02 activation, city edit, expiry not logged | Fixed for X-02 (R-09, AC-67); city edit and expiry open: C4 |
| 8 | R-13 | 1 / 2 | Resend limit not applied to reset links and duplicate emails | Open: C5 |
| 9 | R-13, AC-24 | 4 / 6 | UTC calendar day was a choice; first email counting | UTC day confirmed (SRC-9#L19, SRC-9#L22); first email: C6 |
| 10 | R-05, AC-21 | 5 | Precedence of "đã xác nhận" over expired/replaced link | Open: C7 |
| 11 | R-16 | 5 / 7 / 6 | 168 h boundary vs cleanup timing | Open: C8, D1 |
| 12 | R-11 | 2 | Simultaneous registrations | Open: C9 |
| 13 | R-11 | 5 / 1 | Screen after duplicate; email wording differs from SRC-8#L21 | Wording fixed ("bạn đã có tài khoản"); screen and Deleted case: C10 |
| 14 | R-17, P-07 | 2 | Name/email edits; city validation; Unconfirmed edits | Open: C11 |
| 15 | R-02 | 5 | Email format; whitespace city; max lengths | Open: C12 |
| 16 | R-08 | 2 | Delete-screen password guesses unlimited | Open: C13 |
| 17 | R-08, X-04 | 4 | Unconfirmed cannot delete | Open: C14 |
| 18 | R-15 | 4 | "liên tiếp" and reset-to-0 unsourced; no window | Rule confirmed (SRC-9#L20, SRC-9#L22); time window open: C15 |
| 19 | R-06 | 5 | Character counting; leading/trailing spaces | Open: C16 |
| 20 | Scope vs C-15 | 2 | Which account actions on the website | Open: C17 |
| 21 | SRC-6, SRC-8 | 1 (process) | Sources still draft | No change: approved with SPEC-1 via `--with-sources` |
| 22 | T-06 | 4 | "cùng loại" unsourced; reset A vs B untested | Open: C18 |

Round 2: 6 findings changed the SPEC; open owner questions C1–C18 and D1 are not marked in the SPEC and do not block approval.

Round 2 follow-up: the owner answered C1–C18 and D1 "theo đề xuất" (SRC-10#L54); all were written into the SPEC.

## Round 3 (fresh-context reviewer, 2026-09-29, targeted at items citing SRC-9 and SRC-10)

| # | Item | Category | Finding | Resolution |
| --- | --- | --- | --- | --- |
| 1 | R-01 | 2 | Existing member on a new install has no way to reach login | Fixed from SRC-11 E1: link "Đã có tài khoản? Đăng nhập"; AC-96 |
| 2 | R-13 | 4 / 1 | Shared email budget and signup-email exemption unsourced | Fixed from SRC-11 E2: separate budget per type, signup email exempt from both; AC-32 |
| 3 | T-08 vs R-15 | 3 | 15-minute window inclusive while T-08 says ≥ is passed | Fixed: window < 15 minutes per T-08; AC-49, AC-50 |
| 4 | R-16 | 1 / 2 | Login, resend, reset after 168 h before cleanup | Fixed from SRC-11 E3; AC-110 |
| 5 | R-09 | 2 | Name edits not audited | Fixed from SRC-1#L182 ("profile changes"); AC-73 |
| 6 | R-15 | 4 | Fixed vs sliding window | Fixed from SRC-11 E4: sliding; AC-108 |
| 7 | R-06 | 5 | NFC before storing and comparing | Fixed from SRC-11 E5; AC-107 |
| 8 | T-06 | 6 | "cùng loại" untested | Fixed: AC-103 |
| 9 | R-05 | 2 / 4 | Deleted account's old link; link tied to account | Fixed from SRC-11 E6; AC-104, AC-105 |
| 10 | R-18 | 5 | Name edit on website | Fixed from SRC-11 E7; AC-112 |
| 11 | R-01 | 2 | Closing the app mid-onboarding skips screens | Fixed from SRC-11 E8; AC-97 |
| 12 | AC-77 | 6 | Wrong expectation; normalise before validate | Fixed from SRC-11 E9; AC-77 |
| 13 | R-09 / R-16 | 5 | Expiry audit timestamp and email | Fixed from SRC-11 E10; AC-73 |
| 14 | R-02 | 5 / 6 | Length unit, trimming, one-sided boundaries | Fixed from SRC-11 E11; AC-98, AC-99, AC-100 |
| 15 | R-08 / R-15 | 2 | Correct password on delete screen and the counter | Fixed from SRC-11 E12; AC-109 |
| 16 | R-07 | 5 | Tablet and phone without app | Fixed from SRC-11 E13; AC-111 |
| 17 | R-07 / R-13 | 5 | Over-limit request and old link | Fixed from SRC-11 E14; AC-106 |
| 18 | T-09 | 6 | More invalid email forms untested | Fixed: AC-10 |
| 19 | R-04 | 6 | Only Guam tested; Minor Outlying Islands | Fixed from SRC-11 E15; AC-101, AC-102 |

Round 3: all 19 findings changed the SPEC. The changes were checked against SRC-11 by the drafting agent, not by a fresh reviewer.

## Re-stamps

| Date | From | To | Note |
| --- | --- | --- | --- |
| 2026-09-29 | sha256:8a3682e2fab434476609ca3e | sha256:dfc6a2c96d4b0aabcc43f124 | Round 3 fixes from SRC-11 (E1-E15) and 5 test/consistency fixes; checked against sources by the drafting agent, not a fresh reviewer |
