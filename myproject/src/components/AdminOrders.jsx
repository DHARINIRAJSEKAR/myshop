import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if(role !== 'admin') { navigate('/home'); return }
    axios.get('http://localhost:5000/allorders')
      .then(res => setOrders(res.data.data))
  }, [])

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/orderstatus/${id}`, { status })
      .then(() => {
        setOrders(orders.map(order =>
          order._id === id ? {...order, status} : order
        ))
      })
  }

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>📦 All Orders</h2>
        <button style={styles.backBtn}
          onClick={() => navigate('/home')}>
          ← Back
        </button>
      </div>

      <div style={styles.container}>
        {orders.length === 0 ? (
          <p style={styles.emptyText}>No orders yet!</p>
        ) : (
          orders.map(order => (
            <div key={order._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.orderId}>Order ID: {order._id.slice(-8).toUpperCase()}</p>
                  <p style={styles.userEmail}>👤 {order.userEmail}</p>
                  <p style={styles.date}>📅 {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div style={styles.statusBox}>
                  <span style={{...styles.status,
                    background: order.status === 'Pending' ? '#fff3cd' : '#d4edda',
                    color: order.status === 'Pending' ? '#856404' : '#155724'
                  }}>
                    {order.status === 'Pending' ? '🕐 Pending' : '✅ Delivered'}
                  </span>
                </div>
              </div>

              <div style={styles.itemsList}>
                {order.items.map((item, i) => (
                  <div key={i} style={styles.itemRow}>
                    <span>🛍️ {item.name} x {item.quantity}</span>
                    <span>₹{Number(item.price) * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={styles.cardFooter}>
                <div>
                  <p style={styles.address}>📍 {order.address}</p>
                  <p style={styles.phone}>📞 {order.phone}</p>
                </div>
                <div style={styles.rightSide}>
                  <p style={styles.total}>₹{order.total}</p>
                  {order.status === 'Pending' ? (
                    <button style={styles.deliverBtn}
                      onClick={() => updateStatus(order._id, 'Delivered')}>
                      Mark Delivered ✅
                    </button>
                  ) : (
                    <button style={styles.pendingBtn}
                      onClick={() => updateStatus(order._id, 'Pending')}>
                      Mark Pending 🕐
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  navbar: { background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    padding: '15px 30px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: 'white', margin: 0, fontSize: '22px' },
  backBtn: { padding: '8px 16px', background: 'white',
    color: '#11998e', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 'bold' },
  container: { maxWidth: '750px', margin: '30px auto', padding: '0 20px' },
  emptyText: { textAlign: 'center', fontSize: '20px', color: '#888' },
  card: { background: 'white', borderRadius: '15px',
    padding: '20px', marginBottom: '20px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '15px',
    paddingBottom: '15px', borderBottom: '1px solid #eee' },
  orderId: { fontSize: '14px', fontWeight: 'bold',
    color: '#333', margin: '0 0 4px' },
  userEmail: { fontSize: '13px', color: '#11998e', margin: '0 0 4px' },
  date: { fontSize: '13px', color: '#888', margin: 0 },
  statusBox: { textAlign: 'right' },
  status: { padding: '6px 14px', borderRadius: '20px',
    fontSize: '13px', fontWeight: 'bold' },
  itemsList: { marginBottom: '15px',
    paddingBottom: '15px', borderBottom: '1px solid #eee' },
  itemRow: { display: 'flex', justifyContent: 'space-between',
    padding: '5px 0', fontSize: '14px', color: '#555' },
  cardFooter: { display: 'flex',
    justifyContent: 'space-between', alignItems: 'flex-end' },
  address: { fontSize: '13px', color: '#666', margin: '0 0 5px' },
  phone: { fontSize: '13px', color: '#666', margin: 0 },
  rightSide: { textAlign: 'right' },
  total: { fontSize: '18px', fontWeight: 'bold',
    color: '#11998e', margin: '0 0 8px' },
  deliverBtn: { padding: '8px 16px', background: '#11998e',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px' },
  pendingBtn: { padding: '8px 16px', background: '#ffc107',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px' }
}

export default AdminOrders