function CartItem({ item, onRemove, onUpdateQty }) {
  return (
    <div className="cart-item">
      <div className="cart-item-thumb">
        <ProductImage product={item.product} />
      </div>
      <div className="cart-item-info">
        <p className="cart-item-name">{item.product.name}</p>
        <p className="cart-item-weight">{item.product.weight}</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:6 }}>
          <div className="qty-control">
            <button className="qty-btn" onClick={() => onUpdateQty(item.product.id, item.qty - 1)}>−</button>
            <span className="qty-val">{item.qty}</span>
            <button className="qty-btn" onClick={() => onUpdateQty(item.product.id, item.qty + 1)}>+</button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span className="cart-item-total">{formatPrice(item.product.price * item.qty)}</span>
            <button className="remove-btn" onClick={() => onRemove(item.product.id)} title="Xóa">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2.5 3.5h10M5 3.5V2h5v1.5M5.5 6.5v5M9.5 6.5v5M3.5 3.5l.8 9h7.4l.8-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
