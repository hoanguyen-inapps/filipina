---
id: SRC-21
title: Owner answers SPEC-4 revision 2026-09-29
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-29
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-29
approved_hash: sha256:509809e4f2ab53476ab7fb29
---
Owner answers, SPEC-4 revision 0.2.0 review, 2026-09-29 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 7: "theo đề xuất" (line at the end).

M1: Lệnh cấm vĩnh viễn sau khi bỏ chặn có áp dụng cả khi lúc chặn hai người chưa có yêu cầu hay kết nối nào không? (ví dụ nam chặn một nữ mới thấy trong tìm kiếm) Đề xuất: Có: mọi lần chặn, sau khi bỏ chặn nam không bao giờ gửi yêu cầu cho người đó được
M2: Nam đã rút lại yêu cầu (chờ 30 ngày) hoặc yêu cầu đã hết hạn tự nhiên, sau đó có chặn rồi bỏ chặn. Đề xuất: Lệnh cấm vĩnh viễn thay cho thời hạn 30 ngày
M3: Nam thấy gì về yêu cầu đã hết hạn do chặn? Đề xuất: Trong lúc đang chặn: không thấy yêu cầu đó. Sau khi bỏ chặn: thấy "Không được chấp nhận", dù ai là người chặn
M4: Chặn đến sát sau một thao tác khác (chấp nhận, rút lại, từ chối, kết thúc). Đề xuất: Việc chặn luôn được áp dụng lên trạng thái mới nhất. Ví dụ kết nối vừa mở thì chuyển Ended. Tôi sẽ sửa SPEC-6/R-18 cho khớp: việc chặn không bao giờ bị từ chối vì đến sau
M5: Chặn sau mốc 336 giờ nhưng hệ thống chưa kịp chuyển yêu cầu sang Expired. Đề xuất: Yêu cầu hết hạn do "hệ thống" tại đúng mốc 336 giờ. Việc chặn vẫn được áp dụng và vẫn tạo lệnh cấm
M6: Xác nhận trường hợp: nam chặn nữ khi yêu cầu của nam đang chờ, 40 ngày sau bỏ chặn. Đề xuất: Người thực hiện ghi là nam; yêu cầu mới của nam bị từ chối. Tôi sẽ thêm AC cho trường hợp này và cho trường hợp nữ chặn khi đang có kết nối
M7: Nam thấy thông báo gì khi bị từ chối gửi lại? Đề xuất: Dùng cùng một thông báo "Không thể gửi yêu cầu cho người này" cho mọi trường hợp (sau khi bị từ chối, kết thúc, hết hạn, chặn), để nam không đoán được là mình đã bị chặn

Answer (M1–M7): theo đề xuất
