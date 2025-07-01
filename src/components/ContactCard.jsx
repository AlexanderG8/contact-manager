export default function ContactCard() {
  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      maxWidth: '300px',
      margin: '10px'
    }}>
      <h3 style={{
        color: '#f6f8fa',
        marginTop: 0,
        marginBottom: '15px',
        fontSize: '1.5rem'
      }}>Mi Primer Contacto</h3>
      <p>📱 Teléfono: 555-1234</p>
      <p>✉️ Email: contacto@email.com</p>
    </div>
  );
}