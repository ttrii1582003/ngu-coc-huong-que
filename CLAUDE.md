# Ngũ Cốc Hương Quê

Full-stack e-commerce bán ngũ cốc: React SPA (no build) + Spring Boot 3 + PostgreSQL.

> **Quy tắc cho Claude**: Sau mỗi lần thêm/sửa tính năng, **bắt buộc cập nhật file này ngay**:
> - Thêm endpoint → cập nhật bảng **API**
> - Thêm file/thư mục → cập nhật **Cấu trúc**
> - Thêm state App → cập nhật **App state**
> - Thêm tính năng → cập nhật bảng **Tính năng hiện tại**

---

## Chạy dự án

```bash
# Terminal 1 – Frontend → http://localhost:8080
npm start

# Terminal 2 – Backend → http://localhost:8081/api
cd backend
mvn spring-boot:run
```

**Yêu cầu**: Node.js, Java 17+, Maven 3.6+, PostgreSQL local với database `ngu_coc_huong_que`.

**Cấu hình** (`backend/src/main/resources/application.yml` — gitignored, tạo từ `application.yml.example`):
```yaml
spring.datasource.url: jdbc:postgresql://localhost:5432/ngu_coc_huong_que
spring.datasource.username: postgres
spring.datasource.password: <mật khẩu>
jwt.secret: <chuỗi bí mật dài>
jwt.expiration: 86400000
google.client-id: <Google OAuth Client ID>
```

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 18.3.1 + Babel Standalone CDN, thuần CSS, Node.js dev server |
| Backend | Java 17, Spring Boot 3.3.0, Spring Security + JWT (jjwt 0.11.5) |
| Database | PostgreSQL 17, Flyway migrations (`V1`→`V3`), Hibernate/JPA, DataInitializer seed |
| Auth | JWT HS256 24h, BCrypt, Google Identity Services (GSI) |

---

## Cấu trúc dự án

```
ngu-coc-huong-que/
├── index.html              # HTML shell – thứ tự <script> rất quan trọng
├── server.js               # Node.js dev server
├── src/
│   ├── styles/main.css     # Toàn bộ CSS + design tokens
│   ├── data/products.js    # window globals: API_BASE, CATEGORIES, GOOGLE_CLIENT_ID, helpers
│   └── components/
│       ├── ui/             # ProductImage.jsx, StarRating.jsx, Badge.jsx
│       ├── cart/           # CartItem.jsx, CartSidebar.jsx
│       ├── pages/          # HomePage, ProductDetailPage, CheckoutPage, OrderSuccessPage
│       │                   # LoginPage.jsx, RegisterPage.jsx, MyOrdersPage.jsx, AdminOrdersPage.jsx
│       ├── App.jsx         # Root + global state + page routing
│       ├── Header.jsx      # Sticky header, cart button, user avatar/logout
│       └── CategoryFilter.jsx
└── backend/src/main/
    ├── java/com/ngucochuongque/
    │   ├── config/         # SecurityConfig, JwtUtil, JwtAuthFilter, CorsConfig, DataInitializer
    │   ├── entity/         # User, Product, Category, Order, OrderItem, City, ProductBenefit
    │   ├── repository/     # Spring Data JPA repositories
    │   ├── dto/            # request/ (Register, Login, GoogleLogin, CreateOrder) + response/
    │   ├── service/        # AuthService, ProductService, OrderService
    │   ├── controller/     # AuthController, ProductController, OrderController, CategoryController, AdminController
    │   └── exception/      # GlobalExceptionHandler, ResourceNotFoundException
    └── resources/
        ├── application.yml          # gitignored – chứa credentials thật
        ├── application.yml.example  # template public
        └── db/migration/
            ├── V1__create_schema.sql   # DDL: 6 bảng
            ├── V2__seed_data.sql       # 3 categories, 10 products, 22 cities
            └── V3__add_users.sql       # bảng users
```

---

