---
id: SPEC-9
title: "Admin: an toàn, nội dung, thanh toán và thông báo"
version: 0.1.0
status: approved
owner: Honda
flow: project
risk: high
review: specs/review/SPEC-9-0.1.0.md
parent: [BRIEF-1@0.1.0]
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:69351c31f30eaaa4e1d097ef
---

# SPEC-9: Admin: an toàn, nội dung, thanh toán và thông báo

<!-- Skyline SPEC (project flow): the exact logic. One row, one fact. Bare codes (R-01) are this SPEC; anything else is qualified (BRIEF-1/C-02). Every rule has a Source and at least one AC. Each unknown becomes a CLARIFY marker; never guess. -->

## 1. Scope

Implements BRIEF-1/C-33, BRIEF-1/C-34, BRIEF-1/C-35, BRIEF-1/C-36, BRIEF-1/C-37 và BRIEF-1/C-38, cùng phần audit log của các thao tác admin này trong BRIEF-1/C-40: xem gói, đặt giá, hoàn tiền, xử lý cờ chargeback và cờ thu tiền muộn; xem yêu cầu, kết nối, tin nhắn và danh sách chặn; hàng chờ và đóng báo cáo; gỡ ảnh và phần giới thiệu; hàng chờ và đóng cờ; từ khóa tiền; bài giáo dục văn hóa và các màn nội dung; thông báo hệ thống. Vai trò admin, đình chỉ, cấm và kháng nghị nằm ở SPEC-8. Các hành vi mới được thêm vào SPEC-3, SPEC-4, SPEC-5, SPEC-6 và SPEC-7 bằng bản sửa đổi đi cùng SPEC-9.

## 2. Glossary

| Code | Term | Definition | Source |
| --- | --- | --- | --- |
| T-01 | Admin trong AC | Các admin mẫu dùng trong mục 8, với vai trò theo SPEC-8/T-02: "admin1", "admin4" giữ vai trò Hỗ trợ, "admin2", "admin5" giữ vai trò Xác minh, "top1", "top2" giữ vai trò Cấp cao nhất, "top3" giữ cả Cấp cao nhất và Xác minh | SRC-24#L20, SRC-24#L33 |
| T-02 | Cờ | Một mục trong hàng chờ cờ, thuộc một trong các loại: cờ đáng ngờ (SPEC-6, dấu hiệu a–d), cờ Failed và cờ "Certn quá 14 ngày" (SPEC-2), cờ chargeback và cờ thu tiền muộn (SPEC-5) | SRC-1#L65, SRC-27#L32, SRC-27#L43 |
| T-03 | Cuộc trò chuyện liên quan | Với một báo cáo Open: cuộc trò chuyện giữa người báo cáo và người bị báo cáo; với một cờ đáng ngờ Open dấu hiệu (a): các cuộc trò chuyện giữa tài khoản bị gắn cờ và những người có báo cáo đã tạo ra cờ; với dấu hiệu (b), (c) hoặc (d): các cuộc trò chuyện chứa tin nhắn đã tạo ra cờ | SRC-27#L26, SRC-28#L25, SRC-28#L45 |
| T-04 | Văn bản nội dung | Một trong các văn bản: Our Story, Our Advice (SPEC-1), nội dung màn giáo dục an toàn kể cả phần cảnh báo lừa đảo trên màn đó (SPEC-6/R-11), và câu cảnh báo lừa đảo hiện dưới tin nhắn (SPEC-6/R-09, SPEC-6/R-10) | SRC-3#L23-L26, SRC-27#L37, SRC-28#L34, SRC-28#L45 |
| T-05 | Thông báo hệ thống | Thông báo do admin soạn và gửi cho một nhóm thành viên | BRIEF-1/C-38, SRC-1#L65, SRC-27#L38-L39 |
| T-06 | Người nhận hợp lệ | Thành viên có tài khoản Active (SPEC-1) và tình trạng tài khoản Good (SPEC-8) | SRC-27#L38, SRC-27#L43 |

## 3. Data

| Code | Field | Type | Required | Constraint | Source |
| --- | --- | --- | --- | --- | --- |
| DF-01 | ReportResolution | báo cáo, kết quả enum {Không vi phạm, Có vi phạm}, ghi chú không chỉ gồm ký tự trắng, admin, thời điểm UTC | khi đóng báo cáo | R-12 | SRC-27#L29 |
| DF-02 | FlagClosure | cờ, admin, lý do không chỉ gồm ký tự trắng, thời điểm UTC; với cờ thu tiền muộn thêm cách xử lý enum {Hoàn tiền, Kích hoạt lại} | khi đóng cờ | R-05, R-06, R-15 | SRC-27#L22-L23, SRC-27#L32 |
| DF-03 | ContentRemoval | thành viên, loại enum {ảnh, phần giới thiệu}, ảnh bị gỡ (khi loại là ảnh), bản gốc của nội dung bị gỡ (chỉ admin xem được), admin, lý do không chỉ gồm ký tự trắng, thời điểm UTC | khi gỡ | R-13 | SRC-27#L30, SRC-28#L35 |
| DF-04 | Lesson | tiêu đề 1–200 ký tự và nội dung 1–20.000 ký tự, đếm theo NFC, cả hai không chỉ gồm ký tự trắng; nội dung với định dạng đậm, nghiêng, danh sách và link; 0–3 ảnh JPG, PNG hoặc HEIC, mỗi ảnh ≤ 10 MB (10.485.760 byte); thứ tự hiển thị | yes | R-17 | SRC-27#L35, SRC-28#L32, SRC-20#L41 |
| DF-05 | Lesson.status | enum {Draft, Published, Unpublished, Deleted} | yes, mặc định Draft | máy trạng thái Lesson | SRC-27#L35, SRC-28#L32 |
| DF-06 | ContentPage | văn bản nội dung (T-04), văn bản tiếng Anh 1–20.000 ký tự đếm theo NFC, admin sửa gần nhất, thời điểm UTC | yes | R-19 | SRC-27#L37, SRC-28#L34 |
| DF-07 | SystemNotification | tiêu đề 1–100 ký tự và nội dung 1–1000 ký tự đếm theo NFC; nhóm nhận enum {Tất cả, Nam, Nữ}; kênh (trong app luôn có, push và email tùy chọn); admin; thời điểm UTC gửi; danh sách người nhận chốt lúc admin xác nhận gửi; đã gửi hay chưa (mỗi bản soạn gửi tối đa một lần) | khi soạn | R-20, R-21 | SRC-27#L38-L39, SRC-20#L41, SRC-28#L33 |
| DF-08 | ConversationAccess | admin, cuộc trò chuyện, loại enum {xem, xuất}, lý do (bắt buộc khi admin Cấp cao nhất xem cuộc trò chuyện không phải cuộc trò chuyện liên quan, và mọi lần xuất), thời điểm UTC | khi admin mở hoặc xuất | R-09 | SRC-27#L26, SRC-28#L26 |

