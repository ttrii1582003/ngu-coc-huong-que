function Header({ cartCount, onCartOpen, onLogoClick, currentUser, onLoginClick, onLogout, onMyOrders, onProfile }) {
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

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {currentUser ? (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="" style={{ width:30, height:30, borderRadius:'50%', objectFit:'cover' }} />
              ) : (
                <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13 }}>
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <span style={{ fontSize:14, fontWeight:500, color:'var(--text)', maxWidth:100, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {currentUser.fullName.split(' ').slice(-1)[0]}
              </span>
              <button onClick={onProfile} className="btn btn-ghost" style={{ fontSize:13, padding:'4px 10px', height:'auto' }}>
                Hồ sơ
              </button>
              <button onClick={onMyOrders} className="btn btn-ghost" style={{ fontSize:13, padding:'4px 10px', height:'auto' }}>
                Đơn hàng
              </button>
              <button onClick={onLogout} className="btn btn-ghost" style={{ fontSize:13, padding:'4px 10px', height:'auto' }}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="btn btn-ghost" style={{ fontSize:13, padding:'6px 14px', height:'auto', borderColor:'var(--primary)', color:'var(--primary)' }}>
              Đăng nhập
            </button>
          )}

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
      </div>
    </header>
  );
}
