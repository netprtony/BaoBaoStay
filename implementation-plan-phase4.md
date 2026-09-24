# Implementation Plan — Phase 4: Unit Test & Bảo Mật (Production Readiness)

> Stack triển khai: Next.js (App Router) + Supabase + **Cloudflare Pages**. Phase này không thêm tính năng mới, mục tiêu là đảm bảo các nghiệp vụ cốt lõi (Phase 1-3) chạy đúng khi vận hành thật và không rò rỉ dữ liệu giữa các org.

---

## 0. Ảnh hưởng của Cloudflare Pages đến chiến lược test

Cloudflare Pages chạy Next.js qua **Edge Runtime** (`@cloudflare/next-on-pages`), khác Node.js runtime thông thường của Vercel — điều này ảnh hưởng trực tiếp đến cách chọn công cụ test và những gì cần kiểm tra thêm:

- **Không có Node.js APIs đầy đủ** (`fs`, `net`, một số package Node-only) ở Edge Runtime → `middleware.ts` và mọi Server Action chạy trên edge phải dùng API tương thích Web Standard (`fetch`, `crypto.subtle`...) — cần test riêng để đảm bảo build không lỗi khi deploy (lỗi này **không xuất hiện khi chạy `next dev` local**, chỉ lộ ra khi build cho Cloudflare)
- **Secrets/env vars:** Cloudflare Pages tách biệt biến môi trường theo Production/Preview — cần test rằng `SUPABASE_SERVICE_ROLE_KEY` (dùng ở webhook thanh toán, mời tenant portal) **không bao giờ** lọt vào bundle client (khác với `NEXT_PUBLIC_*`)
- **Đề xuất công cụ:** **Vitest** thay vì Jest — khởi động nhanh hơn, hỗ trợ ESM/Edge Runtime tốt hơn, cấu hình gần giống Next.js hiện đại

---

## Phase 4A — Hạ tầng testing

### 4A.1 Cài đặt & cấu trúc
```bash
npm i -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @edge-runtime/vm
```
```
├── vitest.config.ts
├── tests/
│   ├── unit/            # Logic thuần (tính hóa đơn, validate, plan limits)
│   ├── integration/     # Gọi Supabase local thật (RLS, constraints)
│   ├── security/        # Test riêng cho các kịch bản tấn công/bypass
│   └── fixtures/        # Seed data, factory tạo user/org/room test
```

### 4A.2 Môi trường test cho phần liên quan Supabase
- [ ] Dùng **Supabase CLI local** (`supabase start`) — chạy Postgres + Auth + RLS thật trong Docker, tách biệt hoàn toàn DB production
- [ ] Script `tests/fixtures/seed.ts`: tạo nhanh 2-3 org độc lập kèm user (owner/staff/tenant) với JWT thật để test đa tenant — **bắt buộc** vì mock client không thể verify RLS thật
- [ ] CI (GitHub Actions/Cloudflare CI): chạy `supabase start` trong pipeline trước khi test integration, teardown sau khi xong

### 4A.3 Phân loại test theo mức độ ưu tiên
| Loại | Công cụ | Mục đích |
|---|---|---|
| Unit (logic thuần, không cần DB) | Vitest | Công thức tính hóa đơn, validate input, plan-limit logic |
| Integration (cần Postgres thật) | Vitest + Supabase local | RLS, FK constraints, trigger `sync_room_status` |
| Security | Vitest + kịch bản tấn công thủ công | Chống bypass RLS, chống forge webhook, chống vượt rate limit |

---

## Phase 4B — Unit test nghiệp vụ cốt lõi (ưu tiên theo tần suất dùng thực tế)

### 4B.1 Tính hóa đơn điện/nước — **rủi ro cao nhất nếu sai, ảnh hưởng tiền thật**
```ts
// tests/unit/invoice-calculation.test.ts
describe("calculateInvoiceAmount", () => {
  it("tính đúng tiền điện khi số mới > số cũ bình thường");
  it("tính đúng khi đổi công tơ (checkbox reset, số mới < số cũ cũ)");
  it("làm tròn tiền đúng quy tắc (không làm tròn sai gây lệch vài đồng)");
  it("throw error khi electricity_new < electricity_old mà không đánh dấu đổi công tơ");
  it("cộng đúng other_fees vào total_amount");
});
```

