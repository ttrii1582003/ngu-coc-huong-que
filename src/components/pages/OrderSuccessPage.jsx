function OrderSuccessPage({ orderCode, onContinue }) {
  const orderId = orderCode || ('HQ' + Math.random().toString(36).substr(2, 8).toUpperCase());

  const steps = [
    {
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 5V4a4 4 0 018 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
      text: 'Đơn hàng đang được xử lý',
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M9 6v4M9 12v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
      text: 'SMS xác nhận trong 15 phút',
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9V7l3-5h8l3 5v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 9h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="5.5" cy="13" r="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="12.5" cy="13" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>,
      text: 'Giao hàng trong 3–5 ngày làm việc',
    },
  ];

  return (
    <div className="page-enter success-page">
      <div className="success-card">
        <div className="success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" fill="#4A7C59" opacity="0.12"/>
            <path d="M13 24l8 8 14-16" stroke="#4A7C59" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="success-heading">Đặt hàng thành công!</h1>
        <p className="success-sub">Cảm ơn bạn đã tin tưởng <strong>Ngũ Cốc Hương Quê</strong></p>

        <div className="order-id-box">
          <span style={{ fontSize:13, color:'var(--text-muted)' }}>Mã đơn hàng</span>
          <span className="order-id-val">{orderId}</span>
        </div>

        <div className="success-steps">
          {steps.map((s, i) => (
            <div key={i} className="success-step">
              <div className="step-icon">{s.icon}</div>
              <span>{s.text}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-lg" onClick={onContinue} style={{ marginTop:8 }}>
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
}
