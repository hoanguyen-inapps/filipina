---
id: SPEC-3
title: Hồ sơ và khám phá
version: 0.2.0
status: approved
owner: Honda
flow: project
risk: high
review: specs/review/SPEC-3-0.2.0.md
parent: [BRIEF-1@0.1.0]
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:0941509bae18f72e010880e9
---

# SPEC-3: Hồ sơ và khám phá

<!-- Skyline SPEC (project flow): the exact logic. One row, one fact. Bare codes (R-01) are this SPEC; anything else is qualified (BRIEF-1/C-02). Every rule has a Source and at least one AC. Each unknown becomes a CLARIFY marker; never guess. -->

## 1. Scope

Implements BRIEF-1/C-09, BRIEF-1/C-10, BRIEF-1/C-16, BRIEF-1/C-17, BRIEF-1/C-18 và BRIEF-1/C-19, cùng phần audit log của các sự kiện hồ sơ trong BRIEF-1/C-40: Freemium Lobby của nam và nữ, like, hồ sơ hoàn chỉnh, giáo dục văn hóa, duyệt và tìm kiếm hồ sơ, điểm tương thích. Điều kiện xác minh để vào Lobby và mua gói nằm ở SPEC-2; yêu cầu liên hệ và nhắn tin nằm ở SPEC kết nối.

## 2. Glossary

| Code | Term | Definition | Source |
| --- | --- | --- | --- |
| T-01 | Nam Freemium | Nam chưa có gói thành viên còn hiệu lực | SRC-1#L92-L93, SRC-12#L21, SRC-12#L33 |
| T-02 | Nam có gói | Nam có gói thành viên còn hiệu lực (mua theo SPEC thanh toán) | BRIEF-1/C-11, SRC-12#L21, SRC-12#L33 |
| T-03 | Hồ sơ hoàn chỉnh | Hồ sơ có đủ các trường bắt buộc của R-08 | SRC-1#L100, SRC-1#L125, SRC-12#L24, SRC-12#L33 |
| T-04 | Hồ sơ rút gọn | Tên, tuổi, thành phố và chỉ báo xác minh của một thành viên; không có ảnh | SRC-12#L25, SRC-12#L33 |
| T-05 | Freemium Lobby | Danh sách hồ sơ người khác giới mà thành viên xem được mà không dùng tìm kiếm ("duyệt hồ sơ"), gồm cả danh sách "Đã thích bạn" | SRC-1#L92, SRC-1#L128, SRC-3#L31, SRC-3#L55, SRC-14#L30-L31, SRC-14#L37 |
| T-06 | Like | Tín hiệu quan tâm một thành viên gửi tới một thành viên khác giới; không mở nhắn tin | SRC-1#L92, SRC-12#L22, SRC-12#L33 |
| T-07 | Giáo dục văn hóa hoàn tất | Thành viên đã mở mọi bài giáo dục văn hóa đang xuất bản và đã bấm "Tôi đã đọc và đồng ý" | SRC-12#L27, SRC-12#L33 |
| T-08 | Điểm tương thích | Số nguyên từ 0 đến 100, là giá trị SmartMatchApp tính theo chiều từ người xem tới người được xem, làm tròn đến số nguyên gần nhất, hiển thị kèm dấu "%" | SRC-12#L29, SRC-12#L33, SRC-14#L29, SRC-14#L37, BRIEF-1/NG-03 |
| T-09 | Ngày lịch UTC | Khoảng từ 00:00:00 đến 23:59:59 UTC của một ngày | SRC-12#L20, SRC-12#L34 |
| T-10 | Hồ sơ hiển thị với người khác | Hồ sơ hoàn chỉnh, không bật "Ẩn hồ sơ", của thành viên có tài khoản Active, xác minh danh tính Approved, không bị đình chỉ hay cấm; với nữ, thêm điều kiện giáo dục văn hóa hoàn tất | SRC-14#L23, SRC-14#L25, SRC-14#L37 |
| T-11 | Lượt xem | Một thẻ hồ sơ nữ hiện trong Lobby của nam Freemium; hồ sơ mở từ "Đã thích bạn" không phải lượt xem | SRC-12#L20, SRC-14#L21, SRC-14#L37 |

## 3. Data

| Code | Field | Type | Required | Constraint | Source |
| --- | --- | --- | --- | --- | --- |
| DF-01 | Profile.bio | text, ≤ 1000 ký tự đếm theo ký tự Unicode sau chuẩn hóa NFC | theo R-08 | R-08, R-10 | SRC-12#L24, SRC-14#L26, SRC-14#L37 |
| DF-02 | Profile.goal | một giá trị từ danh sách mục tiêu quan hệ | theo R-08 | R-08, R-10 | SRC-12#L24 |
| DF-03 | Profile.interests | 0–10 giá trị từ danh sách sở thích | theo R-08 | R-08, R-10 | SRC-12#L24 |
| DF-04 | Profile.photos | 1–3 ảnh; có thể còn 0 ảnh sau khi admin gỡ (R-21) | theo R-08 | R-08, R-10, R-18, R-21 | SRC-12#L24, SRC-27#L30 |
| DF-05 | Profile.completedAt | thời điểm UTC | khi hồ sơ hoàn chỉnh | R-08 | SRC-12#L24 |
| DF-06 | LobbyDailyViews | các hồ sơ nữ khác nhau đã hiện cho một nam Freemium trong một ngày lịch UTC | yes, với nam Freemium | tối đa 20 (R-01) | SRC-12#L20, SRC-12#L34 |
| DF-07 | Like | người like, người được like, thời điểm UTC | yes | mỗi cặp (người like, người được like) tối đa 1 (R-05) | SRC-12#L22-L23 |
| DF-08 | CulturalEducation.openedLessons | các bài mà thành viên đã mở; chỉ các bài đang xuất bản được tính ở R-11 | yes | R-11, R-22 | SRC-12#L27, SRC-28#L22 |
| DF-09 | CulturalEducation.agreedAt | thời điểm UTC bấm "Tôi đã đọc và đồng ý" | khi hoàn tất | R-11 | SRC-12#L27 |
| DF-10 | SearchFilter | ageFrom, ageTo (số nguyên ≥ 0, được nhập một hoặc cả hai), city | không bắt buộc | R-14 | SRC-12#L28, SRC-14#L27 |
| DF-11 | Profile.hidden | boolean | yes, mặc định false | R-19 | SRC-14#L25 |

