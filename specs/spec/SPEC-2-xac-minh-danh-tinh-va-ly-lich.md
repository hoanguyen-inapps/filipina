---
id: SPEC-2
title: Xác minh danh tính và lý lịch
version: 0.2.0
status: approved
owner: Honda
flow: project
risk: high
review: specs/review/SPEC-2-0.2.0.md
parent: [BRIEF-1@0.1.0]
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:4cd64e479450ef42bbe115e5
---

# SPEC-2: Xác minh danh tính và lý lịch

<!-- Skyline SPEC (project flow): the exact logic. One row, one fact. Bare codes (R-01) are this SPEC; anything else is qualified (BRIEF-1/C-02). Every rule has a Source and at least one AC. Each unknown becomes a CLARIFY marker; never guess. -->

## 1. Scope

Implements BRIEF-1/C-05, BRIEF-1/C-06, BRIEF-1/C-07 và BRIEF-1/C-08, cùng phần audit log của các sự kiện này trong BRIEF-1/C-40: xác minh danh tính của nam (selfie + giấy tờ) và nữ (selfie + giấy tờ + CENOMAR), background check Certn của nam, huy hiệu và chỉ báo xác minh, điều kiện xác minh để vào Freemium Lobby và mua gói, và bảo mật hồ sơ xác minh (BRIEF-1/K-04, BRIEF-1/K-05). Bắt đầu khi tài khoản đã Active (SPEC-1).

## 2. Glossary

| Code | Term | Definition | Source |
| --- | --- | --- | --- |
| T-01 | Xác minh danh tính | Bước thành viên nộp tài liệu để xác minh: nam nộp selfie + giấy tờ tùy thân do chính phủ cấp; nữ nộp selfie + giấy tờ tùy thân do chính phủ cấp + CENOMAR | SRC-1#L90, SRC-1#L122, SRC-1#L243-L244 |
| T-02 | CENOMAR | Tài liệu nữ Philippines nộp kèm xác minh danh tính (tên theo nguồn) | SRC-1#L122, SRC-3#L51 |
| T-03 | Dịch vụ xác minh | Dịch vụ ngoài chấm selfie và giấy tờ của một lần nộp cụ thể, gửi kết quả "đạt" hoặc "không đạt" về để admin duyệt cuối | BRIEF-1/A-06, SRC-6#L34-L35, SRC-10#L38, SRC-10#L54 |
| T-04 | Background check | Sàng lọc lý lịch qua Certn, gồm tra cứu sex-offender registry; nam điền đơn và trả phí trực tiếp cho Certn; admin đọc báo cáo Certn và quyết định Passed hoặc Failed | SRC-1#L95-L96, SRC-3#L33, SRC-6#L43-L44, SRC-8#L44, SRC-8#L70, BRIEF-1/K-04 |
| T-05 | Hồ sơ xác minh bảo mật | Báo cáo Certn, giấy tờ tùy thân, selfie và tài liệu xác minh danh tính, CENOMAR, kết quả của dịch vụ xác minh và các hồ sơ xác minh bảo mật khác | SRC-1#L152-L153 |
| T-06 | Chỉ báo xác minh | Nhãn trạng thái xác minh hiển thị cho thành viên khác, thay cho tài liệu gốc (danh sách ở R-12) | SRC-1#L148-L150, SRC-6#L49-L50 |
| T-07 | Huy hiệu xanh | Dấu tích xanh "verified badge" hiển thị khi thành viên được duyệt xác minh (R-09, R-10) | SRC-1#L97, SRC-1#L123, SRC-3#L34, SRC-3#L52 |
| T-08 | Đã nộp xác minh | IdentityVerification.status là Submitted, AwaitingAdmin hoặc Approved | SRC-6#L40-L41, SRC-8#L60, SRC-8#L70 |
| T-09 | Admin xác minh | Admin có vai trò "xác minh"; chỉ vai trò này xem được hồ sơ xác minh bảo mật và ra quyết định xác minh (vai trò được định nghĩa ở SPEC admin) | SRC-8#L56, SRC-8#L70 |
| T-10 | Admin cấp cao nhất | Admin có vai trò cao nhất; chỉ vai trò này đọc được audit log (vai trò được định nghĩa ở SPEC admin) | SRC-8#L57, SRC-8#L70 |
| T-11 | Mốc thời gian | Một thời hạn được coi là đã qua khi thời gian đã trôi ≥ đúng thời hạn đó | SRC-10#L37, SRC-10#L54 |

## 3. Data

| Code | Field | Type | Required | Constraint | Source |
| --- | --- | --- | --- | --- | --- |
| DF-01 | IdentityVerification.status | enum {NotSubmitted, Submitted, AwaitingAdmin, Approved, Declined, Cancelled} | yes | máy trạng thái IdentityVerification; một hồ sơ cho mỗi thành viên | SRC-1#L90, SRC-1#L97, SRC-1#L122-L123, SRC-6#L34-L35, SRC-6#L55-L56, SRC-8#L65 |
| DF-02 | IdentityVerification.selfie | ảnh, 1 tệp | yes | R-01, R-27; bảo mật theo R-13 | SRC-1#L90, SRC-1#L122, SRC-10#L52, SRC-11#L42 |
| DF-03 | IdentityVerification.governmentId | ảnh giấy tờ, 1–2 tệp (mặt trước, mặt sau) | yes | R-01, R-27; bảo mật theo R-13 | SRC-1#L90, SRC-1#L122, SRC-10#L52, SRC-11#L42 |
| DF-04 | IdentityVerification.governmentIdType | enum {hộ chiếu, bằng lái, thẻ căn cước quốc gia} | yes | R-27 | SRC-10#L52, SRC-10#L54 |
| DF-05 | IdentityVerification.cenomar | tài liệu, 1 tệp | khi Member.gender = woman; không được có khi man | R-01, R-27; bảo mật theo R-13 | SRC-1#L122, SRC-8#L55, SRC-10#L52 |
| DF-06 | IdentityVerification.serviceResult | enum {đạt, không đạt, không có kết quả}, gắn với một lần nộp cụ thể | khi ở AwaitingAdmin trở đi | R-02, R-18, R-21; bảo mật theo R-13 | SRC-6#L34-L35, SRC-8#L47, SRC-10#L38 |
| DF-07 | IdentityVerification.adminNote | text có ít nhất một ký tự không phải ký tự trắng | khi admin duyệt Approved với serviceResult khác "đạt" | R-19 | SRC-8#L48, SRC-10#L43 |
| DF-08 | IdentityVerification.cenomarChecked | boolean | khi admin duyệt Approved cho nữ | R-19 | SRC-8#L48 |
| DF-09 | IdentityVerification.declineReason | text, không chỉ gồm ký tự trắng | khi Declined | R-03 | SRC-6#L37-L38, SRC-8#L68 |
| DF-10 | IdentityVerification.resubmissions | số nguyên ≥ 0 | yes | R-03; không vượt giới hạn nộp lại (DF-19) | SRC-6#L37-L38, SRC-7#L20-L21, SRC-25#L26 |
| DF-11 | IdentityVerification.history | danh sách các lần nộp (tài liệu, thời điểm, kết quả, lý do từ chối) | yes | R-23 | SRC-8#L54 |
| DF-12 | IdentityVerification.submittedAt | thời điểm UTC của lần nộp hoặc nộp lại được nhận gần nhất | khi Submitted | R-18 | SRC-8#L47, SRC-10#L38 |
| DF-13 | BackgroundCheck.status | enum {NotStarted, Applying, InProgress, ReportReceived, Passed, Failed, Cancelled} | yes, chỉ với nam | máy trạng thái BackgroundCheck; một hồ sơ cho mỗi nam | SRC-1#L93-L97, SRC-6#L55-L56, SRC-8#L44, SRC-10#L40-L41 |
| DF-18 | BackgroundCheck.applyingSince | thời điểm UTC | khi Applying | R-06 | SRC-11#L34 |
| DF-14 | BackgroundCheck.inProgressSince | thời điểm UTC | khi InProgress | R-18 | SRC-8#L47 |
| DF-15 | BackgroundCheck.report | báo cáo Certn | khi ReportReceived trở đi | bảo mật theo R-13 | SRC-1#L97, SRC-1#L152, SRC-8#L44 |
| DF-16 | ReviewFlag | cờ cho admin: thành viên, loại (Failed hoặc Certn quá 14 ngày), thời điểm UTC | khi R-08 hoặc R-18 tạo | R-08, R-18, R-21 | SRC-7#L17-L18, SRC-8#L47, SRC-8#L50, SRC-10#L45 |
| DF-17 | Member.verifiedBadge | boolean, suy ra | yes | R-09, R-10 | SRC-1#L97, SRC-1#L123 |
| DF-20 | ReviewFlag.status | enum {Open, Closed} | yes, mặc định Open | trong SPEC này chỉ chuyển Closed khi R-31 đổi Failed sang Passed; xử lý cờ nói chung ở SPEC admin phần 2 | SRC-24#L28, SRC-26#L25, SRC-26#L34 |
| DF-21 | IdentityVerification.cancelledByBan, BackgroundCheck.cancelledByBan | boolean | khi Cancelled | R-25, R-32 | SRC-26#L19-L20 |
| DF-19 | IdentityVerification.grantedResubmissions | số nguyên ≥ 0, mặc định 0; giới hạn nộp lại = 3 + grantedResubmissions | yes | R-03, R-29 | SRC-24#L27, SRC-25#L26 |

