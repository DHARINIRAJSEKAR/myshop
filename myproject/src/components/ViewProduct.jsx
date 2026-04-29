import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

function ViewProduct() {
  const [product, setProduct] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    axios.get(`http://localhost:5000/product/${id}`)
      .then(res => setProduct(res.data.data))
  }, [])

  if(!product) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img
          src={`http://localhost:5000/uploads/${product.image?.originalname}`}
          alt="product" style={styles.img}
          onError={e => e.target.src='https://via.placeholder.com/300'}
        />
        <div style={styles.details}>
          <h2 style={styles.name}>{product.name}</h2>
          <p style={styles.price}>💰 Price: ₹{product.price}</p>
          <p style={styles.quantity}>📦 Quantity: {product.quantity}</p>
          <button style={styles.backBtn}
            onClick={() => navigate('/home')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5',
    display: 'flex', justifyContent: 'center', alignItems: 'center' },
  card: { background: 'white', borderRadius: '20px',
    padding: '40px', maxWidth: '500px', width: '90%',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)', textAlign: 'center' },
  img: { width: '100%', height: '300px', objectFit: 'contain',
    borderRadius: '12px', marginBottom: '20px' },
  details: { textAlign: 'left' },
  name: { fontSize: '24px', color: '#333', marginBottom: '15px' },
  price: { fontSize: '18px', color: '#11998e',
    fontWeight: 'bold', marginBottom: '10px' },
  quantity: { fontSize: '16px', color: '#666', marginBottom: '25px' },
  backBtn: { padding: '12px 25px',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer' }
}

export default ViewProduct