import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Payment() {
  const [cardData, setCardData] = useState({
    name: '', number: '', expiry: '', cvv: '', address: '', phone: ''
  })
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const navigate = useNavigate()
  const email = localStorage.getItem('userEmail')

  const validate = () => {
    let err = {}
    if (paymentMethod === 'card') {
      if (!cardData.name) err.name = 'Name is required!'
      if (cardData.number.length !== 16) err.number = 'Card number must be 16 digits!'
      if (!cardData.expiry) err.expiry = 'Expiry date is required!'
      if (cardData.cvv.length !== 3) err.cvv = 'CVV must be 3 digits!'
    }
    if (!cardData.address) err.address = 'Delivery address is required!'
    if (cardData.phone.length !== 10) err.phone = 'Phone must be 10 digits!'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handlePayment = () => {
    if (!validate()) return
    setProcessing(true)
    setTimeout(() => {
      const cartTotal = localStorage.getItem('cartTotal') || 0
      axios.post('http://localhost:5000/placeorder', {
        userEmail: email,
        total: cartTotal,
        address: cardData.address,
        phone: cardData.phone,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'
      })
      .then(() => {
        setProcessing(false)
        navigate('/paymentsuccess')
      })
    }, 2000)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>💳 Payment</h2>
          <p style={styles.sub}>Choose your payment method</p>
        </div>

        <div style={styles.methodBox}>
          <div
            style={{...styles.methodCard,
              border: paymentMethod === 'card' ? '2px solid #11998e' : '2px solid #ddd',
              background: paymentMethod === 'card' ? '#f0fdf4' : 'white'
            }}
            onClick={() => setPaymentMethod('card')}>
            <span style={styles.methodIcon}>💳</span>
            <p style={styles.methodText}>Card Payment</p>
          </div>
          <div
            style={{...styles.methodCard,
              border: paymentMethod === 'cod' ? '2px solid #11998e' : '2px solid #ddd',
              background: paymentMethod === 'cod' ? '#f0fdf4' : 'white'
            }}
            onClick={() => setPaymentMethod('cod')}>
            <span style={styles.methodIcon}>💵</span>
            <p style={styles.methodText}>Cash on Delivery</p>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <>
            <div style={styles.cardPreview}>
              <div style={styles.cardFace}>
                <p style={styles.cardBank}>MyShop Bank</p>
                <p style={styles.cardNum}>
                  {cardData.number
                    ? cardData.number.replace(/(.{4})/g, '$1 ').trim()
                    : '**** **** **** ****'}
                </p>
                <div style={styles.cardBottom}>
                  <div>
                    <p style={styles.cardLabel}>CARD HOLDER</p>
                    <p style={styles.cardValue}>{cardData.name || 'YOUR NAME'}</p>
                  </div>
                  <div>
                    <p style={styles.cardLabel}>EXPIRES</p>
                    <p style={styles.cardValue}>{cardData.expiry || 'MM/YY'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.inputDiv}>
              <label style={styles.label}>Card Holder Name</label>
              <input type="text" placeholder="Enter name on card"
                style={{...styles.input, border: errors.name ? '1px solid red' : '1px solid #ddd'}}
                onChange={e => setCardData({...cardData, name: e.target.value})} />
              {errors.name && <p style={styles.error}>{errors.name}</p>}
            </div>

            <div style={styles.inputDiv}>
              <label style={styles.label}>Card Number</label>
              <input type="text" placeholder="16 digit card number"
                maxLength={16}
                style={{...styles.input, border: errors.number ? '1px solid red' : '1px solid #ddd'}}
                onChange={e => setCardData({...cardData, number: e.target.value})} />
              {errors.number && <p style={styles.error}>{errors.number}</p>}
            </div>

            <div style={styles.row}>
              <div style={{...styles.inputDiv, flex:1}}>
                <label style={styles.label}>Expiry Date</label>
                <input type="text" placeholder="MM/YY"
                  maxLength={5}
                  style={{...styles.input, border: errors.expiry ? '1px solid red' : '1px solid #ddd'}}
                  onChange={e => setCardData({...cardData, expiry: e.target.value})} />
                {errors.expiry && <p style={styles.error}>{errors.expiry}</p>}
              </div>
              <div style={{...styles.inputDiv, flex:1}}>
                <label style={styles.label}>CVV</label>
                <input type="password" placeholder="3 digits"
                  maxLength={3}
                  style={{...styles.input, border: errors.cvv ? '1px solid red' : '1px solid #ddd'}}
                  onChange={e => setCardData({...cardData, cvv: e.target.value})} />
                {errors.cvv && <p style={styles.error}>{errors.cvv}</p>}
              </div>
            </div>
          </>
        )}

        {paymentMethod === 'cod' && (
          <div style={styles.codBox}>
            <p style={styles.codText}>💵 Pay when your order arrives at your doorstep!</p>
          </div>
        )}

        <div style={styles.inputDiv}>
          <label style={styles.label}>Delivery Address</label>
          <input type="text" placeholder="Enter delivery address"
            style={{...styles.input, border: errors.address ? '1px solid red' : '1px solid #ddd'}}
            onChange={e => setCardData({...cardData, address: e.target.value})} />
          {errors.address && <p style={styles.error}>{errors.address}</p>}
        </div>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Phone Number</label>
          <input type="text" placeholder="Enter phone number"
            maxLength={10}
            style={{...styles.input, border: errors.phone ? '1px solid red' : '1px solid #ddd'}}
            onChange={e => setCardData({...cardData, phone: e.target.value})} />
          {errors.phone && <p style={styles.error}>{errors.phone}</p>}
        </div>

        <button style={{...styles.payBtn,
          background: processing ? '#ccc' : 'linear-gradient(135deg, #11998e, #38ef7d)',
          cursor: processing ? 'not-allowed' : 'pointer'
        }}
          onClick={handlePayment}
          disabled={processing}>
          {processing ? '⏳ Processing...' :
            paymentMethod === 'cod' ? '📦 Place Order' : '💳 Pay Now'}
        </button>

        <button style={styles.backBtn}
          onClick={() => navigate('/cart')}>
          ← Back to Cart
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    padding: '20px' },
  card: { background: 'white', borderRadius: '20px',
    padding: '35px', width: '440px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  header: { textAlign: 'center', marginBottom: '20px' },
  title: { fontSize: '24px', color: '#333', margin: '0 0 5px' },
  sub: { fontSize: '14px', color: '#888', margin: 0 },
  methodBox: { display: 'flex', gap: '15px', marginBottom: '20px' },
  methodCard: { flex: 1, padding: '15px', borderRadius: '12px',
    textAlign: 'center', cursor: 'pointer',
    transition: 'all 0.2s ease' },
  methodIcon: { fontSize: '30px' },
  methodText: { fontSize: '13px', fontWeight: 'bold',
    color: '#333', margin: '5px 0 0' },
  cardPreview: { marginBottom: '20px' },
  cardFace: { background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    borderRadius: '15px', padding: '25px',
    color: 'white', minHeight: '160px' },
  cardBank: { fontSize: '16px', fontWeight: 'bold',
    margin: '0 0 20px', opacity: 0.9 },
  cardNum: { fontSize: '20px', letterSpacing: '3px',
    margin: '0 0 25px', fontFamily: 'monospace' },
  cardBottom: { display: 'flex', justifyContent: 'space-between' },
  cardLabel: { fontSize: '10px', opacity: 0.7,
    margin: '0 0 3px', letterSpacing: '1px' },
  cardValue: { fontSize: '14px', fontWeight: 'bold', margin: 0 },
  codBox: { background: '#f0fdf4', borderRadius: '12px',
    padding: '20px', marginBottom: '15px', textAlign: 'center' },
  codText: { fontSize: '15px', color: '#333', margin: 0 },
  inputDiv: { marginBottom: '15px' },
  label: { fontSize: '13px', color: '#555',
    fontWeight: 'bold', display: 'block', marginBottom: '5px' },
  input: { width: '100%', padding: '11px',
    borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', boxSizing: 'border-box' },
  row: { display: 'flex', gap: '15px' },
  error: { color: 'red', fontSize: '12px',
    marginTop: '4px', textAlign: 'left' },
  payBtn: { width: '100%', padding: '14px',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' },
  backBtn: { width: '100%', padding: '12px',
    background: '#f0f0f0', color: '#333',
    border: 'none', borderRadius: '10px',
    fontSize: '15px', cursor: 'pointer' }
}

export default Payment