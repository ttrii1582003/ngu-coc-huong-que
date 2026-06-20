function AdminDashboardPage({ token, onLogout, onNavigate }) {
  const [stats, setStats] = React.useState(null);
  const [recentOrders, setRecentOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [lastRefresh, setLastRefresh] = React.useState(new Date());

  const STATUS_LABEL = {
    pending:   { text: 'Chờ xác nhận', color: '#C8873A', bg: '#FEF3E2' },
    confirmed: { text: 'Đã xác nhận',  color: '#4A7C59', bg: '#EBF5EF' },
    shipping:  { text: 'Đang giao',    color: '#2563EB', bg: '#EFF6FF' },
    delivered: { text: 'Đã giao',      color: '#16803C', bg: '#DCFCE7' },
    cancelled: { text: 'Đã huỷ',       color: '#DC2626', bg: '#FEF2F2' },
  };

  const fetchData = React.useCallback(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${window.API_BASE}/admin/stats`, { headers }).then(r => r.ok ? r.json() : Promise.reject()),
      fetch(`${window.API_BASE}/admin/orders`, { headers }).then(r => r.ok ? r.json() : Promise.reject()),
    ])
      .then(([statsData, ordersData]) => {
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 5));
        setLastRefresh(new Date());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  React.useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const KPI = [
    {
      label: 'Đơn hôm nay',
      sub: 'Không tính đơn huỷ',
      value: stats ? stats.ordersToday : '—',
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="4" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M7 4V2M15 4V2M3 9h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M7 13h4M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      color: '#2563EB', bg: '#EFF6FF',
      action: () => { window._adminOrdersInit = { today: true }; onNavigate('admin-orders'); },
    },
    {
      label: 'Doanh thu hôm nay',
      sub: 'Chỉ đơn đã giao',
      value: stats ? window.formatPrice(stats.revenueToday) : '—',
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M11 6v1.5M11 14.5V16M8.5 13.5c0 1.1.9 1.5 2.5 1.5s2.5-.6 2.5-1.8c0-1-.8-1.4-2.5-1.7-1.7-.3-2.5-.7-2.5-1.7C8.5 8.6 9.4 8 11 8s2.5.5 2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      color: '#4A7C59', bg: '#EBF5EF',
      action: () => {
        const t = new Date().toISOString().slice(0, 10);
        window._adminRevenueInit = { groupBy: 'day', from: t, to: t };
        onNavigate('admin-revenue');
      },
    },
    {
      label: 'Chờ xác nhận',
      sub: 'Cần xử lý ngay',
      value: stats ? stats.pendingCount : '—',
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M11 7v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#C8873A', bg: '#FEF3E2',
      action: () => { window._adminOrdersInit = { status: 'pending' }; onNavigate('admin-orders'); },
    },
    {
      label: 'Doanh thu tháng này',
      sub: new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
      value: stats ? window.formatPrice(stats.revenueMonth) : '—',
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M3 16l4.5-5 4 3 4-7 3.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 19h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      color: '#7C3AC8', bg: '#F5F0FF',
      action: () => {
        const now = new Date();
        const t   = now.toISOString().slice(0, 10);
        const m1  = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        window._adminRevenueInit = { groupBy: 'day', from: m1, to: t };
        onNavigate('admin-revenue');
      },
    },
  ];

  const formatDate = iso => new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      <AdminSidebar activePage="admin-dashboard" onNavigate={onNavigate} onLogout={onLogout} />
      <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', color: 'var(--primary-dark)', fontFamily: 'Lora, serif' }}>
              Tổng quan
            </h1>
            <p style={{ margin: 0, color: '#888', fontSize: '0.82rem' }}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              {' · '}Làm mới lúc {lastRefresh.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button
            onClick={fetchData}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
              padding: '0.45rem 0.9rem', cursor: 'pointer', fontSize: '0.82rem', color: '#555',
              fontWeight: 500,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12.5 7A5.5 5.5 0 1 1 7 1.5a5.5 5.5 0 0 1 4.5 2.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M12.5 1.5v3h-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Làm mới
          </button>
        </div>

        {/* Quick links */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Quản lý đơn hàng', page: 'admin-orders',   icon: '📋' },
            { label: 'Quản lý sản phẩm', page: 'admin-products',  icon: '📦' },
            { label: 'Doanh thu',         page: 'admin-revenue',   icon: '💹' },
          ].map(link => (
            <button key={link.page} onClick={() => onNavigate(link.page)} style={{
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
              padding: '0.5rem 1rem', cursor: 'pointer',
              fontSize: '0.83rem', color: '#444', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8873A'; e.currentTarget.style.color = '#C8873A'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#444'; }}
            >
              <span>{link.icon}</span>
              {link.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: '#888', padding: '2rem' }}>Đang tải...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
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
                  onMouseEnter={e => { if (kpi.action) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { if (kpi.action) e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.07)'; }}
                >
                  <div style={{ color: kpi.color, marginBottom: '0.6rem', opacity: 0.85 }}>{kpi.icon}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: kpi.color, lineHeight: 1.1, marginBottom: '0.3rem' }}>
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#444', fontWeight: 600, marginBottom: '0.15rem' }}>{kpi.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#aaa' }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1.5rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.4rem', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#333' }}>Đơn hàng gần đây</span>
                <button
                  onClick={() => onNavigate('admin-orders')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}
                >
                  Xem tất cả →
                </button>
              </div>
              {recentOrders.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa', fontSize: '0.85rem' }}>
                  Chưa có đơn hàng nào
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                    <thead>
                      <tr style={{ background: '#FAFAFA' }}>
                        {['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Phương thức', 'Trạng thái', 'Thời gian'].map(h => (
                          <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', color: '#888', fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, idx) => {
                        const sl = STATUS_LABEL[order.status] || { text: order.status, color: '#888', bg: '#F3F4F6' };
                        return (
                          <tr
                            key={order.orderCode}
                            style={{ borderTop: idx > 0 ? '1px solid #F3F4F6' : 'none', transition: 'background 0.1s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary-dark)', whiteSpace: 'nowrap' }}>
                              {order.orderCode}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: '#333' }}>
                              <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                              <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{order.customerPhone}</div>
                            </td>
                            <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#333', whiteSpace: 'nowrap' }}>
                              {window.formatPrice(order.totalAmount)}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: '#555' }}>
                              {order.paymentMethod === 'cod' ? '💵 COD' : '🏦 Chuyển khoản'}
                            </td>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <span style={{
                                display: 'inline-block', padding: '2px 10px', borderRadius: 20,
                                fontSize: '0.75rem', fontWeight: 600,
                                color: sl.color, background: sl.bg,
                              }}>
                                {sl.text}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: '#aaa', whiteSpace: 'nowrap' }}>
                              {order.createdAt ? formatDate(order.createdAt) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </>
        )}
      </div>
    </div>
  );
}