## 4. States

| Code | Machine | State | Kind |
| --- | --- | --- | --- |
| S-01 | Lesson | Draft | initial |
| S-02 | Lesson | Published | normal |
| S-03 | Lesson | Unpublished | normal |
| S-04 | Lesson | Deleted | terminal |

| Code | From | Event | Guard | To | Rules |
| --- | --- | --- | --- | --- | --- |
| X-01 | S-01 | publish | | S-02 | R-17, R-22 |
| X-02 | S-02 | unpublish | R-18 | S-03 | R-18, R-22 |
| X-03 | S-03 | publish | | S-02 | R-17, R-22 |
| X-04 | S-01 | delete | | S-04 | R-17, R-22 |

## 5. Rules

| Code | Rule | Source |
| --- | --- | --- |
| R-01 | Mỗi thao tác trong SPEC này chỉ được làm khi admin giữ vai trò có quyền đó theo mục 6 và SPEC-8/R-01; thao tác không đủ vai trò bị từ chối; thành viên không làm được thao tác nào trong SPEC này | SRC-1#L64-L65, SRC-24#L20, SRC-24#L33, SRC-27#L19-L39, SRC-27#L43 |
| R-02 | Admin Hỗ trợ hoặc Cấp cao nhất xem được các Subscription, Payment và Refund (SPEC-5) của một thành viên; không admin nào thấy số thẻ thanh toán | SRC-1#L64, SRC-27#L19, SRC-27#L43, BRIEF-1/C-33 |
| R-03 | Chỉ admin Cấp cao nhất đặt được giá USD cho từng thời hạn 1 tháng, 3 tháng và 12 tháng; mỗi giá từ 1,00 đến 9.999,99 USD với tối đa 2 chữ số lẻ, giá khác thì từ chối; giá mới áp dụng cho các lần mua mà nam bấm thanh toán sau lúc lưu và các lần đổi thời hạn được ghi sau lúc lưu; lần mua đã bấm thanh toán trước lúc lưu vẫn trả và chốt giá cũ (SPEC-5 bản sửa đổi); Subscription đang chạy giữ lockedPrice (SPEC-5/R-04) | SRC-17#L20, SRC-17#L36, SRC-24#L20, SRC-27#L20, SRC-27#L43, SRC-28#L31, SRC-28#L45, BRIEF-1/C-33 |
| R-04 | Chỉ admin Cấp cao nhất hoàn tiền được một Payment chưa bị chargeback, kèm lý do không chỉ gồm ký tự trắng; số tiền có tối đa 2 chữ số lẻ, từ 0,01 USD tới phần còn lại, với phần còn lại là số tiền cộng thuế của Payment trừ tổng các lần hoàn đã được bộ xử lý xác nhận và các lần hoàn đang chờ xác nhận; lần hoàn bị bộ xử lý từ chối không bị trừ và admin hoàn lại được; số tiền nhỏ hơn 0,01 USD, lớn hơn phần còn lại hoặc có hơn 2 chữ số lẻ, hay Payment đã bị chargeback, thì từ chối; hoàn được cả khi tài khoản của nam đã bị xóa hoặc bị cấm; hiệu lực của hoàn tiền theo SPEC-5/R-06 | SRC-17#L23, SRC-18#L31, SRC-24#L20, SRC-27#L21, SRC-27#L43, SRC-28#L29-L30, SRC-28#L45, BRIEF-1/C-33 |
| R-05 | Chỉ admin Cấp cao nhất đóng được cờ chargeback, kèm lý do không chỉ gồm ký tự trắng; khi cờ đóng, PurchaseBlock của cờ đó hết và nam mua lại được theo SPEC-5/R-02; không có lựa chọn giữ PurchaseBlock khi đóng cờ; muốn nam không mua lại được thì admin cấm tài khoản theo SPEC-8 | SRC-17#L25, SRC-18#L22, SRC-27#L22, SRC-27#L43 |
| R-06 | Chỉ admin Cấp cao nhất xử lý được cờ thu tiền muộn, kèm lý do không chỉ gồm ký tự trắng, bằng một trong hai cách: (a) hoàn toàn phần Payment thu muộn theo R-04, cờ đóng khi bộ xử lý xác nhận lần hoàn đó và vẫn Open nếu lần hoàn bị từ chối; (b) kích hoạt lại gói theo SPEC-5 bản sửa đổi khi đủ điều kiện (bảng quyết định R-06), cờ đóng ngay; không đủ điều kiện thì (b) bị từ chối; khi Payment thu muộn đã được hoàn toàn phần hoặc đã bị chargeback thì cả (a) và (b) bị từ chối và admin chỉ đóng cờ kèm lý do; khi hai admin cùng xử lý một cờ, lần được ghi trước thắng và lần sau bị từ chối; khi một lần mua của chính nam được bộ xử lý xác nhận trước lúc việc kích hoạt lại được ghi thì kích hoạt lại bị từ chối (SPEC-5 bản sửa đổi) | SRC-17#L24, SRC-18#L23, SRC-27#L23, SRC-27#L43, SRC-28#L28, SRC-28#L30, SRC-28#L45 |
| R-07 | Admin không hủy, không bật lại tự gia hạn và không đổi thời hạn gói thay nam; nam tự làm trên website (SPEC-5/R-10) | SRC-18#L36, SRC-27#L24, SRC-27#L43 |
| R-08 | Admin Hỗ trợ hoặc Cấp cao nhất xem được danh sách yêu cầu liên hệ và kết nối của một thành viên, gồm trạng thái, các thời điểm và người kết thúc (SPEC-4); không admin nào hủy yêu cầu hay kết thúc kết nối; khi cần can thiệp, admin đình chỉ hoặc cấm theo SPEC-8 | SRC-1#L64, SRC-16#L32, SRC-27#L25, SRC-27#L43, BRIEF-1/C-34 |
| R-09 | Admin Hỗ trợ xem được một cuộc trò chuyện chỉ khi đó là cuộc trò chuyện liên quan (T-03) tới một báo cáo hoặc cờ đáng ngờ đang Open; admin Cấp cao nhất xem được cuộc trò chuyện liên quan mà không cần lý do, và xem được bất kỳ cuộc trò chuyện nào khác khi ghi lý do không chỉ gồm ký tự trắng; chỉ admin Cấp cao nhất xuất được một cuộc trò chuyện ra tệp CSV, lần nào cũng phải ghi lý do không chỉ gồm ký tự trắng; tệp CSV gồm mọi tin của cuộc trò chuyện, mỗi tin có email người gửi, nội dung và thời điểm UTC; không admin nào sửa hay xóa được tin nhắn | SRC-15#L30, SRC-16#L32, SRC-27#L26, SRC-27#L43, SRC-28#L26, SRC-28#L45, BRIEF-1/K-07 |
| R-10 | Admin Hỗ trợ hoặc Cấp cao nhất xem được mọi Block (SPEC-6), cả Active và Removed, của mọi thành viên theo cả hai chiều (những người thành viên đó chặn, và những người chặn thành viên đó), mỗi mục kèm thời điểm chặn và, nếu đã bỏ, thời điểm bỏ chặn; không admin nào gỡ được chặn; chỉ người chặn bỏ chặn (SPEC-6/R-03) | SRC-1#L64, SRC-16#L32, SRC-20#L24, SRC-27#L27, SRC-27#L43, SRC-28#L27, SRC-28#L45 |
| R-11 | Admin Hỗ trợ hoặc Cấp cao nhất xem được hàng chờ báo cáo gồm các báo cáo Open (SPEC-6), xếp theo thời điểm tạo cũ nhất trước, bằng nhau thì theo mã báo cáo tăng dần; mỗi mục hiện lý do, mô tả, bản sao nội dung, người báo cáo và người bị báo cáo; báo cáo không bị khóa khi một admin đang mở | SRC-1#L171, SRC-19#L23, SRC-27#L28, SRC-27#L43, BRIEF-1/C-35 |
| R-12 | Admin Hỗ trợ hoặc Cấp cao nhất đóng được một báo cáo Open, bắt buộc chọn kết quả "Không vi phạm" hoặc "Có vi phạm" và ghi chú không chỉ gồm ký tự trắng; thiếu kết quả hoặc ghi chú thì từ chối; đóng một báo cáo đã Closed thì từ chối; khi hai admin cùng đóng một báo cáo, lần được ghi trước thắng và lần sau bị từ chối; đóng báo cáo không tự gỡ nội dung, đình chỉ hay cấm; người báo cáo và người bị báo cáo không được báo kết quả (SPEC-6/R-06) | SRC-19#L23, SRC-27#L28-L29, SRC-27#L43, BRIEF-1/C-35 |
| R-13 | Admin Hỗ trợ hoặc Cấp cao nhất gỡ được một ảnh hồ sơ hoặc phần giới thiệu (bio) hiện có của một thành viên, kèm lý do không chỉ gồm ký tự trắng; gỡ nội dung không còn tồn tại (ảnh đã bị xóa, bio đã trống) thì từ chối; việc gỡ không hoàn tác được, thành viên tải ảnh mới hoặc viết lại bio; bản gốc bị gỡ được lưu và chỉ admin xem được; khi việc gỡ và việc thành viên tự xóa hay sửa cùng nội dung đó đến cùng lúc, thao tác được ghi trước thắng; hậu quả lên hồ sơ theo SPEC-3 bản sửa đổi; tin nhắn không gỡ được; bản sao nội dung trong các báo cáo vẫn được giữ; thành viên nhận thông báo nội dung bị gỡ theo SPEC-7 bản sửa đổi, không nêu người báo cáo | SRC-12#L30, SRC-27#L30-L31, SRC-27#L43, SRC-28#L35, SRC-28#L45, BRIEF-1/C-35 |
| R-14 | Hàng chờ cờ gồm các cờ Open của các loại ở T-02; mỗi admin chỉ thấy các loại cờ mình đóng được (cờ đáng ngờ: Hỗ trợ và Cấp cao nhất; cờ Failed và cờ "Certn quá 14 ngày": Xác minh; cờ chargeback và cờ thu tiền muộn: Cấp cao nhất); xếp theo thời điểm tạo cũ nhất trước, bằng nhau thì theo loại theo thứ tự cờ đáng ngờ, cờ xác minh, cờ thanh toán, rồi theo mã cờ tăng dần; cờ của thành viên đang bị đình chỉ vẫn hiện, có ghi rõ đang bị đình chỉ; mỗi cờ đáng ngờ hiện các báo cáo hoặc tin nhắn đã tạo ra nó | SRC-1#L65, SRC-27#L32, SRC-27#L43, SRC-28#L23-L24, SRC-28#L45, BRIEF-1/C-36 |
| R-15 | Đóng cờ bắt buộc lý do không chỉ gồm ký tự trắng; cờ đáng ngờ do admin Hỗ trợ hoặc Cấp cao nhất đóng; cờ Failed và cờ "Certn quá 14 ngày" (SPEC-2) do admin giữ vai trò Xác minh đóng; cờ chargeback và cờ thu tiền muộn chỉ đóng theo R-05 và R-06; đóng cờ đã Closed thì từ chối; khi hai admin cùng đóng một cờ, lần được ghi trước thắng; đóng cờ không tự đình chỉ, cấm hay đổi kết quả xác minh (cờ Failed đóng thì BackgroundCheck vẫn Failed) | SRC-19#L28, SRC-28#L28, SRC-24#L28, SRC-27#L22-L23, SRC-27#L32, SRC-27#L43, BRIEF-1/C-36 |
| R-16 | Chỉ admin Cấp cao nhất thêm hoặc bớt được từ khóa tiền (SPEC-6); mỗi từ khóa, sau khi bỏ ký tự trắng đầu cuối, có 1–50 ký tự đếm theo NFC và không trùng với từ khóa đã có khi không phân biệt kiểu chữ; sai thì từ chối; bớt từ khóa cuối cùng thì từ chối (danh sách luôn còn ít nhất 1 từ khóa); thay đổi áp dụng cho tin gửi sau lúc lưu, tin đã gửi không được xét lại (SPEC-6 bản sửa đổi) | SRC-20#L20, SRC-27#L34, SRC-27#L43, SRC-28#L39, SRC-28#L45, BRIEF-1/C-35 |
| R-17 | Chỉ admin Cấp cao nhất tạo, sửa, xuất bản, gỡ, xóa và sắp thứ tự bài giáo dục văn hóa; bài mới ở Draft; bài không đúng DF-04 thì từ chối lưu; không có video; bài Unpublished xuất bản lại được; mỗi lần xuất bản, bài được đặt cuối thứ tự cho tới khi admin sắp lại; chỉ bài Draft (chưa từng xuất bản) xóa được; xuất bản một bài đang Published, gỡ một bài không Published, hay xóa một bài không phải Draft thì từ chối; thành viên chỉ thấy bài Published, theo thứ tự admin sắp | SRC-12#L27, SRC-27#L35, SRC-27#L43, SRC-28#L32, SRC-28#L45, BRIEF-1/C-37 |
| R-18 | Gỡ một bài Published bị từ chối khi đó là bài Published duy nhất, kể cả khi hai lần gỡ đến cùng lúc (luôn còn ít nhất một bài Published); sửa một bài Published có hiệu lực ngay và không bắt thành viên mở lại bài đó; bài đã gỡ không còn tính vào điều kiện mở hết các bài của SPEC-3/R-11; bài bị gỡ rồi xuất bản lại thì lần thành viên đã mở trước đó vẫn được tính; thành viên đã hoàn tất giáo dục văn hóa vẫn giữ hoàn tất (SPEC-3 bản sửa đổi) | SRC-27#L36, SRC-27#L43, SRC-28#L22, SRC-28#L45, BRIEF-1/C-37 |
| R-19 | Chỉ admin Cấp cao nhất sửa được các văn bản nội dung (T-04); mỗi văn bản 1–20.000 ký tự đếm theo NFC; thay đổi có hiệu lực ngay và mọi lần hiện sau đó dùng văn bản mới, kể cả câu cảnh báo dưới các tin nhắn đã gửi trước đó; không thành viên nào phải bấm lại "Tôi đã hiểu" (SPEC-6/R-11); danh sách mục tiêu quan hệ và danh sách sở thích (SPEC-3) không sửa được trên website admin | SRC-27#L37, SRC-27#L43, SRC-28#L34, SRC-28#L45, BRIEF-1/C-37 |
| R-20 | Chỉ admin Cấp cao nhất gửi được thông báo hệ thống, cho một nhóm nhận: tất cả thành viên, chỉ nam hoặc chỉ nữ; trước khi gửi, màn hình hỏi xác nhận "Gửi tới N người?" với N là số người nhận; người nhận là các thành viên của nhóm là người nhận hợp lệ (T-06) tại lúc admin xác nhận gửi, danh sách được chốt lúc đó; tài khoản tạo sau, hoặc trở lại hợp lệ sau lúc đó, không nhận; nhóm có 0 người nhận thì từ chối gửi; không gửi được cho một thành viên riêng lẻ | SRC-1#L65, SRC-27#L38, SRC-27#L43, SRC-28#L33, SRC-28#L45, BRIEF-1/C-38 |
| R-21 | Thông báo hệ thống có tiêu đề 1–100 ký tự và nội dung 1–1000 ký tự, không chỉ gồm ký tự trắng; nội dung viết bằng tiếng Anh (SPEC-7/R-12) là hướng dẫn cho admin, hệ thống không kiểm tra ngôn ngữ; luôn tạo thông báo trong app; push (hiện tiêu đề) và email được gửi thêm khi admin chọn lúc soạn; gửi ngay khi admin xác nhận gửi, không hẹn giờ; mỗi bản soạn chỉ gửi được một lần, bấm gửi lặp lại không gửi thêm; không sửa hay thu hồi được sau khi gửi; thành viên bấm vào thì mở màn chi tiết thông báo; công tắc push của SPEC-7/R-04 không áp dụng; thời gian tới người nhận theo SPEC-7 bản sửa đổi | SRC-27#L39, SRC-27#L43, SRC-28#L33, SRC-28#L40, SRC-28#L45, BRIEF-1/C-38 |
| R-22 | Mọi thao tác của admin trong SPEC này được ghi audit log theo SPEC-8/R-16, kể cả mở xem một báo cáo, một cuộc trò chuyện, một danh sách chặn và các thao tác bị từ chối; bản ghi đặt giá có giá cũ và giá mới; bản ghi xem hoặc xuất cuộc trò chuyện có lý do nếu có | SRC-1#L182, SRC-1#L265-L266, SRC-27#L20, SRC-27#L41, SRC-27#L43, BRIEF-1/C-40 |

