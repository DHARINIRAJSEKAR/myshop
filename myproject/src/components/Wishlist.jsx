import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const navigate = useNavigate()
  const email = localStorage.getItem('userEmail')

  useEffect(() => {
    if(!email) { navigate('/login'); return }
    axios.get(`http://localhost:5000/wishlist/${email}`)
      .then(res => setWishlist(res.data.data))
  }, [])

  const removeItem = (id) => {
    axios.delete(`http://localhost:5000/wishlist/${id}`)
      .then(() => setWishlist(wishlist.filter(item => item._id !== id)))
  }

  const addToCart = (item) => {
    axios.post('http://localhost:5000/addtocart', {
      userEmail: email,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image
    })
    .then(() => alert('Added to Cart! 🛒'))
  }

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>❤️ My Wishlist</h2>
        <button style={styles.backBtn}
          onClick={() => navigate('/home')}>
          ← Back to Shop
        </button>
      </div>

      <div style={styles.container}>
        {wishlist.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>❤️ Your wishlist is empty!</p>
            <button style={styles.shopBtn}
              onClick={() => navigate('/home')}>
              Start Shopping
            </button>
          </div>
        ) : (
          wishlist.map(item => (
            <div key={item._id} style={styles.card}>
              <img
                src={`http://localhost:5000/uploads/${item.image?.originalname}`}
                alt="product" style={styles.img}
                onError={e => e.target.src='https://via.placeholder.com/80'}
              />
              <div style={styles.info}>
                <h3 style={styles.name}>{item.name}</h3>
                <p style={styles.price}>💰 ₹{item.price}</p>
              </div>
              <div style={styles.btns}>
                <button style={styles.cartBtn}
                  onClick={() => addToCart(item)}>
                  🛒 Add to Cart
                </button>
                <button style={styles.removeBtn}
                  onClick={() => removeItem(item._id)}>
                  🗑️ Remove
                </button>
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
    padding: '20px', marginBottom: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
    display: 'flex', alignItems: 'center', gap: '20px' },
  img: { width: '80px', height: '80px', objectFit: 'cover',
    borderRadius: '10px' },
  info: { flex: 1 },
  name: { fontSize: '18px', color: '#333', margin: '0 0 5px' },
  price: { fontSize: '14px', color: '#11998e',
    fontWeight: 'bold', margin: 0 },
  btns: { display: 'flex', flexDirection: 'column', gap: '8px' },
  cartBtn: { padding: '8px 14px', background: '#11998e',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  removeBtn: { padding: '8px 14px', background: '#ff4757',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px' }
}

export default Wishlist