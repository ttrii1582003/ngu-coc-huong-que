function StarRating({ rating, size = 12 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12">
          <path
            d="M6 1l1.3 2.9 3.1.3-2.3 2.1.7 3.1L6 7.9l-2.8 1.5.7-3.1L1.6 4.2l3.1-.3z"
            fill={i <= Math.round(rating) ? '#F5A623' : '#E0CEBA'}
          />
        </svg>
      ))}
    </div>
  );
}
