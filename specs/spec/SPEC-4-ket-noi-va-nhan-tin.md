---
id: SPEC-4
title: Kết nối và nhắn tin
version: 0.4.0
status: approved
owner: Honda
flow: project
risk: high
review: specs/review/SPEC-4-0.4.0.md
parent: [BRIEF-1@0.1.0]
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:610722abb75f7f3ff26bc9c5
---

# SPEC-4: Kết nối và nhắn tin

<!-- Skyline SPEC (project flow): the exact logic. One row, one fact. Bare codes (R-01) are this SPEC; anything else is qualified (BRIEF-1/C-02). Every rule has a Source and at least one AC. Each unknown becomes a CLARIFY marker; never guess. -->

## 1. Scope

Implements BRIEF-1/C-20, BRIEF-1/C-21 và BRIEF-1/C-22, cùng phần audit log của các sự kiện này trong BRIEF-1/C-40 và ràng buộc BRIEF-1/K-06: nam gửi yêu cầu liên hệ, nữ chấp nhận hoặc từ chối, nhắn tin trong app sau khi nữ chấp nhận, kết thúc kết nối, và hậu quả của việc chặn (SPEC-6) lên yêu cầu và kết nối. Điều kiện hồ sơ và giáo dục văn hóa nằm ở SPEC-3; chặn, báo cáo, cảnh báo lừa đảo ở SPEC an toàn; thông báo ở SPEC thông báo; thao tác của admin ở SPEC admin.

## 2. Glossary

| Code | Term | Definition | Source |
| --- | --- | --- | --- |
| T-01 | Yêu cầu liên hệ | Yêu cầu một nam gửi tới một nữ để được trò chuyện trong app; không kèm lời nhắn | SRC-1#L105, SRC-1#L130, SRC-15#L21, SRC-15#L36 |
| T-02 | Kết nối | Cặp nam–nữ mà nữ đã chấp nhận yêu cầu liên hệ; chỉ trong kết nối Open mới nhắn tin được | SRC-1#L106-L108, SRC-1#L138, SRC-1#L142-L144 |
| T-03 | Nam có gói | Nam có gói thành viên còn hiệu lực (mua theo SPEC thanh toán) | BRIEF-1/C-11, SRC-12#L21, SRC-12#L33 |
| T-04 | Nam đủ điều kiện gửi | Nam có gói, có hồ sơ hoàn chỉnh, giáo dục văn hóa hoàn tất (SPEC-3), tài khoản Active và xác minh danh tính Approved tại lúc gửi | SRC-15#L19, SRC-15#L36, SRC-16#L29, SRC-16#L34 |
| T-05 | Ngày UTC | Khoảng [00:00:00, 24:00:00) UTC của một ngày | SRC-15#L20, SRC-15#L37 |
| T-06 | Mốc thời gian | Một thời hạn được coi là đã qua khi thời gian đã trôi ≥ đúng thời hạn đó | SRC-10#L37, SRC-10#L54 |

## 3. Data

| Code | Field | Type | Required | Constraint | Source |
| --- | --- | --- | --- | --- | --- |
| DF-01 | ContactRequest.status | enum {Pending, Accepted, Declined, Withdrawn, Expired} | yes | máy trạng thái ContactRequest | SRC-1#L130-L131, SRC-15#L23-L25 |
| DF-02 | ContactRequest.sentAt | thời điểm UTC | yes | R-03, R-06 | SRC-15#L20, SRC-15#L23 |
| DF-03 | ContactRequest.decidedAt, ContactRequest.decidedBy | thời điểm UTC; nữ, nam hoặc "hệ thống" | khi rời Pending | R-06, R-09, R-17, R-22 | SRC-15#L26, SRC-16#L21 |
| DF-04 | Connection.status | enum {Open, Ended} | yes | máy trạng thái Connection | SRC-1#L108, SRC-15#L29 |
| DF-05 | Connection.endedBy, Connection.endedAt | thành viên hoặc "hệ thống", thời điểm UTC | khi Ended | R-13, R-18, R-19, R-22 | SRC-15#L29, SRC-16#L31 |
| DF-06 | Message.text | văn bản, 1–2000 ký tự đếm theo ký tự Unicode sau chuẩn hóa NFC, giữ nguyên dấu cách đầu và cuối | yes | R-10 | SRC-15#L27, SRC-16#L27 |
| DF-07 | Message.sender, Message.sentAt | thành viên, thời điểm UTC | yes | R-10, R-14 | SRC-15#L30 |
| DF-08 | RequestBlock | nam, nữ, lý do (từ chối, rút lại, hết hạn, kết thúc, chặn), thời điểm hết chặn (không có nếu chặn vĩnh viễn) | khi R-07, R-08, R-13, R-21 hoặc R-22 tạo | R-07, R-08, R-13, R-21, R-22 | SRC-15#L24-L25, SRC-15#L29, SRC-16#L24, SRC-20#L22 |

## 4. States

| Code | Machine | State | Kind |
| --- | --- | --- | --- |
| S-01 | ContactRequest | Pending | initial |
| S-02 | ContactRequest | Accepted | terminal |
| S-03 | ContactRequest | Declined | terminal |
| S-04 | ContactRequest | Withdrawn | terminal |
| S-05 | ContactRequest | Expired | terminal |
| S-06 | Connection | Open | initial |
| S-07 | Connection | Ended | terminal |

