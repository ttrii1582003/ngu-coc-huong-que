function AdminProductsPage({ token, onLogout, onNavigate }) {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filterCat, setFilterCat] = React.useState('');
  const [modal, setModal] = React.useState(null); // null | { mode: 'create'|'edit', product?: {} }
  const [form, setForm] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [toast, setToastMsg] = React.useState(null);

  const CATEGORIES = [
    { id: 'breakfast', label: 'Ngũ cốc ăn sáng', short: 'Ăn sáng',  color: '#C8873A', bg: '#FEF3E2' },
    { id: 'nuts',      label: 'Hạt dinh dưỡng',  short: 'Hạt',       color: '#2563EB', bg: '#EFF6FF' },
    { id: 'diet',      label: 'Giảm cân & Healthy', short: 'Healthy', color: '#4A7C59', bg: '#EBF5EF' },
  ];

  const BG_COLORS = ['#FFF8F0','#F0F8FF','#F0FFF0','#FFF0F8','#F5F0FF','#FFFFF0'];
  const ACCENT_COLORS = ['#C8873A','#2563EB','#4A7C59','#C0396B','#7C3AC8','#8B6914'];

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${window.API_BASE}/products`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  React.useEffect(fetchProducts, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const openCreate = () => {
    setForm({ categoryId: 'breakfast', bgColor: '#FFF8F0', accentColor: '#C8873A', benefits: '', imageUrl: '', stockQuantity: 0 });
    setModal({ mode: 'create' });
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, categoryId: p.category, price: p.price,
      originalPrice: p.originalPrice || '', weight: p.weight,
      description: p.description, bgColor: p.bgColor, accentColor: p.accentColor,
      badge: p.badge || '', badgeType: p.badgeType || '',
      benefits: (p.benefits || []).join('\n'),
      imageUrl: p.imageUrl || '',
      stockQuantity: p.stockQuantity ?? 0,
      _id: p.id
    });
    setModal({ mode: 'edit', product: p });
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const buildBody = () => ({
    name: form.name?.trim(),
    categoryId: form.categoryId,
    price: Number(form.price),
    originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
    weight: form.weight?.trim(),
    description: form.description?.trim(),
    bgColor: form.bgColor,
    accentColor: form.accentColor,
    badge: form.badge?.trim() || null,
    badgeType: form.badgeType?.trim() || null,
    imageUrl: form.imageUrl?.trim() || null,
    benefits: form.benefits ? form.benefits.split('\n').map(s => s.trim()).filter(Boolean) : [],
    stockQuantity: Number(form.stockQuantity) || 0,
  });

  const handleSave = () => {
    if (!form.name?.trim() || !form.price || !form.weight?.trim() || !form.description?.trim()) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (*)'); return;
    }
    setSaving(true);
    const isEdit = modal.mode === 'edit';
    const url = isEdit ? `${window.API_BASE}/admin/products/${form._id}` : `${window.API_BASE}/admin/products`;
    fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(buildBody()),
    })
      .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e)))
      .then(() => { setSaving(false); setModal(null); fetchProducts(); showToast(isEdit ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm mới'); })
      .catch(() => { setSaving(false); alert('Lưu thất bại. Kiểm tra lại thông tin.'); });
  };

  const handleDelete = (id) => {
    fetch(`${window.API_BASE}/admin/products/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => { if (!r.ok) throw new Error(); setDeleteId(null); fetchProducts(); showToast('Đã xóa sản phẩm'); })
      .catch(() => { setDeleteId(null); alert('Xóa thất bại.'); });
  };

  const previewProduct = {
    id: 0, name: form.name || 'Tên sản phẩm', category: form.categoryId || 'breakfast',
    bgColor: form.bgColor || '#FFF8F0', accentColor: form.accentColor || '#C8873A',
    imageUrl: form.imageUrl?.trim() || null,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      <AdminSidebar activePage="admin-products" onNavigate={onNavigate} onLogout={onLogout} />

      <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--primary-dark)', fontFamily: 'Lora, serif' }}>
            Quản lý sản phẩm
          </h1>
          <button onClick={openCreate} style={{
            background: 'var(--primary)', color: '#fff', border: 'none',
            borderRadius: 8, padding: '0.55rem 1.1rem', cursor: 'pointer',
            fontSize: '0.88rem', fontWeight: 600
          }}>+ Thêm sản phẩm</button>
        </div>

        {/* Category filter */}
        {!loading && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {[{ id: '', short: 'Tất cả', color: '#555', bg: '#F3F4F6' }, ...CATEGORIES].map(c => (
              <button key={c.id} onClick={() => setFilterCat(c.id)} style={{
                background: filterCat === c.id ? c.color : '#fff',
                color: filterCat === c.id ? '#fff' : c.color,
                border: `1px solid ${c.color}`,
                borderRadius: 20, padding: '0.3rem 0.85rem',
                fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
              }}>{c.short}</button>
            ))}
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Đang tải...</div>}

        {!loading && (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 110px 140px 80px 120px 120px',
              padding: '0.75rem 1.5rem', background: '#F9FAFB', borderBottom: '1px solid #F0F0F0',
              fontSize: '0.73rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              <span>Ảnh</span>
              <span>Tên sản phẩm</span>
              <span>Danh mục</span>
              <span>Giá bán</span>
              <span>Tồn kho</span>
              <span>Nhãn</span>
              <span>Thao tác</span>
            </div>

            {products.filter(p => !filterCat || p.category === filterCat).length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Chưa có sản phẩm.</div>
            )}

            {products.filter(p => !filterCat || p.category === filterCat).map((p, idx, arr) => {
              const cat = CATEGORIES.find(c => c.id === p.category);
              const discount = p.originalPrice && p.originalPrice > p.price
                ? Math.round((1 - p.price / p.originalPrice) * 100)
                : null;
              return (
                <div key={p.id} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 110px 140px 80px 120px 120px',
                  padding: '1rem 1.5rem', alignItems: 'center',
                  borderBottom: idx < arr.length - 1 ? '1px solid #F5F5F5' : 'none',
                }}>
                  {/* Ảnh */}
                  <div style={{ width: 44, height: 44 }}>
                    <ProductImage product={p} />
                  </div>

                  {/* Tên + trọng lượng */}
                  <div>
                    <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.9rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#A88878', marginTop: '0.15rem' }}>{p.weight}</div>
                  </div>

                  {/* Danh mục badge */}
                  <div>
                    {cat ? (
                      <span style={{
                        display: 'inline-block',
                        background: cat.bg, color: cat.color,
                        padding: '0.22rem 0.65rem', borderRadius: 20,
                        fontSize: '0.76rem', fontWeight: 600,
                      }}>{cat.short}</span>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{p.category}</span>
                    )}
                  </div>

                  {/* Giá */}
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.92rem' }}>
                      {window.formatPrice(p.price)}
                    </div>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
                        <span style={{ fontSize: '0.74rem', color: '#bbb', textDecoration: 'line-through' }}>
                          {window.formatPrice(p.originalPrice)}
                        </span>
                        <span style={{ fontSize: '0.7rem', background: '#FEF2F2', color: '#DC2626', padding: '0.05rem 0.3rem', borderRadius: 4, fontWeight: 600 }}>
                          -{discount}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tồn kho */}
                  <div>
                    <span style={{
                      fontWeight: 600, fontSize: '0.88rem',
                      color: p.stockQuantity === 0 ? '#DC2626' : p.stockQuantity <= 10 ? '#C8873A' : '#4A7C59',
                    }}>
                      {p.stockQuantity ?? 0}
                    </span>
                    {p.stockQuantity === 0 && (
                      <div style={{ fontSize: '0.68rem', color: '#DC2626' }}>Hết hàng</div>
                    )}
                    {p.stockQuantity > 0 && p.stockQuantity <= 10 && (
                      <div style={{ fontSize: '0.68rem', color: '#C8873A' }}>Sắp hết</div>
                    )}
                  </div>

                  {/* Nhãn */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {p.badge ? (
                      <span style={{ display: 'inline-block', background: '#FEF3E2', color: '#C8873A', padding: '0.22rem 0.6rem', borderRadius: 20, fontSize: '0.76rem', fontWeight: 600 }}>
                        {p.badge}
                      </span>
                    ) : (
                      <span style={{ color: '#ddd', fontSize: '0.8rem' }}>—</span>
                    )}
                  </div>

                  {/* Thao tác */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEdit(p)} style={{
                      background: '#EFF6FF', color: '#2563EB', border: 'none',
                      borderRadius: 6, padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500
                    }}>Sửa</button>
                    <button onClick={() => setDeleteId(p.id)} style={{
                      background: '#FEF2F2', color: '#DC2626', border: 'none',
                      borderRadius: 6, padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500
                    }}>Xóa</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal thêm/sửa */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 700,
            maxHeight: '90vh', overflow: 'auto', padding: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-dark)', fontFamily: 'Lora, serif' }}>
                {modal.mode === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
              </h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#aaa' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Left column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <Field label="Tên sản phẩm *">
                  <input className="field-input" value={form.name || ''} onChange={e => set('name', e.target.value)} placeholder="Ví dụ: Yến mạch hữu cơ" />
                </Field>
                <Field label="URL ảnh (tùy chọn)">
                  <input className="field-input" value={form.imageUrl || ''} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
                </Field>
                <Field label="Danh mục *">
                  <select className="field-input field-select" value={form.categoryId || ''} onChange={e => set('categoryId', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <Field label="Giá bán (đ) *">
                    <input className="field-input" type="number" min="1000" value={form.price || ''} onChange={e => set('price', e.target.value)} placeholder="45000" />
                  </Field>
                  <Field label="Giá gốc (đ)">
                    <input className="field-input" type="number" value={form.originalPrice || ''} onChange={e => set('originalPrice', e.target.value)} placeholder="Để trống nếu không có" />
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <Field label="Trọng lượng *">
                    <input className="field-input" value={form.weight || ''} onChange={e => set('weight', e.target.value)} placeholder="500g / 1kg" />
                  </Field>
                  <Field label="Tồn kho (sản phẩm) *">
                    <input className="field-input" type="number" min="0" value={form.stockQuantity ?? ''} onChange={e => set('stockQuantity', e.target.value)} placeholder="0" />
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <Field label="Nhãn (badge)">
                    <input className="field-input" value={form.badge || ''} onChange={e => set('badge', e.target.value)} placeholder="Bán chạy" />
                  </Field>
                  <Field label="Loại nhãn">
                    <select className="field-input field-select" value={form.badgeType || ''} onChange={e => set('badgeType', e.target.value)}>
                      <option value="">— Không —</option>
                      <option value="hot">hot (đỏ)</option>
                      <option value="new">new (xanh)</option>
                      <option value="sale">sale (cam)</option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* Right column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <Field label="Mô tả *">
                  <textarea className="field-input" rows={3} value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn về sản phẩm" style={{ resize: 'vertical' }} />
                </Field>
                <Field label="Lợi ích (mỗi dòng 1 mục)">
                  <textarea className="field-input" rows={3} value={form.benefits || ''} onChange={e => set('benefits', e.target.value)} placeholder={"Tốt cho tim mạch\nGiàu chất xơ"} style={{ resize: 'vertical', fontSize: '0.82rem' }} />
                </Field>

                {/* Color pickers */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Màu nền</label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {BG_COLORS.map(c => (
                      <div key={c} onClick={() => set('bgColor', c)} style={{
                        width: 28, height: 28, borderRadius: 6, background: c, cursor: 'pointer',
                        border: form.bgColor === c ? '2px solid #333' : '2px solid #E5E7EB'
                      }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Màu nhấn</label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {ACCENT_COLORS.map(c => (
                      <div key={c} onClick={() => set('accentColor', c)} style={{
                        width: 28, height: 28, borderRadius: 6, background: c, cursor: 'pointer',
                        border: form.accentColor === c ? '2px solid #333' : '2px solid transparent'
                      }} />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Preview ảnh</label>
                  <div style={{ width: 80, height: 80 }}>
                    <ProductImage product={previewProduct} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F0F0F0' }}>
              <button onClick={() => setModal(null)} style={{
                background: 'none', border: '1px solid #E5E7EB', borderRadius: 8,
                padding: '0.55rem 1.1rem', cursor: 'pointer', fontSize: '0.88rem', color: '#666'
              }}>Hủy</button>
              <button onClick={handleSave} disabled={saving} style={{
                background: 'var(--primary)', color: '#fff', border: 'none',
                borderRadius: 8, padding: '0.55rem 1.25rem', cursor: 'pointer',
                fontSize: '0.88rem', fontWeight: 600, opacity: saving ? 0.7 : 1
              }}>{saving ? 'Đang lưu...' : 'Lưu sản phẩm'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {deleteId !== null && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', maxWidth: 360, width: '90%', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', color: '#DC2626' }}>Xác nhận xóa</h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', color: '#555' }}>
              Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{
                background: 'none', border: '1px solid #E5E7EB', borderRadius: 8,
                padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.88rem'
              }}>Hủy</button>
              <button onClick={() => handleDelete(deleteId)} style={{
                background: '#DC2626', color: '#fff', border: 'none',
                borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer',
                fontSize: '0.88rem', fontWeight: 600
              }}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          background: '#1F2937', color: '#fff', padding: '0.7rem 1.2rem',
          borderRadius: 8, fontSize: '0.88rem', zIndex: 2000, boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>{toast}</div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="form-field">
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>{label}</label>
      {children}
    </div>
  );
}
