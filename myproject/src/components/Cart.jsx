import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const [cartItems, setCartItems] = useState([])
  const navigate = useNavigate()
  const email = localStorage.getItem('userEmail')

  useEffect(() => {
    if(!email) { navigate('/login'); return }
    axios.get(`http://localhost:5000/cart/${email}`)
      .then(res => setCartItems(res.data.data))
  }, [])

  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)

  const removeItem = (id) => {
    axios.delete(`http://localhost:5000/cart/${id}`)
      .then(() => setCartItems(cartItems.filter(item => item._id !== id)))
  }

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🛒 My Cart</h2>
        <button style={styles.backBtn}
          onClick={() => navigate('/home')}>
          ← Back to Shop
        </button>
      </div>

      <div style={styles.container}>
        {cartItems.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>🛒 Your cart is empty!</p>
            <button style={styles.shopBtn}
              onClick={() => navigate('/home')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {cartItems.map(item => (
              <div key={item._id} style={styles.card}>
                <img
                  src={`http://localhost:5000/uploads/${item.image?.originalname}`}
                  alt="product" style={styles.img}
                  onError={e => e.target.src='https://via.placeholder.com/80'}
                />
                <div style={styles.info}>
                  <h3 style={styles.name}>{item.name}</h3>
                  <p style={styles.price}>💰 ₹{item.price}</p>
                  <p style={styles.qty}>Quantity: {item.quantity}</p>
                  <p style={styles.subtotal}>Subtotal: ₹{Number(item.price) * item.quantity}</p>
                </div>
                <button style={styles.removeBtn}
                  onClick={() => removeItem(item._id)}>
                  🗑️ Remove
                </button>
              </div>
            ))}

            <div style={styles.totalBox}>
              <h3 style={styles.totalText}>Total: ₹{total}</h3>
              <button style={styles.orderBtn}
                onClick={() => {
                  localStorage.setItem('cartTotal', total)
                  navigate('/payment')
                }}>
                💳 Pay Now
              </button>
            </div>
          </>
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
    padding: '20px', marginBottom: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
    display: 'flex', alignItems: 'center', gap: '20px' },
  img: { width: '80px', height: '80px', objectFit: 'cover',
    borderRadius: '10px' },
  info: { flex: 1 },
  name: { fontSize: '18px', color: '#333', margin: '0 0 5px' },
  price: { fontSize: '14px', color: '#11998e',
    fontWeight: 'bold', margin: '3px 0' },
  qty: { fontSize: '13px', color: '#666', margin: '3px 0' },
  subtotal: { fontSize: '14px', color: '#333',
    fontWeight: 'bold', margin: '3px 0' },
  removeBtn: { padding: '8px 14px', background: '#ff4757',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer' },
  totalBox: { background: 'white', borderRadius: '15px',
    padding: '25px', textAlign: 'right',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)' },
  totalText: { fontSize: '22px', color: '#333', marginBottom: '15px' },
  orderBtn: { padding: '12px 35px',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
}

export default Cart