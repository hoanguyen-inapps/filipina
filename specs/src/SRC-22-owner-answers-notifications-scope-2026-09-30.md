---
id: SRC-22
title: Owner answers notifications scope 2026-09-30
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-30
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:0e3d2b06a629ea1856ff2c9b
---
Owner answers, notifications and deep link scope, 2026-09-30 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 14: "theo đề xuất" (line at the end).

N1: Sự kiện nào gửi push? Đề xuất: (1) Nữ nhận yêu cầu liên hệ mới. (2) Yêu cầu của nam được chấp nhận. (3) Tin nhắn mới. (4) Like mới. (5) Kết quả xác minh danh tính. (6) Kết quả background check. (7) Gia hạn thất bại. (8) Gói đã huỷ sắp hết kỳ, báo trước 3 ngày. (9) Gói kết thúc. Không gửi push khi yêu cầu bị từ chối hay hết hạn, để khớp với SPEC-4/R-23
N2: Có gửi email không? Đề xuất: Chỉ gửi email cho kết quả xác minh, background check, gia hạn thất bại và gói kết thúc. Không gửi email cho tin nhắn và like
N3: Có danh sách thông báo trong app không? Đề xuất: Có, một biểu tượng chuông chứa mọi thông báo ở N1, lưu 90 ngày
N4: Thành viên tắt thông báo được không? Đề xuất: Tắt được push cho like và tin nhắn. Không tắt được thông báo về xác minh, thanh toán và yêu cầu liên hệ
N5: Nội dung push trên màn hình khoá. Đề xuất: Chỉ ghi loại sự kiện (ví dụ "Bạn có tin nhắn mới"); không hiện tên người gửi hay nội dung tin
N6: Chống spam push khi nhắn tin. Đề xuất: Mỗi cuộc trò chuyện gửi tối đa 1 push trong 5 phút
N7: Giờ yên lặng. Đề xuất: Không có trong MVP
N8: Người đã bị chặn. Đề xuất: Không có thông báo nào liên quan tới người đã bị chặn
N9: Deep link. Đề xuất: Bấm push hoặc thông báo trong app thì mở đúng màn: yêu cầu, cuộc trò chuyện, trạng thái xác minh, hoặc trang gói trên website. Chưa đăng nhập thì đăng nhập xong mới mở màn đó. Chưa cài app thì mở App Store hoặc Google Play
N10: Màn đích không còn mở được (đã chặn, kết nối đã kết thúc, tài khoản đã xoá). Đề xuất: Hiện "Không thể mở nội dung này" rồi về màn chính
N11: Thành viên không cho phép push trên điện thoại. Đề xuất: Chỉ còn thông báo trong app (chuông); không gửi email thay
N12: Ngôn ngữ của app và thông báo. Đề xuất: Tiếng Anh cho toàn bộ app, website và thông báo trong MVP
N13: Độ trễ. Đề xuất: Push và thông báo trong app đến trong ≤ 60 giây sau sự kiện
N14: Nhiều thiết bị. Đề xuất: Gửi tới mọi thiết bị đang đăng nhập

Answer (N1–N14): theo đề xuất
