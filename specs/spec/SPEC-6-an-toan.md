---
id: SPEC-6
title: An toàn
version: 0.2.0
status: approved
owner: Honda
flow: project
risk: high
review: specs/review/SPEC-6-0.2.0.md
parent: [BRIEF-1@0.1.0]
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:14abbb044f120c38e8ee9d28
---

# SPEC-6: An toàn

<!-- Skyline SPEC (project flow): the exact logic. One row, one fact. Bare codes (R-01) are this SPEC; anything else is qualified (BRIEF-1/C-02). Every rule has a Source and at least one AC. Each unknown becomes a CLARIFY marker; never guess. -->

## 1. Scope

Implements BRIEF-1/C-25, BRIEF-1/C-26, BRIEF-1/C-27, BRIEF-1/C-28 và BRIEF-1/C-29, cùng phần audit log của các sự kiện này trong BRIEF-1/C-40: báo cáo, chặn, phát hiện thông tin liên lạc, cảnh báo lừa đảo, giáo dục an toàn, gắn cờ tài khoản đáng ngờ và kháng nghị. Hậu quả của việc chặn lên yêu cầu liên hệ và kết nối được định nghĩa trong SPEC-4 (bản sửa đổi đi cùng SPEC-6). Admin xử lý báo cáo, cờ, danh sách chặn và từ khóa ở SPEC-9; đình chỉ, cấm và kháng nghị ở SPEC-8; thông báo ở SPEC thông báo.

## 2. Glossary

| Code | Term | Definition | Source |
| --- | --- | --- | --- |
| T-01 | Chặn | Quan hệ một chiều do một thành viên tạo với một thành viên khác giới; khi còn hiệu lực, hai người không thấy và không tương tác được với nhau, trừ việc đọc lịch sử tin nhắn cũ | SRC-1#L159, SRC-19#L20, SRC-19#L33, SRC-20#L23 |
| T-02 | Báo cáo | Thông báo của một thành viên cho admin về một hồ sơ, một ảnh, một tin nhắn hoặc một yêu cầu liên hệ cụ thể của người khác, kèm một lý do | SRC-1#L157, SRC-1#L173, SRC-19#L21-L22, SRC-19#L33 |
| T-03 | Thông tin liên lạc | Số điện thoại, email, link hoặc tên tài khoản mạng xã hội, theo cách nhận diện ở R-08 | SRC-1#L142-L143, SRC-19#L24, SRC-19#L33 |
| T-04 | Tin nhắc tới tiền | Tin nhắn chứa ít nhất một từ khóa tiền của R-10 | SRC-19#L25, SRC-19#L33 |
| T-05 | Cờ đáng ngờ | Mục trong hàng chờ của admin báo một tài khoản có một dấu hiệu của R-12 | SRC-1#L169, SRC-19#L27, SRC-19#L33 |
| T-06 | Kháng nghị | Yêu cầu một thành viên bị đình chỉ hoặc bị cấm gửi để admin xem xét lại quyết định | SRC-1#L270-L271, SRC-19#L29, SRC-19#L33 |
| T-07 | Ngày UTC | Khoảng [00:00:00, 24:00:00) UTC của một ngày | SRC-19#L30 |
| T-08 | Đã từng thấy | Thành viên kia đã hiện với mình trong Lobby, kết quả tìm kiếm, "Đã thích bạn", một yêu cầu liên hệ, một kết nối, hoặc mình đã mở hồ sơ của họ | SRC-19#L20, SRC-20#L38, SRC-20#L43 |

## 3. Data

