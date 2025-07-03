export default function Header() {
  return (
    <header style={{
      backgroundColor: '#242424',
      padding: '20px',
      textAlign: 'center',
      borderBottom: '2px solid #ddd',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        color: '#f6f8fa',
        margin: '0 0 10px 0',
        fontSize: '2.5rem'
      }}>📞 Contact Manager</h1>
      <p style={{
        color: '#666',
        margin: 0,
        fontSize: '1.1rem'
      }}>My important contact ⭐</p>
    </header>
  );
}