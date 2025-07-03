export default function ContactCard({contact, toggleFavorite}) {
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
      }}>{contact?.name} {contact?.isFavorite ?
        <button
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
          onClick={() => toggleFavorite(contact.id)}
        >
          ⭐
        </button> :
        <button
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
          onClick={() => toggleFavorite(contact.id)}
        >
          ⚝
        </button>
      }</h3>
      <p>📱 Phone: {contact?.phone}</p>
      <p>✉️ Email: {contact?.email}</p>
      {/* <button onClick={() => toggleFavorite(contact.id)}>
        ⭐
        {contact.isFavorite ? "Quit Favorite" : "Add Favorite"}
      </button> */}
    </div>
  );
}