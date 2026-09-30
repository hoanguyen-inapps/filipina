---
id: SRC-16
title: Owner answers SPEC-4 review 2026-09-29
version: 1.0.0
status: approved
owner: Honda
kind: owner-answers
received: 2026-09-29
from: Honda
supersedes:
approved_by: Honda
approved_at: 2026-09-29
approved_hash: sha256:7b319dc7808472eeaca37c89
---
Owner answers, SPEC-4 review, 2026-09-29 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất"), with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 14: "theo đề xuất" (line at the end).

I1: Hai thao tác trên cùng một yêu cầu đang chờ đến cùng lúc. Đề xuất: Thao tác được ghi trước thắng; thao tác sau bị từ chối
I2: Một bên xoá tài khoản, bị đình chỉ hoặc bị cấm. Đề xuất: Yêu cầu đang chờ chuyển Expired; kết nối đang mở chuyển Ended; tin nhắn vẫn lưu
I3: Đã qua mốc 14 ngày nhưng hệ thống chưa chuyển yêu cầu sang Expired. Đề xuất: Từ đúng mốc 14 ngày, chấp nhận, từ chối và rút lại đều bị từ chối. Hệ thống trễ tối đa 5 phút. Bản ghi audit ghi người thực hiện là "hệ thống"
I4: Thao tác trên yêu cầu đã hết chờ (đã rút, hết hạn, đã chấp nhận), hoặc kết thúc một kết nối đã Ended. Đề xuất: Bị từ chối, hiện "Yêu cầu này không còn hiệu lực" hoặc "Kết nối đã kết thúc"
I5: Nam hết gói khi yêu cầu còn chờ. Đề xuất: Các yêu cầu đang chờ của nam chuyển sang Expired ngay
I6: Sau khi yêu cầu hết hạn. Đề xuất: Nam gửi lại cho nữ đó được sau 30 ngày (giống khi rút lại). Nam thấy "Không được chấp nhận" cho cả trường hợp bị từ chối lẫn hết hạn, để không biết nữ đã bỏ qua. Nữ không còn thấy các yêu cầu đã rút hoặc đã hết hạn
I7: Sau khi kết thúc kết nối. Đề xuất: Nam không bao giờ gửi lại yêu cầu cho nữ đó được, dù bên nào kết thúc
I8: Tin nhắn sau khi kết thúc kết nối. Đề xuất: Cả hai vẫn đọc được lịch sử tin nhắn. Không sửa được tin đã gửi. Thời hạn lưu do luật sư của khách quyết định (BRIEF-1/K-08)
I9: Đếm 2000 ký tự của tin nhắn. Đề xuất: Đếm theo ký tự Unicode chuẩn NFC. Tin chỉ gồm ký tự trắng bị từ chối. Không cắt dấu cách đầu và cuối
I10: Yêu cầu nào tính vào giới hạn 15 mỗi ngày. Đề xuất: Yêu cầu đã rút vẫn tính; lần gửi bị từ chối thì không tính. Gửi đồng thời vẫn giữ đúng giới hạn và quy tắc mỗi cặp một yêu cầu: chỉ một lần gửi thành công
I11: "Nam có gói" nghĩa là gì? Đề xuất: Kỳ đã trả tiền chưa hết, kể cả khi đã huỷ gói. Lúc gửi yêu cầu, tài khoản phải Active và xác minh phải còn Approved
I12: Tính 14 ngày và 30 ngày thế nào? Đề xuất: Theo giờ đã trôi qua (336 giờ và 720 giờ); đúng mốc là đã qua
I13: Kết thúc kết nối đúng lúc có tin nhắn gửi đến, hoặc cả hai cùng bấm kết thúc. Đề xuất: Thao tác ghi trước thắng. Nếu cả hai cùng bấm, lưu người được ghi trước làm người kết thúc
I14: Quyền của admin với yêu cầu và kết nối. Đề xuất: Trong SPEC-4 admin chỉ xem. Kết thúc kết nối, huỷ yêu cầu hay gỡ chặn thuộc SPEC admin

Answer (I1–I14): theo đề xuất