## 4. States

| Code | Machine | State | Kind |
| --- | --- | --- | --- |
| S-01 | IdentityVerification | NotSubmitted | initial |
| S-02 | IdentityVerification | Submitted | normal |
| S-03 | IdentityVerification | AwaitingAdmin | normal |
| S-04 | IdentityVerification | Approved | normal |
| S-05 | IdentityVerification | Declined | normal |
| S-06 | IdentityVerification | Cancelled | normal |
| S-07 | BackgroundCheck | NotStarted | initial |
| S-08 | BackgroundCheck | Applying | normal |
| S-09 | BackgroundCheck | InProgress | normal |
| S-10 | BackgroundCheck | ReportReceived | normal |
| S-11 | BackgroundCheck | Passed | terminal |
| S-12 | BackgroundCheck | Failed | normal |
| S-13 | BackgroundCheck | Cancelled | normal |

| Code | From | Event | Guard | To | Rules |
| --- | --- | --- | --- | --- | --- |
| X-01 | S-01 | submit | R-01 | S-02 | R-01, R-15, R-23, R-28 |
| X-02 | S-02 | service_result | R-21 | S-03 | R-02, R-21, R-15 |
| X-03 | S-02 | service_no_result | | S-03 | R-18, R-15 |
| X-04 | S-03 | admin_approve | R-19 | S-04 | R-02, R-19, R-20, R-15 |
| X-05 | S-03 | admin_decline | R-03 | S-05 | R-02, R-03, R-20, R-15 |
| X-06 | S-05 | resubmit | R-01 and R-03 | S-02 | R-01, R-03, R-15, R-23, R-28 |
| X-07 | S-02 | account_deleted | | S-06 | R-25, R-15 |
| X-08 | S-03 | account_deleted | | S-06 | R-25, R-15 |
| X-09 | S-05 | account_deleted | | S-06 | R-25, R-15 |
| X-10 | S-07 | open_certn_form | R-06 | S-08 | R-06, R-15 |
| X-11 | S-08 | certn_application_received | | S-09 | R-06, R-15 |
| X-12 | S-09 | certn_report_received | | S-10 | R-07, R-15 |
| X-13 | S-10 | admin_pass | | S-11 | R-07, R-20, R-15 |
| X-14 | S-10 | admin_fail | | S-12 | R-07, R-08, R-20, R-15 |
| X-15 | S-08 | account_deleted | | S-13 | R-25, R-15 |
| X-16 | S-09 | account_deleted | | S-13 | R-25, R-15 |
| X-17 | S-10 | account_deleted | | S-13 | R-25, R-15 |
| X-18 | S-08 | applying_expired | | S-07 | R-06, R-15 |
| X-19 | S-04 | admin_revoke | R-30 | S-05 | R-30, R-15, R-23 |
| X-20 | S-12 | admin_override_pass | R-31 | S-11 | R-31, R-15 |
| X-21 | S-02 | account_banned | | S-06 | R-25, R-15 |
| X-22 | S-03 | account_banned | | S-06 | R-25, R-15 |
| X-24 | S-08 | account_banned | | S-13 | R-25, R-15 |
| X-25 | S-09 | account_banned | | S-13 | R-25, R-15 |
| X-26 | S-10 | account_banned | | S-13 | R-25, R-15 |
| X-27 | S-06 | ban_lifted | cancelledByBan | S-01 | R-32, R-15 |
| X-28 | S-13 | ban_lifted | cancelledByBan | S-07 | R-32, R-15 |

## 5. Rules

