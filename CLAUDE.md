# Ngũ Cốc Hương Quê – Tài liệu dự án

## Tổng quan

Website thương mại điện tử full-stack bán ngũ cốc và hạt dinh dưỡng thuần tự nhiên.
- **Frontend**: React SPA tĩnh, không có build step, chạy qua Node.js local server
- **Backend**: Java Spring Boot REST API kết nối PostgreSQL

---

## Tech Stack

### Frontend
| Thành phần | Phiên bản | Nguồn |
|---|---|---|
| React | 18.3.1 | CDN unpkg (UMD) |
| ReactDOM | 18.3.1 | CDN unpkg (UMD) |
| Babel Standalone | 7.29.0 | CDN unpkg (transpile JSX trực tiếp trên browser) |
| Google Fonts | – | Lora (heading serif) + DM Sans (body sans-serif) |
| CSS | Thuần CSS | `src/styles/main.css` |
| Dev Server | Node.js built-in `http` | `server.js` |

### Backend
| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| Java | 17 | LTS |
| Spring Boot | 3.3.0 | Web + Data JPA + Validation |
| PostgreSQL | 17.4 | Database `ngu_coc_huong_que` |
| Flyway | – | Migration: V1 schema, V2 seed data |
| Hibernate | 6.5.2 | ORM, `ddl-auto: validate` |
| Lombok | – | Giảm boilerplate |
| Maven | 3.9.6 | Build tool |

---

## Cách chạy

### Khởi động toàn bộ hệ thống

```bash
# Terminal 1 – Frontend (Node.js server)
npm start
# → http://localhost:8080/

# Terminal 2 – Backend (Spring Boot)
cd backend
mvn spring-boot:run
# → http://localhost:8081/api/
```

### Yêu cầu
- Node.js (bất kỳ phiên bản)
- Java 17+
- Maven 3.6+
- PostgreSQL chạy local, database `ngu_coc_huong_que` đã tồn tại

### Cấu hình DB (`backend/src/main/resources/application.yml`)
```yaml
spring.datasource.url: jdbc:postgresql://localhost:5432/ngu_coc_huong_que
spring.datasource.username: postgres
spring.datasource.password: 123456   # ← đổi nếu khác
```

---

## Cấu trúc dự án

```
ngu-coc-huong-que/
├── index.html                          # HTML shell (chỉ load scripts/styles)
├── server.js                           # Local dev server – serve toàn bộ thư mục
├── package.json
├── CLAUDE.md
├── NOTES.md                            # Changelog – cập nhật khi có thay đổi quan trọng
├── src/
│   ├── styles/
│   │   └── main.css                    # Toàn bộ CSS + design tokens
│   ├── data/
│   │   └── products.js                 # CATEGORIES, API_BASE, helper functions (không còn PRODUCTS hardcode)
│   └── components/
│       ├── ui/                         # Primitive components (không có state)
│       │   ├── ProductImage.jsx        # SVG illustration theo category
│       │   ├── StarRating.jsx          # Hiển thị sao đánh giá
│       │   └── Badge.jsx               # Nhãn sản phẩm (Bán chạy, Sale…)
│       ├── cart/                       # Cart feature
│       │   ├── CartItem.jsx            # Một dòng sản phẩm trong giỏ
│       │   └── CartSidebar.jsx         # Panel giỏ hàng trượt từ phải
│       ├── pages/                      # Page-level components
│       │   ├── HomePage.jsx            # Hero + search + product grid
│       │   ├── ProductDetailPage.jsx   # Chi tiết sản phẩm
│       │   ├── CheckoutPage.jsx        # Form thanh toán + POST /api/orders
│       │   └── OrderSuccessPage.jsx    # Xác nhận đơn hàng (orderCode từ API)
│       ├── Header.jsx                  # Sticky header + logo + nút giỏ hàng
│       ├── CategoryFilter.jsx          # Tab lọc danh mục (cuộn ngang)
│       ├── ProductCard.jsx             # Card sản phẩm trong grid
│       └── App.jsx                     # Root component + state toàn cục + fetch products
└── backend/
    ├── pom.xml
    └── src/main/
        ├── java/com/ngucochuongque/
        │   ├── NgCocHuongQueApplication.java
        │   ├── config/CorsConfig.java              # Allow origin localhost:8080
        │   ├── entity/                             # Category, Product, ProductBenefit, City, Order, OrderItem
        │   ├── repository/                         # Spring Data JPA repositories
        │   ├── dto/request/                        # CreateOrderRequest, OrderItemRequest
        │   ├── dto/response/                       # ProductResponse, OrderResponse, CategoryResponse
        │   ├── service/                            # Business logic: ProductService, OrderService…
        │   ├── controller/                         # REST controllers
        │   └── exception/                          # GlobalExceptionHandler, ResourceNotFoundException
        └── resources/
            ├── application.yml
            └── db/migration/
                ├── V1__create_schema.sql           # DDL: 6 tables
                └── V2__seed_data.sql               # 3 categories, 10 products, 22 cities
```

