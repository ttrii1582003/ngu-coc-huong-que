function AdminOrdersPage({ token, onLogout, onNavigate, onShowToast }) {
  const [allOrders, setAllOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filterStatus, setFilterStatus] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
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

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${window.API_BASE}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setAllOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  React.useEffect(() => { fetchOrders(); }, []);

  const orders = allOrders.filter(o => {
    if (filterStatus && o.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return o.orderCode.toLowerCase().includes(q)
          || o.customerName.toLowerCase().includes(q)
          || (o.customerPhone && o.customerPhone.includes(q));
    }
    return true;
  });

  const handleStatusChange = (orderId, newStatus) => {
    setUpdatingId(orderId);
    fetch(`${window.API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(updated => {
        setAllOrders(prev => prev.map(o => o.orderCode === updated.orderCode ? updated : o));
        setUpdatingId(null);
        if (onShowToast) onShowToast('Đã cập nhật trạng thái đơn hàng');
      })
      .catch(() => {
        setUpdatingId(null);
        if (onShowToast) onShowToast('Lỗi: không thể cập nhật trạng thái');
      });
  };

  const formatDate = iso => new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const statusCount = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = allOrders.filter(o => o.status === s).length;
    return acc;
  }, {});

  const GRID = '150px 1fr 120px 110px 140px 120px 90px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      <AdminSidebar activePage="admin-orders" onNavigate={onNavigate} onLogout={onLogout} />
      <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
        <h1 style={{ margin: '0 0 1.25rem', fontSize: '1.4rem', color: 'var(--primary-dark)', fontFamily: 'Lora, serif' }}>
          Quản lý đơn hàng
        </h1>

        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[{ key: '', label: 'Tất cả', count: allOrders.length }, ...STATUS_OPTIONS.map(s => ({
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

        {/* Search */}
        <div style={{ marginBottom: '1rem', position: 'relative', maxWidth: 380 }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: '0.9rem' }}>🔍</span>
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên hoặc SĐT..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '0.5rem 0.75rem 0.5rem 2.1rem',
              border: '1px solid #E5E7EB', borderRadius: 8,
              fontSize: '0.85rem', outline: 'none', background: '#fff',
            }}
          />
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
              gridTemplateColumns: GRID,
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

              return (
                <div key={order.orderCode} style={{ borderBottom: idx < orders.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                  {/* Main row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: GRID,
                    padding: '0.9rem 1.25rem', alignItems: 'center',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.82rem' }}>
                      #{order.orderCode}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#222' }}>{order.customerName}</div>
                      <div style={{ color: '#888', fontSize: '0.78rem' }}>{order.customerPhone} · {order.city}</div>
                      <div style={{ color: '#A88878', fontSize: '0.73rem', marginTop: '0.1rem' }}>
                        {order.items ? order.items.length : 0} sản phẩm
                      </div>
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
                      background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 6,
                      padding: '0.25rem 0.55rem', cursor: 'pointer', color: '#555',
                      fontSize: '0.75rem', whiteSpace: 'nowrap'
                    }}>
                      {isOpen ? '▲ Thu gọn' : '▼ Chi tiết'}
                    </button>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid #F5F5F5', padding: '0.85rem 1.25rem', background: '#FAFAFA' }}>
                      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>

                        {/* Left: product table + financial breakdown */}
                        <div style={{ flex: 1, minWidth: 260 }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#555' }}>Sản phẩm</div>

                          {/* Product table header */}
                          <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 90px 40px 90px',
                            padding: '0.25rem 0', borderBottom: '1px solid #EEE',
                            fontSize: '0.73rem', fontWeight: 600, color: '#999',
                          }}>
                            <span>Tên sản phẩm</span>
                            <span style={{ textAlign: 'right' }}>Đơn giá</span>
                            <span style={{ textAlign: 'center' }}>SL</span>
                            <span style={{ textAlign: 'right' }}>Thành tiền</span>
                          </div>

                          {/* Product rows */}
                          {order.items.map((item, i) => (
                            <div key={i} style={{
                              display: 'grid', gridTemplateColumns: '1fr 90px 40px 90px',
                              padding: '0.3rem 0', color: '#444',
                              borderBottom: '1px solid #F5F5F5',
                            }}>
                              <span>{item.productName}</span>
                              <span style={{ textAlign: 'right', color: '#666' }}>{window.formatPrice(item.priceAtPurchase)}</span>
                              <span style={{ textAlign: 'center', color: '#888' }}>×{item.quantity}</span>
                              <span style={{ textAlign: 'right', fontWeight: 600 }}>{window.formatPrice(item.priceAtPurchase * item.quantity)}</span>
                            </div>
                          ))}

                          {/* Financial breakdown */}
                          <div style={{ marginTop: '0.5rem', paddingTop: '0.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', color: '#666' }}>
                              <span>Tạm tính</span>
                              <span>{window.formatPrice(order.subtotal)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', color: order.shippingCost === 0 ? '#4A7C59' : '#666' }}>
                              <span>Phí vận chuyển</span>
                              <span>{order.shippingCost === 0 ? 'Miễn phí' : window.formatPrice(order.shippingCost)}</span>
                            </div>
                            <div style={{
                              display: 'flex', justifyContent: 'space-between',
                              borderTop: '1px solid #E5E7EB', marginTop: '0.25rem', paddingTop: '0.35rem',
                              fontWeight: 700, color: 'var(--primary)',
                            }}>
                              <span>Tổng cộng</span>
                              <span>{window.formatPrice(order.totalAmount)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: delivery info */}
                        <div style={{ minWidth: 200, fontSize: '0.82rem', color: '#666' }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#555' }}>Thông tin giao hàng</div>
                          <div>📍 {order.address}{order.district ? `, ${order.district}` : ''}, {order.city}</div>
                          <div style={{ marginTop: '0.3rem' }}>📞 {order.customerPhone}</div>
                          {order.customerEmail && <div style={{ marginTop: '0.3rem' }}>✉️ {order.customerEmail}</div>}
                          <div style={{ marginTop: '0.3rem' }}>🚚 {order.deliveryMethod === 'express' ? 'Giao nhanh' : 'Tiêu chuẩn'}</div>
                          <div style={{ marginTop: '0.5rem' }}>
                            <span style={{
                              display: 'inline-block',
                              background: order.paymentMethod === 'cod' ? '#FEF3E2' : '#EBF5EF',
                              color: order.paymentMethod === 'cod' ? '#C8873A' : '#4A7C59',
                              padding: '0.2rem 0.55rem', borderRadius: 20,
                              fontSize: '0.75rem', fontWeight: 600,
                            }}>
                              {order.paymentMethod === 'cod' ? '💵 COD' : '🏦 Chuyển khoản'}
                            </span>
                          </div>
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