## 4. States

| Code | Machine | State | Kind |
| --- | --- | --- | --- |

| Code | From | Event | Guard | To | Rules |
| --- | --- | --- | --- | --- | --- |

## 5. Rules

| Code | Rule | Source |
| --- | --- | --- |
| R-01 | Với nam Freemium, Lobby hiện tối đa 20 lượt xem (T-11) trong một ngày lịch UTC; một hồ sơ đã hiện trong ngày thì hiện lại hay mở lại không tính thêm; hồ sơ mở từ "Đã thích bạn" không tính lượt và luôn mở được; lượt xem trong lúc là nam có gói không tính, và khi gói hết hạn giữa ngày thì đếm từ 0 cho phần còn lại của ngày; khi đã đủ 20, Lobby không hiện hồ sơ mới trong ngày đó và hiện "Bạn đã hết lượt xem hôm nay"; giới hạn 20 là tuyệt đối, kể cả khi nhiều thiết bị mở cùng lúc; lượt đếm về 0 lúc 00:00:00 UTC | SRC-1#L92, SRC-3#L31, SRC-12#L20, SRC-12#L34, SRC-14#L21-L22, SRC-14#L37, BRIEF-1/C-09 |
| R-02 | Nam có gói không bị giới hạn số hồ sơ nữ xem trong Lobby (duyệt hồ sơ không giới hạn), kể cả khi chưa có hồ sơ hoàn chỉnh hay chưa hoàn tất giáo dục văn hóa | SRC-12#L21, SRC-12#L33, SRC-14#L30, SRC-14#L37 |
| R-03 | Nữ vào Freemium Lobby (gồm danh sách "Đã thích bạn") và xem hồ sơ nam không giới hạn số lượng khi có hồ sơ hoàn chỉnh và giáo dục văn hóa hoàn tất (bảng quyết định R-03), ngoài điều kiện xác minh của SPEC-2; thiếu điều kiện thì từ chối và hiện bước còn thiếu | SRC-1#L125-L128, SRC-3#L53-L55, SRC-5#L20-L21, SRC-14#L20, SRC-14#L31, SRC-14#L37, BRIEF-1/C-10 |
| R-04 | Nam chỉ thấy hồ sơ nữ, nữ chỉ thấy hồ sơ nam; một thành viên chỉ hiện trong Lobby và trong kết quả tìm kiếm của người khác khi hồ sơ hiển thị với người khác (T-10) | SRC-12#L26, SRC-12#L33, SRC-14#L23, SRC-14#L37 |
| R-05 | Thành viên like được một hồ sơ người khác giới mà mình đang xem được hồ sơ hoàn chỉnh, hoặc (với nữ) một nam có trong danh sách "Đã thích bạn" của mình; không giới hạn số like; like lại người đã like thì không tạo like mới; bỏ like thì like bị xóa; người được like thấy người đã like mình trong danh sách "Đã thích bạn" | SRC-1#L92, SRC-12#L22-L23, SRC-12#L33, SRC-14#L19, SRC-14#L37, BRIEF-1/C-09, BRIEF-1/C-10 |
| R-06 | Like không mở nhắn tin và không tạo yêu cầu liên hệ | SRC-12#L22, SRC-12#L33 |
| R-07 | Khi một nam chưa có hồ sơ hoàn chỉnh like một nữ, nữ thấy hồ sơ rút gọn của nam trong danh sách "Đã thích bạn"; nữ không mở được hồ sơ hoàn chỉnh của nam đó nhưng like lại được; khi nữ like lại, nam thấy nữ trong danh sách "Đã thích bạn" của mình | SRC-1#L92, SRC-12#L25, SRC-12#L33, SRC-14#L19, SRC-14#L37 |
| R-08 | Hồ sơ hoàn chỉnh gồm name, tuổi và city lấy từ đăng ký (SPEC-1), bio ≤ 1000 ký tự, một goal từ danh sách mục tiêu quan hệ, tối đa 10 interests từ danh sách sở thích, và 1–3 ảnh; hồ sơ hoàn chỉnh khi bio không rỗng (không chỉ gồm ký tự trắng), có goal và có ít nhất 1 ảnh; interests được để trống; thiếu thì không lưu thành hồ sơ hoàn chỉnh và báo trường còn thiếu | SRC-13#L19, SRC-13#L26, SRC-1#L100, SRC-1#L125, SRC-1#L222-L223, SRC-12#L24, SRC-12#L33, BRIEF-1/C-16 |
| R-09 | Nam chỉ mở bước hoàn thiện hồ sơ khi là nam có gói; nữ mở bước này theo SPEC-2 (xác minh danh tính Approved) | SRC-1#L99-L100, SRC-3#L35-L36, SRC-10#L49, SRC-10#L54 |
| R-10 | Sau khi hoàn thiện, thành viên sửa được bio, goal, interests và ảnh theo giới hạn của R-08; sửa làm trống bio, bỏ goal, hay làm số ảnh ít hơn 1 hoặc nhiều hơn 3 (xóa ảnh cuối cùng, thêm ảnh thứ 4) thì từ chối lưu; completedAt giữ nguyên khi sửa, kể cả khi hồ sơ hoàn chỉnh lại sau khi admin gỡ (R-21); name, tuổi và city sửa theo SPEC-1; khi hồ sơ đang thiếu ảnh hoặc bio do admin gỡ (R-21), thành viên lưu được mọi thay đổi không làm hồ sơ thiếu thêm trường nào so với lúc đó | SRC-12#L31, SRC-12#L33, SRC-14#L24, SRC-14#L37, SRC-27#L30, SRC-27#L43, SRC-28#L21, SRC-28#L45 |
| R-11 | Chỉ thành viên có hồ sơ hoàn chỉnh mới mở được màn giáo dục văn hóa; màn này hiện danh sách các bài đang xuất bản do admin quản lý; nút "Tôi đã đọc và đồng ý" chỉ bấm được khi có ít nhất một bài đang xuất bản và thành viên đã mở mọi bài đang xuất bản tại lúc bấm; bấm nút thì giáo dục văn hóa hoàn tất; bài mới xuất bản sau đó không làm mất trạng thái hoàn tất | SRC-13#L20, SRC-13#L26, SRC-1#L100-L102, SRC-1#L125-L127, SRC-12#L27, SRC-12#L33, SRC-14#L32, SRC-14#L35, SRC-14#L37, BRIEF-1/C-17, BRIEF-1/C-37 |
| R-12 | Giáo dục văn hóa hoàn tất là điều kiện để gửi hoặc nhận yêu cầu liên hệ (SPEC kết nối kiểm), để nữ vào Lobby (R-03), để nữ hiện với nam (T-10) và để nam tìm kiếm, lọc (R-13) | SRC-1#L102-L105, SRC-1#L127-L130, SRC-12#L27, SRC-12#L33, SRC-14#L20, SRC-14#L23, SRC-14#L37 |
| R-13 | Nam tìm kiếm và lọc hồ sơ nữ khi là nam có gói, có hồ sơ hoàn chỉnh và giáo dục văn hóa hoàn tất (bảng quyết định R-13); thiếu điều kiện thì từ chối và hiện bước còn thiếu | SRC-1#L99-L103, SRC-3#L35-L38, SRC-12#L21, SRC-12#L33, SRC-14#L20, SRC-14#L30, SRC-14#L37, BRIEF-1/C-18 |
| R-14 | Bộ lọc tìm kiếm gồm dải tuổi và thành phố/tỉnh: tuổi tính theo ngày lịch UTC như SPEC-1; được nhập chỉ ageFrom, chỉ ageTo hoặc cả hai, không có giới hạn trên; nhập cả hai mà ageFrom > ageTo thì từ chối; thành phố khớp khi city của hồ sơ chứa chuỗi nhập, không phân biệt kiểu chữ và dấu; kết quả mặc định sắp theo điểm tương thích giảm dần; bằng điểm thì hồ sơ có completedAt gần nhất đứng trước; hồ sơ chưa có điểm xếp sau mọi hồ sơ có điểm và cũng sắp theo completedAt gần nhất trước; nếu completedAt cũng bằng nhau thì theo mã thành viên tăng dần | SRC-13#L21-L22, SRC-13#L26, SRC-12#L28, SRC-12#L33, SRC-14#L27-L28, SRC-14#L37, BRIEF-1/C-18 |
| R-15 | Nam có gói thấy điểm tương thích (T-08) trên hồ sơ nữ; nữ thấy điểm tương thích trên hồ sơ nam; nam Freemium không thấy điểm; mỗi người thấy điểm theo chiều từ mình tới người kia; điểm do SmartMatchApp tính; Lobby của nam và của nữ sắp theo cùng thứ tự như kết quả tìm kiếm ở R-14 | SRC-13#L23, SRC-13#L26, SRC-12#L21, SRC-12#L29, SRC-12#L33, SRC-14#L29, SRC-14#L37, BRIEF-1/C-19, BRIEF-1/NG-03 |
| R-16 | Ảnh hồ sơ hiện ngay khi tải lên, không cần admin duyệt | SRC-12#L30, SRC-12#L33 |
| R-17 | Hệ thống ghi đúng một bản ghi audit log cho mỗi thao tác: hoàn thiện hồ sơ (kể cả các ảnh tải lên cùng lúc), mỗi lần sửa hồ sơ, mỗi lần thêm hoặc xóa ảnh, mỗi lần bật hoặc tắt "Ẩn hồ sơ"; mỗi bản ghi có thành viên, thời điểm UTC, giá trị cũ và giá trị mới | SRC-1#L182, SRC-14#L34, SRC-14#L37, BRIEF-1/C-40 |
| R-18 | Ảnh hồ sơ là tệp JPG, PNG hoặc HEIC, mỗi ảnh ≤ 10 MB (10 MB = 10 × 1024 × 1024 = 10.485.760 byte); sai thì từ chối ảnh đó | SRC-12#L24, SRC-13#L24, SRC-13#L26 |
| R-19 | Thành viên có hồ sơ hoàn chỉnh bật hoặc tắt được "Ẩn hồ sơ"; khi bật, hồ sơ không hiện trong Lobby và kết quả tìm kiếm của người khác; người đã like thành viên đó trước khi bật vẫn thấy hồ sơ | SRC-1#L222-L223, SRC-14#L25, SRC-14#L37, BRIEF-1/C-16 |
| R-20 | Khi gói của nam hết hạn, nam trở lại là nam Freemium: hồ sơ hoàn chỉnh vẫn hiện với nữ theo T-10 và vẫn sửa được; giới hạn R-01 áp dụng lại; tìm kiếm, lọc và điểm tương thích không còn dùng được | SRC-14#L33, SRC-14#L37 |
| R-21 | Khi admin gỡ một ảnh hoặc phần giới thiệu của thành viên (SPEC-9), nội dung đó không còn hiện với ai; nếu sau khi gỡ hồ sơ không còn ảnh nào hoặc bio trống thì hồ sơ không còn hoàn chỉnh theo R-08 cho tới khi thành viên bổ sung đủ, với mọi hậu quả của hồ sơ chưa hoàn chỉnh: hồ sơ không còn hiện với người khác (T-10) và người đó không hiện trong "Đã thích bạn" của người khác, kể cả dạng hồ sơ rút gọn (R-07); nữ không vào được Lobby (R-03); nam không tìm kiếm, lọc được (R-13); thành viên không gửi hay nhận được yêu cầu liên hệ mới (SPEC-4/R-01, SPEC-4/R-02) và yêu cầu Pending của người đó chuyển Expired (SPEC-4 bản sửa đổi); kết nối Open vẫn giữ | SRC-12#L30, SRC-27#L30, SRC-27#L43, SRC-28#L19-L20, SRC-28#L45 |
| R-22 | Bài đang xuất bản là bài ở trạng thái Published do admin quản lý (SPEC-9); admin sửa một bài không làm mất việc thành viên đã mở bài đó; bài bị gỡ không còn tính vào điều kiện mở mọi bài đang xuất bản của R-11; giáo dục văn hóa đã hoàn tất vẫn hoàn tất khi bài bị sửa hay bị gỡ; bài bị gỡ rồi xuất bản lại thì lần thành viên đã mở trước đó vẫn được tính | SRC-12#L27, SRC-27#L35-L36, SRC-27#L43, SRC-28#L22, SRC-28#L45 |

