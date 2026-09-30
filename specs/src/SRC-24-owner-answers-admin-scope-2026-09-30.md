---
id: SRC-24
title: Owner answers admin scope 2026-09-30
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-30
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:419f963ef02864b9e19d737b
---
Owner answers, admin scope (part 1), 2026-09-30 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 13: "theo đễ xuất" (line at the end).

S1: Chia phạm vi. Đề xuất: SPEC-8 "Admin: vai trò, tài khoản và xác minh" (C-31, C-32, C-39) trước; SPEC-9 "Admin: an toàn, nội dung, thanh toán và thông báo" (C-33 đến C-38) sau
S2: Có những vai trò admin nào? Đề xuất: 3 vai trò; một admin có thể giữ nhiều vai trò. Hỗ trợ: xem thành viên, đình chỉ, xử lý báo cáo, cờ và kháng nghị. Xác minh: duyệt xác minh, background check, xem hồ sơ bảo mật (T-09 của SPEC-2). Cấp cao nhất: mọi quyền, cộng thêm quản lý admin, đọc audit log, cấm, đặt giá, hoàn tiền (T-10 của SPEC-2)
S3: Ai tạo tài khoản admin? Đề xuất: Chỉ admin cấp cao nhất. Admin cấp cao nhất đầu tiên được tạo lúc cài đặt, cho người khách chỉ định
S4: Đăng nhập admin. Đề xuất: Địa chỉ website admin riêng. Email + mật khẩu + mã xác thực hai lớp (ứng dụng tạo mã) là bắt buộc. Khoá sau 5 lần sai. Tự đăng xuất sau 30 phút không thao tác
S5: Admin làm gì với tài khoản thành viên? Đề xuất: Tìm theo tên hoặc email, xem hồ sơ và trạng thái. Không sửa dữ liệu, không xác nhận email hộ, không đổi nhánh giới. Chỉ admin cấp cao nhất xoá được tài khoản thay thành viên, khi có yêu cầu bằng văn bản của thành viên đó và phải ghi lý do
S6: Đình chỉ và cấm. Đề xuất: Hỗ trợ được đình chỉ; chỉ Cấp cao nhất được cấm. Mỗi quyết định bắt buộc ghi lý do. Đình chỉ kéo dài cho tới khi admin gỡ; cấm là vĩnh viễn. Hậu quả theo các SPEC trước: yêu cầu hết hạn, kết nối kết thúc, gói ngừng tự gia hạn, chỉ còn màn kháng nghị
S7: Kháng nghị. Đề xuất: Admin xét kháng nghị phải khác admin đã ra quyết định. Chấp nhận kháng nghị thì tự gỡ đình chỉ hoặc cấm, tài khoản về Active. Kết nối cũ không được khôi phục (SPEC-6)
S8: Hàng chờ xác minh. Đề xuất: Sắp hồ sơ cũ nhất lên trước. Không khoá hồ sơ khi một admin đang mở; nếu hai admin cùng quyết thì người ghi trước thắng (theo SPEC-2)
S9: Cấp thêm lượt nộp lại (SPEC-2). Đề xuất: Admin Xác minh cấp thêm 1 lượt mỗi lần, bắt buộc ghi lý do, có ghi log. Giới hạn nộp lại thành 3 cộng số lượt đã được cấp thêm
S10: Đổi background check từ Failed sang Passed. Đề xuất: Chỉ admin Cấp cao nhất được đổi, bắt buộc ghi lý do; cờ Failed được đóng
S11: Thu hồi xác minh đã Approved. Đề xuất: Admin Xác minh thu hồi được, kèm lý do. Hồ sơ chuyển sang Declined, mất huy hiệu, bị ẩn khỏi Lobby (SPEC-3); thành viên nộp lại theo lượt còn lại (SPEC-2)
S12: Xem audit log. Đề xuất: Chỉ admin Cấp cao nhất. Tìm theo thành viên, admin, loại sự kiện, khoảng thời gian. Xuất được ra CSV
S13: Ghi log thao tác admin. Đề xuất: Mọi thao tác của admin đều ghi audit, kể cả việc mở xem hồ sơ thành viên (theo SRC-1: "Administrative activity should itself be logged")

Answer (S1–S13): theo đễ xuất