### 4B.2 Ràng buộc xóa dữ liệu (`can_delete_room`, `can_delete_tenant`, `can_delete_property` — Phase 2A)
```ts
describe("Room deletion constraints", () => {
  it("chặn xóa phòng đang có lease status = active");
  it("cho phép xóa phòng chỉ có lease đã terminated, kèm cảnh báo mất utility_readings");
  it("chặn xóa property còn room, kể cả room status = available");
});
describe("Tenant deletion constraints", () => {
  it("chặn xóa tenant có bất kỳ lease nào, kể cả đã kết thúc");
});
```

### 4B.3 Trigger đồng bộ trạng thái phòng
```ts
it("tự động set room.status = occupied khi tạo lease active");
it("tự động set room.status = available khi lease chuyển sang terminated, nếu không còn lease active khác");
it("không cho tạo 2 lease active cùng room_id (unique partial index)");
```

### 4B.4 Feature gating theo gói đăng ký (Phase 3A) — nghiệp vụ ảnh hưởng doanh thu
```ts
describe("assertCanCreateRoom", () => {
  it("org gói Free tạo phòng thứ 6 → bị chặn");
  it("org gói Basic tạo phòng thứ 31 → bị chặn");
  it("org gói VIP tạo phòng thứ 1000 → không chặn (max_rooms = null)");
  it("org past_due quá 7 ngày → chặn tạo mới nhưng vẫn đọc được dữ liệu cũ");
});
```

### 4B.5 Cổng khách thuê — luồng dùng nhiều nhất phía tenant
```ts
describe("Tenant portal", () => {
  it("tenant chỉ xem được invoices của chính lease mình, không thấy invoices tenant khác cùng org");
  it("utility_readings trả về chỉ từ period >= lease.start_date");
  it("tenant update profile chỉ sửa được full_name, không sửa được phone/id_card_number");
  it("đổi mật khẩu thành công → session cũ trên thiết bị khác bị invalidate (nếu áp dụng)");
});
```

### 4B.6 Đánh dấu thanh toán hóa đơn
```ts
it("mark invoice as paid → set paid_at, không cho set lại status = unpaid sau khi đã paid quá X ngày (tránh sửa lịch sử tài chính tùy tiện)");
```

---

## Phase 4C — Security test (RLS & multi-tenant isolation)

> Đây là nhóm test **quan trọng nhất** của cả phase — một lỗi RLS có thể để lộ dữ liệu tài chính/CCCD của org này sang org khác.

### 4C.1 Ma trận test RLS bắt buộc cho MỌI bảng nghiệp vụ
Với mỗi bảng (`properties`, `rooms`, `tenants`, `leases`, `invoices`, `invoice_items`, `utility_readings`, `subscription_payments`):
- [ ] User org A **không** SELECT được row thuộc org B (kể cả qua join/nested select)
- [ ] User org A **không** UPDATE/DELETE được row thuộc org B (kể cả biết chính xác `id` — test bằng cách gọi trực tiếp API với id có thật của org B)
- [ ] Staff (không phải Owner) **không** thực hiện được hành động chỉ dành cho Owner (nếu có phân quyền role trong org)
- [ ] Tenant (qua `get_auth_tenant_id()`) chỉ đọc được, **không** ghi được vào `invoices`/`leases`/`utility_readings`

### 4C.2 Superadmin — quyền đọc chéo org nhưng KHÔNG được ghi bừa
```ts
describe("Superadmin RLS", () => {
  it("is_platform_admin() = true → SELECT được properties của mọi org");
  it("superadmin KHÔNG insert/update/delete được invoices qua client API thông thường (chỉ qua Server Action dùng service role có audit log)");
  it("non-admin user không tự set được mình vào bảng platform_admins");
});
```

### 4C.3 Webhook thanh toán (VNPay/Momo) — điểm dễ bị giả mạo nhất
```ts
describe("Payment webhook security", () => {
  it("từ chối request không có chữ ký hợp lệ (invalid checksum)");
  it("từ chối request với amount không khớp subscription_payments.amount đã tạo trước đó");
  it("idempotent: gọi webhook 2 lần cùng txn_id không cộng dồn/kích hoạt gói 2 lần");
  it("chỉ chấp nhận request từ IP/range hợp lệ nếu gateway hỗ trợ whitelist IP");
});
```

### 4C.4 Auth & session
```ts
it("middleware chặn truy cập /dashboard khi chưa đăng nhập");
it("middleware chặn truy cập /admin nếu user không có trong platform_admins");
it("org bị is_suspended = true → mọi user thuộc org không đăng nhập được (hoặc bị logout ngay)");
it("JWT hết hạn → tự động refresh qua middleware, không văng người dùng ra ngoài bất ngờ");
```

