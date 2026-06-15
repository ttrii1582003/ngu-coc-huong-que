-- V4: Cập nhật danh sách tỉnh/thành theo cải cách hành chính 1/7/2025
-- 63 tỉnh thành → 34 tỉnh thành; cấp quận/huyện bị bãi bỏ

-- Đổi tên
UPDATE cities SET name = 'Huế' WHERE name = 'Thừa Thiên Huế';

-- Xóa các tỉnh đã sáp nhập vào tỉnh khác
DELETE FROM cities WHERE name IN (
    'Quảng Nam',   -- → Đà Nẵng
    'Bình Dương',  -- → TP. Hồ Chí Minh
    'Bình Phước',  -- → Đồng Nai
    'Long An',     -- → Tây Ninh
    'Tiền Giang'   -- → Đồng Tháp
);

-- Thêm tỉnh mới được hình thành sau sáp nhập
INSERT INTO cities (name) VALUES ('Tây Ninh'), ('Đồng Tháp');
