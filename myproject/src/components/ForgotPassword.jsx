import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validate = () => {
    let err = {}
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) err.email = 'Enter valid email!'
    if (newPassword.length < 6) err.password = 'Password minimum 6 characters!'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔑 Forgot Password</h2>
        <p style={styles.sub}>Enter your email and new password</p>

        <div style={styles.inputDiv}>
          <label style={styles.label}>Email</label>
          <input type="text" placeholder="Enter your email"
            style={{...styles.input, border: errors.email ? '1px solid red' : '1px solid #ddd'}}
            onChange={e => setEmail(e.target.value)} />
          {errors.email && <p style={styles.error}>{errors.email}</p>}
        </div>

        <div style={styles.inputDiv}>
          <label style={styles.label}>New Password</label>
          <input type="password" placeholder="Enter new password"
            style={{...styles.input, border: errors.password ? '1px solid red' : '1px solid #ddd'}}
            onChange={e => setNewPassword(e.target.value)} />
          {errors.password && <p style={styles.error}>{errors.password}</p>}
        </div>

        <button style={styles.btn}
          onClick={() => {
            if(validate()) {
              axios.post('http://localhost:5000/forgotpassword', { email, newPassword })
                .then(res => {
                  if(res.data.status === 200) {
                    alert('Password changed successfully!')
                    navigate('/login')
                  } else {
                    alert(res.data.message)
                  }
                })
            }
          }}>
          Reset Password
        </button>

        <p style={styles.link}>
          <span style={styles.linkText}
            onClick={() => navigate('/login')}>
            ← Back to Login
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
    marginBottom: '5px', fontSize: '24px' },
  sub: { textAlign: 'center', color: '#888',
    fontSize: '14px', marginBottom: '25px' },
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
  link: { textAlign: 'center', marginTop: '15px' },
  linkText: { color: '#11998e', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }
}

export default ForgotPassword