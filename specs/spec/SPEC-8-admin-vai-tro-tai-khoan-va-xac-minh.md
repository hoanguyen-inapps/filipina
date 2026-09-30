---
id: SPEC-8
title: "Admin: vai trò, tài khoản và xác minh"
version: 0.1.0
status: approved
owner: Honda
flow: project
risk: high
review: specs/review/SPEC-8-0.1.0.md
parent: [BRIEF-1@0.1.0]
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:9f31899014e20081ac0f1404
---

# SPEC-8: Admin: vai trò, tài khoản và xác minh

<!-- Skyline SPEC (project flow): the exact logic. One row, one fact. Bare codes (R-01) are this SPEC; anything else is qualified (BRIEF-1/C-02). Every rule has a Source and at least one AC. Each unknown becomes a CLARIFY marker; never guess. -->

## 1. Scope

Implements BRIEF-1/C-31, BRIEF-1/C-32 và BRIEF-1/C-39, cùng phần audit log của thao tác admin trong BRIEF-1/C-40: vai trò và tài khoản admin, đăng nhập admin, xem và xóa tài khoản thành viên, đình chỉ, cấm, xét kháng nghị, hàng chờ xác minh và background check, cấp thêm lượt nộp lại, đổi kết quả background check, thu hồi xác minh, và audit log. Báo cáo, cờ, nội dung, thanh toán, yêu cầu, kết nối, tin nhắn và thông báo hệ thống ở SPEC admin phần 2. Các chuyển trạng thái mới được thêm vào SPEC-1, SPEC-2, SPEC-4 và SPEC-5 bằng bản sửa đổi đi cùng SPEC-8.

## 2. Glossary

| Code | Term | Definition | Source |
| --- | --- | --- | --- |
| T-01 | Admin | Người của đội FilipinaConnect.US có tài khoản admin trên website admin | BRIEF-1/A-03, SRC-1#L64-L65 |
| T-02 | Vai trò admin | Một trong ba vai trò Hỗ trợ, Xác minh, Cấp cao nhất; mỗi admin giữ ít nhất một vai trò và có thể giữ nhiều vai trò; "admin xác minh" và "admin cấp cao nhất" của SPEC-2 là admin giữ vai trò Xác minh và Cấp cao nhất | SRC-24#L20, SRC-24#L33 |
| T-03 | Tình trạng tài khoản | Tình trạng kỷ luật của một thành viên: Good, Suspended (bị đình chỉ) hoặc Banned (bị cấm); độc lập với Account.status của SPEC-1 | SRC-1#L175, SRC-24#L24, SRC-24#L33 |
| T-04 | Website admin | Địa chỉ website riêng dành cho admin, khác website của thành viên | SRC-24#L22, SRC-24#L33 |
| T-05 | Mốc thời gian | Một thời hạn được coi là đã qua khi thời gian đã trôi ≥ đúng thời hạn đó | SRC-10#L37, SRC-10#L54 |
| T-06 | Quyết định kỷ luật | Một lần đình chỉ hoặc cấm một thành viên; mỗi kháng nghị (SPEC-6) gắn với đúng một quyết định kỷ luật | SRC-20#L31, SRC-25#L22, SRC-25#L40 |
| T-07 | Giới hạn nộp lại | 3 cộng số lượt nộp lại đã được cấp thêm cho hồ sơ xác minh danh tính đó (R-12) | SRC-24#L27, SRC-24#L33 |

## 3. Data

| Code | Field | Type | Required | Constraint | Source |
| --- | --- | --- | --- | --- | --- |
| DF-01 | AdminAccount | email, mật khẩu, khóa xác thực hai lớp, vai trò (≥ 1), người tạo, thời điểm tạo | yes | R-02, R-03, R-17 | SRC-24#L20-L22, SRC-25#L25 |
| DF-02 | AdminAccount.status | enum {Active, Locked, Disabled} | yes | máy trạng thái AdminAccount | SRC-25#L19, SRC-25#L25 |
| DF-03 | AdminAccount.failedLogins | số nguyên ≥ 0 | yes | R-03 | SRC-24#L22, SRC-25#L32 |
| DF-04 | AccountStanding.status | enum {Good, Suspended, Banned} | yes, mặc định Good | máy trạng thái AccountStanding | SRC-24#L24 |
| DF-05 | DisciplinaryDecision | thành viên, loại (đình chỉ, cấm), admin, lý do không chỉ gồm ký tự trắng, thời điểm UTC, còn hiệu lực hay không | khi có quyết định | R-06, R-07, R-08, R-10 | SRC-24#L24, SRC-25#L22 |
| DF-06 | ResubmissionGrant | hồ sơ xác minh, admin, lý do không chỉ gồm ký tự trắng, thời điểm UTC | khi admin cấp thêm lượt | R-12 | SRC-24#L27, SRC-25#L26 |
| DF-07 | AdminDeletion | thành viên, admin, lý do và tham chiếu tới yêu cầu bằng văn bản, cả hai không chỉ gồm ký tự trắng, thời điểm UTC | khi admin xóa thay | R-05 | SRC-24#L23, SRC-25#L33 |

