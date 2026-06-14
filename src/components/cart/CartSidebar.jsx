function CartSidebar({ cart, total, onClose, onRemove, onUpdateQty, onCheckout }) {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const shipping = total >= 300000 ? 0 : 30000;
  const pct = Math.min(100, (total / 300000) * 100);

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <div>
          <h2 className="cart-title">Giỏ hàng</h2>
          <p className="cart-subtitle">{count} sản phẩm</p>
        </div>
        <button className="icon-btn" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ opacity:0.25, display:'block', margin:'0 auto 14px' }}>
              <path d="M4 4h7l5 24h22l5-18H13" stroke="var(--text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="20" cy="44" r="3" fill="var(--text)"/>
              <circle cx="35" cy="44" r="3" fill="var(--text)"/>
            </svg>
            <p style={{ fontWeight:500, fontSize:15 }}>Giỏ hàng trống</p>
            <p style={{ fontSize:13, marginTop:4 }}>Thêm sản phẩm để bắt đầu</p>
          </div>
        ) : cart.map(item => (
          <CartItem key={item.product.id} item={item} onRemove={onRemove} onUpdateQty={onUpdateQty} />
        ))}
      </div>

      {cart.length > 0 && (
        <div className="cart-footer">
          {total < 300000 && (
            <div className="ship-progress-wrap">
              <div className="ship-bar">
                <div className="ship-fill" style={{ width:`${pct}%` }}/>
              </div>
              <p className="ship-hint">Thêm <strong>{formatPrice(300000 - total)}</strong> để miễn phí vận chuyển</p>
            </div>
          )}
          {total >= 300000 && (
            <div className="ship-free-badge">Bạn được miễn phí vận chuyển!</div>
          )}
          <div className="cart-row"><span>Tạm tính</span><span>{formatPrice(total)}</span></div>
          <div className="cart-row">
            <span>Vận chuyển</span>
            <span style={{ color: shipping === 0 ? 'var(--green)' : 'var(--text)' }}>
              {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
            </span>
          </div>
          <div className="cart-total-row">
            <span>Tổng cộng</span>
            <span className="cart-grand">{formatPrice(total + shipping)}</span>
          </div>
          <button className="btn btn-primary btn-full btn-lg" onClick={onCheckout}>
            Tiến hành thanh toán
          </button>
        </div>
      )}
    </div>
  );
}
