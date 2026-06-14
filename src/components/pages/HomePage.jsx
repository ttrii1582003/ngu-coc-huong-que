function HomePage({ filteredProducts, loadingProducts, activeCategory, setActiveCategory, searchQuery, setSearchQuery, navigateTo, addToCart }) {
  const [localSearch, setLocalSearch] = React.useState(searchQuery);

  React.useEffect(() => {
    const t = setTimeout(() => setSearchQuery(localSearch), 280);
    return () => clearTimeout(t);
  }, [localSearch]);

  const handleHeroBtn = () => {
    const el = document.getElementById('products-section');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  };

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <p className="hero-eyebrow">Thiên nhiên thuần khiết</p>
            <h1 className="hero-heading">Ngũ Cốc <em>Sạch</em><br/>& Dinh Dưỡng</h1>
            <p className="hero-sub">Sản phẩm ngũ cốc và hạt dinh dưỡng thuần tự nhiên, không chất bảo quản — tốt cho sức khỏe cả gia đình.</p>
            <button className="btn btn-primary btn-lg" onClick={handleHeroBtn}>Khám phá ngay</button>
          </div>
          <div className="hero-deco" aria-hidden="true">
            <svg viewBox="0 0 320 320" width="320" height="320">
              <circle cx="160" cy="160" r="130" fill="#C8873A" opacity="0.07"/>
              <circle cx="160" cy="160" r="100" fill="none" stroke="#C8873A" strokeWidth="1.5" opacity="0.18"/>
              <circle cx="160" cy="160" r="70" fill="none" stroke="#C8873A" strokeWidth="1" opacity="0.12"/>
              {[[120,100,14,8,30],[165,88,12,7,-15],[205,115,13,8,50],[95,155,11,6,-25],[210,165,12,7,40],[130,210,13,7,20],[185,205,11,6,-30],[155,140,10,6,60],[110,175,9,5,80]].map(([cx,cy,rx,ry,rot],i) => (
                <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} fill="#C8873A" opacity={0.3+i*0.03}/>
              ))}
              <path d="M80,185 Q160,245 240,185" stroke="#C8873A" strokeWidth="2.5" fill="none" opacity="0.25"/>
              <line x1="80" y1="185" x2="80" y2="210" stroke="#C8873A" strokeWidth="2" opacity="0.2"/>
              <line x1="240" y1="185" x2="240" y2="210" stroke="#C8873A" strokeWidth="2" opacity="0.2"/>
              <line x1="80" y1="210" x2="240" y2="210" stroke="#C8873A" strokeWidth="2" opacity="0.15"/>
            </svg>
          </div>
        </div>
      </section>

      <section id="products-section" style={{ padding:'40px 0 80px' }}>
        <div className="container">
          <div className="search-wrap">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" className="search-icon">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
            />
            {localSearch && (
              <button className="search-clear" onClick={() => { setLocalSearch(''); setSearchQuery(''); }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          <div style={{ marginBottom:28 }}>
            <CategoryFilter categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />
          </div>

          {searchQuery && (
            <p style={{ fontSize:14, color:'var(--text-muted)', marginBottom:18 }}>
              Tìm thấy <strong style={{ color:'var(--text)' }}>{filteredProducts.length}</strong> kết quả cho &ldquo;<em>{searchQuery}</em>&rdquo;
            </p>
          )}

          {loadingProducts ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-muted)' }}>
              <p style={{ fontSize:15 }}>Đang tải sản phẩm…</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((p, i) => (
                <div key={p.id} style={{ animation:`fadeUp 0.4s ease ${i*0.05}s both` }}>
                  <ProductCard product={p} onView={prod => navigateTo('product', prod)} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ opacity:0.22, display:'block', margin:'0 auto 16px' }}>
                <circle cx="24" cy="24" r="17" stroke="var(--text)" strokeWidth="3"/>
                <path d="M35.5 35.5L48 48" stroke="var(--text)" strokeWidth="3" strokeLinecap="round"/>
                <path d="M17 24h14M24 17v14" stroke="var(--text)" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <p style={{ fontSize:16, fontWeight:600, marginBottom:4 }}>Không tìm thấy sản phẩm</p>
              <p style={{ fontSize:14, color:'var(--text-muted)' }}>Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