## 4. States

| Code | Machine | State | Kind |
| --- | --- | --- | --- |
| S-01 | AccountStanding | Good | initial |
| S-02 | AccountStanding | Suspended | normal |
| S-03 | AccountStanding | Banned | normal |
| S-04 | AdminAccount | Active | initial |
| S-05 | AdminAccount | Locked | normal |
| S-06 | AdminAccount | Disabled | terminal |

| Code | From | Event | Guard | To | Rules |
| --- | --- | --- | --- | --- | --- |
| X-01 | S-01 | suspend | R-06 | S-02 | R-06, R-16 |
| X-02 | S-01 | ban | R-07 | S-03 | R-07, R-16 |
| X-03 | S-02 | ban | R-07 | S-03 | R-07, R-16 |
| X-04 | S-02 | lift_suspension | R-08 | S-01 | R-08, R-16 |
| X-05 | S-02 | appeal_accepted | R-10 | S-01 | R-09, R-10, R-16 |
| X-06 | S-03 | appeal_accepted | R-10 | S-01 | R-09, R-10, R-16 |
| X-07 | S-04 | lock | | S-05 | R-03, R-16 |
| X-08 | S-05 | unlock | R-17 | S-04 | R-17, R-16 |
| X-09 | S-04 | disable | R-17 | S-06 | R-17, R-16 |
| X-10 | S-05 | disable | R-17 | S-06 | R-17, R-16 |

## 5. Rules

