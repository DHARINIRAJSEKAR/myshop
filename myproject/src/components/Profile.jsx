import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const [user, setUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '', address: '', contact: ''
  })
  const navigate = useNavigate()
  const email = localStorage.getItem('userEmail')

  useEffect(() => {
    if (!email) { navigate('/login'); return }
    axios.post('http://localhost:5000/profile', { email })
      .then(res => {
        setUser(res.data.data)
        setFormData({
          name: res.data.data.name,
          address: res.data.data.address,
          contact: res.data.data.contact
        })
      })
  }, [])

  const handleUpdate = () => {
    axios.put('http://localhost:5000/updateprofile', { email, ...formData })
      .then(() => {
        alert('Profile Updated!')
        setUser({...user, ...formData})
        localStorage.setItem('userName', formData.name)
        setEditMode(false)
      })
  }

  if(!user) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🛍️ MyShop</h2>
        <button style={styles.backBtn}
          onClick={() => navigate('/home')}>
          ← Back
        </button>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>

          {!editMode ? (
            <>
              <h2 style={styles.name}>{user.name}</h2>
              <p style={styles.email}>{user.email}</p>

              <div style={styles.infoBox}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>📞 Contact</span>
                  <span style={styles.infoValue}>{user.contact}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>🏠 Address</span>
                  <span style={styles.infoValue}>{user.address}</span>
                </div>
              </div>

              <button style={styles.editBtn}
                onClick={() => setEditMode(true)}>
                ✏️ Edit Profile
              </button>

              <button style={styles.logoutBtn}
                onClick={() => {
                  localStorage.removeItem('userEmail')
                  localStorage.removeItem('userRole')
                  localStorage.removeItem('userName')
                  navigate('/')
                }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <h3 style={styles.editTitle}>✏️ Edit Profile</h3>

              <div style={styles.inputDiv}>
                <label style={styles.label}>Name</label>
                <input type="text" style={styles.input}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div style={styles.inputDiv}>
                <label style={styles.label}>Contact</label>
                <input type="text" style={styles.input}
                  value={formData.contact}
                  onChange={e => setFormData({...formData, contact: e.target.value})} />
              </div>

              <div style={styles.inputDiv}>
                <label style={styles.label}>Address</label>
                <input type="text" style={styles.input}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>

              <div style={styles.btnRow}>
                <button style={styles.cancelBtn}
                  onClick={() => setEditMode(false)}>
                  Cancel
                </button>
                <button style={styles.saveBtn}
                  onClick={handleUpdate}>
                  💾 Save Changes
                </button>
              </div>
            </>
          )}
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
  container: { display: 'flex', justifyContent: 'center',
    alignItems: 'center', padding: '50px 20px' },
  card: { background: 'white', borderRadius: '20px',
    padding: '40px', width: '400px', textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', fontSize: '36px', fontWeight: 'bold',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    margin: '0 auto 15px' },
  name: { fontSize: '24px', color: '#333', marginBottom: '5px' },
  email: { fontSize: '14px', color: '#888', marginBottom: '25px' },
  infoBox: { background: '#f8f8f8', borderRadius: '12px',
    padding: '20px', marginBottom: '20px', textAlign: 'left' },
  infoRow: { display: 'flex', justifyContent: 'space-between',
    padding: '10px 0', borderBottom: '1px solid #eee' },
  infoLabel: { color: '#555', fontWeight: 'bold', fontSize: '14px' },
  infoValue: { color: '#333', fontSize: '14px' },
  editBtn: { width: '100%', padding: '12px',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer', marginBottom: '10px' },
  logoutBtn: { width: '100%', padding: '12px',
    background: '#f0f0f0', color: '#333',
    border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer' },
  editTitle: { fontSize: '20px', color: '#333',
    marginBottom: '20px' },
  inputDiv: { marginBottom: '15px', textAlign: 'left' },
  label: { fontSize: '13px', color: '#555',
    fontWeight: 'bold', display: 'block', marginBottom: '5px' },
  input: { width: '100%', padding: '11px',
    borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', boxSizing: 'border-box' },
  btnRow: { display: 'flex', gap: '10px', marginTop: '10px' },
  cancelBtn: { flex: 1, padding: '12px', background: '#f0f0f0',
    color: '#333', border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer' },
  saveBtn: { flex: 2, padding: '12px',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer' }
}

export default Profile