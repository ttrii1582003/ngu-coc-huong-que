const SHIPPING_ZONES = {
  'Đà Nẵng': 'central', 'Huế': 'central', 'Quảng Ngãi': 'central',
  'Khánh Hòa': 'central', 'Gia Lai': 'central', 'Đắk Lắk': 'central', 'Lâm Đồng': 'central',
  'Hà Nội': 'north', 'Hải Phòng': 'north', 'Quảng Ninh': 'north',
  'Nghệ An': 'north', 'Thanh Hóa': 'north',
  'Tuyên Quang': 'north', 'Lào Cai': 'north', 'Thái Nguyên': 'north', 'Phú Thọ': 'north',
  'Bắc Ninh': 'north', 'Hưng Yên': 'north', 'Ninh Bình': 'north',
  'Quảng Trị': 'north', 'Hà Tĩnh': 'north',
  'Sơn La': 'north', 'Cao Bằng': 'north', 'Điện Biên': 'north', 'Lai Châu': 'north', 'Lạng Sơn': 'north',
  'TP. Hồ Chí Minh': 'south', 'Cần Thơ': 'south', 'An Giang': 'south',
  'Đồng Nai': 'south', 'Tây Ninh': 'south', 'Đồng Tháp': 'south', 'Vĩnh Long': 'south',
  'Cà Mau': 'south',
};

const ZONE_RATES = {
  central: { standard: 20000, freeThreshold: 300000, express: 35000 },
  other:   { standard: 30000, freeThreshold: 500000, express: 55000 },
};

function getZoneRates(city) {
  return SHIPPING_ZONES[city] === 'central' ? ZONE_RATES.central : ZONE_RATES.other;
}

