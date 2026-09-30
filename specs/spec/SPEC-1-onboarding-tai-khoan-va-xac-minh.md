---
id: SPEC-1
title: Tài khoản và onboarding
version: 0.2.0
status: approved
owner: Honda
flow: project
risk: high
review: specs/review/SPEC-1-0.2.0.md
parent: [BRIEF-1@0.1.0]
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:74a27dd42f37697df58ccea3
---

# SPEC-1: Tài khoản và onboarding

<!-- Skyline SPEC (project flow): the exact logic. One row, one fact. Bare codes (R-01) are this SPEC; anything else is qualified (BRIEF-1/C-02). Every rule has a Source and at least one AC. Each unknown becomes a CLARIFY marker; never guess. -->

## 1. Scope

Implements BRIEF-1/C-01, BRIEF-1/C-02, BRIEF-1/C-03, BRIEF-1/C-04, BRIEF-1/C-30 và phần audit log của các sự kiện này trong BRIEF-1/C-40: màn hình onboarding, đăng ký, xác nhận email, đăng nhập, đặt lại mật khẩu, sửa thông tin đăng ký và xóa tài khoản, cho cả nam Mỹ (BRIEF-1/A-01) và nữ Philippines (BRIEF-1/A-02), trong app và trên website. Kết thúc khi tài khoản được xác nhận email và chuyển sang bước xác minh danh tính (SPEC-2).

## 2. Glossary

| Code | Term | Definition | Source |
| --- | --- | --- | --- |
| T-01 | Thành viên | Người có tài khoản trên FilipinaConnect.US, thuộc một trong hai nhánh: nam Mỹ hoặc nữ Philippines | BRIEF-1/A-01, BRIEF-1/A-02 |
| T-02 | Nhánh giới | Lựa chọn "I Am A Man" hoặc "I Am A Woman" trên một màn hình duy nhất, là màn thứ 4 của onboarding; quyết định journey của thành viên | SRC-1#L84, SRC-1#L116, SRC-3#L26, SRC-3#L47, SRC-8#L40, SRC-8#L70 |
| T-03 | Tài khoản đã xác nhận | Tài khoản ở trạng thái Active | SRC-1#L87-L89, SRC-1#L119-L121 |
| T-04 | Tuổi | Số năm tròn tính từ ngày sinh đến ngày đăng ký, theo ngày lịch UTC; người sinh ngày 29/2 được tính thêm tuổi vào ngày 1/3 của năm không nhuận | SRC-1#L26-L27, SRC-1#L86, SRC-6#L52-L53, SRC-8#L26, SRC-8#L70 |
| T-05 | Quốc gia đăng ký | Quốc gia thành viên chọn từ danh sách khi đăng ký; thành phố được gõ riêng | SRC-1#L86, SRC-6#L22-L23, SRC-8#L27, SRC-8#L70 |
| T-06 | Link email | Link xác nhận email hoặc link đặt lại mật khẩu; còn hiệu lực khi được mở dưới 24 giờ kể từ lúc gửi (tính tới từng giây), chưa được dùng và chưa bị một link mới cùng loại thay thế | SRC-6#L25-L26, SRC-8#L24-L25, SRC-8#L70, SRC-10#L36, SRC-10#L54 |
| T-07 | Chuẩn hóa email | Bỏ ký tự trắng đầu và cuối, so sánh không phân biệt hoa thường, không gộp alias (dấu "+" hay dấu chấm) | SRC-8#L29, SRC-8#L70 |
| T-08 | Mốc thời gian | Một thời hạn được coi là đã qua khi thời gian đã trôi ≥ đúng thời hạn đó | SRC-8#L25, SRC-10#L37, SRC-10#L54 |
| T-09 | Email hợp lệ | Chuỗi có dạng phần-tên@tên-miền.đuôi (có ít nhất một dấu chấm sau @), không có dấu cách | SRC-10#L30, SRC-10#L54 |

## 3. Data

| Code | Field | Type | Required | Constraint | Source |
| --- | --- | --- | --- | --- | --- |
| DF-01 | Member.gender | enum {man, woman} | yes | đặt theo R-01; không đổi được (R-12) | SRC-1#L84, SRC-1#L116, SRC-6#L52-L53 |
| DF-02 | Member.name | text, 1–100 ký tự, không chỉ gồm ký tự trắng | yes | R-02; sửa được (R-17) | SRC-1#L86, SRC-1#L117, SRC-10#L29-L30 |
| DF-03 | Member.email | email (T-09) | yes | R-02; duy nhất sau chuẩn hóa (R-11); không sửa được (R-17) | SRC-1#L86, SRC-1#L117, SRC-6#L52-L53, SRC-10#L29 |
| DF-04 | Member.country | quốc gia chọn từ danh sách | yes | R-04; không sửa được (R-17) | SRC-1#L86, SRC-6#L22-L23, SRC-8#L27-L28 |
| DF-05 | Member.city | text, 1–100 ký tự, không chỉ gồm ký tự trắng | yes | R-02; sửa được (R-17) | SRC-1#L86, SRC-8#L27-L28, SRC-10#L30 |
| DF-06 | Member.dateOfBirth | date | yes | R-02, R-03; không sửa được (R-17) | SRC-1#L86, SRC-1#L117, SRC-8#L28 |
| DF-07 | Member.password | secret | yes | R-06 | SRC-1#L222, SRC-6#L28-L29, SRC-8#L31, SRC-10#L34 |
| DF-08 | Account.status | enum {Unconfirmed, Active, Deleted, Expired} | yes | máy trạng thái Account (mục 4) | SRC-1#L87-L89, SRC-1#L256, SRC-8#L19 |
| DF-09 | Account.createdAt | thời điểm UTC | yes | R-16 | SRC-8#L19 |
| DF-10 | EmailLink.sentAt | thời điểm UTC | yes | T-06 | SRC-6#L25-L26, SRC-8#L25 |
| DF-11 | Account.failedLogins | số nguyên ≥ 0, kèm thời điểm lần sai đầu tiên của chuỗi | yes | R-15 | SRC-8#L32, SRC-10#L33 |
| DF-12 | BlockedEmail.hash | mã băm của email đã chuẩn hóa | khi tài khoản bị Deleted | R-11; giữ mãi mãi | SRC-10#L20, SRC-10#L54 |

## 4. States

| Code | Machine | State | Kind |
| --- | --- | --- | --- |
| S-01 | Account | Unconfirmed | initial |
| S-02 | Account | Active | normal |
| S-03 | Account | Deleted | terminal |
| S-04 | Account | Expired | terminal |

| Code | From | Event | Guard | To | Rules |
| --- | --- | --- | --- | --- | --- |
| X-01 | S-01 | confirm_email | R-05 | S-02 | R-05, R-09 |
| X-02 | S-01 | complete_password_reset | R-07 | S-02 | R-07, R-09 |
| X-03 | S-01 | expire | | S-04 | R-16, R-09 |
| X-04 | S-02 | delete_account | R-08 and not uncancelledPlan | S-03 | R-08, R-09 |
| X-05 | S-02 | admin_delete | | S-03 | R-19, R-09 |
| X-06 | S-01 | admin_delete | | S-03 | R-19, R-09 |

## 5. Rules

