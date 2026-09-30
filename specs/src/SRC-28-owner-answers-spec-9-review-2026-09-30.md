---
id: SRC-28
title: Owner answers SPEC-9 review 2026-09-30
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-30
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:f49bc70e102c58f86989ab82
---
Owner answers, SPEC-9 review, 2026-09-30 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 25: "theo đề xuất" (line at the end).

W1: Gỡ ảnh/bio làm hồ sơ chưa hoàn chỉnh mà yêu cầu Pending vẫn chấp nhận được. Đề xuất: Yêu cầu Pending của thành viên đó chuyển Expired như khi bị đình chỉ (SPEC-4 R-19), không tạo lệnh cấm gửi lại. Cần thêm SPEC-4 vào bộ sửa đổi
W2: Hậu quả của hồ sơ chưa hoàn chỉnh sau khi bị gỡ. Đề xuất: Đúng, áp dụng mọi hậu quả của hồ sơ chưa hoàn chỉnh (nữ không vào Lobby, nam không tìm kiếm). Người đó cũng không hiện ở "Đã thích bạn" của người khác cho tới khi bổ sung
W3: completedAt khi hoàn chỉnh lại. Đề xuất: Giữ ngày cũ. Trong lúc thiếu, thành viên vẫn lưu được các thay đổi khác
W4: Bài gỡ rồi xuất bản lại. Đề xuất: Lần mở trước vẫn tính
W5: Mọi admin thấy hàng chờ cờ, kể cả nội dung báo cáo và thanh toán. Đề xuất: Mỗi admin chỉ thấy loại cờ mình đóng được (cờ đáng ngờ: Hỗ trợ, Cấp cao nhất; cờ SPEC-2: Xác minh; cờ thanh toán: Cấp cao nhất)
W6: Thứ tự khi cờ tạo cùng lúc; cờ của người đang bị đình chỉ. Đề xuất: Bằng nhau thì theo loại (đáng ngờ, xác minh, thanh toán), rồi theo mã cờ. Cờ của thành viên đang bị đình chỉ vẫn hiện, có ghi rõ
W7: "Cuộc trò chuyện liên quan" tới cờ đáng ngờ. Đề xuất: Dấu hiệu (a): các cuộc trò chuyện giữa người bị gắn cờ và những người đã báo cáo họ; (b), (c), (d): các cuộc trò chuyện chứa tin nhắn đã tạo ra cờ
W8: Lý do khi xem tin nhắn; cột CSV. Đề xuất: Admin có Cấp cao nhất xem cuộc trò chuyện liên quan tới báo cáo/cờ đang mở thì không cần lý do; ngoài phạm vi đó thì cần. Xuất CSV luôn cần lý do. CSV gồm email người gửi, nội dung, thời điểm UTC
W9: Danh sách chặn. Đề xuất: Hiện cả chặn đã bỏ, kèm thời điểm chặn và bỏ chặn (vì chặn đã bỏ vẫn cấm gửi yêu cầu vĩnh viễn, SPEC-4 R-22)
W10: Xử lý cờ thu tiền muộn đồng thời. Đề xuất: (i) Hai admin cùng xử lý một cờ: ghi trước thắng. (ii) Kích hoạt lại đúng lúc nam tự mua: lần mua được xác nhận trước thì kích hoạt bị từ chối; kích hoạt ghi trước thì lần mua xác nhận sau được tự động hoàn toàn phần (như SPEC-5 R-02). (iii) Payment thu muộn đã được hoàn toàn phần hoặc bị chargeback: cả hai cách bị từ chối, admin chỉ đóng cờ kèm lý do
W11: Hoàn tiền Payment đã bị chargeback. Đề xuất: Không hoàn được Payment đã bị chargeback. Số tiền hoàn tối đa 2 chữ số lẻ
W12: Bộ xử lý từ chối hoàn tiền. Đề xuất: Thêm trạng thái "bị từ chối"; lần bị từ chối không tính vào phần còn lại, admin thử lại được. Cờ thu tiền muộn chỉ đóng khi bộ xử lý xác nhận hoàn tiền
W13: Đổi giá đúng lúc nam đang thanh toán. Đề xuất: Giá tại lúc nam bấm thanh toán là giá bị thu và được chốt. Đổi thời hạn thì lấy giá tại lúc đổi. Cần sửa SPEC-5 R-03
W14: Chi tiết bài giáo dục văn hóa. Đề xuất: Nội dung 1–20.000 ký tự; tiêu đề và nội dung không chỉ gồm ký tự trắng. Ảnh JPG/PNG/HEIC ≤ 10 MB như ảnh hồ sơ. Bài mới xuất bản đứng cuối. Xóa được bài Nháp chưa từng xuất bản
W15: Thông báo hệ thống. Đề xuất: Có màn xác nhận "Gửi tới N người?"; mỗi bản soạn chỉ gửi được một lần, bấm lặp không gửi thêm. Nhóm có 0 người thì từ chối. "Tiếng Anh" là hướng dẫn, hệ thống không kiểm tra
W16: Màn nội dung. Đề xuất: Cấp cao nhất sửa được: Our Story, Our Advice, nội dung màn giáo dục an toàn (gồm phần cảnh báo lừa đảo trên màn đó), và câu cảnh báo lừa đảo hiện dưới tin nhắn. Mỗi văn bản 1–20.000 ký tự. Sửa câu cảnh báo thì mọi lần hiện sau đó dùng câu mới
W17: Gỡ nhầm. Đề xuất: Không hoàn tác; thành viên tải ảnh mới hoặc viết lại bio. Bản gốc bị gỡ được lưu, chỉ admin xem được. Gỡ đúng lúc thành viên tự xóa: ghi trước thắng
W18: Thời hạn khi kích hoạt lại. Đề xuất: Theo đúng thời hạn và giá mà Payment thu muộn đã trả (nextTerm nếu nam đã đổi)
W19: Payment của gói kích hoạt lại; báo cho nam. Đề xuất: Xác nhận Payment thu muộn là Payment của kỳ đầu của gói mới. Nam nhận email biên nhận ghi kỳ mới (theo SPEC-5 R-15)
W20: Sự kiện đúng lúc đóng cờ. Đề xuất: Sự kiện xảy ra đúng thời điểm đóng không được tính cho cờ mới
W21: Từ khóa tiền. Đề xuất: Bỏ ký tự trắng đầu cuối trước khi kiểm tra trùng; đếm theo NFC. Danh sách phải còn ít nhất 1 từ khóa
W22: Push của thông báo hệ thống; thời gian gửi. Đề xuất: Push hiện tiêu đề admin soạn. Mục tiêu tới đủ người nhận ≤ 5 phút (thay vì ≤ 60 giây như sự kiện của từng người)
W23: Bị gỡ nội dung khi đang đình chỉ. Đề xuất: Thành viên nhận thông báo (10) lúc được gỡ đình chỉ
W24: Bấm thông báo "nội dung bị gỡ". Đề xuất: Mở màn sửa hồ sơ của chính mình
W25: Link email của sự kiện (10) và (11) mở trên máy tính. Đề xuất: Mở trang hướng dẫn mở app, như sự kiện (5), (6)

Answer (W1–W25): theo đề xuất
