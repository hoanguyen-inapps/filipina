---
id: SRC-14
title: Owner answers SPEC-3 review 2026-09-29
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-29
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-29
approved_hash: sha256:1ce06a3684a97c5f0c07d972
---
Owner answers, SPEC-3 review, 2026-09-29 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 17: "theo luôn đề xuất" (line at the end).

G1: Nam Freemium nhận like bằng cách nào? Đề xuất: Nữ được like lại nam từ danh sách "Đã thích bạn", dù chỉ thấy hồ sơ rút gọn; nam thấy nữ đó trong "Đã thích bạn" của mình
G2: Thứ tự trong journey có phải là điều kiện bắt buộc không? Đề xuất: Có, giữ như hiện tại: nữ vào Lobby cần hồ sơ và giáo dục văn hoá; nam tìm kiếm cần gói, hồ sơ và giáo dục văn hoá. Lý do: khách viết journey là "baseline"
G3: Một "lượt xem" tính thế nào? Đề xuất: Mỗi thẻ hồ sơ hiện trong Lobby tính một lượt, như hiện tại. Mở hồ sơ từ "Đã thích bạn" không tính lượt và luôn được mở
G4: Gói bắt đầu hoặc hết hạn giữa ngày; hai thiết bị cùng lúc. Đề xuất: Lượt xem trong lúc có gói không tính. Hết gói thì đếm từ 0 cho phần còn lại của ngày. Giới hạn 20 là tuyệt đối, kể cả khi hai thiết bị mở cùng lúc
G5: Ai bị ẩn khỏi Lobby và tìm kiếm? Đề xuất: Người không còn Approved, bị đình chỉ, bị cấm hoặc đã xoá tài khoản. Nữ chỉ hiện khi đã xong giáo dục văn hoá, vì chưa xong thì không nhận được yêu cầu liên hệ
G6: Sau khi hoàn thiện hồ sơ, sửa làm trống một trường bắt buộc. Đề xuất: Từ chối lưu. completedAt giữ nguyên
G7: "Chế độ hiển thị" trong C-16. Đề xuất: Có nút "Ẩn hồ sơ": ẩn khỏi Lobby và tìm kiếm; người đã like mình vẫn thấy
G8: Đếm 1000 ký tự của phần giới thiệu. Đề xuất: Đếm theo ký tự Unicode chuẩn NFC, như SPEC-1
G9: Tính tuổi khi lọc. Đề xuất: Theo ngày UTC như SPEC-1. Được nhập chỉ một đầu của dải tuổi. Không có giới hạn trên
G10: Sắp thứ tự giữa các hồ sơ chưa có điểm. Đề xuất: Hồ sơ hoàn thiện gần nhất đứng trước. Nếu cũng bằng nhau thì theo mã thành viên tăng dần
G11: SmartMatchApp trả điểm lẻ, hoặc điểm khác nhau theo từng chiều. Đề xuất: Làm tròn đến số nguyên gần nhất. Mỗi người thấy điểm theo chiều của mình. Chốt lại sau spike
G12: "Duyệt" khác Lobby thế nào? Đề xuất: "Duyệt" chính là Lobby không giới hạn. Nam có gói luôn xem Lobby không giới hạn; tìm kiếm và lọc mới cần đủ 3 điều kiện
G13: Nữ chưa vào được Lobby có xem được "Đã thích bạn" và like không? Đề xuất: Không. "Đã thích bạn" nằm trong Lobby, nên theo cùng điều kiện
G14: Khi chưa có bài giáo dục văn hoá nào được xuất bản. Đề xuất: Nút "Tôi đã đọc và đồng ý" không bấm được. Nếu bài được xuất bản hoặc gỡ khi thành viên mới đọc một phần, thành viên phải mở đủ các bài đang xuất bản tại lúc bấm nút
G15: Nam hết gói nhưng đã có hồ sơ hoàn chỉnh. Đề xuất: Vẫn hiện với nữ và vẫn sửa được hồ sơ. Quay lại giới hạn 20 lượt; mất tìm kiếm và điểm tương thích
G16: Audit log khi hoàn thiện và sửa hồ sơ. Đề xuất: Mỗi thao tác ghi 1 bản ghi (hoàn thiện hồ sơ kèm ảnh cũng chỉ 1 bản ghi); lưu giá trị cũ và mới
G17: Ai được làm giáo dục văn hoá, và khi nào? Đề xuất: Chỉ sau khi có hồ sơ hoàn chỉnh, theo journey. Nam Freemium và nữ chưa Approved thì chưa làm được

Answer (G1–G17): theo luôn đề xuất