| Code | Rule | Source |
| --- | --- | --- |
| R-01 | Onboarding hiện ở lần mở app đầu tiên sau mỗi lần cài app và không có cách bỏ qua; thứ tự là Welcome → Our Story → Our Advice → màn chọn nhánh giới (một màn duy nhất có "I Am A Man" và "I Am A Woman"); form đăng ký chỉ mở sau khi chọn nhánh, và lựa chọn được lưu vào Member.gender; màn chọn nhánh giới có link "Đã có tài khoản? Đăng nhập" dẫn tới màn đăng nhập; nếu app bị đóng trước khi đi hết onboarding thì lần mở sau onboarding chạy lại từ Welcome; từ lần mở sau khi đã đi hết onboarding, màn đăng nhập có nút "Tạo tài khoản" dẫn thẳng tới màn chọn nhánh giới | SRC-1#L80-L86, SRC-1#L111-L117, SRC-3#L23-L27, SRC-3#L44-L48, SRC-8#L39-L40, SRC-8#L70, SRC-10#L19, SRC-10#L54, SRC-11#L19, SRC-11#L26, SRC-11#L46, BRIEF-1/C-01 |
| R-02 | Đăng ký yêu cầu đủ name, email, country, city, dateOfBirth và password; name và city được bỏ ký tự trắng đầu và cuối trước khi đếm và lưu, đếm theo ký tự Unicode sau chuẩn hóa NFC, tối đa 100 ký tự; name hoặc city chỉ gồm ký tự trắng coi như thiếu; email được chuẩn hóa (T-07) rồi mới kiểm tra hợp lệ (T-09); thiếu hoặc sai thì không tạo tài khoản và báo trường có lỗi | SRC-1#L86, SRC-1#L117, SRC-1#L222, SRC-8#L41, SRC-8#L70, SRC-10#L30, SRC-10#L54, SRC-11#L27, SRC-11#L29, SRC-11#L46, BRIEF-1/C-02 |
| R-03 | Tuổi (T-04) tại ngày đăng ký phải ≥ 18, cho cả nam và nữ; Tuổi < 18 thì từ chối đăng ký và không tạo tài khoản | SRC-1#L26-L27, SRC-1#L86, SRC-6#L19-L20, SRC-8#L26 |
| R-04 | Quốc gia đăng ký của nam phải là Mỹ, của nữ phải là Philippines; "Mỹ" gồm 50 bang, DC và các lãnh thổ Guam, Puerto Rico, US Virgin Islands, Northern Mariana Islands, American Samoa, và không gồm United States Minor Outlying Islands; không khớp thì từ chối đăng ký và không tạo tài khoản | SRC-1#L26-L27, SRC-6#L22-L23, SRC-8#L27, SRC-8#L70, SRC-9#L24-L25, SRC-11#L33, SRC-11#L46 |
| R-05 | Khi tài khoản được tạo (Unconfirmed), hệ thống gửi một email chứa link xác nhận; mỗi link gắn với tài khoản mà nó được gửi cho, không gắn với địa chỉ email; nếu tài khoản đang Active thì mọi link xác nhận (đã dùng, đã bị thay hay đã hết hạn) đều hiện "đã xác nhận"; nếu tài khoản đang Expired hoặc Deleted thì link bị từ chối và tài khoản giữ nguyên; nếu tài khoản đang Unconfirmed thì link còn hiệu lực (T-06) chuyển tài khoản sang Active, link hết hiệu lực bị từ chối | SRC-1#L87-L89, SRC-1#L119-L121, SRC-6#L25-L26, SRC-8#L24-L25, SRC-8#L70, SRC-10#L25, SRC-10#L54, SRC-11#L24, SRC-11#L46, BRIEF-1/C-03 |
| R-06 | Mật khẩu dài từ 8 đến 128 ký tự, đếm theo ký tự Unicode sau khi chuẩn hóa NFC; có ít nhất một chữ cái (bất kỳ chữ cái nào, kể cả chữ có dấu) và ít nhất một chữ số 0–9; được có dấu cách, kể cả ở đầu và cuối, và dấu cách được giữ nguyên như khi nhập; mật khẩu được chuẩn hóa NFC trước khi lưu và trước mỗi lần so sánh; áp dụng khi đăng ký và khi đặt lại; không đạt thì từ chối | SRC-1#L222, SRC-6#L28-L29, SRC-8#L31, SRC-8#L70, SRC-10#L34, SRC-10#L54, SRC-11#L23, SRC-11#L46 |
| R-07 | Thành viên nhập email trên màn hình quên mật khẩu (app hoặc website): nếu email thuộc tài khoản Unconfirmed hoặc Active, hệ thống gửi link đặt lại (T-06) theo giới hạn R-13, và link mới được gửi làm link đặt lại cũ hết hiệu lực (yêu cầu bị từ chối vì vượt giới hạn thì link cũ vẫn còn hiệu lực); nếu không có tài khoản, hoặc tài khoản Deleted hay Expired, không gửi email; link đặt lại mở trên điện thoại hoặc máy tính bảng có cài app thì mở trong app, mở trên thiết bị khác hoặc trên điện thoại chưa cài app thì mở trang đặt lại trên website; đặt mật khẩu mới qua link còn hiệu lực theo R-06 thì mật khẩu cũ không còn đăng nhập được, mọi thiết bị (kể cả thiết bị vừa đặt lại) bị đăng xuất, khóa đăng nhập của R-15 được gỡ, và tài khoản Unconfirmed chuyển sang Active; link đặt lại mở khi tài khoản đã Expired hoặc Deleted thì từ chối | SRC-1#L222, SRC-6#L25-L26, SRC-8#L23-L25, SRC-8#L32, SRC-8#L70, SRC-10#L21, SRC-10#L35-L36, SRC-10#L54, SRC-11#L31-L32, SRC-11#L46, BRIEF-1/C-04 |
| R-08 | Chỉ thành viên Active xóa được tài khoản của mình (Unconfirmed thì từ chối, chờ hết hạn theo R-16), trong app hoặc trên website, khi nhập lại đúng mật khẩu và đã hủy gói thành viên (nếu có; gói đã hủy nhưng còn trong kỳ đã trả vẫn cho xóa); nhập sai mật khẩu ở đây tính vào số lần sai của R-15, nhập đúng mật khẩu ở đây đặt số lần sai về 0 (kể cả khi việc xóa bị từ chối vì lý do khác), và khi tài khoản đang bị khóa thì từ chối xóa; không có thời gian chờ để hoàn tác; tài khoản chuyển sang Deleted, mọi thiết bị bị đăng xuất, email đó không đăng nhập được; country, city, dateOfBirth, ảnh và hồ sơ bị xóa; name và email chỉ còn trong các bản ghi được giữ lại (audit log, hồ sơ xác minh, lịch sử thanh toán), giữ trong thời hạn lưu giữ theo luật do khách và luật sư của khách quyết định | SRC-1#L183, SRC-1#L256, SRC-6#L31-L32, SRC-8#L22, SRC-8#L32, SRC-8#L35-L36, SRC-8#L70, SRC-10#L31-L32, SRC-10#L35, SRC-10#L54, SRC-11#L30, SRC-11#L46, BRIEF-1/C-30 |
| R-09 | Hệ thống ghi audit log cho sự kiện tạo tài khoản, xác nhận email (kể cả khi tài khoản được kích hoạt qua đặt lại mật khẩu), đặt lại mật khẩu, sửa name, sửa city, tài khoản hết hạn và xóa tài khoản (kể cả xóa do admin, với người thực hiện là admin đó); mỗi bản ghi có thành viên, email và thời điểm UTC; bản ghi hết hạn lấy thời điểm là mốc 168 giờ của R-16 và vẫn giữ email; không ghi mỗi lần đăng nhập | SRC-1#L180, SRC-1#L182, SRC-8#L37, SRC-8#L58, SRC-8#L70, SRC-10#L22, SRC-10#L54, SRC-11#L28, SRC-11#L46, BRIEF-1/C-40 |
| R-10 | Chỉ tài khoản Active mới được mở bước xác minh danh tính; tài khoản Unconfirmed đăng nhập được nhưng chỉ thấy màn hình nhắc xác nhận email | SRC-1#L89-L90, SRC-1#L121-L122, SRC-3#L29-L30, SRC-3#L50-L51, SRC-6#L52-L53 |
| R-11 | Một email (sau chuẩn hóa T-07) chỉ gắn với một tài khoản; hai lần gửi đăng ký cùng email cùng lúc chỉ tạo đúng một tài khoản, lần kia xử lý như email trùng; email của tài khoản Unconfirmed hoặc Active không đăng ký lại được; email của tài khoản Deleted bị chặn đăng ký mãi mãi, kể cả sau khi hết thời hạn lưu giữ, bằng cách giữ mã băm của email đã chuẩn hóa chỉ để chặn; email của tài khoản Expired đăng ký lại được; sau khi gửi form đăng ký, dù thành công hay bị trùng, màn hình đều hiện "Kiểm tra email để xác nhận" và người dùng không được đăng nhập; khi trùng với tài khoản Unconfirmed hoặc Active, không tạo tài khoản mới và gửi tới địa chỉ đó email "bạn đã có tài khoản" theo giới hạn R-13; khi trùng với tài khoản Deleted, không gửi email | SRC-6#L52-L53, SRC-8#L19-L21, SRC-8#L29, SRC-8#L70, SRC-10#L20, SRC-10#L27-L28, SRC-10#L54 |
| R-12 | Nhánh giới không đổi được sau khi đăng ký | SRC-6#L52-L53 |
| R-13 | Với mỗi địa chỉ email và riêng từng loại (link xác nhận gửi lại, link đặt lại mật khẩu, email "bạn đã có tài khoản"), hệ thống gửi tối đa 1 email trong 60 giây và tối đa 5 email trong một ngày lịch UTC; email xác nhận gửi lúc đăng ký không tính vào cả hai giới hạn; yêu cầu vượt giới hạn không làm link cũ hết hiệu lực; thành viên Unconfirmed yêu cầu gửi lại link xác nhận thì nhận link mới và link xác nhận cũ hết hiệu lực; vượt giới hạn khi gửi lại link xác nhận thì từ chối; vượt giới hạn khi quên mật khẩu hoặc đăng ký trùng thì màn hình vẫn như R-14 và R-11 nhưng không gửi email | SRC-6#L25-L26, SRC-8#L24, SRC-8#L34, SRC-8#L70, SRC-9#L19, SRC-9#L22, SRC-10#L23-L24, SRC-10#L54, SRC-11#L20, SRC-11#L32, SRC-11#L46 |
| R-14 | Màn hình quên mật khẩu hiện cùng một thông báo dù email nhập vào có tài khoản hay không | SRC-6#L52-L53 |
| R-15 | Đăng nhập chỉ bằng email và mật khẩu; email chưa đăng ký, sai mật khẩu và tài khoản đang bị khóa đều hiện cùng một thông báo từ chối; tài khoản bị khóa đăng nhập 15 phút kể từ lần sai thứ 5 khi 5 lần sai liên tiếp gần nhất (không có lần đúng xen giữa) có thời gian từ lần đầu đến lần cuối của 5 lần đó < 15 phút (cửa sổ trượt; đủ 15 phút là đã qua mốc theo T-08); trong lúc khóa, mọi lần đăng nhập bị từ chối kể cả đúng mật khẩu; hết khóa thì số lần sai về 0; đăng nhập thành công, đặt lại mật khẩu thành công hoặc nhập đúng mật khẩu ở màn xóa tài khoản thì số lần sai về 0 | SRC-1#L222, SRC-8#L30, SRC-8#L32-L33, SRC-8#L70, SRC-9#L20, SRC-9#L22, SRC-10#L21, SRC-10#L33, SRC-10#L54, SRC-11#L22, SRC-11#L30, SRC-11#L46, BRIEF-1/C-04 |
| R-16 | Tài khoản Unconfirmed được coi là Expired từ đúng mốc 168 giờ (7 ngày) kể từ Account.createdAt, với mọi rule trong SPEC này (link bị từ chối; đăng nhập, gửi lại link và quên mật khẩu đều bị từ chối với thông báo chung của R-15 và R-14; email được trả lại để đăng ký mới), bất kể việc dọn dữ liệu chạy lúc nào; dữ liệu đăng ký của tài khoản đó bị xóa theo N-01 | SRC-8#L19, SRC-8#L70, SRC-10#L26, SRC-10#L37, SRC-10#L54, SRC-11#L21, SRC-11#L46 |
| R-17 | Chỉ tài khoản Active sửa được thông tin; name và city sửa được theo điều kiện của R-02; dateOfBirth, country và email không sửa được | SRC-8#L28, SRC-8#L70, SRC-10#L29, SRC-10#L54 |
| R-18 | Chỉ đăng ký được trong app; website có đăng nhập, quên và đặt lại mật khẩu, sửa name, sửa city và xóa tài khoản, không có form đăng ký | SRC-8#L39, SRC-8#L70, SRC-10#L35, SRC-10#L54, SRC-11#L25, SRC-11#L46 |
| R-19 | Admin Cấp cao nhất xóa được tài khoản Unconfirmed (chưa qua mốc 168 giờ của R-16) hoặc Active thay thành viên theo SPEC-8, khi ghi đủ tham chiếu tới yêu cầu bằng văn bản và lý do; không cần mật khẩu của thành viên và không cần thành viên hủy gói trước (gói chuyển Ended theo SPEC-5); tài khoản chuyển sang Deleted với các hậu quả khác như R-08 (mọi thiết bị bị đăng xuất, dữ liệu được xóa và giữ theo R-08, email bị chặn đăng ký lại theo R-11); tài khoản đã Deleted hoặc đã qua mốc 168 giờ thì từ chối; hai lần xóa cùng lúc thì lần ghi trước thắng, lần sau bị từ chối | SRC-24#L23, SRC-25#L20, SRC-25#L33, SRC-25#L40, SRC-26#L27-L28, SRC-26#L34 |