| Code | From | Event | Guard | To | Rules |
| --- | --- | --- | --- | --- | --- |
| X-01 | S-01 | accept | not R-06 | S-02 | R-09, R-18, R-17 |
| X-02 | S-01 | decline | not R-06 | S-03 | R-07, R-18, R-17 |
| X-03 | S-01 | withdraw | not R-06 | S-04 | R-08, R-18, R-17 |
| X-04 | S-01 | expire | | S-05 | R-06, R-17 |
| X-05 | S-01 | plan_lapsed | | S-05 | R-15, R-17 |
| X-06 | S-01 | member_removed | | S-05 | R-19, R-17 |
| X-07 | S-06 | end_connection | | S-07 | R-13, R-18, R-17 |
| X-08 | S-06 | member_removed | | S-07 | R-19, R-17 |
| X-09 | S-01 | blocked | not R-06 | S-05 | R-22, R-17 |
| X-10 | S-06 | blocked | | S-07 | R-22, R-17 |
| X-11 | S-01 | profile_incomplete_by_admin | | S-05 | R-24, R-17 |

## 5. Rules

| Code | Rule | Source |
| --- | --- | --- |
| R-01 | Chỉ nam gửi được yêu cầu liên hệ, và chỉ khi là nam đủ điều kiện gửi (bảng quyết định R-01); gói còn hiệu lực gồm cả gói đã hủy nhưng kỳ đã trả tiền chưa hết; nữ không gửi được yêu cầu liên hệ; không đủ điều kiện thì từ chối và hiện bước còn thiếu | SRC-1#L99-L105, SRC-12#L27, SRC-15#L19, SRC-15#L36, SRC-16#L29, SRC-16#L34, BRIEF-1/C-20 |
| R-02 | Nam gửi yêu cầu từ hồ sơ hoàn chỉnh của một nữ mà nam đang xem được theo SPEC-3; nữ đó phải có giáo dục văn hóa hoàn tất | SRC-1#L105, SRC-12#L27, SRC-12#L33 |
| R-03 | Mỗi nam có tối đa 15 yêu cầu liên hệ được tạo trong một ngày UTC (T-05); yêu cầu đã rút lại vẫn tính, lần gửi bị từ chối không tính; khi nhiều lần gửi đến cùng lúc, giới hạn vẫn được giữ đúng (không bao giờ tạo quá 15); yêu cầu thứ 16 trong ngày bị từ chối; lượt đếm về 0 lúc 00:00:00 UTC | SRC-15#L20, SRC-15#L37, SRC-16#L28, SRC-16#L34 |
| R-04 | Yêu cầu liên hệ không kèm lời nhắn | SRC-15#L21, SRC-15#L36 |
| R-05 | Khi nhận yêu cầu, nữ thấy hồ sơ hoàn chỉnh của nam, huy hiệu xanh và các chỉ báo xác minh (SPEC-2) | SRC-15#L22, SRC-15#L36, BRIEF-1/C-21 |
| R-06 | Yêu cầu ở Pending được coi là hết hạn từ đúng mốc 336 giờ (14 ngày) kể từ sentAt mà nữ chưa trả lời: từ mốc đó, chấp nhận, từ chối và rút lại đều bị từ chối, bất kể hệ thống đã chuyển yêu cầu sang Expired hay chưa; việc chuyển sang Expired diễn ra theo N-01 và ghi người thực hiện là "hệ thống" | SRC-15#L23, SRC-15#L36, SRC-16#L21, SRC-16#L30, SRC-16#L34 |
| R-07 | Khi nữ từ chối, nam không bao giờ gửi lại yêu cầu cho nữ đó được | SRC-1#L131, SRC-15#L24, SRC-15#L36, BRIEF-1/C-21 |
| R-08 | Nam rút lại được yêu cầu của mình khi yêu cầu ở Pending; sau khi rút lại, nam không gửi lại yêu cầu cho nữ đó được cho tới khi đã qua mốc 720 giờ (30 ngày) kể từ lúc rút | SRC-15#L25, SRC-15#L36, SRC-16#L30, SRC-16#L34 |
| R-09 | Chỉ nữ nhận yêu cầu mới chấp nhận hoặc từ chối được yêu cầu đó; nữ bấm "Chấp nhận" là đồng ý trò chuyện: yêu cầu chuyển sang Accepted, một kết nối Open được tạo và hai người nhắn tin được với nhau; audit ghi việc đồng ý kèm nữ, nam và thời điểm UTC | SRC-1#L106-L108, SRC-1#L130-L131, SRC-1#L142-L144, SRC-1#L181-L182, SRC-15#L26, SRC-15#L36, BRIEF-1/C-21 |
| R-10 | Chỉ hai thành viên của một kết nối Open mới nhắn tin được trong kết nối đó; mỗi tin là văn bản có từ 1 đến 2000 ký tự (DF-06); tin chỉ gồm ký tự trắng bị từ chối; dấu cách đầu và cuối được giữ nguyên; không gửi được ảnh hay tệp | SRC-1#L108, SRC-1#L142-L144, SRC-15#L27, SRC-15#L36, SRC-16#L27, SRC-16#L34, BRIEF-1/C-22 |
| R-11 | Hệ thống không bao giờ tự cung cấp hay trao đổi email, số điện thoại hoặc tài khoản mạng xã hội của một thành viên cho thành viên kia | SRC-1#L142-L143, BRIEF-1/K-06 |
| R-12 | Khi một tin nhắn chứa số điện thoại, email hoặc tài khoản mạng xã hội, tin vẫn được gửi, và cả người gửi lẫn người nhận thấy cảnh báo lừa đảo; cách phát hiện và nội dung cảnh báo thuộc SPEC an toàn | SRC-1#L163, SRC-15#L28, SRC-15#L36 |
| R-13 | Mỗi thành viên của một kết nối Open bấm được "Kết thúc kết nối"; người ngoài kết nối thì bị từ chối; kết nối chuyển sang Ended, không ai nhắn tin được nữa, và nam không bao giờ gửi lại yêu cầu cho nữ đó được, dù bên nào kết thúc | SRC-15#L29, SRC-15#L36, SRC-16#L25, SRC-16#L34 |
| R-14 | Mọi tin nhắn được lưu lại trong thời hạn lưu giữ do luật sư của khách quyết định; sau khi kết nối Ended, cả hai thành viên vẫn đọc được lịch sử tin nhắn; thành viên không xóa hay sửa được tin đã gửi | SRC-1#L183, SRC-15#L30, SRC-15#L36, SRC-16#L26, SRC-16#L34, BRIEF-1/K-08 |
| R-15 | Khi gói của nam hết hạn, các kết nối Open của nam vẫn nhắn tin được; mọi yêu cầu Pending của nam chuyển sang Expired ngay; nam không gửi được yêu cầu mới (R-01) | SRC-15#L31, SRC-15#L36, SRC-16#L23, SRC-16#L34 |
| R-16 | Mỗi cặp nam–nữ có tối đa một yêu cầu ở Pending hoặc một kết nối Open; gửi yêu cầu khi cặp đó đã có yêu cầu Pending hoặc kết nối Open thì từ chối; khi nhiều lần gửi cho cùng cặp đến cùng lúc, chỉ một lần thành công | SRC-15#L33, SRC-15#L36, SRC-16#L28, SRC-16#L34 |
| R-17 | Hệ thống ghi audit log cho mỗi lần gửi, chấp nhận (đồng ý), từ chối, rút lại, hết hạn yêu cầu và mỗi lần kết thúc kết nối; mỗi bản ghi có nam, nữ, người thực hiện ("hệ thống" khi hết hạn hoặc do R-15, R-19; người chặn khi do R-22) và thời điểm UTC | SRC-1#L180-L182, SRC-16#L21, SRC-16#L34, SRC-20#L39, SRC-20#L43, BRIEF-1/C-40 |
| R-18 | Khi hai thao tác trên cùng một yêu cầu Pending, hoặc trên cùng một kết nối Open (kết thúc và gửi tin, hay cả hai bên cùng kết thúc), đến cùng lúc, thao tác được ghi trước thắng; thao tác sau bị từ chối; khi cả hai bên cùng kết thúc, endedBy là người được ghi trước | SRC-16#L19, SRC-16#L31, SRC-16#L34 |
| R-19 | Khi một bên xóa tài khoản, bị đình chỉ, bị cấm hoặc bị thu hồi xác minh danh tính (SPEC-8): mọi yêu cầu Pending của người đó chuyển sang Expired; mọi kết nối Open của người đó chuyển sang Ended; tin nhắn vẫn được lưu theo R-14; việc kết thúc và hết hạn do quy tắc này không tạo lệnh cấm gửi lại (R-13, R-21 không áp dụng); khi cả hai đủ điều kiện trở lại, nam gửi được yêu cầu mới | SRC-16#L20, SRC-16#L34, SRC-25#L23, SRC-25#L40, SRC-26#L32, SRC-26#L34 |
| R-20 | Chấp nhận, từ chối hay rút lại một yêu cầu không còn ở Pending bị từ chối và hiện "Yêu cầu này không còn hiệu lực"; kết thúc một kết nối đã Ended bị từ chối và hiện "Kết nối đã kết thúc" | SRC-16#L22, SRC-16#L34 |
| R-21 | Với yêu cầu Declined hoặc Expired, nam đều thấy "Không được chấp nhận" và không thấy lý do, trừ yêu cầu hết hạn do chặn: trong lúc Block còn Active nam không thấy yêu cầu đó, sau khi bỏ chặn nam thấy "Không được chấp nhận", dù ai là người chặn; sau khi yêu cầu Expired, nam gửi lại cho nữ đó được khi đã qua mốc 720 giờ (30 ngày) kể từ lúc hết hạn, trừ khi R-22 áp dụng; nữ không còn thấy các yêu cầu Withdrawn hoặc Expired | SRC-15#L24, SRC-16#L24, SRC-16#L34, SRC-20#L22, SRC-21#L21, SRC-21#L27 |
| R-22 | Khi một trong hai người chặn người kia (SPEC-6), việc chặn luôn được áp dụng lên trạng thái mới nhất của cặp đó, kể cả khi nó đến ngay sau một thao tác chấp nhận, rút lại, từ chối hay kết thúc: yêu cầu Pending chưa qua mốc 336 giờ chuyển sang Expired và kết nối Open chuyển sang Ended, với người thực hiện là người chặn; yêu cầu Pending đã qua mốc 336 giờ thì hết hạn do "hệ thống" tại mốc đó (R-06); sau mọi lần chặn, kể cả khi lúc chặn hai người chưa có yêu cầu hay kết nối nào, và kể cả sau khi bỏ chặn, nam không bao giờ gửi yêu cầu cho nữ đó được, dù ai là người chặn; lệnh cấm này thay cho thời hạn 30 ngày của R-08 và 720 giờ của R-21 | SRC-20#L22, SRC-20#L39, SRC-20#L43, SRC-21#L19-L20, SRC-21#L22-L24, SRC-21#L27 |
| R-23 | Mọi lần nam bị từ chối gửi yêu cầu vì R-07, R-08, R-13, R-21 hoặc R-22 đều hiện cùng một thông báo "Không thể gửi yêu cầu cho người này" | SRC-21#L25, SRC-21#L27 |
| R-24 | Khi hồ sơ của một bên không còn hoàn chỉnh vì admin gỡ ảnh hoặc phần giới thiệu (SPEC-3 bản sửa đổi, SPEC-9), mọi yêu cầu Pending của người đó chuyển sang Expired; kết nối Open vẫn giữ; việc hết hạn này không tạo lệnh cấm gửi lại (R-13, R-21 không áp dụng); khi cả hai đủ điều kiện trở lại, nam gửi được yêu cầu mới | SRC-27#L30, SRC-27#L43, SRC-28#L19, SRC-28#L45 |

