function AdminRevenuePage({ token, onLogout, onNavigate }) {
  const today = new Date();
  const fmt = d => d.toISOString().slice(0, 10);

  const [groupBy, setGroupBy] = React.useState(() => {
    const init = window._adminRevenueInit;
    return (init && init.groupBy) || 'day';
  });
  const [fromDate, setFromDate] = React.useState(() => {
    const init = window._adminRevenueInit;
    if (init && init.from) return init.from;
    const d = new Date(today);
    d.setDate(d.getDate() - 29);
    return fmt(d);
  });
  const [toDate, setToDate] = React.useState(() => {
    const init = window._adminRevenueInit;
    const val = (init && init.to) || fmt(today);
    window._adminRevenueInit = null;
    return val;
  });
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);

  const fetchData = React.useCallback(() => {
    setLoading(true);
    fetch(`${window.API_BASE}/admin/revenue?groupBy=${groupBy}&from=${fromDate}&to=${toDate}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(rows => { setData(rows); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, groupBy, fromDate, toDate]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  React.useEffect(() => {
    if (loading || !chartRef.current) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
    if (data.length === 0) return;

    const labels = data.map(d => {
      if (groupBy === 'month') {
        const [y, m] = d.period.split('-');
        return `T${parseInt(m)}/${y}`;
      }
      const [, m, day] = d.period.split('-');
      return `${day}/${m}`;
    });
    const revenues = data.map(d => d.revenue);
    const counts   = data.map(d => d.orderCount);

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Doanh thu (đ)',
            data: revenues,
            backgroundColor: 'rgba(200, 135, 58, 0.75)',
            borderColor: '#C8873A',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'yRevenue',
          },
          {
            label: 'Số đơn',
            data: counts,
            type: 'line',
            borderColor: '#4A7C59',
            backgroundColor: 'rgba(74, 124, 89, 0.12)',
            borderWidth: 2,
            pointRadius: data.length > 20 ? 2 : 4,
            tension: 0.3,
            fill: true,
            yAxisID: 'yOrders',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { font: { family: 'DM Sans, sans-serif', size: 12 } } },
          tooltip: {
            callbacks: {
              label: ctx => {
                if (ctx.datasetIndex === 0) return ` ${window.formatPrice(ctx.raw)}`;
                return ` ${ctx.raw} đơn`;
              },
            },
          },
        },
        scales: {
          yRevenue: {
            type: 'linear',
            position: 'left',
            ticks: {
              callback: v => {
                if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'tr';
                if (v >= 1_000) return (v / 1_000).toFixed(0) + 'k';
                return v;
              },
              font: { family: 'DM Sans, sans-serif', size: 11 },
            },
            grid: { color: 'rgba(0,0,0,0.05)' },
          },
          yOrders: {
            type: 'linear',
            position: 'right',
            ticks: { stepSize: 1, font: { family: 'DM Sans, sans-serif', size: 11 } },
            grid: { display: false },
          },
          x: {
            ticks: {
              maxTicksLimit: data.length > 30 ? 15 : undefined,
              font: { family: 'DM Sans, sans-serif', size: 11 },
            },
            grid: { display: false },
          },
        },
      },
    });
  }, [data, groupBy, loading]);

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders  = data.reduce((s, d) => s + d.orderCount, 0);
  const avgOrder     = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const switchGroupBy = val => {
    setGroupBy(val);
    if (val === 'month') {
      const d6 = new Date(today);
      d6.setMonth(d6.getMonth() - 5);
      d6.setDate(1);
      setFromDate(fmt(d6));
      setToDate(fmt(today));
    } else {
      const d30 = new Date(today);
      d30.setDate(d30.getDate() - 29);
      setFromDate(fmt(d30));
      setToDate(fmt(today));
    }
  };

  const SUMMARY = [
    {
      label: 'Tổng doanh thu',
      value: window.formatPrice(totalRevenue),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10 5.5v1M10 13.5v1M7.5 12c0 1 .9 1.5 2.5 1.5s2.5-.6 2.5-1.8c0-.9-.7-1.3-2.5-1.7-1.8-.4-2.5-.8-2.5-1.7C7.5 7.4 8.4 7 10 7s2.5.5 2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      color: '#4A7C59', bg: '#EBF5EF',
    },
    {
      label: 'Tổng đơn hàng',
      value: totalOrders,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 4V3M13 4V3M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M6 12h4M6 15h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      color: '#2563EB', bg: '#EFF6FF',
    },
    {
      label: 'Trung bình mỗi đơn',
      value: window.formatPrice(avgOrder),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 14l4-5 4 3 4-6 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 17h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ),
      color: '#C8873A', bg: '#FEF3E2',
    },
  ];

  const inputStyle = {
    border: '1px solid #E5E7EB', borderRadius: 7, padding: '0.4rem 0.65rem',
    fontSize: '0.82rem', color: '#333', background: '#fff', outline: 'none',
  };

  const toggleBtnStyle = active => ({
    padding: '0.4rem 0.85rem', fontSize: '0.82rem', fontWeight: active ? 600 : 400,
    border: `1px solid ${active ? '#C8873A' : '#E5E7EB'}`,
    background: active ? '#C8873A' : '#fff',
    color: active ? '#fff' : '#555',
    borderRadius: 7, cursor: 'pointer', transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      <AdminSidebar activePage="admin-revenue" onNavigate={onNavigate} onLogout={onLogout} />
      <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.2rem', fontSize: '1.4rem', color: 'var(--primary-dark)', fontFamily: 'Lora, serif' }}>
              Doanh thu
            </h1>
            <p style={{ margin: 0, color: '#888', fontSize: '0.82rem' }}>
              Phân tích doanh thu theo thời gian
            </p>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 0, borderRadius: 7, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
              <button onClick={() => switchGroupBy('day')} style={{ ...toggleBtnStyle(groupBy === 'day'), borderRadius: 0, border: 'none', borderRight: '1px solid #E5E7EB' }}>
                Theo ngày
              </button>
              <button onClick={() => switchGroupBy('month')} style={{ ...toggleBtnStyle(groupBy === 'month'), borderRadius: 0, border: 'none' }}>
                Theo tháng
              </button>
            </div>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={inputStyle} />
            <span style={{ color: '#aaa', fontSize: '0.82rem' }}>→</span>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={inputStyle} />
            <button
              onClick={fetchData}
              style={{
                background: '#C8873A', color: '#fff', border: 'none', borderRadius: 7,
                padding: '0.42rem 1rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Xem
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          {SUMMARY.map(s => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: 12, padding: '1.1rem 1.3rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)', borderLeft: `4px solid ${s.color}`,
            }}>
              <div style={{ color: s.color, marginBottom: '0.5rem', opacity: 0.85 }}>{s.icon}</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: s.color, lineHeight: 1.1, marginBottom: '0.25rem' }}>
                {loading ? '—' : s.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem 1.4rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#444', marginBottom: '1rem' }}>
            Biểu đồ doanh thu
          </div>
          {loading ? (
            <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.85rem' }}>
              Đang tải...
            </div>
          ) : data.length === 0 ? (
            <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.85rem' }}>
              Không có dữ liệu trong khoảng thời gian này
            </div>
          ) : (
            <div style={{ height: 300, position: 'relative' }}>
              <canvas ref={chartRef} />
            </div>
          )}
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #F3F4F6', fontWeight: 600, fontSize: '0.85rem', color: '#444' }}>
            Chi tiết theo {groupBy === 'month' ? 'tháng' : 'ngày'}
          </div>
          {loading ? (
            <div style={{ padding: '2rem', color: '#aaa', textAlign: 'center', fontSize: '0.85rem' }}>Đang tải...</div>
          ) : data.length === 0 ? (
            <div style={{ padding: '2rem', color: '#aaa', textAlign: 'center', fontSize: '0.85rem' }}>Không có dữ liệu</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ background: '#FAFAFA' }}>
                    {['Kỳ', 'Số đơn hàng', 'Doanh thu', '% trên tổng'].map(h => (
                      <th key={h} style={{ padding: '0.6rem 1.1rem', textAlign: 'left', color: '#888', fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...data].reverse().map((row, idx) => {
                    const pct = totalRevenue > 0 ? ((row.revenue / totalRevenue) * 100).toFixed(1) : '0.0';
                    const label = groupBy === 'month'
                      ? (() => { const [y, m] = row.period.split('-'); return `Tháng ${parseInt(m)}/${y}`; })()
                      : (() => { const [y, m, d] = row.period.split('-'); return `${d}/${m}/${y}`; })();
                    return (
                      <tr
                        key={row.period}
                        style={{ borderTop: idx > 0 ? '1px solid #F3F4F6' : 'none', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '0.7rem 1.1rem', color: '#333', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</td>
                        <td style={{ padding: '0.7rem 1.1rem', color: '#555' }}>{row.orderCount}</td>
                        <td style={{ padding: '0.7rem 1.1rem', fontWeight: 600, color: '#4A7C59', whiteSpace: 'nowrap' }}>
                          {window.formatPrice(row.revenue)}
                        </td>
                        <td style={{ padding: '0.7rem 1.1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ flex: 1, height: 6, background: '#F3F4F6', borderRadius: 3, minWidth: 60, maxWidth: 120 }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: '#C8873A', borderRadius: 3 }} />
                            </div>
                            <span style={{ color: '#888', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid #E5E7EB', background: '#FAFAFA' }}>
                    <td style={{ padding: '0.7rem 1.1rem', fontWeight: 700, color: '#333', fontSize: '0.82rem' }}>Tổng cộng</td>
                    <td style={{ padding: '0.7rem 1.1rem', fontWeight: 700, color: '#333' }}>{totalOrders}</td>
                    <td style={{ padding: '0.7rem 1.1rem', fontWeight: 700, color: '#4A7C59', whiteSpace: 'nowrap' }}>
                      {window.formatPrice(totalRevenue)}
                    </td>
                    <td style={{ padding: '0.7rem 1.1rem', fontWeight: 700, color: '#888', fontSize: '0.75rem' }}>100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