| Code | Rule | Source |
| --- | --- | --- |
| R-01 | Một lần nộp hoặc nộp lại xác minh danh tính chỉ được nhận khi có đủ bộ tài liệu theo bảng quyết định R-01 và đạt R-27: nam cần selfie và giấy tờ, không kèm CENOMAR; nữ cần selfie, giấy tờ và CENOMAR; nộp lại cũng phải đủ bộ; sai thì từ chối cả lần nộp, giữ trạng thái hiện tại và báo lỗi | SRC-1#L90, SRC-1#L122, SRC-1#L243-L244, SRC-3#L30, SRC-3#L51, SRC-8#L55, SRC-8#L70, SRC-10#L46, SRC-10#L54 |
| R-02 | Sau khi nộp, dịch vụ xác minh chấm selfie và giấy tờ của lần nộp đó và gửi kết quả về, hồ sơ chuyển sang AwaitingAdmin; admin xác minh (T-09) xem kết quả, kiểm CENOMAR (với nữ) và duyệt cuối: Approved (theo R-19) hoặc Declined (theo R-03); admin không có vai trò xác minh thì bị từ chối; admin không duyệt được hồ sơ còn ở Submitted | SRC-1#L243-L245, SRC-6#L34-L35, SRC-8#L56, SRC-8#L70, BRIEF-1/C-32 |
| R-03 | Admin chọn Declined thì phải ghi lý do không chỉ gồm ký tự trắng; thành viên xem được lý do đó; thành viên được nộp lại khi resubmissions nhỏ hơn giới hạn nộp lại (DF-19; mặc định 3 lần sau lần nộp đầu, tổng cộng 4 lần nộp); mỗi lần nộp lại được nhận thì resubmissions tăng thêm 1; lần nộp lại bị từ chối theo R-01 không tính; khi resubmissions bằng giới hạn nộp lại thì từ chối nộp lại và thành viên được hướng dẫn liên hệ hỗ trợ | SRC-6#L37-L38, SRC-7#L20-L21, SRC-8#L53, SRC-8#L68, SRC-8#L70, SRC-25#L26, SRC-25#L40 |
| R-04 | Nam vào Freemium Lobby khi đã nộp xác minh (T-08), hoặc khi xác minh ở Declined và resubmissions nhỏ hơn giới hạn nộp lại; các trường hợp khác (NotSubmitted, Declined với resubmissions bằng giới hạn nộp lại, Cancelled) thì từ chối vào Freemium Lobby | SRC-1#L90-L92, SRC-3#L30-L31, SRC-6#L40-L41, SRC-7#L23-L24, SRC-8#L43, SRC-8#L60, SRC-8#L70 |
| R-05 | Nam chỉ mua được gói khi có huy hiệu xanh (R-09), ở mọi điểm vào, kể cả thanh toán trên website; khi không có huy hiệu, xét lần lượt và dùng kết quả đầu tiên khớp: (1) xác minh NotSubmitted → trong app chuyển thẳng tới màn xác minh danh tính, trên website hiện "Hãy nộp xác minh trong app"; (2) BackgroundCheck Failed → hiện "Bạn không đủ điều kiện mua gói. Vui lòng liên hệ hỗ trợ."; (3) xác minh Declined và resubmissions bằng giới hạn nộp lại → hiện "Vui lòng liên hệ hỗ trợ"; (4) xác minh Declined → hiện "Xác minh bị từ chối, hãy nộp lại"; (5) BackgroundCheck NotStarted → mở đơn background check Certn theo R-06; (6) BackgroundCheck Applying → mở tiếp đơn Certn đang dở theo R-06; (7) BackgroundCheck InProgress hoặc ReportReceived → hiện "Background check đang xử lý"; (8) BackgroundCheck Passed → hiện "Xác minh danh tính đang chờ duyệt"; mọi trường hợp trên đều không tạo giao dịch | SRC-1#L93-L94, SRC-1#L97-L99, SRC-1#L187-L189, SRC-3#L32-L35, SRC-8#L42, SRC-8#L61-L62, SRC-8#L70, SRC-10#L39, SRC-10#L47-L48, SRC-10#L54, SRC-11#L36-L37, SRC-11#L43, SRC-11#L46 |
| R-06 | Nam chỉ mở đơn background check khi đã nộp xác minh (T-08) và BackgroundCheck ở NotStarted; khi đó BackgroundCheck chuyển sang Applying; trong lúc Applying, mở đơn lại thì mở tiếp chính đơn đó, không tạo đơn thứ 2, kể cả khi xác minh danh tính đã chuyển sang Declined sau khi đơn được mở; nếu BackgroundCheck ở Applying đã qua mốc 7 ngày (168 giờ) kể từ applyingSince mà Certn chưa xác nhận đã nhận đơn, BackgroundCheck quay về NotStarted; mở đơn mới khi xác minh ở NotSubmitted hoặc Declined, hoặc khi BackgroundCheck ở InProgress, ReportReceived, Passed, Failed hay Cancelled thì từ chối; nam điền đơn và trả phí trực tiếp cho Certn trong đơn của Certn, số tiền do Certn đặt; xác nhận đã nhận đơn của Certn luôn được nhận khi BackgroundCheck ở Applying, kể cả khi xác minh danh tính vừa bị Declined, và chuyển BackgroundCheck sang InProgress | SRC-1#L95-L96, SRC-1#L188, SRC-3#L33, SRC-6#L43-L44, SRC-8#L42, SRC-8#L45-L46, SRC-8#L70, SRC-10#L39-L40, SRC-10#L54, SRC-11#L34-L35, SRC-11#L46 |
| R-07 | Khi Certn gửi báo cáo, BackgroundCheck chuyển sang ReportReceived; admin xác minh (T-09) đọc báo cáo và chọn Passed hoặc Failed; admin không có vai trò xác minh thì bị từ chối | SRC-1#L95-L97, SRC-1#L244-L245, SRC-8#L44, SRC-8#L56, SRC-8#L70 |
| R-08 | Khi BackgroundCheck Failed: nam không được làm lại background check; nam vẫn vào được Freemium Lobby theo R-04 nhưng mua gói thì bị từ chối theo R-05; hệ thống tạo đúng một cờ loại Failed cho admin xem xét tài khoản của nam | SRC-1#L95-L97, SRC-1#L187-L189, SRC-7#L17-L18, SRC-8#L50, SRC-8#L70 |
| R-09 | Nam có huy hiệu xanh khi và chỉ khi xác minh danh tính Approved và BackgroundCheck Passed (bảng quyết định R-09) | SRC-1#L90-L97, SRC-3#L30-L34, SRC-8#L42 |
| R-10 | Nữ có huy hiệu xanh khi và chỉ khi xác minh danh tính (gồm CENOMAR) Approved | SRC-1#L122-L123, SRC-3#L51-L52 |
| R-11 | Nữ chỉ mở bước hoàn thiện hồ sơ sau khi xác minh danh tính Approved | SRC-1#L122-L125, SRC-3#L51-L53 |
| R-12 | Chỉ báo xác minh hiển thị cho thành viên khác: với nam, "Identity Verified" khi xác minh danh tính Approved, "Background Screening Completed" và "Sex Offender Registry Search Completed" chỉ khi xác minh danh tính Approved và BackgroundCheck Passed (không hiện gì cho background check trong mọi trường hợp khác); với nữ, "Identity Verified" và "CENOMAR Verified" khi xác minh danh tính Approved; không có chỉ báo "Profile Information Confirmed" | SRC-1#L97, SRC-1#L148-L150, SRC-6#L49-L50, SRC-8#L59, SRC-8#L70, SRC-10#L42, SRC-10#L54 |
| R-13 | Thành viên khác không bao giờ xem được hồ sơ xác minh bảo mật (T-05); họ chỉ thấy huy hiệu xanh và chỉ báo xác minh; thành viên thấy tên và trạng thái các tài liệu mình đã nộp nhưng không tải lại được | SRC-1#L97, SRC-1#L123-L124, SRC-1#L148-L153, SRC-8#L66, SRC-8#L70, BRIEF-1/K-05 |
| R-14 | Chỉ admin xác minh (T-09) xem được hồ sơ xác minh bảo mật; mỗi lần xem, tải hoặc xem trước một tài liệu, và mỗi lần bị từ chối truy cập (do admin hay do thành viên), hệ thống ghi audit log gồm người truy cập, thành viên chủ hồ sơ, tài liệu, loại truy cập, kết quả (được hay bị từ chối) và thời điểm UTC | SRC-1#L177, SRC-1#L182, SRC-8#L56-L57, SRC-8#L70, SRC-10#L51, SRC-10#L54, SRC-11#L40, SRC-11#L46, BRIEF-1/C-40 |
| R-15 | Hệ thống ghi audit log cho mỗi lần nộp và nộp lại xác minh danh tính, mỗi lần đổi trạng thái xác minh danh tính (kèm admin quyết định nếu có) và mỗi lần đổi trạng thái background check; chỉ admin cấp cao nhất (T-10) đọc được audit log | SRC-1#L180-L182, SRC-8#L57, SRC-8#L70, BRIEF-1/C-40 |
| R-16 | Nữ không làm background check Certn | SRC-3#L43-L58, SRC-6#L55-L56 |
| R-17 | Nộp xác minh khi hồ sơ ở Submitted, AwaitingAdmin hoặc Approved thì từ chối; không thay được tài liệu khi hồ sơ ở Submitted hoặc AwaitingAdmin | SRC-8#L46, SRC-8#L70 |
| R-18 | Nếu dịch vụ xác minh báo lỗi, hoặc chưa gửi kết quả khi đã qua mốc 48 giờ (T-11) kể từ submittedAt, hồ sơ chuyển sang AwaitingAdmin với serviceResult "không có kết quả" và admin duyệt tay; kết quả chấm đến khi đã qua mốc 48 giờ thì bị bỏ qua, kể cả khi hệ thống chưa kịp chuyển hồ sơ; submittedAt được tính lại mỗi khi một lần nộp lại được nhận; nếu BackgroundCheck ở InProgress đã qua mốc 14 ngày (336 giờ) kể từ inProgressSince, hệ thống tạo một cờ loại "Certn quá 14 ngày" cho admin, và mỗi background check chỉ có tối đa một cờ loại này | SRC-8#L47, SRC-8#L70, SRC-10#L37-L38, SRC-10#L45, SRC-10#L54, SRC-11#L38, SRC-11#L46 |
| R-19 | Admin duyệt Approved được hay không theo bảng quyết định R-19: serviceResult khác "đạt" thì bắt buộc có adminNote chứa ít nhất một ký tự không phải ký tự trắng; với nữ thì bắt buộc tích "đã kiểm CENOMAR"; không đủ điều kiện thì từ chối và hồ sơ giữ AwaitingAdmin | SRC-8#L47-L48, SRC-8#L70, SRC-9#L21-L22, SRC-10#L43, SRC-10#L54 |
| R-20 | Khi hai admin quyết định cùng một hồ sơ xác minh danh tính hoặc background check, quyết định được ghi trước thắng; quyết định sau bị từ chối và admin đó được báo hồ sơ đã được quyết định | SRC-8#L49, SRC-8#L70 |
| R-21 | Mỗi kết quả và mỗi báo lỗi của dịch vụ xác minh gắn với một lần nộp cụ thể; kết quả hoặc báo lỗi của một lần nộp cũ hơn lần nộp hiện tại bị bỏ qua; kết quả của dịch vụ xác minh hoặc của Certn gửi tới khi hồ sơ không ở trạng thái chờ kết quả đó (gửi trùng hoặc gửi muộn) cũng bị bỏ qua; bị bỏ qua nghĩa là không đổi trạng thái và không tạo thêm cờ | SRC-8#L50, SRC-8#L70, SRC-10#L38, SRC-10#L54, SRC-11#L39, SRC-11#L46 |
| R-22 | Chỉ dịch vụ xác minh ghi được kết quả chấm; chỉ Certn ghi được xác nhận nhận đơn và báo cáo; thành viên hay admin gửi các kết quả này thì bị từ chối | SRC-8#L51, SRC-8#L70 |
| R-23 | Mọi lần nộp (tài liệu, thời điểm, kết quả, lý do từ chối), mọi lần thu hồi (admin, lý do, thời điểm) và mọi lần được cấp thêm lượt (admin, lý do, thời điểm) được giữ trong history; admin xác minh xem được toàn bộ history của hồ sơ | SRC-8#L54, SRC-8#L70, SRC-24#L27, SRC-24#L29, SRC-26#L26, SRC-26#L34 |
| R-24 | Nữ chỉ vào Freemium Lobby khi xác minh danh tính Approved (các điều kiện hồ sơ và giáo dục văn hóa thuộc SPEC khám phá) | SRC-1#L123-L128, SRC-8#L64, SRC-8#L70 |
| R-25 | Khi tài khoản bị xóa: hồ sơ xác minh danh tính ở Submitted, AwaitingAdmin hoặc Declined chuyển sang Cancelled; khi tài khoản bị cấm (SPEC-8): chỉ hồ sơ xác minh ở Submitted hoặc AwaitingAdmin chuyển sang Cancelled (cancelledByBan), hồ sơ Declined giữ nguyên; trong cả hai trường hợp, background check ở Applying, InProgress hoặc ReportReceived chuyển sang Cancelled (với cấm thì cancelledByBan); tài liệu được giữ theo SPEC-1 (xóa tài khoản) | SRC-8#L65, SRC-8#L70, SRC-10#L41, SRC-10#L54, SRC-11#L44, SRC-11#L46, SRC-25#L27, SRC-25#L40, SRC-26#L19, SRC-26#L34 |
| R-26 | Mọi thời điểm trong SPEC này được lưu theo UTC và hiển thị theo múi giờ của người xem | SRC-8#L58, SRC-8#L70 |
| R-27 | Giấy tờ tùy thân là một trong: hộ chiếu, bằng lái, thẻ căn cước quốc gia; selfie là đúng 1 tệp JPG, PNG hoặc HEIC; giấy tờ là 1 hoặc 2 tệp (mặt trước, mặt sau) JPG, PNG, HEIC hoặc PDF; CENOMAR là đúng 1 tệp JPG, PNG, HEIC hoặc PDF; mỗi tệp ≤ 10 MB, với 10 MB = 10 × 1024 × 1024 = 10.485.760 byte; sai thì từ chối cả lần nộp | SRC-10#L52, SRC-10#L54, SRC-11#L41-L42, SRC-11#L46 |
| R-28 | Khi hai lần nộp hoặc nộp lại của cùng một thành viên đến cùng lúc, chỉ một lần được nhận; lần kia bị từ chối | SRC-10#L44, SRC-10#L54 |
| R-29 | Admin Xác minh cấp thêm được 1 lượt nộp lại (grantedResubmissions tăng thêm 1) cho một hồ sơ đang Declined có resubmissions bằng giới hạn nộp lại, kèm lý do không chỉ gồm ký tự trắng; hồ sơ ở trạng thái khác, chưa hết lượt, hoặc thành viên đã bị xóa, bị cấm hay đang bị đình chỉ, thì từ chối; khi hai admin cấp cùng lúc, lần ghi trước thắng và lần sau bị từ chối | SRC-24#L27, SRC-25#L26, SRC-25#L40, SRC-26#L22, SRC-26#L24, SRC-26#L34 |
| R-30 | Admin Xác minh thu hồi được một xác minh Approved, kèm lý do không chỉ gồm ký tự trắng, khi thành viên chưa bị xóa, không bị cấm và không đang bị đình chỉ; hồ sơ chuyển sang Declined với declineReason là lý do đó; huy hiệu xanh và các chỉ báo mất (R-09, R-10, R-12); thành viên nộp lại theo R-03, không được tự cấp thêm lượt khi đã hết lượt | SRC-24#L29, SRC-25#L23, SRC-25#L40, SRC-26#L22-L23, SRC-26#L34 |
| R-31 | Chỉ admin giữ cả vai trò Cấp cao nhất và Xác minh đổi được BackgroundCheck từ Failed sang Passed, kèm lý do không chỉ gồm ký tự trắng, khi thành viên chưa bị xóa, không bị cấm và không đang bị đình chỉ; cờ loại Failed của background check đó chuyển sang Closed; không đổi được từ Passed sang Failed | SRC-24#L28, SRC-25#L24, SRC-25#L36, SRC-25#L40, SRC-26#L21-L22, SRC-26#L34 |
| R-32 | Khi kháng nghị lệnh cấm được chấp nhận (SPEC-8): hồ sơ xác minh Cancelled có cancelledByBan quay về NotSubmitted, giữ nguyên resubmissions và grantedResubmissions; background check Cancelled có cancelledByBan quay về NotStarted, và nam phải trả phí Certn lại | SRC-26#L20, SRC-26#L34 |

