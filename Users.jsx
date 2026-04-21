import React, { useEffect, useState } from 'react';
import api from '../../api';

const empty = { name: '', username: '', password: '', role: 'cashier' };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/users').then(r => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    await api.post('/users', form);
    setForm(empty); setShowForm(false);
    load();
  };

  const handleDelete = async id => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    load();
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Users</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>+ Add User</button>
      </div>

      {showForm && (
        <div style={styles.formBox}>
          <h3 style={{ marginBottom: 16 }}>New User</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input style={styles.input} placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input style={styles.input} placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <select style={styles.input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={styles.saveBtn} type="submit">Save</button>
              <button style={styles.cancelBtn} type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={styles.row}>
                <td style={styles.td}>{u.name}</td>
                <td style={styles.td}>{u.username}</td>
                <td style={styles.td}>
                  <span style={u.role === 'admin' ? styles.adminBadge : styles.cashierBadge}>{u.role}</span>
                </td>
                <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <button style={styles.delBtn} onClick={() => handleDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 700 },
  addBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600 },
  formBox: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  input: { padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14 },
  saveBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600 },
  cancelBtn: { background: '#f3f4f6', color: '#333', border: 'none', padding: '10px 20px', borderRadius: 8 },
  tableWrap: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8f9fa' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 600 },
  row: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', fontSize: 14 },
  adminBadge: { background: '#ede9fe', color: '#7c3aed', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
  cashierBadge: { background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
  delBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 13 },
};
