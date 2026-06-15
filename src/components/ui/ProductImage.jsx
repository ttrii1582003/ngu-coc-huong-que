function ProductImage({ product }) {
  const [imgError, setImgError] = React.useState(false);
  React.useEffect(() => { setImgError(false); }, [product.imageUrl]);

  const { bgColor, accentColor, category } = product;
  const base = {
    width: '100%', height: '100%', backgroundColor: bgColor,
    position: 'relative', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  if (product.imageUrl && !imgError) {
    return (
      <div style={{ ...base, backgroundColor: bgColor || '#FFF8F0' }}>
        <img
          src={product.imageUrl}
          alt={product.name || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  if (category === 'breakfast') {
    const grains = [[105,88,13,7,30],[137,72,12,7,-20],[169,90,13,7,45],[119,110,11,6,65],[156,105,11,6,-40],[143,58,10,5,15],[90,100,9,5,50]];
    return (
      <div style={base}>
        <svg viewBox="0 0 280 220" style={{ width:'100%', height:'100%', display:'block', position:'absolute', inset:0 }}>
          <ellipse cx="140" cy="200" rx="120" ry="60" fill={accentColor} opacity="0.06"/>
          <path d="M68,128 Q140,184 212,128" stroke={accentColor} strokeWidth="2.5" fill="none" opacity="0.55"/>
          <line x1="68" y1="128" x2="68" y2="150" stroke={accentColor} strokeWidth="2" opacity="0.4"/>
          <line x1="212" y1="128" x2="212" y2="150" stroke={accentColor} strokeWidth="2" opacity="0.4"/>
          <line x1="68" y1="150" x2="212" y2="150" stroke={accentColor} strokeWidth="2" opacity="0.3"/>
          {grains.map(([cx,cy,rx,ry,rot],i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} fill={accentColor} opacity={0.5+i*0.04}/>
          ))}
          {[[95,75],[162,70],[127,63]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r={3} fill={accentColor} opacity="0.35"/>
          ))}
        </svg>
      </div>
    );
  }

  if (category === 'nuts') {
    const nuts = [[100,95,22,15,-20],[148,82,18,12,35],[184,108,20,13,-40],[116,140,18,12,20],[161,142,21,14,-25],[87,142,15,10,55],[176,80,14,9,60]];
    return (
      <div style={base}>
        <svg viewBox="0 0 280 220" style={{ width:'100%', height:'100%', display:'block', position:'absolute', inset:0 }}>
          <ellipse cx="140" cy="200" rx="120" ry="55" fill={accentColor} opacity="0.07"/>
          {nuts.map(([cx,cy,rx,ry,rot],i) => (
            <g key={i}>
              <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} fill={accentColor} opacity={0.48+i*0.04}/>
              <ellipse cx={cx} cy={cy} rx={rx*0.52} ry={ry*0.48} transform={`rotate(${rot} ${cx} ${cy})`} fill="white" opacity={0.16}/>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // healthy / default
  const seeds = [[112,88],[142,74],[168,92],[126,112],[158,118],[98,118],[175,108],[138,138],[115,142],[162,144],[88,103],[188,130]];
  return (
    <div style={base}>
      <svg viewBox="0 0 280 220" style={{ width:'100%', height:'100%', display:'block', position:'absolute', inset:0 }}>
        <path d="M140,163 Q172,123 198,80 Q166,86 145,112 Q157,74 178,55 Q132,66 122,112 Q103,80 118,50 Q82,75 97,120 Q78,100 72,75 Q60,110 86,140 Q96,166 140,163Z" fill={accentColor} opacity="0.28"/>
        {seeds.map(([cx,cy],i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={3+i%3} ry={2+i%2} transform={`rotate(${i*30} ${cx} ${cy})`} fill={accentColor} opacity={0.42+(i%3)*0.1}/>
        ))}
        {[[130,98],[148,108],[120,128],[145,133],[168,122]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r={3.5} fill={accentColor} opacity="0.6"/>
        ))}
      </svg>
    </div>
  );
}
