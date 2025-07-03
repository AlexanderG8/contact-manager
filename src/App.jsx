import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import ContactCard from "./components/ContactCard";
import Footer from "./components/Footer";

function App() {
  // Hook para manejar el estado del contacto seleccionado
  const [selectContact, setSelectContact] = useState(null);
  // Hook para manejar el estado de mostrar solo favoritos
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Hook para manejar el estado de los contactos
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Alexander Gomez",
      phone: "998776123",
      email: "prueba@gmail.com",
      isFavorite: false,
    },
    {
      id: 2,
      name: "Nicolle Gomez",
      phone: "987123654",
      email: "prueba2@gmail.com",
      isFavorite: false,
    },
    {
      id: 3,
      name: "Magy Gomez",
      phone: "912345876",
      email: "prueba3@gmail.com",
      isFavorite: false,
    },
  ]);

  // Función para manejar el cambio de estado de mostrar solo favoritos
  let contactsToShow = contacts;

  if (showOnlyFavorites) {
    contactsToShow = contacts.filter((contact) => contact.isFavorite);
  }

  /**
   * Función para manejar el cambio de estado del contacto seleccionado
   * @param {Object} contact
   */
  const handleSelectContact = (contact) => {
    // console.log(contact);
    setSelectContact(contact);
  }

  // Función para manejar el cambio de estado de mostrar solo favoritos
  const handleChangeFavorite = (event) => {
    // console.log(event);
    setShowOnlyFavorites(event.target.checked);
    // Mostrar el primer favorito selecionado
    const favoriteContact = contacts.find((contact) => contact.isFavorite);
    if (favoriteContact) {
      setSelectContact(favoriteContact);
    } else {
      setSelectContact(null);
    }
  };

  const handleChangeAllFavorite = (event) => {
    // console.log(event);
    let updateContacts;
    if (event.target.checked) {
      updateContacts = contacts.map((contact) => {
        return {
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          isFavorite: true,
        }
      })
    }else{
      updateContacts = contacts.map((contact) => {
        return {
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          isFavorite: false,
        }
      })
    }
      const favoriteContact = updateContacts.find((contact) => contact.isFavorite);
      if (favoriteContact) {
        setSelectContact(favoriteContact);
      } else {
        setSelectContact(null);
      }
    setContacts(updateContacts);
  }

  // Función para manejar el cambio de estado de favoritos
  function toggleFavorite(id){
    const updateContacts = contacts.map((contact) => {
      return {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        isFavorite: contact.id === id ? !contact.isFavorite : contact.isFavorite
      }
    })

    if(selectContact.id === id){
      setSelectContact({
        id: selectContact.id,
        name: selectContact.name,
        phone: selectContact.phone,
        email: selectContact.email,
        isFavorite: !selectContact.isFavorite
      })
    }
    setContacts(updateContacts)
  }

  return (
    <>
      <div>
        <Header />
        <main>
          <section>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#b7b1b0',
              borderRadius: '8px',
              margin: '1rem 0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <input
                  type="checkbox"
                  id="showOnlyFavorites"
                  checked={showOnlyFavorites}
                  onChange={handleChangeFavorite}
                  style={{
                    cursor: 'pointer',
                    width: '18px',
                    height: '18px'
                  }}
                />
                <label
                  htmlFor="showOnlyFavorites"
                  style={{
                    fontSize: '0.9rem',
                    color: '#666'
                  }}
                >Show favorites</label>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <input
                  type="checkbox"
                  id="markAllFavorites"
                  onChange={handleChangeAllFavorite}
                  style={{
                    cursor: 'pointer',
                    width: '18px',
                    height: '18px'
                  }}
                />
                <label
                  htmlFor="markAllFavorites"
                  style={{
                    fontSize: '0.9rem',
                    color: '#666'
                  }}
                >Mark/Unmark favorites to all</label>
              </div>

              <label style={{
                marginLeft: 'auto',
                fontSize: '0.9rem',
                color: '#666',
                fontWeight: '500'
              }}>1 of {contacts.length} contacts</label>
            </div>
          </section>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            {contactsToShow.map((contact) => (
              <div key={contact.id} onClick={() => handleSelectContact(contact)}>
                <ContactList contact={contact} toggleFavorite={toggleFavorite} />
              </div>
            ))}
          </section>
          <section
            style={{
              justifyItems: "center",
              alignItems: "center"
            }}
            >
            {selectContact ? <h3>Contacto Selecionado</h3> : null}
            {selectContact ? <ContactCard contact={selectContact} toggleFavorite={toggleFavorite} /> : null}
          </section>
          <Footer />
        </main>
      </div>
    </>
  );
}

export default App;