| Code | Field | Type | Required | Constraint | Source |
| --- | --- | --- | --- | --- | --- |
| DF-01 | Block | người chặn, người bị chặn, thời điểm UTC, trạng thái | yes | máy trạng thái Block; mỗi cặp (người chặn, người bị chặn) tối đa một Block Active (R-17) | SRC-19#L20, SRC-20#L32 |
| DF-02 | Report.reason | enum {Lừa đảo hoặc đòi tiền, Quấy rối, Hồ sơ giả, Nội dung không phù hợp, Chia sẻ thông tin liên lạc, Khác} | yes | R-04 | SRC-19#L21 |
| DF-03 | Report.description | text, 0–1000 ký tự đếm theo ký tự Unicode sau chuẩn hóa NFC; chỉ gồm ký tự trắng thì coi như để trống | no | R-04 | SRC-19#L21, SRC-20#L41 |
| DF-04 | Report.target | loại (hồ sơ, ảnh, tin nhắn, yêu cầu liên hệ), mã của mục đó và bản sao nội dung tại lúc báo cáo | yes | R-05 | SRC-19#L22, SRC-20#L36 |
| DF-05 | Report.status | enum {Open, Closed} | yes | máy trạng thái Report | SRC-19#L23 |
| DF-06 | SuspicionFlag | tài khoản, dấu hiệu (a, b, c hoặc d của R-12), thời điểm UTC tạo, trạng thái, thời điểm UTC đóng | khi R-12 tạo | máy trạng thái SuspicionFlag; tối đa một cờ Open cho mỗi tài khoản và mỗi dấu hiệu | SRC-19#L27, SRC-20#L21, SRC-27#L33 |
| DF-07 | Appeal | thành viên, quyết định bị kháng nghị, nội dung 1–2000 ký tự đếm theo NFC, thời điểm UTC, trạng thái | khi gửi | máy trạng thái Appeal; R-14 | SRC-19#L29, SRC-20#L31 |
| DF-08 | SafetyEducation.acknowledgedAt | thời điểm UTC bấm "Tôi đã hiểu" | khi đã xác nhận | R-11 | SRC-19#L26, SRC-20#L29 |
| DF-09 | MoneyKeywords | danh sách từ khóa tiền; khởi đầu gồm "send money", "Western Union", "GCash", "gift card", "bank" | yes | R-10; mỗi từ khóa, sau khi bỏ ký tự trắng đầu cuối, có 1–50 ký tự đếm theo NFC và không trùng khi không phân biệt kiểu chữ; danh sách luôn có ít nhất 1 từ khóa; admin Cấp cao nhất thêm, bớt ở SPEC-9 | SRC-19#L25, SRC-20#L20, SRC-27#L34, SRC-28#L39 |

## 4. States

| Code | Machine | State | Kind |
| --- | --- | --- | --- |
| S-01 | Block | Active | initial |
| S-02 | Block | Removed | terminal |
| S-03 | Report | Open | initial |
| S-04 | Report | Closed | terminal |
| S-05 | Appeal | Submitted | initial |
| S-06 | Appeal | Accepted | terminal |
| S-07 | Appeal | Rejected | terminal |
| S-08 | SuspicionFlag | Open | initial |
| S-09 | SuspicionFlag | Closed | terminal |

| Code | From | Event | Guard | To | Rules |
| --- | --- | --- | --- | --- | --- |
| X-01 | S-01 | unblock | | S-02 | R-03, R-15 |
| X-02 | S-03 | admin_close | | S-04 | R-06 |
| X-03 | S-05 | admin_accept | | S-06 | R-14 |
| X-04 | S-05 | admin_reject | | S-07 | R-14 |
| X-05 | S-08 | admin_close | | S-09 | R-12 |

## 5. Rules

