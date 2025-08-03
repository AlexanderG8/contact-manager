import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#020617',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '3rem',
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #ec4899, #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>📞 Contact Manager</h1>
      <p style={{
        fontSize: '1.2rem',
        marginBottom: '2rem',
        color: '#94a3b8'
      }}>Application developed with ☕ & 🎧</p>
      
      <div style={{
        marginTop: '2rem'
      }}>
        <Link to="/contacts" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#ec4899',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
        }}>
          View Contacts
        </Link>
      </div>
    </div>
  );
}