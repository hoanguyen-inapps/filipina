---
id: SRC-32
title: Owner answers DSN-1 technical decisions 2026-10-01
version: 1.0.0
status: draft
owner: Honda
kind: owner-answers
received: 2026-10-01
from: Honda
supersedes:
approved_by:
approved_at:
approved_hash:
---
Owner answers, DSN-1 technical decisions, 2026-10-01 (owner: Honda)

Each question was shown with a recommended answer ("Đề xuất") and alternatives, with the instruction to reply "theo đề xuất, trừ …". The owner replied once for all 5 (line at the end).

DEC-16: Băm mật khẩu. Đề xuất: (a) Argon2id, tham số OWASP. Cách khác: (b) bcrypt
DEC-17: Phiên đăng nhập. Đề xuất: (a) token phiên lưu ở máy chủ, kiểm mỗi request (SPEC-1 cần đăng xuất mọi thiết bị ngay). Cách khác: (b) JWT sống 15 phút + refresh token
DEC-18: Công cụ hạ tầng. Đề xuất: (a) AWS CDK (Apache-2.0, TypeScript). Cách khác: (b) OpenTofu (MPL-2.0); Terraform (BSL) không đề xuất
DEC-19: Lớp truy vấn cơ sở dữ liệu. Đề xuất: (a) Drizzle (SELECT … FOR UPDATE, advisory lock). Cách khác: (b) Prisma, (c) Kysely
DEC-20: Công cụ test. Đề xuất: (a) Jest (backend, app), Playwright (website), Detox (end-to-end app); tên test chứa mã AC. Cách khác: (b) Vitest, Playwright, Maestro

Answer (DEC-16–DEC-20): theo de xuất
