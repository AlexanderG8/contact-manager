export default function ContactCard({contact, toggleFavorite, handleNextContact, selectContact}) {
  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      maxWidth: '300px',
      margin: '10px',
      background: selectContact?.id === contact.id ? '#3ada49' : '#333',
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
      <button
        style={{
          background: 'none',
          border: 'none',
          padding: '8px',
          cursor: 'pointer',
          fontSize: '1.2rem',
          display: 'block',
          marginTop: '10px'
        }}
        onClick={() => {handleNextContact(contact)}}
      >
        Next
      </button>
    </div>
  );
}