---

## API Endpoints

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/products` | Tất cả sản phẩm. Query: `?category=nuts&search=hạnh` |
| GET | `/api/products/{id}` | Chi tiết 1 sản phẩm |
| GET | `/api/categories` | 3 danh mục |
| GET | `/api/cities` | 22 tỉnh/thành |
| POST | `/api/orders` | Tạo đơn hàng mới |
| GET | `/api/orders/{orderCode}` | Chi tiết đơn hàng theo mã HQ… |

### POST /api/orders — Request
```json
{
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0912345678",
  "customerEmail": "a@email.com",
  "address": "123 Đường ABC",
  "city": "Hà Nội",
  "district": "Hoàn Kiếm",
  "deliveryMethod": "standard",
  "paymentMethod": "cod",
  "items": [
    { "productId": 1, "quantity": 2 }
  ]
}
```

### POST /api/orders — Response
```json
{
  "orderCode": "HQAB12CD34",
  "status": "pending",
  "subtotal": 180000,
  "shippingCost": 30000,
  "totalAmount": 210000,
  "createdAt": "2026-06-14T16:30:00Z"
}
```

---

## Database Schema

6 bảng, quản lý bởi Flyway:

| Bảng | Mô tả |
|---|---|
| `categories` | id (varchar PK), label |
| `products` | 10 sản phẩm, foreign key → categories |
| `product_benefits` | 1-to-many với products (3 benefits/sản phẩm) |
| `cities` | 22 tỉnh/thành |
| `orders` | Đơn hàng: code, customer info, delivery, amounts |
| `order_items` | Dòng đơn hàng: snapshot price + name |

**Flyway config**: `baseline-on-migrate: true`, `baseline-version: 2` — dùng khi database đã tồn tại trước khi chạy backend lần đầu.

---

## Cơ chế load components (Frontend)

Babel Standalone load từng file `.jsx` qua synchronous XHR theo thứ tự khai báo trong `index.html`. **Thứ tự script rất quan trọng** — components phải được load trước khi App.jsx gọi `ReactDOM.createRoot`.

Thứ tự trong `index.html`:
1. CDN: React → ReactDOM → Babel Standalone
2. `src/data/products.js` (regular `<script>` — thiết lập globals trước)
3. UI primitives → Layout → Product → Cart → Pages → App

---

## Globals (`src/data/products.js`)

```js
window.API_BASE   = 'http://localhost:8081/api'
window.CATEGORIES = [{ id, label }, ...]   // 4 entries gồm 'all'
window.formatPrice(p)         // → "45.000đ"
window.calcDiscount(p, op)    // → số % (0 nếu không giảm)
```

> **PRODUCTS không còn hardcode** — được fetch từ `GET /api/products` khi App mount.

---

## State Management (App.jsx)

```js
page              // 'home' | 'product' | 'checkout' | 'success'
selProduct        // product object đang xem chi tiết
cart              // [{ product, qty }]
cartOpen          // boolean – sidebar hiển thị không
searchQuery       // chuỗi tìm kiếm (debounced 280ms tại HomePage)
activeCategory    // id category đang lọc
toast             // string | null – thông báo tạm 2.8s
products          // [] – fetch từ API khi mount
loadingProducts   // boolean – loading state
orderCode         // string | null – mã đơn từ backend sau checkout
```

---

## Business Logic (Backend)

- **Order code**: `"HQ"` + 8 ký tự UUID uppercase (unique, retry nếu trùng)
- **Giá tính server-side**: subtotal = Σ(price_db × qty) — không tin giá từ client
- **Phí ship**: express → 45.000đ; standard ≥300k → miễn phí; standard <300k → 30.000đ
- **Snapshot**: `price_at_purchase` + `product_name` lưu vào `order_items`

---

## Luồng điều hướng

```
home ──click card──▶ product ──add to cart──▶ (cart sidebar)
 ▲                                                   │
 │                                             checkout button
 │                                                   ▼
 └──────── onContinue ◀────── success ◀──── checkout ──POST /api/orders──▶ DB