| Code | Rule | Source |
| --- | --- | --- |
| R-01 | Thành viên chặn được một thành viên khác giới mà mình đã từng thấy (T-08); người bị chặn không được báo | SRC-1#L145, SRC-1#L159, SRC-19#L20, SRC-19#L33, SRC-20#L38, SRC-20#L43, BRIEF-1/C-26 |
| R-02 | Khi Block Active: hai người không thấy nhau trong Lobby, tìm kiếm, "Đã thích bạn", danh sách yêu cầu và danh sách kết nối; like của cả hai chiều bị xóa; yêu cầu liên hệ Pending giữa hai người chuyển Expired và kết nối Open giữa hai người chuyển Ended theo SPEC-4, với người thực hiện là người chặn; cả người chặn lẫn người bị chặn đều không gửi được like, yêu cầu hay tin nhắn cho người kia và không mở được hồ sơ của người kia (người chặn phải bỏ chặn trước); người bị chặn thấy thông báo chung "Không thể thực hiện", giống khi hồ sơ bị ẩn hoặc không còn tồn tại | SRC-19#L20, SRC-19#L31, SRC-19#L33, SRC-20#L22, SRC-20#L28, SRC-20#L43 |
| R-03 | Chỉ người chặn bỏ chặn được Block của mình; bỏ chặn không khôi phục like, yêu cầu hay kết nối cũ; sau mọi lần chặn, kể cả khi lúc chặn hai người chưa có yêu cầu hay kết nối, và sau khi bỏ chặn, nam không bao giờ gửi yêu cầu liên hệ cho người đó được (quy tắc chặn của SPEC-4 bản 0.2.0) | SRC-21#L19, SRC-21#L27, SRC-19#L20, SRC-19#L33, SRC-20#L22, SRC-20#L43 |
| R-04 | Mỗi báo cáo có một lý do từ danh sách DF-02; mô tả không bắt buộc, tối đa 1000 ký tự đếm theo NFC; mô tả chỉ gồm ký tự trắng coi như để trống; thiếu lý do hoặc mô tả quá 1000 ký tự thì từ chối | SRC-1#L157, SRC-19#L21, SRC-19#L33, SRC-20#L41, SRC-20#L43, BRIEF-1/C-25 |
| R-05 | Thành viên báo cáo được một hồ sơ, một ảnh, một tin nhắn hoặc một yêu cầu liên hệ của người khác mà mình đang xem được; không báo cáo được nội dung của chính mình; báo cáo lưu bản sao nội dung tại lúc gửi; khi gửi, màn hình hỏi "Chặn luôn người này?" với lựa chọn mặc định là có; chọn có thì tạo Block theo R-01, kể cả khi báo cáo bị từ chối theo R-04 hoặc R-07 | SRC-19#L22, SRC-19#L33, SRC-20#L27, SRC-20#L36, SRC-20#L43 |
| R-06 | Báo cáo được đưa vào hàng chờ của admin ở trạng thái Open; người báo cáo thấy "Đã nhận báo cáo" và không được biết kết quả xử lý; người bị báo cáo không được báo; admin đóng báo cáo ở SPEC-9 | SRC-1#L171, SRC-19#L23, SRC-19#L33 |
| R-07 | Mỗi thành viên có tối đa 20 báo cáo được tạo trong một ngày UTC; lần gửi bị từ chối không tính; khi nhiều báo cáo đến cùng lúc, giới hạn vẫn được giữ đúng; báo cáo thứ 21 trong ngày bị từ chối; lượt đếm về 0 lúc 00:00:00 UTC | SRC-19#L30, SRC-19#L33, SRC-20#L33, SRC-20#L43 |
| R-08 | Thông tin liên lạc được nhận diện là: số điện thoại có từ 7 chữ số trở lên, trong đó các chữ số cách nhau bởi dấu cách, gạch ngang, dấu chấm hoặc ngoặc vẫn tính là liền nhau; địa chỉ email; mọi link (bắt đầu bằng http, bằng www, hoặc có dạng tên miền); tên tài khoản kèm tên một nền tảng Facebook, Instagram, WhatsApp, Telegram, Viber, Line hoặc WeChat; và chuỗi dạng "@tên"; chỉ nhắc tên nền tảng mà không kèm số, tên tài khoản hay link thì không tính | SRC-1#L142-L143, SRC-19#L24, SRC-19#L33, SRC-20#L19, SRC-20#L25, SRC-20#L35, SRC-20#L43, BRIEF-1/K-06 |
| R-09 | Tin nhắn chứa thông tin liên lạc vẫn được gửi, và cả người gửi lẫn người nhận thấy cảnh báo lừa đảo (SPEC-4/R-12); phần giới thiệu hồ sơ (SPEC-3) chứa thông tin liên lạc thì bị từ chối lưu; tên và thành phố không bị kiểm tra | SRC-15#L28, SRC-19#L24, SRC-19#L33, SRC-20#L35, SRC-20#L43 |
| R-10 | Tin nhắn chứa ít nhất một từ khóa trong MoneyKeywords, so khớp nguyên từ và không phân biệt kiểu chữ, thì người nhận thấy cảnh báo lừa đảo; một tin chứa nhiều từ khóa vẫn là một tin nhắc tới tiền; tin được so với danh sách MoneyKeywords tại lúc gửi, và tin đã gửi không được xét lại khi danh sách thay đổi | SRC-1#L163, SRC-19#L25, SRC-19#L33, SRC-20#L20, SRC-20#L30, SRC-20#L34, SRC-20#L43, BRIEF-1/C-27, SRC-27#L34, SRC-27#L43 |
| R-11 | Trước khi nam gửi yêu cầu liên hệ đầu tiên, và trước khi nữ chấp nhận yêu cầu liên hệ đầu tiên, màn giáo dục an toàn hiện ra và luôn có phần cảnh báo lừa đảo; màn này hiện lại mỗi lần cho tới khi thành viên bấm "Tôi đã hiểu"; sau khi bấm, việc gửi hoặc chấp nhận tự đi tiếp và được tính tại thời điểm bấm (nếu lúc đó yêu cầu đã quá mốc 336 giờ của SPEC-4 thì việc chấp nhận bị từ chối); nội dung ban đầu do khách cung cấp, admin Cấp cao nhất sửa được ở SPEC-9 | SRC-1#L165, SRC-19#L25-L26, SRC-19#L33, SRC-20#L29, SRC-20#L37, SRC-20#L43, BRIEF-1/C-27, SRC-27#L37, SRC-28#L34 |
| R-12 | Hệ thống tạo một cờ đáng ngờ Open cho admin khi một tài khoản có một trong các dấu hiệu, xét trong cửa sổ trượt (sự kiện xảy ra đúng 168 giờ hoặc đúng 24 giờ trước đó là đã ra ngoài cửa sổ): (a) bị ≥ 3 người khác nhau báo cáo trong 168 giờ; (b) gửi cùng một nội dung (giống hệt sau khi bỏ ký tự trắng đầu cuối, không phân biệt kiểu chữ) cho ≥ 5 người khác nhau trong 24 giờ; (c) có ≥ 3 lần bị phát hiện thông tin liên lạc trong 24 giờ, gồm cả tin nhắn và lần lưu bio bị từ chối; (d) có ≥ 3 tin nhắc tới tiền trong 24 giờ; một tài khoản đã có cờ Open cho một dấu hiệu thì không tạo thêm cờ cho dấu hiệu đó; sau khi cờ của một dấu hiệu được đóng (SPEC-9), cờ mới cho dấu hiệu đó của tài khoản chỉ tính các sự kiện xảy ra sau thời điểm đóng; sự kiện xảy ra đúng thời điểm đóng không được tính | SRC-1#L161, SRC-1#L169, SRC-1#L270, SRC-19#L27, SRC-19#L33, SRC-20#L21, SRC-20#L26, SRC-20#L30, SRC-20#L43, BRIEF-1/C-28, SRC-27#L33, SRC-27#L43, SRC-28#L38, SRC-28#L45 |
| R-13 | Cờ đáng ngờ không tự động đình chỉ hay cấm tài khoản; admin quyết định và đóng cờ ở SPEC-9 | SRC-19#L28, SRC-19#L33 |
| R-14 | Thành viên bị đình chỉ hoặc bị cấm chỉ đăng nhập được vào màn kháng nghị; mỗi quyết định đình chỉ hoặc cấm được gửi tối đa một kháng nghị, nội dung 1–2000 ký tự đếm theo NFC, không chỉ gồm ký tự trắng; admin chấp nhận hoặc từ chối ở SPEC admin; kết quả được gửi tới thành viên qua email; việc khôi phục tài khoản do admin làm ở SPEC admin và không khôi phục kết nối cũ | SRC-1#L175, SRC-1#L270-L271, SRC-19#L29, SRC-19#L33, SRC-20#L31, SRC-20#L43, BRIEF-1/C-29 |
| R-15 | Hệ thống ghi audit log cho mỗi lần chặn, bỏ chặn, báo cáo, tạo cờ đáng ngờ, gửi kháng nghị và bấm "Tôi đã hiểu" ở màn giáo dục an toàn; mỗi bản ghi có người thực hiện ("hệ thống" với cờ), người liên quan và thời điểm UTC | SRC-1#L180-L182, SRC-20#L39, SRC-20#L43, BRIEF-1/C-40 |
| R-16 | Khi Block Active, cả hai người vẫn đọc được lịch sử tin nhắn cũ của họ (SPEC-4/R-14); người chặn vẫn báo cáo được tin nhắn cũ và hồ sơ của người bị chặn từ cuộc trò chuyện cũ | SRC-20#L23, SRC-20#L43 |
| R-17 | Chặn một người đã bị mình chặn (Block Active) không có tác dụng và không ghi audit mới; được chặn lại sau khi đã bỏ chặn; lượt chặn của hai bên với nhau độc lập | SRC-20#L32, SRC-20#L43 |
| R-18 | Khi việc chặn và một like, yêu cầu, chấp nhận, rút lại, từ chối, kết thúc hay tin nhắn giữa hai người đến cùng lúc, việc chặn không bao giờ bị từ chối: nếu thao tác kia được ghi trước thì việc chặn được áp dụng lên trạng thái sau thao tác đó (quy tắc chặn của SPEC-4 bản 0.2.0); nếu việc chặn được ghi trước thì thao tác kia bị từ chối | SRC-20#L40, SRC-20#L43, SRC-21#L22, SRC-21#L27 |

