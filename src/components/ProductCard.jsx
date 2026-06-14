function ProductCard({ product, onView, onAddToCart }) {
  const [hovered, setHovered] = React.useState(false);
  const discount = calcDiscount(product.price, product.originalPrice);
  const catLabel = CATEGORIES.find(c => c.id === product.category)?.label;

  return (
    <div
      className="product-card"
      style={{
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="card-img-wrap" onClick={() => onView(product)}>
        <div style={{ width:'100%', height:'100%' }}>
          <ProductImage product={product} />
        </div>
        <div className="card-badges">
          {product.badge && <Badge text={product.badge} type={product.badgeType} />}
          {discount > 0 && <span className="discount-pill">-{discount}%</span>}
        </div>
      </div>

      <div className="card-body" onClick={() => onView(product)}>
        <p className="card-meta">{catLabel}&nbsp;·&nbsp;{product.weight}</p>
        <h3 className="card-name">{product.name}</h3>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
          <StarRating rating={product.rating} />
          <span className="card-reviews">({product.reviews})</span>
        </div>
        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <span className="card-price">{formatPrice(product.price)}</span>
          {product.originalPrice && <span className="card-orig-price">{formatPrice(product.originalPrice)}</span>}
        </div>
      </div>

      <div className="card-footer">
        <button className="btn btn-primary btn-full" onClick={e => { e.stopPropagation(); onAddToCart(product, 1); }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M1.5 1.5h2l1.5 7h7l1.5-6H4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="7" cy="13" r="1" fill="white"/>
            <circle cx="11" cy="13" r="1" fill="white"/>
          </svg>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
