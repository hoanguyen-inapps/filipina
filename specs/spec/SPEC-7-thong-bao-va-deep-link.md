---
id: SPEC-7
title: Thông báo và deep link
version: 0.2.0
status: approved
owner: Honda
flow: project
risk: normal
review: specs/review/SPEC-7-0.2.0.md
parent: [BRIEF-1@0.1.0]
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:bad006abd4da141f62bddb8c
---

# SPEC-7: Thông báo và deep link

<!-- Skyline SPEC (project flow): the exact logic. One row, one fact. Bare codes (R-01) are this SPEC; anything else is qualified (BRIEF-1/C-02). Every rule has a Source and at least one AC. Each unknown becomes a CLARIFY marker; never guess. -->

## 1. Scope

Implements BRIEF-1/C-23 và BRIEF-1/C-24: push notification, email và thông báo trong app cho các sự kiện của SPEC-2, SPEC-3, SPEC-4 và SPEC-5, cài đặt thông báo, và deep link mở đúng màn hình. Các email của SPEC-1 (xác nhận, đặt lại mật khẩu) và email kết quả kháng nghị của SPEC-6 vẫn theo các SPEC đó. Việc soạn và gửi thông báo hệ thống nằm ở SPEC-9 (BRIEF-1/C-38); SPEC này định nghĩa cách nó tới thành viên (sự kiện 11).

## 2. Glossary

| Code | Term | Definition | Source |
| --- | --- | --- | --- |
| T-01 | Sự kiện thông báo | Một trong 11 sự kiện: (1) nữ nhận yêu cầu liên hệ mới; (2) yêu cầu của nam được chấp nhận; (3) tin nhắn mới; (4) like mới; (5) admin quyết xác minh danh tính là Approved hoặc Declined (SPEC-2); (6) admin quyết background check là Passed hoặc Failed (SPEC-2); (7) Subscription chuyển sang PastDue (SPEC-5); (8) gói đã hủy sắp hết kỳ (R-14); (9) Subscription chuyển sang Ended (SPEC-5); (10) admin gỡ một ảnh hoặc phần giới thiệu của thành viên (SPEC-9); (11) admin gửi thông báo hệ thống (SPEC-9) | SRC-1#L212-L213, SRC-1#L233-L234, SRC-22#L19, SRC-22#L34, SRC-23#L22-L24, SRC-23#L39, SRC-27#L31, SRC-27#L38-L39, SRC-27#L43 |
| T-02 | Push | Thông báo đẩy tới app iOS hoặc Android trên thiết bị đang đăng nhập; website không nhận push | SRC-1#L212, SRC-22#L32, SRC-23#L33, SRC-23#L39 |
| T-03 | Thông báo trong app | Một mục trong danh sách thông báo (biểu tượng chuông) của app | SRC-22#L21, SRC-22#L34 |
| T-04 | Màn đích | Màn hình mà một thông báo mở ra khi được bấm (R-09) | SRC-1#L213, SRC-22#L27, SRC-22#L34 |
| T-05 | Mốc thời gian | Một thời hạn được coi là đã qua khi thời gian đã trôi ≥ đúng thời hạn đó | SRC-10#L37, SRC-10#L54 |

## 3. Data

| Code | Field | Type | Required | Constraint | Source |
| --- | --- | --- | --- | --- | --- |
| DF-01 | Notification | thành viên nhận, sự kiện (T-01), đối tượng liên quan (yêu cầu, kết nối, like, xác minh, background check, gói, nội dung bị gỡ hoặc thông báo hệ thống), thời điểm UTC tạo hoặc cập nhật, đã đọc hay chưa | yes | R-03 | SRC-22#L19, SRC-22#L21, SRC-23#L19, SRC-27#L31, SRC-27#L39 |
| DF-02 | NotificationSettings.likesPush, NotificationSettings.messagesPush | boolean theo tài khoản, mặc định bật | yes | R-04 | SRC-22#L22, SRC-23#L34 |
| DF-03 | PushThrottle | cuộc trò chuyện, thành viên nhận, thời điểm push tin nhắn gần nhất | khi có push tin nhắn | R-06 | SRC-22#L24, SRC-23#L21 |

## 4. States