<!-- decision: R-01 -->
| C: Nam có gói | C: Hồ sơ hoàn chỉnh | C: Giáo dục văn hóa hoàn tất | C: Tài khoản Active và xác minh Approved | A: Gửi yêu cầu |
| --- | --- | --- | --- | --- |
| Y | Y | Y | Y | cho gửi |
| Y | Y | Y | N | từ chối |
| Y | Y | N | - | từ chối |
| Y | N | - | - | từ chối |
| N | - | - | - | từ chối |

## 6. Permissions

<!-- Columns after Action are actors: BRIEF-n/A-nn. Cells: Y, N, or a rule code (R-nn) meaning "allowed when that rule holds". -->

| Code | Action | BRIEF-1/A-01 Nam Mỹ | BRIEF-1/A-02 Nữ Philippines | BRIEF-1/A-03 Admin |
| --- | --- | --- | --- | --- |
| P-01 | Gửi yêu cầu liên hệ | R-01 | N | N |
| P-02 | Chấp nhận hoặc từ chối yêu cầu | N | R-09 | N |
| P-03 | Rút lại yêu cầu của mình | R-08 | N | N |
| P-04 | Nhắn tin | R-10 | R-10 | N |
| P-05 | Kết thúc kết nối | R-13 | R-13 | N |
| P-06 | Xóa hoặc sửa tin đã gửi | N | N | N |
| P-07 | Xem email, số điện thoại, mạng xã hội của người kia | N | N | N |
| P-08 | Xem danh sách yêu cầu liên hệ và kết nối | N | N | Y |

