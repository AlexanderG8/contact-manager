import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import ContactCard from "./components/ContactCard";
import Footer from "./components/Footer";
import ContactSelected from "./components/ContactSelected";
import Filters from "./components/Filters";
import ContactForm from "./components/ContactForm";

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
    alert("Contacto Selecionado" + " " + contact.name);
    setSelectContact(contact);
  };

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

  function handlerClearContacts() {
    setSelectContact(null);
    setShowOnlyFavorites(false);
  }

  const handleNextContact = (selectContact) => {
    // buscar el índice del contacto seleccionado
    const currentIndex = contactsToShow.findIndex(
      (contact) => contact.id === selectContact.id
    );

    // si el contacto seleccionado es el último, seleccionar el primero
    if (currentIndex === contactsToShow.length - 1) {
      setSelectContact(contactsToShow[0]);
      return;
    }

    // seleccionar el siguiente contacto
    setSelectContact(contactsToShow[currentIndex + 1]);
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
        };
      });
    } else {
      updateContacts = contacts.map((contact) => {
        return {
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          isFavorite: false,
        };
      });
    }
    const favoriteContact = updateContacts.find(
      (contact) => contact.isFavorite
    );
    if (favoriteContact) {
      setSelectContact(favoriteContact);
    } else {
      setSelectContact(null);
    }
    setContacts(updateContacts);
  };

  // Función para manejar el cambio de estado de favoritos
  function toggleFavorite(id) {
    const updateContacts = contacts.map((contact) => {
      return {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        isFavorite:
          contact.id === id ? !contact.isFavorite : contact.isFavorite,
      };
    });

    if (selectContact.id === id) {
      setSelectContact({
        id: selectContact.id,
        name: selectContact.name,
        phone: selectContact.phone,
        email: selectContact.email,
        isFavorite: !selectContact.isFavorite,
      });
    }
    setContacts(updateContacts);
  }

  const handleAddContact = (newContact) => {
    // Logica para agregar un nuevo contacto a la lista
    // utilizamos el spread operator para crear una copia de la lista de contactos
    // y agregar el nuevo contacto al final
    setContacts([
      ...contacts,
      {
        id: contacts.length + 1,
        name: newContact.name,
        phone: newContact.phone,
        email: newContact.email,
        isFavorite: false,
      },
    ]);
  };

  return (
    <>
      <div>
        <Header />
        <main>
          <ContactForm 
          handleAddContact = {handleAddContact}
          />
          <Filters
            showOnlyFavorites={showOnlyFavorites}
            handleChangeFavorite={handleChangeFavorite}
            handleChangeAllFavorite={handleChangeAllFavorite}
            contacts={contacts}
            handlerClearContacts={handlerClearContacts}
            handleNextContact={handleNextContact}
          />
          <ContactList
            contactsToShow={contactsToShow}
            toggleFavorite={toggleFavorite}
            handleSelectContact={handleSelectContact}
            handleNextContact={handleNextContact}
            selectContact={selectContact}
          />
          <ContactSelected
            selectContact={selectContact}
            toggleFavorite={toggleFavorite}
            handleNextContact={handleNextContact}
          />
          <Footer />
        </main>
      </div>
    </>
  );
}

export default App;
