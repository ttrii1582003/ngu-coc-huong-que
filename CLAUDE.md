# Ngũ Cốc Hương Quê

Full-stack e-commerce bán ngũ cốc: React SPA (no build) + Spring Boot 3 + PostgreSQL.

> **Claude rules**: Sau mỗi thay đổi — thêm endpoint → cập nhật **API**, thêm file → cập nhật **Cấu trúc**, thêm state → cập nhật **App state**, thêm tính năng → cập nhật **Tính năng hiện tại**.

---

## Chạy dự án

```bash
# Frontend → http://localhost:8080
npm start

# Backend → http://localhost:8081/api
cd backend && mvn spring-boot:run
```

**Yêu cầu**: Node.js, Java 17+, Maven 3.6+, PostgreSQL với database `ngu_coc_huong_que`.

`backend/src/main/resources/application.yml` (gitignored — tạo từ `application.yml.example`):
```yaml
spring.datasource.url: jdbc:postgresql://localhost:5432/ngu_coc_huong_que
spring.datasource.username: postgres
spring.datasource.password: <password>
jwt.secret: <long secret>
jwt.expiration: 86400000
google.client-id: <Google OAuth Client ID>
```

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 18.3.1 + Babel Standalone CDN, thuần CSS, Node.js dev server |
| Backend | Java 17, Spring Boot 3.3.0, Spring Security + JWT (jjwt 0.11.5) |
| Database | PostgreSQL 17, Flyway migrations (V1→V3), Hibernate/JPA |
| Auth | JWT HS256 24h, BCrypt, Google Identity Services (GSI) |

---

## Cấu trúc dự án

```
ngu-coc-huong-que/
├── index.html              # HTML shell – thứ tự <script> rất quan trọng
├── server.js               # Node.js dev server
├── src/
│   ├── styles/main.css
│   ├── data/products.js    # window globals: API_BASE, CATEGORIES, GOOGLE_CLIENT_ID, helpers, BANK_INFO
│   └── components/
│       ├── ui/             # ProductImage.jsx, StarRating.jsx, Badge.jsx
│       ├── cart/           # CartItem.jsx, CartSidebar.jsx
│       ├── pages/          # HomePage, ProductDetailPage, CheckoutPage, OrderSuccessPage
│       │                   # LoginPage, RegisterPage, MyOrdersPage, ProfilePage
│       │                   # AdminOrdersPage, AdminProductsPage
│       ├── App.jsx
│       ├── Header.jsx
│       ├── ProductCard.jsx
│       ├── CategoryFilter.jsx
│       └── AdminSidebar.jsx
└── backend/src/main/
    ├── java/com/ngucochuongque/
    │   ├── config/         # SecurityConfig, JwtUtil, JwtAuthFilter, CorsConfig, DataInitializer
    │   ├── entity/         # User, Product, Category, Order, OrderItem, City, ProductBenefit
    │   ├── repository/
    │   ├── dto/            # request/ + response/
    │   ├── service/        # AuthService, ProductService, OrderService
    │   ├── controller/     # AuthController, ProductController, OrderController
    │   │                   # CategoryController, CityController, AdminController
    │   └── exception/      # GlobalExceptionHandler, ResourceNotFoundException
    └── resources/
        ├── application.yml          # gitignored
        ├── application.yml.example
        └── db/migration/
            ├── V1__create_schema.sql
            ├── V2__seed_data.sql
            ├── V3__add_users.sql
            ├── V4__link_orders_to_users.sql
            ├── V5__add_product_image_url.sql
            ├── V6__seed_product_images.sql
            ├── V7__update_provinces_2025.sql
            └── V8__add_remaining_provinces_2025.sql
```

---

