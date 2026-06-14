function Badge({ text, type }) {
  const palettes = {
    primary: { bg: '#FFF3E0', color: '#B8620A', border: '#EAC88A' },
    green:   { bg: '#F0FAF3', color: '#3A6B49', border: '#A3D5B5' },
    sale:    { bg: '#FFF0EE', color: '#B83020', border: '#F5B8B2' },
  };
  const p = palettes[type] || palettes.primary;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px', borderRadius: 6,
      fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
      textTransform: 'uppercase', fontFamily: 'var(--font-body)',
      background: p.bg, color: p.color, border: `1px solid ${p.border}`,
    }}>
      {text}
    </span>
  );
}