<!-- decision: R-01 -->
| C: Có selfie | C: Có giấy tờ | C: Là nữ | C: Có CENOMAR | A: Kết quả |
| --- | --- | --- | --- | --- |
| N | - | - | - | từ chối |
| Y | N | - | - | từ chối |
| Y | Y | N | N | nộp được |
| Y | Y | N | Y | từ chối |
| Y | Y | Y | Y | nộp được |
| Y | Y | Y | N | từ chối |

<!-- decision: R-09 -->
| C: Xác minh danh tính Approved | C: BackgroundCheck Passed | A: Huy hiệu xanh |
| --- | --- | --- |
| Y | Y | có |
| Y | N | không |
| N | - | không |

<!-- decision: R-19 -->
| C: serviceResult là "đạt" | C: Có adminNote hợp lệ | C: Là nữ | C: Đã tích "đã kiểm CENOMAR" | A: Duyệt Approved |
| --- | --- | --- | --- | --- |
| Y | - | N | - | cho duyệt |
| Y | - | Y | Y | cho duyệt |
| Y | - | Y | N | từ chối |
| N | N | - | - | từ chối |
| N | Y | N | - | cho duyệt |
| N | Y | Y | Y | cho duyệt |
| N | Y | Y | N | từ chối |

## 6. Permissions

<!-- Columns after Action are actors: BRIEF-n/A-nn. Cells: Y, N, or a rule code (R-nn) meaning "allowed when that rule holds". -->

| Code | Action | BRIEF-1/A-01 Nam Mỹ | BRIEF-1/A-02 Nữ Philippines | BRIEF-1/A-03 Admin | BRIEF-1/A-05 Certn | BRIEF-1/A-06 Dịch vụ xác minh |
| --- | --- | --- | --- | --- | --- | --- |
| P-01 | Nộp selfie và giấy tờ xác minh danh tính | R-01 | R-01 | N | N | N |
| P-02 | Nộp CENOMAR | N | R-01 | N | N | N |
| P-03 | Mở đơn background check Certn | R-06 | N | N | N | N |
| P-04 | Xem hồ sơ xác minh bảo mật của thành viên khác | N | N | R-14 | N | N |
| P-05 | Duyệt cuối xác minh danh tính | N | N | R-19 | N | N |
| P-06 | Nộp lại xác minh danh tính sau khi bị Declined | R-03 | R-03 | N | N | N |
| P-07 | Ghi kết quả chấm của dịch vụ xác minh | N | N | N | N | Y |
| P-08 | Ghi xác nhận nhận đơn và báo cáo Certn | N | N | N | Y | N |
| P-09 | Quyết định Passed hoặc Failed cho background check | N | N | R-07 | N | N |
| P-10 | Đọc audit log | N | N | R-15 | N | N |
| P-11 | Xem tên và trạng thái tài liệu của chính mình | R-13 | R-13 | N | N | N |

## 7. Flows

### F-01 Xác minh nam Mỹ

1. Nam (tài khoản Active) nộp selfie và giấy tờ (R-01, R-27, X-01, R-15).
2. Dịch vụ xác minh gửi kết quả cho lần nộp đó → AwaitingAdmin (R-02, R-21, X-02).
3. Nam vào Freemium Lobby vì đã nộp xác minh (R-04).
4. Nam bấm mua gói khi BackgroundCheck NotStarted → không tạo giao dịch, đơn Certn mở ra, BackgroundCheck chuyển sang Applying (R-05, R-06, X-10).
5. Nam điền đơn Certn và trả phí cho Certn; Certn xác nhận nhận đơn → InProgress (R-06, X-11).
6. Admin xác minh duyệt Approved (R-19, X-04).
7. Certn gửi báo cáo → ReportReceived; admin xác minh chọn Passed (R-07, X-12, X-13).
8. Nam có huy hiệu xanh và các chỉ báo (R-09, R-12).
9. Nam bấm mua gói → chuyển sang bước mua gói (R-05); việc mua thuộc SPEC thanh toán.

Nhánh lỗi:

- 1a. Thiếu tài liệu, kèm CENOMAR, sai loại giấy tờ, sai định dạng hoặc quá 10 MB → từ chối cả lần nộp (R-01, R-27).
- 2a. Dịch vụ báo lỗi hoặc không trả lời khi qua mốc 48 giờ → AwaitingAdmin với "không có kết quả" (R-18, X-03).
- 4a. Nam mở đơn lần nữa khi đang Applying → mở tiếp chính đơn đó (R-06).
- 6a. Admin chọn Declined kèm lý do → nam xem lý do, nộp lại đủ bộ nếu còn lượt; vẫn ở Lobby khi còn lượt; bấm mua gói thì hiện "Xác minh bị từ chối, hãy nộp lại" (R-03, R-04, R-05, X-05, X-06).
- 7a. Certn quá 14 ngày chưa có báo cáo → một cờ cho admin (R-18).
- 7b. Admin chọn Failed → nam vẫn ở Lobby, không mua gói, không làm lại; một cờ cho admin (R-08, X-14).
- 9a. Bấm mua gói khi Applying, InProgress hoặc ReportReceived → "Background check đang xử lý" (R-05).

### F-02 Xác minh nữ Philippines

1. Nữ (tài khoản Active) nộp selfie, giấy tờ và CENOMAR (R-01, R-27, X-01, R-15).
2. Dịch vụ xác minh gửi kết quả cho lần nộp đó → AwaitingAdmin (R-02, R-21, X-02).
3. Admin xác minh kiểm CENOMAR, tích "đã kiểm CENOMAR" và duyệt Approved (R-19, X-04).
4. Nữ có huy hiệu xanh và các chỉ báo (R-10, R-12), mở bước hoàn thiện hồ sơ (R-11) và đủ điều kiện xác minh để vào Lobby (R-24).