## 7. Flows

### F-01 Gửi và chấp nhận yêu cầu

1. Nam đủ điều kiện mở hồ sơ hoàn chỉnh của một nữ đã hoàn tất giáo dục văn hóa và bấm gửi yêu cầu (R-01, R-02, R-03, R-04, R-16).
2. Yêu cầu ở Pending; audit ghi việc gửi (R-17).
3. Nữ mở yêu cầu, thấy hồ sơ hoàn chỉnh, huy hiệu và chỉ báo của nam (R-05).
4. Nữ bấm "Chấp nhận" trước mốc 336 giờ → Accepted, kết nối Open, audit ghi việc đồng ý (X-01, R-09).
5. Hai người nhắn tin bằng văn bản (R-10, R-11, R-14).

Nhánh lỗi:

- 1a. Nam không đủ điều kiện → từ chối, hiện bước còn thiếu (R-01).
- 1b. Đã có 15 yêu cầu trong ngày → từ chối (R-03).
- 1c. Cặp đã có yêu cầu Pending hoặc kết nối Open, hoặc nam đang bị chặn gửi cho nữ đó → từ chối, hiện "Không thể gửi yêu cầu cho người này" (R-16, R-07, R-08, R-13, R-21, R-22, R-23).
- 4a. Nữ từ chối → Declined; nam thấy "Không được chấp nhận" (X-02, R-07, R-21).
- 4b. Nam rút lại → Withdrawn (X-03, R-08).
- 4c. Đã qua mốc 336 giờ → mọi thao tác bị từ chối; yêu cầu chuyển Expired (R-06, X-04, R-21).
- 4d. Gói của nam hết hạn, hoặc một bên bị xóa, đình chỉ, cấm → Expired (X-05, X-06, R-15, R-19); một bên chặn bên kia → Expired với người thực hiện là người chặn (X-09, R-22).
- 4e. Thao tác trên yêu cầu không còn Pending → "Yêu cầu này không còn hiệu lực" (R-20).
- 5a. Tin chứa số điện thoại, email hoặc mạng xã hội → vẫn gửi, cả hai thấy cảnh báo (R-12).

### F-02 Kết thúc kết nối

1. Một thành viên của kết nối bấm "Kết thúc kết nối" (R-13).
2. Kết nối Ended; không ai nhắn tin được; cả hai vẫn đọc được tin cũ; audit ghi việc kết thúc (X-07, R-14, R-17).

Nhánh lỗi:

- 1a. Người ngoài kết nối bấm kết thúc → từ chối (R-13).
- 1b. Kết nối đã Ended → "Kết nối đã kết thúc" (R-20).
- 1c. Một bên bị xóa, đình chỉ hoặc cấm → Ended do "hệ thống" (X-08, R-19); một bên chặn bên kia → Ended với người thực hiện là người chặn (X-10, R-22).

## 8. Acceptance criteria

Mọi thời điểm trong mục này là UTC.