<!-- decision: R-03 -->
| C: Hồ sơ hoàn chỉnh | C: Giáo dục văn hóa hoàn tất | A: Nữ vào Lobby |
| --- | --- | --- |
| Y | Y | cho vào |
| Y | N | từ chối |
| N | - | từ chối |

<!-- decision: R-13 -->
| C: Nam có gói | C: Hồ sơ hoàn chỉnh | C: Giáo dục văn hóa hoàn tất | A: Duyệt và tìm kiếm |
| --- | --- | --- | --- |
| Y | Y | Y | cho dùng |
| Y | Y | N | từ chối |
| Y | N | - | từ chối |
| N | - | - | từ chối |

## 6. Permissions

<!-- Columns after Action are actors: BRIEF-n/A-nn. Cells: Y, N, or a rule code (R-nn) meaning "allowed when that rule holds". -->

| Code | Action | BRIEF-1/A-01 Nam Mỹ | BRIEF-1/A-02 Nữ Philippines |
| --- | --- | --- | --- |
| P-01 | Vào Freemium Lobby | Y | R-03 |
| P-02 | Xem hồ sơ hoàn chỉnh của người khác giới | R-01 | R-03 |
| P-03 | Xem hồ sơ người cùng giới | N | N |
| P-04 | Like và bỏ like | R-05 | R-05 |
| P-05 | Hoàn thiện hồ sơ | R-09 | R-09 |
| P-06 | Sửa hồ sơ | R-10 | R-10 |
| P-07 | Tìm kiếm và lọc hồ sơ | R-13 | N |
| P-08 | Xem điểm tương thích | R-15 | R-15 |
| P-09 | Hoàn tất giáo dục văn hóa | R-11 | R-11 |
| P-10 | Bật hoặc tắt "Ẩn hồ sơ" | R-19 | R-19 |