## 6. Permissions

<!-- Columns after Action are actors: BRIEF-n/A-nn. Cells: Y, N, or a rule code (R-nn) meaning "allowed when that rule holds". -->

| Code | Action | BRIEF-1/A-01 Nam Mỹ | BRIEF-1/A-02 Nữ Philippines | BRIEF-1/A-03 Admin |
| --- | --- | --- | --- | --- |
| P-01 | Chặn một thành viên | R-01 | R-01 | N |
| P-02 | Bỏ chặn | R-03 | R-03 | N |
| P-03 | Gửi báo cáo | R-07 | R-07 | N |
| P-04 | Xem kết quả xử lý báo cáo | N | N | Y |
| P-05 | Gửi kháng nghị | R-14 | R-14 | N |
| P-06 | Xem danh sách chặn (thành viên chỉ xem của chính mình; admin xem của mọi thành viên, ở SPEC-9) | Y | Y | Y |

## 7. Flows

### F-01 Báo cáo và chặn

1. Thành viên mở một hồ sơ, ảnh, tin nhắn hoặc yêu cầu liên hệ của người khác và bấm "Báo cáo" (R-05).
2. Chọn lý do, nhập mô tả nếu muốn (R-04, R-07).
3. Trả lời "Chặn luôn người này?" (mặc định có) (R-05, R-01).
4. Báo cáo vào hàng chờ admin; thành viên thấy "Đã nhận báo cáo" (R-06, R-15).
5. Nếu chọn chặn: hai người không thấy nhau, like bị xóa, yêu cầu Pending Expired, kết nối Open Ended; lịch sử tin nhắn cũ vẫn đọc được (R-02, R-16).

