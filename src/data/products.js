(function () {
  window.API_BASE = 'http://localhost:8081/api';

  // CATEGORIES vẫn giữ client-side (có thêm 'all' mà backend không lưu)
  window.CATEGORIES = [
    { id: 'all',       label: 'Tất cả' },
    { id: 'breakfast', label: 'Ngũ cốc ăn sáng' },
    { id: 'nuts',      label: 'Hạt dinh dưỡng' },
    { id: 'healthy',   label: 'Giảm cân & Healthy' },
  ];

  window.formatPrice = p => new Intl.NumberFormat('vi-VN').format(p) + 'đ';
  window.calcDiscount = (p, op) => op ? Math.round((1 - p / op) * 100) : 0;
})();
