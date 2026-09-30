---
id: SRC-17
title: Owner answers payments scope 2026-09-29
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-29
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-29
approved_hash: sha256:ff991829c82a97208b259837
---
Owner answers, payments and membership scope, 2026-09-29 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …"; P2 had blanks for prices and the fallback "Nếu chưa có, tôi ghi thành giả định". The owner replied: "theo đề xuất, theo giả định" (lines at the end).

P1: Có những gói nào? Đề xuất: Một gói, bán theo 3 thời hạn: 1 tháng, 3 tháng, 12 tháng. Các thời hạn có cùng quyền lợi, chỉ khác giá. Nếu khách muốn các gói khác nhau về quyền lợi, anh mô tả giúp
P2: Giá mỗi thời hạn (USD). Đề xuất: 1 tháng: ___ · 3 tháng: ___ · 12 tháng: ___. Nếu chưa có, tôi ghi thành giả định: khách cung cấp giá trước khi viết DSN; admin chỉnh giá theo SPEC admin
P3: Tự gia hạn. Đề xuất: Có: cuối kỳ tự gia hạn đúng thời hạn đã chọn, cho tới khi nam huỷ
P4: Huỷ gói. Đề xuất: Huỷ có hiệu lực vào cuối kỳ đã trả. Không hoàn tiền phần còn lại. Nam bật lại tự gia hạn được trước khi hết kỳ
P5: Hoàn tiền. Đề xuất: Không có hoàn tiền tự động. Chỉ admin hoàn tiền, toàn phần hoặc một phần, theo trang Refund Policy của khách. Hoàn toàn phần thì gói kết thúc ngay
P6: Thanh toán gia hạn thất bại. Đề xuất: Thử lại tối đa 3 lần trong 7 ngày; trong 7 ngày đó gói vẫn hiệu lực. Hết 7 ngày vẫn thất bại thì gói hết hạn
P7: Chargeback (khách khiếu nại với ngân hàng). Đề xuất: Gói kết thúc ngay. Tài khoản bị gắn cờ cho admin. Nam không mua lại được cho tới khi admin xử lý xong
P8: Đổi thời hạn gói. Đề xuất: Đổi được; có hiệu lực từ kỳ gia hạn tiếp theo, không tính chênh lệch giữa kỳ
P9: Mua từ trong app. Đề xuất: Nút "Mua gói" trong app mở trình duyệt của điện thoại tới trang mua trên website. Thanh toán xong, app nhận biết gói trong ≤ 60 giây. Việc app có được hiện nút này hay không tuỳ chính sách Apple/Google (RISK-01) và cần luật sư hoặc DSN xác nhận
P10: Quản lý tài khoản trên website (C-15). Đề xuất: Xem gói đang dùng, ngày gia hạn tiếp theo, huỷ hoặc bật lại tự gia hạn, đổi thẻ, xem và tải biên nhận
P11: Tiền tệ và thuế. Đề xuất: Chỉ dùng USD. Giá niêm yết chưa gồm thuế; thuế (nếu có) do bộ xử lý thanh toán tính khi thanh toán
P12: Dùng thử, mã giảm giá. Đề xuất: Không có trong MVP
P13: Mua lại sau khi gói hết hạn. Đề xuất: Mua lại lúc nào cũng được, miễn vẫn còn huy hiệu xanh
P14: Audit và biên nhận. Đề xuất: Ghi audit cho mua gói, gia hạn, huỷ, bật lại, đổi thời hạn, hoàn tiền, thanh toán thất bại và chargeback. Gửi email biên nhận sau mỗi lần thu tiền
P15: Nữ. Đề xuất: Nữ không thấy trang mua gói và không mua được

A (P1, P3–P15): theo đề xuất
A2 (P2): theo giả định
