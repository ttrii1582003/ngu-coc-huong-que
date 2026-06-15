function OrderSuccessPage({ orderCode, paymentMethod, onContinue }) {
  const orderId = orderCode || ('HQ' + Math.random().toString(36).substr(2, 8).toUpperCase());
  const isBank = paymentMethod === 'bank';

  const steps = [
    {
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 5V4a4 4 0 018 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
      text: 'Đơn hàng đang được xử lý',
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M9 6v4M9 12v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
      text: isBank ? 'Chuyển khoản theo thông tin bên dưới' : 'SMS xác nhận trong 15 phút',
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

        {isBank && (
          <div style={{
            width: '100%', marginTop: 16,
            padding: '16px 18px', background: '#FFFBEB',
            border: '1px solid #FDE68A', borderRadius: 12, textAlign: 'left'
          }}>
            <p style={{ margin:'0 0 12px', fontSize:14, fontWeight:700, color:'#92400E' }}>
              Thông tin chuyển khoản
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:6, fontSize:13, color:'#333' }}>
              <div><span style={{ color:'#888', minWidth:120, display:'inline-block' }}>Ngân hàng:</span> <strong>{window.BANK_INFO.bankName}</strong></div>
              <div><span style={{ color:'#888', minWidth:120, display:'inline-block' }}>Số tài khoản:</span> <strong>{window.BANK_INFO.accountNumber}</strong></div>
              <div><span style={{ color:'#888', minWidth:120, display:'inline-block' }}>Chủ tài khoản:</span> <strong>{window.BANK_INFO.accountHolder}</strong></div>
              <div style={{ marginTop:4 }}>
                <span style={{ color:'#888', minWidth:120, display:'inline-block' }}>Nội dung CK:</span>
                <strong style={{ color:'#92400E' }}>{orderId}</strong>
              </div>
              <div style={{ marginTop:4 }}>
                <span style={{ color:'#888', minWidth:120, display:'inline-block' }}>Liên hệ xác nhận:</span>
                <strong>0971700427</strong>
              </div>
            </div>
            <div style={{ marginTop:12, padding:'10px 12px', background:'#FEF3C7', borderRadius:8, fontSize:12, color:'#78350F' }}>
              <strong>Lưu ý:</strong> Đơn hàng sẽ được xác nhận trong vòng 24 giờ sau khi nhận được thanh toán.
              Nếu sản phẩm hết hàng, chúng tôi sẽ liên hệ qua số điện thoại đã đăng ký và hoàn tiền
              trong vòng 1–3 ngày làm việc. Vui lòng giữ lại ảnh xác nhận chuyển khoản.
            </div>
          </div>
        )}

        <div className="success-steps" style={{ marginTop: isBank ? 16 : undefined }}>
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
