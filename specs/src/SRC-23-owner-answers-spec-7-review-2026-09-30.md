---
id: SRC-23
title: Owner answers SPEC-7 review 2026-09-30
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-30
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:b27a235e62b995fb64537f94
---
Owner answers, SPEC-7 review, 2026-09-30 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 19: "theo đề xuất" (line at the end).

O1: Thông báo tin nhắn trong chuông. Đề xuất: Mỗi cuộc trò chuyện chỉ có một thông báo chưa đọc, tự cập nhật khi có tin mới
O2: Bấm thông báo khi kết nối đã kết thúc, bị chặn, hoặc bên kia đã xoá tài khoản. Đề xuất: Mở cuộc trò chuyện ở chế độ chỉ đọc, khớp với SPEC-4/R-14 và SPEC-6/R-16. "Không thể mở" chỉ dùng khi nội dung thật sự không còn
O3: Giới hạn 5 phút. Đề xuất: Tính riêng cho từng người nhận trong một cuộc trò chuyện. Nam và nữ trả lời nhau vẫn nhận được push
O4: Thông báo (7) "gia hạn thất bại". Đề xuất: Chỉ gửi một lần, khi gói chuyển sang PastDue; không gửi lại sau mỗi lần thử thu lại
O5: Thông báo (9) "gói kết thúc". Đề xuất: Gửi cho mọi lần gói chuyển sang Ended (hết kỳ, hết thời gian thử lại, hoàn toàn phần, chargeback, tự huỷ khi PastDue), trừ khi tài khoản đang bị đình chỉ hoặc cấm (xem O8)
O6: Thông báo (5) và (6). Đề xuất: (5): chỉ khi admin quyết Approved hoặc Declined. (6): chỉ khi Passed hoặc Failed. Cả hai đều gửi push, thông báo trong app và email
O7: Thông báo (8) "gói sắp hết kỳ". Đề xuất: Huỷ khi còn dưới 3 ngày thì gửi ngay. Mỗi lần gói chuyển sang Cancelling gửi một lần; bật lại rồi huỷ lại thì gửi lại. Không gửi khi gói chuyển Cancelling do tài khoản bị đình chỉ
O8: Tài khoản bị đình chỉ hoặc bị cấm. Đề xuất: Không nhận push hay thông báo trong app nào. Chỉ nhận email kết quả kháng nghị (SPEC-6)
O9: Link trong email, đăng xuất, người khác đăng nhập. Đề xuất: Email có link: trên điện thoại mở app, trên máy tính mở website (trang tài khoản cho thông báo 7 và 9, trang hướng dẫn mở app cho 5 và 6). Đăng xuất thì xoá push trên thiết bị. Người khác đăng nhập sau khi bấm thì hiện "Không thể mở"
O10: Chặn và thông báo. Đề xuất: Chỉ áp dụng khi lượt chặn đang Active. Khi chặn, xoá các thông báo cũ về người đó và huỷ những thông báo chưa gửi. Sau khi bỏ chặn, chỉ các thông báo mới được gửi
O11: Bấm thông báo like mở màn nào? Đề xuất: Danh sách "Đã thích bạn"
O12: Nội dung thông báo. Đề xuất: Push cho (5) và (6) chỉ ghi "có kết quả", không ghi đạt hay trượt. Thông báo trong app và email thì ghi kết quả (kèm lý do từ chối theo SPEC-2) và được ghi tên người liên quan. Push không bao giờ ghi tên
O13: Mốc 60 giây. Đề xuất: Tính tới lúc hệ thống gửi push đi. Với (8) và (9), tính từ lúc gói đổi trạng thái (có thể muộn hơn mốc tới 5 phút, theo SPEC-5/N-02)
O14: Bấm thông báo (1) khi yêu cầu không còn chờ. Đề xuất: Đã rút hoặc hết hạn: "Không thể mở nội dung này". Đã chấp nhận: mở cuộc trò chuyện. Đã từ chối: mở yêu cầu với trạng thái đã từ chối. Bỏ trường hợp "nội dung đã bị gỡ"
O15: Web push cho trình duyệt. Đề xuất: Không có; chỉ app iOS và Android nhận push
O16: Công tắc push. Đề xuất: Áp dụng cho cả tài khoản, mọi thiết bị
O17: Tin nhắn đến khi người nhận đang mở đúng cuộc trò chuyện đó. Đề xuất: Không gửi push; thông báo trong app được đánh dấu đã đọc; không tính vào giới hạn 5 phút
O18: Xoá thông báo sau 90 ngày. Đề xuất: Ẩn ngay từ đúng mốc 90 ngày; việc xoá được trễ tối đa 5 phút
O19: Câu chữ tiếng Anh. Đề xuất: Khách cung cấp trước khi viết DSN (ASM-01). Duyệt SPEC-7 bây giờ, vì AC kiểm ý nghĩa chứ không kiểm từng chữ

Answer (O1–O19): theo đề xuất