## API Endpoints

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/products` | – | Danh sách sản phẩm (`?category=`, `?search=`) |
| GET | `/api/products/{id}` | – | Chi tiết sản phẩm |
| GET | `/api/categories` | – | 3 danh mục |
| GET | `/api/cities` | – | 22 tỉnh/thành |
| POST | `/api/orders` | – | Tạo đơn hàng → `{ orderCode, totalAmount, ... }` |
| GET | `/api/orders/my` | Bearer JWT | Lịch sử đơn hàng của user đang login |
| GET | `/api/orders/{orderCode}` | – | Chi tiết đơn hàng |
| POST | `/api/auth/register` | – | Đăng ký email/password → JWT |
| POST | `/api/auth/login` | – | Đăng nhập → JWT |
| POST | `/api/auth/google` | – | Google ID token → JWT |
| GET | `/api/auth/me` | Bearer JWT | Thông tin user hiện tại |
| GET | `/api/admin/orders` | Bearer ADMIN | Tất cả đơn hàng (`?status=pending\|confirmed\|...`) |
| PATCH | `/api/admin/orders/{id}/status` | Bearer ADMIN | Cập nhật trạng thái đơn |

---

## Database

7 bảng, quản lý bởi Flyway (`baseline-on-migrate: true`, `baseline-version: 2`):

| Bảng | Nội dung |
|---|---|
| `categories` | id (varchar PK), label |
| `products` | 10 sản phẩm, FK → categories |
| `product_benefits` | 1-to-many với products |
| `cities` | 22 tỉnh/thành |
| `orders` | Đơn hàng: customer info, delivery, amounts, user_id (nullable FK) |
| `order_items` | Dòng đơn: snapshot price + name |
| `users` | email, password_hash (nullable), auth_provider, role, avatar_url |

`auth_provider`: `'local'` (email/password) hoặc `'google'`. Google users có `password_hash = NULL`.

---

## Frontend

### Script load order (`index.html`) — KHÔNG đảo thứ tự

1. CDN: React → ReactDOM → Babel Standalone → Google GSI (`accounts.google.com/gsi/client`)
2. `src/data/products.js` (regular `<script>` — setup globals trước Babel)
3. UI primitives → cart → pages (LoginPage + RegisterPage **trước** App) → App.jsx

> Không dùng `import`/`export` — tất cả components là global functions/variables.

### Globals (`src/data/products.js`)

```js
window.API_BASE         // 'http://localhost:8081/api'
window.GOOGLE_CLIENT_ID // OAuth Client ID (public-safe, committed)
window.CATEGORIES       // [{ id, label }] — 4 entries gồm 'all'
window.formatPrice(p)   // → "45.000đ"
window.calcDiscount(p, op) // → % giảm giá (0 nếu không có)
```

### App state (`App.jsx`)

```js
page            // 'home'|'product'|'checkout'|'success'|'login'|'register'|'my-orders'|'admin-orders'
selProduct      // product object đang xem chi tiết
cart            // [{ product, qty }]
cartOpen        // boolean – sidebar
searchQuery     // debounced 280ms (tại HomePage)
activeCategory  // id category đang lọc
toast           // string|null – thông báo 2.8s
products        // [] fetch từ GET /api/products khi mount
loadingProducts // boolean
orderCode       // string|null – từ POST /api/orders
currentUser     // { email, fullName, avatarUrl, role }|null
token           // JWT|null – persist qua localStorage('hq_token')
```

Header ẩn trên các trang: `'success'`, `'login'`, `'register'`, `'my-orders'`, `'admin-orders'`.

---

## Business Logic

**Orders**
- `orderCode`: `"HQ"` + 8 ký tự UUID uppercase (retry nếu trùng)
- Giá tính server-side — không tin client
- Phí ship: express 45k; standard ≥300k miễn phí; standard <300k → 30k
- Snapshot `price_at_purchase` + `product_name` lưu trong `order_items`

**Auth**
- Register: BCrypt hash, email unique → 409 nếu trùng
- Login: verify BCrypt → 401 nếu sai hoặc `auth_provider = 'google'`; role `'admin'` redirect thẳng vào panel
- Google: verify ID token qua `GoogleIdTokenVerifier` → find-or-create user
- Token persist: `localStorage('hq_token')`, verify `/api/auth/me` khi App mount

---

## Design System (`src/styles/main.css`)

```css
--primary:     #C8873A   /* cam đất – màu chủ đạo */
--primary-dark:#8B5E2A   /* giá, heading */
--green:       #4A7C59   /* healthy, free ship */
--bg:          #FAF7F2   /* background kem */
--text:        #2C1810   /* text nâu đậm */
```

Font: `Lora` (heading serif) + `DM Sans` (body sans-serif) từ Google Fonts.

---

## Git

- **Remote**: `https://github.com/ttrii1582003/ngu-coc-huong-que`
- **Branch chính**: `master` | Feature: `feature/xxx` → merge `master` với `--no-ff`
- **Gitignored**: `application.yml` (DB password, JWT secret) — commit `application.yml.example`

---

## Thêm tính năng

**Component frontend mới**
1. Tạo `.jsx` trong `src/components/`
2. Thêm `<script type="text/babel" src="...">` vào `index.html` **trước** App.jsx
3. Cập nhật CLAUDE.md (Cấu trúc + Tính năng hiện tại)

**API endpoint mới**
1. Entity → Repository → Service → Controller
2. Restart: `Ctrl+C` → `mvn spring-boot:run` (hoặc `mvn clean spring-boot:run` nếu file mới)
3. Cập nhật bảng API trong CLAUDE.md

**Sản phẩm / danh mục**
- Sửa SQL trực tiếp trên PostgreSQL (`products`, `product_benefits`, `categories`)
- Không cần ảnh — `ProductImage.jsx` tự vẽ SVG theo `category_id`, `bg_color`, `accent_color`

**Sau khi sửa frontend** → refresh browser. **Sau khi sửa backend** → restart `mvn`.

---

## Tính năng hiện tại

| Tính năng | Files chính |
|---|---|
| Xem & tìm kiếm sản phẩm | `HomePage.jsx` + `GET /api/products` |
| Chi tiết sản phẩm | `ProductDetailPage.jsx` |
| Giỏ hàng + free ship bar ≥300k | `CartSidebar.jsx`, `CartItem.jsx` |
| Đặt hàng (guest, không cần login) | `CheckoutPage.jsx` + `POST /api/orders` |
| Mã đơn hàng từ backend | `OrderSuccessPage.jsx` (prop `orderCode`) |
| Đăng ký / Đăng nhập email+password | `RegisterPage.jsx`, `LoginPage.jsx`, `AuthController` |
| Đăng nhập Google OAuth | `LoginPage.jsx` (GSI button) + `POST /api/auth/google` |
| Persist login qua page refresh | `App.jsx` + `localStorage('hq_token')` + `GET /api/auth/me` |
| Header user avatar + logout | `Header.jsx` (props: `currentUser`, `onLoginClick`, `onLogout`, `onMyOrders`) |
| Lịch sử đơn hàng của user | `MyOrdersPage.jsx` + `GET /api/orders/my` (expandable detail) |
| Admin quản lý đơn hàng | `AdminOrdersPage.jsx` + `GET /api/admin/orders` + `PATCH /api/admin/orders/{id}/status` |
| Admin tự tạo khi startup | `DataInitializer.java` (email: `admin@ngucochuongque.vn`, password: `admin123`) |