## 7. Flows

### F-01 Nam Freemium dùng Lobby

1. Nam vào Freemium Lobby (điều kiện xác minh ở SPEC-2) và thấy hồ sơ nữ đã có hồ sơ hoàn chỉnh (R-04).
2. Mỗi hồ sơ nữ mới hiện ra tính một lượt, tối đa 20 lượt trong ngày lịch UTC (R-01).
3. Nam mở hồ sơ và like (R-05); nữ thấy hồ sơ rút gọn của nam trong "Đã thích bạn" (R-07).

Nhánh lỗi:

- 2a. Đủ 20 lượt → không hiện hồ sơ mới, hiện "Bạn đã hết lượt xem hôm nay" (R-01).

### F-02 Nam có gói

1. Nam có gói mở bước hoàn thiện hồ sơ và điền theo R-08 (R-09, R-08, R-17).
2. Nam mở hết các bài giáo dục văn hóa và bấm "Tôi đã đọc và đồng ý" (R-11).
3. Nam duyệt, tìm kiếm, lọc hồ sơ nữ và thấy điểm tương thích (R-13, R-14, R-15, R-02).

Nhánh lỗi:

- 1a. Nam Freemium mở bước hoàn thiện hồ sơ → từ chối (R-09).
- 2a. Chưa mở hết bài → nút "Tôi đã đọc và đồng ý" không bấm được (R-11).
- 3a. Thiếu gói, hồ sơ hoặc giáo dục văn hóa → từ chối, hiện bước còn thiếu (R-13).

### F-03 Nữ Philippines

