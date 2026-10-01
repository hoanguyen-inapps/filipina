---
id: BRIEF-1
title: FilipinaConnect.US MVP
version: 0.2.0
status: approved
owner: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:7c12c793ad591af7ecc8eba2
---

# BRIEF-1: FilipinaConnect.US MVP

<!-- Skyline BRIEF: why, for whom, what. Every row cites the exact source lines (SRC-n#Lx). Nothing without a source; each unknown becomes a CLARIFY marker holding a one-sentence question. -->

## 1. Problem

FilipinaConnect.US là nền tảng tìm hiểu quan hệ Mỹ – Philippines, kết nối nam giới trưởng thành đã xác minh ở Mỹ với nữ giới trưởng thành đã xác minh ở Philippines (SRC-1#L26-L27). Nền tảng dựa trên danh tính đã xác minh, sàng lọc lý lịch, hồ sơ đã xác minh, ghép đôi, giáo dục văn hóa, yêu cầu liên hệ có kiểm soát, đồng thuận hai bên trước khi trò chuyện, nhắn tin trong app và an toàn – tin cậy (SRC-1#L27-L29). Mục tiêu chính của khách là một phiên bản đầu an toàn, chuyên nghiệp, mở rộng được, mang lại trải nghiệm đơn giản và đáng tin cho cả hai phía (SRC-1#L387-L388). Luồng tổng quát: Discover -> Register -> Verify -> Participate -> Connect -> Mutual Consent -> Communicate (SRC-1#L390).

## 2. Goals

| Code | Goal | Success measure | Source |
| --- | --- | --- | --- |
| G-01 | Kết nối nam Mỹ đã xác minh với nữ Philippines đã xác minh | 300 thành viên đã xác minh sau 2 tháng kể từ ngày ra mắt (ra mắt 2026-12-31) | SRC-1#L26-L27, SRC-4#L20, SRC-4#L22, SRC-5#L17-L18 |
| G-02 | Phiên bản đầu an toàn, chuyên nghiệp, mở rộng được | Hệ thống chịu được 300 thành viên đồng thời lúc ra mắt | SRC-1#L387-L388, SRC-4#L20-L21 |
| G-03 | Thu hút nam Mỹ đăng ký | Trung bình ≥ 500 nam xác nhận email (tài khoản chuyển Active) mỗi ngày UTC, tính trên 7 ngày liên tiếp, đạt muộn nhất 2027-02-28; nữ không có chỉ tiêu; đo bằng các bản ghi xác nhận email trong audit log | SRC-29#L19-L21, SRC-29#L23-L28, SRC-29#L32 |

## 3. Non-goals

| Code | Non-goal | Source |
| --- | --- | --- |
| NG-01 | Tư vấn pháp lý về IMBRA (khách làm việc với luật sư riêng) | SRC-1#L249-L250, SRC-4#L33-L34 |
| NG-02 | Bán gói thành viên qua in-app purchase của Apple/Google | SRC-1#L60-L62, SRC-1#L191-L192, SRC-4#L33-L34 |
| NG-03 | Tự xây toàn bộ backend ghép đôi từ đầu (dùng SmartMatchApp) | SRC-1#L36-L37, SRC-4#L33-L34 |
| NG-04 | Gọi thoại/video giữa thành viên | SRC-4#L33-L34 |
| NG-05 | Dịch tự động tin nhắn | SRC-4#L33-L34 |
| NG-06 | Bảo trì/hỗ trợ 12 tháng sau ra mắt (báo giá riêng, không phải capability của BRIEF này) | SRC-1#L281-L283, SRC-4#L30-L31 |

## 4. Actors

| Code | Actor | Description | Source |
| --- | --- | --- | --- |
| A-01 | Nam Mỹ (U.S. Man) | Nam giới trưởng thành ở Mỹ; xác minh danh tính, qua background check Certn, mua gói, gửi yêu cầu liên hệ | SRC-1#L26-L27, SRC-3#L22-L41 |
| A-02 | Nữ Philippines (Philippine Woman) | Nữ giới trưởng thành ở Philippines; xác minh danh tính kèm CENOMAR, nhận và chấp nhận/từ chối yêu cầu liên hệ | SRC-1#L26-L27, SRC-3#L43-L58 |
| A-03 | Quản trị viên (Admin) | Đội vận hành của FilipinaConnect.US dùng Administrative Dashboard | SRC-1#L64-L65 |
| A-04 | SmartMatchApp | Hệ thống ngoài, backend API ghép đôi/nền tảng chính | SRC-1#L36-L37 |
| A-05 | Certn | Dịch vụ ngoài sàng lọc lý lịch, gồm tra cứu sex-offender registry | SRC-1#L95-L96, SRC-1#L243-L244 |
| A-06 | Dịch vụ xác minh danh tính | Dịch vụ ngoài xác minh selfie + giấy tờ chính phủ | SRC-1#L243 |
| A-07 | Bộ xử lý thanh toán | Dịch vụ ngoài xử lý gói định kỳ, gửi payment webhook | SRC-1#L238-L240 |

## 5. Capabilities

| Code | Capability | Priority | Source |
| --- | --- | --- | --- |
| C-01 | Người dùng xem màn hình Welcome, Our Story, Our Advice và chọn I Am A Man / I Am A Woman | Must | SRC-3#L23-L26, SRC-3#L44-L47 |
| C-02 | Người dùng đăng ký tài khoản với tên, email, địa điểm, ngày sinh | Must | SRC-1#L86, SRC-1#L117 |
| C-03 | Người dùng xác nhận email | Must | SRC-1#L87-L89, SRC-1#L119-L121 |
| C-04 | Người dùng đăng nhập và đặt lại mật khẩu | Must | SRC-1#L222 |
| C-05 | Nam xác minh danh tính bằng selfie + giấy tờ chính phủ | Must | SRC-1#L90, SRC-1#L243 |
| C-06 | Nữ xác minh danh tính bằng selfie + giấy tờ chính phủ + CENOMAR | Must | SRC-1#L122, SRC-1#L244-L245 |
| C-07 | Nam khi muốn mua gói được chuyển sang background check Certn (gồm sex-offender registry), điền đơn và trả phí riêng | Must | SRC-1#L93-L96, SRC-1#L187-L189 |
| C-08 | Người dùng được duyệt xác minh nhận huy hiệu xanh / chỉ báo trạng thái xác minh | Must | SRC-1#L97, SRC-1#L123, SRC-1#L148-L150 |
| C-09 | Nam vào Freemium Lobby, xem số lượng giới hạn hồ sơ nữ, gửi và nhận like | Must | SRC-1#L92, SRC-3#L31 |
| C-10 | Nữ vào Freemium Lobby, xem hồ sơ nam không giới hạn số lượng, gửi và nhận like | Must | SRC-1#L128, SRC-3#L55, SRC-5#L20-L21 |
| C-11 | Nam mua gói thành viên (định kỳ) trên website sau khi background check được duyệt | Must | SRC-1#L60-L62, SRC-1#L99, SRC-1#L187-L189, SRC-1#L238 |
| C-12 | Nam hủy gói thành viên | Must | SRC-1#L238-L240 |
| C-13 | Hệ thống xử lý hoàn tiền, thanh toán thất bại và chargeback qua payment webhook | Must | SRC-1#L238-L240 |
| C-14 | App di động nhận biết an toàn trạng thái gói sau giao dịch trên website | Must | SRC-1#L192-L194, SRC-1#L239-L240 |
| C-15 | Người dùng quản lý tài khoản trên website | Must | SRC-1#L60 |
| C-16 | Người dùng hoàn thiện hồ sơ (Complete Full User Profile): trường thông tin, ảnh, chế độ hiển thị | Must | SRC-1#L100, SRC-1#L125, SRC-1#L222-L223 |
| C-17 | Người dùng xem màn hình giáo dục văn hóa | Must | SRC-1#L102, SRC-1#L127 |
| C-18 | Nam duyệt, tìm kiếm và lọc hồ sơ | Must | SRC-1#L103, SRC-1#L227 |
| C-19 | Người dùng xem kết quả ghép đôi và độ tương thích | Must | SRC-1#L227-L228 |
| C-20 | Nam gửi yêu cầu liên hệ tới nữ | Must | SRC-1#L105, SRC-1#L232 |
| C-21 | Nữ nhận yêu cầu liên hệ và Chấp nhận / Từ chối | Must | SRC-1#L130-L131, SRC-1#L143-L144 |
| C-22 | Hai người nhắn tin trong app, chỉ sau khi nữ chấp nhận | Must | SRC-1#L106-L108, SRC-1#L138, SRC-1#L142-L144, SRC-1#L232 |
| C-23 | Người dùng nhận push notification | Must | SRC-1#L212-L213, SRC-1#L233-L234 |
| C-24 | Người dùng mở đúng màn hình trong app qua deep link | Must | SRC-1#L212-L213 |
| C-25 | Người dùng báo cáo người dùng khác (report / abuse report) | Must | SRC-1#L157, SRC-1#L173 |
| C-26 | Người dùng chặn người dùng khác | Must | SRC-1#L159 |
| C-27 | Người dùng nhận cảnh báo lừa đảo và giáo dục an toàn | Must | SRC-1#L163-L165 |
| C-28 | Hệ thống phát hiện gian lận và gắn cờ tài khoản đáng ngờ | Must | SRC-1#L161, SRC-1#L169, SRC-1#L270 |
| C-29 | Người dùng bị đình chỉ yêu cầu xem xét lại (appeal) | Must | SRC-1#L270-L271 |
| C-30 | Người dùng xóa tài khoản | Must | SRC-1#L254-L256 |
| C-31 | Admin quản lý người dùng và hồ sơ | Must | SRC-1#L64, SRC-1#L217-L218 |
| C-32 | Admin xem xét và cập nhật trạng thái xác minh | Must | SRC-1#L64, SRC-1#L218, SRC-1#L265 |
| C-33 | Admin quản lý membership và subscription | Must | SRC-1#L64-L65, SRC-1#L217-L218 |
| C-34 | Admin xem yêu cầu liên hệ | Must | SRC-1#L64 |
| C-35 | Admin xử lý report, block, kiểm duyệt; đình chỉ/cấm tài khoản | Must | SRC-1#L64-L65, SRC-1#L265, SRC-1#L270-L271 |
| C-36 | Admin xem cờ gian lận / an toàn | Must | SRC-1#L65 |
| C-37 | Admin quản lý nội dung và giáo dục văn hóa | Must | SRC-1#L65, SRC-1#L218 |
| C-38 | Admin gửi thông báo hệ thống | Must | SRC-1#L65 |
| C-39 | Admin xem audit log | Must | SRC-1#L65, SRC-1#L218 |
| C-40 | Hệ thống tự ghi nhật ký các sự kiện quan trọng (tạo tài khoản, xác nhận email, xác minh, background check, subscription, yêu cầu liên hệ, chấp nhận/từ chối, đồng thuận, report, block, kiểm duyệt, truy cập admin, thay đổi hồ sơ), kể cả hoạt động admin | Must | SRC-1#L179-L183, SRC-1#L265-L266 |

## 6. Constraints

| Code | Constraint | Source |
| --- | --- | --- |
| K-01 | App iOS + Android, ưu tiên shared codebase (ví dụ Flutter); phát hành App Store và Google Play | SRC-1#L57-L58, SRC-1#L212, SRC-1#L275-L277 |
| K-02 | Gói thành viên mua qua website, không qua in-app purchase, tùy rà soát pháp lý, kỹ thuật và chính sách store | SRC-1#L60-L62, SRC-1#L191-L194 |
| K-03 | SmartMatchApp là backend API chính; phải đánh giá API thật, không giả định chức năng nó không hỗ trợ, chỉ rõ phần phải tự phát triển | SRC-1#L36-L50, SRC-1#L52-L53 |
| K-04 | Background check dùng Certn | SRC-1#L95-L97, SRC-1#L243-L244 |
| K-05 | Người dùng khác không bao giờ xem được báo cáo Certn, giấy tờ, selfie, CENOMAR hay hồ sơ xác minh; chỉ thấy chỉ báo trạng thái | SRC-1#L97, SRC-1#L123-L124, SRC-1#L148-L153 |
| K-06 | Không tự động cung cấp hay trao đổi email, số điện thoại, mạng xã hội giữa người dùng | SRC-1#L142-L144 |
| K-07 | Phân loại IMBRA chưa xác định; công nghệ phải hỗ trợ xác minh, đồng thuận, audit log, kiểm soát an toàn, report, block, chỉ báo trạng thái, xử lý hồ sơ nhạy cảm | SRC-1#L249-L251 |
| K-08 | Bảo mật: mã hóa, xác thực, phân quyền, PII, hồ sơ xác minh, backup, disaster recovery, truy cập admin, lưu giữ dữ liệu, xóa tài khoản | SRC-1#L254-L256 |
| K-09 | User journey hiện tại là quy trình cơ sở; đội phát triển phải chỉ ra thiếu sót, mâu thuẫn, rủi ro trước khi phát triển | SRC-1#L69, SRC-1#L377-L383 |
| K-10 | FilipinaConnect.US sở hữu toàn bộ sản phẩm riêng của dự án; mã nguồn nằm trong GitHub organization của họ, họ có quyền admin suốt dự án | SRC-1#L322-L324, SRC-2#L110-L137 |
| K-11 | FilipinaConnect.US sở hữu và kiểm soát tài khoản production (cloud, domain, Apple, Google Play, thanh toán, dịch vụ bên thứ ba, API key, database) suốt dự án | SRC-2#L141-L160 |
| K-12 | Công bố mọi công nghệ có sẵn; không có phụ thuộc ẩn cản trở vận hành hay chuyển giao | SRC-2#L173-L180 |
| K-13 | Không dùng phần mềm GPL/AGPL/SSPL hay copyleft tương tự khi chưa có phê duyệt bằng văn bản; bàn giao danh mục dependency và license | SRC-2#L187-L194 |
| K-14 | Hợp đồng giá cố định, 5 milestone có tiêu chí nghiệm thu; thanh toán sau nghiệm thu; giữ lại 10–15% cho đợt cuối | SRC-2#L202-L203, SRC-2#L240-L263, SRC-2#L267-L283, SRC-4#L30-L31 |
| K-15 | Việc ngoài phạm vi phải qua change order bằng văn bản trước khi làm | SRC-2#L289-L292 |
| K-16 | Nữ Philippines dùng miễn phí | SRC-4#L24-L25 |
| K-17 | Ngày ra mắt mục tiêu 2026-12-31 (mốc mục tiêu, không phải hạn bắt buộc; lịch tính theo milestone) | SRC-4#L27-L28, SRC-5#L23-L24 |

## 7. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |
| ASM-01 | Mọi capability ở mục 5 đều bắt buộc cho MVP (Must) | Honda, trước khi viết SPEC |
| ASM-02 | Nữ Philippines không cần background check Certn (journey của nữ không có bước này) | Honda hỏi khách, trước khi viết SPEC xác minh |
| ASM-03 | Chỉ nam gửi yêu cầu liên hệ; nữ chỉ nhận và chấp nhận/từ chối | Honda hỏi khách, trước khi viết SPEC kết nối |
| ASM-04 | Màn hình giáo dục văn hóa là bước bắt buộc trước khi gửi hoặc nhận yêu cầu liên hệ | Honda hỏi khách, trước khi viết SPEC kết nối |

## 8. Risks

| Code | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
| RISK-01 | Apple/Google có thể từ chối app nếu gói chỉ bán qua website | Phải đổi luồng thanh toán, trễ phát hành | Rà soát chính sách store trước khi viết SPEC thanh toán |
| RISK-02 | API SmartMatchApp có thể không hỗ trợ yêu cầu liên hệ, nhắn tin hay giới hạn freemium | Tăng phần tự phát triển | Spike đánh giá API trước khi viết DSN |
| RISK-03 | Phân loại IMBRA thay đổi yêu cầu | Phải sửa BRIEF/SPEC | Theo dõi kết luận luật sư của khách qua change flow |
| RISK-04 | Mốc mục tiêu 2026-12-31 (khoảng 3 tháng) có thể không đủ cho phạm vi này | Trễ mốc ra mắt, kéo theo mốc đo G-01 | Theo dõi tiến độ theo milestone (K-14); báo khách sớm nếu trễ |

## Change log

| Version | Date | By | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-09-29 | Claude (draft) | Bản nháp đầu từ SRC-1..SRC-5 |
| 0.1.0 | 2026-09-29 | Honda | Approved |
| 0.2.0 | 2026-09-30 | Honda | Approved revision of 0.1.0 (minor): thêm mục tiêu G-03: trung bình ≥ 500 nam đăng ký mỗi ngày (SRC-29) |
