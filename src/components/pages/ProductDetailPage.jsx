function ProductDetailPage({ selectedProduct: product, addToCart, navigateTo }) {
  const [qty, setQty] = React.useState(1);
  const [justAdded, setJustAdded] = React.useState(false);

  if (!product) return null;

  const discount = calcDiscount(product.price, product.originalPrice);
  const catLabel = CATEGORIES.find(c => c.id === product.category)?.label;

  const handleAdd = () => {
    addToCart(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="page-enter" style={{ padding:'32px 0 80px' }}>
      <div className="container">
        <button className="btn btn-ghost back-btn" onClick={() => navigateTo('home')}>
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M11 3.5L5.5 9l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Quay lại
        </button>

        <div className="detail-grid">
          <div className="detail-img-wrap">
            <ProductImage product={product} />
          </div>

          <div className="detail-info">
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
              {product.badge && <Badge text={product.badge} type={product.badgeType} />}
              {discount > 0 && <span className="discount-pill">-{discount}% OFF</span>}
            </div>

            <p className="detail-meta">{catLabel}&nbsp;·&nbsp;{product.weight}</p>
            <h1 className="detail-name">{product.name}</h1>

            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
              <StarRating rating={product.rating} size={14} />
              <span style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>{product.rating}</span>
              <span style={{ fontSize:13, color:'var(--text-muted)' }}>({product.reviews} đánh giá)</span>
            </div>

            <div className="price-block">
              <span className="detail-price">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="detail-orig">{formatPrice(product.originalPrice)}</span>}
            </div>

            <p className="detail-desc">{product.description}</p>

            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:28 }}>
              {product.benefits.map((b, i) => (
                <span key={i} className="benefit-tag">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <circle cx="6" cy="6" r="5" fill="var(--primary)" opacity="0.15"/>
                    <path d="M3.5 6l1.5 1.5 3.5-3.5" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {b}
                </span>
              ))}
            </div>

            <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
              <div className="qty-control qty-lg">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-val">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              <button
                className={`btn btn-primary btn-lg${justAdded ? ' btn-success' : ''}`}
                style={{ flex:1, minWidth:180 }}
                onClick={handleAdd}
              >
                {justAdded ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Đã thêm!
                  </>
                ) : 'Thêm vào giỏ hàng'}
              </button>
            </div>

            <div className="shipping-note">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 9.5V7L5 3h7l2 4v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 9.5h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="5" cy="12.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <circle cx="12" cy="12.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
              Miễn phí giao hàng cho đơn từ 300.000đ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