## 6. Permissions

<!-- Columns after Action are actors: BRIEF-n/A-nn. Cells: Y, N, or a rule code (R-nn) meaning "allowed when that rule holds". -->

| Code | Action | BRIEF-1/A-01 Nam Mỹ | BRIEF-1/A-02 Nữ Philippines |
| --- | --- | --- | --- |
| P-01 | Đăng ký tài khoản trong app | Y | Y |
| P-02 | Đăng nhập | R-15 | R-15 |
| P-03 | Đặt lại mật khẩu của mình | R-07 | R-07 |
| P-04 | Xóa tài khoản của mình | R-08 | R-08 |
| P-05 | Đổi nhánh giới sau khi đăng ký | N | N |
| P-06 | Sửa ngày sinh hoặc quốc gia sau khi đăng ký | N | N |
| P-07 | Sửa thành phố | R-17 | R-17 |
| P-08 | Đăng ký trên website | N | N |
| P-09 | Sửa tên | R-17 | R-17 |
| P-10 | Sửa email | N | N |

## 7. Flows

### F-01 Đăng ký nam Mỹ

1. Lần mở app đầu tiên sau khi cài: Welcome → Our Story → Our Advice → chọn "I Am A Man" (R-01).
2. Nhập name, email, country, city, dateOfBirth, password (R-02, R-03, R-04, R-06, R-11).
3. Tài khoản được tạo ở Unconfirmed; màn hình "Kiểm tra email để xác nhận"; email xác nhận được gửi; audit ghi sự kiện tạo tài khoản (R-05, R-11, R-09).
4. Thành viên mở link còn hiệu lực → Active, audit ghi sự kiện xác nhận email (X-01, R-09).
5. Thành viên đăng nhập và được chuyển sang bước xác minh danh tính (R-10).