| Code | Machine | State | Kind |
| --- | --- | --- | --- |

| Code | From | Event | Guard | To | Rules |
| --- | --- | --- | --- | --- | --- |

## 5. Rules

| Code | Rule | Source |
| --- | --- | --- |
| R-01 | Mỗi sự kiện thông báo (T-01) gửi push tới thành viên nhận, theo R-04, R-06, R-08 và R-11, trừ sự kiện (10) không có push và sự kiện (11) chỉ có push khi admin chọn push lúc soạn (SPEC-9); không gửi push hay thông báo nào khi yêu cầu liên hệ bị từ chối hoặc hết hạn; thành viên đang bị đình chỉ hoặc bị cấm không nhận push hay thông báo trong app nào (chỉ nhận email kết quả kháng nghị của SPEC-6); sự kiện (10) xảy ra khi thành viên đang bị đình chỉ hoặc bị cấm được gửi (thông báo trong app và email) lúc tình trạng tài khoản của thành viên về Good; tin nhắn đến khi người nhận đang mở đúng cuộc trò chuyện đó thì không gửi push | SRC-1#L212, SRC-1#L233-L234, SRC-22#L19, SRC-22#L34, SRC-23#L26, SRC-23#L35, SRC-23#L39, BRIEF-1/C-23, SRC-27#L31, SRC-27#L39, SRC-27#L43, SRC-28#L41, SRC-28#L45 |
| R-02 | Email chỉ được gửi thêm cho các sự kiện (5), (6), (7), (9) và (10) của T-01, và cho sự kiện (11) khi admin chọn email lúc soạn (SPEC-9), trừ khi thành viên nhận đang bị đình chỉ hoặc bị cấm; không gửi email cho tin nhắn, like hay yêu cầu liên hệ; mỗi email có một link tới màn đích theo R-15 | SRC-22#L20, SRC-22#L34, SRC-23#L23-L24, SRC-23#L26-L27, SRC-23#L39, SRC-27#L31, SRC-27#L39, SRC-27#L43 |
| R-03 | Mỗi sự kiện thông báo tạo một thông báo trong app cho thành viên nhận, kể cả khi push bị tắt hoặc không được phép; riêng tin nhắn mới, mỗi cuộc trò chuyện có tối đa một thông báo chưa đọc, được cập nhật thời điểm khi có tin mới; tin đến khi người nhận đang mở cuộc trò chuyện đó thì thông báo được đánh dấu đã đọc; từ đúng mốc 90 ngày (2160 giờ) kể từ lúc tạo, thông báo bị ẩn ngay và được xóa trong ≤ 5 phút | SRC-22#L21, SRC-22#L29, SRC-22#L34, SRC-23#L19, SRC-23#L35-L36, SRC-23#L39 |
| R-04 | Thành viên tắt và bật được push cho like (sự kiện 4) và cho tin nhắn (sự kiện 3); công tắc áp dụng cho cả tài khoản, mọi thiết bị; không tắt được push cho các sự kiện còn lại | SRC-22#L22, SRC-22#L34, SRC-23#L34, SRC-23#L39 |
| R-05 | Push chỉ nêu loại sự kiện: không có tên, ảnh của người liên quan hay nội dung tin nhắn; push cho sự kiện (5) và (6) chỉ báo đã có kết quả, không nêu đạt hay không đạt; thông báo trong app và email thì nêu kết quả (kèm lý do từ chối theo SPEC-2 nếu có) và được nêu tên người liên quan; thông báo trong app và email của sự kiện (10) nêu loại nội dung bị gỡ (ảnh hoặc phần giới thiệu) và rằng nội dung bị gỡ vì vi phạm quy định, không nêu người báo cáo; thông báo trong app và email của sự kiện (11) có tiêu đề và nội dung do admin soạn; push của sự kiện (11) hiện tiêu đề do admin soạn | SRC-22#L23, SRC-22#L34, SRC-23#L30, SRC-23#L39, SRC-27#L31, SRC-27#L39, SRC-27#L43, SRC-28#L40, SRC-28#L45 |
| R-06 | Với mỗi cuộc trò chuyện và mỗi thành viên nhận, push tin nhắn mới được gửi tối đa 1 lần trong 5 phút: một tin mới đến khi chưa qua mốc 5 phút (300 giây) kể từ push tin nhắn gần nhất gửi cho người đó trong cuộc trò chuyện đó thì không gửi push; tin đến khi người nhận đang mở cuộc trò chuyện không tính vào mốc này | SRC-22#L24, SRC-22#L34, SRC-23#L21, SRC-23#L35, SRC-23#L39 |
| R-07 | Không có giờ yên lặng: push được gửi vào mọi giờ | SRC-22#L25, SRC-22#L34 |
| R-08 | Khi có Block Active giữa thành viên nhận và một người (SPEC-6, bên nào chặn cũng vậy), không có push, email hay thông báo trong app nào về người đó; khi Block được tạo, các thông báo trong app cũ về người đó bị xóa và các thông báo chưa gửi bị hủy; sau khi bỏ chặn, chỉ các sự kiện mới được thông báo | SRC-22#L26, SRC-22#L34, SRC-23#L28, SRC-23#L39 |
| R-09 | Bấm một push hoặc một thông báo trong app thì mở màn đích: sự kiện (1) mở yêu cầu liên hệ theo R-10; (2) và (3) mở cuộc trò chuyện, ở chế độ chỉ đọc nếu kết nối đã Ended, đang có Block Active hoặc bên kia đã xóa tài khoản (SPEC-4/R-14); (4) mở "Đã thích bạn"; (5) và (6) mở màn trạng thái xác minh; (7), (8) và (9) mở trang tài khoản trên website (SPEC-5); (10) mở màn sửa hồ sơ của chính mình; (11) mở màn chi tiết thông báo hệ thống; chưa đăng nhập thì mở màn đăng nhập, đăng nhập xong mới mở màn đích, nhưng nếu người đăng nhập không phải thành viên nhận thì hiện "Không thể mở nội dung này" rồi về màn chính; link mở trên điện thoại chưa cài app thì mở App Store (iOS) hoặc Google Play (Android) | SRC-1#L213, SRC-22#L27, SRC-22#L34, SRC-23#L20, SRC-23#L27, SRC-23#L29, SRC-23#L39, BRIEF-1/C-24, SRC-27#L39, SRC-28#L42, SRC-28#L45 |
| R-10 | Bấm thông báo (1) khi yêu cầu không còn Pending: nếu Withdrawn hoặc Expired thì hiện "Không thể mở nội dung này" rồi về màn chính; nếu Accepted thì mở cuộc trò chuyện; nếu Declined thì mở yêu cầu với trạng thái đã từ chối | SRC-22#L28, SRC-22#L34, SRC-23#L32, SRC-23#L39 |
| R-11 | Khi thành viên không cho phép push trên thiết bị, hệ thống chỉ tạo thông báo trong app; không gửi email thay cho push | SRC-22#L29, SRC-22#L34 |
| R-12 | Toàn bộ app, website, push, email và thông báo trong app dùng tiếng Anh trong MVP; các câu chữ trong ngoặc kép ở SPEC-1 đến SPEC-7 mô tả ý nghĩa, bản hiển thị là câu tiếng Anh tương ứng do khách cung cấp (ASM-01) | SRC-22#L30, SRC-22#L34, SRC-23#L37, SRC-23#L39 |
| R-13 | Push được gửi tới mọi thiết bị có app đang đăng nhập bằng tài khoản của thành viên nhận; khi đăng xuất trên một thiết bị, các push của tài khoản đó trên thiết bị ấy bị xóa và thiết bị không nhận push nữa | SRC-22#L32, SRC-22#L34, SRC-23#L27, SRC-23#L33, SRC-23#L39 |
| R-14 | Sự kiện (8) được tạo một lần cho mỗi lần Subscription chuyển sang Cancelling do nam hủy (SPEC-5): nếu lúc hủy còn ≥ 72 giờ tới periodEnd thì tạo khi đã qua mốc 72 giờ trước periodEnd; nếu còn < 72 giờ thì tạo ngay lúc hủy; bật lại rồi hủy lại thì tạo lại theo cùng cách; Cancelling do tài khoản bị đình chỉ hoặc cấm không tạo sự kiện (8) | SRC-22#L19, SRC-22#L34, SRC-23#L25, SRC-23#L39 |
| R-15 | Link trong email mở trên điện thoại thì mở màn đích trong app theo R-09; mở trên máy tính thì mở website: trang tài khoản với sự kiện (7) và (9), trang hướng dẫn mở app với sự kiện (5), (6), (10) và (11) | SRC-23#L27, SRC-23#L39, SRC-28#L43, SRC-28#L45 |