| Code | Rule | Source |
| --- | --- | --- |
| R-01 | Mỗi thao tác admin chỉ được làm khi admin giữ vai trò có quyền đó theo ma trận quyền (mục 6): Hỗ trợ xem thành viên, đình chỉ, gỡ đình chỉ, xét kháng nghị đình chỉ, xử lý báo cáo và cờ; Xác minh duyệt xác minh, background check và xem hồ sơ bảo mật; Cấp cao nhất có mọi quyền khác, gồm quản lý admin, đọc audit log, cấm, xét kháng nghị lệnh cấm, đặt giá và hoàn tiền, nhưng không xem hồ sơ bảo mật và không quyết định xác minh hay background check nếu không giữ thêm vai trò Xác minh; thao tác không đủ vai trò bị từ chối | SRC-1#L64-L65, SRC-1#L265-L266, SRC-24#L20, SRC-24#L33, SRC-25#L24, SRC-25#L40 |
| R-02 | Chỉ admin Cấp cao nhất tạo được tài khoản admin và gán vai trò; admin Cấp cao nhất đầu tiên được tạo lúc cài đặt cho người khách chỉ định | SRC-24#L21, SRC-24#L33, BRIEF-1/K-11 |
| R-03 | Admin chỉ đăng nhập được trên website admin, bằng email, mật khẩu và mã xác thực hai lớp từ ứng dụng tạo mã; mã hai lớp được cài ở lần đăng nhập đầu tiên; sai mật khẩu, sai mã hoặc thiếu mã đều là một lần sai và đều hiện cùng một thông báo từ chối chung; sau 5 lần sai liên tiếp (không giới hạn khung thời gian) tài khoản admin chuyển sang Locked; đăng nhập đúng thì số lần sai về 0; phiên admin tự đăng xuất khi đã qua mốc 30 phút không thao tác | SRC-1#L254-L255, SRC-24#L22, SRC-24#L33, SRC-25#L19, SRC-25#L25, SRC-25#L32, SRC-25#L40 |
| R-04 | Admin Hỗ trợ tìm được thành viên theo tên hoặc email, không phân biệt kiểu chữ và khớp một phần; kết quả gồm cả tài khoản Deleted và Expired, có ghi rõ trạng thái; admin xem được hồ sơ, trạng thái tài khoản và tình trạng tài khoản; không admin nào sửa được dữ liệu của thành viên, xác nhận email hộ hay đổi nhánh giới | SRC-1#L64, SRC-1#L217-L218, SRC-24#L23, SRC-24#L33, SRC-25#L38, SRC-25#L40, BRIEF-1/C-31 |
| R-05 | Chỉ admin Cấp cao nhất xóa được tài khoản thay một thành viên, khi ghi đủ tham chiếu tới yêu cầu bằng văn bản của chính thành viên đó và lý do, cả hai không chỉ gồm ký tự trắng; xóa được mọi tài khoản trừ tài khoản đã Deleted hoặc Expired (tài khoản Unconfirmed đã qua mốc 168 giờ được coi là Expired), không cần mật khẩu của thành viên; hai lần xóa cùng lúc thì lần ghi trước thắng; nếu thành viên còn gói còn hiệu lực (kể cả Cancelling) thì gói chuyển sang Ended ngay, không tự hoàn tiền (SPEC-5 bản sửa đổi); các hậu quả khác như khi thành viên tự xóa (SPEC-1 bản sửa đổi); audit ghi người thực hiện là admin | SRC-24#L23, SRC-24#L33, SRC-25#L20, SRC-25#L33, SRC-25#L40, BRIEF-1/C-30, SRC-26#L27-L29, SRC-26#L34 |
| R-06 | Admin Hỗ trợ hoặc Cấp cao nhất đình chỉ được một thành viên có tài khoản Active (SPEC-1) và tình trạng Good, kèm lý do không chỉ gồm ký tự trắng; đình chỉ kéo dài cho tới khi được gỡ (R-08) hoặc kháng nghị được chấp nhận; trong lúc đình chỉ: các hậu quả của SPEC-4/R-19, SPEC-5/R-17, SPEC-6/R-14 và SPEC-7/R-01 được áp dụng, like của thành viên đó bị ẩn (không bị xóa), và các hồ sơ xác minh, background check của thành viên đó bị ẩn khỏi hàng chờ, admin không quyết được | SRC-1#L175, SRC-24#L24, SRC-24#L33, SRC-25#L27, SRC-25#L29-L30, SRC-25#L40, BRIEF-1/C-35 |
| R-07 | Chỉ admin Cấp cao nhất cấm được một thành viên có tài khoản Active và tình trạng Good hoặc Suspended, kèm lý do không chỉ gồm ký tự trắng; cấm là vĩnh viễn, chỉ được gỡ khi kháng nghị lệnh cấm được chấp nhận; khi cấm: hậu quả như đình chỉ ở R-06, chỉ các hồ sơ đang chờ chuyển sang Cancelled: xác minh ở Submitted hoặc AwaitingAdmin, background check ở Applying, InProgress hoặc ReportReceived; hồ sơ Declined giữ nguyên (SPEC-2 bản sửa đổi), và kháng nghị đang mở về lệnh đình chỉ trước đó tự đóng | SRC-1#L175, SRC-24#L24, SRC-24#L33, SRC-25#L22, SRC-25#L27, SRC-25#L29, SRC-25#L40, SRC-26#L19, SRC-26#L34 |
| R-08 | Admin Hỗ trợ hoặc Cấp cao nhất, khác với admin đã ra lệnh đình chỉ, gỡ được đình chỉ kèm lý do không chỉ gồm ký tự trắng; tình trạng về Good; kháng nghị đang mở về lệnh đình chỉ đó tự đóng; like của thành viên hiện lại; gói đang Cancelling do đình chỉ được thành viên bật lại tự gia hạn nếu chưa tới periodEnd (SPEC-5); yêu cầu và kết nối cũ không được khôi phục | SRC-24#L24-L25, SRC-24#L33, SRC-25#L22, SRC-25#L28, SRC-25#L30, SRC-25#L40 |
| R-09 | Kháng nghị một lệnh đình chỉ được xét bởi admin Hỗ trợ hoặc Cấp cao nhất; kháng nghị một lệnh cấm chỉ được xét bởi admin Cấp cao nhất; người xét luôn khác admin đã ra quyết định bị kháng nghị; chấp nhận hay từ chối đều phải ghi lý do không chỉ gồm ký tự trắng | SRC-1#L270-L271, SRC-24#L20, SRC-24#L25, SRC-24#L33, SRC-25#L21, SRC-25#L34, SRC-25#L40, BRIEF-1/C-29 |
| R-10 | Chấp nhận kháng nghị chỉ có tác dụng khi quyết định kỷ luật bị kháng nghị còn hiệu lực; khi đó tình trạng tài khoản tự về Good, like hiện lại, và với lệnh cấm thì các hồ sơ đã bị hủy do cấm quay về NotSubmitted và NotStarted (SPEC-2 bản sửa đổi), còn yêu cầu và kết nối cũ không được khôi phục (SPEC-6/R-14); từ chối kháng nghị thì tình trạng giữ nguyên | SRC-24#L25, SRC-24#L33, SRC-20#L31, SRC-25#L22, SRC-25#L30, SRC-25#L34, SRC-25#L40, SRC-26#L20, SRC-26#L34 |
| R-11 | Hàng chờ xác minh danh tính gồm các hồ sơ AwaitingAdmin, xếp theo lần nộp gần nhất (submittedAt) cũ nhất trước; hàng chờ background check gồm các hồ sơ ReportReceived, xếp theo lúc nhận báo cáo cũ nhất trước; bằng nhau thì theo mã thành viên tăng dần; hồ sơ của thành viên đang bị đình chỉ không có trong hàng chờ; hồ sơ không bị khóa khi một admin đang mở; khi hai admin cùng quyết một hồ sơ, người được ghi trước thắng (SPEC-2/R-20) | SRC-1#L64, SRC-24#L26, SRC-24#L33, SRC-25#L27, SRC-25#L35, SRC-25#L40, BRIEF-1/C-32 |
| R-12 | Admin Xác minh cấp thêm được 1 lượt nộp lại cho một hồ sơ xác minh danh tính mỗi lần, kèm lý do không chỉ gồm ký tự trắng, và chỉ khi hồ sơ đang Declined, resubmissions đã bằng giới hạn nộp lại (T-07) và thành viên chưa bị xóa, không bị cấm, không đang bị đình chỉ; các trường hợp khác bị từ chối; hai lần cấp cùng lúc thì lần ghi trước thắng (SPEC-2 bản sửa đổi) | SRC-24#L27, SRC-24#L33, SRC-25#L26, SRC-25#L40, SRC-26#L22, SRC-26#L24, SRC-26#L34 |
| R-13 | Chỉ admin giữ cả vai trò Cấp cao nhất và Xác minh đổi được background check từ Failed sang Passed, kèm lý do không chỉ gồm ký tự trắng, khi thành viên chưa bị xóa, không bị cấm, không đang bị đình chỉ; cờ Failed của background check đó được đóng; thành viên nhận thông báo sự kiện (6) của SPEC-7; không đổi được từ Passed sang Failed (SPEC-2 bản sửa đổi) | SRC-24#L28, SRC-24#L33, SRC-25#L24, SRC-25#L36, SRC-25#L40, SRC-26#L21-L22, SRC-26#L34 |
| R-14 | Admin Xác minh thu hồi được một xác minh danh tính đã Approved, kèm lý do không chỉ gồm ký tự trắng, khi thành viên chưa bị xóa, không bị cấm, không đang bị đình chỉ; hồ sơ chuyển sang Declined với lý do đó (SPEC-2 bản sửa đổi); thành viên mất huy hiệu xanh và bị ẩn khỏi Lobby, tìm kiếm (SPEC-3); yêu cầu Pending chuyển Expired và kết nối Open chuyển Ended (SPEC-4 bản sửa đổi); gói vẫn giữ nguyên; thành viên nhận thông báo sự kiện (5) Declined kèm lý do (SPEC-7); thành viên nộp lại theo số lượt còn lại; không được tự cấp thêm lượt khi đã hết lượt | SRC-24#L29, SRC-24#L33, SRC-25#L23, SRC-25#L40, SRC-26#L22-L23, SRC-26#L34 |
| R-15 | Chỉ admin Cấp cao nhất đọc được audit log; tìm được theo thành viên, admin, loại sự kiện và thời gian từ một ngày giờ tới một ngày giờ theo UTC, tính cả hai đầu (chỉ nhập ngày thì tính từ 00:00:00 của ngày đầu tới hết 23:59:59.999 của ngày cuối); xuất được kết quả tìm ra tệp CSV | SRC-1#L218, SRC-24#L30, SRC-24#L33, SRC-25#L31, SRC-25#L40, BRIEF-1/C-39 |
| R-16 | Mọi thao tác của admin đều được ghi audit log, kể cả mở xem hồ sơ thành viên, đăng nhập, lần đăng nhập sai (kèm email đã nhập), tự đăng xuất do không thao tác, và mọi thao tác bị từ chối; mỗi bản ghi có admin (hoặc email đã nhập nếu chưa xác định được admin), thao tác, đối tượng, lý do nếu có, kết quả và thời điểm UTC | SRC-1#L182, SRC-1#L265-L266, SRC-24#L31, SRC-24#L33, SRC-25#L37, SRC-25#L40, BRIEF-1/C-40 |
| R-17 | Admin Cấp cao nhất vô hiệu hóa được một admin khác, đổi vai trò của admin khác, mở khóa một admin Locked khác và đặt lại mã hai lớp cho một admin khác (khi mất thiết bị); thay đổi có hiệu lực ngay và admin bị thay đổi bị đăng xuất; luôn phải còn ít nhất một admin Cấp cao nhất Active; thao tác làm mất admin Cấp cao nhất Active cuối cùng bị từ chối; admin không tự mở khóa, tự đặt lại mã hai lớp hay tự vô hiệu hóa mình | SRC-24#L20, SRC-25#L19, SRC-25#L25, SRC-25#L40 |
| R-18 | Đình chỉ khi đã Suspended hoặc Banned, cấm khi đã Banned, và gỡ đình chỉ khi đang Good đều bị từ chối; khi hai quyết định kỷ luật cho cùng một thành viên đến cùng lúc, quyết định được ghi trước thắng, quyết định sau bị từ chối | SRC-25#L29, SRC-25#L40 |

