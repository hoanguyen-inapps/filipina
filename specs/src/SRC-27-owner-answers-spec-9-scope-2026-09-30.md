---
id: SRC-27
title: Owner answers SPEC-9 scope 2026-09-30
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-30
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:26702a66f8648e576592fbfc
---
Owner answers, admin scope (part 2, SPEC-9), 2026-09-30 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 23: "theo đề xuất" (line at the end).

V1: Xem gói của thành viên. Đề xuất: Admin Hỗ trợ và Cấp cao nhất xem được Subscription, các Payment và Refund của một thành viên. Không admin nào thấy số thẻ (thẻ nằm ở bộ xử lý thanh toán)
V2: Đặt giá. Đề xuất: Chỉ Cấp cao nhất đặt giá cho 3 thời hạn. Giá từ 1,00 đến 9.999,99 USD, tối đa 2 chữ số lẻ. Giá mới có hiệu lực ngay cho lần mua mới và lần đổi thời hạn mới; gói đang chạy giữ giá đã chốt (SPEC-5 R-04). Audit ghi giá cũ và giá mới
V3: Hoàn tiền. Đề xuất: Chỉ Cấp cao nhất, bắt buộc ghi lý do. Số tiền từ 0,01 USD tới phần còn lại của Payment (tính cả các lần hoàn đang chờ bộ xử lý xác nhận, để không hoàn vượt). Hoàn được cả khi tài khoản đã bị xóa hoặc bị cấm
V4: Cờ chargeback. Đề xuất: Chỉ Cấp cao nhất xử lý. Admin đóng cờ kèm lý do; khi đó lệnh chặn mua gói (PurchaseBlock) được gỡ. Nếu không muốn nam mua lại thì admin cấm tài khoản (SPEC-8), không có lựa chọn "giữ chặn mua mãi"
V5: Cờ "thu tiền muộn" (SPEC-5 R-07: admin chọn hoàn tiền hay kích hoạt lại). Đề xuất: Chỉ Cấp cao nhất, chọn một: (a) hoàn toàn phần Payment đó; (b) kích hoạt lại: tạo một Subscription Active mới, cùng thời hạn và giá đã chốt của gói cũ, kỳ bắt đầu lúc admin bấm. (b) chỉ làm được khi nam còn huy hiệu xanh, không có gói còn hiệu lực, không bị chặn mua, tài khoản Active, không bị đình chỉ hay cấm; không đủ điều kiện thì chỉ còn (a). Cả hai đều đóng cờ. Cần sửa SPEC-5
V6: Admin hủy hoặc đổi gói thay nam (SRC-18 J18 để lại). Đề xuất: Không có trong MVP. Nam tự làm trên website; admin chỉ hoàn tiền
V7: Xem yêu cầu và kết nối. Đề xuất: Hỗ trợ và Cấp cao nhất xem danh sách yêu cầu và kết nối của một thành viên (trạng thái, các thời điểm, người kết thúc). Admin không hủy yêu cầu, không kết thúc kết nối; cần can thiệp thì đình chỉ hoặc cấm (SPEC-4 đã xử lý hậu quả). Không cần sửa SPEC-4
V8: Xem và xuất tin nhắn (SRC-15 H12). Đề xuất: Hỗ trợ xem được cuộc trò chuyện liên quan tới một báo cáo hoặc cờ đáng ngờ đang mở. Cấp cao nhất xem và xuất ra CSV bất kỳ cuộc trò chuyện nào, bắt buộc ghi lý do (IMBRA, tranh chấp). Mọi lần xem, xuất đều ghi audit. Admin không sửa, không xóa tin nhắn
V9: Chặn. Đề xuất: Hỗ trợ và Cấp cao nhất xem danh sách chặn của mọi thành viên, cả hai chiều (người này chặn ai, ai chặn người này), kèm thời điểm. Admin không gỡ chặn được; chỉ người chặn tự bỏ
V10: Hàng chờ báo cáo. Đề xuất: Hỗ trợ và Cấp cao nhất xem hàng chờ báo cáo Open, cũ nhất trước, bằng nhau theo mã báo cáo. Hiện lý do, mô tả, bản sao nội dung, người báo cáo, người bị báo cáo. Không khóa khi một admin đang mở; hai admin cùng đóng thì người ghi trước thắng
V11: Đóng báo cáo. Đề xuất: Bắt buộc chọn kết quả "Không vi phạm" hoặc "Có vi phạm" và ghi chú không chỉ gồm ký tự trắng. Hành động (gỡ nội dung, đình chỉ, cấm) làm riêng, không tự chạy theo kết quả. Người báo cáo không được báo kết quả (SPEC-6 R-06)
V12: Gỡ nội dung. Đề xuất: Hỗ trợ và Cấp cao nhất gỡ được một ảnh hồ sơ hoặc phần giới thiệu (bio) của thành viên, kèm lý do. Tin nhắn không gỡ (lưu toàn bộ). Nếu sau khi gỡ hồ sơ thiếu ảnh hoặc bio thì hồ sơ thành chưa hoàn chỉnh: ẩn khỏi Lobby, không gửi được yêu cầu mới cho tới khi thành viên bổ sung; kết nối đang mở vẫn giữ. Bản sao trong báo cáo vẫn được lưu. Cần sửa SPEC-3
V13: Báo cho thành viên bị gỡ nội dung. Đề xuất: Có: thông báo trong app và email "một ảnh / phần giới thiệu của bạn đã bị gỡ vì vi phạm quy định", không nêu ai báo cáo. Thêm một sự kiện vào SPEC-7
V14: Hàng chờ cờ. Đề xuất: Một hàng chờ chung gồm cờ đáng ngờ (SPEC-6), cờ xác minh Failed và "Certn quá 14 ngày" (SPEC-2), cũ nhất trước. Hỗ trợ đóng cờ đáng ngờ; cờ của SPEC-2 cần vai trò Xác minh; cờ chargeback và thu tiền muộn chỉ Cấp cao nhất (V4, V5). Đóng cờ nào cũng bắt buộc lý do. Mỗi cờ đáng ngờ hiện các báo cáo hoặc tin nhắn đã gây ra nó
V15: Cờ đáng ngờ sau khi đóng. SPEC-6 R-12 hiện nay có thể tạo lại cờ ngay nếu cửa sổ 168/24 giờ vẫn đủ sự kiện. Đề xuất: Sau khi đóng, cờ mới cho cùng dấu hiệu chỉ tính các sự kiện xảy ra sau lúc đóng. Cần sửa SPEC-6
V16: Từ khóa tiền (SRC-20 L2). Đề xuất: Chỉ Cấp cao nhất thêm hoặc bớt. Mỗi từ khóa 1–50 ký tự, không chỉ gồm ký tự trắng, không trùng (không phân biệt hoa thường). Áp dụng cho tin gửi sau lúc lưu; tin cũ không tính lại
V17: Bài giáo dục văn hóa. Đề xuất: Chỉ Cấp cao nhất quản lý. Mỗi bài: tiêu đề (1–200 ký tự), nội dung văn bản có định dạng cơ bản (đậm, nghiêng, danh sách, link), tối đa 3 ảnh; không video trong MVP. Trạng thái: Nháp → Đã xuất bản → Đã gỡ (xuất bản lại được). Admin sắp thứ tự hiển thị
V18: Sửa và gỡ bài. Đề xuất: Sửa bài đang xuất bản không bắt ai đọc lại. Gỡ bài thì bài đó không còn tính vào điều kiện "mở hết các bài". Không gỡ được bài đang xuất bản cuối cùng (nếu không còn bài nào, thành viên mới bị kẹt, SPEC-3 AC-65). Người đã hoàn tất vẫn giữ hoàn tất
V19: Nội dung khác. Đề xuất: Cấp cao nhất sửa được văn bản các màn Our Story, Our Advice, giáo dục an toàn và cảnh báo lừa đảo; có hiệu lực ngay, không bắt ai bấm lại "Tôi đã hiểu". Danh sách mục tiêu quan hệ và sở thích (SPEC-3) không sửa trên màn admin trong MVP (khách cung cấp, đội phát triển cài)
V20: Thông báo hệ thống: ai gửi, gửi cho ai. Đề xuất: Chỉ Cấp cao nhất. Nhóm nhận: tất cả thành viên, chỉ nam, hoặc chỉ nữ; chỉ tài khoản Active không bị đình chỉ hay cấm, chốt lúc gửi (tài khoản tạo sau không nhận). Không gửi cho một thành viên riêng lẻ
V21: Kênh và nội dung. Đề xuất: Thông báo trong app luôn có; push và email là tùy chọn khi soạn. Tiêu đề 1–100 ký tự, nội dung 1–1000 ký tự, bằng tiếng Anh (SPEC-7 R-12). Gửi ngay, không hẹn giờ, không thu hồi sau khi gửi. Bấm vào mở màn chi tiết thông báo. Công tắc tắt push like/tin nhắn (SPEC-7) không áp dụng. Thêm một sự kiện vào SPEC-7
V22: Sửa các SPEC khác. Đề xuất: Như lần SPEC-8: các hành vi mới đi vào SPEC-3 (gỡ nội dung, bài giáo dục văn hóa), SPEC-5 (kích hoạt lại, gỡ chặn mua), SPEC-6 (đóng báo cáo, cờ sau khi đóng, từ khóa) và SPEC-7 (2 sự kiện mới) bằng bản sửa đổi; anh duyệt cả bộ cùng SPEC-9 bằng một lệnh
V23: Audit. Đề xuất: Mọi thao tác trong SPEC-9 ghi audit theo SPEC-8 R-16, kể cả mở xem báo cáo, tin nhắn và danh sách chặn

Answer (V1–V23): theo đề xuất
