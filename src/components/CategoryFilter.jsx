function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="cat-tabs-wrap">
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`cat-tab${active === cat.id ? ' active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
