# NOTES – Lịch sử thay đổi quan trọng

File này ghi lại các thay đổi đáng kể của dự án. Cập nhật mỗi khi có thay đổi về tính năng, schema, logic nghiệp vụ, hoặc cấu hình.

---

## 2026-06-14 – Tích hợp Backend Spring Boot + PostgreSQL

**Tóm tắt:** Chuyển từ SPA thuần tĩnh sang full-stack. Dữ liệu sản phẩm và đơn hàng nay được quản lý bởi backend.

### Backend mới (`backend/`)
- Tạo project Spring Boot 3.3.0, Java 17, Maven
- Database: PostgreSQL `ngu_coc_huong_que`, port 5432
- Backend REST API: port 8081
- Flyway migration: V1 tạo schema (6 bảng), V2 seed 10 sản phẩm + 22 tỉnh/thành
- `baseline-on-migrate: true` để xử lý database đã tồn tại trước khi chạy Flyway

**API endpoints:**
- `GET /api/products` — danh sách sản phẩm (hỗ trợ filter `?category=`, `?search=`)
- `GET /api/products/{id}` — chi tiết sản phẩm
- `GET /api/categories` — danh mục
- `GET /api/cities` — 22 tỉnh/thành
- `POST /api/orders` — tạo đơn hàng, trả về `orderCode` dạng `HQ` + 8 ký tự
- `GET /api/orders/{orderCode}` — xem đơn hàng

**Business logic:**
- Giá tính server-side (không tin client)
- Phí ship: express 45k; standard miễn phí nếu ≥300k, ngược lại 30k
- Snapshot `price_at_purchase` + `product_name` trong `order_items`

**Files backend chính:**
- `backend/src/main/resources/application.yml` — cấu hình DB và Flyway
- `backend/src/main/resources/db/migration/V1__create_schema.sql`
- `backend/src/main/resources/db/migration/V2__seed_data.sql`
- `backend/src/main/java/com/ngucochuongque/service/OrderService.java`
- `backend/src/main/java/com/ngucochuongque/config/CorsConfig.java`

### Frontend cập nhật
- `src/data/products.js` — xóa hardcoded `PRODUCTS` array; thêm `window.API_BASE`
- `src/components/App.jsx` — thêm `useEffect` fetch `/api/products`, state `products` + `loadingProducts` + `orderCode`
- `src/components/pages/CheckoutPage.jsx` — `handleSubmit` POST lên `/api/orders`
- `src/components/pages/OrderSuccessPage.jsx` — nhận `orderCode` từ prop (từ API)
- `src/components/pages/HomePage.jsx` — thêm loading state khi fetch sản phẩm

### Files đã xóa
- `Ngũ Cốc Hương Quê.html` — file legacy không còn dùng
- `node_modules/` — Playwright từ session test trước (~15MB)
- `package-lock.json` — theo `node_modules/`
