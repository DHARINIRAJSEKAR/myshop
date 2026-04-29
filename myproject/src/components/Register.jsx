import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', address: '', contact: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validate = () => {
    let err = {}
    if (!formData.name) err.name = 'Name is required!'
    if (!formData.email.includes('@')) err.email = 'Enter valid email!'
    if (formData.password.length < 6) err.password = 'Password minimum 6 characters!'
    if (!formData.address) err.address = 'Address is required!'
    if (formData.contact.length !== 10) err.contact = 'Contact must be 10 digits!'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Register</h2>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Name</label>
          <input type="text" placeholder="Enter name"
            style={styles.input}
            onChange={e => setFormData({...formData, name: e.target.value})} />
          {errors.name && <p style={styles.error}>{errors.name}</p>}
        </div>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Email</label>
          <input type="email" placeholder="Enter email"
            style={styles.input}
            onChange={e => setFormData({...formData, email: e.target.value})} />
          {errors.email && <p style={styles.error}>{errors.email}</p>}
        </div>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Password</label>
          <input type="password" placeholder="Enter password"
            style={styles.input}
            onChange={e => setFormData({...formData, password: e.target.value})} />
          {errors.password && <p style={styles.error}>{errors.password}</p>}
        </div>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Address</label>
          <input type="text" placeholder="Enter address"
            style={styles.input}
            onChange={e => setFormData({...formData, address: e.target.value})} />
          {errors.address && <p style={styles.error}>{errors.address}</p>}
        </div>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Contact</label>
          <input type="text" placeholder="Enter contact"
            style={styles.input}
            onChange={e => setFormData({...formData, contact: e.target.value})} />
          {errors.contact && <p style={styles.error}>{errors.contact}</p>}
        </div>

        <button style={styles.btn}
          onClick={() => {
            if(validate()) {
              axios.post('http://localhost:5000/register', formData)
                .then(() => {
                  alert('Registered Successfully!')
                  navigate('/login')
                })
            }
          }}>
          Register
        </button>

        <p style={styles.link}>
          Already have an account?{' '}
          <span style={styles.linkText}
            onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
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
  error: { color: 'red', fontSize: '12px', marginTop: '4px', textAlign: 'left' },
  btn: { width: '100%', padding: '12px',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
  link: { textAlign: 'center', marginTop: '15px',
    color: '#888', fontSize: '14px' },
  linkText: { color: '#11998e', cursor: 'pointer', fontWeight: 'bold' }
}

export default Register