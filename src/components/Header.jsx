function Header({ cartCount, onCartOpen, onLogoClick }) {
  return (
    <header className="site-header">
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>
        <button onClick={onLogoClick} className="logo-btn">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 26V10" stroke="#C8873A" strokeWidth="1.8" strokeLinecap="round"/>
            <ellipse cx="15" cy="8.5" rx="3.5" ry="6" fill="#C8873A" opacity="0.85" transform="rotate(-12 15 8.5)"/>
            <ellipse cx="15" cy="8.5" rx="3.5" ry="6" fill="#C8873A" opacity="0.65" transform="rotate(12 15 8.5)"/>
            <ellipse cx="11.5" cy="15" rx="3" ry="4.5" fill="#C8873A" opacity="0.55" transform="rotate(-30 11.5 15)"/>
            <ellipse cx="18.5" cy="15" rx="3" ry="4.5" fill="#C8873A" opacity="0.55" transform="rotate(30 18.5 15)"/>
          </svg>
          <div>
            <div className="logo-main">Ngũ Cốc</div>
            <div className="logo-sub">Hương Quê</div>
          </div>
        </button>

        <button className="cart-btn" onClick={onCartOpen}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M2 2h2.5l2.2 11h9.8l2-8H6.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="18.5" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="18.5" r="1.5" fill="currentColor"/>
          </svg>
          {cartCount > 0 && <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>}
          <span className="cart-label">Giỏ hàng</span>
        </button>
      </div>
    </header>
  );
}
