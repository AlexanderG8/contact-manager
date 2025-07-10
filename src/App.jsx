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
    <div className="min-h-screen w-full bg-[#020617] relative">
      {/* Magenta Orb Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px), 
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Filters
            showOnlyFavorites={showOnlyFavorites}
            handleChangeFavorite={handleChangeFavorite}
            handleChangeAllFavorite={handleChangeAllFavorite}
            contacts={contacts}
            handlerClearContacts={handlerClearContacts}
            handleNextContact={handleNextContact}
          />
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white/90">Contacts</h2>
              <ContactList
                contactsToShow={contactsToShow}
                toggleFavorite={toggleFavorite}
                handleSelectContact={handleSelectContact}
                handleNextContact={handleNextContact}
                selectContact={selectContact}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white/90">Add New Contact</h2>
              <ContactForm handleAddContact={handleAddContact} />
              
              <div className="mt-8">
                <h2 className="text-xl font-bold text-white/90 mb-4">Selected Contact</h2>
                <ContactSelected
                  selectContact={selectContact}
                  toggleFavorite={toggleFavorite}
                  handleNextContact={handleNextContact}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