1. Nữ có xác minh Approved hoàn thiện hồ sơ theo R-08 (R-09, R-08, R-17).
2. Nữ hoàn tất giáo dục văn hóa (R-11).
3. Nữ vào Freemium Lobby, xem hồ sơ nam không giới hạn, like, và xem danh sách "Đã thích bạn" (R-03, R-04, R-05, R-07).

Nhánh lỗi:

- 3a. Thiếu hồ sơ hoàn chỉnh hoặc giáo dục văn hóa → từ chối vào Lobby, hiện bước còn thiếu (R-03).

## 8. Acceptance criteria

Mọi thời điểm trong mục này là UTC.

| Code | Given | When | Then | Covers |
| --- | --- | --- | --- | --- |
| AC-01 | Nam Freemium john@example.com, 2026-10-10, Lobby đã hiện 19 hồ sơ nữ khác nhau | Lobby hiện hồ sơ nữ thứ 20 | Hồ sơ thứ 20 hiện ra | R-01, F-01 |
| AC-02 | Như AC-01, Lobby đã hiện 20 hồ sơ nữ khác nhau | Kéo Lobby để xem thêm, rồi mở thẳng hồ sơ một nữ chưa hiện hôm nay | Không có hồ sơ mới; hiện "Bạn đã hết lượt xem hôm nay"; mở hồ sơ bị từ chối | R-01, P-02 |
| AC-03 | Nam Freemium john@example.com đã xem 20 hồ sơ ngày 2026-10-10, gồm hồ sơ của maria@example.com | Mở lại hồ sơ maria lúc 2026-10-10 22:00:00 | Hồ sơ maria mở ra; số lượt vẫn là 20 | R-01 |
| AC-04 | Như AC-03 | Mở Lobby lúc 2026-10-11 00:00:00 | Lobby hiện hồ sơ mới; số lượt của ngày 2026-10-11 là 1 sau hồ sơ đầu tiên | R-01 |
| AC-05 | Nam có gói john@example.com đã xem 50 hồ sơ nữ ngày 2026-10-10 | Kéo Lobby để xem thêm | Lobby tiếp tục hiện hồ sơ mới | R-02 |
| AC-06 | Nữ maria@example.com có hồ sơ hoàn chỉnh và giáo dục văn hóa hoàn tất | Mở Freemium Lobby và xem 60 hồ sơ nam | Lobby mở ra và hiện đủ 60 hồ sơ, không có giới hạn | R-03, P-01, F-03 |
| AC-07 | Nữ maria@example.com có hồ sơ hoàn chỉnh, chưa hoàn tất giáo dục văn hóa | Mở Freemium Lobby | Bị từ chối; màn giáo dục văn hóa được đưa ra | R-03, P-01 |
| AC-08 | Nữ maria@example.com chưa có hồ sơ hoàn chỉnh | Mở Freemium Lobby | Bị từ chối; màn hoàn thiện hồ sơ được đưa ra | R-03 |
| AC-09 | Có nữ anna@example.com (hồ sơ hoàn chỉnh), nữ lisa@example.com (chưa có hồ sơ hoàn chỉnh) và nam peter@example.com (hồ sơ hoàn chỉnh) | Nam john@example.com mở Lobby, rồi mở thẳng hồ sơ peter | Thấy anna; không thấy lisa; không thấy peter; mở hồ sơ peter bị từ chối | R-04, P-03 |
| AC-10 | Có nam peter@example.com (hồ sơ hoàn chỉnh) và nam tom@example.com (chưa có hồ sơ hoàn chỉnh) | Nữ maria@example.com mở Lobby | Thấy peter; không thấy tom; không thấy nữ nào | R-04, P-03 |
| AC-11 | Nam có gói john@example.com đang xem hồ sơ hoàn chỉnh của maria@example.com | Bấm like | Like được tạo; maria thấy john trong "Đã thích bạn" | R-05, P-04, F-01 |
| AC-12 | john@example.com đã like maria@example.com | Bấm like maria lần nữa | Không có like mới; vẫn đúng 1 like | R-05 |
| AC-13 | john@example.com đã like maria@example.com | Bỏ like | Like bị xóa; john không còn trong "Đã thích bạn" của maria | R-05, P-04 |
| AC-14 | Nam Freemium john@example.com đã hết 20 lượt ngày 2026-10-10, chưa từng xem hồ sơ anna@example.com | Gửi like tới anna | Bị từ chối; không có like nào được tạo | R-05, R-01, P-04 |
| AC-15 | john@example.com đã like 200 hồ sơ nữ | Like hồ sơ thứ 201 đang xem được | Like được tạo | R-05 |
| AC-16 | john@example.com đã like maria@example.com | Mở cuộc trò chuyện hoặc yêu cầu liên hệ từ like đó | Không có cuộc trò chuyện hay yêu cầu liên hệ nào được tạo từ like | R-06 |
| AC-17 | Nam Freemium john@example.com (tên John, 34 tuổi, Austin, chỉ báo "Identity Verified", chưa có hồ sơ hoàn chỉnh) like maria@example.com | maria mở "Đã thích bạn" | Thấy John, 34, Austin và chỉ báo "Identity Verified"; không có ảnh | R-07, F-01 |
| AC-18 | Như AC-17 | maria mở hồ sơ hoàn chỉnh của john | Bị từ chối | R-07 |
| AC-19 | Nữ maria@example.com xác minh Approved, bio "Mình thích nấu ăn", goal từ danh sách, 2 sở thích, 1 ảnh | Lưu hồ sơ | Hồ sơ hoàn chỉnh; completedAt được ghi | R-08, P-05, F-03 |
| AC-20 | Nữ maria@example.com điền bio 1001 ký tự | Lưu hồ sơ | Bị từ chối vì bio quá 1000 ký tự | R-08 |
| AC-21 | Nữ maria@example.com chọn 11 sở thích | Lưu hồ sơ | Bị từ chối vì quá 10 sở thích | R-08 |
| AC-22 | Nữ maria@example.com điền bio 1000 ký tự, chọn goal, 10 sở thích và 1 ảnh | Lưu hồ sơ | Hồ sơ hoàn chỉnh | R-08 |
| AC-23 | Nam Freemium john@example.com | Mở bước hoàn thiện hồ sơ | Bị từ chối | R-09, P-05 |
| AC-24 | Nam có gói john@example.com | Mở bước hoàn thiện hồ sơ | Bước hoàn thiện hồ sơ mở ra | R-09, F-02 |
| AC-25 | maria@example.com có hồ sơ hoàn chỉnh với 1 ảnh | Xóa ảnh duy nhất | Bị từ chối; hồ sơ vẫn có 1 ảnh | R-10, P-06 |
| AC-26 | maria@example.com có hồ sơ hoàn chỉnh với 3 ảnh | Thêm ảnh thứ 4 | Bị từ chối; hồ sơ vẫn có 3 ảnh | R-10 |
| AC-27 | maria@example.com có bio "Mình thích nấu ăn" | Đổi bio thành "Mình thích đi biển" | Bio được lưu là "Mình thích đi biển" | R-10, P-06 |
| AC-28 | Có 4 bài giáo dục văn hóa đang xuất bản; john@example.com đã mở 3 bài | Bấm "Tôi đã đọc và đồng ý" | Bị từ chối; nút không bấm được | R-11 |
| AC-29 | Có 4 bài đang xuất bản; john@example.com đã mở cả 4 bài | Bấm "Tôi đã đọc và đồng ý" lúc 2026-10-10 09:00:00 | Giáo dục văn hóa hoàn tất; agreedAt = 2026-10-10 09:00:00 | R-11, P-09, F-02 |
| AC-30 | john@example.com đã hoàn tất giáo dục văn hóa với 4 bài | Admin xuất bản bài thứ 5, rồi john mở tìm kiếm | Giáo dục văn hóa của john vẫn hoàn tất; tìm kiếm mở ra | R-11 |
| AC-31 | Nam có gói john@example.com có hồ sơ hoàn chỉnh, chưa hoàn tất giáo dục văn hóa | Mở tìm kiếm | Bị từ chối; màn giáo dục văn hóa được đưa ra | R-12, R-13 |
| AC-32 | Nam có gói john@example.com có hồ sơ hoàn chỉnh và giáo dục văn hóa hoàn tất | Mở tìm kiếm | Tìm kiếm mở ra | R-13, P-07, F-02 |
| AC-33 | Nam có gói john@example.com chưa có hồ sơ hoàn chỉnh | Mở tìm kiếm | Bị từ chối; màn hoàn thiện hồ sơ được đưa ra | R-13 |
| AC-34 | Nam Freemium john@example.com | Mở tìm kiếm | Bị từ chối | R-13, P-07 |
| AC-35 | Nữ maria@example.com | Mở tìm kiếm hồ sơ | Bị từ chối; nữ không có chức năng tìm kiếm | P-07 |
| AC-36 | Có nữ 22, 25, 30 và 31 tuổi, đều có hồ sơ hoàn chỉnh | john tìm với ageFrom 25, ageTo 30 | Kết quả có nữ 25 và 30 tuổi; không có nữ 22 và 31 tuổi | R-14 |
| AC-37 | Có nữ 22 và 35 tuổi | john tìm với ageFrom 30, ageTo 25; rồi chỉ với ageFrom 30; rồi chỉ với ageTo 25 | Lần 1 bị từ chối vì dải tuổi không hợp lệ; lần 2 chỉ có nữ 35 tuổi; lần 3 chỉ có nữ 22 tuổi | R-14 |
| AC-38 | Có nữ ở "Cebu City" và nữ ở "Manila" | john lọc thành phố "cebu" | Kết quả có nữ ở "Cebu City"; không có nữ ở "Manila" | R-14 |
| AC-39 | Có nữ anna (điểm 91), lisa (điểm 78), mia (điểm 85) | john tìm không lọc | Thứ tự kết quả là anna, mia, lisa | R-14 |
| AC-40 | Nam có gói john@example.com, SmartMatchApp trả điểm 87 cho cặp john–maria | john mở hồ sơ maria | Hồ sơ hiện "87%" | R-15, P-08, F-02 |
| AC-41 | Nam Freemium john@example.com, SmartMatchApp có điểm 87 cho cặp john–maria | john mở hồ sơ maria, rồi yêu cầu xem điểm tương thích | Không hiện điểm tương thích; yêu cầu bị từ chối | R-15, P-08 |
| AC-42 | SmartMatchApp có điểm 87 cho cặp john–maria | maria mở hồ sơ john | Hồ sơ hiện "87%" | R-15, P-08 |
| AC-43 | maria@example.com có hồ sơ hoàn chỉnh | Tải lên ảnh thứ 2 lúc 10:00:00 | Ảnh hiện trên hồ sơ ngay lúc 10:00:00, không có bước chờ duyệt | R-16 |
| AC-44 | maria@example.com hoàn thiện hồ sơ với 2 ảnh lúc 08:00:00, sửa bio từ "A" thành "B" lúc 09:00:00, xóa 1 ảnh lúc 10:00:00 | Admin cấp cao nhất xem audit log | Có đúng 3 bản ghi của maria lúc 08:00:00, 09:00:00 và 10:00:00; bản ghi 09:00:00 có giá trị cũ "A" và giá trị mới "B" | R-17 |
| AC-45 | maria@example.com có hồ sơ hoàn chỉnh | Tải lên ảnh GIF 1 MB | Bị từ chối vì định dạng GIF không được nhận | R-18 |
| AC-46 | Nữ maria@example.com điền bio "   ", goal từ danh sách, 1 ảnh | Lưu hồ sơ | Không thành hồ sơ hoàn chỉnh; báo thiếu bio | R-08 |
| AC-47 | Nữ maria@example.com điền bio "Mình thích nấu ăn", không chọn goal, 1 ảnh | Lưu hồ sơ | Không thành hồ sơ hoàn chỉnh; báo thiếu goal | R-08 |
| AC-48 | Nữ maria@example.com điền bio và goal, không có ảnh | Lưu hồ sơ | Không thành hồ sơ hoàn chỉnh; báo thiếu ảnh | R-08 |
| AC-49 | Nữ maria@example.com điền bio và goal, 1 ảnh, 0 sở thích | Lưu hồ sơ | Hồ sơ hoàn chỉnh | R-08 |
| AC-50 | Có nữ anna (điểm 80, completedAt 2026-10-01), lisa (điểm 80, completedAt 2026-10-05), mia (chưa có điểm) | john tìm không lọc | Thứ tự kết quả là lisa, anna, mia | R-14 |
| AC-51 | Có nam peter (điểm 70 với maria) và tom (điểm 90 với maria), đều có hồ sơ hoàn chỉnh | Nữ maria@example.com mở Lobby | Thứ tự trong Lobby là tom, peter | R-15 |
| AC-52 | maria@example.com có hồ sơ hoàn chỉnh | Tải lên ảnh JPG đúng 10.485.760 byte, rồi ảnh JPG 10.485.761 byte | Ảnh thứ nhất được nhận; ảnh thứ hai bị từ chối vì quá 10 MB | R-18 |
| AC-53 | Như AC-17 | maria like lại john từ "Đã thích bạn" | Like được tạo; john thấy maria trong "Đã thích bạn" của mình | R-07, R-05 |
| AC-54 | Nam Freemium john@example.com đã hết 20 lượt ngày 2026-10-10; anna@example.com vừa like john | john mở hồ sơ anna từ "Đã thích bạn" | Hồ sơ anna mở ra; số lượt vẫn là 20 | R-01 |
| AC-55 | Nam có gói john@example.com đã xem 50 hồ sơ ngày 2026-10-10; gói hết hạn lúc 15:00:00 | Lobby hiện hồ sơ từ 15:00:00 | Hiện thêm được đúng 20 hồ sơ mới trong phần còn lại của ngày | R-01, R-20 |
| AC-56 | Nam Freemium john@example.com đã có 19 lượt ngày 2026-10-10 | Hai thiết bị cùng tải một hồ sơ mới trong cùng một giây | Chỉ 1 hồ sơ mới hiện ra; số lượt là 20 | R-01 |
| AC-57 | Nữ anna@example.com có hồ sơ hoàn chỉnh nhưng tài khoản bị đình chỉ; nữ lisa@example.com có hồ sơ hoàn chỉnh nhưng chưa hoàn tất giáo dục văn hóa | Nam có gói john@example.com mở Lobby và tìm kiếm | Không thấy anna và lisa ở cả hai nơi | R-04, R-12 |
| AC-58 | maria@example.com có hồ sơ hoàn chỉnh, completedAt 2026-10-01 08:00:00, bio "Mình thích nấu ăn" | Đổi bio thành "   " | Bị từ chối lưu; bio vẫn "Mình thích nấu ăn"; completedAt không đổi | R-10 |
| AC-59 | maria@example.com có hồ sơ hoàn chỉnh; john@example.com đã like maria | maria bật "Ẩn hồ sơ"; nam peter@example.com mở Lobby và tìm kiếm; john mở "Đã thích bạn" | peter không thấy maria; john vẫn thấy và mở được hồ sơ maria | R-19, P-10 |
| AC-60 | maria@example.com chưa có hồ sơ hoàn chỉnh | Bật "Ẩn hồ sơ" | Bị từ chối | R-19, P-10 |
| AC-61 | Nữ maria@example.com điền bio 1000 ký tự tiếng Việt nhập ở dạng tách dấu (hơn 1000 code point, đúng 1000 ký tự sau NFC), goal, 1 ảnh | Lưu hồ sơ | Hồ sơ hoàn chỉnh | R-08 |
| AC-62 | Có nữ mia và zoe, đều chưa có điểm, completedAt bằng nhau, mã thành viên của mia nhỏ hơn của zoe | john tìm không lọc | mia đứng trước zoe | R-14 |
| AC-63 | SmartMatchApp trả 87.5 cho chiều john→maria và 72.4 cho chiều maria→john | john mở hồ sơ maria; maria mở hồ sơ john | john thấy "88%"; maria thấy "72%" | R-15 |
| AC-64 | Nữ maria@example.com có hồ sơ hoàn chỉnh, chưa hoàn tất giáo dục văn hóa; peter@example.com đã like maria | maria mở "Đã thích bạn" và bấm like peter | Bị từ chối; màn giáo dục văn hóa được đưa ra | R-03, P-04 |
| AC-65 | Không có bài giáo dục văn hóa nào đang xuất bản; john@example.com có hồ sơ hoàn chỉnh | Bấm "Tôi đã đọc và đồng ý" | Bị từ chối; nút không bấm được | R-11 |
| AC-66 | Có 3 bài đang xuất bản; john@example.com đã mở cả 3; admin xuất bản bài thứ 4 | john bấm "Tôi đã đọc và đồng ý" | Bị từ chối; john phải mở bài thứ 4 trước | R-11 |
| AC-67 | Nam có gói john@example.com có hồ sơ hoàn chỉnh; gói hết hạn ngày 2026-11-01 | Ngày 2026-11-02: maria mở Lobby; john sửa bio; john mở tìm kiếm; john mở hồ sơ maria | maria thấy john; bio được lưu; tìm kiếm bị từ chối; hồ sơ maria không hiện điểm tương thích | R-20 |
| AC-68 | Nam Freemium john@example.com chưa có hồ sơ hoàn chỉnh | Mở màn giáo dục văn hóa | Bị từ chối | R-11, P-09 |
| AC-69 | Nữ maria@example.com có hồ sơ hoàn chỉnh với 1 ảnh; john và maria có kết nối Open; yêu cầu của mark tới maria đang Pending | Admin gỡ ảnh duy nhất của maria, rồi nam có gói peter@example.com mở Lobby và gửi yêu cầu tới maria | maria không có trong Lobby của peter; yêu cầu của peter bị từ chối; yêu cầu của mark chuyển Expired; kết nối john–maria vẫn Open | R-21 |
| AC-70 | Như AC-69, sau khi ảnh bị gỡ | maria sửa bio thành "Mình thích đi biển" mà không thêm ảnh, rồi thêm 1 ảnh JPG | Lần đầu được lưu và hồ sơ vẫn chưa hoàn chỉnh; lần sau hồ sơ hoàn chỉnh và maria hiện lại trong Lobby | R-10, R-21 |
| AC-71 | Nam có gói john@example.com có hồ sơ hoàn chỉnh và giáo dục văn hóa hoàn tất | Admin gỡ bio của john, rồi john gửi yêu cầu tới maria | Yêu cầu bị từ chối và hiện bước còn thiếu là bio | R-21 |
| AC-72 | Có 3 bài đang xuất bản; john@example.com đã mở cả 3 | Admin sửa bài thứ 2, rồi john bấm "Tôi đã đọc và đồng ý" | Giáo dục văn hóa của john hoàn tất | R-22 |
| AC-73 | john@example.com đã hoàn tất giáo dục văn hóa với 3 bài | Admin gỡ một bài, rồi sửa một bài khác, rồi john mở tìm kiếm | Giáo dục văn hóa của john vẫn hoàn tất; tìm kiếm mở ra | R-22 |
| AC-74 | Có 3 bài đang xuất bản A, B, C; john@example.com đã mở A và B | Admin gỡ C, rồi john bấm "Tôi đã đọc và đồng ý" | Giáo dục văn hóa của john hoàn tất | R-22, R-11 |
| AC-75 | Nữ maria@example.com có hồ sơ hoàn chỉnh với 1 ảnh và đã like john@example.com | Admin gỡ ảnh của maria; john mở "Đã thích bạn"; maria mở Freemium Lobby | john không thấy maria; maria bị từ chối vào Lobby và thấy bước còn thiếu là ảnh | R-21, R-03 |
| AC-76 | maria@example.com hoàn thiện hồ sơ với completedAt 2026-10-01 08:00:00 | Admin gỡ ảnh duy nhất của maria ngày 2026-11-01; maria thêm 1 ảnh ngày 2026-11-02 | Hồ sơ hoàn chỉnh lại; completedAt vẫn là 2026-10-01 08:00:00 | R-10, R-21 |
| AC-77 | Có 3 bài đang xuất bản A, B, C; john@example.com đã mở cả 3, chưa bấm "Tôi đã đọc và đồng ý" | Admin gỡ C, xuất bản lại C, rồi john bấm "Tôi đã đọc và đồng ý" | Giáo dục văn hóa của john hoàn tất | R-22 |