## 6. Permissions

<!-- Columns after Action are actors: BRIEF-n/A-nn. Cells: Y, N, or a rule code (R-nn) meaning "allowed when that rule holds". -->

| Code | Action | BRIEF-1/A-01 Nam Mỹ | BRIEF-1/A-02 Nữ Philippines | BRIEF-1/A-03 Admin |
| --- | --- | --- | --- | --- |
| P-01 | Tạo tài khoản admin và gán vai trò | N | N | R-02 |
| P-02 | Đăng nhập website admin | N | N | R-03 |
| P-03 | Tìm và xem thành viên | N | N | R-04 |
| P-04 | Sửa dữ liệu thành viên, xác nhận email hộ, đổi nhánh giới | N | N | N |
| P-05 | Xóa tài khoản thay thành viên | N | N | R-05 |
| P-06 | Đình chỉ thành viên | N | N | R-06 |
| P-07 | Cấm thành viên | N | N | R-07 |
| P-08 | Gỡ đình chỉ | N | N | R-08 |
| P-09 | Xét kháng nghị | N | N | R-09 |
| P-10 | Duyệt xác minh danh tính và background check | N | N | R-11 |
| P-11 | Cấp thêm lượt nộp lại | N | N | R-12 |
| P-12 | Đổi background check từ Failed sang Passed | N | N | R-13 |
| P-13 | Thu hồi xác minh đã Approved | N | N | R-14 |
| P-14 | Đọc và xuất audit log | N | N | R-15 |
| P-15 | Vô hiệu hóa admin, đổi vai trò, mở khóa, đặt lại mã hai lớp | N | N | R-17 |