## API Endpoints

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/products` | – | Danh sách (`?category=`, `?search=`) |
| GET | `/api/products/{id}` | – | Chi tiết sản phẩm |
| GET | `/api/categories` | – | 3 danh mục |
| GET | `/api/cities` | – | 34 tỉnh/thành |
| POST | `/api/orders` | – | Tạo đơn → `{ orderCode, totalAmount, ... }` |
| GET | `/api/orders/my` | Bearer JWT | Lịch sử đơn của user |
| GET | `/api/orders/{orderCode}` | – | Chi tiết đơn hàng |
| POST | `/api/auth/register` | – | Đăng ký → JWT |
| POST | `/api/auth/login` | – | Đăng nhập → JWT |
| POST | `/api/auth/google` | – | Google ID token → JWT |
| GET | `/api/auth/me` | Bearer JWT | Thông tin user hiện tại |
| PUT | `/api/auth/profile` | Bearer JWT | Cập nhật fullName, phone |
| GET | `/api/admin/orders` | ADMIN | Tất cả đơn (`?status=pending\|confirmed\|...`) |
| PATCH | `/api/admin/orders/{id}/status` | ADMIN | Cập nhật trạng thái |
| POST | `/api/admin/products` | ADMIN | Tạo sản phẩm |
| PUT | `/api/admin/products/{id}` | ADMIN | Cập nhật sản phẩm |
| DELETE | `/api/admin/products/{id}` | ADMIN | Xóa sản phẩm |

---

## Database

7 bảng, Flyway (`baseline-on-migrate: true`, `baseline-version: 2`, migrations V1→V8):

| Bảng | Nội dung |
|---|---|
| `categories` | id (varchar PK), label |
| `products` | 10 sản phẩm, FK → categories |
| `product_benefits` | 1-to-many với products |
| `cities` | 34 tỉnh/thành (phủ sóng toàn quốc, theo cải cách hành chính 1/7/2025) |
| `orders` | Đơn hàng: customer info, delivery, amounts, user_id (nullable FK) |
| `order_items` | Snapshot price + name |
| `users` | email, password_hash (nullable), auth_provider, role, avatar_url |

`auth_provider`: `'local'` hoặc `'google'`. Google users có `password_hash = NULL`.

---

## Frontend

### Script load order (`index.html`) — KHÔNG đảo thứ tự

1. CDN: React → ReactDOM → Babel Standalone
2. `src/data/products.js` (regular `<script>` — globals trước Babel)
3. UI primitives → Header → CategoryFilter → ProductCard → Cart
4. Google GSI (`accounts.google.com/gsi/client`, async)
5. Pages → AdminSidebar → **App.jsx** (cuối cùng)

> Không dùng `import`/`export` — tất cả components là global functions.

### Globals (`src/data/products.js`)

```js
window.API_BASE            // 'http://localhost:8081/api'
window.GOOGLE_CLIENT_ID    // OAuth Client ID (public-safe)
window.CATEGORIES          // [{ id, label }] — 4 entries gồm 'all'
window.formatPrice(p)      // → "45.000đ"
window.calcDiscount(p, op) // → % giảm giá
window.BANK_INFO           // { bankName, accountNumber, accountHolder }
```

### App state (`App.jsx`)

```js
page               // 'home'|'product'|'checkout'|'success'|'login'|'register'|'my-orders'|'profile'|'admin-orders'|'admin-products'
selProduct         // product object đang xem
cart               // [{ product, qty }]
cartOpen           // boolean
searchQuery        // debounced 280ms
activeCategory     // id đang lọc
toast              // string|null – 2.8s
products           // [] từ GET /api/products
loadingProducts    // boolean
orderCode          // string|null
orderPaymentMethod // 'cod'|'bank'|null
currentUser        // { email, fullName, phone, avatarUrl, role }|null
token              // JWT|null – localStorage('hq_token')
```

Header ẩn trên: `success`, `login`, `register`, `my-orders`, `profile`, `admin-orders`, `admin-products`.

---

## Business Logic

**Orders**
- `orderCode`: `"HQ"` + 8 ký tự UUID uppercase (retry nếu trùng)
- Giá tính server-side — không tin client
- Phí ship theo vùng (cửa hàng ở Miền Trung):

| Vùng | Standard | Miễn phí khi | Express |
|---|---|---|---|
| Miền Trung | 20.000đ | ≥ 300.000đ | 35.000đ |
| Miền Bắc / Nam | 40.000đ | ≥ 500.000đ | 65.000đ |

Zone map: `OrderService.ZONE_MAP` (22 tỉnh → north/central/south)

- `paymentMethod`: `'cod'` hoặc `'bank'`. Chuyển khoản: hiển thị `BANK_INFO` trong checkout + success page; đơn xác nhận thủ công trong 24h

**Auth**
- Register: BCrypt hash, email unique → 409 nếu trùng
- Login: verify BCrypt → 401 nếu sai hoặc `auth_provider = 'google'`; admin → redirect panel
- Google: verify ID token qua `GoogleIdTokenVerifier` → find-or-create user
- Token: `localStorage('hq_token')`, verify `/api/auth/me` khi mount
- `DataInitializer` tạo admin khi startup: `admin@ngucochuongque.vn` / `admin123`

---

## Design System (`src/styles/main.css`)

```css
--primary:     #C8873A   /* cam đất */
--primary-dark:#8B5E2A   /* giá, heading */
--green:       #4A7C59   /* healthy, free ship */
--bg:          #FAF7F2   /* background kem */
--text:        #2C1810   /* text nâu đậm */
```

Font: `Lora` (heading serif) + `DM Sans` (body) từ Google Fonts.

---

## Git

- **Remote**: `https://github.com/ttrii1582003/ngu-coc-huong-que`
- **Branch**: `master` | Feature: `feature/xxx` → merge `--no-ff`
- **Gitignored**: `application.yml`, `*.log`, `backend/target/`