## 6. Permissions

<!-- Columns after Action are actors: BRIEF-n/A-nn. Cells: Y, N, or a rule code (R-nn) meaning "allowed when that rule holds". -->

| Code | Action | BRIEF-1/A-01 Nam Mỹ | BRIEF-1/A-02 Nữ Philippines |
| --- | --- | --- | --- |
| P-01 | Tắt hoặc bật push cho like và tin nhắn | R-04 | R-04 |
| P-02 | Tắt push cho xác minh, thanh toán và yêu cầu liên hệ | N | N |
| P-03 | Xem thông báo trong app của chính mình | Y | Y |

## 7. Flows

### F-01 Nhận và mở thông báo

1. Một sự kiện thông báo xảy ra (R-01).
2. Hệ thống tạo hoặc cập nhật thông báo trong app (R-03), gửi push tới mọi thiết bị có app đang đăng nhập nếu được phép và không bị tắt, trừ sự kiện (10) và sự kiện (11) khi admin không chọn push (R-01, R-04, R-06, R-11, R-13), và gửi email nếu là sự kiện (5), (6), (7), (9) hoặc (10), hay sự kiện (11) khi admin chọn email (R-02).
3. Thành viên bấm push, thông báo trong app hoặc link trong email → màn đích mở ra (R-09, R-15).

