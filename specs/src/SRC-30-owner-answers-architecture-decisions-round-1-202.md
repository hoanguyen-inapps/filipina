---
id: SRC-30
title: Owner answers architecture decisions round 1 2026-09-30
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
Owner answers, architecture decisions (design round 1), 2026-09-30 (owner: Honda)

Each question was shown with 2–4 options, the recommended one first ("Đề xuất"). The owner's reply is copied verbatim at the end, one line per answer; Y1 was not answered.

Y1: Chia DSN. Đề xuất: 6 DSN duyệt lần lượt: DSN-1 nền tảng chung + tài khoản (SPEC-1); xác minh (SPEC-2); hồ sơ, khám phá, kết nối + SmartMatchApp (SPEC-3, SPEC-4); thanh toán (SPEC-5); an toàn và thông báo (SPEC-6, SPEC-7); admin (SPEC-8, SPEC-9). Cách khác: một DSN duy nhất
Y2: App di động. (a) Flutter (đề xuất, theo K-01) · (b) React Native
Y3: Backend của mình. (a) TypeScript + NestJS (đề xuất) · (b) Python FastAPI · (c) Go
Y4: Website thành viên và website admin. (a) Next.js, hai app riêng với hai địa chỉ riêng (đề xuất)
Y5: Cơ sở dữ liệu. (a) PostgreSQL (đề xuất) · (b) MySQL
Y6: Cloud (tài khoản của khách). (a) AWS: RDS Postgres, S3 mã hóa KMS, SES email, ECS Fargate (đề xuất) · (b) Google Cloud · (c) Azure
Y7: Vai trò SmartMatchApp. (a) SmartMatchApp giữ dữ liệu gốc của hồ sơ, like, tin nhắn · (b) backend của mình giữ dữ liệu gốc và mọi rule, SmartMatchApp sau một adapter lo ghép đôi và điểm tương thích, chốt phạm vi sau spike (đề xuất)
Y8: Dịch vụ xác minh danh tính. (a) Persona (đề xuất) · (b) Veriff · (c) Onfido; CENOMAR vẫn do admin duyệt tay
Y9: Bộ xử lý thanh toán. (a) Stripe Billing, hỏi Stripe xác nhận ngành hẹn hò quốc tế trước (đề xuất) · (b) bộ xử lý nhận ngành rủi ro cao như CCBill hoặc Segpay
Y10: Push và email. (a) Firebase Cloud Messaging (push) + Amazon SES (email) (đề xuất)
Y11: Nhắn tin thời gian thực. (a) WebSocket ngay trong backend, kèm push khi app đóng (đề xuất) · (b) dịch vụ ngoài như Ably hoặc Pusher
Y12: Việc hẹn giờ. (a) hàng đợi job trong PostgreSQL (graphile-worker) (đề xuất) · (b) Redis + BullMQ · (c) AWS SQS
Y13: Giấy tờ xác minh. (a) Bucket S3 riêng, riêng tư, mã hóa KMS; chỉ mở qua link ký tạm 5 phút cho admin Xác minh; mỗi lần mở ghi audit (đề xuất)
Y14: Audit log. Đề xuất: bảng chỉ-thêm trong PostgreSQL (tài khoản ứng dụng không có quyền UPDATE/DELETE), mỗi ngày sao ra S3 Object Lock; thời hạn lưu giữ chờ luật sư của khách
Y15: Repo và môi trường. Đề xuất: một monorepo trong GitHub organization của khách (mobile, web, admin, api, gói dùng chung); ba môi trường dev, staging, production; mọi thư viện có license không copyleft (K-13)

Answer (verbatim):
Y2:b
Y3:a
Y4:a
Y5:a
Y6:a
Y7:a
Y8:a
Y9:b
Y10:a
Y11:a
Y12:c
Y13:a
Y14 & Y15 theo đề xuát