## 7. Flows

### F-01 Đình chỉ và kháng nghị

1. Admin Hỗ trợ đình chỉ thành viên kèm lý do (R-06, X-01, R-16).
2. Thành viên chỉ còn màn kháng nghị và gửi kháng nghị (SPEC-6).
3. Một admin khác xét và chấp nhận kèm lý do → tình trạng về Good (R-09, R-10, X-05).

Nhánh lỗi:

- 1a. Admin không có vai trò Hỗ trợ hay Cấp cao nhất → từ chối (R-01).
- 3a. Chính admin đã đình chỉ xét kháng nghị → từ chối (R-09).
- 3b. Lệnh đình chỉ đã được gỡ hoặc đã bị thay bằng lệnh cấm → kháng nghị đã tự đóng (R-08, R-07).

### F-02 Xác minh

1. Admin Xác minh mở hàng chờ, chọn hồ sơ đứng đầu (R-11).
2. Duyệt Approved hoặc Declined theo SPEC-2; cấp thêm lượt nộp lại khi hồ sơ đã hết lượt (R-12).
3. Sau này, thu hồi một xác minh đã Approved khi có lý do (R-14).

## 8. Acceptance criteria

Mọi thời điểm trong mục này là UTC.

| Code | Given | When | Then | Covers |
| --- | --- | --- | --- | --- |
| AC-01 | admin1 chỉ có vai trò Hỗ trợ | admin1 mở hàng chờ xác minh, rồi đọc audit log | Cả hai bị từ chối | R-01, P-10, P-14 |
| AC-02 | admin2 có hai vai trò Hỗ trợ và Xác minh | admin2 đình chỉ một thành viên, rồi duyệt một hồ sơ xác minh | Cả hai được thực hiện | R-01 |
| AC-03 | admin5 chỉ có vai trò Xác minh | admin5 tìm thành viên, rồi đình chỉ john | Cả hai bị từ chối | R-01, P-03, P-06, F-01 |
| AC-04 | top1 chỉ có vai trò Cấp cao nhất | top1 mở CENOMAR của maria, rồi duyệt một hồ sơ AwaitingAdmin | Cả hai bị từ chối | R-01 |
| AC-05 | top1 có vai trò Cấp cao nhất | top1 tạo admin admin3@filipinaconnect.us với vai trò Xác minh | Tài khoản admin được tạo với vai trò Xác minh | R-02, P-01 |
| AC-06 | admin1 chỉ có vai trò Hỗ trợ | admin1 tạo một tài khoản admin | Bị từ chối | R-02, P-01 |
| AC-07 | Thành viên john@example.com | john mở website admin và đăng nhập bằng tài khoản thành viên | Bị từ chối | R-03, P-02 |
| AC-08 | admin3 vừa được tạo | admin3 đăng nhập lần đầu | admin3 phải cài mã hai lớp trước khi vào website admin | R-03 |
| AC-09 | admin1 có mật khẩu đúng, failedLogins = 0 | Đăng nhập không nhập mã hai lớp, rồi với mã sai, rồi với mã đúng | Hai lần đầu bị từ chối với cùng một thông báo; lần thứ ba đăng nhập thành công; failedLogins = 0 | R-03 |
| AC-10 | admin1 có failedLogins = 0 | 2 lần thiếu mã, rồi 3 lần sai mật khẩu, cách nhau 2 ngày | Sau lần thứ 5 tài khoản admin1 Locked | R-03, X-07 |
| AC-11 | admin1 đang Locked | admin1 đăng nhập đúng; top1 mở khóa cho admin1; admin1 đăng nhập đúng | Lần đầu bị từ chối; sau khi top1 mở khóa, admin1 đăng nhập được | R-17, X-08 |
| AC-12 | top1 đang Locked | top1 tự mở khóa cho chính mình | Bị từ chối; top1 vẫn Locked | R-17 |
| AC-13 | admin1 thao tác lần cuối lúc 10:00:00 | Thao tác lúc 10:29:59; rồi không thao tác cho tới 10:59:59, thao tác lúc 10:59:58, và lần tiếp theo lúc 11:29:58 | Thao tác lúc 10:29:59 được làm; thao tác lúc 10:59:58 được làm; lúc 11:29:58 admin1 đã bị đăng xuất; audit có bản ghi tự đăng xuất | R-03, R-16 |
| AC-14 | Có thành viên Maria Santos, maria@example.com; có tài khoản anna@example.com đã Deleted | admin1 (Hỗ trợ) tìm "santos", rồi "maria@", rồi "anna" | Lần 1 và 2 ra maria; lần 3 ra anna với trạng thái Deleted | R-04, P-03 |
| AC-15 | admin1 đang xem hồ sơ maria | admin1 sửa city của maria, xác nhận email hộ, rồi đổi nhánh giới | Cả ba bị từ chối | R-04, P-04 |
| AC-16 | john@example.com Active, không có gói; top1 có yêu cầu xóa bằng văn bản của john | top1 xóa tài khoản john với tham chiếu "Email của john ngày 2026-10-01" và lý do "Theo yêu cầu" | Tài khoản john Deleted; country, city, ngày sinh, ảnh, hồ sơ bị xóa; email john bị chặn đăng ký lại; audit ghi người thực hiện top1 | R-05, P-05 |
| AC-17 | john@example.com có gói Active chưa hủy | top1 xóa tài khoản john với tham chiếu và lý do hợp lệ | Tài khoản john Deleted; gói của john Ended ngay; không có hoàn tiền | R-05 |
| AC-18 | john@example.com đang bị đình chỉ | top1 xóa tài khoản john với tham chiếu và lý do hợp lệ | Tài khoản john Deleted | R-05 |
| AC-19 | top1 | Xóa tài khoản john với lý do "   ", rồi với tham chiếu trống, rồi xóa một tài khoản đã Expired | Cả ba bị từ chối | R-05 |
| AC-20 | admin2 (Hỗ trợ, Xác minh) có yêu cầu xóa của john | admin2 xóa tài khoản john | Bị từ chối | R-05, P-05 |
| AC-21 | john có tình trạng Good; john có yêu cầu Pending tới maria, kết nối Open với anna, like tới lisa, hồ sơ xác minh AwaitingAdmin | admin1 (Hỗ trợ) đình chỉ john với lý do "Quấy rối" lúc 10:00:00 | Tình trạng Suspended; yêu cầu tới maria Expired; kết nối với anna Ended; lisa không còn thấy like của john nhưng like vẫn được lưu; hồ sơ xác minh của john không còn trong hàng chờ | R-06, X-01, P-06, F-01 |
| AC-22 | john có tình trạng Good | admin1 đình chỉ john với lý do "   " | Bị từ chối; tình trạng vẫn Good | R-06 |
| AC-23 | john đang Suspended | admin1 đình chỉ john lần nữa | Bị từ chối | R-18 |
| AC-24 | john có tình trạng Good | admin1 đình chỉ john lúc 10:00:00.050 và top1 cấm john lúc 10:00:00.100 | Tình trạng Suspended; lệnh cấm bị từ chối | R-18 |
| AC-25 | Tài khoản john ở Unconfirmed (SPEC-1) | admin1 đình chỉ john | Bị từ chối | R-06 |
| AC-26 | admin1 chỉ có vai trò Hỗ trợ | admin1 cấm john | Bị từ chối | R-07, P-07 |
| AC-27 | john đang Suspended và có kháng nghị đang mở về lệnh đình chỉ; john có hồ sơ xác minh AwaitingAdmin và background check ReportReceived | top1 cấm john với lý do "Lừa đảo" | Tình trạng Banned; kháng nghị về lệnh đình chỉ tự đóng; hồ sơ xác minh và background check chuyển Cancelled | R-07, X-03 |
| AC-28 | john có tình trạng Good | top1 cấm john với lý do "Lừa đảo" | Tình trạng Banned | R-07, X-02 |
| AC-29 | john đang Banned | admin1 gỡ đình chỉ cho john | Bị từ chối; tình trạng vẫn Banned | R-07, R-08, P-08 |
| AC-30 | admin1 đình chỉ john; john có gói Cancelling do đình chỉ, periodEnd 2026-11-10 | admin4 (Hỗ trợ) gỡ đình chỉ ngày 2026-11-01 với lý do "Đã xác minh lại" | Tình trạng Good; like của john hiện lại; kết nối cũ vẫn Ended; john bật lại được tự gia hạn | R-08, X-04 |
| AC-31 | admin1 đình chỉ john | admin1 tự gỡ đình chỉ đó | Bị từ chối | R-08 |
| AC-32 | john đang Good | admin1 gỡ đình chỉ cho john | Bị từ chối | R-18 |
| AC-33 | admin1 đình chỉ john; john gửi kháng nghị | admin1 xét kháng nghị đó | Bị từ chối | R-09, P-09 |
| AC-34 | Như AC-33 | admin4 (Hỗ trợ) chấp nhận kháng nghị với lý do "Không đủ bằng chứng" | Tình trạng john tự về Good; kết nối cũ không được khôi phục | R-09, R-10, X-05, F-01 |
| AC-35 | Như AC-33 | admin4 từ chối kháng nghị không ghi lý do, rồi với lý do "Có bằng chứng quấy rối" | Lần đầu bị từ chối; lần sau kháng nghị Rejected; tình trạng vẫn Suspended | R-09, R-10 |
| AC-36 | top1 cấm john; john gửi kháng nghị | admin4 (chỉ Hỗ trợ) xét, rồi top1 xét | Cả hai bị từ chối | R-09 |
| AC-37 | top1 cấm john; john gửi kháng nghị | top2 (Cấp cao nhất) chấp nhận với lý do "Nhầm người" | Tình trạng john về Good | R-10, X-06 |
| AC-38 | admin1 đình chỉ john; john gửi kháng nghị; admin4 gỡ đình chỉ | admin5 (Hỗ trợ) chấp nhận kháng nghị đó | Bị từ chối vì kháng nghị đã tự đóng | R-10, R-08 |
| AC-39 | Hàng chờ có hồ sơ AwaitingAdmin với submittedAt 2026-10-01 08:00 (john), 2026-10-01 07:00 (maria), 2026-10-02 06:00 (anna), và một hồ sơ Submitted | admin2 (Xác minh) mở hàng chờ | Thứ tự maria, john, anna; không có hồ sơ Submitted | R-11, P-10, F-02 |
| AC-40 | Hai hồ sơ AwaitingAdmin cùng submittedAt; mã thành viên của lisa nhỏ hơn của mia | admin2 mở hàng chờ | lisa đứng trước mia | R-11 |
| AC-41 | Hàng chờ background check có báo cáo nhận lúc 2026-10-05 09:00 (john) và 2026-10-04 09:00 (peter) | admin2 mở hàng chờ | peter đứng trước john | R-11 |
| AC-42 | admin2 đang mở hồ sơ của maria | admin5 (Xác minh) mở cùng hồ sơ | admin5 mở được; không có khóa | R-11 |
| AC-43 | Hồ sơ của john ở Declined, resubmissions = 3, chưa được cấp thêm | admin2 cấp thêm 1 lượt với lý do "Giấy tờ bị hệ thống đọc sai" | Giới hạn nộp lại thành 4; john nộp lại được lần nữa và vào lại được Freemium Lobby | R-12, P-11, F-02 |
| AC-44 | Như AC-43, john đã dùng lượt thứ 4 và bị Declined (resubmissions = 4) | admin2 cấp thêm 1 lượt | Giới hạn thành 5 | R-12 |
| AC-45 | Hồ sơ của john ở Declined, resubmissions = 1 | admin2 cấp thêm lượt | Bị từ chối | R-12 |
| AC-46 | admin1 chỉ có vai trò Hỗ trợ | admin1 cấp thêm lượt, hoặc admin2 cấp mà không ghi lý do | Cả hai bị từ chối | R-12, P-11 |
| AC-47 | BackgroundCheck của john ở Failed với 1 cờ Failed; top3 giữ cả vai trò Cấp cao nhất và Xác minh | top3 đổi sang Passed với lý do "Certn đính chính kết quả" | BackgroundCheck Passed; cờ Failed đóng; john nhận thông báo sự kiện (6) | R-13, P-12 |
| AC-48 | BackgroundCheck của john ở Failed | admin2 (chỉ Xác minh), rồi top1 (chỉ Cấp cao nhất) đổi sang Passed | Cả hai bị từ chối | R-13, P-12 |
| AC-49 | BackgroundCheck của john ở Passed | top3 đổi sang Failed | Bị từ chối | R-13 |
| AC-50 | Xác minh của maria Approved; maria có yêu cầu Pending từ john, kết nối Open với peter, gói không có | admin2 thu hồi với lý do "Giấy tờ giả" | Xác minh chuyển Declined với lý do "Giấy tờ giả"; maria mất huy hiệu và không còn hiện trong Lobby; yêu cầu từ john Expired; kết nối với peter Ended; maria nhận push, thông báo trong app và email Declined kèm lý do | R-14, P-13 |
| AC-51 | Xác minh của john Approved; john có gói Active | admin2 thu hồi với lý do "Giấy tờ giả" | Gói của john vẫn Active | R-14 |
| AC-52 | Xác minh của maria Approved | admin1 (chỉ Hỗ trợ) thu hồi | Bị từ chối | R-14, P-13 |
| AC-53 | top1; audit có bản ghi đình chỉ john lúc 2026-10-01 00:00:00 và 2026-10-07 23:59:59, và lúc 2026-10-08 00:00:00 | Tìm theo thành viên john, loại "đình chỉ", từ ngày 2026-10-01 tới ngày 2026-10-07, rồi xuất CSV | Kết quả gồm đúng 2 bản ghi đầu; tệp CSV chứa đúng 2 bản ghi đó | R-15, P-14 |
| AC-54 | admin2 mở hồ sơ maria lúc 09:00:00, bị từ chối đọc audit log lúc 09:05:00; ai đó đăng nhập sai bằng nobody@filipinaconnect.us lúc 09:10:00 | top1 xem audit log | Có 3 bản ghi tương ứng, bản ghi thứ ba có email nobody@filipinaconnect.us | R-16 |
| AC-55 | admin1 đình chỉ john lúc 10:00:00 với lý do "Quấy rối" | top1 xem audit log | Có bản ghi: admin1, đình chỉ, john, "Quấy rối", thành công, 10:00:00 | R-16 |
| AC-56 | top1 và top2 là hai admin Cấp cao nhất Active | top1 vô hiệu hóa admin1 đang đăng nhập, rồi đổi vai trò của admin2 từ Hỗ trợ sang Xác minh | admin1 Disabled và bị đăng xuất ngay; admin2 chỉ còn vai trò Xác minh và bị đăng xuất ngay | R-17, X-09, P-15 |
| AC-57 | top1 là admin Cấp cao nhất Active duy nhất | top1 bỏ vai trò Cấp cao nhất của chính mình | Bị từ chối; top1 vẫn giữ vai trò Cấp cao nhất | R-17 |
| AC-58 | admin1 mất điện thoại cài mã hai lớp | top1 đặt lại mã hai lớp cho admin1 | Lần đăng nhập sau, admin1 phải cài mã hai lớp mới | R-17, P-15 |
| AC-59 | admin1 đang Locked | top1 vô hiệu hóa admin1 | admin1 Disabled | R-17, X-10 |
| AC-60 | Thành viên john@example.com | john gửi yêu cầu tìm thành viên, rồi yêu cầu đình chỉ maria tới website admin | Cả hai bị từ chối | P-03, P-06 |
| AC-61 | admin1 chỉ có vai trò Hỗ trợ | admin1 vô hiệu hóa admin5, rồi mở khóa một admin Locked | Cả hai bị từ chối | R-17, P-15 |

