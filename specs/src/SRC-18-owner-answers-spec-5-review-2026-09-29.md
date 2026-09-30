---
id: SRC-18
title: Owner answers SPEC-5 review 2026-09-29
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-29
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-29
approved_hash: sha256:7005d78bef9b141090a6347b
---
Owner answers, SPEC-5 review, 2026-09-29 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 20: "theo đề xuất" (line at the end).

J1: "1 tháng" là tháng lịch hay 30 ngày? Đề xuất: Tháng lịch theo UTC. Nếu tháng sau không có ngày đó thì lấy ngày cuối tháng
J2: Huỷ gói khi đang PastDue. Đề xuất: Chuyển Ended ngay
J3: Kết quả từ bộ xử lý gửi trùng hoặc gửi muộn. Đề xuất: Bỏ qua. Riêng kết quả thu tiền thành công đến muộn thì theo J5
J4: Chargeback cho một khoản thu của gói cũ, hoặc của gói đã kết thúc. Đề xuất: Luôn gắn cờ cho admin và chặn mua lại. Nếu nam đang có gói còn hiệu lực thì gói đó cũng kết thúc ngay
J5: Thu tiền thành công nhưng kết quả đến sau khi hết 7 ngày thử lại. Đề xuất: Ghi nhận khoản thu và gắn cờ cho admin, để admin quyết định hoàn tiền hay kích hoạt lại; gói vẫn Ended
J6: Hai lần thanh toán cùng lúc đều bị trừ tiền. Đề xuất: Lần được xác nhận trước trở thành gói; lần sau tự động hoàn tiền toàn phần
J7: Hoàn toàn phần thì gói kết thúc khi nào? Đề xuất: Chỉ khi hoàn toàn phần khoản thu của kỳ hiện tại (với PastDue là kỳ vừa hết). Hoàn khoản thu cũ hơn không làm gói kết thúc
J8: "Toàn phần" có gồm thuế không? Đề xuất: Có: toàn phần là giá cộng thuế; thuế được hoàn cùng giá
J9: Hoàn tiền có hiệu lực khi nào? Đề xuất: Khi bộ xử lý xác nhận, không phải lúc admin bấm. Nhiều lần hoàn một phần mà cộng lại đủ số tiền thì tính là toàn phần. Không cho hoàn quá số tiền còn lại. Hai admin cùng hoàn một lúc thì người được ghi trước thắng
J10: Admin đổi giá. Đề xuất: Chỉ áp dụng cho lần mua mới; gói đang có giữ giá cũ khi gia hạn
J11: Đổi thời hạn khi đang Cancelling hoặc PastDue. Đề xuất: Không được. Đang Cancelling thì phải bật lại tự gia hạn trước
J12: Kỳ mới sau khi thu lại được tiền; đổi thẻ khi đang PastDue. Đề xuất: Kỳ mới vẫn tính từ ngày hết kỳ cũ. Đổi thẻ thì hệ thống thử thu ngay, và lần thử đó tính vào 3 lần
J13: Tài khoản bị đình chỉ hoặc bị cấm. Đề xuất: Tự gia hạn tắt (gói chuyển Cancelling), không tự hoàn tiền; admin hoàn tiền nếu muốn (SPEC admin)
J14: Giới hạn ≤ 60 giây có áp dụng khi gói kết thúc không? Đề xuất: Có: app nhận biết gói đã kết thúc (hoàn tiền, chargeback, hết kỳ thử lại, hết kỳ) trong ≤ 60 giây
J15: Mốc hết kỳ và mốc 7 ngày. Đề xuất: "Đúng mốc là đã qua", tính từ đúng thời điểm dù hệ thống chạy lúc nào (giống SPEC-1 C8). Hệ thống trễ tối đa 5 phút
J16: Huỷ, bật lại hoặc đổi sát giờ hết kỳ; bấm lặp lại. Đề xuất: Thao tác được ghi trước mốc hết kỳ thì thắng. Từ đúng mốc là đã muộn. Bấm lặp lại (huỷ khi đã huỷ, bật lại khi đang bật) thì bị từ chối kèm thông báo
J17: Audit có bản ghi "kết thúc gói" không? Đề xuất: Có, ghi cả kết thúc do hết kỳ, hết kỳ thử lại, hoàn toàn phần và chargeback
J18: Admin có huỷ hoặc đổi gói thay nam được không? Đề xuất: Để ở SPEC admin; trong SPEC-5 admin không làm được
J19: Huỷ, bật lại, đổi thời hạn trong app. Đề xuất: Trong app có nút mở trang tài khoản trên website; các thao tác này làm trên website
J20: Rà soát chính sách store trước hay sau khi duyệt SPEC-5? Đề xuất: Duyệt SPEC-5 trước (anh đã chấp nhận ở SRC-17). Nếu Apple/Google không cho, sửa qua change flow

Answer (J1–J20): theo đề xuất