<!-- decision: R-06 -->
| C: Payment thu muộn chưa hoàn toàn phần và chưa bị chargeback | C: Huy hiệu xanh | C: Không có gói còn hiệu lực | C: Không có PurchaseBlock | C: Tài khoản Active và tình trạng Good | A: Kích hoạt lại |
| --- | --- | --- | --- | --- | --- |
| Y | Y | Y | Y | Y | cho phép |
| N | - | - | - | - | từ chối |
| Y | N | - | - | - | từ chối |
| Y | Y | N | - | - | từ chối |
| Y | Y | Y | N | - | từ chối |
| Y | Y | Y | Y | N | từ chối |

## 6. Permissions

<!-- Columns after Action are actors: BRIEF-n/A-nn. Cells: Y, N, or a rule code (R-nn) meaning "allowed when that rule holds". -->

| Code | Action | BRIEF-1/A-01 Nam Mỹ | BRIEF-1/A-02 Nữ Philippines | BRIEF-1/A-03 Admin |
| --- | --- | --- | --- | --- |
| P-01 | Xem gói, Payment và Refund của một thành viên | N | N | R-02 |
| P-02 | Đặt giá | N | N | R-03 |
| P-03 | Hoàn tiền | N | N | R-04 |
| P-04 | Đóng cờ chargeback | N | N | R-05 |
| P-05 | Xử lý cờ thu tiền muộn | N | N | R-06 |
| P-06 | Hủy, bật lại hoặc đổi thời hạn gói thay nam | N | N | N |
| P-07 | Xem yêu cầu và kết nối của một thành viên | N | N | R-08 |
| P-08 | Hủy yêu cầu, kết thúc kết nối hoặc gỡ chặn thay thành viên | N | N | N |
| P-09 | Xem một cuộc trò chuyện của người khác | N | N | R-09 |
| P-10 | Xuất một cuộc trò chuyện ra CSV | N | N | R-09 |
| P-11 | Sửa hoặc xóa tin nhắn của thành viên | N | N | N |
| P-12 | Xem danh sách chặn của một thành viên khác | N | N | R-10 |
| P-13 | Xem hàng chờ báo cáo | N | N | R-11 |
| P-14 | Đóng báo cáo | N | N | R-12 |
| P-15 | Gỡ ảnh hoặc phần giới thiệu của thành viên | N | N | R-13 |
| P-16 | Xem hàng chờ cờ | N | N | R-14 |
| P-17 | Đóng cờ đáng ngờ, cờ Failed và cờ "Certn quá 14 ngày" | N | N | R-15 |
| P-18 | Thêm hoặc bớt từ khóa tiền | N | N | R-16 |
| P-19 | Quản lý bài giáo dục văn hóa | N | N | R-17 |
| P-20 | Sửa văn bản nội dung | N | N | R-19 |
| P-21 | Gửi thông báo hệ thống | N | N | R-20 |

