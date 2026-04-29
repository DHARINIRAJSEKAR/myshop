import { useNavigate } from 'react-router-dom'

function PaymentSuccess() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconBox}>
          <span style={styles.icon}>✅</span>
        </div>
        <h2 style={styles.title}>Payment Successful!</h2>
        <p style={styles.sub}>Your order has been placed successfully!</p>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>🎉 Thank you for shopping with us!</p>
          <p style={styles.infoText}>📦 Your order will be delivered soon!</p>
          <p style={styles.infoText}>📧 Order confirmation sent to your email!</p>
        </div>

        <button style={styles.homeBtn}
          onClick={() => navigate('/home')}>
          🛍️ Continue Shopping
        </button>

        <button style={styles.ordersBtn}
          onClick={() => navigate('/myorders')}>
          📦 View My Orders
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    display: 'flex', justifyContent: 'center', alignItems: 'center' },
  card: { background: 'white', borderRadius: '20px',
    padding: '50px 40px', width: '420px', textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  iconBox: { marginBottom: '20px' },
  icon: { fontSize: '80px' },
  title: { fontSize: '28px', color: '#11998e',
    fontWeight: 'bold', margin: '0 0 10px' },
  sub: { fontSize: '16px', color: '#555',
    marginBottom: '30px' },
  infoBox: { background: '#f0fdf4', borderRadius: '12px',
    padding: '20px', marginBottom: '30px', textAlign: 'left' },
  infoText: { fontSize: '14px', color: '#333',
    margin: '8px 0', lineHeight: '1.5' },
  homeBtn: { width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: 'bold',
    cursor: 'pointer', marginBottom: '10px' },
  ordersBtn: { width: '100%', padding: '13px',
    background: '#f0f0f0', color: '#333',
    border: 'none', borderRadius: '10px',
    fontSize: '15px', cursor: 'pointer' }
}

export default PaymentSuccess