---

## Phase 4D — Hardening bổ sung (không phải test, nhưng cần làm cùng phase)

### 4D.1 Validate input ở Server Action (không chỉ dựa vào form validation phía client)
- [ ] Dùng **Zod** cho toàn bộ input của Server Actions (tạo room, tạo lease, tạo invoice...) — client validate chỉ là UX, server luôn phải re-validate
- [ ] Giới hạn độ dài chuỗi, format số điện thoại/CCCD, chặn XSS trong các trường text tự do (VD: `description`, `notes`)

### 4D.2 Rate limiting & chống brute-force (tận dụng Cloudflare)
- [ ] Bật **Cloudflare Rate Limiting Rules** cho `/login`, `/portal/login`, `/api/webhooks/*` (giới hạn số request/IP/phút)
- [ ] Thêm **Cloudflare Turnstile** (CAPTCHA không cần người dùng tick) ở form đăng nhập/đăng ký để chặn bot đăng ký hàng loạt trục lợi gói Free
- [ ] Giới hạn số lần đăng nhập sai ở tầng Supabase Auth (đã có sẵn cơ chế, cần xác nhận cấu hình threshold phù hợp)

### 4D.3 File upload (hợp đồng PDF, ảnh nhà trọ)
- [ ] Validate MIME type thật (không chỉ dựa vào đuôi file) trước khi upload lên Supabase Storage
- [ ] Giới hạn dung lượng file, scan tên file tránh path traversal
- [ ] Storage bucket policy: đảm bảo file hợp đồng của org A không truy cập được qua URL đoán được của org B (signed URL có thời hạn, không public bucket)

### 4D.4 HTTP Security Headers (qua Cloudflare Pages `_headers`)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; ...
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```
- [ ] Test bằng công cụ (VD: Mozilla Observatory / securityheaders.com) sau khi deploy staging

### 4D.5 Dependency & secret scanning
- [ ] Bật `npm audit` / Dependabot trong CI, fail build nếu có lỗ hổng mức High/Critical chưa fix
- [ ] Kiểm tra không có secret (service role key, VNPAY_HASH_SECRET) bị commit nhầm vào git — dùng `gitleaks` hoặc tương tự trong pre-commit hook

---

## Phase 4E — Tích hợp CI/CD (chặn deploy nếu test/bảo mật fail)

- [ ] GitHub Actions pipeline: `lint → unit test → integration test (Supabase local) → security test → build (next-on-pages) → deploy Cloudflare Pages`
- [ ] Deploy **preview** tự động cho mỗi PR (Cloudflare Pages hỗ trợ sẵn), chỉ merge vào `master`/deploy production khi toàn bộ test pass
- [ ] Coverage tối thiểu đề xuất: **80%** cho `lib/subscription/`, `lib/trial/`, và các Server Actions liên quan tiền (invoice, payment) — không yêu cầu coverage cao cho UI component thuần hiển thị

---

## Tổng hợp thứ tự triển khai

| Phase | Nội dung | Phụ thuộc |
|---|---|---|
| 4A | Setup Vitest + Supabase local + cấu trúc test | Không |
| 4B | Unit test nghiệp vụ cốt lõi (tính hóa đơn, ràng buộc xóa, plan limit, tenant portal) | 4A |
| 4C | Security test RLS đa tenant, superadmin, webhook thanh toán | 4A, cần data từ Phase 2/3 |
| 4D | Hardening: validate input, rate limit, file upload, security headers | Độc lập, làm song song 4B/4C |
| 4E | CI/CD gate trước khi deploy Cloudflare Pages | 4A-4D hoàn thành cơ bản |

## Rủi ro cần lưu ý
- Test RLS bằng Supabase local **bắt buộc phải dùng JWT thật của từng user**, không được mock `auth.uid()` bằng cách set biến trực tiếp — nếu không, test sẽ pass giả (false positive) mà không phản ánh đúng hành vi RLS khi chạy production
- `next-on-pages` đôi khi có hành vi khác `next dev`/`next build` thông thường (đặc biệt với Server Actions dùng `cookies()`/`headers()`) — nên luôn build thử bằng lệnh build thật của Cloudflare (`npx @cloudflare/next-on-pages`) trong CI, không chỉ tin tưởng `next build` chạy pass là đủ
- Rate limiting/Turnstile cần cấu hình ở **Cloudflare dashboard**, không nằm trong code repo — cần tài liệu hóa riêng (runbook) để không ai vô tình tắt khi đổi cấu hình domain