Nhánh lỗi:

- 2a. Có Block Active với người liên quan, hoặc thành viên nhận đang bị đình chỉ, cấm → không có thông báo (R-08, R-01).
- 3a. Chưa đăng nhập → đăng nhập rồi mở màn đích; người khác đăng nhập → "Không thể mở nội dung này" (R-09).
- 3b. Yêu cầu đã rút hoặc hết hạn → "Không thể mở nội dung này" (R-10).

## 8. Acceptance criteria

Mọi thời điểm trong mục này là UTC. Câu chữ trong ngoặc kép là ý nghĩa; bản hiển thị là tiếng Anh (R-12).

| Code | Given | When | Then | Covers |
| --- | --- | --- | --- | --- |
| AC-01 | john@example.com gửi yêu cầu liên hệ tới maria@example.com lúc 10:00:00 | Hệ thống xử lý sự kiện | Push loại "yêu cầu liên hệ mới" được gửi đi trước 10:01:00; maria có 1 thông báo trong app; maria không nhận email | R-01, R-02, R-03, N-01, F-01 |
| AC-02 | Yêu cầu của john tới maria được chấp nhận | Hệ thống xử lý sự kiện | john nhận 1 push và 1 thông báo trong app "yêu cầu được chấp nhận" | R-01 |
| AC-03 | maria từ chối yêu cầu của john; một yêu cầu khác của john hết hạn | Hệ thống xử lý hai sự kiện | john không nhận push, email hay thông báo trong app nào | R-01 |
| AC-04 | Admin duyệt xác minh danh tính của john là Approved | Hệ thống xử lý sự kiện | john nhận 1 push chỉ báo "có kết quả xác minh", 1 thông báo trong app ghi Approved và 1 email ghi Approved | R-01, R-02, R-05 |
| AC-05 | Admin chọn Declined cho xác minh của maria với lý do "Ảnh giấy tờ bị mờ" | Hệ thống xử lý sự kiện | maria nhận 1 push không nêu kết quả, 1 thông báo trong app và 1 email đều ghi Declined và lý do "Ảnh giấy tờ bị mờ" | R-01, R-02, R-05 |
| AC-06 | Dịch vụ xác minh gửi kết quả cho hồ sơ của john (AwaitingAdmin) | Hệ thống xử lý | john không nhận thông báo nào | R-01 |
| AC-07 | Admin chọn Failed cho background check của john | Hệ thống xử lý sự kiện | john nhận 1 push, 1 thông báo trong app và 1 email | R-01, R-02 |
| AC-08 | maria like john | Hệ thống xử lý sự kiện | john nhận 1 push không có tên; 1 thông báo trong app ghi "maria đã thích bạn"; không có email | R-01, R-02, R-05 |
| AC-09 | Gia hạn gói của john thất bại lúc 09:00:00 và 3 lần thử lại sau đó cũng thất bại | Hệ thống xử lý | john nhận đúng 1 push, 1 thông báo trong app và 1 email "gia hạn thất bại" | R-01, R-02 |
| AC-10 | maria không cho phép push trên điện thoại | john gửi yêu cầu liên hệ tới maria | maria có 1 thông báo trong app; không có push và không có email | R-03, R-11 |
| AC-11 | maria gửi 3 tin lúc 10:00, 10:10, 10:20 trong cùng cuộc trò chuyện với john, john chưa đọc | john mở danh sách thông báo | Có đúng 1 thông báo chưa đọc cho cuộc trò chuyện với maria, thời điểm 10:20 | R-03 |
| AC-12 | Thông báo trong app của john tạo lúc 2026-07-01 10:00:00 | john mở danh sách lúc 2026-09-29 09:59:59, rồi lúc 2026-09-29 10:00:00 | Lúc 09:59:59 thông báo còn; lúc 10:00:00 thông báo không còn hiện; thông báo bị xóa trước 10:05:00 | R-03 |
| AC-13 | john đã tắt push cho like trên điện thoại | maria like john; john đang đăng nhập cả trên máy tính bảng | Không thiết bị nào nhận push; john có 1 thông báo trong app | R-04, P-01 |
| AC-14 | john mở cài đặt thông báo | Tìm cách tắt push cho xác minh, thanh toán và yêu cầu liên hệ | Không có công tắc cho các loại đó; yêu cầu tắt bị từ chối | R-04, P-02 |
| AC-15 | john và maria đều có cài đặt thông báo | john gửi yêu cầu tắt push like trong cài đặt của maria | Bị từ chối; cài đặt của maria không đổi | R-04, P-01 |
| AC-16 | maria nhắn john "Call me tonight" | john nhận push trên màn hình khóa | Push chỉ ghi loại "tin nhắn mới"; không có "maria", không có ảnh và không có "Call me tonight" | R-05 |
| AC-17 | maria nhắn john lúc 10:00:00 (john nhận push), rồi lúc 10:04:59 | Hệ thống xử lý tin thứ hai | Không có push cho tin thứ hai | R-06 |
| AC-18 | Như AC-17 | maria nhắn thêm lúc 10:05:00 | john nhận push cho tin này | R-06 |
| AC-19 | maria nhắn john lúc 10:00:00 (john nhận push) | john trả lời maria lúc 10:02:00 | maria nhận push | R-06 |
| AC-20 | john đang mở cuộc trò chuyện với maria | maria nhắn lúc 10:00:00; john rời cuộc trò chuyện lúc 10:01:00; maria nhắn lúc 10:02:00 | Tin 10:00:00 không có push và thông báo trong app đã đọc; tin 10:02:00 có push | R-01, R-03, R-06 |
| AC-21 | maria nhắn john lúc 03:00 giờ địa phương của john | Hệ thống xử lý | john nhận push ngay | R-07 |
| AC-22 | maria like john lúc 09:00:00 (john có 1 thông báo trong app); john chặn maria lúc 10:00:00 | john mở danh sách thông báo | Không còn thông báo nào về maria | R-08 |
| AC-23 | john đã chặn maria | maria nhắn trong cuộc trò chuyện cũ (bị từ chối theo SPEC-6), và một sự kiện khác về maria phát sinh | john không nhận push, email hay thông báo trong app nào về maria | R-08 |
| AC-24 | john chặn maria rồi bỏ chặn lúc 11:00:00 | maria like john lúc 11:30:00 | john nhận thông báo cho like lúc 11:30:00 | R-08 |
| AC-25 | john nhận push "yêu cầu được chấp nhận" từ maria | Bấm push | Cuộc trò chuyện john–maria mở ra | R-09, F-01 |
| AC-26 | john có thông báo tin nhắn từ maria; sau đó kết nối Ended (có 12 tin) | Bấm thông báo | Cuộc trò chuyện mở ra ở chế độ chỉ đọc với đủ 12 tin | R-09 |
| AC-27 | john nhận thông báo like | Bấm thông báo | Danh sách "Đã thích bạn" mở ra | R-09 |
| AC-28 | john nhận thông báo "gia hạn thất bại" trong app | Bấm thông báo | Trình duyệt mở trang tài khoản trên website | R-09 |
| AC-29 | john đã đăng xuất trên điện thoại | Trên điện thoại đó, anna@example.com mở link trong một email thông báo của john và đăng nhập bằng tài khoản của anna | Hiện "Không thể mở nội dung này" rồi về màn chính | R-09 |
| AC-30 | john đã đăng xuất trên điện thoại | john mở một link thông báo tin nhắn và đăng nhập bằng tài khoản của mình | Cuộc trò chuyện mở ra | R-09 |
| AC-31 | Một link thông báo được mở trên iPhone và trên điện thoại Android, cả hai chưa cài app | Mở link | iPhone mở App Store; Android mở Google Play | R-09 |
| AC-32 | maria có thông báo (1) từ john; john đã rút yêu cầu | maria bấm thông báo | Hiện "Không thể mở nội dung này" rồi về màn chính | R-10, F-01 |
| AC-33 | maria có thông báo (1) từ john; maria đã chấp nhận, rồi một lần khác đã từ chối một yêu cầu từ peter | Bấm từng thông báo | Thông báo của john mở cuộc trò chuyện; thông báo của peter mở yêu cầu với trạng thái đã từ chối | R-10 |
| AC-34 | Bất kỳ push, email hay thông báo trong app nào | Thành viên đọc | Nội dung bằng tiếng Anh, mang đúng ý nghĩa mà SPEC mô tả | R-12 |
| AC-35 | john đăng nhập app trên điện thoại và máy tính bảng, đăng nhập website trên máy tính; đã đăng xuất trên một điện thoại cũ | maria nhắn john | Điện thoại và máy tính bảng nhận push; máy tính và điện thoại cũ không nhận | R-13 |
| AC-36 | john có 2 push trong khay thông báo của điện thoại | john đăng xuất trên điện thoại | Hai push bị xóa khỏi khay | R-13 |
| AC-37 | john hủy gói lúc 2026-11-01 09:00:00, periodEnd 2026-11-10 09:00:00 | Hệ thống kiểm tra lúc 2026-11-07 08:59:59, rồi lúc 2026-11-07 09:00:00, rồi lúc 2026-11-08 09:00:00 | Lúc 08:59:59 không có thông báo; từ 2026-11-07 09:00:00 john có đúng 1 thông báo "gói sắp hết kỳ"; lần kiểm tra sau không tạo thêm | R-14 |
| AC-38 | periodEnd 2026-11-10 09:00:00 | john hủy lúc 2026-11-09 09:00:00 | john nhận ngay 1 thông báo "gói sắp hết kỳ" | R-14 |
| AC-39 | john đã nhận thông báo (8) cho lần hủy thứ nhất | john bật lại tự gia hạn rồi hủy lại lúc còn 48 giờ | john nhận thêm 1 thông báo (8) ngay | R-14 |
| AC-40 | Tài khoản john bị đình chỉ, gói chuyển Cancelling | Tới mốc 72 giờ trước periodEnd | Không có thông báo (8) | R-14, R-01 |
| AC-41 | Subscription của john Ended do hoàn toàn phần; một lần khác Ended do hết kỳ | Hệ thống xử lý | Mỗi lần john nhận 1 push, 1 thông báo trong app và 1 email "gói kết thúc" | R-01, R-02 |
| AC-42 | Tài khoản john bị cấm; gói của john chuyển Ended | Hệ thống xử lý | john không nhận push, thông báo trong app hay email "gói kết thúc" | R-01, R-02 |
| AC-43 | john nhận email kết quả xác minh | Mở link trong email trên máy tính | Website mở trang hướng dẫn mở app | R-15 |
| AC-44 | john nhận email "gói kết thúc" | Mở link trên máy tính, rồi trên điện thoại có app | Trên máy tính: trang tài khoản trên website; trên điện thoại: trang tài khoản trên website theo R-09 | R-15 |
| AC-45 | john có 3 thông báo trong app; maria có 2 | john mở danh sách thông báo | john thấy đúng 3 thông báo của mình, không thấy của maria | P-03 |
| AC-46 | maria có hồ sơ hoàn chỉnh với 2 ảnh | Admin gỡ một ảnh của maria | maria nhận thông báo trong app và email nêu một ảnh đã bị gỡ vì vi phạm quy định, không nêu người báo cáo; maria không nhận push | R-01, R-02, R-05 |
| AC-47 | maria đang bị đình chỉ | Admin gỡ bio của maria lúc 2026-10-20 10:00:00; maria được gỡ đình chỉ lúc 2026-11-01 09:00:00 | Lúc 2026-10-20 10:00:00 maria không nhận thông báo trong app hay email; lúc 2026-11-01 09:00:00 maria nhận thông báo trong app và email nội dung bị gỡ | R-01, R-02 |
| AC-48 | john là người nhận của một thông báo hệ thống có tiêu đề "Scheduled maintenance"; admin chọn push, không chọn email | Hệ thống gửi | john nhận push hiện "Scheduled maintenance" và thông báo trong app có tiêu đề và nội dung; john không nhận email | R-01, R-02, R-05 |
| AC-49 | john đã tắt push cho like và tin nhắn | Một thông báo hệ thống có chọn push được gửi tới john | john nhận push | R-04, R-01 |
| AC-50 | john có thông báo trong app của một thông báo hệ thống | john bấm thông báo | Màn chi tiết thông báo hệ thống mở ra | R-09 |
| AC-51 | maria có thông báo trong app "một ảnh của bạn đã bị gỡ" | maria bấm thông báo | Màn sửa hồ sơ của maria mở ra | R-09 |
| AC-52 | maria nhận email nội dung bị gỡ; john nhận email của một thông báo hệ thống | Mỗi người mở link trong email trên máy tính | Website mở trang hướng dẫn mở app | R-15 |
| AC-53 | 300 người nhận hợp lệ; admin chọn push | Admin xác nhận gửi thông báo hệ thống lúc 10:00:00 | Trước 10:05:00, cả 300 người đã có thông báo trong app và push đã được gửi đi | N-02, R-01 |

