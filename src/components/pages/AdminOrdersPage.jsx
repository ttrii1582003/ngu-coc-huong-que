function AdminOrdersPage({ token, onLogout }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filterStatus, setFilterStatus] = React.useState('');
  const [expanded, setExpanded] = React.useState(null);
  const [updatingId, setUpdatingId] = React.useState(null);

  const STATUS_OPTIONS = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

  const STATUS_LABEL = {
    pending:   { text: 'Chờ xác nhận', color: '#C8873A', bg: '#FEF3E2' },
    confirmed: { text: 'Đã xác nhận',  color: '#4A7C59', bg: '#EBF5EF' },
    shipping:  { text: 'Đang giao',    color: '#2563EB', bg: '#EFF6FF' },
    delivered: { text: 'Đã giao',      color: '#16803C', bg: '#DCFCE7' },
    cancelled: { text: 'Đã huỷ',       color: '#DC2626', bg: '#FEF2F2' },
  };

  const fetchOrders = (status) => {
    setLoading(true);
    const url = `${window.API_BASE}/admin/orders${status ? `?status=${status}` : ''}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  React.useEffect(() => { fetchOrders(filterStatus); }, [filterStatus]);

  const handleStatusChange = (orderId, newStatus) => {
    setUpdatingId(orderId);
    fetch(`${window.API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(updated => {
        setOrders(prev => prev.map(o => o.orderCode === updated.orderCode ? updated : o));
        setUpdatingId(null);
      })
      .catch(() => setUpdatingId(null));
  };

  const formatDate = iso => new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const statusCount = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      {/* Top bar */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #E5E7EB',
        padding: '0 1.5rem', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
            <path d="M15 26V10" stroke="#C8873A" strokeWidth="1.8" strokeLinecap="round"/>
            <ellipse cx="15" cy="8.5" rx="3.5" ry="6" fill="#C8873A" opacity="0.85" transform="rotate(-12 15 8.5)"/>
            <ellipse cx="15" cy="8.5" rx="3.5" ry="6" fill="#C8873A" opacity="0.65" transform="rotate(12 15 8.5)"/>
          </svg>
          <span style={{ fontFamily: 'Lora, serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-dark)' }}>
            Ngũ Cốc — Admin
          </span>
          <span style={{
            background: '#FEF3E2', color: '#C8873A', fontSize: '0.7rem',
            fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 4
          }}>ADMIN</span>
        </div>
        <button onClick={onLogout} style={{
          background: 'none', border: '1px solid #E5E7EB', borderRadius: 6,
          padding: '0.35rem 0.9rem', cursor: 'pointer', fontSize: '0.85rem', color: '#666'
        }}>Đăng xuất</button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1rem' }}>
        <h1 style={{ margin: '0 0 1.25rem', fontSize: '1.4rem', color: 'var(--primary-dark)', fontFamily: 'Lora, serif' }}>
          Quản lý đơn hàng
        </h1>

        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[{ key: '', label: 'Tất cả', count: orders.length }, ...STATUS_OPTIONS.map(s => ({
            key: s, label: STATUS_LABEL[s].text, count: statusCount[s] || 0
          }))].map(tab => (
            <button key={tab.key} onClick={() => setFilterStatus(tab.key)} style={{
              background: filterStatus === tab.key ? 'var(--primary)' : '#fff',
              color: filterStatus === tab.key ? '#fff' : '#555',
              border: `1px solid ${filterStatus === tab.key ? 'var(--primary)' : '#E5E7EB'}`,
              borderRadius: 8, padding: '0.4rem 0.85rem', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem'
            }}>
              {tab.label}
              <span style={{
                background: filterStatus === tab.key ? 'rgba(255,255,255,0.25)' : '#F3F4F6',
                color: filterStatus === tab.key ? '#fff' : '#888',
                borderRadius: 10, padding: '0 0.4rem', fontSize: '0.75rem', fontWeight: 700
              }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Đang tải...</div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 12, color: '#888' }}>
            Không có đơn hàng nào.
          </div>
        )}

        {/* Orders table */}
        {!loading && orders.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr 120px 110px 140px 120px 36px',
              padding: '0.75rem 1.25rem',
              background: '#F9FAFB', borderBottom: '1px solid #F0F0F0',
              fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              <span>Mã đơn</span>
              <span>Khách hàng</span>
              <span>Tổng tiền</span>
              <span>Ngày đặt</span>
              <span>Trạng thái</span>
              <span>Đổi trạng thái</span>
              <span></span>
            </div>

            {orders.map((order, idx) => {
              const s = STATUS_LABEL[order.status] || { text: order.status, color: '#888', bg: '#F5F5F5' };
              const isOpen = expanded === order.orderCode;
              const ordId = order.orderCode; // use orderCode as key, need id for PATCH

              return (
                <div key={order.orderCode} style={{ borderBottom: idx < orders.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                  {/* Main row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '150px 1fr 120px 110px 140px 120px 36px',
                    padding: '0.9rem 1.25rem', alignItems: 'center',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.82rem' }}>
                      #{order.orderCode}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#222' }}>{order.customerName}</div>
                      <div style={{ color: '#888', fontSize: '0.78rem' }}>{order.customerPhone} · {order.city}</div>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {window.formatPrice(order.totalAmount)}
                    </span>
                    <span style={{ color: '#999', fontSize: '0.78rem' }}>
                      {formatDate(order.createdAt)}
                    </span>
                    <span style={{
                      display: 'inline-block',
                      background: s.bg, color: s.color,
                      padding: '0.25rem 0.65rem', borderRadius: 20,
                      fontSize: '0.75rem', fontWeight: 600
                    }}>{s.text}</span>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      style={{
                        border: '1px solid #E5E7EB', borderRadius: 6, padding: '0.3rem 0.5rem',
                        fontSize: '0.78rem', cursor: 'pointer', background: '#fff',
                        opacity: updatingId === order.id ? 0.5 : 1
                      }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{STATUS_LABEL[s].text}</option>
                      ))}
                    </select>
                    <button onClick={() => setExpanded(isOpen ? null : order.orderCode)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#aaa', fontSize: '1rem', padding: '0.2rem'
                    }}>{isOpen ? '▲' : '▼'}</button>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid #F5F5F5', padding: '0.85rem 1.25rem', background: '#FAFAFA' }}>
                      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                        <div style={{ flex: 1, minWidth: 220 }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#555' }}>Sản phẩm</div>
                          {order.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', color: '#444' }}>
                              <span>{item.productName} × {item.quantity}</span>
                              <span style={{ fontWeight: 600 }}>{window.formatPrice(item.priceAtPurchase * item.quantity)}</span>
                            </div>
                          ))}
                          <div style={{ borderTop: '1px solid #EEE', marginTop: '0.4rem', paddingTop: '0.4rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span>Tổng</span>
                            <span style={{ color: 'var(--primary)' }}>{window.formatPrice(order.totalAmount)}</span>
                          </div>
                        </div>
                        <div style={{ minWidth: 200, fontSize: '0.82rem', color: '#666' }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#555' }}>Thông tin giao hàng</div>
                          <div>📍 {order.address}{order.district ? `, ${order.district}` : ''}, {order.city}</div>
                          <div style={{ marginTop: '0.3rem' }}>📞 {order.customerPhone}</div>
                          {order.customerEmail && <div style={{ marginTop: '0.3rem' }}>✉️ {order.customerEmail}</div>}
                          <div style={{ marginTop: '0.3rem' }}>🚚 {order.deliveryMethod === 'express' ? 'Giao nhanh' : 'Tiêu chuẩn'}</div>
                          <div style={{ marginTop: '0.3rem' }}>💳 {order.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
