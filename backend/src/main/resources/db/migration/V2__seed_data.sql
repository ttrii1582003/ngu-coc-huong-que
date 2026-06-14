-- =============================================================
-- V2: Seed data – categories, products, benefits, cities
-- =============================================================

-- Categories
INSERT INTO categories (id, label) VALUES
    ('breakfast', 'Ngũ cốc ăn sáng'),
    ('nuts',      'Hạt dinh dưỡng'),
    ('healthy',   'Giảm cân & Healthy');

-- Products
INSERT INTO products (id, name, category_id, price, original_price, weight, rating, reviews, badge, badge_type, description, bg_color, accent_color) VALUES
(1,  'Yến Mạch Nguyên Cám',          'breakfast', 45000,  55000,  '500g', 4.8, 234, 'Bán chạy', 'primary',
 'Yến mạch nguyên cám nguyên chất từ vùng đất sạch, giữ nguyên lớp cám bổ dưỡng. Giàu beta-glucan giúp kiểm soát đường huyết và cholesterol tự nhiên.',
 '#F5E6CC', '#C8873A'),

(2,  'Granola Hạnh Nhân Mật Ong',     'breakfast', 89000,  NULL,   '400g', 4.9, 189, 'Mới',     'green',
 'Granola thủ công nướng từ yến mạch, hạnh nhân và mật ong rừng nguyên chất. Không chất bảo quản, không đường tinh luyện – bữa sáng hoàn hảo.',
 '#FAEBD0', '#D4944A'),

(3,  'Oats Cán Dẹt Hữu Cơ',          'breakfast', 55000,  65000,  '1kg',  4.7, 312, NULL,      NULL,
 'Oats hữu cơ được chứng nhận quốc tế, cán dẹt đều tay để nấu nhanh trong 3 phút. Phù hợp làm overnight oats, smoothie bowl hay bánh yến mạch.',
 '#EDE0CC', '#B87840'),

(4,  'Hạnh Nhân Rang Tự Nhiên',       'nuts',      120000, NULL,   '300g', 4.9, 445, 'Yêu thích','primary',
 'Hạnh nhân California loại 1 rang khô không dầu, không muối. Giàu Vitamin E, magie và chất béo không bão hòa tốt cho tim mạch.',
 '#EDD5B0', '#C4956A'),

(5,  'Óc Chó Sấy Khô California',     'nuts',      155000, 180000, '200g', 4.8, 267, 'Sale',    'sale',
 'Óc chó California nguyên hạt được sấy ở nhiệt độ thấp để giữ nguyên Omega-3 và dưỡng chất. Đóng gói hút chân không đảm bảo độ tươi.',
 '#E8D0B5', '#9B6B4F'),

(6,  'Hạt Điều Rang Muối Biển',       'nuts',      98000,  NULL,   '250g', 4.6, 198, NULL,      NULL,
 'Hạt điều W240 Bình Phước rang với muối biển tự nhiên. Hạt to đều, giòn thơm, không dùng dầu chiên hay phụ gia.',
 '#F0DEC0', '#D4A574'),

(7,  'Mix Hạt Premium 7 Loại',        'nuts',      185000, 210000, '500g', 4.9, 523, 'Bán chạy','primary',
 'Hỗn hợp 7 loại hạt cao cấp: hạnh nhân, óc chó, điều, macadamia, hồ đào, hạt bí, hạt hướng dương. Công thức cân bằng dinh dưỡng tối ưu.',
 '#E8D5A8', '#B8864A'),

(8,  'Ngũ Cốc Chia Seeds & Oats',     'healthy',   75000,  NULL,   '400g', 4.7, 156, 'Healthy', 'green',
 'Kết hợp hoàn hảo giữa hạt chia giàu Omega-3 và yến mạch nguyên cám. Giữ no lâu, ít calo, hỗ trợ giảm cân và ổn định đường huyết.',
 '#E0EDD8', '#6B8C6B'),

(9,  'Quinoa Hữu Cơ Peru',            'healthy',   135000, 155000, '500g', 4.8, 203, 'Hữu cơ',  'green',
 'Quinoa trắng hữu cơ nhập khẩu từ Peru – siêu thực phẩm chứa đủ 9 axit amin thiết yếu. Không gluten, phù hợp người ăn kiêng và thực dưỡng.',
 '#F0E8D5', '#C8A882'),

(10, 'Yến Mạch Low Carb Diet',        'healthy',   65000,  78000,  '600g', 4.6, 178, 'Diet',    'green',
 'Yến mạch low-carb đặc biệt dành cho người giảm cân và kiểm soát carb. Chỉ số GI thấp, giàu chất xơ hòa tan, hỗ trợ đốt mỡ hiệu quả.',
 '#DDF0E4', '#5A9B6B');

-- Reset sequence sau khi insert với ID cụ thể
SELECT setval('products_id_seq', 10);

-- Product benefits
INSERT INTO product_benefits (product_id, benefit, sort_order) VALUES
(1,  'Giàu chất xơ',              0),
(1,  'Không chất bảo quản',       1),
(1,  'Tự nhiên 100%',             2),
(2,  'Nướng thủ công',            0),
(2,  'Mật ong rừng',              1),
(2,  'Không gluten',              2),
(3,  'Certified Organic',         0),
(3,  'Nấu nhanh 3 phút',          1),
(3,  'Đa dụng',                   2),
(4,  'Rang khô',                  0),
(4,  'Không muối',                1),
(4,  'Giàu Vitamin E',            2),
(5,  'Omega-3 cao',               0),
(5,  'Hút chân không',            1),
(5,  'California',                2),
(6,  'Điều W240',                 0),
(6,  'Muối biển',                 1),
(6,  'Bình Phước VN',             2),
(7,  '7 loại hạt',               0),
(7,  'Cân bằng dinh dưỡng',       1),
(7,  'Premium',                   2),
(8,  'Giữ no lâu',                0),
(8,  'Ít calo',                   1),
(8,  'Omega-3',                   2),
(9,  'Protein hoàn chỉnh',        0),
(9,  'Không gluten',              1),
(9,  'Nhập khẩu Peru',            2),
(10, 'Low Carb',                  0),
(10, 'Giảm cân hiệu quả',         1),
(10, 'Tự nhiên',                  2);

-- Cities (22 tỉnh/thành)
INSERT INTO cities (name) VALUES
    ('Hà Nội'),
    ('TP. Hồ Chí Minh'),
    ('Đà Nẵng'),
    ('Hải Phòng'),
    ('Cần Thơ'),
    ('An Giang'),
    ('Bình Dương'),
    ('Bình Phước'),
    ('Đắk Lắk'),
    ('Đồng Nai'),
    ('Gia Lai'),
    ('Khánh Hòa'),
    ('Lâm Đồng'),
    ('Long An'),
    ('Nghệ An'),
    ('Quảng Nam'),
    ('Quảng Ngãi'),
    ('Quảng Ninh'),
    ('Thanh Hóa'),
    ('Thừa Thiên Huế'),
    ('Tiền Giang'),
    ('Vĩnh Long');
