import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

function EditProduct() {
  const [formData, setFormData] = useState({
    name: '', price: '', quantity: '', category: '', description: ''
  })
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    axios.get(`http://localhost:5000/product/${id}`)
      .then(res => {
        const p = res.data.data
        setFormData({
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          category: p.category || '',
          description: p.description || ''
        })
      })
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>✏️ Edit Product</h2>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Product Name</label>
          <input type="text" style={styles.input}
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Price</label>
          <input type="text" style={styles.input}
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})} />
        </div>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Quantity</label>
          <input type="text" style={styles.input}
            value={formData.quantity}
            onChange={e => setFormData({...formData, quantity: e.target.value})} />
        </div>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Category</label>
          <select style={styles.input}
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="">Select Category</option>
            <option value="Fruits">🍎 Fruits</option>
            <option value="Vegetables">🥦 Vegetables</option>
            <option value="Dairy">🥛 Dairy</option>
            <option value="Snacks">🍫 Snacks</option>
            <option value="Skincare">🧴 Skincare</option>
            <option value="Other">📦 Other</option>
          </select>
        </div>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Description</label>
          <input type="text" style={styles.input}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <div style={styles.btnRow}>
          <button style={styles.backBtn}
            onClick={() => navigate('/home')}>
            ← Back
          </button>
          <button style={styles.submitBtn}
            onClick={() => {
              axios.put(`http://localhost:5000/editproduct/${id}`, formData)
                .then(() => {
                  alert('Product Updated!')
                  navigate('/home')
                })
            }}>
            Update Product
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
  card: { background: 'white', padding: '40px',
    borderRadius: '20px', width: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  title: { textAlign: 'center', color: '#333',
    marginBottom: '25px', fontSize: '24px' },
  inputDiv: { marginBottom: '15px' },
  label: { fontSize: '13px', color: '#555',
    fontWeight: 'bold', display: 'block', marginBottom: '5px' },
  input: { width: '100%', padding: '11px',
    borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', boxSizing: 'border-box' },
  btnRow: { display: 'flex', gap: '10px', marginTop: '20px' },
  backBtn: { flex: 1, padding: '12px', background: '#f0f0f0',
    color: '#333', border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer' },
  submitBtn: { flex: 2, padding: '12px',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer' }
}

export default EditProduct