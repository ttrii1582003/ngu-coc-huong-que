function RegisterPage({ onLogin, navigateTo }) {
  const [form, setForm] = React.useState({ fullName: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const googleBtnRef = React.useRef(null);

  React.useEffect(() => {
    if (!window.google || !GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE')) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'outline', size: 'large', width: '100%', text: 'signup_with',
    });
  }, []);

  const handleGoogleResponse = (response) => {
    setSubmitting(true);
    fetch(API_BASE + '/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: response.credential }),
    })
      .then(r => r.json())
      .then(data => { setSubmitting(false); onLogin(data.token, data); })
      .catch(() => { setSubmitting(false); alert('Đăng ký Google thất bại.'); });
  };

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên';
    if (!form.email.trim()) e.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ';
    if (!form.password) e.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6) e.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (form.password !== form.confirm) e.confirm = 'Mật khẩu xác nhận không khớp';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    fetch(API_BASE + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || null,
      }),
    })
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || 'Đăng ký thất bại');
        return data;
      })
      .then(data => { setSubmitting(false); onLogin(data.token, data); })
      .catch(err => { setSubmitting(false); setErrors({ email: err.message }); });
  };

  return (
    <div className="page-enter" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px', background:'var(--bg)' }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div className="card-section">
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <h1 style={{ fontSize:22, fontWeight:700, color:'var(--primary-dark)', marginBottom:6 }}>Tạo tài khoản</h1>
            <p style={{ fontSize:14, color:'var(--text-muted)' }}>Đăng ký để theo dõi đơn hàng và nhận ưu đãi</p>
          </div>

          <div className="form-stack">
            <div className="form-field">
              <label>Họ và tên *</label>
              <input className={`field-input${errors.fullName ? ' err' : ''}`} type="text" placeholder="Nguyễn Văn A"
                value={form.fullName} onChange={e => set('fullName', e.target.value)} />
              {errors.fullName && <p className="err-msg">{errors.fullName}</p>}
            </div>
            <div className="form-field">
              <label>Email *</label>
              <input className={`field-input${errors.email ? ' err' : ''}`} type="email" placeholder="example@email.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
              {errors.email && <p className="err-msg">{errors.email}</p>}
            </div>
            <div className="form-field">
              <label>Số điện thoại</label>
              <input className="field-input" type="tel" placeholder="0912 345 678"
                value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Mật khẩu *</label>
              <input className={`field-input${errors.password ? ' err' : ''}`} type="password" placeholder="Ít nhất 6 ký tự"
                value={form.password} onChange={e => set('password', e.target.value)} />
              {errors.password && <p className="err-msg">{errors.password}</p>}
            </div>
            <div className="form-field">
              <label>Xác nhận mật khẩu *</label>
              <input className={`field-input${errors.confirm ? ' err' : ''}`} type="password" placeholder="Nhập lại mật khẩu"
                value={form.confirm} onChange={e => set('confirm', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              {errors.confirm && <p className="err-msg">{errors.confirm}</p>}
            </div>

            <button className="btn btn-primary btn-full btn-lg" onClick={handleSubmit} disabled={submitting}
              style={{ opacity: submitting ? 0.7 : 1, marginTop:4 }}>
              {submitting ? 'Đang xử lý…' : 'Đăng ký'}
            </button>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
            <div style={{ flex:1, height:1, background:'var(--border-lt)' }}/>
            <span style={{ fontSize:13, color:'var(--text-muted)' }}>hoặc</span>
            <div style={{ flex:1, height:1, background:'var(--border-lt)' }}/>
          </div>

          <div ref={googleBtnRef} style={{ display:'flex', justifyContent:'center' }}>
            {(!window.GOOGLE_CLIENT_ID || window.GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE')) && (
              <p style={{ fontSize:12, color:'var(--text-muted)', textAlign:'center' }}>
                (Chưa cấu hình Google Client ID)
              </p>
            )}
          </div>

          <p style={{ textAlign:'center', fontSize:14, marginTop:24, color:'var(--text-muted)' }}>
            Đã có tài khoản?{' '}
            <button onClick={() => navigateTo('login')} style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:600, cursor:'pointer', fontSize:14 }}>
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
