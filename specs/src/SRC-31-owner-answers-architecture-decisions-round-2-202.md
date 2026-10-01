---
id: SRC-31
title: Owner answers architecture decisions round 2 2026-09-30
version: 1.0.0
status: draft
owner: Honda
kind: owner-answers
received: 2026-09-30
from: Honda
supersedes:
approved_by:
approved_at:
approved_hash:
---
Owner answers, architecture decisions (design round 2), 2026-09-30 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất") and an alternative ("Cách khác"). The owner's reply is copied verbatim at the end.

Z1: Chia DSN (Y1 chưa trả lời). Đề xuất: 6 DSN duyệt lần lượt như Y1, bắt đầu DSN-1 nền tảng chung + tài khoản (SPEC-1). Cách khác: một DSN duy nhất cho cả 9 SPEC
Z2: Hệ quả Y7 (a) SmartMatchApp giữ dữ liệu gốc hồ sơ, like, tin nhắn; backend của mình đứng trước để kiểm rule rồi ghi sang SmartMatchApp. Đề xuất: DSN-1 làm ngay (không phụ thuộc SmartMatchApp); spike SmartMatchApp phải xong trước DSN-3; mọi chỗ dựa vào SmartMatchApp ghi là "chờ spike"
Z3: Y9 (b) chọn CCBill hay Segpay. Đề xuất: CCBill, kèm spike ngắn kiểm hoàn tiền một phần, thử lại 3 lần/7 ngày, đổi thời hạn từ kỳ sau, giữ giá đã chốt, thuế; chỗ nào không làm được thì sửa SPEC-5 qua change flow. Cách khác: Segpay
Z4: Y12 (c) SQS chỉ hoãn tối đa 15 phút, mốc dài tới 336 giờ. Đề xuất: lưu các mốc trong PostgreSQL; mỗi phút EventBridge Scheduler kích một lượt quét đẩy việc tới hạn vào SQS cho worker. Cách khác: một lịch EventBridge riêng cho mỗi mốc
Z5: Y2 (b) React Native: Expo hay React Native thuần. Đề xuất: Expo (build EAS, cập nhật qua mạng, thư viện push). Cách khác: React Native thuần

Answer (verbatim):
Z1,2: theo đề xuất
Z3: chưa chốt
Z4: Cách khác
Z5: cách khác
