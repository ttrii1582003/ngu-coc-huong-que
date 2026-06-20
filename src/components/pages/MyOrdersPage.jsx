function MyOrdersPage({ token, onBack }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [expanded, setExpanded] = React.useState(null);
  const [cancelling, setCancelling] = React.useState(null);
  const [confirmCancel, setConfirmCancel] = React.useState(null); // orderCode đang chờ xác nhận
  const [cancelError, setCancelError] = React.useState(null);

  React.useEffect(() => {
    fetch(`${window.API_BASE}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => { setError('Không thể tải danh sách đơn hàng.'); setLoading(false); });
  }, [token]);

  const statusLabel = {
    pending:   { text: 'Chờ xác nhận', color: '#C8873A' },
    confirmed: { text: 'Đã xác nhận',  color: '#4A7C59' },
    shipping:  { text: 'Đang giao',     color: '#2563EB' },
    delivered: { text: 'Đã giao',       color: '#16803C' },
    cancelled: { text: 'Đã huỷ',        color: '#DC2626' },
  };

  const formatDate = iso => new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const toggleExpand = code => setExpanded(prev => prev === code ? null : code);

  const handleCancel = (orderCode) => {
    setConfirmCancel(orderCode);
    setCancelError(null);
  };

  const doCancel = () => {
    const orderCode = confirmCancel;
    setCancelling(orderCode);
    fetch(`${window.API_BASE}/orders/${orderCode}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(updated => {
        setOrders(prev => prev.map(o => o.orderCode === updated.orderCode ? updated : o));
        setCancelling(null);
        setConfirmCancel(null);
      })
      .catch(() => {
        setCancelError('Không thể hủy đơn hàng. Vui lòng thử lại.');
        setCancelling(null);
      });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={onBack} style={{
            background: 'none', border: '1.5px solid #ddd', borderRadius: 8,
            padding: '0.4rem 0.9rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text)'
          }}>← Quay lại</button>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-dark)', fontFamily: 'Lora, serif' }}>
            Đơn hàng của tôi
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Đang tải...</div>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#DC2626' }}>{error}</div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: 16 }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</div>
            <p style={{ color: '#888', marginBottom: '1.5rem' }}>Bạn chưa có đơn hàng nào.</p>
            <button onClick={onBack} style={{
              background: 'var(--primary)', color: '#fff', border: 'none',
              borderRadius: 8, padding: '0.7rem 1.5rem', cursor: 'pointer', fontWeight: 600
            }}>Mua sắm ngay</button>
          </div>
        )}

        {/* Order list */}
        {!loading && !error && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => {
              const s = statusLabel[order.status] || { text: order.status, color: '#888' };
              const isOpen = expanded === order.orderCode;
              return (
                <div key={order.orderCode} style={{
                  background: '#fff', borderRadius: 12,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden'
                }}>
                  {/* Summary row */}
                  <div style={{
                    padding: '1.1rem 1.4rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    gap: '1rem', flexWrap: 'wrap', cursor: 'pointer'
                  }} onClick={() => toggleExpand(order.orderCode)}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>
                          #{order.orderCode}
                        </span>
                        <span style={{
                          fontSize: '0.73rem', fontWeight: 600, padding: '0.18rem 0.55rem',
                          borderRadius: 20, background: s.color + '18', color: s.color
                        }}>{s.text}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#999' }}>{formatDate(order.createdAt)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>
                          {window.formatPrice(order.totalAmount)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#bbb' }}>{order.items.length} sản phẩm</div>
                      </div>
                      <span style={{ color: '#aaa', fontSize: '1.1rem' }}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f0ede8', padding: '1rem 1.4rem' }}>
                      {/* Items */}
                      <div style={{ marginBottom: '1rem' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{
                            display: 'flex', justifyContent: 'space-between',
                            padding: '0.4rem 0', borderBottom: idx < order.items.length - 1 ? '1px solid #f5f3ef' : 'none',
                            fontSize: '0.88rem'
                          }}>
                            <span style={{ color: 'var(--text)' }}>
                              {item.productName} × {item.quantity}
                            </span>
                            <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>
                              {window.formatPrice(item.priceAtPurchase * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Cost summary */}
                      <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Tạm tính</span>
                          <span>{window.formatPrice(order.subtotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Vận chuyển ({order.deliveryMethod === 'express' ? 'Nhanh' : 'Tiêu chuẩn'})</span>
                          <span style={{ color: order.shippingCost === 0 ? 'var(--green)' : 'inherit' }}>
                            {order.shippingCost === 0 ? 'Miễn phí' : window.formatPrice(order.shippingCost)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--primary)', paddingTop: '0.4rem', borderTop: '1px solid #f0ede8', marginTop: '0.25rem' }}>
                          <span>Tổng cộng</span>
                          <span style={{ fontSize: '1rem' }}>{window.formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>

                      {/* Delivery info */}
                      <div style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#888', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <span>🏠 {order.customerName} · {order.customerPhone}</span>
                        <span>📍 {order.city}</span>
                        <span>💳 {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</span>
                      </div>

                      {/* Cancel button — chỉ hiện khi pending */}
                      {order.status === 'pending' && (
                        <div style={{ marginTop: '1rem', borderTop: '1px solid #f0ede8', paddingTop: '0.85rem' }}>
                          <button
                            disabled={cancelling === order.orderCode}
                            onClick={() => handleCancel(order.orderCode)}
                            style={{
                              background: 'none', border: '1px solid #DC2626', color: '#DC2626',
                              borderRadius: 8, padding: '0.4rem 1rem', cursor: 'pointer',
                              fontSize: '0.82rem', fontWeight: 600,
                              opacity: cancelling === order.orderCode ? 0.5 : 1,
                            }}
                          >
                            {cancelling === order.orderCode ? 'Đang hủy...' : '✕ Hủy đơn hàng'}
                          </button>
                          <span style={{ fontSize: '0.75rem', color: '#aaa', marginLeft: '0.75rem' }}>
                            Chỉ hủy được khi đơn đang chờ xác nhận
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal xác nhận hủy đơn */}
      {confirmCancel && (
        <div
          onClick={() => { if (!cancelling) setConfirmCancel(null); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '1rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 14, padding: '1.75rem 1.5rem',
              width: '100%', maxWidth: 400,
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 6v4M10 14h.01" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round"/>
                  <circle cx="10" cy="10" r="8.5" stroke="#DC2626" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111' }}>Xác nhận hủy đơn hàng</div>
                <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.1rem' }}>#{confirmCancel}</div>
              </div>
            </div>

            <p style={{ margin: '0 0 1.1rem', fontSize: '0.85rem', color: '#555', lineHeight: 1.55 }}>
              Đơn hàng sẽ bị hủy và không thể khôi phục. Tồn kho sản phẩm sẽ được hoàn lại tự động.
            </p>

            {cancelError && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
                padding: '0.6rem 0.85rem', fontSize: '0.8rem', color: '#DC2626', marginBottom: '1rem',
              }}>
                {cancelError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmCancel(null)}
                disabled={!!cancelling}
                style={{
                  background: '#F3F4F6', border: 'none', borderRadius: 8,
                  padding: '0.55rem 1.1rem', cursor: 'pointer',
                  fontSize: '0.85rem', color: '#555', fontWeight: 500,
                  opacity: cancelling ? 0.5 : 1,
                }}
              >
                Không, giữ đơn
              </button>
              <button
                onClick={doCancel}
                disabled={!!cancelling}
                style={{
                  background: cancelling ? '#fca5a5' : '#DC2626',
                  border: 'none', borderRadius: 8,
                  padding: '0.55rem 1.25rem', cursor: cancelling ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem', color: '#fff', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}
              >
                {cancelling ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                      <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Đang hủy...
                  </>
                ) : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
