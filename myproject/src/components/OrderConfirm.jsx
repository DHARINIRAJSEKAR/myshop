import { useNavigate } from 'react-router-dom'

function OrderConfirm() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.checkCircle}>✅</div>
        <h2 style={styles.title}>Order Placed Successfully!</h2>
        <p style={styles.sub}>Thank you for your order! Your products will be delivered soon.</p>

        <div style={styles.btnRow}>
          <button style={styles.homeBtn}
            onClick={() => navigate('/home')}>
            🛍️ Continue Shopping
          </button>
          <button style={styles.ordersBtn}
            onClick={() => navigate('/myorders')}>
            📦 My Orders
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    display: 'flex', justifyContent: 'center', alignItems: 'center' },
  card: { background: 'white', borderRadius: '20px',
    padding: '50px 40px', textAlign: 'center',
    maxWidth: '450px', width: '90%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  checkCircle: { fontSize: '70px', marginBottom: '20px' },
  title: { fontSize: '26px', color: '#333', marginBottom: '10px' },
  sub: { fontSize: '15px', color: '#888',
    marginBottom: '30px', lineHeight: '1.6' },
  btnRow: { display: 'flex', gap: '10px', justifyContent: 'center' },
  homeBtn: { padding: '12px 20px',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  ordersBtn: { padding: '12px 20px', background: '#f0f0f0',
    color: '#333', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }
}

export default OrderConfirm