## 9. Non-functional

| Code | Quality | Measure | Target | Source |
| --- | --- | --- | --- | --- |

## 10. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |
| ASM-01 | SPEC-1, SPEC-2, SPEC-4 và SPEC-5 được sửa đổi để hiện thực R-05, R-07, R-12, R-13 và R-14; các bản sửa đổi được duyệt cùng SPEC-8 (SRC-24#L23, SRC-24#L27-L29, SRC-25#L20, SRC-25#L23, SRC-25#L26-L27, SRC-25#L33, SRC-25#L36) | Honda duyệt các bản sửa đổi cùng SPEC-8 |
| ASM-02 | Khách chỉ định người nhận tài khoản admin Cấp cao nhất đầu tiên (SRC-24#L21) | Honda hỏi khách, trước ngày ra mắt |

## 11. Out of scope

- Xử lý báo cáo, cờ đáng ngờ, gỡ ảnh, xem danh sách chặn, từ khóa tiền, bài giáo dục văn hóa, giá, hoàn tiền, cờ chargeback và thu tiền muộn, yêu cầu, kết nối, tin nhắn, thông báo hệ thống: SPEC admin phần 2 (BRIEF-1/C-33, BRIEF-1/C-34, BRIEF-1/C-35, BRIEF-1/C-36, BRIEF-1/C-37, BRIEF-1/C-38).
- Máy trạng thái xác minh: SPEC-2; máy trạng thái tài khoản: SPEC-1; máy trạng thái gói: SPEC-5; máy trạng thái yêu cầu và kết nối: SPEC-4.

## Change log

| Version | Date | By | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-09-30 | Honda | Approved |