| Code | Given | When | Then | Covers |
| --- | --- | --- | --- | --- |
| AC-01 | Nam john@example.com có gói, hồ sơ hoàn chỉnh, giáo dục văn hóa hoàn tất, tài khoản Active, xác minh Approved; đang xem hồ sơ hoàn chỉnh của maria@example.com (giáo dục văn hóa hoàn tất) | Bấm gửi yêu cầu liên hệ lúc 2026-10-10 09:00:00 | Yêu cầu được tạo ở Pending, sentAt = 2026-10-10 09:00:00 | R-01, R-02, P-01, F-01 |
| AC-02 | Nam john@example.com có gói, hồ sơ hoàn chỉnh, chưa hoàn tất giáo dục văn hóa | Gửi yêu cầu tới maria@example.com | Bị từ chối; màn giáo dục văn hóa được đưa ra | R-01 |
| AC-03 | Nam Freemium john@example.com | Gửi yêu cầu tới maria@example.com | Bị từ chối; màn mua gói được đưa ra; không có yêu cầu nào được tạo | R-01, P-01 |
| AC-04 | Nữ maria@example.com đang xem hồ sơ nam peter@example.com | Tìm cách gửi yêu cầu liên hệ tới peter | Bị từ chối; không có chức năng gửi yêu cầu cho nữ | R-01, P-01 |
| AC-05 | Nam john@example.com đủ điều kiện gửi | Gửi yêu cầu tới anna@example.com, nữ có hồ sơ hoàn chỉnh nhưng chưa hoàn tất giáo dục văn hóa, qua một link trực tiếp | Bị từ chối; không có yêu cầu nào được tạo | R-02 |
| AC-06 | Nam john@example.com đủ điều kiện, đã có 14 yêu cầu ngày 2026-10-10 | Gửi yêu cầu thứ 15 lúc 20:00:00 | Yêu cầu được tạo | R-03 |
| AC-07 | Như AC-06, đã có 15 yêu cầu ngày 2026-10-10 | Gửi yêu cầu thứ 16 lúc 23:59:59.500, rồi gửi lại lúc 2026-10-11 00:00:00 | Lần lúc 23:59:59.500 bị từ chối; lần lúc 2026-10-11 00:00:00 được tạo | R-03 |
| AC-08 | Nam john@example.com đủ điều kiện | Mở màn gửi yêu cầu tới maria@example.com | Không có ô nhập lời nhắn; yêu cầu gửi đi không chứa văn bản nào của john | R-04 |
| AC-09 | john@example.com (huy hiệu xanh, chỉ báo "Identity Verified", "Background Screening Completed", "Sex Offender Registry Search Completed") gửi yêu cầu tới maria@example.com | maria mở yêu cầu | maria thấy hồ sơ hoàn chỉnh của john, huy hiệu xanh và đúng 3 chỉ báo đó | R-05, F-01 |
| AC-10 | Yêu cầu của john tới maria gửi lúc 2026-10-01 10:00:00, vẫn Pending | maria bấm "Chấp nhận" lúc 2026-10-15 09:59:59 | Yêu cầu chuyển sang Accepted | R-06, X-01 |
| AC-11 | Yêu cầu của john tới maria gửi lúc 2026-10-01 10:00:00, vẫn Pending, hệ thống chưa chuyển sang Expired | maria bấm "Chấp nhận" lúc 2026-10-15 10:00:30 | Bị từ chối; không có kết nối nào được tạo | R-06 |
| AC-12 | Như AC-11 | Hệ thống xử lý hết hạn | Yêu cầu chuyển sang Expired trước 2026-10-15 10:05:00; audit ghi người thực hiện là "hệ thống" | R-06, X-04, R-17 |
| AC-13 | Yêu cầu của john tới maria ở Pending | maria bấm "Từ chối" lúc 2026-10-02 08:00:00 | Yêu cầu chuyển sang Declined; john thấy "Không được chấp nhận" và không thấy lý do nào; audit có bản ghi từ chối lúc 08:00:00 | R-07, R-21, R-17, X-02, P-02, F-01 |
| AC-14 | maria đã từ chối yêu cầu của john | Một năm sau john gửi lại yêu cầu tới maria | Bị từ chối; không có yêu cầu nào được tạo | R-07 |
| AC-15 | Yêu cầu của john tới maria ở Pending | john rút lại lúc 2026-10-01 10:00:00 | Yêu cầu chuyển sang Withdrawn; audit có bản ghi rút lại lúc 10:00:00; maria không còn thấy yêu cầu | R-08, R-21, R-17, X-03, P-03 |
| AC-16 | Như AC-15 | john gửi lại yêu cầu tới maria lúc 2026-10-31 09:59:59, rồi lúc 2026-10-31 10:00:00 | Lần lúc 09:59:59 bị từ chối; lần lúc 10:00:00 được tạo | R-08 |
| AC-17 | Yêu cầu của john tới maria ở Pending | maria tìm cách rút lại yêu cầu đó | Bị từ chối; yêu cầu vẫn Pending | P-03 |
| AC-18 | Yêu cầu của john tới maria ở Pending | maria bấm "Chấp nhận" lúc 2026-10-02 08:00:00 | Yêu cầu chuyển sang Accepted; có một kết nối Open giữa john và maria; audit có bản ghi đồng ý của maria lúc 08:00:00 | R-09, X-01, P-02, F-01 |
| AC-19 | Yêu cầu của john tới maria ở Pending | john, rồi nữ anna@example.com, bấm "Chấp nhận" yêu cầu đó | Cả hai bị từ chối; yêu cầu vẫn Pending | R-09, P-02 |
| AC-20 | john và maria có kết nối Open | john gửi "Chào Maria" | Tin được gửi; maria thấy "Chào Maria" | R-10, P-04, F-01 |
| AC-21 | Yêu cầu của john tới maria ở Pending | john gửi tin nhắn tới maria | Bị từ chối; không có tin nào được tạo | R-10, P-04 |
| AC-22 | john và maria có kết nối Open; peter@example.com không thuộc kết nối đó | peter gửi tin vào kết nối john–maria | Bị từ chối; không có tin nào được tạo | R-10, P-04 |
| AC-23 | john và maria có kết nối Open | john gửi tin 2000 ký tự, rồi tin 2001 ký tự, rồi tin "   " | Tin 2000 ký tự được gửi; tin 2001 ký tự bị từ chối; tin "   " bị từ chối | R-10 |
| AC-24 | john và maria có kết nối Open | john gửi tin tiếng Việt 2000 ký tự nhập ở dạng tách dấu (hơn 2000 code point), rồi tin "  hi  " | Cả hai tin được gửi; tin thứ hai được lưu nguyên là "  hi  " | R-10 |
| AC-25 | john và maria có kết nối Open | john gửi một ảnh JPG, rồi một tệp PDF | Cả hai bị từ chối | R-10 |
| AC-26 | john và maria có kết nối Open; email john@example.com, số điện thoại +1 512 555 0100 và Instagram @john.tx lưu trong tài khoản của john | maria mở màn trò chuyện, hồ sơ hoàn chỉnh của john và danh sách kết nối | Không màn hình nào hiện john@example.com, +1 512 555 0100 hay @john.tx; yêu cầu xem các thông tin đó bị từ chối | R-11, P-07 |
| AC-27 | john và maria có kết nối Open | john gửi "Gọi anh nhé +1 512 555 0100" | Tin được gửi; cả john và maria thấy cảnh báo lừa đảo | R-12, F-01 |
| AC-28 | john và maria có kết nối Open | maria bấm "Kết thúc kết nối" lúc 2026-10-05 12:00:00 | Kết nối chuyển sang Ended; endedBy = maria; john và maria không gửi được tin nào nữa | R-13, X-07, P-05, F-02 |
| AC-29 | Như AC-28 | john gửi lại yêu cầu tới maria | Bị từ chối; không có yêu cầu nào được tạo | R-13 |
| AC-30 | john và maria có kết nối Open; peter@example.com không thuộc kết nối đó | peter bấm "Kết thúc kết nối" cho kết nối john–maria | Bị từ chối; kết nối vẫn Open | R-13, P-05 |
| AC-31 | john và maria có kết nối Ended với 12 tin nhắn | john và maria lần lượt mở lại cuộc trò chuyện | Cả hai thấy đủ 12 tin; không gửi được tin mới | R-14, R-13 |
| AC-32 | john đã gửi tin "Chào Maria" | john tìm cách xóa hoặc sửa tin đó | Bị từ chối; tin vẫn là "Chào Maria" | R-14, P-06 |
| AC-33 | john có kết nối Open với maria và yêu cầu Pending tới anna@example.com; gói của john hết hạn lúc 2026-11-01 00:00:00 | Ngày 2026-11-02 john nhắn maria, rồi gửi yêu cầu tới lisa@example.com; anna bấm "Chấp nhận" yêu cầu của john | Tin tới maria được gửi; yêu cầu tới anna đã chuyển Expired và anna không chấp nhận được; yêu cầu tới lisa bị từ chối | R-15, R-01, X-05 |
| AC-34 | john có yêu cầu Pending tới maria | john gửi thêm một yêu cầu tới maria | Bị từ chối; vẫn chỉ có 1 yêu cầu Pending | R-16 |
| AC-35 | john và maria có kết nối Open | john gửi yêu cầu mới tới maria | Bị từ chối; không có yêu cầu nào được tạo | R-16 |
| AC-36 | john đủ điều kiện, đã có 14 yêu cầu ngày 2026-10-10 | Hai điện thoại của john cùng gửi yêu cầu tới anna và lisa trong cùng một mili giây | Đúng 1 yêu cầu được tạo; john có 15 yêu cầu trong ngày | R-03 |
| AC-37 | john chưa có yêu cầu nào tới maria | Hai lần bấm gửi yêu cầu tới maria đến cùng một mili giây | Đúng 1 yêu cầu Pending được tạo | R-16 |
| AC-38 | john đã có 15 yêu cầu ngày 2026-10-10, trong đó 1 yêu cầu đã rút lại | Gửi yêu cầu tới lisa@example.com | Bị từ chối vì đã đủ 15 yêu cầu trong ngày | R-03 |
| AC-39 | john gửi yêu cầu tới maria lúc 09:00:00, maria chấp nhận lúc 10:00:00, john kết thúc kết nối lúc 11:00:00 | Admin cấp cao nhất xem audit log | Có đúng 3 bản ghi: gửi lúc 09:00:00, chấp nhận (đồng ý) lúc 10:00:00, kết thúc lúc 11:00:00, mỗi bản ghi có john, maria và người thực hiện | R-17 |
| AC-40 | Yêu cầu của john tới maria ở Pending | maria chấp nhận lúc 10:00:00.1 và john rút lại lúc 10:00:00.3 | Yêu cầu là Accepted; việc rút lại bị từ chối | R-18 |
| AC-41 | john và maria có kết nối Open | maria kết thúc lúc 12:00:00.100 và tin của john đến lúc 12:00:00.200 | Kết nối Ended; tin của john bị từ chối | R-18 |
| AC-42 | john và maria có kết nối Open | john bấm kết thúc lúc 12:00:00.100 và maria bấm kết thúc lúc 12:00:00.150 | Kết nối Ended; endedBy = john; lần bấm của maria bị từ chối | R-18 |
| AC-43 | john có yêu cầu Pending tới maria và kết nối Open với anna@example.com | john xóa tài khoản | Yêu cầu tới maria chuyển Expired; kết nối với anna chuyển Ended; tin nhắn john–anna vẫn được lưu | R-19, X-06, X-08 |
| AC-44 | maria có yêu cầu Pending từ john và kết nối Open với peter@example.com | Tài khoản maria bị đình chỉ | Yêu cầu từ john chuyển Expired; kết nối với peter chuyển Ended | R-19 |
| AC-45 | Yêu cầu của john tới maria đã Withdrawn | maria bấm "Chấp nhận" từ màn hình đang mở | Bị từ chối; hiện "Yêu cầu này không còn hiệu lực"; không có kết nối nào được tạo | R-20 |
| AC-46 | Yêu cầu của john tới maria đã Accepted | maria bấm "Chấp nhận" lần nữa, rồi bấm "Từ chối" | Cả hai bị từ chối; hiện "Yêu cầu này không còn hiệu lực"; vẫn đúng 1 kết nối | R-20 |
| AC-47 | john và maria có kết nối Ended | john bấm "Kết thúc kết nối" | Bị từ chối; hiện "Kết nối đã kết thúc" | R-20 |
| AC-48 | Yêu cầu của john tới maria chuyển Expired lúc 2026-10-15 10:00:00 | john mở yêu cầu; maria mở danh sách yêu cầu; john gửi lại lúc 2026-11-14 09:59:59, rồi lúc 2026-11-14 10:00:00 | john thấy "Không được chấp nhận"; maria không thấy yêu cầu; lần gửi lúc 09:59:59 bị từ chối, lần lúc 10:00:00 được tạo | R-21 |
| AC-49 | Nam có gói john@example.com có hồ sơ chưa hoàn chỉnh | Gửi yêu cầu tới maria@example.com | Bị từ chối; màn hoàn thiện hồ sơ được đưa ra | R-01 |
| AC-50 | Nam john@example.com có gói, hồ sơ hoàn chỉnh, giáo dục văn hóa hoàn tất, nhưng xác minh danh tính đang Declined | Gửi yêu cầu tới maria@example.com | Bị từ chối; không có yêu cầu nào được tạo | R-01 |
| AC-51 | john@example.com đã hủy gói ngày 2026-10-15, kỳ đã trả đến 2026-11-01; đủ các điều kiện khác | Gửi yêu cầu tới maria@example.com ngày 2026-10-20 | Yêu cầu được tạo | R-01 |
| AC-52 | john và maria có kết nối Open | Admin admin1 mở danh sách kết nối, rồi bấm kết thúc kết nối john–maria | Admin thấy kết nối; việc kết thúc bị từ chối; kết nối vẫn Open | P-08, P-05 |
| AC-53 | john có yêu cầu Pending tới maria | maria chặn john lúc 10:00:00 | Yêu cầu chuyển Expired, decidedBy = maria, decidedAt = 10:00:00; audit có bản ghi hết hạn với người thực hiện maria | R-22, X-09, R-17 |
| AC-54 | john và maria có kết nối Open | john chặn maria lúc 11:00:00 | Kết nối chuyển Ended, endedBy = john; audit có bản ghi kết thúc với người thực hiện john | R-22, X-10, R-17 |
| AC-55 | maria đã chặn john khi john có yêu cầu Pending; maria bỏ chặn 40 ngày sau | john gửi lại yêu cầu tới maria | Bị từ chối; không có yêu cầu nào được tạo | R-22, R-21 |
| AC-56 | john đã chặn maria khi có kết nối Open; john bỏ chặn | john gửi yêu cầu tới maria | Bị từ chối; không có yêu cầu nào được tạo | R-22 |
| AC-57 | john có yêu cầu Pending tới maria | john chặn maria lúc 2026-10-01 10:00:00, bỏ chặn lúc 2026-11-10 10:00:00, rồi gửi yêu cầu mới tới maria | Yêu cầu cũ Expired với decidedBy = john; yêu cầu mới bị từ chối | R-22, X-09 |
| AC-58 | john và maria có kết nối Open | maria chặn john lúc 12:00:00 | Kết nối chuyển Ended, endedBy = maria | R-22, X-10 |
| AC-59 | john chỉ thấy anna trong kết quả tìm kiếm, chưa từng gửi yêu cầu | john chặn anna, hôm sau bỏ chặn, rồi gửi yêu cầu đầu tiên tới anna | Bị từ chối | R-22 |
| AC-60 | john rút lại yêu cầu tới maria lúc 2026-10-01 10:00:00; maria chặn john ngày 2026-10-02 và bỏ chặn ngày 2026-10-03 | john gửi lại lúc 2026-10-31 10:00:00 | Bị từ chối (lệnh cấm vĩnh viễn thay cho 30 ngày) | R-22, R-08 |
| AC-61 | maria chặn john khi yêu cầu của john đang Pending | john mở danh sách yêu cầu khi Block còn Active, rồi sau khi maria bỏ chặn | Lúc Block Active: không thấy yêu cầu tới maria; sau khi bỏ chặn: thấy yêu cầu đó với "Không được chấp nhận" | R-21 |
| AC-62 | Yêu cầu của john tới maria ở Pending | maria chấp nhận lúc 10:00:00.050 và john chặn maria lúc 10:00:00.100 | Kết nối được tạo rồi chuyển Ended với endedBy = john; Block Active | R-22 |
| AC-63 | Yêu cầu của john tới maria gửi lúc 2026-10-01 10:00:00; hệ thống chưa chuyển Expired | maria chặn john lúc 2026-10-15 10:02:00 | Yêu cầu Expired với decidedBy = "hệ thống" và decidedAt = 2026-10-15 10:00:00; Block Active; sau khi bỏ chặn john không gửi lại được | R-22, R-06, X-04 |
| AC-64 | john bị từ chối gửi lại cho maria (Declined), cho anna (kết nối đã Ended) và cho lisa (sau khi lisa chặn rồi bỏ chặn) | john gửi yêu cầu tới cả ba | Cả ba lần hiện đúng một thông báo "Không thể gửi yêu cầu cho người này" | R-23, R-07, R-13, R-22 |
| AC-65 | maria có yêu cầu Pending từ john và kết nối Open với peter | Xác minh danh tính của maria bị thu hồi | Yêu cầu từ john chuyển Expired; kết nối với peter chuyển Ended; tin nhắn cũ vẫn đọc được | R-19, X-06, X-08 |
| AC-66 | john có gói Active và yêu cầu Pending tới lisa | Xác minh danh tính của john bị thu hồi, rồi john gửi yêu cầu tới anna | Yêu cầu tới lisa chuyển Expired; yêu cầu tới anna bị từ chối vì john không còn đủ điều kiện gửi | R-19, R-01 |
| AC-67 | Kết nối john–maria Ended do xác minh của maria bị thu hồi ngày 2026-10-01; maria được Approved lại ngày 2026-10-03 | john gửi yêu cầu mới tới maria ngày 2026-10-03 | Yêu cầu được tạo ở Pending | R-19 |
| AC-68 | john gửi yêu cầu tới maria lúc 09:00:00 (Pending); john và anna có kết nối Open | Admin gỡ ảnh duy nhất của john lúc 10:00:00 | Yêu cầu tới maria chuyển Expired; kết nối john–anna vẫn Open | R-24, X-11 |
| AC-69 | Như AC-68; john thêm 1 ảnh lúc 11:00:00 và hồ sơ hoàn chỉnh lại | john gửi yêu cầu mới tới maria | Yêu cầu được tạo ở Pending | R-24 |
| AC-70 | peter gửi yêu cầu tới maria lúc 09:00:00; admin gỡ bio của maria lúc 10:00:00 | maria chấp nhận yêu cầu của peter lúc 10:05:00 | Bị từ chối; yêu cầu đã Expired | R-24, R-20 |

