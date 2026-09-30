---
id: SRC-10
title: Owner answers review round 2 2026-09-29
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-29
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-29
approved_hash: sha256:16eb92b6018b587f089e4cfc
---
Owner answers, SPEC-1 and SPEC-2 review round 2, 2026-09-29 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 34: "theo đề xuất" (line at the end).

C1: Người chưa đăng ký mở app lần 2 thì vào đăng ký bằng cách nào? Đề xuất: Màn đăng nhập có nút "Tạo tài khoản" dẫn thẳng tới màn chọn nhánh giới. "Lần đầu" tính theo mỗi lần cài app
C2: Chặn email của tài khoản đã xoá bao lâu? Đề xuất: Mãi mãi. Chỉ lưu một mã băm của email để chặn, kể cả sau khi hết thời hạn lưu giữ dữ liệu
C3: Thông báo khi bị khoá đăng nhập. Đề xuất: Dùng cùng thông báo từ chối chung, để không lộ việc tài khoản có tồn tại. Hết khoá thì đếm lại từ 0. Đặt lại mật khẩu thành công thì gỡ khoá
C4: Audit log có ghi thêm việc sửa thành phố và tài khoản hết hạn không? Đề xuất: Có
C5: Giới hạn 1 lần/60 giây và 5 lần/ngày áp dụng cho những email nào? Đề xuất: Cho cả link đặt lại mật khẩu và email báo đăng ký trùng
C6: "5 lần/ngày" tính thế nào? Đề xuất: Theo ngày lịch UTC. Email gửi lúc đăng ký không tính
C7: Tài khoản đã Active mở bất kỳ link xác nhận nào (đã dùng, đã bị thay, đã hết hạn). Đề xuất: Luôn hiện "đã xác nhận"
C8: Đủ 168 giờ nhưng hệ thống chưa chạy dọn tài khoản hết hạn. Đề xuất: Mọi thao tác vẫn bị từ chối từ đúng mốc 168:00:00, dù việc dọn chạy lúc nào
C9: Hai lần gửi đăng ký cùng email cùng lúc. Đề xuất: Chỉ tạo đúng 1 tài khoản; lần gửi kia xử lý như email trùng
C10: Màn hình sau khi đăng ký thành công hoặc bị trùng. Đề xuất: Cả hai đều hiện "Kiểm tra email để xác nhận" và không đăng nhập. Email trùng thuộc tài khoản Deleted thì không gửi email
C11: Sửa tên và email sau khi đăng ký. Đề xuất: Tên sửa được (theo luật R-02). Email không sửa được trong MVP. Sửa thành phố phải không rỗng và chỉ tài khoản Active
C12: Email hợp lệ và độ dài tối đa. Đề xuất: Email có dạng x@tên.miền, không có dấu cách. Thành phố chỉ gồm ký tự trắng thì từ chối. Tên và thành phố tối đa 100 ký tự
C13: Nhập sai mật khẩu ở màn xoá tài khoản. Đề xuất: Tính vào 5 lần sai của R-15
C14: Tài khoản chưa xác nhận có tự xoá được không? Đề xuất: Không, chờ hết hạn sau 7 ngày
C15: Khung thời gian cho 5 lần sai. Đề xuất: 5 lần sai liên tiếp trong vòng 15 phút
C16: Đếm ký tự mật khẩu. Đề xuất: Đếm theo ký tự Unicode (chuẩn NFC). Giữ nguyên dấu cách ở đầu và cuối
C17: Website làm được gì ngoài đăng nhập? Đề xuất: Đặt lại mật khẩu (link mở trên website nếu không mở bằng điện thoại), sửa thành phố, xoá tài khoản
C18: Link mới huỷ link cũ. Đề xuất: Chỉ huỷ link cùng loại. Link đặt lại B huỷ link đặt lại A
D1: Đúng mốc thời gian (đúng 48:00:00, đúng 14 ngày, đúng 7 ngày) có tính là đã qua mốc không? Đề xuất: Có (≥), thống nhất với link 24 giờ ở A7
D2: Kết quả chấm gửi muộn của lần nộp trước. Đề xuất: Mỗi kết quả gắn với một lần nộp cụ thể; kết quả của lần nộp cũ bị bỏ qua. submittedAt tính lại mỗi lần nộp lại
D3: Nam bị Declined hoặc chưa nộp mà bấm mua gói. Đề xuất: Declined: hiện "Xác minh bị từ chối, hãy nộp lại", và không làm Certn được khi đang Declined. Chưa nộp và vào từ website: hiện "Hãy nộp xác minh trong app"
D4: Khe mở hai đơn Certn. Đề xuất: Khi nam mở đơn Certn, BackgroundCheck chuyển sang trạng thái Applying, không mở đơn thứ 2 được. Xác nhận đã nhận đơn của Certn luôn được nhận, kể cả khi xác minh danh tính vừa bị Declined
D5: Xoá tài khoản khi background check đang chờ, hoặc khi xác minh đang Declined. Đề xuất: Tất cả chuyển sang Cancelled
D6: Chỉ báo background check khi xác minh danh tính chưa Approved. Đề xuất: Không hiện; chỉ hiện khi cả hai đều đạt
D7: Ghi chú của admin chỉ gồm ký tự trắng. Đề xuất: Từ chối
D8: Hai lần nộp lại cùng lúc. Đề xuất: Chỉ nhận 1 lần
D9: Cờ "Certn quá 14 ngày". Đề xuất: Mỗi background check chỉ có 1 cờ loại này
D10: Nộp lại xác minh. Đề xuất: Nộp lại đủ bộ tài liệu
D11: Thông báo khi Certn đang ReportReceived, và khi Certn Passed nhưng xác minh chưa duyệt. Đề xuất: ReportReceived: hiện "Background check đang xử lý". Passed nhưng chưa duyệt: hiện "Xác minh danh tính đang chờ duyệt"
D12: Nam có Certn Failed bấm mua gói. Đề xuất: Hiện "Bạn không đủ điều kiện mua gói. Vui lòng liên hệ hỗ trợ."
D13: Điều kiện để nam hoàn thiện hồ sơ (theo journey là sau khi mua gói). Đề xuất: Đặt ở SPEC khám phá; SPEC-2 chỉ giữ điều kiện cho nữ
D14: Hệ thống được trễ tối đa bao lâu sau mốc 48 giờ, 14 ngày, 7 ngày. Đề xuất: ≤ 5 phút
D15: Ghi log cả những lần truy cập hồ sơ bảo mật bị từ chối? Đề xuất: Có
D16: Giấy tờ, định dạng và dung lượng được chấp nhận. Đề xuất: Hộ chiếu, bằng lái, thẻ căn cước quốc gia; JPG, PNG, HEIC hoặc PDF; mỗi tài liệu 1 tệp, tối đa 10 MB

Answer (C1–C18 and D1–D16): theo đề xuất