## 9. Non-functional

| Code | Quality | Measure | Target | Source |
| --- | --- | --- | --- | --- |
| N-01 | Độ trễ thông báo | Thời gian từ khi sự kiện được ghi (với sự kiện 8 và 9: từ khi Subscription đổi trạng thái; không áp dụng cho sự kiện 11) đến khi hệ thống gửi push đi và tạo thông báo trong app | ≤ 60 giây | SRC-22#L31, SRC-22#L34, SRC-23#L31, SRC-23#L39 |
| N-02 | Độ trễ thông báo hệ thống | Thời gian từ khi admin xác nhận gửi một thông báo hệ thống đến khi mọi người nhận đã có thông báo trong app và push (nếu admin chọn) đã được gửi đi | ≤ 5 phút | SRC-28#L40, SRC-28#L45 |

## 10. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |
| ASM-01 | Khách cung cấp câu chữ tiếng Anh cho mọi push, email, thông báo trong app và các thông báo trên màn hình mà SPEC-1 đến SPEC-7 mô tả bằng tiếng Việt (SRC-22#L30, SRC-23#L37) | Honda hỏi khách, trước khi viết DSN |

## 11. Out of scope

- Email xác nhận và đặt lại mật khẩu: SPEC-1.
- Email kết quả kháng nghị: SPEC-6.
- Soạn và gửi thông báo hệ thống, gỡ nội dung: SPEC-9 (BRIEF-1/C-35, BRIEF-1/C-38).
- Giờ yên lặng: không có trong MVP (SRC-22#L25).
- Web push cho website: không có trong MVP (SRC-23#L33).

## Change log

| Version | Date | By | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-09-30 | Honda | Approved |
| 0.2.0 | 2026-09-30 | Honda | Approved revision of 0.1.0 (minor): sự kiện nội dung bị gỡ và thông báo hệ thống (SPEC-9; SRC-27) |
