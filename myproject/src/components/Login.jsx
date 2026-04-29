import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [formData, setFormData] = useState({
    email: '', password: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validate = () => {
    let err = {}
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!formData.email) err.email = 'Email is required!'
    else if (!emailRegex.test(formData.email)) err.email = 'Enter valid email (e.g. test@gmail.com)!' 
    if (formData.password.length < 6) err.password = 'Password minimum 6 characters!'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Email</label>
          <input type="text" placeholder="Enter email"
            style={{...styles.input, border: errors.email ? '1px solid red' : '1px solid #ddd'}}
            onChange={e => setFormData({...formData, email: e.target.value})} />
          {errors.email && <p style={styles.error}>{errors.email}</p>}
        </div>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Password</label>
          <input type="password" placeholder="Enter password"
            style={{...styles.input, border: errors.password ? '1px solid red' : '1px solid #ddd'}}
            onChange={e => setFormData({...formData, password: e.target.value})} />
          {errors.password && <p style={styles.error}>{errors.password}</p>}
        </div>

        <button style={styles.btn}
          onClick={() => {
            if(validate()) {
              axios.post('http://localhost:5000/login', formData)
                .then(res => {
                  if(res.data.status === 200) {
                  localStorage.setItem('userEmail', formData.email)
                  localStorage.setItem('userRole', res.data.role)
                  localStorage.setItem('userName', res.data.name)
                  navigate('/home') 
                  } else {
                    alert(res.data.message)
                  }
                })
            }
          }}>
          Login
        </button>

        <p style={styles.link}>
          Don't have an account?{' '}
          <span style={styles.linkText}
            onClick={() => navigate('/register')}>
            Register
          </span>
        </p>
        <p style={styles.link}>
          <span style={styles.linkText}
            onClick={() => navigate('/forgotpassword')}>
            Forgot Password?
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

export default Login