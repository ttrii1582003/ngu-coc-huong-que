function AdminSidebar({ activePage, onNavigate, onLogout }) {
  const NAV = [
    { id: 'admin-orders',   icon: '📋', label: 'Đơn hàng' },
    { id: 'admin-products', icon: '📦', label: 'Sản phẩm' },
  ];

  return (
    <div style={{
      width: 200, minHeight: '100vh', background: '#1F2937',
      display: 'flex', flexDirection: 'column', flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #374151' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
          <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
            <path d="M15 26V10" stroke="#C8873A" strokeWidth="1.8" strokeLinecap="round"/>
            <ellipse cx="15" cy="8.5" rx="3.5" ry="6" fill="#C8873A" opacity="0.85" transform="rotate(-12 15 8.5)"/>
            <ellipse cx="15" cy="8.5" rx="3.5" ry="6" fill="#C8873A" opacity="0.65" transform="rotate(12 15 8.5)"/>
          </svg>
          <span style={{ fontFamily: 'Lora, serif', fontWeight: 700, fontSize: '0.95rem', color: '#F9FAFB' }}>
            Ngũ Cốc
          </span>
        </div>
        <span style={{
          background: '#C8873A22', color: '#C8873A',
          fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: 4
        }}>ADMIN PANEL</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
            padding: '0.65rem 1rem', border: 'none', cursor: 'pointer', textAlign: 'left',
            background: activePage === item.id ? '#C8873A22' : 'transparent',
            borderLeft: activePage === item.id ? '3px solid #C8873A' : '3px solid transparent',
            color: activePage === item.id ? '#C8873A' : '#9CA3AF',
            fontSize: '0.88rem', fontWeight: activePage === item.id ? 600 : 400,
            transition: 'all 0.15s'
          }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #374151' }}>
        <button onClick={onLogout} style={{
          width: '100%', background: 'none', border: '1px solid #374151',
          borderRadius: 6, padding: '0.45rem', cursor: 'pointer',
          color: '#9CA3AF', fontSize: '0.82rem'
        }}>Đăng xuất</button>
      </div>
    </div>
  );
}