---

## Thêm tính năng

**Frontend component mới**: tạo `.jsx` → thêm `<script type="text/babel">` vào `index.html` trước App.jsx → cập nhật CLAUDE.md

**API endpoint mới**: Entity → Repository → Service → Controller → restart backend (`Ctrl+C` → `mvn spring-boot:run`) → cập nhật CLAUDE.md

**Sản phẩm / danh mục**: sửa SQL trực tiếp trên PostgreSQL — không cần ảnh, `ProductImage.jsx` tự vẽ SVG theo `category_id`

---

## Tính năng hiện tại

| Tính năng | Files chính |
|---|---|
| Xem & tìm kiếm sản phẩm | `HomePage.jsx`, `ProductCard.jsx` + `GET /api/products` |
| Chi tiết sản phẩm | `ProductDetailPage.jsx` |
| Giỏ hàng + free ship bar | `CartSidebar.jsx`, `CartItem.jsx` |
| Đặt hàng (guest) | `CheckoutPage.jsx` + `POST /api/orders` |
| Mã đơn hàng từ backend | `OrderSuccessPage.jsx` |
| Đăng ký / Đăng nhập | `RegisterPage.jsx`, `LoginPage.jsx`, `AuthController` |
| Google OAuth | `LoginPage.jsx` + `POST /api/auth/google` |
| Persist login | `App.jsx` + `localStorage('hq_token')` + `GET /api/auth/me` |
| Header avatar + logout | `Header.jsx` |
| Lịch sử đơn hàng | `MyOrdersPage.jsx` + `GET /api/orders/my` |
| Admin quản lý đơn hàng | `AdminOrdersPage.jsx` + `GET /api/admin/orders` + `PATCH status` |
| Admin quản lý sản phẩm | `AdminProductsPage.jsx` + POST/PUT/DELETE `/api/admin/products` |
| Hồ sơ cá nhân | `ProfilePage.jsx` + `PUT /api/auth/profile` |
| Checkout pre-fill | `CheckoutPage.jsx` (điền tên/SĐT/email từ `currentUser`) |
| Phí ship theo vùng | `CheckoutPage.jsx` + `OrderService.java` |
| Dropdown khu vực giao hàng | `CheckoutPage.jsx` `DISTRICTS` (19 tỉnh × districts, cascade từ tỉnh) |
| Chuyển khoản ngân hàng | `CheckoutPage.jsx` + `OrderSuccessPage.jsx` + `window.BANK_INFO` |