// Khu vực giao hàng theo tỉnh/thành (cập nhật theo cải cách hành chính 1/7/2025)
// Sử dụng tên khu vực quen thuộc cho mục đích địa chỉ
const DISTRICTS = {
  'Hà Nội': [
    'Ba Đình','Hoàn Kiếm','Đống Đa','Hai Bà Trưng','Cầu Giấy','Tây Hồ',
    'Thanh Xuân','Long Biên','Hoàng Mai','Hà Đông','Bắc Từ Liêm','Nam Từ Liêm',
    'Sơn Tây','Sóc Sơn','Đông Anh','Gia Lâm','Mê Linh','Đan Phượng',
    'Hoài Đức','Thạch Thất','Quốc Oai','Chương Mỹ','Ba Vì','Phúc Thọ',
    'Thường Tín','Thanh Trì','Ứng Hòa','Mỹ Đức','Phú Xuyên','Thanh Oai',
  ],
  'Hải Phòng': [
    // Hải Phòng cũ
    'Hồng Bàng','Ngô Quyền','Lê Chân','Hải An','Kiến An','Đồ Sơn','Dương Kinh',
    'Thủy Nguyên','An Dương','An Lão','Kiến Thụy','Tiên Lãng','Vĩnh Bảo','Cát Hải',
    // Hải Dương (sáp nhập vào Hải Phòng)
    'Hải Dương','Chí Linh','Kinh Môn','Nam Sách','Thanh Hà',
    'Cẩm Giàng','Bình Giang','Gia Lộc','Tứ Kỳ','Ninh Giang','Thanh Miện',
  ],
  'Quảng Ninh': [
    'Hạ Long','Móng Cái','Uông Bí','Cẩm Phả','Quảng Yên','Đông Triều',
    'Vân Đồn','Tiên Yên','Đầm Hà','Hải Hà','Bình Liêu','Ba Chẽ','Cô Tô',
  ],
  'Nghệ An': [
    'Vinh','Cửa Lò','Thái Hòa','Hoàng Mai','Diễn Châu','Yên Thành',
    'Nghi Lộc','Hưng Nguyên','Nam Đàn','Thanh Chương','Đô Lương','Anh Sơn',
    'Con Cuông','Tân Kỳ','Nghĩa Đàn','Quỳnh Lưu','Quỳ Hợp','Quỳ Châu',
    'Tương Dương','Kỳ Sơn',
  ],
  'Thanh Hóa': [
    'Thanh Hóa','Sầm Sơn','Bỉm Sơn','Nghi Sơn','Hà Trung','Hậu Lộc',
    'Hoằng Hóa','Quảng Xương','Nông Cống','Đông Sơn','Triệu Sơn','Thiệu Hóa',
    'Yên Định','Vĩnh Lộc','Thạch Thành','Cẩm Thủy','Ngọc Lặc','Lang Chánh',
    'Như Xuân','Như Thanh','Thường Xuân','Bá Thước','Quan Hóa','Quan Sơn','Mường Lát',
  ],
  'Đà Nẵng': [
    // Đà Nẵng cũ
    'Hải Châu','Thanh Khê','Sơn Trà','Ngũ Hành Sơn','Liên Chiểu','Cẩm Lệ','Hòa Vang',
    // Quảng Nam (sáp nhập vào Đà Nẵng)
    'Hội An','Tam Kỳ','Điện Bàn','Duy Xuyên','Thăng Bình','Núi Thành',
    'Phú Ninh','Hiệp Đức','Tiên Phước','Bắc Trà My','Nam Trà My',
    'Phước Sơn','Đại Lộc','Quế Sơn','Nông Sơn','Tây Giang','Đông Giang','Nam Giang',
  ],
  'Huế': [
    'TP. Huế','Hương Thủy','Hương Trà',
    'Phong Điền','Quảng Điền','Phú Vang','Phú Lộc','A Lưới','Nam Đông',
  ],
  'Quảng Ngãi': [
    // Quảng Ngãi cũ
    'Quảng Ngãi','Đức Phổ','Mộ Đức','Tư Nghĩa','Nghĩa Hành',
    'Bình Sơn','Sơn Hà','Sơn Tây','Trà Bồng','Minh Long','Lý Sơn',
    // Kon Tum (sáp nhập vào Quảng Ngãi)
    'Kon Tum','Đắk Hà','Đắk Tô','Ngọc Hồi','Sa Thầy','Kon Plông','Kon Rẫy','Tu Mơ Rông',
  ],
  'Khánh Hòa': [
    // Khánh Hòa cũ
    'Nha Trang','Cam Ranh','Cam Lâm','Diên Khánh','Khánh Vĩnh','Khánh Sơn','Vạn Ninh','Ninh Hòa',
    // Phú Yên (sáp nhập vào Khánh Hòa)
    'Tuy Hòa','Sông Cầu','Đông Hòa','Tây Hòa','Phú Hòa','Tuy An','Sơn Hòa','Sông Hinh','Đồng Xuân',
  ],
  'Gia Lai': [
    // Gia Lai cũ
    'Pleiku','An Khê','Ayun Pa','Chư Pah','Chư Prông','Chư Sê','Chư Pưh',
    'Đắk Đoa','Đắk Pơ','Đức Cơ','Ia Grai','Ia Pa','KBang','Kông Chro','Krông Pa','Mang Yang','Phú Thiện',
    // Bình Định (sáp nhập vào Gia Lai)
    'Quy Nhơn','An Nhơn','Hoài Nhơn','Tây Sơn','Phù Cát','Phù Mỹ',
    'Vĩnh Thạnh','Tuy Phước','An Lão','Hoài Ân','Vân Canh',
  ],
  'Đắk Lắk': [
    // Đắk Lắk cũ
    'Buôn Ma Thuột','Buôn Hồ','Ea Súp','Buôn Đôn','Cư Mgar','Ea Kar',
    'Ea Hleo','Krông Ana','Krông Bông','Krông Búk','Krông Năng','Krông Pắc','Lắk','Mdrắk',
    // Đắk Nông (sáp nhập vào Đắk Lắk)
    'Gia Nghĩa','Đắk Glong','Đắk Mil','Đắk Rlấp','Đắk Song','Krông Nô','Tuy Đức','Cư Jút',
  ],
  'Lâm Đồng': [
    // Lâm Đồng cũ
    'Đà Lạt','Bảo Lộc','Đam Rông','Lạc Dương','Lâm Hà','Đơn Dương',
    'Đức Trọng','Di Linh','Bảo Lâm','Đạ Huoai','Đạ Tẻh','Cát Tiên',
    // Ninh Thuận (sáp nhập vào Lâm Đồng)
    'Phan Rang-Tháp Chàm','Ninh Phước','Ninh Hải','Ninh Sơn','Bác Ái','Thuận Bắc','Thuận Nam',
    // Bình Thuận (sáp nhập vào Lâm Đồng)
    'Phan Thiết','La Gi','Bắc Bình','Hàm Thuận Bắc','Hàm Thuận Nam','Hàm Tân','Đức Linh','Tánh Linh',
  ],
  'TP. Hồ Chí Minh': [
    // TP. HCM cũ – nội thành
    'Quận 1','Quận 3','Quận 4','Quận 5','Quận 6','Quận 7','Quận 8',
    'Quận 10','Quận 11','Quận 12','Bình Thạnh','Bình Tân','Gò Vấp',
    'Phú Nhuận','Tân Bình','Tân Phú','Thủ Đức',
    // TP. HCM cũ – ngoại thành
    'Bình Chánh','Cần Giờ','Củ Chi','Hóc Môn','Nhà Bè',
    // Bình Dương (sáp nhập vào TP. HCM)
    'Thủ Dầu Một','Dĩ An','Thuận An','Bến Cát','Tân Uyên','Phú Giáo','Bàu Bàng','Dầu Tiếng',
    // Bà Rịa – Vũng Tàu (sáp nhập vào TP. HCM)
    'Vũng Tàu','Bà Rịa','Phú Mỹ','Châu Đức','Long Điền','Xuyên Mộc','Đất Đỏ',
  ],
  'Cần Thơ': [
    // Cần Thơ cũ
    'Ninh Kiều','Bình Thủy','Cái Răng','Ô Môn','Thốt Nốt',
    'Phong Điền','Cờ Đỏ','Thới Lai','Vĩnh Thạnh',
    // Hậu Giang (sáp nhập vào Cần Thơ)
    'Vị Thanh','Ngã Bảy','Long Mỹ','Vị Thủy','Châu Thành A','Phụng Hiệp',
    // Sóc Trăng (sáp nhập vào Cần Thơ)
    'Sóc Trăng','Ngã Năm','Vĩnh Châu','Kế Sách','Mỹ Tú','Long Phú','Mỹ Xuyên','Thạnh Trị','Trần Đề',
  ],
  'An Giang': [
    'Long Xuyên','Châu Đốc','Tân Châu',
    'An Phú','Châu Phú','Châu Thành','Chợ Mới','Phú Tân','Thoại Sơn','Tịnh Biên','Tri Tôn',
  ],
  'Đồng Nai': [
    // Đồng Nai cũ
    'Biên Hòa','Long Khánh','Nhơn Trạch','Long Thành','Vĩnh Cửu',
    'Tân Phú','Định Quán','Trảng Bom','Thống Nhất','Cẩm Mỹ','Xuân Lộc',
    // Bình Phước (sáp nhập vào Đồng Nai)
    'Đồng Xoài','Phước Long','Bình Long','Bù Gia Mập','Lộc Ninh',
    'Bù Đốp','Hớn Quản','Đồng Phú','Bù Đăng','Chơn Thành','Phú Riềng',
  ],
  'Tây Ninh': [
    // Tây Ninh cũ
    'Tây Ninh','Hòa Thành','Trảng Bàng','Gò Dầu','Bến Cầu',
    'Châu Thành (Tây Ninh)','Dương Minh Châu','Tân Biên','Tân Châu',
    // Long An (sáp nhập vào Tây Ninh)
    'Tân An','Kiến Tường','Đức Hòa','Đức Huệ','Cần Đước','Cần Giuộc',
    'Bến Lức','Thủ Thừa','Tân Thạnh','Thạnh Hóa','Mộc Hóa','Vĩnh Hưng',
    'Châu Thành (Long An)','Tân Trụ',
  ],
  'Đồng Tháp': [
    // Đồng Tháp cũ
    'Cao Lãnh','Sa Đéc','Hồng Ngự','Tam Nông','Thanh Bình',
    'Lấp Vò','Lai Vung','Tháp Mười','Châu Thành (Đồng Tháp)',
    // Tiền Giang (sáp nhập vào Đồng Tháp)
    'Mỹ Tho','Gò Công','Cai Lậy','Chợ Gạo','Gò Công Đông',
    'Gò Công Tây','Tân Phú Đông','Tân Phước','Cái Bè','Châu Thành (Tiền Giang)',
  ],
  'Vĩnh Long': [
    // Vĩnh Long cũ
    'Vĩnh Long','Bình Minh','Long Hồ','Mang Thít','Tam Bình','Trà Ôn','Vũng Liêm',
    // Bến Tre (sáp nhập vào Vĩnh Long)
    'Bến Tre','Ba Tri','Bình Đại','Chợ Lách','Giồng Trôm',
    'Mỏ Cày Bắc','Mỏ Cày Nam','Thạnh Phú','Châu Thành (Bến Tre)',
    // Trà Vinh (sáp nhập vào Vĩnh Long)
    'Trà Vinh','Cầu Kè','Cầu Ngang','Duyên Hải','Tiểu Cần','Trà Cú','Châu Thành (Trà Vinh)',
  ],
  'Tuyên Quang': [
    // Tuyên Quang cũ
    'Tuyên Quang','Chiêm Hóa','Hàm Yên','Lâm Bình','Na Hang','Sơn Dương','Yên Sơn',
    // Hà Giang (sáp nhập vào Tuyên Quang)
    'Hà Giang','Bắc Mê','Bắc Quang','Đồng Văn','Hoàng Su Phì','Mèo Vạc',
    'Quản Bạ','Quang Bình','Vị Xuyên','Xín Mần','Yên Minh',
  ],
  'Lào Cai': [
    // Lào Cai cũ
    'Lào Cai','Bát Xát','Bắc Hà','Bảo Thắng','Bảo Yên','Mường Khương','Sa Pa','Si Ma Cai','Văn Bàn',
    // Yên Bái (sáp nhập vào Lào Cai)
    'Yên Bái','Nghĩa Lộ','Lục Yên','Mù Cang Chải','Trạm Tấu','Trấn Yên','Văn Chấn','Văn Yên','Yên Bình',
  ],
  'Thái Nguyên': [
    // Thái Nguyên cũ
    'Thái Nguyên','Sông Công','Phổ Yên','Đại Từ','Đồng Hỷ','Phú Bình','Phú Lương','Định Hóa','Võ Nhai',
    // Bắc Kạn (sáp nhập vào Thái Nguyên)
    'Bắc Kạn','Bạch Thông','Ba Bể','Chợ Đồn','Chợ Mới','Na Rì','Ngân Sơn','Pác Nặm',
  ],
  'Phú Thọ': [
    // Phú Thọ cũ
    'Việt Trì','Phú Thọ','Đoan Hùng','Hạ Hòa','Thanh Ba','Cẩm Khê','Yên Lập',
    'Tân Sơn','Thanh Sơn','Thanh Thủy','Lâm Thao','Phù Ninh','Tam Nông',
    // Vĩnh Phúc (sáp nhập vào Phú Thọ)
    'Vĩnh Yên','Phúc Yên','Bình Xuyên','Lập Thạch','Sông Lô','Tam Đảo','Tam Dương','Vĩnh Tường','Yên Lạc',
    // Hòa Bình (sáp nhập vào Phú Thọ)
    'Hòa Bình','Cao Phong','Đà Bắc','Kim Bôi','Lạc Sơn','Lạc Thủy','Lương Sơn','Mai Châu','Tân Lạc','Yên Thủy',
  ],
  'Bắc Ninh': [
    // Bắc Ninh cũ
    'Bắc Ninh','Từ Sơn','Gia Bình','Lương Tài','Quế Võ','Thuận Thành','Tiên Du','Yên Phong',
    // Bắc Giang (sáp nhập vào Bắc Ninh)
    'Bắc Giang','Hiệp Hòa','Lạng Giang','Lục Nam','Lục Ngạn','Sơn Động','Tân Yên','Việt Yên','Yên Dũng','Yên Thế',
  ],
  'Hưng Yên': [
    // Hưng Yên cũ
    'Hưng Yên','Ân Thi','Kim Động','Khoái Châu','Mỹ Hào','Phù Cừ','Tiên Lữ','Văn Giang','Văn Lâm','Yên Mỹ',
    // Thái Bình (sáp nhập vào Hưng Yên)
    'Thái Bình','Đông Hưng','Hưng Hà','Kiến Xương','Quỳnh Phụ','Thái Thụy','Tiền Hải','Vũ Thư',
  ],
  'Ninh Bình': [
    // Ninh Bình cũ
    'Ninh Bình','Tam Điệp','Gia Viễn','Hoa Lư','Kim Sơn','Nho Quan','Yên Khánh','Yên Mô',
    // Hà Nam (sáp nhập vào Ninh Bình)
    'Phủ Lý','Duy Tiên','Kim Bảng','Lý Nhân','Thanh Liêm',
    // Nam Định (sáp nhập vào Ninh Bình)
    'Nam Định','Mỹ Lộc','Nam Trực','Nghĩa Hưng','Trực Ninh','Vụ Bản','Xuân Trường','Ý Yên','Hải Hậu','Giao Thủy',
  ],
  'Quảng Trị': [
    // Quảng Trị cũ
    'Đông Hà','TX. Quảng Trị','Gio Linh','Cam Lộ','Đa Krông','Hải Lăng','Hướng Hóa','Triệu Phong','Vĩnh Linh',
    // Quảng Bình (sáp nhập vào Quảng Trị)
    'Đồng Hới','Ba Đồn','Bố Trạch','Lệ Thủy','Minh Hóa','Quảng Trạch','Tuyên Hóa',
  ],
  'Hà Tĩnh': [
    'Hà Tĩnh','Hồng Lĩnh','Kỳ Anh','Cẩm Xuyên','Can Lộc','Đức Thọ',
    'Hương Khê','Hương Sơn','Lộc Hà','Nghi Xuân','Thạch Hà','Vũ Quang',
  ],
  'Cao Bằng': [
    'Cao Bằng','Bảo Lạc','Bảo Lâm','Hà Quảng','Hạ Lang','Hòa An',
    'Nguyên Bình','Quảng Hòa','Thạch An','Trùng Khánh',
  ],
  'Điện Biên': [
    'Điện Biên Phủ','Mường Ảng','Mường Chà','Mường Nhé','Nậm Pồ',
    'Tủa Chùa','Tuần Giáo','Điện Biên','Điện Biên Đông',
  ],
  'Lai Châu': [
    'Lai Châu','Mường Tè','Nậm Nhùn','Phong Thổ','Sìn Hồ','Tân Uyên','Than Uyên',
  ],
  'Lạng Sơn': [
    'Lạng Sơn','Bắc Sơn','Bình Gia','Cao Lộc','Chi Lăng','Đình Lập',
    'Hữu Lũng','Lộc Bình','Tràng Định','Văn Lãng','Văn Quan',
  ],
  'Sơn La': [
    'Sơn La','Bắc Yên','Mai Sơn','Mộc Châu','Mường La','Phù Yên',
    'Quỳnh Nhai','Sông Mã','Sốp Cộp','Thuận Châu','Vân Hồ','Yên Châu',
  ],
  'Cà Mau': [
    // Cà Mau cũ
    'Cà Mau','Đầm Dơi','Cái Nước','Thới Bình','Trần Văn Thời','U Minh','Ngọc Hiển','Năm Căn','Phú Tân',
    // Bạc Liêu (sáp nhập vào Cà Mau)
    'Bạc Liêu','Đông Hải','Giá Rai','Hòa Bình (Bạc Liêu)','Hồng Dân','Phước Long','Vĩnh Lợi',
  ],
};

