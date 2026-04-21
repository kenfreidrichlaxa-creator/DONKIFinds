import React, { useEffect, useState } from 'react';
import api from '../../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data));
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Orders</h1>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Cashier</th>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <React.Fragment key={o._id}>
                <tr style={styles.row}>
                  <td style={styles.td}>{new Date(o.createdAt).toLocaleString()}</td>
                  <td style={styles.td}>{o.cashierName}</td>
                  <td style={styles.td}>{o.items.length} item(s)</td>
                  <td style={styles.td}>₱{o.total.toLocaleString()}</td>
                  <td style={styles.td}><span style={styles.badge}>{o.paymentMethod}</span></td>
                  <td style={styles.td}>
                    <button style={styles.viewBtn} onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
                      {expanded === o._id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
                {expanded === o._id && (
                  <tr>
                    <td colSpan={6} style={{ padding: '0 16px 16px' }}>
                      <div style={styles.detail}>
                        {o.items.map((item, i) => (
                          <div key={i} style={styles.detailRow}>
                            <span>{item.name}</span>
                            <span>x{item.qty}</span>
                            <span>₱{(item.price * item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                        <div style={styles.detailTotal}>
                          <span>Total: ₱{o.total.toLocaleString()}</span>
                          {o.amountPaid && <span>Paid: ₱{o.amountPaid.toLocaleString()}</span>}
                          {o.change != null && <span>Change: ₱{o.change.toLocaleString()}</span>}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: 26, fontWeight: 700, marginBottom: 24 },
  tableWrap: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8f9fa' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 600 },
  row: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', fontSize: 14 },
  badge: { background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
  viewBtn: { background: '#ede9fe', color: '#7c3aed', border: 'none', padding: '6px 14px', borderRadius: 6, fontSize: 13 },
  detail: { background: '#f8f9fa', borderRadius: 8, padding: 16 },
  detailRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, borderBottom: '1px solid #eee' },
  detailTotal: { display: 'flex', gap: 24, marginTop: 10, fontWeight: 600, fontSize: 14 },
};
