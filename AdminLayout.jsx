import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navStyle = ({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 20px', borderRadius: 10, textDecoration: 'none',
    color: isActive ? '#fff' : '#aaa',
    background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
    fontWeight: isActive ? 600 : 400, fontSize: 15,
    transition: 'all 0.2s',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>🛒 POS Admin</div>
        <nav style={{ flex: 1 }}>
          <NavLink to="/admin" end style={navStyle}>📊 Dashboard</NavLink>
          <NavLink to="/admin/products" style={navStyle}>📦 Products</NavLink>
          <NavLink to="/admin/orders" style={navStyle}>🧾 Orders</NavLink>
          <NavLink to="/admin/users" style={navStyle}>👥 Users</NavLink>
        </nav>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{user.name}</div>
            <div style={{ color: '#aaa', fontSize: 12 }}>Administrator</div>
          </div>
          <button onClick={logout} style={styles.logoutBtn} title="Logout">⏻</button>
        </div>
      </aside>
      {/* Main */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  sidebar: { width: 240, background: '#1a1a2e', display: 'flex', flexDirection: 'column', padding: '24px 16px', gap: 8 },
  brand: { color: '#fff', fontSize: 20, fontWeight: 700, padding: '0 8px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 16 },
  main: { flex: 1, padding: 32, overflowY: 'auto' },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10, padding: '16px 8px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 },
  logoutBtn: { marginLeft: 'auto', background: 'none', border: 'none', color: '#aaa', fontSize: 18, cursor: 'pointer' },
};