Nhánh lỗi:

- 1a. Mở app lần sau khi chưa có tài khoản → màn đăng nhập, bấm "Tạo tài khoản" để tới màn chọn nhánh giới (R-01).
- 2a. Thiếu trường, name hoặc city chỉ có ký tự trắng, quá 100 ký tự, hoặc email không hợp lệ → từ chối (R-02).
- 2b. Tuổi < 18 → từ chối (R-03).
- 2c. Quốc gia không phải Mỹ → từ chối (R-04).
- 2d. Email trùng → cùng màn hình như bước 3, không tạo tài khoản; email "bạn đã có tài khoản" nếu trùng tài khoản Unconfirmed hoặc Active (R-11, R-13).
- 2e. Mật khẩu không đạt → từ chối (R-06).
- 4a. Link hết hiệu lực → từ chối; thành viên yêu cầu gửi lại trong giới hạn (R-05, R-13).
- 4b. Đủ 7 ngày chưa xác nhận → Expired (X-03, R-16).
- 5a. Tài khoản còn Unconfirmed → chỉ thấy màn hình nhắc xác nhận email (R-10).

### F-02 Đăng ký nữ Philippines

1. Lần mở app đầu tiên sau khi cài: Welcome → Our Story → Our Advice → chọn "I Am A Woman" (R-01).
2. Các bước 2–5 và nhánh lỗi giống F-01, với quốc gia phải là Philippines (R-02, R-03, R-04, R-05, R-06, R-09, R-11, R-13, R-16, X-01, X-03, R-10).

### F-03 Đăng nhập và đặt lại mật khẩu

1. Thành viên đăng nhập bằng email và mật khẩu, trong app hoặc trên website (R-15, R-18).
2. Quên mật khẩu: nhập email; màn hình hiện cùng một thông báo (R-07, R-14, R-13).
3. Mở link đặt lại còn hiệu lực và đặt mật khẩu mới theo R-06; mọi thiết bị bị đăng xuất; khóa được gỡ; tài khoản Unconfirmed thành Active (R-07, X-02, R-09).

Nhánh lỗi:

- 1a. 5 lần sai liên tiếp trong ≤ 15 phút → khóa 15 phút, thông báo vẫn như sai mật khẩu (R-15).
- 2a. Email không có tài khoản hoặc tài khoản Deleted/Expired, hoặc vượt giới hạn gửi → không gửi email (R-07, R-13).
- 3a. Link hết hiệu lực, đã dùng hoặc đã bị link đặt lại mới thay → từ chối (R-07).

### F-04 Xóa tài khoản

1. Thành viên Active chọn xóa tài khoản trong app hoặc trên website và nhập lại mật khẩu (R-08, R-18).
2. Tài khoản chuyển sang Deleted; dữ liệu cá nhân bị xóa theo R-08; mọi thiết bị bị đăng xuất; email bị chặn đăng ký mãi mãi; audit ghi sự kiện xóa (X-04, R-08, R-11, R-09).

Nhánh lỗi:

- 1a. Sai mật khẩu → từ chối, tính vào số lần sai của R-15 (R-08).
- 1b. Còn gói thành viên chưa hủy → từ chối, yêu cầu hủy gói trước (R-08).
- 1c. Tài khoản Unconfirmed hoặc đang bị khóa → từ chối (R-08).

## 8. Acceptance criteria

Mọi thời điểm trong mục này là UTC.

