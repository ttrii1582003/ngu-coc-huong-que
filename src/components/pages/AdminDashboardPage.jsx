function AdminDashboardPage({ token, onLogout, onNavigate }) {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${window.API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const KPI = [
    {
      label: 'Đơn hàng hôm nay',
      value: stats ? stats.ordersToday : '—',
      icon: '📋',
      color: '#2563EB', bg: '#EFF6FF',
      action: () => onNavigate('admin-orders'),
    },
    {
      label: 'Doanh thu hôm nay',
      value: stats ? window.formatPrice(stats.revenueToday) : '—',
      icon: '💰',
      color: '#4A7C59', bg: '#EBF5EF',
      action: null,
    },
    {
      label: 'Chờ xác nhận',
      value: stats ? stats.pendingCount : '—',
      icon: '⏳',
      color: '#C8873A', bg: '#FEF3E2',
      action: () => onNavigate('admin-orders'),
    },
    {
      label: 'Tổng đơn hàng',
      value: stats ? stats.totalOrders : '—',
      icon: '📦',
      color: '#7C3AC8', bg: '#F5F0FF',
      action: () => onNavigate('admin-orders'),
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      <AdminSidebar activePage="admin-dashboard" onNavigate={onNavigate} onLogout={onLogout} />
      <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
        <h1 style={{ margin: '0 0 0.35rem', fontSize: '1.4rem', color: 'var(--primary-dark)', fontFamily: 'Lora, serif' }}>
          Tổng quan
        </h1>
        <p style={{ margin: '0 0 1.75rem', color: '#888', fontSize: '0.85rem' }}>
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </p>

        {loading ? (
          <div style={{ color: '#888', padding: '2rem' }}>Đang tải...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {KPI.map(kpi => (
              <div
                key={kpi.label}
                onClick={kpi.action || undefined}
                style={{
                  background: '#fff', borderRadius: 12, padding: '1.25rem 1.4rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                  cursor: kpi.action ? 'pointer' : 'default',
                  borderLeft: `4px solid ${kpi.color}`,
                  transition: 'box-shadow 0.15s',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{kpi.icon}</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 700, color: kpi.color, lineHeight: 1.1, marginBottom: '0.35rem' }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>{kpi.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Quick links */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem 1.4rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', maxWidth: 480 }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#444', marginBottom: '0.85rem' }}>Truy cập nhanh</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: '📋 Quản lý đơn hàng', page: 'admin-orders' },
              { label: '📦 Quản lý sản phẩm', page: 'admin-products' },
            ].map(link => (
              <button key={link.page} onClick={() => onNavigate(link.page)} style={{
                background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8,
                padding: '0.6rem 1rem', textAlign: 'left', cursor: 'pointer',
                fontSize: '0.85rem', color: '#444', fontWeight: 500,
              }}>
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