Nhánh lỗi:

- 1a. Thiếu CENOMAR → từ chối cả lần nộp (R-01).
- 3a. Admin chưa tích "đã kiểm CENOMAR" → không duyệt được (R-19).
- 3b. Admin chọn Declined kèm lý do → nữ xem lý do và nộp lại đủ bộ nếu còn lượt (R-03, X-05, X-06).
- 4a. Chưa Approved mà mở hoàn thiện hồ sơ hoặc Lobby → từ chối (R-11, R-24).

### F-03 Admin xem hồ sơ xác minh bảo mật

1. Admin xác minh mở, tải hoặc xem trước một tài liệu của thành viên (R-14).
2. Hệ thống ghi audit log gồm admin, thành viên, tài liệu, loại truy cập, kết quả và thời điểm UTC (R-14).

Nhánh lỗi:

- 1a. Admin không có vai trò xác minh → từ chối, và lần bị từ chối cũng được ghi log (R-14).

## 8. Acceptance criteria

Mọi thời điểm trong mục này là UTC trừ khi ghi rõ.

| Code | Given | When | Then | Covers |
| --- | --- | --- | --- | --- |
| AC-01 | Nam john@example.com, tài khoản Active, xác minh NotSubmitted | Nộp 1 selfie JPG 2 MB và 1 ảnh bằng lái JPG 3 MB, loại giấy tờ "bằng lái" | Xác minh danh tính chuyển sang Submitted | R-01, R-27, X-01, P-01, F-01 |
| AC-02 | Nam john@example.com, xác minh NotSubmitted | Nộp 1 ảnh bằng lái, không có selfie | Bị từ chối; vẫn NotSubmitted; báo thiếu selfie | R-01, P-01 |
| AC-03 | Nữ maria@example.com, tài khoản Active, xác minh NotSubmitted | Nộp 1 selfie, 1 ảnh hộ chiếu và 1 CENOMAR PDF | Xác minh danh tính chuyển sang Submitted | R-01, X-01, P-02, F-02 |
| AC-04 | Nữ maria@example.com, xác minh NotSubmitted | Nộp 1 selfie và 1 ảnh hộ chiếu, không có CENOMAR | Bị từ chối; vẫn NotSubmitted; báo thiếu CENOMAR | R-01, P-02 |
| AC-05 | Nam john@example.com, xác minh NotSubmitted | Gửi 1 selfie, 1 ảnh bằng lái và 1 tệp CENOMAR | Cả lần nộp bị từ chối; vẫn NotSubmitted | R-01, P-02 |
| AC-06 | Nam john@example.com, xác minh NotSubmitted | Mở danh sách loại giấy tờ | Danh sách có đúng 3 loại: hộ chiếu, bằng lái, thẻ căn cước quốc gia | R-27 |
| AC-07 | Nam john@example.com, xác minh NotSubmitted | Nộp selfie PNG đúng 10.485.760 byte và giấy tờ HEIC 4 MB | Xác minh chuyển sang Submitted | R-27 |
| AC-08 | Nam john@example.com, xác minh NotSubmitted | Nộp selfie JPG 10.485.761 byte và giấy tờ JPG 3 MB | Bị từ chối vì selfie quá 10 MB; vẫn NotSubmitted | R-27 |
| AC-09 | Nam john@example.com, xác minh NotSubmitted | Nộp selfie GIF 1 MB và giấy tờ JPG 3 MB | Bị từ chối vì định dạng GIF không được nhận; vẫn NotSubmitted | R-27 |
| AC-10 | Nam john@example.com, xác minh NotSubmitted | Nộp 1 selfie và 2 tệp cho bằng lái (mặt trước, mặt sau) | Xác minh chuyển sang Submitted | R-27 |
| AC-102 | Nam john@example.com, xác minh NotSubmitted | Nộp 1 selfie và 3 tệp cho bằng lái | Bị từ chối vì giấy tờ tối đa 2 tệp; vẫn NotSubmitted | R-27 |
| AC-103 | Nam john@example.com, xác minh NotSubmitted | Nộp selfie PDF 1 MB và giấy tờ JPG 3 MB | Bị từ chối vì selfie chỉ nhận JPG, PNG hoặc HEIC; vẫn NotSubmitted | R-27 |
| AC-11 | Xác minh của john@example.com ở Submitted | Dịch vụ xác minh gửi kết quả "đạt" cho lần nộp hiện tại | Xác minh chuyển sang AwaitingAdmin; admin xác minh thấy serviceResult "đạt" | R-02, R-21, X-02, P-07, F-01 |
| AC-12 | Xác minh của john@example.com nộp lúc 2026-10-02 08:00:00, chưa có kết quả dịch vụ | Hệ thống kiểm tra lúc 2026-10-04 07:59:59 | Xác minh vẫn Submitted | R-18 |
| AC-13 | Như AC-12 | Hệ thống kiểm tra lúc 2026-10-04 08:00:00 | Xác minh chuyển sang AwaitingAdmin với serviceResult "không có kết quả" | R-18, X-03 |
| AC-14 | Xác minh của john@example.com ở Submitted | Dịch vụ xác minh báo lỗi | Xác minh chuyển sang AwaitingAdmin với serviceResult "không có kết quả" | R-18, X-03 |
| AC-15 | john@example.com bị Declined ở lần nộp 1, nộp lại (lần nộp 2) lúc 2026-10-06 09:00:00 | Kết quả "đạt" của lần nộp 1 đến lúc 2026-10-06 09:30:00 | Kết quả bị bỏ qua; xác minh vẫn Submitted, chưa có serviceResult cho lần nộp 2 | R-21, R-18 |
| AC-16 | Như AC-15, chưa có kết quả cho lần nộp 2 | Hệ thống kiểm tra lúc 2026-10-08 08:59:59, rồi lúc 2026-10-08 09:00:00 | Lúc 08:59:59 vẫn Submitted; lúc 09:00:00 chuyển sang AwaitingAdmin với "không có kết quả" | R-18 |
| AC-104 | Xác minh của john@example.com nộp lúc 2026-10-02 08:00:00, chưa có kết quả | Kết quả "đạt" đến lúc 2026-10-04 08:00:30, việc chuyển hồ sơ chạy lúc 08:03:00 | Kết quả bị bỏ qua; hồ sơ ở AwaitingAdmin với serviceResult "không có kết quả" | R-18, R-21 |
| AC-105 | Như AC-15 (lần nộp 2 đang Submitted) | Dịch vụ gửi báo lỗi cho lần nộp 1 | Báo lỗi bị bỏ qua; xác minh vẫn Submitted | R-21, R-18 |
| AC-17 | Nam john@example.com ở AwaitingAdmin, serviceResult "đạt" | Admin xác minh admin1 chọn Approved, không ghi chú | Xác minh chuyển sang Approved | R-19, R-02, X-04, P-05 |
| AC-18 | Nữ maria@example.com ở AwaitingAdmin, serviceResult "đạt" | admin1 tích "đã kiểm CENOMAR" và chọn Approved | Xác minh chuyển sang Approved | R-19, X-04, F-02 |
| AC-19 | Nữ maria@example.com ở AwaitingAdmin, serviceResult "đạt" | admin1 chọn Approved mà không tích "đã kiểm CENOMAR" | Bị từ chối; xác minh vẫn AwaitingAdmin | R-19 |
| AC-20 | Nam john@example.com ở AwaitingAdmin, serviceResult "không đạt" | admin1 chọn Approved, không ghi chú | Bị từ chối; xác minh vẫn AwaitingAdmin | R-19 |
| AC-21 | Nam john@example.com ở AwaitingAdmin, serviceResult "không có kết quả" | admin1 ghi chú "Đã gọi video đối chiếu giấy tờ" và chọn Approved | Xác minh chuyển sang Approved; adminNote được lưu | R-19, R-18 |
| AC-22 | Nam john@example.com ở AwaitingAdmin, serviceResult "không đạt" | admin1 ghi chú "   " và chọn Approved | Bị từ chối; xác minh vẫn AwaitingAdmin | R-19 |
| AC-106 | Nam john@example.com ở AwaitingAdmin, serviceResult "không có kết quả" | admin1 chọn Approved, không ghi chú | Bị từ chối; xác minh vẫn AwaitingAdmin | R-19 |
| AC-23 | Xác minh của john@example.com ở Submitted | admin1 chọn Approved | Bị từ chối; xác minh vẫn Submitted | R-02, P-05 |
| AC-24 | Xác minh của john@example.com ở AwaitingAdmin | john tự đặt trạng thái xác minh của mình thành Approved | Bị từ chối; xác minh vẫn AwaitingAdmin | P-05 |
| AC-25 | Xác minh của john@example.com ở AwaitingAdmin, serviceResult "đạt"; admin7 không có vai trò xác minh | admin7 chọn Approved | Bị từ chối; xác minh vẫn AwaitingAdmin | R-02, P-05 |
| AC-26 | Xác minh của john@example.com ở AwaitingAdmin | admin1 chọn Declined với lý do "Ảnh giấy tờ bị mờ" | Xác minh chuyển sang Declined; john thấy lý do "Ảnh giấy tờ bị mờ" | R-03, X-05 |
| AC-27 | Xác minh của john@example.com ở AwaitingAdmin | admin1 chọn Declined với lý do "   " | Bị từ chối; xác minh vẫn AwaitingAdmin | R-03 |
| AC-28 | Xác minh của john@example.com ở Declined, resubmissions = 2 | john nộp lại đủ selfie và giấy tờ lần thứ 3 | Xác minh chuyển sang Submitted; resubmissions = 3 | R-03, X-06, P-06 |
| AC-29 | Xác minh của john@example.com ở Declined, resubmissions = 3 | john nộp lại selfie và giấy tờ lần thứ 4 | Bị từ chối; xác minh vẫn Declined; màn hình hướng dẫn liên hệ hỗ trợ | R-03, P-06 |
| AC-30 | Xác minh của john@example.com ở Declined, resubmissions = 2 | john nộp lại chỉ có giấy tờ, không có selfie | Bị từ chối; xác minh vẫn Declined; resubmissions vẫn = 2 | R-03, R-01 |
| AC-31 | Xác minh của john@example.com ở Declined, resubmissions = 2 | Hai lần nộp lại đủ bộ đến cùng lúc (cách nhau 20 mili giây) | Đúng 1 lần được nhận; xác minh là Submitted; resubmissions = 3; history có đúng 1 lần nộp mới | R-28, R-03 |
| AC-32 | Xác minh của john@example.com ở AwaitingAdmin | john nộp xác minh lần nữa | Bị từ chối; xác minh vẫn AwaitingAdmin | R-17 |
| AC-33 | Xác minh của john@example.com ở Submitted | john thay selfie bằng ảnh mới | Bị từ chối; selfie cũ giữ nguyên | R-17 |
| AC-34 | Xác minh của john@example.com ở AwaitingAdmin | admin1 chọn Approved lúc 14:00:00.1, admin2 chọn Declined lúc 14:00:00.4 | Xác minh là Approved; quyết định của admin2 bị từ chối và admin2 thấy báo hồ sơ đã được quyết định | R-20 |
| AC-35 | Xác minh của john@example.com ở AwaitingAdmin | Dịch vụ xác minh gửi kết quả lần 2 cho cùng lần nộp | Kết quả lần 2 bị bỏ qua; xác minh vẫn AwaitingAdmin; serviceResult không đổi | R-21 |
| AC-36 | Nam john@example.com, xác minh Submitted | Mở Freemium Lobby | Freemium Lobby mở ra | R-04, F-01 |
| AC-37 | Nam john@example.com, xác minh AwaitingAdmin | Mở Freemium Lobby | Freemium Lobby mở ra | R-04 |
| AC-38 | Nam john@example.com, xác minh Approved | Mở Freemium Lobby | Freemium Lobby mở ra | R-04 |
| AC-39 | Nam john@example.com, xác minh NotSubmitted | Mở Freemium Lobby | Bị từ chối; màn hình yêu cầu nộp xác minh danh tính | R-04 |
| AC-40 | Nam john@example.com, xác minh Declined, resubmissions = 1 | Mở Freemium Lobby | Freemium Lobby mở ra | R-04 |
| AC-41 | Nam john@example.com, xác minh Declined, resubmissions = 3 | Mở Freemium Lobby | Bị từ chối; màn hình hướng dẫn liên hệ hỗ trợ | R-04 |
| AC-42 | Nữ maria@example.com, xác minh AwaitingAdmin | Mở Freemium Lobby | Bị từ chối vì xác minh chưa được duyệt | R-24 |
| AC-43 | Nữ maria@example.com, xác minh Approved | Mở Freemium Lobby | Không bị từ chối vì lý do xác minh; các điều kiện còn lại do SPEC khám phá kiểm | R-24, F-02 |
| AC-44 | Nam john@example.com có huy hiệu xanh | Bấm mua gói | Chuyển sang bước mua gói | R-05, F-01 |
| AC-45 | Nam john@example.com, xác minh NotSubmitted | Mở trang mua gói trên website và bấm thanh toán | Bị từ chối; hiện "Hãy nộp xác minh trong app"; không có giao dịch nào được tạo | R-05 |
| AC-46 | Nam john@example.com, xác minh Declined, resubmissions = 1 | Bấm mua gói | Bị từ chối; hiện "Xác minh bị từ chối, hãy nộp lại"; không có giao dịch nào được tạo | R-05 |
| AC-107 | Nam john@example.com, xác minh NotSubmitted | Bấm mua gói trong app | Không tạo giao dịch; màn xác minh danh tính mở ra | R-05 |
| AC-108 | Nam john@example.com, xác minh Declined, resubmissions = 3 | Bấm mua gói | Bị từ chối; hiện "Vui lòng liên hệ hỗ trợ"; không có giao dịch nào được tạo | R-05 |
| AC-109 | Nam john@example.com, xác minh Declined, resubmissions = 1, BackgroundCheck Failed | Bấm mua gói | Bị từ chối; hiện "Bạn không đủ điều kiện mua gói. Vui lòng liên hệ hỗ trợ." | R-05 |
| AC-47 | Nam john@example.com, xác minh Submitted, BackgroundCheck NotStarted | Bấm mua gói | Bị từ chối mua; đơn background check Certn mở ra; BackgroundCheck chuyển sang Applying | R-05, R-06, X-10, F-01 |
| AC-48 | Nam john@example.com, xác minh Submitted, BackgroundCheck Applying với đơn Certn A đang dở | Bấm mua gói | Bị từ chối mua; đơn A mở tiếp; không có đơn thứ 2 | R-05, R-06 |
| AC-49 | Nam john@example.com, xác minh Approved, BackgroundCheck InProgress | Bấm mua gói | Bị từ chối mua; hiện "Background check đang xử lý" | R-05 |
| AC-50 | Nam john@example.com, xác minh Approved, BackgroundCheck ReportReceived | Bấm mua gói | Bị từ chối mua; hiện "Background check đang xử lý" | R-05 |
| AC-51 | Nam john@example.com, xác minh AwaitingAdmin, BackgroundCheck Passed | Bấm mua gói | Bị từ chối mua; hiện "Xác minh danh tính đang chờ duyệt" | R-05, R-09 |
| AC-52 | Nam john@example.com, xác minh Approved, BackgroundCheck Failed | Bấm mua gói, rồi mở Freemium Lobby | Mua gói bị từ chối, hiện "Bạn không đủ điều kiện mua gói. Vui lòng liên hệ hỗ trợ."; Freemium Lobby mở ra | R-08, R-05 |
| AC-53 | Nam john@example.com, xác minh Submitted, BackgroundCheck NotStarted | Mở thẳng trang mua gói trên website và thanh toán | Bị từ chối mua; không có giao dịch nào được tạo; đơn background check Certn mở ra; BackgroundCheck chuyển sang Applying | R-05, R-06 |
| AC-54 | Nam john@example.com, xác minh NotSubmitted | Mở đơn background check Certn qua link | Bị từ chối; BackgroundCheck vẫn NotStarted | R-06, P-03 |
| AC-55 | Nam john@example.com, xác minh Declined, BackgroundCheck NotStarted | Mở đơn background check Certn | Bị từ chối; BackgroundCheck vẫn NotStarted | R-06 |
| AC-56 | Nam john@example.com, BackgroundCheck Applying, đơn Certn A đã mở | Mở đơn background check lần nữa | Đơn A mở tiếp; không có đơn thứ 2 | R-06 |
| AC-57 | Nam john@example.com, BackgroundCheck Applying | Certn xác nhận đã nhận đơn lúc 2026-10-05 10:00:00 | BackgroundCheck chuyển sang InProgress; inProgressSince = 2026-10-05 10:00:00 | R-06, X-11, P-08, F-01 |
| AC-58 | Nam john@example.com, BackgroundCheck Applying; xác minh danh tính vừa bị Declined | Certn xác nhận đã nhận đơn | BackgroundCheck vẫn chuyển sang InProgress | R-06, X-11 |
| AC-110 | Nam john@example.com, BackgroundCheck Applying với đơn Certn A; xác minh danh tính vừa bị Declined | Mở đơn background check lần nữa | Đơn A mở tiếp; không có đơn thứ 2 | R-06 |
| AC-111 | BackgroundCheck của john@example.com ở Applying từ 2026-10-05 10:00:00, Certn chưa xác nhận | Hệ thống kiểm tra lúc 2026-10-12 09:59:59, rồi lúc 2026-10-12 10:00:00 | Lúc 09:59:59 vẫn Applying; lúc 10:00:00 quay về NotStarted | R-06, X-18 |
| AC-59 | Nam john@example.com, BackgroundCheck InProgress | Mở đơn background check Certn lần nữa | Bị từ chối; không có đơn thứ 2 | R-06 |
| AC-60 | BackgroundCheck của john@example.com InProgress từ 2026-10-05 10:00:00 | Hệ thống kiểm tra lúc 2026-10-19 09:59:59 | Không có cờ nào được tạo | R-18 |
| AC-61 | Như AC-60 | Hệ thống kiểm tra lúc 2026-10-19 10:00:00, rồi lúc 11:00:00 và 12:00:00 | Admin thấy đúng 1 cờ "Certn quá 14 ngày" cho john@example.com; BackgroundCheck vẫn InProgress | R-18 |
| AC-62 | BackgroundCheck của john@example.com ở InProgress | Certn gửi báo cáo | BackgroundCheck chuyển sang ReportReceived; admin xác minh đọc được báo cáo | R-07, X-12, P-08 |
| AC-63 | BackgroundCheck của john@example.com ở ReportReceived | admin1 chọn Passed | BackgroundCheck chuyển sang Passed | R-07, X-13, P-09, F-01 |
| AC-64 | BackgroundCheck của john@example.com ở ReportReceived | admin1 chọn Failed lúc 2026-10-10 12:00:00 | BackgroundCheck chuyển sang Failed; admin thấy đúng 1 cờ loại Failed cho john@example.com tạo lúc 12:00:00 | R-07, R-08, X-14 |
| AC-65 | BackgroundCheck của john@example.com ở ReportReceived; admin7 không có vai trò xác minh | admin7 chọn Failed | Bị từ chối; BackgroundCheck vẫn ReportReceived; không có cờ nào được tạo | R-07, P-09 |
| AC-66 | BackgroundCheck của john@example.com ở ReportReceived | admin1 chọn Passed lúc 14:00:00.1, admin2 chọn Failed lúc 14:00:00.3 | BackgroundCheck là Passed; quyết định của admin2 bị từ chối; không có cờ nào được tạo | R-20 |
| AC-67 | BackgroundCheck của john@example.com ở Failed | Mở đơn background check Certn | Bị từ chối; BackgroundCheck vẫn Failed | R-08, R-06 |
| AC-68 | BackgroundCheck của john@example.com ở Failed với 1 cờ | Certn gửi lại báo cáo | Báo cáo bị bỏ qua; BackgroundCheck vẫn Failed; vẫn đúng 1 cờ | R-21, R-08 |
| AC-69 | Xác minh của john@example.com ở Submitted | john gửi một kết quả chấm "đạt" cho chính mình | Bị từ chối; xác minh vẫn Submitted | R-22, P-07 |
| AC-70 | BackgroundCheck của john@example.com ở InProgress | john hoặc admin1 gửi một báo cáo Certn giả | Bị từ chối; BackgroundCheck vẫn InProgress | R-22, P-08 |
| AC-71 | BackgroundCheck của john@example.com ở ReportReceived | john tự đặt BackgroundCheck thành Passed | Bị từ chối; BackgroundCheck vẫn ReportReceived | P-09 |
| AC-72 | Nam john@example.com, xác minh Approved, BackgroundCheck Passed | Nữ maria@example.com xem hồ sơ của john | Hồ sơ john có huy hiệu xanh | R-09, F-01 |
| AC-73 | Nam john@example.com, xác minh Approved, BackgroundCheck InProgress | Nữ maria@example.com xem hồ sơ của john | Hồ sơ john không có huy hiệu xanh | R-09 |
| AC-74 | Nam john@example.com, xác minh AwaitingAdmin, BackgroundCheck Passed | Nữ maria@example.com xem hồ sơ của john | Hồ sơ john không có huy hiệu xanh | R-09 |
| AC-75 | Nữ maria@example.com, xác minh Approved | Nam john@example.com xem hồ sơ của maria | Hồ sơ maria có huy hiệu xanh | R-10, F-02 |
| AC-76 | Nữ maria@example.com, xác minh AwaitingAdmin | Mở bước hoàn thiện hồ sơ | Bị từ chối; màn hình báo cần xác minh được duyệt | R-11 |
| AC-77 | Nữ maria@example.com, xác minh Approved | Mở bước hoàn thiện hồ sơ | Bước hoàn thiện hồ sơ mở ra | R-11, F-02 |
| AC-78 | Nam john@example.com, xác minh Approved, BackgroundCheck Passed | Nữ maria@example.com xem hồ sơ của john | Thấy đúng 3 chỉ báo "Identity Verified", "Background Screening Completed", "Sex Offender Registry Search Completed" | R-12, F-01 |
| AC-79 | Nam john@example.com, xác minh Approved, BackgroundCheck InProgress | Nữ maria@example.com xem hồ sơ của john | Chỉ thấy chỉ báo "Identity Verified" | R-12 |
| AC-80 | Nam john@example.com, xác minh Approved, BackgroundCheck Failed | Nữ maria@example.com xem hồ sơ của john | Chỉ thấy chỉ báo "Identity Verified"; không có chỉ báo background check nào | R-12 |
| AC-81 | Nam john@example.com, xác minh AwaitingAdmin, BackgroundCheck Passed | Nữ maria@example.com xem hồ sơ của john | Không thấy chỉ báo nào | R-12 |
| AC-82 | Nữ maria@example.com, xác minh Approved | Nam john@example.com xem hồ sơ của maria | Thấy đúng 2 chỉ báo "Identity Verified" và "CENOMAR Verified"; không có "Profile Information Confirmed" | R-12, F-02 |
| AC-83 | Nữ maria@example.com đã nộp selfie, hộ chiếu, CENOMAR và được duyệt | Nam john@example.com yêu cầu xem hoặc tải selfie, hộ chiếu, CENOMAR hay serviceResult của maria | Mọi yêu cầu đều bị từ chối; john chỉ thấy huy hiệu và chỉ báo; audit log có một bản ghi bị từ chối cho mỗi yêu cầu, người truy cập là john@example.com | R-13, R-14, P-04 |
| AC-84 | Nữ maria@example.com đã nộp selfie, hộ chiếu và CENOMAR | maria mở danh sách tài liệu của mình, rồi bấm tải hộ chiếu | Danh sách hiện 3 tên tài liệu kèm trạng thái; yêu cầu tải bị từ chối | R-13, P-11 |
| AC-85 | Admin admin7 không có vai trò xác minh | Mở CENOMAR của maria@example.com lúc 09:30:00 | Bị từ chối; không hiện tài liệu; audit log có bản ghi admin7, maria@example.com, CENOMAR, bị từ chối, 09:30:00 | R-14, P-04 |
| AC-86 | Admin xác minh admin1 | Lúc 09:00:00 xem, lúc 09:01:00 tải và lúc 09:02:00 xem trước CENOMAR của maria@example.com | Audit log có 3 bản ghi: admin1, maria@example.com, CENOMAR, loại truy cập xem/tải/xem trước, được phép, lúc 09:00:00, 09:01:00, 09:02:00 | R-14, F-03 |
| AC-87 | Admin admin1 không phải admin cấp cao nhất | Mở audit log | Bị từ chối | R-15, P-10 |
| AC-88 | Nam john@example.com nộp xác minh lúc 2026-10-02 08:00:00, admin1 duyệt Approved lúc 2026-10-03 14:00:00 | Admin cấp cao nhất xem audit log | Có bản ghi nộp lúc 08:00:00 và bản ghi đổi trạng thái sang Approved lúc 14:00:00 kèm admin1 | R-15 |
| AC-89 | Xác minh của john@example.com ở AwaitingAdmin | admin1 chọn Declined lúc 2026-10-03 14:00:00, john nộp lại lúc 2026-10-04 09:00:00 | Audit log có bản ghi đổi sang Declined lúc 14:00:00 kèm admin1 và bản ghi nộp lại lúc 09:00:00 | R-15 |
| AC-90 | BackgroundCheck của john@example.com ở Applying | Chuyển sang InProgress lúc 2026-10-05 10:00:00, ReportReceived lúc 2026-10-08 09:00:00, Passed lúc 2026-10-08 16:00:00 | Audit log có 3 bản ghi đổi trạng thái background check với đúng các thời điểm đó | R-15 |
| AC-91 | Nữ maria@example.com, tài khoản Active | Mở đơn background check Certn | Bị từ chối; không có BackgroundCheck nào được tạo cho maria | R-16, P-03 |
| AC-92 | Admin admin1, xác minh của john@example.com ở NotSubmitted | admin1 nộp selfie và giấy tờ thay cho john | Bị từ chối; xác minh của john vẫn NotSubmitted | P-01 |
| AC-93 | Xác minh của john@example.com ở Declined, resubmissions = 1 | Admin admin1 nộp lại selfie và giấy tờ thay cho john | Bị từ chối; xác minh vẫn Declined; resubmissions vẫn = 1 | P-06 |
| AC-94 | Xác minh của john@example.com bị Declined 2 lần với lý do "Ảnh mờ" và "Giấy tờ hết hạn", lần nộp thứ 3 đang AwaitingAdmin | Admin xác minh mở hồ sơ | Thấy 3 lần nộp với tài liệu, thời điểm và 2 lý do từ chối | R-23 |
| AC-95 | Xác minh của maria@example.com ở AwaitingAdmin | maria xóa tài khoản | Xác minh chuyển sang Cancelled; tài liệu vẫn được giữ; audit log có bản ghi đổi trạng thái sang Cancelled | R-25, R-15, X-08 |
| AC-96 | Xác minh của maria@example.com ở Submitted | maria xóa tài khoản | Xác minh chuyển sang Cancelled | R-25, X-07 |
| AC-97 | Xác minh của john@example.com ở Declined, resubmissions = 1 | john xóa tài khoản | Xác minh chuyển sang Cancelled | R-25, X-09 |
| AC-98 | BackgroundCheck của john@example.com ở ReportReceived | john xóa tài khoản, rồi admin1 chọn Failed | BackgroundCheck chuyển sang Cancelled; quyết định của admin1 bị từ chối; không có cờ nào được tạo | R-25, X-17 |
| AC-99 | BackgroundCheck của john@example.com ở Applying | john xóa tài khoản, rồi Certn xác nhận đã nhận đơn | BackgroundCheck chuyển sang Cancelled; xác nhận của Certn bị bỏ qua | R-25, R-21, X-15 |
| AC-100 | BackgroundCheck của john@example.com ở InProgress | john xóa tài khoản | BackgroundCheck chuyển sang Cancelled | R-25, X-16 |
| AC-101 | Một bản ghi audit lúc 2026-10-05 01:00:00 UTC | Admin ở Manila và admin ở Texas (CDT, UTC−5) mở bản ghi | Admin Manila thấy 2026-10-05 09:00; admin Texas thấy 2026-10-04 20:00; giá trị lưu vẫn là 01:00:00 UTC | R-26 |
| AC-112 | Hồ sơ của john Declined, resubmissions = 3, grantedResubmissions = 0 | Admin Xác minh cấp thêm 1 lượt với lý do "Đọc sai giấy tờ", rồi john nộp lại đủ bộ | grantedResubmissions = 1; lần nộp lại được nhận; resubmissions = 4; john vào được Freemium Lobby trước khi nộp lại | R-29, R-03, R-04, X-06 |
| AC-113 | Hồ sơ của john Declined, resubmissions = 4, grantedResubmissions = 1 | john nộp lại | Bị từ chối; hiện hướng dẫn liên hệ hỗ trợ | R-03, R-05 |
| AC-114 | Hồ sơ của john Declined, resubmissions = 1 | Admin Xác minh cấp thêm lượt | Bị từ chối | R-29 |
| AC-115 | Xác minh của maria Approved | Admin Xác minh thu hồi với lý do "Giấy tờ giả" | Xác minh chuyển Declined với declineReason "Giấy tờ giả"; maria mất huy hiệu xanh; history có bản ghi thu hồi | R-30, R-23, X-19 |
| AC-116 | BackgroundCheck của john Failed với 1 cờ Failed Open | Admin giữ Cấp cao nhất và Xác minh đổi sang Passed với lý do "Certn đính chính" | BackgroundCheck Passed; cờ chuyển Closed | R-31, X-20 |
| AC-117 | BackgroundCheck của john Passed | Admin giữ Cấp cao nhất và Xác minh đổi sang Failed | Bị từ chối | R-31 |
| AC-118 | john có hồ sơ xác minh Declined và BackgroundCheck InProgress | Tài khoản john bị cấm | Hồ sơ xác minh vẫn Declined; BackgroundCheck chuyển Cancelled với cancelledByBan | R-25, X-25 |
| AC-119 | john có hồ sơ xác minh Submitted và BackgroundCheck Applying; lần khác hồ sơ AwaitingAdmin và BackgroundCheck ReportReceived | Tài khoản john bị cấm | Mỗi lần, hồ sơ xác minh và BackgroundCheck đều chuyển Cancelled | R-25, X-21, X-22, X-24, X-26 |
| AC-120 | john bị cấm khi hồ sơ xác minh AwaitingAdmin và BackgroundCheck ReportReceived; cả hai chuyển Cancelled | Kháng nghị lệnh cấm của john được chấp nhận | Hồ sơ xác minh về NotSubmitted, resubmissions giữ nguyên; BackgroundCheck về NotStarted; john mở đơn Certn mới và trả phí lại | R-32, X-27, X-28 |
| AC-121 | Tài khoản john bị xóa khi hồ sơ xác minh AwaitingAdmin (Cancelled, không có cancelledByBan) | Hệ thống xử lý bất kỳ sự kiện nào | Hồ sơ vẫn Cancelled | R-32 |
| AC-122 | Hồ sơ của john ở AwaitingAdmin, resubmissions = 3 | Admin Xác minh cấp thêm lượt | Bị từ chối | R-29 |
| AC-123 | Hồ sơ của john Declined, resubmissions = 3, grantedResubmissions = 0 | admin2 cấp lúc 10:00:00.050 và admin5 cấp lúc 10:00:00.080 | grantedResubmissions = 1; lần của admin5 bị từ chối | R-29 |
| AC-124 | Xác minh của maria Approved | Admin Xác minh thu hồi với lý do "   " | Bị từ chối; xác minh vẫn Approved | R-30, X-19 |
| AC-125 | Xác minh của maria Approved; tài khoản maria đang bị đình chỉ | Admin Xác minh thu hồi với lý do "Giấy tờ giả" | Bị từ chối | R-30 |
| AC-126 | Xác minh của john Approved, resubmissions = 3 | Admin Xác minh thu hồi với lý do "Giấy tờ giả" | Xác minh Declined; john không nộp lại được và thấy hướng dẫn liên hệ hỗ trợ; grantedResubmissions vẫn = 0 | R-30, R-03 |
| AC-127 | BackgroundCheck của john Failed; tài khoản john đã bị xóa | Admin giữ Cấp cao nhất và Xác minh đổi sang Passed | Bị từ chối | R-31, X-20 |
| AC-128 | Hồ sơ của john Declined, resubmissions = 3 | admin2 cấp thêm lượt lúc 09:00:00 với lý do "Đọc sai giấy tờ" | History có mục cấp thêm lượt: admin2, "Đọc sai giấy tờ", 09:00:00 | R-23, R-29 |

