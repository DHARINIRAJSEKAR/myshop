import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>

      <div style={styles.navbar}>
        <h2 style={styles.logo}>🛍️ MyShop</h2>
        <div style={styles.navBtns}>
          <button style={styles.loginBtn}
            onClick={() => navigate('/login')}>
            Login
          </button>
          <button style={styles.registerBtn}
            onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
      </div>

      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Fresh Groceries &</h1>
          <h1 style={styles.heroTitle2}>Skincare Products</h1>
          <p style={styles.heroSub}>
            Shop the freshest fruits, vegetables, dairy & skincare products
            delivered right to your doorstep! 🚚
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.shopBtn}
              onClick={() => navigate('/register')}>
              🛒 Shop Now
            </button>
            <button style={styles.learnBtn}
              onClick={() => navigate('/login')}>
              Login →
            </button>
          </div>
        </div>
        <div style={styles.heroEmoji}>
          <img src="/OIP (2).webp" alt="grocery"
            style={styles.groceryImg} />
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🚚</div>
          <h3 style={styles.featureTitle}>Fast Delivery</h3>
          <p style={styles.featureText}>Get your order delivered within 24 hours!</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🌿</div>
          <h3 style={styles.featureTitle}>Fresh Products</h3>
          <p style={styles.featureText}>100% fresh and organic products every day!</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>💰</div>
          <h3 style={styles.featureTitle}>Best Prices</h3>
          <p style={styles.featureText}>Lowest prices guaranteed on all products!</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🔒</div>
          <h3 style={styles.featureTitle}>Secure Payment</h3>
          <p style={styles.featureText}>100% safe and secure payment gateway!</p>
        </div>
      </div>

      <div style={styles.categories}>
        <h2 style={styles.catTitle}>Our Categories</h2>
        <div style={styles.catGrid}>
          {[
            { icon: '🍎', name: 'Fruits' },
            { icon: '🥦', name: 'Vegetables' },
            { icon: '🥛', name: 'Dairy' },
            { icon: '🍫', name: 'Snacks' },
            { icon: '🧴', name: 'Skincare' }
          ].map(cat => (
            <div key={cat.name} style={styles.catCard}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
              onClick={() => navigate('/register')}>
              <div style={styles.catIcon}>{cat.icon}</div>
              <p style={styles.catName}>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>© 2026 MyShop — All rights reserved</p>
      </div>

    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  navbar: { background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    padding: '15px 40px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: 'white', margin: 0, fontSize: '24px' },
  navBtns: { display: 'flex', gap: '10px' },
  loginBtn: { padding: '8px 20px', background: 'white',
    color: '#11998e', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  registerBtn: { padding: '8px 20px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white', border: '2px solid white',
    borderRadius: '8px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '14px' },
  hero: { background: 'linear-gradient(135deg, #11998e, #38ef7d)',
    padding: '80px 40px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center' },
  heroContent: { maxWidth: '550px' },
  heroTitle: { fontSize: '48px', color: 'white',
    margin: '0', fontWeight: 'bold', lineHeight: '1.2' },
  heroTitle2: { fontSize: '48px',
    color: 'rgba(255,255,255,0.85)',
    margin: '0 0 20px', fontWeight: 'bold' },
  heroSub: { fontSize: '18px', color: 'rgba(255,255,255,0.9)',
    marginBottom: '30px', lineHeight: '1.6' },
  heroBtns: { display: 'flex', gap: '15px' },
  shopBtn: { padding: '14px 35px', background: 'white',
    color: '#11998e', border: 'none', borderRadius: '10px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  learnBtn: { padding: '14px 35px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white', border: '2px solid white',
    borderRadius: '10px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '16px' },
  heroEmoji: { padding: '20px' },
  groceryImg: { width: '400px', height: '350px',
    objectFit: 'cover', borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  features: { display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px', padding: '50px 40px',
    background: 'white' },
  featureCard: { textAlign: 'center', padding: '30px 20px',
    borderRadius: '15px', background: '#f8f8f8' },
  featureIcon: { fontSize: '40px', marginBottom: '15px' },
  featureTitle: { fontSize: '18px', color: '#333',
    marginBottom: '10px', fontWeight: 'bold' },
  featureText: { fontSize: '14px', color: '#888', lineHeight: '1.5' },
  categories: { padding: '50px 40px', textAlign: 'center' },
  catTitle: { fontSize: '28px', color: '#333',
    marginBottom: '30px', fontWeight: 'bold' },
  catGrid: { display: 'flex', gap: '20px',
    justifyContent: 'center', flexWrap: 'wrap' },
  catCard: { background: 'white', borderRadius: '15px',
    padding: '30px 25px', textAlign: 'center',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
    cursor: 'pointer', width: '120px',
    transition: 'transform 0.3s ease' },
  catIcon: { fontSize: '40px', marginBottom: '10px' },
  catName: { fontSize: '14px', color: '#333',
    fontWeight: 'bold', margin: 0 },
  footer: { background: '#333', padding: '20px',
    textAlign: 'center' },
  footerText: { color: '#888', margin: 0, fontSize: '14px' }
}

export default Landing