import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../api';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(r => setData(r.data)).catch(console.error);
  }, []);

  if (!data) return <div style={styles.loading}>Loading dashboard...</div>;

  const chartData = data.salesByDay.map(([date, total]) => ({
    date: date.slice(5),
    total,
  }));

  return (
    <div>
      <h1 style={styles.title}>Dashboard</h1>

      {/* Stats */}
      <div style={styles.grid}>
        <StatCard icon="💰" label="Total Revenue" value={`₱${data.totalRevenue.toLocaleString()}`} color="#4f46e5" />
        <StatCard icon="📅" label="Today's Sales" value={`₱${data.todayRevenue.toLocaleString()}`} color="#059669" />
        <StatCard icon="🧾" label="Total Orders" value={data.totalOrders} color="#d97706" />
        <StatCard icon="📦" label="Products" value={data.totalProducts} color="#7c3aed" />
      </div>

      {/* Chart */}
      <div style={styles.chartBox}>
        <h3 style={styles.sectionTitle}>Sales (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={v => `₱${v.toLocaleString()}`} />
            <Bar dataKey="total" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Low Stock */}
      {data.lowStock.length > 0 && (
        <div style={styles.alertBox}>
          <h3 style={styles.sectionTitle}>⚠️ Low Stock Alert</h3>
          <div style={styles.lowStockGrid}>
            {data.lowStock.map(p => (
              <div key={p._id} style={styles.lowStockItem}>
                <span>{p.name}</span>
                <span style={{ color: p.stock === 0 ? '#dc2626' : '#d97706', fontWeight: 700 }}>
                  {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, color: '#888' }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
      </div>
    </div>
  );
}

const styles = {
  loading: { padding: 40, textAlign: 'center', color: '#888' },
  title: { fontSize: 26, fontWeight: 700, marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 },
  card: { background: '#fff', borderRadius: 12, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  chartBox: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: 16, fontWeight: 600, marginBottom: 16 },
  alertBox: { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  lowStockGrid: { display: 'flex', flexDirection: 'column', gap: 8 },
  lowStockItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fef9f0', borderRadius: 8, fontSize: 14 },
};