Nhánh lỗi:

- 2a. Không chọn lý do, hoặc mô tả quá 1000 ký tự → từ chối; nếu đã chọn chặn thì vẫn chặn (R-04, R-05).
- 2b. Đã có 20 báo cáo trong ngày → từ chối; nếu đã chọn chặn thì vẫn chặn (R-07, R-05).

### F-02 Cảnh báo và cờ

1. Thành viên gửi tin chứa thông tin liên lạc → tin vẫn gửi, cả hai thấy cảnh báo (R-08, R-09).
2. Thành viên gửi tin nhắc tới tiền → người nhận thấy cảnh báo (R-10).
3. Khi tài khoản đạt một dấu hiệu của R-12 → cờ đáng ngờ vào hàng chờ admin; không tự động đình chỉ (R-12, R-13).

### F-03 Kháng nghị

1. Thành viên bị đình chỉ hoặc cấm đăng nhập; chỉ màn kháng nghị mở ra (R-14).
2. Thành viên gửi kháng nghị (R-14, R-15).
3. Admin chấp nhận hoặc từ chối; kết quả gửi qua email (X-03, X-04, R-14).

## 8. Acceptance criteria

Mọi thời điểm trong mục này là UTC.

| Code | Given | When | Then | Covers |
| --- | --- | --- | --- | --- |
| AC-01 | john@example.com và maria@example.com có kết nối Open, like hai chiều | maria chặn john lúc 10:00:00 | Block Active; kết nối chuyển Ended với người thực hiện maria; like hai chiều bị xóa; john không nhận được thông báo nào về việc bị chặn | R-01, R-02, P-01, F-01 |
| AC-02 | maria đã chặn john | john mở Lobby, tìm kiếm, "Đã thích bạn", danh sách kết nối, rồi mở thẳng hồ sơ maria | john không thấy maria ở đâu; mở hồ sơ maria bị từ chối với thông báo "Không thể thực hiện" | R-02 |
| AC-03 | john có yêu cầu Pending tới maria | maria chặn john | Yêu cầu chuyển Expired với người thực hiện maria | R-02 |
| AC-04 | maria đã chặn john | john gửi like, yêu cầu liên hệ và tin nhắn tới maria | Cả ba bị từ chối với thông báo "Không thể thực hiện" | R-02 |
| AC-05 | maria đã chặn john | maria gửi like, tin nhắn tới john và mở hồ sơ john | Cả ba bị từ chối; màn hình nhắc maria phải bỏ chặn trước | R-02 |
| AC-06 | maria chưa từng thấy peter@example.com ở bất kỳ đâu | maria chặn peter qua một link trực tiếp | Bị từ chối; không có Block nào được tạo | R-01, P-01 |
| AC-07 | Nam có gói john thấy anna chỉ trong kết quả tìm kiếm | john chặn anna | Block Active được tạo | R-01 |
| AC-08 | maria đã chặn john và kết nối cũ đã Ended | maria bỏ chặn | Block chuyển Removed; like và kết nối cũ không được khôi phục; john không bao giờ gửi lại yêu cầu cho maria được | R-03, X-01, P-02 |
| AC-09 | maria đã chặn john (Block Active) | john gửi yêu cầu bỏ Block đó | Bị từ chối; Block vẫn Active | R-03, P-02 |
| AC-10 | maria đang xem một tin nhắn của john | Báo cáo với lý do "Quấy rối" và mô tả 1000 ký tự | Báo cáo được tạo ở Open, có bản sao nội dung tin nhắn | R-04, R-05, F-01 |
| AC-11 | maria đang xem một tin nhắn của john | Báo cáo không chọn lý do, rồi báo cáo với mô tả 1001 ký tự | Cả hai bị từ chối | R-04 |
| AC-12 | maria đang xem một tin nhắn của john | Báo cáo lý do "Khác" với mô tả "   " | Báo cáo được tạo; mô tả để trống | R-04 |
| AC-13 | maria đang báo cáo hồ sơ của john | Gửi báo cáo, giữ lựa chọn mặc định ở câu "Chặn luôn người này?" | Báo cáo được tạo; Block Active từ maria tới john | R-05, R-01 |
| AC-14 | maria đang báo cáo một ảnh của john | Bỏ chọn "Chặn luôn người này?" rồi gửi | Báo cáo được tạo; không có Block nào | R-05 |
| AC-15 | maria đã có 20 báo cáo hôm nay | Báo cáo john với "Chặn luôn người này?" để mặc định | Báo cáo bị từ chối; Block Active từ maria tới john vẫn được tạo | R-05, R-07 |
| AC-16 | john báo cáo một ảnh; john xóa ảnh đó sau khi báo cáo được tạo | Admin mở báo cáo | Admin thấy bản sao ảnh tại lúc báo cáo | R-05 |
| AC-17 | maria đang xem tin nhắn của chính mình | Báo cáo tin nhắn đó | Bị từ chối | R-05 |
| AC-18 | maria gửi báo cáo về john | maria mở lại báo cáo sau khi admin đóng nó | maria chỉ thấy "Đã nhận báo cáo"; yêu cầu xem kết quả xử lý bị từ chối; john không nhận được thông báo nào | R-06, P-04 |
| AC-19 | Báo cáo của maria ở Open | Admin đóng báo cáo | Báo cáo chuyển Closed | R-06, X-02 |
| AC-20 | maria đã có 19 báo cáo ngày 2026-10-10 | Gửi báo cáo thứ 20 lúc 23:00:00 | Báo cáo thứ 20 được tạo | R-07, P-03 |
| AC-21 | maria đã có 20 báo cáo ngày 2026-10-10 | Gửi báo cáo thứ 21 lúc 23:30:00, rồi gửi lại lúc 2026-10-11 00:00:00 | Lần lúc 23:30:00 bị từ chối; lần lúc 00:00:00 được tạo | R-07, P-03 |
| AC-22 | maria đã có 19 báo cáo hôm nay và 5 lần gửi bị từ chối vì thiếu lý do | Gửi 2 báo cáo hợp lệ trong cùng một mili giây | Đúng 1 báo cáo được tạo; maria có 20 báo cáo trong ngày | R-07 |
| AC-23 | john và maria có kết nối Open | john gửi lần lượt "Call me 5125550" (7 chữ số), "Call me 512555" (6 chữ số), "+1 512-555 0100", "john@example.com", "mysite.com/john", "@johntx" | Tin 1, 3, 4, 5, 6 được nhận diện là có thông tin liên lạc; tin 2 không; mọi tin đều được gửi | R-08, R-09, F-02 |
| AC-24 | john và maria có kết nối Open | john gửi "WhatsApp me", rồi "Drop me a line", rồi "WhatsApp john_tx" | Tin 1 và 2 không được nhận diện; tin 3 được nhận diện; cả john và maria thấy cảnh báo lừa đảo ở tin 3 | R-08, R-09 |
| AC-25 | maria đang sửa phần giới thiệu hồ sơ | Lưu bio "Nhắn mình qua Telegram @maria_ph" | Bị từ chối lưu; bio cũ giữ nguyên | R-09 |
| AC-26 | maria đang sửa tên | Đổi tên thành "Maria 09171234567" | Tên được lưu; không có kiểm tra thông tin liên lạc | R-09 |
| AC-27 | john và maria có kết nối Open | maria gửi "Can you send money via GCash?" | Tin được gửi; john (người nhận) thấy cảnh báo lừa đảo; maria không thấy cảnh báo | R-10, F-02 |
| AC-28 | john và maria có kết nối Open | john gửi "I work at a BANK", rồi "I went bankrupt" | maria thấy cảnh báo ở tin 1; không thấy cảnh báo ở tin 2 | R-10 |
| AC-29 | Admin đã thêm "crypto" vào MoneyKeywords | john gửi "Let's invest in crypto" | maria thấy cảnh báo lừa đảo | R-10 |
| AC-30 | Nam john@example.com đủ điều kiện gửi, chưa từng gửi yêu cầu, chưa xác nhận màn giáo dục an toàn | Bấm gửi yêu cầu tới maria | Màn giáo dục an toàn hiện ra, có phần cảnh báo lừa đảo; chưa có yêu cầu nào được tạo | R-11 |
| AC-31 | Như AC-30 | john đóng màn mà không bấm "Tôi đã hiểu", rồi bấm gửi lại | Màn giáo dục an toàn hiện lại; vẫn chưa có yêu cầu | R-11 |
| AC-32 | Như AC-30 | john bấm "Tôi đã hiểu" lúc 10:00:00 | Yêu cầu tới maria được tạo tự động với sentAt 10:00:00; audit có bản ghi xác nhận của john | R-11, R-15 |
| AC-33 | Như AC-32 | john gửi yêu cầu thứ hai tới anna | Không có màn giáo dục an toàn; yêu cầu được gửi | R-11 |
| AC-34 | Yêu cầu của john tới maria gửi lúc 2026-10-01 10:00:00; maria chưa xác nhận màn giáo dục an toàn | maria bấm "Chấp nhận" lúc 2026-10-15 09:59:00 và bấm "Tôi đã hiểu" lúc 2026-10-15 10:00:01 | Việc chấp nhận bị từ chối vì đã quá mốc 336 giờ | R-11 |
| AC-35 | john bị 3 người khác nhau báo cáo lúc 2026-10-01 10:00:00, 2026-10-04 10:00:00 và 2026-10-08 09:59:59 | Hệ thống xét dấu hiệu | Có 1 cờ đáng ngờ Open dấu hiệu (a) cho john | R-12, F-02 |
| AC-36 | john bị 3 người khác nhau báo cáo lúc 2026-10-01 10:00:00, 2026-10-04 10:00:00 và 2026-10-08 10:00:00 | Hệ thống xét dấu hiệu | Không có cờ dấu hiệu (a) | R-12 |
| AC-37 | john bị cùng một người báo cáo 3 lần trong 1 ngày | Hệ thống xét dấu hiệu | Không có cờ dấu hiệu (a) | R-12 |
| AC-38 | john gửi "Hi beautiful" cho 4 nữ và "  hi BEAUTIFUL " cho nữ thứ 5 từ 10:00:00 tới 20:00:00 | Hệ thống xét dấu hiệu | Có 1 cờ dấu hiệu (b) | R-12 |
| AC-39 | john gửi "Hi beautiful" cho 4 nữ trong 24 giờ | Hệ thống xét dấu hiệu | Không có cờ dấu hiệu (b) | R-12 |
| AC-40 | john gửi 2 tin chứa thông tin liên lạc lúc 08:00:00 và 12:00:00, và lưu bio có số điện thoại bị từ chối lúc 20:00:00 cùng ngày | Hệ thống xét dấu hiệu | Có 1 cờ dấu hiệu (c) | R-12 |
| AC-41 | john có tin chứa thông tin liên lạc lúc 2026-10-01 08:00:00, 2026-10-01 12:00:00 và 2026-10-02 08:00:00 | Hệ thống xét dấu hiệu | Không có cờ dấu hiệu (c) (tin đầu đã ra ngoài cửa sổ 24 giờ) | R-12 |
| AC-42 | maria gửi 3 tin nhắc tới tiền trong 2 giờ, và 1 tin khác chứa cả "bank" lẫn "GCash" | Hệ thống xét dấu hiệu | Có 1 cờ dấu hiệu (d); tin chứa hai từ khóa chỉ tính là 1 | R-12 |
| AC-43 | john đã có cờ Open dấu hiệu (c) | john gửi thêm 3 tin chứa thông tin liên lạc trong 24 giờ | Không có cờ mới; vẫn đúng 1 cờ Open dấu hiệu (c) | R-12 |
| AC-44 | john có cờ Open dấu hiệu (c) | Admin đóng cờ | Cờ chuyển Closed | R-12, X-05 |
| AC-45 | john có cờ đáng ngờ Open | Không có admin xử lý trong 7 ngày | Tài khoản john vẫn Active; john vẫn đăng nhập và nhắn tin được | R-13 |
| AC-46 | Tài khoản john bị đình chỉ | john đăng nhập | Chỉ màn kháng nghị mở ra; Lobby, tin nhắn và hồ sơ đều bị từ chối | R-14, F-03 |
| AC-47 | Như AC-46 | john gửi kháng nghị 2000 ký tự, rồi thử gửi kháng nghị thứ hai cho cùng quyết định | Kháng nghị đầu được tạo ở Submitted; kháng nghị thứ hai bị từ chối | R-14, P-05 |
| AC-48 | Như AC-46 | john gửi kháng nghị 2001 ký tự, rồi kháng nghị "   " | Cả hai bị từ chối | R-14 |
| AC-49 | Kháng nghị của john ở Submitted | Admin chấp nhận | Kháng nghị chuyển Accepted; hộp thư john nhận 1 email báo kết quả; kết nối cũ của john không được khôi phục | R-14, X-03 |
| AC-50 | Kháng nghị của john ở Submitted | Admin từ chối | Kháng nghị chuyển Rejected; hộp thư john nhận 1 email báo kết quả | R-14, X-04 |
| AC-51 | Tài khoản maria Active, không bị đình chỉ hay cấm | maria mở màn kháng nghị và gửi | Bị từ chối | R-14, P-05 |
| AC-52 | maria chặn john lúc 10:00:00, báo cáo một tin nhắn cũ của john lúc 10:01:00, bỏ chặn lúc 11:00:00 | Admin cấp cao nhất xem audit log | Có 3 bản ghi với người thực hiện maria, người liên quan john và đúng các thời điểm | R-15 |
| AC-53 | Như AC-35 | Admin cấp cao nhất xem audit log | Có bản ghi tạo cờ với người thực hiện "hệ thống" | R-15 |
| AC-54 | john và maria có kết nối Open với 8 tin nhắn | maria chặn john, rồi mở cuộc trò chuyện cũ và báo cáo tin thứ 5; john mở cuộc trò chuyện cũ | maria thấy đủ 8 tin và báo cáo được tin thứ 5; john cũng thấy đủ 8 tin; không ai gửi được tin mới | R-16, R-05 |
| AC-55 | maria đã chặn john | maria chặn john lần nữa từ một thiết bị khác | Vẫn đúng 1 Block Active; không có bản ghi audit mới | R-17 |
| AC-56 | maria đã bỏ chặn john | maria chặn john lần nữa | Block Active mới được tạo | R-17 |
| AC-57 | maria chặn john và john chặn maria; maria bỏ chặn | john thử gửi tin tới maria | Bị từ chối vì Block của john vẫn Active | R-17 |
| AC-58 | john và maria có kết nối Open | maria chặn lúc 10:00:00.050 và tin của john đến lúc 10:00:00.100 | Block Active; tin của john bị từ chối | R-18 |
| AC-59 | maria đã chặn john và peter; anna@example.com không phải maria | maria mở danh sách chặn của mình; anna yêu cầu xem danh sách chặn của maria | maria thấy john và peter; yêu cầu của anna bị từ chối | P-06 |
| AC-60 | Yêu cầu của john tới maria ở Pending | maria chấp nhận lúc 10:00:00.050 và john chặn lúc 10:00:00.100 | Việc chặn được áp dụng: Block Active; kết nối vừa tạo chuyển Ended | R-18 |
| AC-61 | maria, sara và kim báo cáo john lúc 09:00:00, 10:00:00 và 11:00:00; cờ (a) của john Open lúc 11:00:00; admin đóng cờ lúc 12:00:00 | anna báo cáo john lúc 13:00:00, lisa lúc 14:00:00, mia lúc 15:00:00 | Không có cờ mới lúc 13:00:00 và 14:00:00; một cờ (a) mới được tạo lúc 15:00:00 | R-12 |
| AC-62 | MoneyKeywords không có "paypal" | john gửi maria "use paypal" lúc 09:59:00; admin thêm "paypal" lúc 10:00:00; john gửi "use paypal" lúc 10:01:00 | Tin 09:59:00 không có cảnh báo và không tính vào dấu hiệu (d); tin 10:01:00 maria thấy cảnh báo lừa đảo | R-10 |
| AC-63 | Cờ (a) của john được đóng lúc 12:00:00.000 | anna báo cáo john lúc 12:00:00.000, lisa lúc 13:00:00, mia lúc 14:00:00, rồi kim lúc 15:00:00 | Không có cờ mới tới 14:00:00; một cờ (a) mới được tạo lúc 15:00:00 | R-12 |