## 9. Non-functional

| Code | Quality | Measure | Target | Source |
| --- | --- | --- | --- | --- |
| N-01 | Độ trễ xử lý mốc thời gian | Thời gian từ mốc 48 giờ hoặc mốc 14 ngày của R-18 đến khi hồ sơ chuyển sang AwaitingAdmin hoặc cờ được tạo | ≤ 5 phút | SRC-10#L50, SRC-10#L54 |

## 10. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |
| ASM-01 | Khách cung cấp cho admin tiêu chí để chọn Failed khi đọc báo cáo Certn (SRC-8#L44) | Honda hỏi khách, trước ngày ra mắt |
| ASM-02 | Certn gửi về xác nhận đã nhận đơn và báo cáo như R-06, R-07 mô tả, và cho mở tiếp một đơn đang dở (SRC-8#L45) | Spike thử API Certn, trước khi viết DSN |

## 11. Out of scope

- Màn hình admin, hàng chờ, vai trò admin và việc ai được cấp thêm lượt, thu hồi hay đổi kết quả: SPEC-8 (BRIEF-1/C-32); hành vi trên hồ sơ nằm ở R-29, R-30, R-31 và R-32 của SPEC này.
- Xử lý cờ nói chung (ngoài việc đóng cờ Failed ở R-31): SPEC admin phần 2 (SRC-26#L25).
- Bước thanh toán tự kiểm huy hiệu xanh ở mọi điểm vào: SPEC-5.
- Điều kiện để nam hoàn thiện hồ sơ (sau khi mua gói), và điều kiện hồ sơ, giáo dục văn hóa để vào Freemium Lobby: SPEC-3 (SRC-10#L49, BRIEF-1/C-09, BRIEF-1/C-10, BRIEF-1/C-16, BRIEF-1/C-17).
- Thông báo kết quả xác minh qua push/email: SPEC-7 (BRIEF-1/C-23).

## Change log

| Version | Date | By | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-09-29 | Honda | Approved |
| 0.2.0 | 2026-09-30 | Honda | Approved revision of 0.1.0 (minor): Cấp thêm lượt nộp lại, thu hồi Approved, đổi Failed sang Passed, hủy hồ sơ khi bị cấm (SRC-25#L23, SRC-25#L26-L27, SRC-25#L36, SPEC-8) |