## 7. Flows

### F-01 Xử lý báo cáo

1. Admin Hỗ trợ mở hàng chờ báo cáo và chọn báo cáo đứng đầu (R-11, R-22).
2. Admin xem cuộc trò chuyện liên quan nếu cần (R-09).
3. Nếu nội dung vi phạm, admin gỡ ảnh hoặc phần giới thiệu, hoặc đình chỉ theo SPEC-8 (R-13).
4. Admin đóng báo cáo với kết quả và ghi chú (R-12).

Nhánh lỗi:

- 1a. Admin chỉ có vai trò Xác minh → từ chối (R-01).
- 4a. Một admin khác đã đóng báo cáo trước → từ chối (R-12).

### F-02 Xử lý cờ thanh toán

1. Admin Cấp cao nhất mở hàng chờ cờ (R-14).
2. Cờ chargeback: đóng kèm lý do → PurchaseBlock hết (R-05).
3. Cờ thu tiền muộn: chọn hoàn tiền hoặc kích hoạt lại, kèm lý do → cờ đóng (R-06).

Nhánh lỗi:

- 3a. Nam không đủ điều kiện kích hoạt lại → từ chối; chỉ còn hoàn tiền (R-06).

### F-03 Bài giáo dục văn hóa

1. Admin Cấp cao nhất tạo bài ở Draft (R-17).
2. Xuất bản → thành viên thấy bài (X-01).
3. Sửa bài đang xuất bản; không ai phải mở lại (R-18).
4. Gỡ bài → Unpublished; xuất bản lại khi cần (X-02, X-03).

