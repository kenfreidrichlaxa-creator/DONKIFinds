import React, { useEffect, useState } from 'react';
import api from '../../api';

const empty = { name: '', price: '', stock: '', category: '', barcode: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => api.get('/products').then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await api.put(`/products/${editing}`, form);
    } else {
      await api.post('/products', form);
    }
    setForm(empty); setEditing(null); setShowForm(false);
    load();
  };

  const handleEdit = p => {
    setForm({ name: p.name, price: p.price, stock: p.stock, category: p.category, barcode: p.barcode || '' });
    setEditing(p._id); setShowForm(true);
  };

  const handleDelete = async id => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Products</h1>
        <button style={styles.addBtn} onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}>
          + Add Product
        </button>
      </div>

      <input style={styles.search} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />

      {showForm && (
        <div style={styles.formBox}>
          <h3 style={{ marginBottom: 16 }}>{editing ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input style={styles.input} placeholder="Product name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input style={styles.input} placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <input style={styles.input} placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            <input style={styles.input} placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <input style={styles.input} placeholder="Barcode (optional)" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={styles.saveBtn} type="submit">{editing ? 'Update' : 'Save'}</button>
              <button style={styles.cancelBtn} type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p._id} style={styles.row}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}><span style={styles.badge}>{p.category}</span></td>
                <td style={styles.td}>₱{Number(p.price).toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={{ color: p.stock <= 5 ? '#dc2626' : '#059669', fontWeight: 600 }}>{p.stock}</span>
                </td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                  <button style={styles.delBtn} onClick={() => handleDelete(p._id)}>Delete</button>
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
  search: { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  formBox: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  input: { padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14 },
  saveBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600 },
  cancelBtn: { background: '#f3f4f6', color: '#333', border: 'none', padding: '10px 20px', borderRadius: 8 },
  tableWrap: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8f9fa' },
  row: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', fontSize: 14 },
  badge: { background: '#ede9fe', color: '#7c3aed', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
  editBtn: { background: '#dbeafe', color: '#1d4ed8', border: 'none', padding: '6px 12px', borderRadius: 6, marginRight: 6, fontSize: 13 },
  delBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 13 },
};
