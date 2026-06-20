function App() {
  const [page, setPage] = React.useState('home');
  const [selProduct, setSelProduct] = React.useState(null);
  const [cart, setCart] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('hq_cart') || '[]'); } catch (_) { return []; }
  });
  const [cartOpen, setCartOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [toast, setToast] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [loadingProducts, setLoadingProducts] = React.useState(true);
  const [orderCode, setOrderCode] = React.useState(null);
  const [orderPaymentMethod, setOrderPaymentMethod] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [token, setToken] = React.useState(() => localStorage.getItem('hq_token'));

  // Persist cart to localStorage
  React.useEffect(() => {
    try { localStorage.setItem('hq_cart', JSON.stringify(cart)); } catch (_) {}
  }, [cart]);

  // Load products
  React.useEffect(() => {
    fetch(API_BASE + '/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoadingProducts(false); })
      .catch(() => setLoadingProducts(false));
  }, []);

  // Verify token & load user on mount
  React.useEffect(() => {
    if (!token) return;
    fetch(API_BASE + '/auth/me', {
      headers: { 'Authorization': 'Bearer ' + token },
    })
      .then(r => {
        if (r.status === 401) {
          localStorage.removeItem('hq_token');
          setToken(null);
          return null;
        }
        if (!r.ok) return null; // lỗi mạng / server tạm thời — giữ token
        return r.json();
      })
      .then(data => {
        if (data) {
          setCurrentUser(data);
          if (data.role === 'admin') setPage('admin-dashboard');
        }
      })
      .catch(() => {}); // network error — không xóa token
  }, []);

  const onLogin = (newToken, user) => {
    localStorage.setItem('hq_token', newToken);
    setToken(newToken);
    setCurrentUser(user);
    navigateTo(user.role === 'admin' ? 'admin-dashboard' : 'home');
  };

  const onLogout = () => {
    localStorage.removeItem('hq_token');
    setToken(null);
    setCurrentUser(null);
    if (window.google) window.google.accounts.id.disableAutoSelect();
    navigateTo('home');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { product, qty }];
    });
    showToast('Đã thêm "' + product.name + '" vào giỏ');
    setCartOpen(true);
  };

  const removeFromCart = id => setCart(prev => prev.filter(i => i.product.id !== id));

  const updateCartQty = (id, qty) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i));
  };

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const filteredProducts = products.filter(p => {
    const mc = activeCategory === 'all' || p.category === activeCategory;
    const ms = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return mc && ms;
  });

  const navigateTo = (p, product = null) => {
    setPage(p);
    if (product) setSelProduct(product);
    window.scrollTo(0, 0);
  };

  const showHeader = !['success', 'login', 'register', 'my-orders', 'profile', 'admin-dashboard', 'admin-orders', 'admin-products', 'admin-revenue'].includes(page);

  return (
    <div style={{ minHeight:'100vh' }}>
      {showHeader && (
        <Header
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
          onLogoClick={() => navigateTo('home')}
          currentUser={currentUser}
          onLoginClick={() => navigateTo('login')}
          onLogout={onLogout}
          onMyOrders={() => navigateTo('my-orders')}
          onProfile={() => navigateTo('profile')}
        />
      )}

      {page === 'home' && (
        <HomePage
          filteredProducts={filteredProducts}
          loadingProducts={loadingProducts}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          navigateTo={navigateTo}
          addToCart={addToCart}
        />
      )}
      {page === 'product' && (
        <ProductDetailPage selectedProduct={selProduct} addToCart={addToCart} navigateTo={navigateTo} />
      )}
      {page === 'checkout' && (
        <CheckoutPage
          cart={cart}
          token={token}
          currentUser={currentUser}
          onSuccess={(code, payMethod) => { setOrderCode(code); setOrderPaymentMethod(payMethod); navigateTo('success'); }}
          navigateTo={navigateTo}
        />
      )}
      {page === 'success' && (
        <OrderSuccessPage orderCode={orderCode} paymentMethod={orderPaymentMethod} onContinue={() => { setCart([]); setOrderCode(null); setOrderPaymentMethod(null); navigateTo('home'); }} />
      )}
      {page === 'login' && (
        <LoginPage onLogin={onLogin} navigateTo={navigateTo} />
      )}
      {page === 'register' && (
        <RegisterPage onLogin={onLogin} navigateTo={navigateTo} />
      )}
      {page === 'my-orders' && (
        <MyOrdersPage token={token} onBack={() => navigateTo('home')} />
      )}
      {page === 'admin-dashboard' && (
        <AdminDashboardPage token={token} onLogout={onLogout} onNavigate={navigateTo} />
      )}
      {page === 'admin-orders' && (
        <AdminOrdersPage token={token} onLogout={onLogout} onNavigate={navigateTo} onShowToast={showToast} />
      )}
      {page === 'admin-products' && (
        <AdminProductsPage token={token} onLogout={onLogout} onNavigate={navigateTo} />
      )}
      {page === 'admin-revenue' && (
        <AdminRevenuePage token={token} onLogout={onLogout} onNavigate={navigateTo} />
      )}
      {page === 'profile' && (
        <ProfilePage
          token={token}
          currentUser={currentUser}
          onUpdate={user => setCurrentUser(user)}
          onBack={() => navigateTo('home')}
        />
      )}

      {cartOpen && (
        <>
          <div className="backdrop" onClick={() => setCartOpen(false)} />
          <CartSidebar
            cart={cart}
            total={cartTotal}
            onClose={() => setCartOpen(false)}
            onRemove={removeFromCart}
            onUpdateQty={updateCartQty}
            onCheckout={() => { setCartOpen(false); navigateTo('checkout'); }}
          />
        </>
      )}

      {toast && (
        <div className="toast">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="#4A7C59"/>
            <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