```

---

## Tính năng chính

| Tính năng | File |
|---|---|
| Load sản phẩm từ API | `App.jsx` + `GET /api/products` |
| Tìm kiếm (debounce 280ms) | `pages/HomePage.jsx` |
| Lọc danh mục | `CategoryFilter.jsx` + `App.jsx` |
| Giỏ hàng (add/remove/qty) | `App.jsx` + `cart/` |
| Thanh tiến độ free ship (≥300k) | `cart/CartSidebar.jsx` |
| Form checkout + validation | `pages/CheckoutPage.jsx` |
| Đặt hàng → lưu DB | `pages/CheckoutPage.jsx` + `POST /api/orders` |
| Mã đơn hàng từ backend | `pages/OrderSuccessPage.jsx` (prop `orderCode`) |
| Toast notification | `App.jsx` |

---

## Design System (`src/styles/main.css`)

```css
--primary:     #C8873A   /* Cam đất – màu chủ đạo */
--primary-dark:#8B5E2A   /* Giá, heading quan trọng */
--green:       #4A7C59   /* Accent xanh – healthy, miễn phí ship */
--bg:          #FAF7F2   /* Background chính (kem) */
--text:        #2C1810   /* Text chính (nâu đậm) */
```

- Heading: `Lora` (Google Fonts) — serif, italic cho điểm nhấn
- Body: `DM Sans` (Google Fonts) — sans-serif

---

## Responsive Breakpoints

| Breakpoint | Thay đổi |
|---|---|
| `≤ 1100px` | Product grid 4 → 3 cột |
| `≤ 860px` | Hero decoration ẩn |
| `≤ 820px` | Detail grid: 2 cột → 1 cột |
| `≤ 780px` | Product grid 3 → 2 cột |
| `≤ 768px` | Container padding nhỏ hơn |
| `≤ 600px` | Hero padding nhỏ hơn |
| `≤ 560px` | Form checkout 2 cột → 1 cột |
| `≤ 480px` | Cart sidebar full width, ẩn label "Giỏ hàng" |
| `≤ 380px` | Product grid → 1 cột |

---

## Lưu ý khi chỉnh sửa

### Thêm/sửa sản phẩm
Sản phẩm quản lý qua PostgreSQL. Sửa trực tiếp bằng SQL hoặc DBeaver trên bảng `products` + `product_benefits`. Không cần ảnh — `ProductImage.jsx` tự vẽ SVG theo `bg_color`, `accent_color`, `category_id`.

### Thêm danh mục mới
1. INSERT vào bảng `categories` trong DB
2. Thêm entry vào `window.CATEGORIES` trong `src/data/products.js`
3. Thêm branch `if (category === 'new-id')` trong `src/components/ui/ProductImage.jsx`

### Thêm component mới (Frontend)
1. Tạo file `.jsx` trong thư mục phù hợp dưới `src/components/`
2. Thêm `<script type="text/babel" src="...">` vào `index.html` **trước** App.jsx
3. Không dùng `import`/`export` — tất cả là global functions

### Thêm API endpoint mới (Backend)
1. Tạo/sửa Entity → Repository → Service → Controller
2. Không cần restart nếu dùng Spring DevTools; nếu không thì `Ctrl+C` rồi `mvn spring-boot:run`

### Sửa style
Toàn bộ CSS trong `src/styles/main.css`. Dùng CSS variables (`--primary`, `--text`…) để thay đổi toàn hệ thống.

### Sau khi sửa frontend
Chỉ cần refresh trình duyệt — không cần build, không cần restart server.

### Sau khi sửa backend
`Ctrl+C` terminal backend → `mvn spring-boot:run` lại.

---

## Danh mục sản phẩm hiện tại

| Category | Sản phẩm |
|---|---|
| `breakfast` | Yến Mạch Nguyên Cám, Granola Hạnh Nhân Mật Ong, Oats Cán Dẹt Hữu Cơ |
| `nuts` | Hạnh Nhân Rang Tự Nhiên, Óc Chó Sấy Khô California, Hạt Điều Rang Muối Biển, Mix Hạt Premium 7 Loại |
| `healthy` | Ngũ Cốc Chia Seeds & Oats, Quinoa Hữu Cơ Peru, Yến Mạch Low Carb Diet |

---

## Hướng dẫn cập nhật NOTES.md

**Khi nào cần cập nhật `NOTES.md`:**
- Thêm tính năng mới (endpoint, component, trang)
- Thay đổi schema database (thêm bảng/cột)
- Thay đổi business logic quan trọng (giá ship, order code, v.v.)
- Thay đổi dependencies hoặc cấu hình hệ thống
- Sửa bug quan trọng ảnh hưởng đến luồng chính

Mỗi entry trong `NOTES.md` theo format: ngày + mô tả ngắn + file bị ảnh hưởng.
