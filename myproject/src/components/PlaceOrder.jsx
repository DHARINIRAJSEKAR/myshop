import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function PlaceOrder() {
  const [cartItems, setCartItems] = useState([])
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const email = localStorage.getItem('userEmail')

  useEffect(() => {
    if(!email) { navigate('/login'); return }
    axios.get(`http://localhost:5000/cart/${email}`)
      .then(res => setCartItems(res.data.data))
  }, [])

  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)

  const validate = () => {
    let err = {}
    if(!address) err.address = 'Address is required!'
    if(phone.length !== 10) err.phone = 'Phone must be 10 digits!'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>📦 Place Order</h2>
        <button style={styles.backBtn}
          onClick={() => navigate('/cart')}>
          ← Back to Cart
        </button>
      </div>

      <div style={styles.container}>
        <div style={styles.orderBox}>
          <h3 style={styles.sectionTitle}>🛒 Order Summary</h3>
          {cartItems.map(item => (
            <div key={item._id} style={styles.itemRow}>
              <span>{item.name} x {item.quantity}</span>
              <span>₹{Number(item.price) * item.quantity}</span>
            </div>
          ))}
          <div style={styles.totalRow}>
            <span>Total</span>
            <span style={styles.totalAmt}>₹{total}</span>
          </div>
        </div>

        <div style={styles.formBox}>
          <h3 style={styles.sectionTitle}>📍 Delivery Details</h3>

          <label style={styles.label}>Delivery Address</label>
          <input type="text" placeholder="Enter full address"
            style={{...styles.input, border: errors.address ? '1px solid red' : '1px solid #ddd'}}
            onChange={e => setAddress(e.target.value)} />
          {errors.address && <p style={styles.error}>{errors.address}</p>}

          <label style={styles.label}>Phone Number</label>
          <input type="text" placeholder="Enter 10 digit phone"
            style={{...styles.input, border: errors.phone ? '1px solid red' : '1px solid #ddd'}}
            onChange={e => setPhone(e.target.value)} />
          {errors.phone && <p style={styles.error}>{errors.phone}</p>}

          <button style={styles.orderBtn}
            onClick={() => {
              if(validate()) {
                axios.post('http://localhost:5000/placeorder', {
                  userEmail: email,
                  items: cartItems,
                  address,
                  phone,
                  total
                })
                .then(res => {
                  if(res.data.status === 200) {
                    navigate('/orderconfirm')
                  }
                })
              }
            }}>
            Confirm Order 🎉
          </button>
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
  container: { maxWidth: '600px', margin: '30px auto', padding: '0 20px' },
  orderBox: { background: 'white', borderRadius: '15px',
    padding: '25px', marginBottom: '20px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)' },
  sectionTitle: { color: '#333', marginBottom: '15px', fontSize: '18px' },
  itemRow: { display: 'flex', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '1px solid #eee',
    fontSize: '14px', color: '#555' },
  totalRow: { display: 'flex', justifyContent: 'space-between',
    padding: '12px 0', fontSize: '16px', fontWeight: 'bold' },
  totalAmt: { color: '#11998e', fontSize: '18px' },
  formBox: { background: 'white', borderRadius: '15px',
    padding: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' },
  label: { fontSize: '13px', color: '#555',
    fontWeight: 'bold', display: 'block', marginBottom: '5px' },
  input: { width: '100%', padding: '11px', marginBottom: '5px',
    borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', boxSizing: 'border-box' },
  error: { color: 'red', fontSize: '12px',
    marginBottom: '10px', textAlign: 'left' },
  orderBtn: { width: '100%', padding: '14px', marginTop: '15px',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
}

export default PlaceOrder