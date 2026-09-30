---
id: SRC-20
title: Owner answers SPEC-6 review 2026-09-29
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-29
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-29
approved_hash: sha256:0e7989ac1984eacbf636900d
---
Owner answers, SPEC-6 review, 2026-09-29 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 23: "theo đề xuất" (line at the end).

L1: Chữ số cách nhau bởi dấu cách, gạch ngang, chấm, ngoặc. Đề xuất: Vẫn tính là liền nhau
L2: Danh sách từ khoá tiền. Đề xuất: Admin thêm và bớt được (SPEC admin)
L3: Cờ lặp lại cho cùng dấu hiệu. Đề xuất: Mỗi tài khoản tối đa một cờ đang mở cho mỗi dấu hiệu
L4: Chặn khi đang có yêu cầu hoặc kết nối; sau khi bỏ chặn. Đề xuất: Yêu cầu chuyển Expired, kết nối chuyển Ended; người thực hiện ghi là người chặn. Sau khi bỏ chặn, nam không bao giờ gửi lại yêu cầu cho người đó được, dù ai là người chặn. (Cần sửa SPEC-4 qua change flow)
L5: Chặn rồi còn báo cáo được không? Đề xuất: Được. Cả hai vẫn đọc được lịch sử tin nhắn cũ (theo SPEC-4/R-14). Người chặn vẫn báo cáo được tin nhắn cũ và hồ sơ của người bị chặn từ cuộc trò chuyện cũ
L6: Admin xem danh sách chặn. Đề xuất: Được, ở SPEC admin. Trong SPEC-6 chỉ thành viên khác bị từ chối
L7: Chỉ nhắc tên nền tảng (ví dụ "WhatsApp me"). Đề xuất: Không tính, phải có số, tên tài khoản hoặc link đi kèm. Tránh báo nhầm những câu như "drop me a line"
L8: Lưu bio bị từ chối vì có thông tin liên lạc có tính vào dấu hiệu (c) không? Đề xuất: Có
L9: Báo cáo bị từ chối (vượt 20 lần hoặc thiếu lý do) mà đã chọn "chặn luôn". Đề xuất: Vẫn chặn (việc chặn không giới hạn số lần)
L10: Người bị chặn thấy gì khi thao tác? Người chặn có thao tác với người bị chặn được không? Đề xuất: Người bị chặn thấy thông báo chung "Không thể thực hiện", giống khi hồ sơ bị ẩn hoặc không còn tồn tại. Người chặn cũng không thao tác được, phải bỏ chặn trước
L11: Màn giáo dục an toàn. Đề xuất: Hiện lại cho tới khi bấm "Tôi đã hiểu". Sau khi bấm, yêu cầu hoặc việc chấp nhận tự đi tiếp. Thời điểm chấp nhận là lúc bấm "Tôi đã hiểu"; nếu lúc đó đã quá mốc 336 giờ thì bị từ chối
L12: Cửa sổ thời gian và "cùng nội dung". Đề xuất: "7 ngày" là 168 giờ trượt; đúng mốc 168 giờ hoặc 24 giờ là đã ra ngoài cửa sổ. "Cùng nội dung" là giống hệt sau khi bỏ khoảng trắng đầu cuối và không phân biệt hoa thường. Một tin có nhiều từ khoá tiền chỉ tính là 1
L13: Kháng nghị được chấp nhận. Đề xuất: Việc khôi phục tài khoản do admin làm ở SPEC admin; kết nối cũ không được khôi phục. Kháng nghị chỉ gồm khoảng trắng bị từ chối. Đếm ký tự theo NFC
L14: Chặn hai lần; chặn lại sau khi bỏ chặn; hai bên cùng chặn nhau. Đề xuất: Chặn lần hai không có tác dụng và không ghi audit mới. Được chặn lại sau khi bỏ chặn. Hai lượt chặn của hai bên độc lập với nhau
L15: Giới hạn 20 báo cáo. Đề xuất: Lần gửi bị từ chối không tính. Gửi đồng thời vẫn giữ đúng giới hạn 20
L16: So khớp từ khoá tiền. Đề xuất: Khớp nguyên từ ("bank" không khớp "bankrupt")
L17: Link nào tính là thông tin liên lạc? Kiểm tra những trường nào? Đề xuất: Mọi link (http, www, tên miền) đều tính. Chỉ kiểm tra bio; không kiểm tra tên và thành phố
L18: Nội dung bị báo cáo. Đề xuất: Lưu bản sao nội dung tại lúc báo cáo. Không báo cáo được nội dung của chính mình
L19: Màn giáo dục an toàn có phần cảnh báo lừa đảo không? Đề xuất: Có, luôn có (theo K7(3))
L20: "Đã từng thấy" gồm những đâu? Đề xuất: Gồm cả kết quả tìm kiếm và hồ sơ đã mở
L21: Audit thêm. Đề xuất: Ghi thêm việc bấm "Tôi đã hiểu" (đồng ý), và các yêu cầu hết hạn hoặc kết nối kết thúc do chặn (người thực hiện là người chặn)
L22: Chặn đúng lúc có tin nhắn, yêu cầu hoặc like gửi đến. Đề xuất: Thao tác được ghi trước thắng (như SPEC-4/R-18)
L23: Mô tả báo cáo. Đề xuất: Đếm theo NFC. Mô tả chỉ gồm khoảng trắng coi như để trống

Answer (L1–L23): theo đề xuất
