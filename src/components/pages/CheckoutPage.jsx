function CheckoutPage({ cart, token, onSuccess, navigateTo }) {
  const [form, setForm] = React.useState({ name:'', phone:'', email:'', address:'', city:'', district:'' });
  const [delivery, setDelivery] = React.useState('standard');
  const [payment, setPayment] = React.useState('cod');
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = delivery === 'express' ? 45000 : (subtotal >= 300000 ? 0 : 30000);
  const total = subtotal + shipping;

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Số điện thoại không hợp lệ';
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
      customerEmail:  form.email.trim() || null,
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
        onSuccess(data.orderCode);
      })
      .catch(() => {
        setSubmitting(false);
        alert('Đặt hàng thất bại. Vui lòng thử lại.');
      });
  };

  const cities = ['Hà Nội','TP. Hồ Chí Minh','Đà Nẵng','Hải Phòng','Cần Thơ','An Giang','Bình Dương','Bình Phước','Đắk Lắk','Đồng Nai','Gia Lai','Khánh Hòa','Lâm Đồng','Long An','Nghệ An','Quảng Nam','Quảng Ngãi','Quảng Ninh','Thanh Hóa','Thừa Thiên Huế','Tiền Giang','Vĩnh Long'];

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
                    <label>Email</label>
                    <input className="field-input" type="email" placeholder="example@email.com" value={form.email} onChange={e => set('email', e.target.value)}/>
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
                    <select className={`field-input field-select${errors.city ? ' err' : ''}`} value={form.city} onChange={e => set('city', e.target.value)}>
                      <option value="">Chọn tỉnh/thành</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.city && <p className="err-msg">{errors.city}</p>}
                  </div>
                  <div className="form-field">
                    <label>Quận / Huyện</label>
                    <input className="field-input" type="text" placeholder="Tên quận/huyện" value={form.district} onChange={e => set('district', e.target.value)}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="card-section">
              <h2 className="section-title">Phương thức vận chuyển</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <RadioOpt checked={delivery==='standard'} onSelect={()=>setDelivery('standard')} label="Giao hàng tiêu chuẩn" sub="3–5 ngày làm việc" right={subtotal>=300000?'Miễn phí':formatPrice(30000)}/>
                <RadioOpt checked={delivery==='express'} onSelect={()=>setDelivery('express')} label="Giao hàng nhanh" sub="1–2 ngày làm việc" right={formatPrice(45000)}/>
              </div>
            </div>

            {/* Payment */}
            <div className="card-section">
              <h2 className="section-title">Phương thức thanh toán</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <RadioOpt checked={payment==='cod'} onSelect={()=>setPayment('cod')} label="Thanh toán khi nhận hàng (COD)" sub="Trả tiền mặt khi nhận"/>
                <RadioOpt checked={payment==='bank'} onSelect={()=>setPayment('bank')} label="Chuyển khoản ngân hàng" sub="Chuyển trước khi giao hàng"/>
              </div>
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
