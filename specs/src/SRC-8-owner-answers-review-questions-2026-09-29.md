---
id: SRC-8
title: Owner answers review questions 2026-09-29
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-29
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-29
approved_hash: sha256:2f4b288e7d065e5627103aff
---
Owner answers, SPEC-1 and SPEC-2 review questions, 2026-09-29 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"). The owner replied once for all 50: "theo đề xuất" (line at the end).

A1: Tài khoản chưa xác nhận email có hết hạn không? Đề xuất: Hết hạn sau 7 ngày: tự xoá, trả lại email
A2: Email của tài khoản đã xoá có đăng ký lại được không? Đề xuất: Không, để không lách được background check bị Failed
A3: Đăng ký bằng email đã có thì báo gì? Đề xuất: Một thông báo trung tính, kèm gửi email "bạn đã có tài khoản" tới địa chỉ đó (giống R-14)
A4: Xoá tài khoản khi gói còn hiệu lực? Đề xuất: Bắt buộc huỷ gói trước khi xoá
A5: Đặt lại mật khẩu với tài khoản Unconfirmed hoặc Deleted? Đề xuất: Deleted: không gửi email. Unconfirmed: được đặt lại, và việc đặt lại cũng xác nhận email
A6: Link email dùng một lần? Đề xuất: Có. Link mới làm link cũ hết hiệu lực. Mở link xác nhận khi đã Active thì báo "đã xác nhận"
A7: Mốc hết hạn 24 giờ. Đề xuất: Còn hiệu lực khi dưới 24 giờ, tính tới từng giây; đúng 24:00:00 là hết hạn
A8: Sinh ngày 29/2 thì tính đủ tuổi vào ngày nào? Đề xuất: Ngày 1/3 của năm không nhuận
A9: Nhập location thế nào? Đề xuất: Chọn quốc gia từ danh sách, rồi gõ thành phố. Lãnh thổ Mỹ (Guam, Puerto Rico…) có tính là Mỹ không? Anh cần chọn
A10: Sửa ngày sinh và location sau khi đăng ký? Đề xuất: Ngày sinh không sửa được. Location sửa được nhưng quốc gia phải giữ nguyên
A11: So sánh email. Đề xuất: Không phân biệt hoa thường, bỏ khoảng trắng đầu cuối, không gộp alias (dấu + hay dấu chấm)
A12: Cách đăng nhập. Đề xuất: MVP chỉ có email + mật khẩu
A13: Chi tiết mật khẩu. Đề xuất: Chữ cái nào cũng tính, kể cả có dấu; chữ số là 0–9; tối đa 128 ký tự; cho phép dấu cách
A14: Đăng nhập sai nhiều lần. Đề xuất: Khoá 15 phút sau 5 lần sai. Đặt lại mật khẩu hoặc xoá tài khoản thì đăng xuất mọi thiết bị
A15: Đăng nhập bằng email chưa đăng ký. Đề xuất: Cùng thông báo với khi sai mật khẩu
A16: Gửi lại link. Đề xuất: Tối đa 1 lần/60 giây và 5 lần/ngày
A17: Xoá tài khoản thì xoá những gì? Đề xuất: Xoá location, ngày sinh, ảnh, hồ sơ. Giữ tên + email chỉ bên trong các bản ghi được lưu lại (audit, xác minh, thanh toán)
A18: Xác nhận khi xoá tài khoản. Đề xuất: Phải nhập lại mật khẩu; không có thời gian chờ để hoàn tác
A19: Ghi thêm vào audit log. Đề xuất: Thêm sự kiện đặt lại mật khẩu và xoá tài khoản (không ghi mỗi lần đăng nhập)
A20: Quyền của admin với tài khoản thành viên. Đề xuất: Không có trong SPEC-1; đưa sang SPEC admin
A21: Onboarding. Đề xuất: Chỉ hiện lần mở app đầu tiên, không bỏ qua được. Chỉ đăng ký được trong app, website chỉ để đăng nhập
A22: Màn thứ 4. Đề xuất: Là một màn duy nhất, trên đó chọn Man hoặc Woman
A23: Dữ liệu nhập sai định dạng. Đề xuất: Từ chối tên chỉ gồm khoảng trắng và email sai định dạng
B1: Điều kiện để mua gói và làm Certn. Đề xuất: Làm Certn khi xác minh danh tính đã nộp. Mua gói phải có huy hiệu xanh, tức xác minh Approved và Certn Passed
B2: Nam bị Declined còn ở Lobby không? Đề xuất: Ở lại khi còn lượt nộp lại; hết lượt thì bị khoá khỏi Lobby cho tới khi hỗ trợ xử lý
B3: Ai quyết định đạt hay không đạt Certn? Đề xuất: Admin đọc báo cáo Certn rồi quyết. Tiêu chí trượt do khách cung cấp (cần hỏi khách)
B4: Certn báo về cho mình những gì? Đề xuất: Làm spike thử API Certn trước khi viết DSN. Trong lúc chờ, SPEC ghi: InProgress khi Certn xác nhận đã nhận đơn
B5: Các thao tác không hợp lệ. Đề xuất: Từ chối nộp khi đang Submitted, AwaitingAdmin hoặc Approved; không thay tài liệu khi đang chờ; từ chối mở đơn Certn khi đang InProgress, Passed hoặc Failed
B6: Dịch vụ xác minh không trả lời. Đề xuất: Sau 48 giờ, hoặc khi dịch vụ báo lỗi, hồ sơ chuyển sang AwaitingAdmin với ghi chú "không có kết quả", admin duyệt tay. Certn quá 14 ngày thì gắn cờ cho admin
B7: Admin duyệt khi dịch vụ chấm không đạt. Đề xuất: Được, nhưng bắt buộc ghi chú. Với nữ, admin phải tích "đã kiểm CENOMAR" mới được Approved
B8: Hai admin cùng quyết một hồ sơ. Đề xuất: Người đầu tiên thắng; người sau bị từ chối và được báo
B9: Kết quả gửi về trùng hoặc gửi muộn. Đề xuất: Bỏ qua; mỗi lần Failed chỉ tạo một cờ
B10: Ai được ghi kết quả dịch vụ và kết quả Certn. Đề xuất: Chỉ dịch vụ xác minh và Certn; thêm hai cột này vào ma trận quyền. Thành viên tự ghi thì bị từ chối
B11: Hết lượt nộp lại. Đề xuất: Admin cấp thêm 1 lượt (có ghi log); chi tiết nằm ở SPEC admin
B12: Nộp lại thiếu tài liệu có mất lượt không? Đề xuất: Không mất lượt
B13: Lịch sử các lần nộp. Đề xuất: Giữ tất cả lần nộp và lý do từ chối; admin xem được lịch sử
B14: Nam đính kèm CENOMAR. Đề xuất: App không có ô này. Nếu vẫn gửi lên thì từ chối cả lần nộp
B15: Ai được xem hồ sơ bảo mật. Đề xuất: Chỉ admin có vai trò "xác minh"
B16: Thế nào là một lần "truy cập" để ghi log. Đề xuất: Xem, tải và xem trước đều ghi log. Audit log chỉ admin cấp cao nhất đọc được
B17: Múi giờ. Đề xuất: Lưu theo UTC, hiển thị theo múi giờ của người xem
B18: Hai chỉ báo background check. Đề xuất: Chỉ hiện khi Passed; InProgress và Failed không hiện gì
B19: Nam ở AwaitingAdmin hoặc Approved có vào Lobby không? Đề xuất: Có (xác nhận cách tôi hiểu câu 8a)
B20: Mua gói trên website. Đề xuất: Chính bước thanh toán cũng từ chối nếu chưa có huy hiệu xanh, dù vào từ đâu; SPEC thanh toán phải kiểm
B21: Nam bấm mua khi Certn đang InProgress. Đề xuất: Hiện thông báo "Background check đang xử lý"
B22: Certn Failed rồi sau đó được đính chính. Đề xuất: Admin được đổi Failed thành Passed, kèm lý do (SPEC admin)
B23: Điều kiện Lobby của nữ. Đề xuất: SPEC-2 thêm: nữ vào Lobby phải có xác minh Approved; các điều kiện hồ sơ và giáo dục văn hoá nằm ở SPEC khám phá
B24: Xoá tài khoản khi xác minh đang chờ. Đề xuất: Huỷ hồ sơ chờ duyệt, giữ tài liệu theo R-08 của SPEC-1. Trường hợp bị đình chỉ thuộc SPEC admin
B25: Thành viên xem tài liệu của chính mình. Đề xuất: Thấy tên tài liệu và trạng thái, không tải lại được
B26: Admin nộp hộ thành viên. Đề xuất: Không được
B27: Lý do từ chối chỉ gồm khoảng trắng. Đề xuất: Từ chối

Answer (A1–A23 and B1–B27): theo đề xuất