function CheckoutPage({ cart, token, currentUser, onSuccess, navigateTo }) {
  const [form, setForm] = React.useState({
    name: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: '', city: '', district: ''
  });
  const [delivery, setDelivery] = React.useState('standard');
  const [payment, setPayment] = React.useState('cod');
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const rates = getZoneRates(form.city);
  const shipping = delivery === 'express'
    ? rates.express
    : (subtotal >= rates.freeThreshold ? 0 : rates.standard);
  const total = subtotal + shipping;

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const setCity = (val) => {
    setForm(f => ({ ...f, city: val, district: '' }));
    setErrors(e => ({ ...e, city: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^0[0-9]{9,10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    if (!form.email.trim()) e.email = 'Vui lòng nhập email để nhận xác nhận đơn hàng';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Email không đúng định dạng';
    if (!form.address.trim()) e.address = 'Vui lòng nhập địa chỉ';
    if (!form.city) e.city = 'Vui lòng chọn tỉnh/thành';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    const body = {
      customerName:   form.name.trim(),
      customerPhone:  form.phone.trim(),
      customerEmail:  form.email.trim(),
      address:        form.address.trim(),
      city:           form.city,
      district:       form.district.trim() || null,
      deliveryMethod: delivery,
      paymentMethod:  payment,
      items: cart.map(i => ({ productId: i.product.id, quantity: i.qty })),
    };

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(API_BASE + '/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then(r => r.json())
      .then(data => {
        setSubmitting(false);
        onSuccess(data.orderCode, payment);
      })
      .catch(() => {
        setSubmitting(false);
        alert('Đặt hàng thất bại. Vui lòng thử lại.');
      });
  };

  const cities = [
    'An Giang','Bắc Ninh','Cà Mau','Cần Thơ','Cao Bằng',
    'Đà Nẵng','Đắk Lắk','Điện Biên','Đồng Nai','Đồng Tháp',
    'Gia Lai','Hà Nội','Hà Tĩnh','Hải Phòng','Huế',
    'Hưng Yên','Khánh Hòa','Lai Châu','Lâm Đồng','Lạng Sơn',
    'Lào Cai','Nghệ An','Ninh Bình','Phú Thọ','Quảng Ngãi',
    'Quảng Ninh','Quảng Trị','Sơn La','Tây Ninh','Thái Nguyên',
    'Thanh Hóa','TP. Hồ Chí Minh','Tuyên Quang','Vĩnh Long',
  ];

  const districtOptions = DISTRICTS[form.city] || [];

  const RadioOpt = ({ checked, onSelect, label, sub, right }) => (
    <div className={`radio-opt${checked ? ' checked' : ''}`} onClick={onSelect}>
      <div className={`radio-dot${checked ? ' on' : ''}`}><div/></div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:500 }}>{label}</div>
        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{sub}</div>
      </div>
      {right && <div style={{ fontSize:14, fontWeight:600, color: right === 'Miễn phí' ? 'var(--green)' : 'var(--text)' }}>{right}</div>}
    </div>
  );

  const standardLabel = !form.city
    ? `Từ ${formatPrice(ZONE_RATES.central.standard)}`
    : (subtotal >= rates.freeThreshold ? 'Miễn phí' : formatPrice(rates.standard));

  return (
    <div className="page-enter" style={{ padding:'32px 0 80px' }}>
      <div className="container">
        <button className="btn btn-ghost back-btn" onClick={() => navigateTo('home')}>
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M11 3.5L5.5 9l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Quay lại mua sắm
        </button>
        <h1 className="page-title">Thanh toán</h1>

        <div className="checkout-grid">
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Shipping info */}
            <div className="card-section">
              <h2 className="section-title">Thông tin giao hàng</h2>
              <div className="form-stack">
                <div className="form-field">
                  <label>Họ và tên *</label>
                  <input className={`field-input${errors.name ? ' err' : ''}`} type="text" placeholder="Nguyễn Văn A" value={form.name} onChange={e => set('name', e.target.value)}/>
                  {errors.name && <p className="err-msg">{errors.name}</p>}
                </div>
                <div className="form-row2">
                  <div className="form-field">
                    <label>Số điện thoại *</label>
                    <input className={`field-input${errors.phone ? ' err' : ''}`} type="tel" placeholder="0912 345 678" value={form.phone} onChange={e => set('phone', e.target.value)}/>
                    {errors.phone && <p className="err-msg">{errors.phone}</p>}
                  </div>
                  <div className="form-field">
                    <label>Email *</label>
                    <input className={`field-input${errors.email ? ' err' : ''}`} type="email" placeholder="example@email.com" value={form.email} onChange={e => set('email', e.target.value)}/>
                    {errors.email && <p className="err-msg">{errors.email}</p>}
                  </div>
                </div>
                <div className="form-field">
                  <label>Địa chỉ *</label>
                  <input className={`field-input${errors.address ? ' err' : ''}`} type="text" placeholder="Số nhà, tên đường, phường/xã" value={form.address} onChange={e => set('address', e.target.value)}/>
                  {errors.address && <p className="err-msg">{errors.address}</p>}
                </div>
                <div className="form-row2">
                  <div className="form-field">
                    <label>Tỉnh / Thành phố *</label>
                    <select className={`field-input field-select${errors.city ? ' err' : ''}`} value={form.city} onChange={e => setCity(e.target.value)}>
                      <option value="">Chọn tỉnh/thành</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.city && <p className="err-msg">{errors.city}</p>}
                  </div>
                  <div className="form-field">
                    <label>Khu vực / Quận Huyện</label>
                    <select
                      className="field-input field-select"
                      value={form.district}
                      onChange={e => set('district', e.target.value)}
                      disabled={!form.city}
                    >
                      <option value="">{form.city ? 'Chọn khu vực' : 'Chọn tỉnh/thành trước'}</option>
                      {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="card-section">
              <h2 className="section-title">Phương thức vận chuyển</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <RadioOpt checked={delivery==='standard'} onSelect={()=>setDelivery('standard')} label="Giao hàng tiêu chuẩn" sub="3–5 ngày làm việc" right={standardLabel}/>
                <RadioOpt checked={delivery==='express'} onSelect={()=>setDelivery('express')} label="Giao hàng nhanh" sub="1–2 ngày làm việc" right={!form.city ? `Từ ${formatPrice(ZONE_RATES.central.express)}` : formatPrice(rates.express)}/>
              </div>
              {form.city && SHIPPING_ZONES[form.city] !== 'central' && (
                <p style={{ margin:'8px 0 0', fontSize:12, color:'var(--text-muted)' }}>
                  Phí ship ngoài Miền Trung: tiêu chuẩn {formatPrice(ZONE_RATES.other.standard)} (miễn phí ≥ {formatPrice(ZONE_RATES.other.freeThreshold)}), nhanh {formatPrice(ZONE_RATES.other.express)}
                </p>
              )}
            </div>

            {/* Payment */}
            <div className="card-section">
              <h2 className="section-title">Phương thức thanh toán</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <RadioOpt checked={payment==='cod'} onSelect={()=>setPayment('cod')} label="Thanh toán khi nhận hàng (COD)" sub="Trả tiền mặt khi nhận"/>
                <RadioOpt checked={payment==='bank'} onSelect={()=>setPayment('bank')} label="Chuyển khoản ngân hàng" sub="Chuyển trước khi giao hàng"/>
              </div>
              {payment === 'bank' && (
                <div style={{
                  marginTop: 12, padding: '14px 16px',
                  background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10
                }}>
                  <p style={{ margin:'0 0 10px', fontSize:13, fontWeight:600, color:'#92400E' }}>Thông tin chuyển khoản</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:5, fontSize:13, color:'#333' }}>
                    <div><span style={{ color:'#888', minWidth:110, display:'inline-block' }}>Ngân hàng:</span> <strong>{window.BANK_INFO.bankName}</strong></div>
                    <div><span style={{ color:'#888', minWidth:110, display:'inline-block' }}>Số tài khoản:</span> <strong>{window.BANK_INFO.accountNumber}</strong></div>
                    <div><span style={{ color:'#888', minWidth:110, display:'inline-block' }}>Chủ tài khoản:</span> <strong>{window.BANK_INFO.accountHolder}</strong></div>
                  </div>
                  <p style={{ margin:'10px 0 0', fontSize:12, color:'#92400E' }}>
                    Liên hệ người bán để xác nhận: <strong>0971700427</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="checkout-summary">
            <div className="card-section">
              <h2 className="section-title">Đơn hàng của bạn</h2>
              <div className="summary-items">
                {cart.map(item => (
                  <div key={item.product.id} className="summary-item">
                    <div className="summary-thumb"><ProductImage product={item.product}/></div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p className="summary-item-name">{item.product.name}</p>
                      <p className="summary-item-sub">{item.product.weight} × {item.qty}</p>
                    </div>
                    <span className="summary-item-price">{formatPrice(item.product.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8, padding:'14px 0', borderBottom:'1px solid var(--border-lt)' }}>
                <div className="sum-row"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
                <div className="sum-row">
                  <span>Vận chuyển</span>
                  <span style={{ color: shipping===0 ? 'var(--green)' : 'inherit' }}>{shipping===0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                </div>
              </div>
              <div className="sum-total-row">
                <span>Tổng cộng</span>
                <span className="sum-grand">{formatPrice(total)}</span>
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={handleSubmit} disabled={submitting} style={{ marginTop:4, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Đang xử lý…' : 'Đặt hàng ngay'}
              </button>
              <p className="checkout-notice">Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng của chúng tôi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
