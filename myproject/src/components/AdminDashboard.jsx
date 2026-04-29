import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0, products: 0, orders: 0, revenue: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if(role !== 'admin') { navigate('/home'); return }
    axios.get('http://localhost:5000/adminstats')
      .then(res => {
        setStats(res.data.stats)
        setRecentOrders(res.data.recentOrders)
      })
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>📊 Admin Dashboard</h2>
        <button style={styles.backBtn}
          onClick={() => navigate('/home')}>
          ← Back
        </button>
      </div>

      <div style={styles.container}>

        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #11998e, #38ef7d)'}}>
            <div style={styles.statIcon}>👥</div>
            <h3 style={styles.statNum}>{stats.users}</h3>
            <p style={styles.statLabel}>Total Users</p>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f093fb, #f5576c)'}}>
            <div style={styles.statIcon}>📦</div>
            <h3 style={styles.statNum}>{stats.products}</h3>
            <p style={styles.statLabel}>Total Products</p>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #4facfe, #00f2fe)'}}>
            <div style={styles.statIcon}>🛒</div>
            <h3 style={styles.statNum}>{stats.orders}</h3>
            <p style={styles.statLabel}>Total Orders</p>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f6d365, #fda085)'}}>
            <div style={styles.statIcon}>💰</div>
            <h3 style={styles.statNum}>₹{stats.revenue}</h3>
            <p style={styles.statLabel}>Total Revenue</p>
          </div>
        </div>

        <div style={styles.quickLinks}>
          <button style={styles.linkBtn}
            onClick={() => navigate('/adminorders')}>
            📦 Manage Orders
          </button>
          <button style={styles.linkBtn}
            onClick={() => navigate('/home')}>
            🛍️ Manage Products
          </button>
          <button style={styles.linkBtn}
            onClick={() => navigate('/manageusers')}>
            👥 Manage Users
          </button>
        </div>

        <div style={styles.recentBox}>
          <h3 style={styles.recentTitle}>🕐 Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p style={styles.noOrders}>No orders yet!</p>
          ) : (
            recentOrders.map(order => (
              <div key={order._id} style={styles.orderRow}>
                <div>
                  <p style={styles.orderEmail}>👤 {order.userEmail}</p>
                  <p style={styles.orderDate}>
                    📅 {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div style={styles.orderRight}>
                  <p style={styles.orderTotal}>₹{order.total}</p>
                  <span style={{...styles.orderStatus,
                    background: order.status === 'Pending' ? '#fff3cd' : '#d4edda',
                    color: order.status === 'Pending' ? '#856404' : '#155724'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

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
  container: { maxWidth: '900px', margin: '30px auto', padding: '0 20px' },
  statsGrid: { display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px', marginBottom: '25px' },
  statCard: { borderRadius: '15px', padding: '25px',
    textAlign: 'center', color: 'white',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  statIcon: { fontSize: '35px', marginBottom: '10px' },
  statNum: { fontSize: '32px', fontWeight: 'bold',
    margin: '0 0 5px', color: 'white' },
  statLabel: { fontSize: '14px', margin: 0,
    color: 'rgba(255,255,255,0.9)' },
  quickLinks: { display: 'flex', gap: '15px', marginBottom: '25px' },
  linkBtn: { padding: '12px 25px',
    background: 'white', color: '#11998e',
    border: '2px solid #11998e', borderRadius: '10px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  recentBox: { background: 'white', borderRadius: '15px',
    padding: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' },
  recentTitle: { color: '#333', marginBottom: '20px', fontSize: '18px' },
  noOrders: { color: '#888', textAlign: 'center' },
  orderRow: { display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '12px 0',
    borderBottom: '1px solid #eee' },
  orderEmail: { fontSize: '14px', color: '#333',
    fontWeight: 'bold', margin: '0 0 4px' },
  orderDate: { fontSize: '13px', color: '#888', margin: 0 },
  orderRight: { textAlign: 'right' },
  orderTotal: { fontSize: '16px', fontWeight: 'bold',
    color: '#11998e', margin: '0 0 5px' },
  orderStatus: { padding: '4px 12px', borderRadius: '20px',
    fontSize: '12px', fontWeight: 'bold' }
}

export default AdminDashboard