-- =============================================================
-- V1: Tạo schema cho Ngũ Cốc Hương Quê
-- =============================================================

CREATE TABLE categories (
    id    VARCHAR(20)  PRIMARY KEY,
    label VARCHAR(100) NOT NULL
);

CREATE TABLE products (
    id             SERIAL       PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    category_id    VARCHAR(20)  NOT NULL REFERENCES categories(id),
    price          INTEGER      NOT NULL,
    original_price INTEGER,
    weight         VARCHAR(20)  NOT NULL,
    rating         DECIMAL(3,1) NOT NULL,
    reviews        INTEGER      NOT NULL DEFAULT 0,
    badge          VARCHAR(50),
    badge_type     VARCHAR(20),
    description    TEXT         NOT NULL,
    bg_color       VARCHAR(10)  NOT NULL,
    accent_color   VARCHAR(10)  NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE product_benefits (
    id         SERIAL  PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    benefit    TEXT    NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE cities (
    id   SERIAL       PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE orders (
    id              SERIAL       PRIMARY KEY,
    order_code      VARCHAR(20)  NOT NULL UNIQUE,
    customer_name   VARCHAR(255) NOT NULL,
    customer_phone  VARCHAR(20)  NOT NULL,
    customer_email  VARCHAR(255),
    address         TEXT         NOT NULL,
    city            VARCHAR(100) NOT NULL,
    district        VARCHAR(100),
    delivery_method VARCHAR(20)  NOT NULL,
    payment_method  VARCHAR(20)  NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'pending',
    subtotal        INTEGER      NOT NULL,
    shipping_cost   INTEGER      NOT NULL,
    total_amount    INTEGER      NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id                SERIAL       PRIMARY KEY,
    order_id          INTEGER      NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id        INTEGER      NOT NULL REFERENCES products(id),
    quantity          INTEGER      NOT NULL,
    price_at_purchase INTEGER      NOT NULL,
    product_name      VARCHAR(255) NOT NULL
);

-- Index thường dùng
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_order_items_order  ON order_items(order_id);
CREATE INDEX idx_orders_code        ON orders(order_code);
