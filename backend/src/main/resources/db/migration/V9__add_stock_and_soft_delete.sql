-- V9: Thêm quản lý tồn kho và soft delete cho sản phẩm

ALTER TABLE products
    ADD COLUMN stock_quantity INTEGER NOT NULL DEFAULT 100,
    ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