| Code | Given | When | Then | Covers |
| --- | --- | --- | --- | --- |
| AC-01 | Người dùng mở app lần đầu sau khi cài | Đi qua onboarding | Các màn hiện đúng thứ tự Welcome → Our Story → Our Advice → màn chọn nhánh giới có cả "I Am A Man" và "I Am A Woman"; form đăng ký không hiện trước khi chọn nhánh | R-01, F-01 |
| AC-02 | Người dùng mở app lần đầu | Ở mỗi màn Welcome, Our Story, Our Advice | Không có nút hay thao tác nào bỏ qua màn đó | R-01 |
| AC-03 | Người dùng đã đi qua onboarding nhưng đóng app trước khi gửi form đăng ký | Mở app lần thứ 2 | Onboarding không hiện lại; màn đăng nhập có nút "Tạo tài khoản" | R-01, F-01 |
| AC-04 | Màn đăng nhập đang mở | Bấm "Tạo tài khoản" | Màn chọn nhánh giới mở ra ngay, không qua Welcome, Our Story, Our Advice | R-01 |
| AC-05 | Người dùng đã đi qua onboarding, rồi gỡ và cài lại app | Mở app | Onboarding hiện lại từ màn Welcome | R-01 |
| AC-96 | Người dùng đã có tài khoản cài app trên điện thoại mới và đi qua Welcome, Our Story, Our Advice | Bấm "Đã có tài khoản? Đăng nhập" trên màn chọn nhánh giới | Màn đăng nhập mở ra | R-01 |
| AC-97 | Người dùng mở app lần đầu và đóng app khi đang ở màn Our Story | Mở app lần nữa | Onboarding chạy lại từ màn Welcome | R-01 |
| AC-06 | Người dùng chọn "I Am A Woman", country Philippines, city "Cebu City", các trường khác hợp lệ | Gửi form đăng ký | Tài khoản được tạo với Member.gender = woman | R-01, R-04, P-01, F-02 |
| AC-07 | Form có name "Maria Santos", email maria@example.com, country Philippines, dateOfBirth 1995-03-10, password "abcdefg1", city để trống | Gửi form đăng ký | Bị từ chối; không có tài khoản nào được tạo; form báo thiếu city | R-02 |
| AC-08 | Form hợp lệ nhưng name là "   " (3 dấu cách) | Gửi form đăng ký | Bị từ chối; form báo thiếu name | R-02 |
| AC-09 | Form hợp lệ nhưng city là "   " | Gửi form đăng ký | Bị từ chối; form báo thiếu city | R-02 |
| AC-10 | Form hợp lệ, lần lượt với email "maria@", "maria@example", "a b@example.com", "@example.com" và "maria@example." | Gửi form đăng ký mỗi lần | Cả 5 lần bị từ chối; form báo email không hợp lệ | R-02 |
| AC-11 | Form hợp lệ với name gồm 100 ký tự | Gửi form đăng ký | Tài khoản được tạo | R-02 |
| AC-12 | Form hợp lệ với city gồm 101 ký tự | Gửi form đăng ký | Bị từ chối; form báo city quá 100 ký tự | R-02 |
| AC-98 | Form hợp lệ với name gồm 101 ký tự | Gửi form đăng ký | Bị từ chối; form báo name quá 100 ký tự | R-02 |
| AC-99 | Form hợp lệ với city gồm 100 ký tự | Gửi form đăng ký | Tài khoản được tạo | R-02 |
| AC-100 | Form hợp lệ với name "  Maria Santos  " (có dấu cách đầu và cuối) | Gửi form đăng ký | Tài khoản được tạo với name "Maria Santos" | R-02 |
| AC-13 | Ngày đăng ký 2026-10-01, dateOfBirth 2008-10-01 (tròn 18 tuổi), các trường khác hợp lệ | Gửi form đăng ký | Tài khoản được tạo ở trạng thái Unconfirmed | R-03, F-01 |
| AC-14 | Ngày đăng ký 2026-10-01, dateOfBirth 2008-10-02 (17 tuổi), các trường khác hợp lệ | Gửi form đăng ký | Bị từ chối vì chưa đủ tuổi; không có tài khoản nào được tạo | R-03 |
| AC-15 | Nữ ở Manila gửi form lúc 07:00 giờ Manila ngày 2026-10-01 (2026-09-30 23:00 UTC), dateOfBirth 2008-10-01 | Gửi form đăng ký | Bị từ chối vì chưa đủ tuổi theo ngày UTC 2026-09-30 | R-03 |
| AC-16 | dateOfBirth 2008-02-29, ngày đăng ký 2026-02-28 | Gửi form đăng ký | Bị từ chối vì chưa đủ tuổi | R-03 |
| AC-17 | dateOfBirth 2008-02-29, ngày đăng ký 2026-03-01 | Gửi form đăng ký | Tài khoản được tạo | R-03 |
| AC-18 | Nam chọn "I Am A Man", country Philippines, city "Manila", các trường khác hợp lệ | Gửi form đăng ký | Bị từ chối vì quốc gia không phải Mỹ; không có tài khoản nào được tạo | R-04, P-01 |
| AC-19 | Nam chọn "I Am A Man", country Mỹ, city "Austin", các trường khác hợp lệ | Gửi form đăng ký | Tài khoản được tạo ở Unconfirmed | R-04, F-01 |
| AC-20 | Nữ chọn "I Am A Woman", country Mỹ, city "Los Angeles", các trường khác hợp lệ | Gửi form đăng ký | Bị từ chối vì quốc gia không phải Philippines; không có tài khoản nào được tạo | R-04 |
| AC-21 | Nữ chọn "I Am A Woman", country United Arab Emirates, city "Dubai", các trường khác hợp lệ | Gửi form đăng ký | Bị từ chối vì quốc gia không phải Philippines; không có tài khoản nào được tạo | R-04 |
| AC-22 | Nam chọn "I Am A Man", country Guam, city "Hagåtña", các trường khác hợp lệ | Gửi form đăng ký | Tài khoản được tạo ở Unconfirmed | R-04 |
| AC-101 | Nam chọn "I Am A Man", lần lượt với country Puerto Rico, American Samoa, US Virgin Islands, Northern Mariana Islands và District of Columbia, các trường khác hợp lệ | Gửi form đăng ký mỗi lần | Cả 5 lần tài khoản được tạo ở Unconfirmed | R-04 |
| AC-102 | Nam chọn "I Am A Man", country United States Minor Outlying Islands, các trường khác hợp lệ | Gửi form đăng ký | Bị từ chối vì quốc gia không phải Mỹ; không có tài khoản nào được tạo | R-04 |
| AC-23 | Người dùng gửi form đăng ký hợp lệ với email john@example.com | Tài khoản được tạo | Màn hình hiện "Kiểm tra email để xác nhận"; người dùng chưa đăng nhập; hộp thư john@example.com nhận đúng 1 email chứa link xác nhận | R-05, R-11, F-01 |
| AC-24 | Tài khoản john@example.com ở Unconfirmed, link xác nhận gửi lúc 2026-10-01 10:00:00 | Mở link lúc 2026-10-02 09:59:59 | Tài khoản chuyển sang Active | R-05, X-01, F-01 |
| AC-25 | Tài khoản john@example.com ở Unconfirmed, link xác nhận gửi lúc 2026-10-01 10:00:00 | Mở link lúc 2026-10-02 10:00:00 | Link bị từ chối vì hết hiệu lực; tài khoản vẫn Unconfirmed | R-05 |
| AC-26 | john@example.com đã mở link xác nhận và tài khoản đã Active | Mở lại chính link đó | Màn hình hiện "đã xác nhận"; trạng thái vẫn Active | R-05 |
| AC-27 | john@example.com có link 1 gửi lúc 10:00:00 bị link 2 thay lúc 10:05:00, đã xác nhận bằng link 2 | Mở link 1 lúc 2026-10-02 11:00:00 (đã bị thay và quá 24 giờ) | Màn hình hiện "đã xác nhận"; trạng thái vẫn Active | R-05 |
| AC-28 | Tài khoản john@example.com ở Unconfirmed, link 1 gửi lúc 10:00:00, link 2 (gửi lại) lúc 10:05:00 | Mở link 1 lúc 10:10:00, sau đó mở link 2 lúc 10:11:00 | Link 1 bị từ chối, tài khoản vẫn Unconfirmed; mở link 2 thì tài khoản chuyển sang Active | R-13, R-05, F-01 |
| AC-103 | Tài khoản john@example.com ở Unconfirmed, link xác nhận gửi lúc 10:00:00 | Yêu cầu link đặt lại lúc 10:02:00, rồi mở link xác nhận lúc 10:05:00 | Tài khoản chuyển sang Active (link đặt lại không làm link xác nhận hết hiệu lực) | R-05, R-07 |
| AC-104 | Tài khoản john@example.com Active rồi bị xóa lúc 11:00:00 | Mở link xác nhận cũ của john lúc 11:30:00 | Link bị từ chối; tài khoản vẫn Deleted | R-05 |
| AC-105 | Tài khoản cũ john@example.com đã Expired theo AC-83; một tài khoản mới được tạo cho john@example.com lúc 2026-10-08 10:00:00 | Mở link gửi lại của tài khoản cũ lúc 2026-10-08 10:30:00 | Link bị từ chối; tài khoản mới vẫn Unconfirmed | R-05, R-16 |
| AC-29 | Tài khoản john@example.com ở Unconfirmed, vừa gửi lại link lúc 10:05:00 | Yêu cầu gửi lại lúc 10:05:59, rồi lúc 10:06:00 | Yêu cầu lúc 10:05:59 bị từ chối; yêu cầu lúc 10:06:00 được gửi | R-13 |
| AC-30 | Tài khoản john@example.com ở Unconfirmed đã nhận 5 email gửi lại lúc 01:00, 02:00, 03:00, 04:00 và 05:00 ngày 2026-10-03 | Yêu cầu gửi lại lúc 2026-10-03 23:00:00, rồi lúc 2026-10-04 00:00:00 | Yêu cầu ngày 2026-10-03 bị từ chối; yêu cầu lúc 2026-10-04 00:00:00 được gửi | R-13 |
| AC-31 | john@example.com đăng ký lúc 10:00:00 và nhận email xác nhận đầu tiên | Yêu cầu gửi lại lúc 10:00:30 | Link mới được gửi (email lúc đăng ký không tính vào giới hạn) | R-13 |
| AC-32 | Tài khoản john@example.com ở Unconfirmed, vừa nhận link xác nhận gửi lại lúc 10:00:00 | Nhập john@example.com trên màn hình quên mật khẩu lúc 10:00:30 | Hộp thư nhận 1 email đặt lại (giới hạn tính riêng từng loại) | R-13, R-07 |
| AC-33 | Đã có tài khoản Active john@example.com | Hai lần đăng ký trùng bằng john@example.com lúc 10:00:00 và 10:00:10 | Cả hai lần hiện "Kiểm tra email để xác nhận"; hộp thư chỉ nhận 1 email "bạn đã có tài khoản" | R-13, R-11 |
| AC-106 | john@example.com nhận link đặt lại A lúc 10:00:00 | Yêu cầu link đặt lại lần nữa lúc 10:00:30 (vượt giới hạn 60 giây), rồi mở link A lúc 10:01:00 và đặt "NewPass2" | Không có email mới; link A vẫn đổi mật khẩu thành công | R-13, R-07 |
| AC-34 | Form đăng ký hợp lệ với password "abcdefg1" (8 ký tự, có chữ và số) | Gửi form đăng ký | Tài khoản được tạo | R-06 |
| AC-35 | Form đăng ký hợp lệ với password "abcdef1" (7 ký tự) | Gửi form đăng ký | Bị từ chối vì mật khẩu dưới 8 ký tự | R-06 |
| AC-36 | Form đăng ký hợp lệ với password "abcdefgh" (không có số) | Gửi form đăng ký | Bị từ chối vì mật khẩu thiếu chữ số | R-06 |
| AC-37 | Form đăng ký hợp lệ với password "12345678" (không có chữ) | Gửi form đăng ký | Bị từ chối vì mật khẩu thiếu chữ cái | R-06 |
| AC-38 | Form đăng ký hợp lệ với password "ñandú123" | Gửi form đăng ký | Tài khoản được tạo | R-06 |
| AC-39 | Form đăng ký hợp lệ với password "abc defg1" (có dấu cách) | Gửi form đăng ký | Tài khoản được tạo | R-06 |
| AC-40 | Form đăng ký hợp lệ với password gồm 127 chữ "a" và 1 chữ số "1" (128 ký tự) | Gửi form đăng ký | Tài khoản được tạo | R-06 |
| AC-41 | Form đăng ký hợp lệ với password gồm 128 chữ "a" và 1 chữ số "1" (129 ký tự) | Gửi form đăng ký | Bị từ chối vì mật khẩu quá 128 ký tự | R-06 |
| AC-42 | Form đăng ký hợp lệ với password "ñandú12" nhập ở dạng tách dấu (9 code point, 7 ký tự sau NFC) | Gửi form đăng ký | Bị từ chối vì mật khẩu dưới 8 ký tự | R-06 |
| AC-43 | Tài khoản Active john@example.com đăng ký với password " abcdefg1 " (dấu cách ở đầu và cuối) | Đăng nhập bằng "abcdefg1", rồi bằng " abcdefg1 " | Lần 1 bị từ chối; lần 2 đăng nhập thành công | R-06, R-15 |
| AC-107 | Tài khoản Active john@example.com đăng ký với password "ñandú123" ở dạng dựng sẵn | Đăng nhập bằng "ñandú123" nhập ở dạng tách dấu | Đăng nhập thành công | R-06 |
| AC-44 | Tài khoản Active john@example.com với mật khẩu "Correct1" | Đăng nhập bằng john@example.com / "Correct1" | Đăng nhập thành công | R-15, P-02, F-03 |
| AC-45 | Tài khoản Active john@example.com với mật khẩu "Correct1" | Đăng nhập bằng john@example.com / "Wrong123", rồi bằng nobody@example.com / "Correct1" | Cả hai lần đều bị từ chối với cùng một thông báo, giống từng ký tự | R-15, P-02 |
| AC-46 | Tài khoản Active john@example.com, đăng nhập sai lúc 10:00:00, 10:01:00, 10:02:00, 10:03:00 và 10:04:00 | Đăng nhập đúng mật khẩu lúc 10:18:59 | Bị từ chối với cùng thông báo như AC-45 | R-15 |
| AC-47 | Như AC-46 | Đăng nhập đúng mật khẩu lúc 10:19:00 | Đăng nhập thành công; failedLogins = 0 | R-15 |
| AC-48 | Tài khoản Active john@example.com, 4 lần đăng nhập sai liên tiếp | Đăng nhập đúng, rồi đăng nhập sai 1 lần | Không bị khóa; failedLogins = 1 | R-15 |
| AC-49 | Tài khoản Active john@example.com, đăng nhập sai lúc 10:00:00, 10:01:00, 10:02:00 và 10:03:00 | Đăng nhập sai lần nữa lúc 10:15:00 | Không bị khóa (5 lần sai trải dài đủ 15 phút) | R-15 |
| AC-50 | Như AC-49 | Đăng nhập sai lần nữa lúc 10:14:59 | Tài khoản bị khóa đến 10:29:59 | R-15 |
| AC-108 | Tài khoản Active john@example.com | Đăng nhập sai lúc 10:00:00, 10:10:00, 10:14:00, 10:16:00, 10:17:00, rồi lúc 10:18:00 | Sau lần sai lúc 10:17:00 chưa bị khóa (10:00:00–10:17:00 dài 17 phút); sau lần sai lúc 10:18:00 bị khóa (10:10:00–10:18:00 dài 8 phút) | R-15 |
| AC-51 | Tài khoản john@example.com đang bị khóa đến 10:19:00 | Đặt lại mật khẩu thành "NewPass2" lúc 10:10:00, đăng nhập bằng "NewPass2" lúc 10:11:00 | Đăng nhập thành công | R-07, R-15 |
| AC-52 | Tài khoản Active john@example.com với mật khẩu "OldPass1", link đặt lại gửi lúc 10:00:00 | Mở link lúc 11:00:00 và đặt mật khẩu "NewPass2" | Đăng nhập bằng "NewPass2" thành công; đăng nhập bằng "OldPass1" bị từ chối | R-07, P-03, F-03 |
| AC-53 | john@example.com đang đăng nhập trên điện thoại và máy tính bảng | Đặt lại mật khẩu từ điện thoại | Phiên trên cả điện thoại và máy tính bảng bị đăng xuất; đăng nhập lại cần mật khẩu mới | R-07 |
| AC-54 | Link đặt lại mật khẩu của john@example.com gửi lúc 2026-10-01 10:00:00 | Mở link lúc 2026-10-02 10:00:00 | Link bị từ chối vì hết hiệu lực; mật khẩu không đổi | R-07 |
| AC-55 | john@example.com đã dùng link đặt lại để đổi mật khẩu thành "NewPass2" | Mở lại chính link đó để đặt "Other333" | Bị từ chối; mật khẩu vẫn là "NewPass2" | R-07 |
| AC-56 | Tài khoản Active john@example.com với mật khẩu "OldPass1", link đặt lại còn hiệu lực | Mở link và đặt mật khẩu mới "short1" | Bị từ chối vì mật khẩu dưới 8 ký tự; đăng nhập bằng "OldPass1" vẫn thành công | R-06, R-07 |
| AC-57 | Tài khoản john@example.com ở Deleted | Nhập john@example.com trên màn hình quên mật khẩu | Màn hình hiện cùng thông báo như AC-95; hộp thư john@example.com không nhận email nào | R-07, P-03 |
| AC-58 | Tài khoản john@example.com ở Unconfirmed | Yêu cầu đặt lại, mở link và đặt mật khẩu "NewPass2" | Tài khoản chuyển sang Active | R-07, X-02, F-03 |
| AC-59 | john@example.com nhận link đặt lại A lúc 10:00:00 và link đặt lại B lúc 10:02:00 | Mở link A lúc 10:05:00, rồi mở link B lúc 10:06:00 và đặt "NewPass2" | Link A bị từ chối; link B đổi mật khẩu thành công | R-07 |
| AC-60 | Link đặt lại của john@example.com còn hiệu lực | Mở link trên máy tính để bàn | Trang đặt lại mật khẩu trên website mở ra; đặt "NewPass2" thành công | R-07, R-18 |
| AC-111 | Link đặt lại của john@example.com còn hiệu lực | Mở link trên máy tính bảng có cài app, rồi (với link khác) trên điện thoại chưa cài app | Lần 1 mở trong app; lần 2 mở trang đặt lại trên website | R-07 |
| AC-61 | john@example.com (Active) yêu cầu link đặt lại lúc 11:00:00 và xóa tài khoản lúc 11:05:00 | Mở link đặt lại lúc 11:10:00 và đặt mật khẩu "NewPass2" | Bị từ chối; tài khoản vẫn Deleted | R-07, R-08 |
| AC-62 | Tài khoản Active john@example.com (mật khẩu "Correct1") không có gói, có hồ sơ, 3 ảnh, hồ sơ xác minh và 2 giao dịch thanh toán | Chọn xóa tài khoản, nhập "Correct1" | Tài khoản chuyển sang Deleted; country, city, dateOfBirth, hồ sơ và 3 ảnh bị xóa; hồ sơ xác minh, 2 giao dịch và audit log còn, có name và email của john; đăng nhập bằng john@example.com bị từ chối | R-08, X-04, P-04, F-04 |
| AC-63 | Tài khoản Active john@example.com (mật khẩu "Correct1") không có gói | Chọn xóa tài khoản, nhập "Wrong123" | Bị từ chối; tài khoản vẫn Active; failedLogins tăng thêm 1 | R-08, P-04 |
| AC-64 | Tài khoản Active john@example.com có gói thành viên chưa hủy | Chọn xóa tài khoản, nhập đúng mật khẩu | Bị từ chối; màn hình yêu cầu hủy gói trước; tài khoản vẫn Active | R-08, X-04 |
| AC-65 | Tài khoản Active john@example.com đã hủy gói ngày 2026-11-05, gói còn trong kỳ đến 2026-11-30 | Ngày 2026-11-10 chọn xóa tài khoản, nhập đúng mật khẩu | Tài khoản chuyển sang Deleted | R-08, X-04 |
| AC-66 | john@example.com đang đăng nhập trên điện thoại và máy tính bảng | Xóa tài khoản từ điện thoại | Phiên trên cả hai thiết bị bị đăng xuất | R-08 |
| AC-67 | Tài khoản Active john@example.com | Nhập sai mật khẩu ở màn xóa tài khoản 5 lần trong 3 phút, rồi đăng nhập đúng mật khẩu ở thiết bị khác | Tài khoản bị khóa; đăng nhập bị từ chối; lần xóa thứ 6 cũng bị từ chối | R-08, R-15 |
| AC-109 | Tài khoản Active john@example.com có 4 lần đăng nhập sai liên tiếp và gói chưa hủy | Nhập đúng mật khẩu ở màn xóa tài khoản (bị từ chối vì gói chưa hủy), rồi đăng nhập sai 1 lần | Không bị khóa; failedLogins = 1 | R-08, R-15 |
| AC-68 | Tài khoản john@example.com ở Unconfirmed | Chọn xóa tài khoản, nhập đúng mật khẩu | Bị từ chối; tài khoản vẫn Unconfirmed | R-08 |
| AC-69 | Tài khoản Active john@example.com không có gói | Đăng nhập website, chọn xóa tài khoản, nhập đúng mật khẩu | Tài khoản chuyển sang Deleted | R-08, R-18, F-04 |
| AC-70 | Người dùng đăng ký john@example.com lúc 10:00:00 và mở link xác nhận lúc 10:05:00 | Admin xem audit log | Có bản ghi tạo tài khoản lúc 10:00:00 và bản ghi xác nhận email lúc 10:05:00, cùng thành viên john@example.com | R-09 |
| AC-71 | john@example.com đăng nhập 3 lần, đặt lại mật khẩu lúc 11:00:00 và xóa tài khoản lúc 12:00:00 | Admin xem audit log | Có bản ghi đặt lại mật khẩu lúc 11:00:00 và xóa tài khoản lúc 12:00:00; không có bản ghi đăng nhập | R-09 |
| AC-72 | Tài khoản john@example.com ở Unconfirmed | Đặt lại mật khẩu thành công lúc 2026-10-02 09:00:00 | Audit log có bản ghi xác nhận email và bản ghi đặt lại mật khẩu lúc 09:00:00 | R-09, X-02 |
| AC-73 | Tài khoản Active maria@example.com đổi city lúc 08:00:00 và đổi name lúc 08:10:00; tài khoản anna@example.com đạt mốc 168 giờ lúc 09:00:00, việc dọn chạy lúc 09:04:00 | Admin xem audit log | Có bản ghi sửa city lúc 08:00:00 và sửa name lúc 08:10:00 của maria; có bản ghi hết hạn của anna lúc 09:00:00 có email anna@example.com | R-09, X-03 |
| AC-74 | Tài khoản john@example.com ở Unconfirmed, mật khẩu "Correct1" | Đăng nhập bằng john@example.com / "Correct1" rồi bấm vào bước xác minh danh tính | Đăng nhập thành công; bước xác minh bị từ chối; màn hình duy nhất hiện ra là màn nhắc xác nhận email | R-10, F-01 |
| AC-75 | Tài khoản john@example.com ở Active | Mở bước xác minh danh tính | Bước xác minh danh tính mở ra | R-10, F-01, F-02 |
| AC-76 | Đã có tài khoản Active với email john@example.com | Người khác đăng ký bằng john@example.com | Màn hình hiện "Kiểm tra email để xác nhận" như AC-23; không có tài khoản mới nào được tạo; hộp thư john@example.com nhận 1 email "bạn đã có tài khoản" | R-11, F-01 |
| AC-77 | Đã có tài khoản Active với email john@example.com | Đăng ký bằng " John@Example.COM " | Màn hình hiện "Kiểm tra email để xác nhận"; không có tài khoản mới nào được tạo; hộp thư john@example.com nhận 1 email "bạn đã có tài khoản" | R-11, R-02 |
| AC-78 | Đã có tài khoản Active với email john@example.com | Đăng ký bằng john+1@example.com, các trường khác hợp lệ | Tài khoản mới được tạo cho john+1@example.com | R-11 |
| AC-79 | Tài khoản john@example.com ở Deleted | Đăng ký lại bằng john@example.com | Màn hình hiện "Kiểm tra email để xác nhận"; không có tài khoản mới nào được tạo; hộp thư không nhận email nào | R-11 |
| AC-80 | Tài khoản john@example.com bị xóa năm 2026; năm 2032 mọi bản ghi được giữ lại của john đã hết thời hạn lưu giữ và bị xóa | Đăng ký bằng john@example.com | Không có tài khoản mới nào được tạo | R-11 |
| AC-81 | Chưa có tài khoản nào với email john@example.com | Hai form đăng ký hợp lệ với john@example.com đến cách nhau 50 mili giây | Đúng 1 tài khoản được tạo | R-11 |
| AC-82 | Tài khoản john@example.com ở Unconfirmed, createdAt 2026-10-01 10:00:00, link gửi lại lúc 2026-10-08 09:00:00 | Mở link gửi lại lúc 2026-10-08 09:59:59 | Tài khoản chuyển sang Active | R-16, R-05 |
| AC-83 | Tài khoản john@example.com ở Unconfirmed, createdAt 2026-10-01 10:00:00, link gửi lại lúc 2026-10-08 09:00:00, việc dọn chưa chạy | Mở link gửi lại lúc 2026-10-08 10:00:00 | Link bị từ chối; tài khoản được coi là Expired | R-16, R-05, X-03 |
| AC-84 | Như AC-83 | Một người đăng ký bằng john@example.com lúc 2026-10-08 10:00:00 | Tài khoản mới được tạo cho john@example.com | R-16, R-11 |
| AC-110 | Như AC-83 | Đăng nhập đúng mật khẩu lúc 2026-10-08 10:00:00, rồi yêu cầu gửi lại link và nhập email trên màn quên mật khẩu | Đăng nhập bị từ chối với thông báo chung của R-15; không có email nào được gửi; màn quên mật khẩu hiện thông báo chung của R-14 | R-16 |
| AC-85 | Tài khoản Active maria@example.com với Member.gender = woman | Mở màn hình sửa hồ sơ và màn hình cài đặt tài khoản, gửi yêu cầu đổi Member.gender thành man | Không màn hình nào cho sửa nhánh giới; yêu cầu đổi bị từ chối; Member.gender vẫn là woman | R-12, P-05 |
| AC-86 | Tài khoản Active john@example.com, dateOfBirth 1990-05-01, country Mỹ | Gửi yêu cầu đổi dateOfBirth thành 2010-05-01, rồi yêu cầu đổi country thành Philippines | Cả hai yêu cầu bị từ chối; dateOfBirth và country không đổi | R-17, P-06 |
| AC-87 | Tài khoản Active john@example.com | Gửi yêu cầu đổi email thành john2@example.com | Bị từ chối; email vẫn là john@example.com | R-17, P-10 |
| AC-88 | Tài khoản Active john@example.com, city "Austin" | Đổi city thành "Dallas" | City được lưu là "Dallas" | R-17, P-07 |
| AC-89 | Tài khoản Active john@example.com, city "Austin" | Đổi city thành "   " | Bị từ chối; city vẫn là "Austin" | R-17 |
| AC-90 | Tài khoản john@example.com ở Unconfirmed, city "Austin" | Gửi yêu cầu đổi city thành "Dallas" | Bị từ chối; city vẫn là "Austin" | R-17, P-07 |
| AC-91 | Tài khoản Active maria@example.com, name "Maria Santos" | Đổi name thành "Maria S." | Name được lưu là "Maria S." | R-17, P-09 |
| AC-92 | Tài khoản Active maria@example.com, name "Maria Santos" | Đổi name thành "   " | Bị từ chối; name vẫn là "Maria Santos" | R-17, P-09 |
| AC-93 | Người dùng mở website FilipinaConnect.US | Tìm form đăng ký, và gửi thẳng yêu cầu đăng ký tới website | Website không có form đăng ký; yêu cầu đăng ký bị từ chối | R-18, P-08 |
| AC-94 | Tài khoản Active john@example.com, city "Austin" | Đăng nhập website và đổi city thành "Dallas" | City được lưu là "Dallas" | R-18, R-17 |
| AC-112 | Tài khoản Active maria@example.com, name "Maria Santos" | Đăng nhập website và đổi name thành "Maria S." | Name được lưu là "Maria S." | R-18, R-17 |
| AC-95 | Có tài khoản john@example.com, không có tài khoản nobody@example.com | Nhập john@example.com, sau đó nhập nobody@example.com trên màn hình quên mật khẩu | Nội dung thông báo của hai lần giống hệt nhau từng ký tự; chỉ hộp thư john@example.com nhận được 1 email đặt lại | R-14, R-07, F-03 |
| AC-113 | Tài khoản Active john@example.com có gói chưa hủy, đang đăng nhập trên điện thoại | Admin Cấp cao nhất top1 xóa tài khoản john lúc 10:00:00 với tham chiếu "Email của john ngày 2026-10-01" và lý do "Theo yêu cầu" | Tài khoản Deleted; điện thoại bị đăng xuất; gói Ended; audit có bản ghi xóa tài khoản với người thực hiện top1 lúc 10:00:00 | R-19, R-09, X-05 |
| AC-114 | Tài khoản john@example.com ở Unconfirmed, createdAt 2026-10-01 10:00:00 | top1 xóa tài khoản john lúc 2026-10-03 10:00:00 với tham chiếu và lý do hợp lệ | Tài khoản Deleted; đăng ký lại bằng john@example.com bị từ chối như R-11 | R-19, X-06 |
| AC-115 | Tài khoản john@example.com ở Unconfirmed, createdAt 2026-10-01 10:00:00, việc dọn chưa chạy | top1 xóa tài khoản john lúc 2026-10-08 10:00:00 | Bị từ chối vì tài khoản được coi là Expired | R-19 |
| AC-116 | Tài khoản john@example.com đã Deleted | top1 xóa tài khoản john | Bị từ chối | R-19 |
| AC-117 | Tài khoản Active john@example.com | top1 xóa lúc 10:00:00.050 và top2 xóa lúc 10:00:00.090 | Tài khoản Deleted một lần với người thực hiện top1; lần của top2 bị từ chối | R-19 |

