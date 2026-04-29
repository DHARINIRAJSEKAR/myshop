import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function MyOrders() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  const email = localStorage.getItem('userEmail')

  useEffect(() => {
    if(!email) { navigate('/login'); return }
    axios.get(`http://localhost:5000/myorders/${email}`)
      .then(res => setOrders(res.data.data))
  }, [])

  const cancelOrder = (id) => {
    if(window.confirm('Are you sure you want to cancel this order?')) {
      axios.delete(`http://localhost:5000/cancelorder/${id}`)
        .then(() => setOrders(orders.filter(order => order._id !== id)))
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>📦 My Orders</h2>
        <button style={styles.backBtn}
          onClick={() => navigate('/home')}>
          ← Back to Shop
        </button>
      </div>

      <div style={styles.container}>
        {orders.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>📦 No orders yet!</p>
            <button style={styles.shopBtn}
              onClick={() => navigate('/home')}>
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.orderId}>Order ID: {order._id.slice(-8).toUpperCase()}</p>
                  <p style={styles.date}>
                    📅 {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <span style={{...styles.status,
                  background: order.status === 'Pending' ? '#fff3cd' : '#d4edda',
                  color: order.status === 'Pending' ? '#856404' : '#155724'
                }}>
                  {order.status === 'Pending' ? '🕐 Pending' : '✅ Delivered'}
                </span>
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
                  <p style={styles.total}>Total: ₹{order.total}</p>
                  {order.status === 'Pending' && (
                    <button style={styles.cancelBtn}
                      onClick={() => cancelOrder(order._id)}>
                      ❌ Cancel Order
                    </button>
                  )}
                  {order.status === 'Delivered' && (
                    <p style={styles.deliveredText}>✅ Delivered!</p>
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
  container: { maxWidth: '700px', margin: '30px auto', padding: '0 20px' },
  emptyBox: { textAlign: 'center', marginTop: '100px' },
  emptyText: { fontSize: '22px', color: '#888', marginBottom: '20px' },
  shopBtn: { padding: '12px 30px',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '16px' },
  card: { background: 'white', borderRadius: '15px',
    padding: '20px', marginBottom: '20px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '15px',
    paddingBottom: '15px', borderBottom: '1px solid #eee' },
  orderId: { fontSize: '14px', fontWeight: 'bold',
    color: '#333', margin: '0 0 5px' },
  date: { fontSize: '13px', color: '#888', margin: 0 },
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
  cancelBtn: { padding: '8px 16px', background: '#ff4757',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  deliveredText: { color: '#11998e', fontWeight: 'bold',
    fontSize: '14px', margin: 0 }
}

export default MyOrders