Nhánh lỗi:

- 4a. Bài là bài Published duy nhất → từ chối (R-18).

### F-04 Thông báo hệ thống

1. Admin Cấp cao nhất soạn tiêu đề, nội dung, chọn nhóm nhận và kênh (R-20, R-21).
2. Bấm gửi → danh sách người nhận được chốt; thông báo trong app, và push, email nếu đã chọn (R-20, R-21).

Nhánh lỗi:

- 1a. Tiêu đề hoặc nội dung sai độ dài → từ chối (R-21).

## 8. Acceptance criteria

Mọi thời điểm trong mục này là UTC.

| Code | Given | When | Then | Covers |
| --- | --- | --- | --- | --- |
| AC-01 | admin5 chỉ có vai trò Xác minh | admin5 mở hàng chờ báo cáo, rồi đặt giá 1 tháng 59,00 USD | Cả hai bị từ chối | R-01, P-13, P-02, F-01 |
| AC-02 | Thành viên john@example.com | john gửi tới website admin yêu cầu mở hàng chờ báo cáo, mở hàng chờ cờ, xem yêu cầu và kết nối của maria, gỡ ảnh của maria và gửi thông báo hệ thống | Cả năm bị từ chối | R-01, P-13, P-16, P-07, P-15, P-21 |
| AC-03 | john có Subscription Active 3 tháng, 2 Payment 129,00 USD và 1 Refund 20,00 USD | admin1 mở trang gói của john | admin1 thấy Subscription, 2 Payment và 1 Refund; không có số thẻ | R-02, P-01 |
| AC-04 | Như AC-03 | admin5 mở trang gói của john, rồi danh sách yêu cầu và kết nối của john | Cả hai bị từ chối | R-02, R-08, P-01, P-07 |
| AC-05 | Giá 1 tháng 49,00 USD; john có Subscription Active 1 tháng, lockedPrice 49,00 USD, periodEnd 11:00:00 | peter bấm thanh toán gói 1 tháng lúc 09:59:50; top1 đặt giá 1 tháng 59,00 USD lúc 10:00:00; bộ xử lý xác nhận lần mua của peter lúc 10:00:30; paul bấm thanh toán gói 1 tháng lúc 10:05:00; john được gia hạn lúc 11:00:00 | peter trả 49,00 USD với lockedPrice 49,00; paul trả 59,00 USD; john trả 49,00 USD; audit có bản ghi đặt giá với giá cũ 49,00 và giá mới 59,00 | R-03, R-22, P-02 |
| AC-06 | top1 | Đặt giá 1 tháng lần lượt 0,99; 1,00; 9.999,99; 10.000,00; 12,345 USD | 0,99, 10.000,00 và 12,345 bị từ chối; 1,00 và 9.999,99 được lưu | R-03 |
| AC-07 | admin1 chỉ có vai trò Hỗ trợ | admin1 đặt giá 1 tháng 59,00 USD | Bị từ chối | R-03, P-02 |
| AC-08 | Payment 49,00 USD (thuế 0) của john; một lần hoàn 30,00 USD đang chờ bộ xử lý xác nhận | top1 hoàn 19,01 USD, rồi 19,00 USD, lý do "Theo Refund Policy" | 19,01 bị từ chối; 19,00 được gửi tới bộ xử lý thanh toán | R-04, P-03 |
| AC-09 | Payment 49,00 USD của john | top1 hoàn 0,00 USD, rồi hoàn 10,00 USD với lý do "   " | Cả hai bị từ chối | R-04 |
| AC-10 | Tài khoản john đã Deleted; Payment 49,00 USD | top1 hoàn 49,00 USD với lý do "Khiếu nại qua email" | Lần hoàn được gửi tới bộ xử lý thanh toán | R-04 |
| AC-11 | Payment 49,00 USD của john | admin1 hoàn 10,00 USD | Bị từ chối | R-04, P-03 |
| AC-12 | john có cờ chargeback Open và PurchaseBlock của cờ đó; john có huy hiệu xanh | top1 đóng cờ với lý do "Ngân hàng xác nhận nhầm", rồi john mua gói 1 tháng | Cờ Closed; PurchaseBlock hết; john mua được gói | R-05, P-04, F-02 |
| AC-13 | Như AC-12 | admin1 đóng cờ | Bị từ chối; cờ vẫn Open; john vẫn không mua được | R-05, P-04 |
| AC-14 | john có cờ thu tiền muộn cho Payment 129,00 USD (3 tháng) của một Subscription đã Ended; john có huy hiệu xanh, không có gói còn hiệu lực, không có PurchaseBlock, tài khoản Active, tình trạng Good | top1 chọn kích hoạt lại lúc 2026-11-01 10:00:00 với lý do "Khách trả muộn" | Có Subscription mới Active, 3 tháng, lockedPrice 129,00 USD, periodStart 2026-11-01 10:00:00, periodEnd 2027-02-01 10:00:00; cờ Closed | R-06, P-05, F-02 |
| AC-15 | Như AC-14, nhưng tài khoản john đang bị đình chỉ | top1 chọn kích hoạt lại; rồi chọn hoàn tiền với lý do "Không kích hoạt được"; bộ xử lý xác nhận lần hoàn lúc 10:05:00 | Kích hoạt lại bị từ chối; cờ vẫn Open cho tới 10:05:00, rồi Closed | R-06 |
| AC-16 | Như AC-14, nhưng john đã mua một gói mới đang Active | top1 chọn kích hoạt lại | Bị từ chối | R-06 |
| AC-17 | Như AC-14, nhưng john không còn huy hiệu xanh | top1 chọn kích hoạt lại | Bị từ chối | R-06 |
| AC-18 | Như AC-14, nhưng john có PurchaseBlock do một chargeback khác | top1 chọn kích hoạt lại | Bị từ chối | R-06 |
| AC-19 | Như AC-14 | admin1 chọn hoàn tiền cho cờ | Bị từ chối; cờ vẫn Open | R-06, P-05 |
| AC-20 | john có Subscription Active | top1 hủy gói thay john, rồi đổi thời hạn thay john | Cả hai bị từ chối; Subscription vẫn Active | R-07, P-06 |
| AC-21 | john gửi yêu cầu tới maria lúc 09:00:00 (Pending); kết nối john–anna Ended do anna kết thúc lúc 10:00:00 | admin1 mở danh sách yêu cầu và kết nối của john | Thấy yêu cầu tới maria Pending, gửi lúc 09:00:00; kết nối với anna Ended, người kết thúc anna, lúc 10:00:00 | R-08, P-07 |
| AC-22 | Như AC-21; john và lisa có kết nối Open; maria đang chặn john | top1 hủy yêu cầu tới maria, kết thúc kết nối john–lisa, rồi gỡ chặn của maria với john | Cả ba bị từ chối; yêu cầu vẫn Pending, kết nối vẫn Open, Block vẫn Active | R-08, R-10, P-08 |
| AC-23 | maria báo cáo một tin nhắn của john; báo cáo Open; john và lisa có cuộc trò chuyện không liên quan tới báo cáo hay cờ nào | admin1 mở cuộc trò chuyện john–maria, rồi cuộc trò chuyện john–lisa | Lần đầu mở được; lần hai bị từ chối | R-09, P-09, F-01 |
| AC-24 | Như AC-23, báo cáo đã Closed | admin1 mở cuộc trò chuyện john–maria | Bị từ chối | R-09 |
| AC-25 | john có cờ đáng ngờ Open dấu hiệu (d) do 3 tin nhắc tới tiền trong cuộc trò chuyện john–lisa; cuộc trò chuyện john–kim không có tin nào tạo ra cờ | admin1 mở cuộc trò chuyện john–lisa, rồi john–kim | Lần đầu mở được; lần hai bị từ chối | R-09 |
| AC-26 | Cuộc trò chuyện john–maria có 3 tin | top1 xuất CSV với lý do "Yêu cầu của luật sư" | Tệp CSV có 3 tin, mỗi tin có email người gửi, nội dung và thời điểm; audit có bản ghi xuất với lý do "Yêu cầu của luật sư" | R-09, R-22, P-10 |
| AC-27 | Như AC-23 | top1 xuất cuộc trò chuyện john–maria không ghi lý do; admin1 xuất cuộc trò chuyện đó | Cả hai bị từ chối | R-09, P-10 |
| AC-28 | Cuộc trò chuyện john–maria có 3 tin | top1 sửa một tin, rồi xóa một tin | Cả hai bị từ chối; vẫn đủ 3 tin với nội dung cũ | R-09, P-11 |
| AC-29 | john chặn maria lúc 09:00:00; lisa chặn john lúc 10:00:00; anna chặn john lúc 07:00:00 và bỏ chặn lúc 08:00:00 | admin1 mở danh sách chặn của john | Thấy 3 mục: john chặn maria lúc 09:00:00 (Active); lisa chặn john lúc 10:00:00 (Active); anna chặn john lúc 07:00:00, bỏ chặn lúc 08:00:00 (Removed) | R-10, P-12 |
| AC-30 | Như AC-29 | admin5 mở danh sách chặn của john | Bị từ chối | R-10, P-12 |
| AC-31 | Báo cáo Open #12 tạo lúc 09:00:00, #10 tạo lúc 10:00:00, #11 tạo lúc 09:00:00; báo cáo #9 Closed | admin1 mở hàng chờ báo cáo | Thứ tự #11, #12, #10; không có #9; mỗi mục có lý do, mô tả, bản sao nội dung, người báo cáo và người bị báo cáo | R-11, P-13, F-01 |
| AC-32 | admin1 đang mở báo cáo #11 | admin4 mở báo cáo #11 | admin4 mở được; không có khóa | R-11 |
| AC-33 | Báo cáo #11 Open về một ảnh của john | admin1 đóng với kết quả "Có vi phạm" và ghi chú "Ảnh khỏa thân" | Báo cáo Closed; ảnh vẫn còn trên hồ sơ john; tình trạng john vẫn Good; người báo cáo và john không nhận thông báo nào | R-12, P-14, F-01 |
| AC-34 | Báo cáo #11 Open | admin1 đóng không chọn kết quả, rồi với kết quả "Không vi phạm" và ghi chú "   " | Cả hai bị từ chối; báo cáo vẫn Open | R-12 |
| AC-35 | Báo cáo #11 Open | admin1 đóng lúc 10:00:00.050 và admin4 đóng lúc 10:00:00.090 | Báo cáo Closed với admin1; lần của admin4 bị từ chối | R-12 |
| AC-36 | Báo cáo #11 Open | admin5 đóng báo cáo | Bị từ chối | R-12, P-14 |
| AC-37 | maria có hồ sơ hoàn chỉnh với 2 ảnh; báo cáo Open về ảnh thứ nhất có bản sao ảnh đó | admin1 gỡ ảnh thứ nhất với lý do "Ảnh khỏa thân" | Ảnh không còn hiện với ai; hồ sơ maria vẫn hoàn chỉnh; maria nhận thông báo trong app và email nội dung bị gỡ, không nêu người báo cáo; bản sao ảnh trong báo cáo vẫn còn | R-13, P-15, F-01 |
| AC-38 | maria có hồ sơ hoàn chỉnh với 1 ảnh | admin1 gỡ ảnh đó với lý do "Ảnh giả" | Hồ sơ maria không còn hoàn chỉnh và không còn hiện trong Lobby | R-13 |
| AC-39 | maria có bio trống sau một lần gỡ trước | admin1 gỡ bio của maria, rồi gỡ ảnh của maria không ghi lý do, rồi gỡ một tin nhắn của maria | Cả ba bị từ chối | R-13 |
| AC-40 | maria có 2 ảnh | admin5 gỡ một ảnh của maria | Bị từ chối | R-13, P-15 |
| AC-41 | Cờ Open: cờ đáng ngờ của anna (đang bị đình chỉ) tạo lúc 08:00:00; cờ đáng ngờ của john tạo lúc 09:00:00 do 3 báo cáo; cờ Failed của mark lúc 09:00:00; cờ chargeback của peter lúc 09:00:00; cờ Closed của lisa | top3 mở hàng chờ cờ; admin1 mở; admin2 mở | top3 thấy anna (ghi đang bị đình chỉ), john, mark, peter theo thứ tự đó; admin1 chỉ thấy anna và john, cờ của john hiện 3 báo cáo đã tạo ra nó; admin2 chỉ thấy mark; không ai thấy lisa | R-14, P-16, F-02 |
| AC-42 | Cờ đáng ngờ Open của john | admin1 đóng với lý do "Đã kiểm tra, không có lừa đảo" | Cờ Closed; tình trạng john vẫn Good | R-15, P-17 |
| AC-43 | Cờ Failed Open của mark | admin1 đóng, rồi top1 (chỉ Cấp cao nhất) đóng, rồi admin2 đóng với lý do "Đã xem báo cáo Certn" | Hai lần đầu bị từ chối; lần thứ ba cờ Closed; BackgroundCheck của mark vẫn Failed | R-15, P-17 |
| AC-44 | Cờ đáng ngờ Open của john | admin1 đóng không ghi lý do; rồi admin1 đóng lúc 10:00:00.050 và admin4 đóng lúc 10:00:00.090; rồi top1 đóng cờ đó | Lần đầu bị từ chối; cờ Closed với admin1; lần của admin4 và lần của top1 bị từ chối | R-15 |
| AC-45 | MoneyKeywords có "bank", không có "paypal" | john gửi maria "use paypal" lúc 09:59:00; top1 thêm "PayPal" lúc 10:00:00; john gửi "use paypal" lúc 10:01:00 | Tin 09:59:00 không có cảnh báo, kể cả sau lúc thêm; tin 10:01:00 maria thấy cảnh báo lừa đảo | R-16, P-18 |
| AC-46 | MoneyKeywords có "bank" | top1 thêm "BANK", " bank ", "   ", một chuỗi 51 ký tự, rồi một chuỗi 50 ký tự | Bốn lần đầu bị từ chối; chuỗi 50 ký tự được thêm | R-16 |
| AC-47 | admin1 chỉ có vai trò Hỗ trợ | admin1 thêm từ khóa "cash" | Bị từ chối | R-16, P-18 |
| AC-48 | top1 | top1 tạo bài "Family in the Philippines" với 3 ảnh; john mở màn giáo dục văn hóa; top1 xuất bản bài; john mở lại | Bài ở Draft và john không thấy; sau khi xuất bản john thấy bài | R-17, X-01, P-19, F-03 |
| AC-49 | top1 | Tạo bài với 4 ảnh; với tiêu đề 201 ký tự; với nội dung "   "; với nội dung 20.001 ký tự; với một ảnh GIF; với một ảnh JPG 10.485.761 byte; rồi với tiêu đề 200 ký tự, nội dung 20.000 ký tự và 3 ảnh JPG, mỗi ảnh 10.485.760 byte | Sáu lần đầu bị từ chối; lần cuối bài được tạo ở Draft | R-17 |
| AC-50 | admin1 chỉ có vai trò Hỗ trợ | admin1 tạo một bài | Bị từ chối | R-17, P-19 |
| AC-51 | 3 bài Published A, B, C; top1 sắp thứ tự C, A, B | john mở màn giáo dục văn hóa | john thấy C, A, B | R-17 |
| AC-52 | 2 bài Published; john đã mở cả 2, chưa bấm "Tôi đã đọc và đồng ý" | top1 sửa nội dung bài thứ nhất; john bấm "Tôi đã đọc và đồng ý" | Giáo dục văn hóa của john hoàn tất | R-18, F-03 |
| AC-53 | 3 bài Published A, B, C; john đã mở A và B | top1 gỡ C; john bấm "Tôi đã đọc và đồng ý" | C Unpublished; giáo dục văn hóa của john hoàn tất | R-18, X-02 |
| AC-54 | Chỉ có 1 bài Published | top1 gỡ bài đó | Bị từ chối; bài vẫn Published | R-18, X-02 |
| AC-55 | 2 bài Published A, B | top1 gỡ A lúc 10:00:00.050 và top2 gỡ B lúc 10:00:00.090 | A Unpublished; lần gỡ B bị từ chối; B vẫn Published | R-18 |
| AC-56 | Bài A Unpublished | top1 xuất bản lại A | A Published | R-17, X-03 |
| AC-57 | maria đã bấm "Tôi đã hiểu"; john chưa bấm | top1 sửa văn bản màn giáo dục an toàn lúc 10:00:00 | Từ 10:00:00 màn hiện văn bản mới; maria không phải bấm lại; john thấy văn bản mới khi màn hiện ra | R-19, P-20 |
| AC-58 | admin1 chỉ có vai trò Hỗ trợ | admin1 sửa Our Story; top1 thêm một sở thích vào danh sách sở thích | Cả hai bị từ chối | R-19, P-20 |
| AC-59 | 10 nam và 8 nữ là người nhận hợp lệ; nữ anna đang bị đình chỉ; nữ lisa ở Unconfirmed | top1 soạn thông báo hệ thống cho "Nữ", không chọn push và email, và xác nhận gửi lúc 10:00:00; nữ mia tạo tài khoản và xác nhận lúc 10:05:00 | Màn xác nhận hiện "Gửi tới 8 người?"; 8 nữ nhận thông báo trong app, không có push và email; anna, lisa, mia và 10 nam không nhận | R-20, R-21, P-21, F-04 |
| AC-60 | john đã tắt push cho like và tin nhắn | top1 gửi thông báo hệ thống tiêu đề "Scheduled maintenance" cho "Tất cả" với push và email | john nhận thông báo trong app, email, và push hiện "Scheduled maintenance" | R-21 |
| AC-61 | top1 | Gửi với tiêu đề 101 ký tự; với nội dung 1001 ký tự; với nội dung "   "; và cho riêng john@example.com | Cả bốn bị từ chối | R-20, R-21, F-04 |
| AC-62 | admin1 chỉ có vai trò Hỗ trợ | admin1 gửi thông báo hệ thống | Bị từ chối | R-20, P-21 |
| AC-63 | top1 đã gửi một thông báo hệ thống | top1 sửa thông báo đó, rồi thu hồi | Cả hai bị từ chối | R-21 |
| AC-64 | john nhận một thông báo hệ thống | john bấm thông báo | Màn chi tiết thông báo mở ra với tiêu đề và nội dung | R-21 |
| AC-65 | admin1 mở báo cáo #11 lúc 09:00:00, mở danh sách chặn của john lúc 09:01:00, và bị từ chối khi xuất cuộc trò chuyện lúc 09:02:00 | top1 xem audit log | Có 3 bản ghi tương ứng, bản ghi thứ ba có kết quả bị từ chối | R-22 |
| AC-66 | Giá 12 tháng 399,00 USD; john có Subscription Active 1 tháng | top1 đặt giá 12 tháng 429,00 USD lúc 10:00:00; john đổi sang 12 tháng lúc 10:10:00 | nextTerm 12 tháng với lockedPrice 429,00 USD | R-03 |
| AC-67 | Payment A 49,00 USD của john đã bị chargeback; Payment B 49,00 USD của john | top1 hoàn 10,00 USD cho A, rồi 10,005 USD cho B | Cả hai bị từ chối | R-04 |
| AC-68 | Payment 49,00 USD (thuế 0) của john; top1 hoàn 49,00 USD lúc 10:00:00 | Bộ xử lý từ chối lần hoàn lúc 10:05:00; top1 hoàn 49,00 USD lần nữa lúc 10:10:00 | Lần hoàn thứ hai được gửi tới bộ xử lý | R-04 |
| AC-69 | Như AC-14 | top1 chọn hoàn tiền với lý do "Khách xin hoàn"; bộ xử lý từ chối lần hoàn | Cờ vẫn Open | R-06 |
| AC-70 | Cờ thu tiền muộn của john cho một Payment đã được hoàn toàn phần; cờ thu tiền muộn của peter cho một Payment đã bị chargeback | top1 chọn hoàn tiền rồi kích hoạt lại cho từng cờ, rồi đóng từng cờ với lý do "Đã xử lý trước" | Hoàn tiền và kích hoạt lại đều bị từ chối; cả hai cờ Closed | R-06, R-15 |
| AC-71 | Như AC-14 | top1 kích hoạt lại lúc 10:00:00.050 và top2 chọn hoàn tiền lúc 10:00:00.090 | Subscription mới Active; cờ Closed với top1; lần của top2 bị từ chối | R-06 |
| AC-72 | Như AC-14 | Một lần mua của john được bộ xử lý xác nhận lúc 10:00:00.050; top1 kích hoạt lại lúc 10:00:00.090 | Kích hoạt lại bị từ chối; john có đúng 1 Subscription còn hiệu lực, từ lần mua | R-06 |
| AC-73 | john có cờ đáng ngờ Open dấu hiệu (a) do báo cáo của maria, sara và kim; lisa không báo cáo john | admin1 mở cuộc trò chuyện john–maria, rồi john–lisa | Lần đầu mở được; lần hai bị từ chối | R-09 |
| AC-74 | Báo cáo #11 của maria về john đang Open; john–lisa không liên quan tới báo cáo hay cờ nào | top1 mở john–maria không ghi lý do; mở john–lisa không ghi lý do; rồi mở john–lisa với lý do "Tranh chấp thanh toán" | Lần một mở được; lần hai bị từ chối; lần ba mở được và audit có lý do "Tranh chấp thanh toán" | R-09, R-22 |
| AC-75 | admin1 đã gỡ một ảnh của maria | admin4 mở bản gốc ảnh đó; admin1 hoàn tác việc gỡ; maria mở bản gốc ảnh đó | admin4 thấy ảnh; hoàn tác bị từ chối; maria bị từ chối | R-13 |
| AC-76 | maria có 2 ảnh | maria xóa ảnh thứ nhất lúc 10:00:00.050; admin1 gỡ ảnh đó lúc 10:00:00.090 | Ảnh bị maria xóa; việc gỡ của admin1 bị từ chối | R-13 |
| AC-77 | MoneyKeywords chỉ còn "bank" | top1 bớt "bank" | Bị từ chối; danh sách vẫn có "bank" | R-16 |
| AC-78 | 3 bài Published theo thứ tự C, A, B; bài D ở Draft | top1 xuất bản D, rồi xuất bản D lần nữa | Thứ tự C, A, B, D; lần xuất bản thứ hai bị từ chối | R-17, X-01 |
| AC-79 | Bài E ở Draft, bài A Unpublished, bài F ở Draft | top1 xóa E; xóa A; gỡ F | E Deleted; xóa A bị từ chối; gỡ F bị từ chối | R-17, X-04 |
| AC-80 | 3 bài Published A, B, C; john đã mở cả 3, chưa bấm "Tôi đã đọc và đồng ý" | top1 gỡ C, xuất bản lại C, rồi john bấm "Tôi đã đọc và đồng ý" | Giáo dục văn hóa của john hoàn tất | R-18, X-03 |
| AC-81 | maria nhận tin "send money" từ john lúc 09:00:00, dưới tin có câu cảnh báo lừa đảo cũ | top1 sửa câu cảnh báo lúc 10:00:00; maria mở lại cuộc trò chuyện lúc 10:05:00; top1 lưu Our Story 20.001 ký tự | maria thấy câu cảnh báo mới dưới tin 09:00:00; lần lưu Our Story bị từ chối | R-19 |
| AC-82 | Không có nữ nào là người nhận hợp lệ | top1 gửi thông báo hệ thống cho "Nữ" | Bị từ chối | R-20 |
| AC-83 | 10 người nhận hợp lệ | top1 bấm gửi một bản soạn lúc 10:00:00.000 và bấm lần nữa lúc 10:00:00.300 | Mỗi người nhận đúng 1 thông báo | R-21 |
| AC-84 | top1 | Gửi với tiêu đề 100 ký tự và nội dung 1000 ký tự; rồi với tiêu đề "   " | Lần một được gửi; lần hai bị từ chối | R-21 |