## 9. Non-functional

| Code | Quality | Measure | Target | Source |
| --- | --- | --- | --- | --- |
| N-01 | Độ trễ xử lý mốc hết hạn | Thời gian từ mốc 168 giờ của R-16 đến khi dữ liệu đăng ký của tài khoản Expired bị xóa | ≤ 5 phút | SRC-10#L50, SRC-10#L54 |

## 10. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |
| ASM-01 | Nội dung màn Welcome, Our Story, Our Advice do khách cung cấp (Honda đã đồng ý, SRC-6#L52-L53) | Khách gửi nội dung, trước khi viết DSN |

## 11. Out of scope

- Xác minh danh tính, CENOMAR, background check Certn và huy hiệu xác minh: SPEC-2 (BRIEF-1/C-05, BRIEF-1/C-06, BRIEF-1/C-07, BRIEF-1/C-08).
- Quyền của admin với tài khoản thành viên (xem, đình chỉ, cấm, xóa thay theo R-19): SPEC-8 (SRC-8#L38, BRIEF-1/C-31, BRIEF-1/C-35).
- Hủy gói thành viên trước khi xóa tài khoản, và quản lý gói trên website: SPEC thanh toán (BRIEF-1/C-12, BRIEF-1/C-15).
- Tin nhắn của tài khoản đã xóa: SPEC nhắn tin (BRIEF-1/C-22).
- Số năm lưu giữ dữ liệu sau khi xóa: khách và luật sư quyết định (SRC-6#L31-L32, BRIEF-1/K-08).
- Tải 300 thành viên đồng thời (BRIEF-1/G-02): mục tiêu toàn hệ thống, đo ở DSN.

## Change log

| Version | Date | By | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-09-29 | Honda | Approved |
| 0.2.0 | 2026-09-30 | Honda | Approved revision of 0.1.0 (minor): Admin Cấp cao nhất xóa tài khoản thay thành viên (SRC-25#L33, SPEC-8/R-05) |
