---
review_of: SPEC-2
version: 0.1.0
reviewed_hash: sha256:19c596dc52773edabc30f03b
---

# Review SPEC-2 0.1.0

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-29
- Files read: specs/spec/SPEC-2-xac-minh-danh-tinh-va-ly-lich.md, specs/brief/BRIEF-1-filipinaconnect-us-mvp.md, specs/src/SRC-1-developer-project-brief-rev-8-31-26.md, specs/src/SRC-3-user-journey-rev-8-26-26.md, specs/src/SRC-6-owner-answers-spec-1-spec-2-2026-09-29.md, specs/src/SRC-7-owner-answers-spec-2-follow-up-2026-09-29.md, reference/spec-logic.md
- Checked with no finding: T-01..T-07, R-09, R-10, R-16, R-03 count (AC-12/AC-13), R-12 list; no layer leak.

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | R-05 | 2 / 3 | Purchase gate ignores identity status; sources put "Verification Approved" before purchase (SRC-1#L97-L99, SRC-3#L34-L35) | Identity Declined or AwaitingAdmin, BG Passed, man buys | Owner question B1 |
| 2 | R-04 | 1 Unsupported | "được bấm mua gói" not in sources; "trong lúc nộp lại" narrowed to unlimited Lobby stay | Declined with no attempts left stays in Lobby forever | Owner question B2 |
| 3 | R-07 | 4 Hidden decision | Who decides pass/fail of Certn, and criteria, unsourced | Minor misdemeanour, no registry hit | Owner question B3 |
| 4 | R-06 / DF-09 | 4 Hidden decision | Assumes Certn reports application and payment | Certn reports only the result | Owner question B4 (spike on Certn API) |
| 5 | X-01..X-08 | 2 Missing path | Refused cells in the state grid not stated or tested | Double submit; second Certn fee | Owner question B5 |
| 6 | R-02 | 2 Missing path | Service/Certn never answers or errors | Maria stuck in Submitted | Owner question B6 |
| 7 | R-02 / AC-07 | 5 / 6 | Relation of service result to admin decision; CENOMAR check not observable | Admin approves negative result without CENOMAR | Owner question B7 |
| 8 | R-02 / P-06 | 2 Concurrency | Two admins decide at once | Approve and Decline in the same second | Owner question B8 |
| 9 | R-07 / R-08 | 2 Repetition | Duplicate or late callbacks; flag created once | "failed" twice → 2 flags | Owner question B9 |
| 10 | Permissions | 2 Missing path | Certn and verification service not in matrix; forged results | john posts a fake "passed" | Owner question B10 |
| 11 | R-03 / S-05 | 2 Missing path | "liên hệ hỗ trợ" leads nowhere | Maria after 4th decline | Owner question B11 |
| 12 | R-01 / X-05 | 2 Missing path | Incomplete resubmission and the counter | Resubmit with no selfie at resubmissions = 2 | Owner question B12 |
| 13 | DF-01 | 2 Missing path | Earlier submissions overwritten or kept | Admin compares attempt 4 with 1 | Owner question B13 |
| 14 | AC-05 vs R-01 | 3 / 6 | Man attaching CENOMAR: whole submission refused or file dropped | Two implementations both pass | Owner question B14 |
| 15 | P-03 / R-06 | 5 Missing state | No identity precondition for starting Certn | NotSubmitted man opens Certn via link | Owner question B1 |
| 16 | P-04 | 5 Ambiguity | Any admin can open confidential records | Moderation admin opens CENOMAR | Owner question B15 |
| 17 | R-14 | 4 Hidden decision | What counts as "mở"; who reads the audit log | Download without opening | Owner question B16 |
| 18 | AC-35 / AC-36 | 5 Missing unit | Timestamps without time zone | Manila vs Texas admins | Owner question B17 |
| 19 | AC-36 | 6 Weak AC | Resubmission, Declined and BG changes not proven logged | Build never logs BG changes | Fixed: AC-41, AC-42 added |
| 20 | R-12 | 4 Hidden decision | Background indicators only on Passed is a choice | Failed check shows "Completed"? | Owner question B18 |
| 21 | T-08 / AC-14 | 1 (inference) / 6 | AwaitingAdmin and Approved Lobby access inferred; untested | Approved man locked out | Owner question B19; ACs added after answer |
| 22 | R-05 | 2 Missing path | Website purchase bypasses the gate | Man pays on website directly | Owner question B20 |
| 23 | AC-18 | 6 Weak AC | Refusal for InProgress has no observable message | Silent refusal | Owner question B21 |
| 24 | R-08 | 2 Missing path | Failed is permanent; admin action on flag undefined | Certn mix-up corrected later | Owner question B22 |
| 25 | R-04 / R-11 vs Out of scope | 3 Contradiction | Gates here, but Out of scope sends Lobby/profile away; women's Lobby gate unowned | Maria AwaitingAdmin opens Lobby | Owner question B23 |
| 26 | Scope | 5 Undefined term | "Active" from SPEC-1 (not a parent); suspension/deletion mid-verification | Maria suspended while AwaitingAdmin | Owner question B24 (a SPEC can only have a BRIEF as parent; "Active" is referenced in text) |
| 27 | R-13 | 2 Missing path | Can members see their own documents | Maria asks for her passport | Owner question B25 |
| 28 | P-01 Admin N | 4 Hidden decision | Assisted submission by support forbidden without source | Support uploads for member | Owner question B26 |
| 29 | AC-11 / AC-37 | 6 Weak AC | Whitespace-only reason; AC-37 Then not observable | Reason " " accepted | Fixed: AC-37 made observable; whitespace in owner question B27 |
| 30 | SRC-6, SRC-7 | 1 (process) | Owner-answer sources are draft | Approval on unapproved answers | No change: approved with the SPEC via `--with-sources` |

## Top three

1. R-05 lets a man buy with identity Declined or AwaitingAdmin (#1).
2. Certn pass/fail decision and notices are unsourced (#3, #4).
3. R-04 exceeds its source; exhausted Declined man has no path (#2, #11).

## Round 2 (fresh-context reviewer, 2026-09-29, after SRC-8)

Files read: SPEC-2, BRIEF-1, SRC-1, SRC-3, SRC-6, SRC-7, SRC-8, spec-logic.md.

| # | Item | Category | Finding | Resolution |
| --- | --- | --- | --- | --- |
| 1 | X-06, R-18, R-21 | 2 | Late service result of an earlier submission accepted for a resubmission; submittedAt restart | Open: D2 (severe) |
| 2 | R-05, T-08 | 2 / 4 | No outcome for a Declined or NotSubmitted man who tries to buy | Open: D3 |
| 3 | R-18 | 1 / 4 | "sau 48 giờ" / "quá 14 ngày" written as inclusive | Open: D1 |
| 4 | R-06, X-09 | 2 | Second Certn application before acknowledgement; ack dropped after Decline | Open: D4 |
| 5 | P-05, P-09 | 6 / 2 | No AC for a non-verification admin deciding | Fixed: AC-79, AC-80 |
| 6 | R-25 | 2 | Deletion with background check pending or identity Declined | Open: D5 |
| 7 | R-12 | 2 | Background indicators shown without identity Approved | Open: D6 |
| 8 | R-19 | 2 | adminNote may be whitespace | Open: D7 |
| 9 | R-03, X-06 | 2 | Two resubmissions at once | Open: D8 |
| 10 | R-18 | 2 | Repeated 14-day flags | Open: D9 |
| 11 | X-06 | 4 | Full document set required on resubmission | Open: D10 |
| 12 | R-05, R-06 | 1 | ReportReceived message and Passed-not-Approved message unsourced | Open: D11 |
| 13 | R-08 | 5 / 6 | Failed purchase refusal not observable | Open: D12 |
| 14 | R-11 | 4 | Profile gate for women only | Open: D13 |
| 15 | DF-09 | 3 (inference) | 0–3 range vs admin-granted attempts | No change here: the admin SPEC defines the grant (SRC-8#L52) and revises DF-09 if needed |
| 16 | R-18 | 5 | Maximum delay after a deadline | Open: D14 |
| 17 | X-07, X-08 | 6 | Cancelled not audited | Fixed: R-15 on X-07/X-08; AC-75 checks the audit |
| 18 | AC-73 | 6 | Claimed P-06 without proving it | Fixed: AC-73 covers P-01; AC-78 covers P-06 |
| 19 | R-20 | 6 | No AC for concurrent background-check decisions | Fixed: AC-81 |
| 20 | R-14 | 2 | Refused access attempts not logged | Open: D15 |
| 21 | R-01 | 5 | ID types, formats, size | Open: D16 |

Round 2: 4 findings changed the SPEC; open owner questions D1–D16 are not marked in the SPEC and do not block approval. "Không có kết quả" requires adminNote: confirmed (SRC-9#L21-L22).

Round 2 follow-up: the owner answered D1–D16 "theo đề xuất" (SRC-10#L54); all were written into the SPEC.

## Round 3 (fresh-context reviewer, 2026-09-29, targeted at items citing SRC-9 and SRC-10)

| # | Item | Category | Finding | Resolution |
| --- | --- | --- | --- | --- |
| 1 | R-05, AC-48 | 4 | "Đang xử lý" for Applying unsourced; contradicts R-06 resume | Fixed: tapping buy in Applying resumes the same Certn form (R-05 (6), R-06); AC-48 |
| 2 | R-06 | 2 | Applying has no time limit | Fixed from SRC-11 F1: back to NotStarted after 7 days; X-18, DF-18, AC-111 |
| 3 | R-06 | 3 | Applying and Declined at once | Fixed from SRC-11 F2: may resume the started form; AC-110 |
| 4 | R-05 order | 4 | Declined checked before Failed | Fixed from SRC-11 F3: Failed first; AC-109 |
| 5 | R-05 vs R-03 | 3 | "Hãy nộp lại" shown with no resubmissions left | Fixed from SRC-11 F4; AC-108 |
| 6 | R-19 | 6 | No refusal AC for "không có kết quả" without a note | Fixed: AC-106 |
| 7 | R-18 / R-21 | 2 | Result arriving after 48 h before the move | Fixed from SRC-11 F5: ignored; AC-104 |
| 8 | R-18 / R-21 | 5 | Error for an older submission | Fixed from SRC-11 F6; AC-105 |
| 9 | R-14 | 1 | Refused member access not logged | Fixed from SRC-11 F7; AC-83 |
| 10 | R-27 | 5 | MB undefined | Fixed from SRC-11 F8: 10 × 1024 × 1024 byte; AC-07, AC-08 |
| 11 | R-27 | 5 | Selfie as PDF; two-sided IDs | Fixed from SRC-11 F9; AC-10, AC-102, AC-103 |
| 12 | R-05 (1) | 1 | Website message applied in the app | Fixed from SRC-11 F10: in app, go to the verification screen; AC-107 |
| 13 | AC-48..AC-50, AC-53 | 6 | Identity state missing; website outcome unstated | Fixed: AC-48, AC-49, AC-50, AC-53 |
| 14 | R-25 | 4 | ReportReceived cancelled on deletion | Confirmed from SRC-11 F11 (email blocked forever, SPEC-1 R-11); no change |
| 15 | SRC-9, SRC-10 | 1 (process) | Sources still draft | No change: approved with SPEC-2 via `--with-sources` |

Round 3: 13 findings changed the SPEC. The changes were checked against SRC-11 by the drafting agent, not by a fresh reviewer.

## Re-stamps

| Date | From | To | Note |
| --- | --- | --- | --- |
| 2026-09-29 | sha256:b636f18f1b3106c93f959686 | sha256:19c596dc52773edabc30f03b | Round 3 fixes from SRC-11 (F1-F11) and 3 test/consistency fixes; checked against sources by the drafting agent, not a fresh reviewer |
