function ProfilePage({ token, currentUser, onUpdate, onBack }) {
  const [form, setForm] = React.useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
  });
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.fullName.trim()) { setError('Vui lòng nhập họ tên'); return; }
    setSaving(true); setError('');
    fetch(`${window.API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ fullName: form.fullName.trim(), phone: form.phone.trim() || null }),
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setSaving(false); setSaved(true);
        onUpdate(data);
        setTimeout(() => setSaved(false), 2500);
      })
      .catch(() => { setSaving(false); setError('Cập nhật thất bại. Thử lại.'); });
  };

  const isGoogle = currentUser?.avatarUrl && !currentUser.avatarUrl.startsWith('data:');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '2rem 1rem' }}>

        <button onClick={onBack} style={{
          background: 'none', border: '1.5px solid #ddd', borderRadius: 8,
          padding: '0.4rem 0.9rem', cursor: 'pointer', fontSize: '0.9rem',
          color: 'var(--text)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem'
        }}>← Quay lại</button>

        <h1 style={{ margin: '0 0 1.75rem', fontSize: '1.5rem', color: 'var(--primary-dark)', fontFamily: 'Lora, serif' }}>
          Hồ sơ cá nhân
        </h1>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          {currentUser?.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '1.5rem'
            }}>
              {(currentUser?.fullName || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{currentUser?.fullName}</div>
            <div style={{ fontSize: '0.82rem', color: '#888' }}>{currentUser?.email}</div>
            {isGoogle && (
              <div style={{ fontSize: '0.75rem', color: '#4A7C59', marginTop: '0.2rem' }}>
                Đăng nhập qua Google
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <div className="form-stack">
            <div className="form-field">
              <label>Họ và tên *</label>
              <input
                className="field-input"
                value={form.fullName}
                onChange={e => set('fullName', e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="form-field">
              <label>Số điện thoại</label>
              <input
                className="field-input"
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="0912 345 678"
              />
            </div>
            <div className="form-field">
              <label style={{ color: '#aaa' }}>Email (không thể thay đổi)</label>
              <input className="field-input" value={currentUser?.email || ''} disabled style={{ background: '#f5f5f5', color: '#aaa', cursor: 'not-allowed' }} />
            </div>
          </div>

          {error && <p style={{ color: '#DC2626', fontSize: '0.85rem', marginTop: '0.75rem' }}>{error}</p>}

          {saved && (
            <div style={{
              background: '#EBF5EF', color: '#4A7C59', borderRadius: 8,
              padding: '0.6rem 1rem', fontSize: '0.88rem', marginTop: '1rem', fontWeight: 500
            }}>
              Đã cập nhật thông tin thành công!
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ marginTop: '1.25rem', width: '100%', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}