## 9. Non-functional

| Code | Quality | Measure | Target | Source |
| --- | --- | --- | --- | --- |

## 10. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |
| ASM-01 | Khách cung cấp nội dung màn giáo dục an toàn và nội dung cảnh báo lừa đảo (SRC-19#L26) | Honda hỏi khách, trước ngày ra mắt |
| ASM-02 | SPEC-4 được sửa đổi để thêm sự kiện chặn cho yêu cầu liên hệ và kết nối, và quy tắc không gửi lại sau khi bỏ chặn (SRC-20#L22); bản sửa đổi được duyệt cùng SPEC-6 | Honda duyệt SPEC-4 bản sửa đổi cùng SPEC-6 |

## 11. Out of scope

- Admin xử lý báo cáo, cờ đáng ngờ, gỡ ảnh, xem danh sách chặn và sửa danh sách từ khóa tiền: SPEC-9 (BRIEF-1/C-35, BRIEF-1/C-36, SRC-20#L20, SRC-20#L24); đình chỉ, cấm, kháng nghị và khôi phục tài khoản: SPEC-8 (SRC-20#L31).
- Email kết quả kháng nghị và các thông báo khác: SPEC thông báo (BRIEF-1/C-23).
- Máy trạng thái của yêu cầu liên hệ và kết nối: SPEC-4.

## Change log

| Version | Date | By | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-09-29 | Honda | Approved |
| 0.2.0 | 2026-09-30 | Honda | Approved revision of 0.1.0 (minor): admin đóng báo cáo và cờ, cờ sau khi đóng, sửa từ khóa tiền (SPEC-9; SRC-27) |