## 9. Non-functional

| Code | Quality | Measure | Target | Source |
| --- | --- | --- | --- | --- |
| N-01 | Độ trễ xử lý hết hạn | Thời gian từ mốc 336 giờ của R-06 đến khi yêu cầu chuyển sang Expired | ≤ 5 phút | SRC-16#L21, SRC-16#L34 |

## 10. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |
| ASM-01 | Phân loại IMBRA không bắt thêm bước công bố thông tin cho nữ trước khi chấp nhận yêu cầu (BRIEF-1/K-07, BRIEF-1/RISK-03) | Luật sư của khách, trước khi viết DSN |

## 11. Out of scope

- Thông báo push, email và trong app khi có yêu cầu mới, được chấp nhận, bị từ chối, hết hạn hoặc có tin nhắn mới: SPEC thông báo (SRC-15#L34, BRIEF-1/C-23).
- Cách phát hiện số điện thoại, email, mạng xã hội và nội dung cảnh báo lừa đảo; chặn và báo cáo: SPEC an toàn (SRC-15#L28-L29, BRIEF-1/C-25, BRIEF-1/C-26, BRIEF-1/C-27).
- Admin xem và xuất tin nhắn, kết thúc kết nối, hủy yêu cầu hoặc gỡ chặn: SPEC admin (SRC-15#L30, SRC-16#L32).
- Đã xem, đang gõ: không có trong MVP (SRC-15#L32).
- Điều kiện hồ sơ, giáo dục văn hóa và ai xem được ai: SPEC-3.
- Số năm lưu tin nhắn: luật sư của khách quyết định (SRC-16#L26, BRIEF-1/K-08).

## Change log

| Version | Date | By | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-09-29 | Honda | Approved |
| 0.2.0 | 2026-09-29 | Honda | Approved revision of 0.1.0 (minor): Thêm sự kiện chặn cho yêu cầu liên hệ và kết nối, và quy tắc không gửi lại sau khi bỏ chặn (SRC-20#L22, SRC-20#L39) |
| 0.3.0 | 2026-09-30 | Honda | Approved revision of 0.2.0 (minor): Thu hồi xác minh làm yêu cầu Pending hết hạn và kết nối Open kết thúc (SRC-25#L23, SPEC-8/R-14) |
| 0.4.0 | 2026-09-30 | Honda | Approved revision of 0.3.0 (minor): yêu cầu Pending hết hạn khi admin gỡ ảnh hoặc bio làm hồ sơ chưa hoàn chỉnh (SPEC-9; SRC-28) |
