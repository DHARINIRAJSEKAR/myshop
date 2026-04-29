import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ManageUsers() {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if(role !== 'admin') { navigate('/home'); return }
    axios.get('http://localhost:5000/allusers')
      .then(res => setUsers(res.data.data))
  }, [])

  const updateStatus = (id, status) => {
    const msg = status === 'inactive' ? 'Deactivate this user?' : 'Activate this user?'
    if(window.confirm(msg)) {
      axios.put(`http://localhost:5000/userstatus/${id}`, { status })
        .then(() => {
          setUsers(users.map(user =>
            user._id === id ? {...user, status} : user
          ))
        })
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>👥 Manage Users</h2>
        <button style={styles.backBtn}
          onClick={() => navigate('/admindashboard')}>
          ← Back
        </button>
      </div>

      <div style={styles.container}>
        <p style={styles.count}>Total Users: {users.length}</p>
        {users.length === 0 ? (
          <p style={styles.emptyText}>No users found!</p>
        ) : (
          users.map(user => (
            <div key={user._id} style={styles.card}>
              <div style={styles.avatar}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div style={styles.info}>
                <h3 style={styles.name}>{user.name}</h3>
                <p style={styles.email}>📧 {user.email}</p>
                <p style={styles.contact}>📞 {user.contact}</p>
                <p style={styles.address}>📍 {user.address}</p>
              </div>
              <div style={styles.rightSide}>
                <span style={{...styles.roleBadge,
                  background: user.role === 'admin' ? '#fff3cd' : '#d4edda',
                  color: user.role === 'admin' ? '#856404' : '#155724'
                }}>
                  {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>

                {user.role !== 'admin' && (
                  <span style={{...styles.statusBadge,
                    background: user.status === 'inactive' ? '#f8d7da' : '#d4edda',
                    color: user.status === 'inactive' ? '#721c24' : '#155724'
                  }}>
                    {user.status === 'inactive' ? '🔴 Inactive' : '🟢 Active'}
                  </span>
                )}

                {user.role !== 'admin' && (
                  <button
                    style={{...styles.statusBtn,
                      background: user.status === 'inactive' ? '#11998e' : '#ff4757'
                    }}
                    onClick={() => updateStatus(user._id,
                      user.status === 'inactive' ? 'active' : 'inactive'
                    )}>
                    {user.status === 'inactive' ? '✅ Activate' : '🚫 Deactivate'}
                  </button>
                )}
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
  container: { maxWidth: '750px', margin: '30px auto', padding: '0 20px' },
  count: { fontSize: '16px', color: '#555',
    fontWeight: 'bold', marginBottom: '20px' },
  emptyText: { textAlign: 'center', fontSize: '20px', color: '#888' },
  card: { background: 'white', borderRadius: '15px',
    padding: '20px', marginBottom: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
    display: 'flex', alignItems: 'center', gap: '20px' },
  avatar: { width: '55px', height: '55px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    color: 'white', fontSize: '22px', fontWeight: 'bold',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    flexShrink: 0 },
  info: { flex: 1 },
  name: { fontSize: '17px', color: '#333', margin: '0 0 5px' },
  email: { fontSize: '13px', color: '#555', margin: '3px 0' },
  contact: { fontSize: '13px', color: '#555', margin: '3px 0' },
  address: { fontSize: '13px', color: '#555', margin: '3px 0' },
  rightSide: { display: 'flex', flexDirection: 'column',
    alignItems: 'flex-end', gap: '8px' },
  roleBadge: { padding: '5px 12px', borderRadius: '20px',
    fontSize: '12px', fontWeight: 'bold' },
  statusBadge: { padding: '5px 12px', borderRadius: '20px',
    fontSize: '12px', fontWeight: 'bold' },
  statusBtn: { padding: '8px 16px',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }
}

export default ManageUsers