import "./App.css";
import { useState, useMemo, useEffect } from "react";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import ContactCard from "./components/ContactCard";
import Footer from "./components/Footer";
import ContactSelected from "./components/ContactSelected";
import Filters from "./components/Filters";
import ContactForm from "./components/ContactForm";
import InitializeApp from "./utils/Initializer";
import SplashScreen from "./components/SplashScreen";
import { fetchContacts } from "./services/contactService";

// Función para guardar datos en localStorage con manejo de errores (Reto Final 2)
const safeLocalStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  },
  getItem: (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  }
};

function App() {
  // Hook para manejar el estado del contacto seleccionado
  const [selectContact, setSelectContact] = useState(null);
  // Hook para manejar el estado de mostrar solo favoritos
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  // Hook para manejar el estado de búsqueda (Reto Extra 1)
  const [searchTerm, setSearchTerm] = useState("");
  // Hook para manejar el estado de ordenamiento (Reto Extra 2)
  const [sortOption, setSortOption] = useState("default"); // default, az, za, favorites, recent
  // Hook para manejar el filtro por categoría (Reto Final 1)
  const [categoryFilter, setCategoryFilter] = useState("all"); // all, trabajo, personal, familia
  // Hook para manejar el inizialización de la aplicación
  const [isInitializing, setIsInitializing] = useState(true);
  // Estado para manejar la carga desde la API
  const [isLoadingFromAPI, setIsLoadingFromAPI] = useState(false);
  
  // Hook para manejar la notificación temporal (Reto Autónomo 2)
  const [notification, setNotification] = useState({
    show: false,
    message: ""
  });
  
  // Estado para el modo de edición (Reto Final 3)
  const [editingContact, setEditingContact] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'

  // Hook para manejar el estado de los contactos con carga desde localStorage (Reto Final 2)
  const [contacts, setContacts] = useState(() => {
    // Intentar cargar contactos desde localStorage
    const savedContacts = safeLocalStorage.getItem('contacts', []);
    
    // Si hay contactos guardados, usarlos; de lo contrario, usar los predeterminados
    if (savedContacts && savedContacts.length > 0) {
      return savedContacts;
    }
    
    // Contactos predeterminados
    return [
      {
        id: 1,
        name: "Alexander Gomez",
        phone: "998776123",
        email: "prueba@gmail.com",
        category: "trabajo",
        isFavorite: false,
        createdAt: new Date('2025-07-09').toISOString(),
        updatedAt: new Date('2025-07-09').toISOString()
      },
      {
        id: 2,
        name: "Nicolle Gomez",
        phone: "987123654",
        email: "prueba2@gmail.com",
        category: "personal",
        isFavorite: false,
        createdAt: new Date('2025-07-09').toISOString(),
        updatedAt: new Date('2025-07-09').toISOString()
      },
      {
        id: 3,
        name: "Magy Gomez",
        phone: "912345876",
        email: "prueba3@gmail.com",
        category: "familia",
        isFavorite: false,
        createdAt: new Date('2025-07-09').toISOString(),
        updatedAt: new Date('2025-07-09').toISOString()
      },
    ];
  });
  
  // Cargar contactos desde la API al inicializar la aplicación
  useEffect(() => {
    const loadContactsFromAPI = async () => {
      setIsLoadingFromAPI(true);
      try {
        console.log('🔄 Intentando cargar contactos desde la API...');
        const apiContacts = await fetchContacts();
        if (apiContacts && apiContacts.length > 0) {
          // Transformar los contactos de la API al formato esperado
          const transformedContacts = apiContacts.map((contact, index) => ({
            id: contact.id || Date.now() + index,
            name: contact.fullname,
            phone: contact.phonenumber || 'Sin teléfono',
            email: contact.email || 'Sin email',
            category: contact.type || 'personal', // Asignar categoría por defecto
            isFavorite: contact.isFavorite || false,
            createdAt: contact.createdAt || new Date().toISOString(),
            updatedAt: contact.updatedAt || new Date().toISOString()
          }));
          
          setContacts(transformedContacts);
          console.log(`✅ ${transformedContacts.length} contactos cargados desde la API`);
          
          // Mostrar notificación de éxito
          setNotification({
            show: true,
            message: `🌐 ${transformedContacts.length} contactos cargados desde la API`
          });
          
          setTimeout(() => {
            setNotification({ show: false, message: "" });
          }, 7000);
        }
      } catch (error) {
        console.error('❌ Error al cargar contactos desde la API:', error);
        
        // Intentar cargar desde localStorage como fallback
        const savedContacts = safeLocalStorage.getItem('contacts', []);
        if (savedContacts && savedContacts.length > 0) {
          setContacts(savedContacts);
          console.log('📱 Contactos cargados desde localStorage como fallback');
          
          setNotification({
            show: true,
            message: "📱 Contactos cargados desde almacenamiento local"
          });
        } else {
          // Usar contactos predeterminados si no hay nada guardado
          console.log('🏠 Usando contactos predeterminados');
          setNotification({
            show: true,
            message: "🏠 Usando contactos de ejemplo"
          });
        }
        
        setTimeout(() => {
          setNotification({ show: false, message: "" });
        }, 3000);
      } finally {
        setIsLoadingFromAPI(false);
        setIsInitializing(false);
      }
    };
    
    loadContactsFromAPI();
  }, []);
  
  // Cargar configuraciones de usuario desde localStorage (Reto Final 2)
  useEffect(() => {
    const savedSettings = safeLocalStorage.getItem('settings', null);
    if (savedSettings) {
      setSortOption(savedSettings.sortBy || "default");
      setCategoryFilter(savedSettings.filterCategory || "all");
      setShowOnlyFavorites(savedSettings.showOnlyFavorites || false);
    }
  }, []);
  
  // Guardar contactos en localStorage cuando cambien (Reto Final 2)
  useEffect(() => {
    const saveSuccess = safeLocalStorage.setItem('contacts', contacts);
    
    if (saveSuccess) {
      // Mostrar notificación de guardado exitoso (opcional)
      setNotification({
        show: true,
        message: "✅ Cambios guardados automáticamente"
      });
      
      setTimeout(() => {
        setNotification({
          show: false,
          message: ""
        });
      }, 1500);
    }
  }, [contacts]);
  
  // Guardar configuraciones en localStorage cuando cambien (Reto Final 2)
  useEffect(() => {
    safeLocalStorage.setItem('settings', {
      sortBy: sortOption,
      filterCategory: categoryFilter,
      showOnlyFavorites: showOnlyFavorites,
      lastBackup: new Date().toISOString()
    });
  }, [sortOption, categoryFilter, showOnlyFavorites]);

  // Función para filtrar y ordenar contactos
  const contactsToShow = useMemo(() => {
    // Paso 1: Filtrar por favoritos si es necesario
    let filteredContacts = showOnlyFavorites 
      ? contacts.filter((contact) => contact.isFavorite)
      : [...contacts];
    
    // Paso 2: Filtrar por categoría (Reto Final 1)
    if (categoryFilter !== "all") {
      filteredContacts = filteredContacts.filter((contact) => 
        contact.category === categoryFilter
      );
    }
    
    // Paso 3: Filtrar por término de búsqueda (Reto Extra 1)
    if (searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase();
      filteredContacts = filteredContacts.filter((contact) => 
        contact.name.toLowerCase().includes(searchTermLower) || 
        contact.phone.toLowerCase().includes(searchTermLower) || 
        contact.email.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Paso 3: Ordenar según la opción seleccionada (Reto Extra 2)
    switch (sortOption) {
      case "az":
        // Ordenar alfabéticamente A-Z
        filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        // Ordenar alfabéticamente Z-A
        filteredContacts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "favorites":
        // Ordenar por favoritos primero, luego alfabéticamente
        filteredContacts.sort((a, b) => (b.isFavorite - a.isFavorite) || a.name.localeCompare(b.name));
        break;
      case "recent":
        // Ordenar por fecha de creación (más recientes primero)
        filteredContacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // No hacer nada, mantener el orden original
        break;
    }
    
    return filteredContacts;
  }, [contacts, showOnlyFavorites, categoryFilter, searchTerm, sortOption]);

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
          category: contact.category,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
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
          category: contact.category,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
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
      if (contact.id === id) {
        return {
          ...contact,
          isFavorite: !contact.isFavorite,
          updatedAt: new Date().toISOString()
        };
      }
      return contact;
    });

    if (selectContact && selectContact.id === id) {
      setSelectContact({
        ...selectContact,
        isFavorite: !selectContact.isFavorite,
        updatedAt: new Date().toISOString()
      });
    }
    setContacts(updateContacts);
  }
  
  // Función para iniciar la edición de un contacto (Reto Final 3)
  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setFormMode('edit');
    
    // Opcional: hacer scroll al formulario
    const formElement = document.querySelector('#contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Función para cancelar la edición (Reto Final 3)
  const handleCancelEdit = () => {
    setEditingContact(null);
    setFormMode('create');
  };

  const handleAddContact = (contactData, mode = 'create') => {
    if (mode === 'edit' && editingContact) {
      // Modo edición: actualizar contacto existente
      const updatedContacts = contacts.map(contact => {
        if (contact.id === contactData.id) {
          return {
            ...contactData,
            updatedAt: new Date().toISOString()
          };
        }
        return contact;
      });
      
      setContacts(updatedContacts);
      setSelectContact({
        ...contactData,
        updatedAt: new Date().toISOString()
      });
      
      // Mostrar notificación temporal
      setNotification({
        show: true,
        message: `✅ ${contactData.name} actualizado correctamente`
      });
      
      // Limpiar estado de edición
      setEditingContact(null);
      setFormMode('create');
    } else {
      // Modo creación: agregar nuevo contacto
      const newContactWithId = {
        ...contactData,
        id: Date.now(), // Usar timestamp como ID único
        isFavorite: false
      };
      
      setContacts([...contacts, newContactWithId]);
      
      // Seleccionar automáticamente el nuevo contacto
      setSelectContact(newContactWithId);
      
      // Mostrar notificación temporal
      setNotification({
        show: true,
        message: `✅ ${contactData.name} agregado a tus contactos`
      });
    }
    
    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      setNotification({
        show: false,
        message: ""
      });
    }, 3000);
  };
  
  // Función para manejar el cambio en la búsqueda (Reto Extra 1)
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };
  
  // Función para manejar el cambio en el ordenamiento (Reto Extra 2)
  const handleSortChange = (option) => {
    setSortOption(option);
  };
  
  // Función para manejar el cambio en el filtro de categoría (Reto Final 1)
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };
  
  // Calcular contadores por categoría (Reto Final 1)
  const categoryCounts = useMemo(() => {
    return contacts.reduce((counts, contact) => {
      const category = contact.category || 'sin_categoria';
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    }, {});
  }, [contacts]);
  
  // Función para exportar datos (Reto Final 2 - opcional)
  const handleExportData = () => {
    try {
      const dataToExport = {
        contacts,
        settings: {
          sortBy: sortOption,
          filterCategory: categoryFilter,
          showOnlyFavorites,
          exportDate: new Date().toISOString()
        }
      };
      
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `contacts_backup_${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setNotification({
        show: true,
        message: "✅ Datos exportados correctamente"
      });
      
      setTimeout(() => {
        setNotification({
          show: false,
          message: ""
        });
      }, 3000);
    } catch (error) {
      console.error("Error exporting data:", error);
      setNotification({
        show: true,
        message: "❌ Error al exportar datos"
      });
      
      setTimeout(() => {
        setNotification({
          show: false,
          message: ""
        });
      }, 3000);
    }
  };
  
  // Función para importar datos (Reto Final 2 - opcional)
  const handleImportData = (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          if (importedData.contacts && Array.isArray(importedData.contacts)) {
            setContacts(importedData.contacts);
            
            if (importedData.settings) {
              setSortOption(importedData.settings.sortBy || "default");
              setCategoryFilter(importedData.settings.filterCategory || "all");
              setShowOnlyFavorites(importedData.settings.showOnlyFavorites || false);
            }
            
            setNotification({
              show: true,
              message: `✅ ${importedData.contacts.length} contactos importados`
            });
          } else {
            throw new Error("Invalid data format");
          }
        } catch (parseError) {
          console.error("Error parsing imported data:", parseError);
          setNotification({
            show: true,
            message: "❌ Formato de archivo inválido"
          });
        }
        
        // Limpiar el input file
        event.target.value = null;
        
        setTimeout(() => {
          setNotification({
            show: false,
            message: ""
          });
        }, 3000);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing data:", error);
      setNotification({
        show: true,
        message: "❌ Error al importar datos"
      });
      
      setTimeout(() => {
        setNotification({
          show: false,
          message: ""
        });
      }, 3000);
    }
  };

  useEffect(() => {
    async function startApp(){
      const result = await InitializeApp(1000);
      setIsInitializing(result);
    }
    startApp();
  }, []);

  return (
    <>
    {(isInitializing || isLoadingFromAPI) ? <SplashScreen isLoading={isInitializing || isLoadingFromAPI}/> : (
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
      
      {/* Notificación temporal (Reto Autónomo 2) */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out flex items-center">
          <span className="mr-2">✅</span>
          {notification.message}
        </div>
      )}
      
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
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            sortOption={sortOption}
            handleSortChange={handleSortChange}
            categoryFilter={categoryFilter}
            handleCategoryChange={handleCategoryChange}
            categoryCounts={categoryCounts}
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
                searchTerm={searchTerm}
                onEditContact={handleEditContact}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white/90">
                {formMode === 'edit' ? 'Edit Contact' : 'Add New Contact'}
              </h2>
              <div id="contact-form">
                <ContactForm 
                  handleAddContact={handleAddContact} 
                  contacts={contacts} 
                  editingContact={editingContact}
                  formMode={formMode}
                  setFormMode={setFormMode}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
              
              {/* Botones para exportar/importar datos (Reto Final 2 - opcional) */}
              <div className="mt-6 flex gap-4">
                <button 
                  onClick={handleExportData}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 px-4 rounded-lg transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Data
                </button>
                
                <label className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 px-4 rounded-lg transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Import Data
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImportData} 
                    className="hidden" 
                  />
                </label>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-bold text-white/90 mb-4">Selected Contact</h2>
                <ContactSelected
                  selectContact={selectContact}
                  toggleFavorite={toggleFavorite}
                  handleNextContact={handleNextContact}
                  searchTerm={searchTerm}
                  onEditContact={handleEditContact}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
    )}
    </>
  );
}

export default App;
