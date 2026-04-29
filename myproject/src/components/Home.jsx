import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [products, setProducts] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortPrice, setSortPrice] = useState('none')
  const [formData, setFormData] = useState({
    name: '', price: '', quantity: '', image: null, category: '', description: ''
  })
  const navigate = useNavigate()
  const role = localStorage.getItem('userRole')
  const userName = localStorage.getItem('userName')
  const email = localStorage.getItem('userEmail')

  useEffect(() => {
    if(!email) { navigate('/login'); return }
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data.data))
    if(role !== 'admin') {
      axios.get(`http://localhost:5000/cart/${email}`)
        .then(res => setCartCount(res.data.data.length))
    }
  }, [])

  const getFilteredProducts = () => {
    let filtered = products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if(selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    if(sortPrice === 'low') {
      filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price))
    } else if(sortPrice === 'high') {
      filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price))
    }
    return filtered
  }

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <h2 style={styles.logo}>🛍️ MyShop</h2>
          {userName && (
            <span style={styles.welcome}>Hi, {userName}! 👋</span>
          )}
        </div>
        <div style={styles.navLinks}>
          {role === 'admin' && (
            <button style={styles.navBtn}
              onClick={() => navigate('/admindashboard')}>
              📊 Dashboard
            </button>
          )}
          {role === 'admin' && (
            <button style={styles.navBtn}
              onClick={() => setShowAdd(!showAdd)}>
              + Add Product
            </button>
          )}
          {role === 'admin' && (
            <button style={styles.navBtn}
              onClick={() => navigate('/adminorders')}>
              📦 Orders
            </button>
          )}
          {role !== 'admin' && (
            <button style={styles.navBtn}
              onClick={() => navigate('/cart')}>
              🛒 Cart
              {cartCount > 0 && (
                <span style={styles.cartBadge}>{cartCount}</span>
              )}
            </button>
          )}
          {role !== 'admin' && (
            <button style={styles.navBtn}
              onClick={() => navigate('/myorders')}>
              📦 My Orders
            </button>
          )}
          {role !== 'admin' && (
            <button style={styles.navBtn}
              onClick={() => navigate('/wishlist')}>
              ❤️ Wishlist
            </button>
          )}
          <button style={styles.navBtn}
            onClick={() => navigate('/profile')}>
            👤 Profile
          </button>
          <button style={styles.navBtn}
            onClick={() => {
              if(window.confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userEmail')
                localStorage.removeItem('userRole')
                localStorage.removeItem('userName')
                navigate('/')
              }
            }}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.searchBox}>
        <input type="text" placeholder="🔍 Search products..."
          style={styles.searchInput}
          onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={styles.filterBox}>
        <div style={styles.categories}>
          {['All','Fruits','Vegetables','Dairy','Snacks','Skincare','Other'].map(cat => (
            <button key={cat}
              style={{...styles.catBtn,
                background: selectedCategory === cat ? '#11998e' : 'white',
                color: selectedCategory === cat ? 'white' : '#11998e'
              }}
              onClick={() => setSelectedCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <select style={styles.sortSelect}
          onChange={e => setSortPrice(e.target.value)}>
          <option value="none">Sort by Price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      {role === 'admin' && showAdd && (
        <div style={styles.formBox}>
          <h3 style={styles.formTitle}>Add Product</h3>
          <input type="text" placeholder="Product Name" style={styles.input}
            onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="text" placeholder="Price" style={styles.input}
            onChange={e => setFormData({...formData, price: e.target.value})} />
          <input type="text" placeholder="Quantity" style={styles.input}
            onChange={e => setFormData({...formData, quantity: e.target.value})} />
          <select style={styles.input}
            onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="">Select Category</option>
            <option value="Fruits">🍎 Fruits</option>
            <option value="Vegetables">🥦 Vegetables</option>
            <option value="Dairy">🥛 Dairy</option>
            <option value="Snacks">🍫 Snacks</option>
            <option value="Skincare">🧴 Skincare</option>
            <option value="Other">📦 Other</option>
          </select>
          <input type="text" placeholder="Product Description" style={styles.input}
            onChange={e => setFormData({...formData, description: e.target.value})} />
          <input type="file" style={styles.input}
            onChange={e => setFormData({...formData, image: e.target.files[0]})} />
          <button style={styles.submitBtn}
            onClick={() => {
              const data = new FormData()
              data.append('name', formData.name)
              data.append('price', formData.price)
              data.append('quantity', formData.quantity)
              data.append('category', formData.category)
              data.append('description', formData.description)
              data.append('image', formData.image)
              axios.post('http://localhost:5000/addproduct', data)
                .then(() => {
                  alert('Product Added!')
                  setShowAdd(false)
                  axios.get('http://localhost:5000/products')
                    .then(res => setProducts(res.data.data))
                })
            }}>
            Add Product
          </button>
        </div>
      )}

      <div style={styles.grid}>
        {getFilteredProducts().length === 0 ? (
          <p style={styles.noProduct}>No products found!</p>
        ) : (
          getFilteredProducts().map(product => (
            <div key={product._id}
              style={{...styles.card, cursor:'pointer'}}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
              onClick={() => navigate(`/viewproduct/${product._id}`)}>
              <img
                src={`http://localhost:5000/uploads/${product.image?.originalname}`}
                alt="product" style={styles.img}
                onError={e => e.target.src='https://via.placeholder.com/150'}
              />
              {product.category && (
                <span style={styles.categoryTag}>{product.category}</span>
              )}
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.price}>💰 ₹{product.price}</p>
              <p style={styles.quantity}>📦 Qty: {product.quantity}</p>
              {parseInt(product.quantity) === 0 && (
                <span style={styles.outOfStock}>❌ Out of Stock</span>
              )}
              {role === 'admin' && (
                <div style={styles.cardBtns}>
                  <button style={styles.editBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/editproduct/${product._id}`)
                    }}>
                    ✏️ Edit
                  </button>
                  <button style={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      if(window.confirm('Delete this product?')) {
                        axios.delete(`http://localhost:5000/deleteproduct/${product._id}`)
                          .then(() => {
                            axios.get('http://localhost:5000/products')
                              .then(res => setProducts(res.data.data))
                          })
                      }
                    }}>
                    🗑️ Delete
                  </button>
                </div>
              )}
              {role !== 'admin' && (
                <div style={{display:'flex', flexDirection:'column', gap:'5px', marginTop:'8px'}}>
                  <button
                    style={{...styles.cartBtn,
                      background: parseInt(product.quantity) === 0 ? '#ccc' : 'linear-gradient(135deg, #11998e, #38ef7d)',
                      cursor: parseInt(product.quantity) === 0 ? 'not-allowed' : 'pointer'
                    }}
                    disabled={parseInt(product.quantity) === 0}
                    onClick={(e) => {
                      e.stopPropagation()
                      axios.post('http://localhost:5000/addtocart', {
                        userEmail: email,
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image
                      })
                      .then(() => {
                        alert('Added to Cart! 🛒')
                        setCartCount(cartCount + 1)
                      })
                    }}>
                    🛒 Add to Cart
                  </button>
                  <button style={styles.wishlistBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      axios.post('http://localhost:5000/addwishlist', {
                        userEmail: email,
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image
                      })
                      .then(res => alert(res.data.message))
                    }}>
                    ❤️ Wishlist
                  </button>
                </div>
              )}
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
  welcome: { color: 'white', fontSize: '14px',
    fontWeight: 'bold', background: 'rgba(255,255,255,0.2)',
    padding: '5px 12px', borderRadius: '20px' },
  navLinks: { display: 'flex', gap: '10px', alignItems: 'center' },
  navBtn: { padding: '8px 16px', background: 'white',
    color: '#11998e', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 'bold', position: 'relative' },
  cartBadge: { position: 'absolute', top: '-8px', right: '-8px',
    background: '#ff4757', color: 'white', borderRadius: '50%',
    width: '20px', height: '20px', fontSize: '11px',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    fontWeight: 'bold' },
  searchBox: { padding: '20px 30px 10px' },
  searchInput: { width: '100%', padding: '12px',
    borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '15px', boxSizing: 'border-box' },
  filterBox: { padding: '10px 30px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: '10px' },
  categories: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  catBtn: { padding: '7px 15px', border: '2px solid #11998e',
    borderRadius: '20px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '13px' },
  sortSelect: { padding: '8px 12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px', cursor: 'pointer' },
  formBox: { background: 'white', margin: '20px 30px',
    padding: '25px', borderRadius: '12px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)' },
  formTitle: { color: '#333', marginBottom: '15px' },
  input: { width: '100%', padding: '11px', marginBottom: '10px',
    borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', boxSizing: 'border-box' },
  submitBtn: { padding: '10px 30px',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '15px' },
  grid: { display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px', padding: '30px' },
  card: { background: 'white', borderRadius: '15px',
    padding: '20px', textAlign: 'center',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease' },
  img: { width: '150px', height: '150px', objectFit: 'cover',
    borderRadius: '10px', marginBottom: '12px' },
  categoryTag: { background: '#e8f5e9', color: '#11998e',
    padding: '3px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: 'bold',
    display: 'inline-block', marginBottom: '8px' },
  productName: { fontSize: '16px', fontWeight: 'bold',
    color: '#333', margin: '0 0 5px' },
  price: { fontSize: '14px', color: '#11998e',
    fontWeight: 'bold', margin: '3px 0' },
  quantity: { fontSize: '13px', color: '#888', margin: '3px 0' },
  outOfStock: { background: '#ff4757', color: 'white',
    padding: '4px 12px', borderRadius: '20px',
    fontSize: '12px', fontWeight: 'bold',
    display: 'inline-block', marginTop: '5px' },
  noProduct: { color: '#888', textAlign: 'center',
    fontSize: '18px', marginTop: '50px' },
  cardBtns: { display: 'flex', gap: '8px',
    justifyContent: 'center', marginTop: '10px' },
  editBtn: { padding: '6px 12px', background: '#11998e',
    color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  deleteBtn: { padding: '6px 12px', background: '#ff4757',
    color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  cartBtn: { width: '100%', padding: '8px',
    color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' },
  wishlistBtn: { width: '100%', padding: '8px',
    background: '#ff4757', color: 'white',
    border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 'bold' }
}

export default Home