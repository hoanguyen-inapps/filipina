---
id: SRC-25
title: Owner answers SPEC-8 review 2026-09-30
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-30
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:5e03c350904d3dcd361e9311
---
Owner answers, SPEC-8 review, 2026-09-30 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 20: "theo đề xuất" (line at the end).

T1: Admin bị khoá sau 5 lần sai. Đề xuất: Khoá cho tới khi một admin Cấp cao nhất khác mở khoá
T2: Xoá thay khi thành viên còn gói chưa huỷ. Đề xuất: Việc xoá tự huỷ gói, gói chuyển Ended ngay; không tự hoàn tiền
T3: Ai xét kháng nghị lệnh cấm? Đề xuất: Chỉ admin Cấp cao nhất, và phải khác người ra lệnh cấm
T4: Kháng nghị gắn với quyết định nào? Đề xuất: Chấp nhận kháng nghị chỉ có tác dụng khi quyết định đó còn hiệu lực. Nếu lệnh đình chỉ đã được gỡ hoặc đã bị thay bằng lệnh cấm, kháng nghị cũ tự đóng; thành viên kháng nghị lệnh cấm riêng
T5: Hậu quả khi thu hồi xác minh. Đề xuất: Yêu cầu đang chờ chuyển Expired, kết nối đang mở chuyển Ended (như khi đình chỉ). Gói vẫn chạy, không tự huỷ. Thành viên nhận thông báo "Declined" kèm lý do qua push, thông báo trong app và email (SPEC-7)
T6: Cấp cao nhất có xem hồ sơ bảo mật và quyết định xác minh không? Đề xuất: Không, trừ khi được gán thêm vai trò Xác minh. Như vậy giữ nguyên SPEC-2
T7: Quản lý admin. Đề xuất: Cấp cao nhất vô hiệu hoá admin và đổi vai trò được; thay đổi có hiệu lực ngay và đăng xuất admin đó. Luôn phải còn ít nhất 1 admin Cấp cao nhất đang hoạt động. Mã xác thực hai lớp cài ở lần đăng nhập đầu; mất thiết bị thì một admin Cấp cao nhất khác đặt lại
T8: Cấp thêm lượt nộp lại. Đề xuất: Chỉ khi hồ sơ đang Declined và đã dùng hết lượt; các trường hợp khác bị từ chối
T9: Hồ sơ xác minh đang chờ của thành viên bị đình chỉ hoặc cấm. Đề xuất: Đình chỉ: tạm ẩn khỏi hàng chờ; báo cáo Certn đến vẫn được ghi nhưng admin chưa quyết được cho tới khi hết đình chỉ. Cấm: hồ sơ chờ chuyển Cancelled (cần sửa SPEC-2)
T10: Ai gỡ đình chỉ? Đề xuất: Hỗ trợ hoặc Cấp cao nhất, nhưng phải khác admin đã ra lệnh đình chỉ
T11: Bấm lặp lại, hai admin cùng lúc, trạng thái tài khoản. Đề xuất: Từ chối các trường hợp: đình chỉ khi đã bị đình chỉ hoặc cấm, cấm khi đã bị cấm, gỡ khi đang Good. Hai quyết định cùng lúc thì quyết định ghi trước thắng. Chỉ tài khoản Active (SPEC-1) mới bị đình chỉ hoặc cấm
T12: Like và gói sau khi được gỡ đình chỉ. Đề xuất: Trong lúc đình chỉ, like bị ẩn chứ không bị xoá; gỡ xong thì hiện lại. Gói đang Cancelling do đình chỉ được bật lại tự gia hạn nếu chưa hết kỳ
T13: Tìm audit log theo ngày. Đề xuất: Ngày tính theo UTC; tính cả ngày đầu và ngày cuối; nhập được cả giờ
T14: Đếm lần sai khi admin đăng nhập. Đề xuất: Sai mật khẩu, sai mã hoặc thiếu mã đều tính. 5 lần liên tiếp, không giới hạn khung thời gian; đăng nhập đúng thì đếm lại từ 0. Thông báo từ chối chung. Đủ 30:00 không thao tác là tự đăng xuất
T15: Admin xoá tài khoản thay thành viên. Đề xuất: Tham chiếu tới yêu cầu và lý do đều bắt buộc, không được rỗng. Xoá được mọi tài khoản trừ tài khoản đã Deleted hoặc Expired. Audit ghi người thực hiện là admin (cần sửa SPEC-1)
T16: Từ chối kháng nghị. Đề xuất: Bắt buộc có lý do; cũng phải là admin khác người ra quyết định; tình trạng tài khoản giữ nguyên
T17: Thứ tự hàng chờ. Đề xuất: Hàng chờ xác minh: các hồ sơ AwaitingAdmin, xếp theo lần nộp gần nhất, cũ nhất trước. Hàng chờ background check: các hồ sơ ReportReceived, xếp theo lúc nhận báo cáo, cũ nhất trước. Bằng nhau thì theo mã thành viên tăng dần
T18: Sau khi đổi Failed sang Passed. Đề xuất: Thành viên nhận thông báo (6) Passed. Không cho đổi ngược từ Passed sang Failed
T19: Ghi log những gì? Đề xuất: Mọi thao tác của admin, kể cả các thao tác bị từ chối, đăng nhập sai (ghi cả email đã nhập) và tự đăng xuất
T20: Tìm thành viên. Đề xuất: Không phân biệt hoa thường, khớp một phần cho cả tên và email. Hiện cả tài khoản Deleted và Expired, có ghi rõ trạng thái

Answer (T1–T20): theo đề xuất