## 9. Non-functional

| Code | Quality | Measure | Target | Source |
| --- | --- | --- | --- | --- |

## 10. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |
| ASM-01 | Khách cung cấp danh sách mục tiêu quan hệ và danh sách sở thích (SRC-12#L24) | Honda hỏi khách, trước khi viết DSN |
| ASM-02 | SmartMatchApp tính được điểm tương thích 0–100 cho mỗi cặp nam–nữ; bộ câu hỏi đầu vào xác định sau spike (SRC-12#L29) | Spike thử API SmartMatchApp, trước khi viết DSN |
| ASM-03 | Khách cung cấp nội dung các bài giáo dục văn hóa | Honda hỏi khách, trước ngày ra mắt |

## 11. Out of scope

- Yêu cầu liên hệ, chấp nhận/từ chối và nhắn tin: SPEC kết nối (BRIEF-1/C-20, BRIEF-1/C-21, BRIEF-1/C-22).
- Điều kiện xác minh để vào Lobby và mua gói: SPEC-2.
- Ẩn người bị chặn khỏi Lobby và tìm kiếm: SPEC-6 (BRIEF-1/C-26).
- Màn hình admin gỡ ảnh, gỡ phần giới thiệu, và tạo, sửa, xuất bản, gỡ bài giáo dục văn hóa: SPEC-9 (BRIEF-1/C-35, BRIEF-1/C-37, SRC-12#L30).
- Khác biệt giữa các gói thành viên: SPEC thanh toán (SRC-12#L21).
- Bộ câu hỏi dùng để tính điểm tương thích: sau spike SmartMatchApp (SRC-12#L29).

## Change log

| Version | Date | By | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-09-29 | Honda | Approved |
| 0.2.0 | 2026-09-30 | Honda | Approved revision of 0.1.0 (minor): admin gỡ ảnh, bio và quản lý bài giáo dục văn hóa (SPEC-9; SRC-27) |