## 9. Non-functional

| Code | Quality | Measure | Target | Source |
| --- | --- | --- | --- | --- |

## 10. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |
| ASM-01 | SPEC-3, SPEC-4, SPEC-5, SPEC-6 và SPEC-7 được sửa đổi để hiện thực R-03, R-04, R-05, R-06, R-13, R-15, R-16, R-18 và R-21; các bản sửa đổi được duyệt cùng SPEC-9 (SRC-27#L40, SRC-28#L19) | Honda duyệt các bản sửa đổi cùng SPEC-9 |
| ASM-02 | Khách cung cấp văn bản tiếng Anh ban đầu của các màn nội dung và các bài giáo dục văn hóa (SRC-27#L37, SRC-19#L26) | Honda hỏi khách, trước ngày ra mắt |

## 11. Out of scope

- Vai trò và tài khoản admin, xem và xóa tài khoản thành viên, đình chỉ, cấm, kháng nghị, xác minh và đọc audit log: SPEC-8 (BRIEF-1/C-31, BRIEF-1/C-32, BRIEF-1/C-39).
- Máy trạng thái của báo cáo và cờ đáng ngờ: SPEC-6; cờ xác minh: SPEC-2; cờ thanh toán và gói: SPEC-5.
- Admin hủy, bật lại hoặc đổi thời hạn gói thay nam: không có trong MVP (SRC-27#L24).
- Admin hủy yêu cầu, kết thúc kết nối hoặc gỡ chặn: không có trong MVP (SRC-27#L25, SRC-27#L27).
- Video trong bài giáo dục văn hóa: không có trong MVP (SRC-27#L35).
- Hẹn giờ gửi và gửi riêng cho một thành viên: không có trong MVP (SRC-27#L38-L39).
- Sửa danh sách mục tiêu quan hệ và sở thích trên website admin: không có trong MVP; khách cung cấp, đội phát triển cài (SRC-27#L37).

## Change log

| Version | Date | By | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-09-30 | Honda | Approved |
