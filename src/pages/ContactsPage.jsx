import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from "react";
import Header from "../components/Header";
import ContactList from "../components/ContactList";
import Footer from "../components/Footer";
import ContactSelected from "../components/ContactSelected";
import Filters from "../components/Filters";

import InitializeApp from "../utils/Initializer";
import SplashScreen from "../components/SplashScreen";
import { contactService } from "../services/contactService";
import { Toaster, toast } from "sonner";
import { useContactHistory, CONTACT_ACTIONS } from '../hooks/useContactHistory';

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

export default function ContactsPage() {
  const navigate = useNavigate();
  const { addAction } = useContactHistory();
  
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
  
  // Cargar contactos automáticamente al montar el componente (HU3 - Lab 08)
  useEffect(() => {
    const loadContactsAutomatically = async () => {
      setIsLoadingFromAPI(true);
      
      // Primero intentar cargar desde localStorage automáticamente
      console.log('🔄 Cargando contactos automáticamente desde localStorage...');
      const savedContacts = safeLocalStorage.getItem('contacts', []);
      
      if (savedContacts && savedContacts.length > 0) {
        // Si hay contactos en localStorage, cargarlos automáticamente
        setContacts(savedContacts);
        console.log(`📱 ${savedContacts.length} contacts loaded automatically from localStorage`);
        
        toast.success(`📱 ${savedContacts.length} contacts loaded automatically from localStorage`, {
          duration: 3000
        });
        
        setIsLoadingFromAPI(false);
        setIsInitializing(false);
        return;
      }
      
      // Si no hay contactos en localStorage, intentar cargar desde la API
      try {
        console.log('🔄 No hay contactos en localStorage, intentando cargar desde la API...');
        const { contacts: apiContacts } = await contactService.fetchContacts();
        if (apiContacts && apiContacts.length > 0) {
          setContacts(apiContacts);
          console.log(`✅ ${apiContacts.length} contacts loaded from API`);
          
          toast.success(`🌐 ${apiContacts.length} contacts loaded from API`, {
            duration: 7000
          });
        }
      } catch (error) {
        console.error('❌ Error loading contacts from API:', error);
        
        // Usar contactos predeterminados si no hay nada guardado y falla la API
        console.log('🏠 Using default contacts');
        toast.info("🏠 Using default contacts", {
          duration: 3000
        });
      } finally {
        setIsLoadingFromAPI(false);
        setIsInitializing(false);
      }
    };
    
    loadContactsAutomatically();
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
      // Mostrar notificación de guardado exitoso con Sonner (opcional)
      toast.success("✅ Contacts obtained", {
        duration: 1500
      });
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

  // Función para manejar la edición de un contacto
  const handleEditContact = (contact) => {
    navigate(`/contacts/edit/${contact.id}`);
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
  

  
  /**
   * Función para eliminar un contacto
   * Implementa la integración con el Service Layer para eliminar contactos
   * @param {Object} contact - Contacto a eliminar
   */
  const handleDeleteContact = async (contact) => {
    // Mostrar confirmación antes de eliminar
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${contact.name}?`)) {
      return;
    }
    
    try {
      // Llamar al método deleteContact del servicio
      const success = await contactService.deleteContact(contact.id);
      
      if (success) {
        // Registrar la acción en el historial
        addAction(CONTACT_ACTIONS.DELETE, contact.name, contact.id, 'Contact deleted successfully');
        
        // Actualizar el estado local
        const updatedContacts = contacts.filter(c => c.id !== contact.id);
        setContacts(updatedContacts);
        
        // Si el contacto eliminado era el seleccionado, deseleccionarlo
        if (selectContact && selectContact.id === contact.id) {
          setSelectContact(null);
        }
        
        // Mostrar notificación de éxito
        toast.success(`Contact ${contact.name} deleted successfully`, {
          duration: 3000
        });
      }
    } catch (error) {
      console.error('❌ Error deleting contact:', error);
      
      // Mostrar notificación de error
      toast.error(`Error deleting contact: ${error.message}`, {
        duration: 5000
      });
    }
  };

  /**
   * Función para agregar un contacto
   * Implementa la integración con el Service Layer para crear contactos
   * @param {Object} contactData - Datos del contacto a crear
   */
  const handleAddContact = async (contactData) => {
    try {
      // Agregar nuevo contacto
      const newContactData = {
        ...contactData,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Llamar al método createContact del servicio
      const createdContact = await contactService.createContact(newContactData);
      
      // Si la API devuelve el contacto creado, usarlo; de lo contrario, crear uno con ID local
      const newContact = createdContact || {
        ...newContactData,
        id: Date.now() // Usar timestamp como ID único si la API no devuelve un ID
      };
      
      setContacts([...contacts, newContact]);
      
      // Seleccionar automáticamente el nuevo contacto
      setSelectContact(newContact);
      
      // Mostrar notificación temporal con Sonner
      toast.success(`✅ ${newContact.name} added successfully`, {
        duration: 3000
      });
      
      // Retornar el contacto creado para navegación programática
      return newContact;
    } catch (error) {
      console.error('❌ Error adding contact:', error);
      
      // Si falla la creación en la API, agregarlo localmente de todos modos
      const localContact = {
        ...contactData,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: Date.now()
      };
      
      setContacts([...contacts, localContact]);
      setSelectContact(localContact);
      
      // Mostrar notificación de advertencia
      toast.warning(`Contact ${localContact.name} added locally. Error in API: ${error.message}`, {
        duration: 5000
      });
      
      // Retornar el contacto creado localmente para navegación programática
      return localContact;
    }
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
      const category = contact.category || 'no category';
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
      
      toast.success("✅ Data exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("❌ Error exporting data");
    }
  };
  
  // Función para guardar contactos manualmente en LocalStorage (HU1 - Lab 08)
  const handleSaveContactsToLocalStorage = () => {
    try {
      // Usar localStorage.setItem() con JSON.stringify() según los criterios de aceptación
      localStorage.setItem('contacts', JSON.stringify(contacts));
      
      // Mostrar notificación de éxito
      toast.success(`✅ ${contacts.length} contacts saved to LocalStorage manually`, {
        duration: 3000
      });
      
      console.log('📱 Contacts saved manually to LocalStorage:', contacts.length);
    } catch (error) {
      console.error('❌ Error saving contacts to LocalStorage:', error);
      toast.error('❌ Error saving contacts to LocalStorage');
    }
  };

  // Función para cargar contactos manualmente desde LocalStorage (HU2 - Lab 08)
  const handleLoadContactsFromLocalStorage = () => {
    try {
      // Usar localStorage.getItem() con JSON.parse() según los criterios de aceptación
      const savedContacts = localStorage.getItem('contacts');
      
      if (savedContacts) {
        const parsedContacts = JSON.parse(savedContacts);
        
        if (Array.isArray(parsedContacts) && parsedContacts.length > 0) {
          setContacts(parsedContacts);
          
          // Limpiar contacto seleccionado al cargar nuevos datos
          setSelectContact(null);
          
          // Mostrar notificación de éxito
          toast.success(`✅ ${parsedContacts.length} contacts loaded from LocalStorage`, {
            duration: 3000
          });
          
          console.log('📱 Contacts loaded manually from LocalStorage:', parsedContacts.length);
        } else {
          toast.warning('⚠️ No valid contacts found in LocalStorage');
        }
      } else {
        toast.info('ℹ️ No contacts found in LocalStorage');
      }
    } catch (error) {
      console.error('❌ Error loading contacts from LocalStorage:', error);
      toast.error('❌ Error loading contacts from LocalStorage');
    }
  };

  // Función para sincronizar datos entre API y LocalStorage (HU4 - Lab 08)
  const handleSyncDataFromAPI = async () => {
    try {
      setIsLoadingFromAPI(true);
      console.log('🔄 Iniciando sincronización de datos desde la API...');
      
      // Obtener contactos desde la API
      const { contacts: apiContacts } = await contactService.fetchContacts();
      
      if (apiContacts && Array.isArray(apiContacts) && apiContacts.length > 0) {
        // Guardar automáticamente en LocalStorage
        localStorage.setItem('contacts', JSON.stringify(apiContacts));
        
        // Actualizar el estado
        setContacts(apiContacts);
        setSelectContact(null);
        
        toast.success(`🔄 Sincronización exitosa: ${apiContacts.length} contactos actualizados desde la API`, {
          duration: 4000
        });
        console.log('✅ Sincronización completada. Contactos obtenidos:', apiContacts.length);
      } else {
        toast.warning('⚠️ No se obtuvieron contactos desde la API', {
          duration: 3000
        });
        console.log('⚠️ La API no devolvió contactos válidos');
      }
    } catch (error) {
      console.error('❌ Error durante la sincronización:', error);
      toast.error(`❌ Error al sincronizar datos desde la API: ${error.message}`, {
        duration: 5000
      });
    } finally {
      setIsLoadingFromAPI(false);
    }
  };

  // Función para eliminar todos los contactos de LocalStorage (Logro Adicional)
  const handleClearLocalStorage = () => {
    try {
      // Confirmar la acción con el usuario
      const confirmDelete = window.confirm(
        '⚠️ ¿Estás seguro de que deseas eliminar TODOS los contactos del LocalStorage?\n\nEsta acción no se puede deshacer.'
      );
      
      if (confirmDelete) {
        // Eliminar contactos de LocalStorage
        localStorage.removeItem('contacts');
        
        // Limpiar el estado de la aplicación
        setContacts([]);
        setSelectContact(null);
        
        toast.success('🗑️ Todos los contactos han sido eliminados del LocalStorage');
        console.log('✅ LocalStorage limpiado - Todos los contactos eliminados');
      } else {
        toast.info('ℹ️ Operación cancelada');
        console.log('Operación de eliminación cancelada por el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar contactos del LocalStorage:', error);
      toast.error('❌ Error al eliminar contactos del LocalStorage');
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
            
            toast.success(`✅ ${importedData.contacts.length} contacts imported`);
          } else {
            throw new Error("Invalid data format");
          }
        } catch (parseError) {
          console.error("Error parsing imported data:", parseError);
          toast.error("❌ Invalid file format");
        }
        
        // Limpiar el input file
        event.target.value = null;
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing data:", error);
      toast.error("❌ Error importing data");
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
      
      {/* Componente Toaster de Sonner */}
      <Toaster position="top-right" richColors />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        {/* Navegación */}
        <nav className="px-4 py-2">
          <div className="container mx-auto">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </nav>
        
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
            onDeleteContact={handleDeleteContact}
            setContacts={setContacts}
          />
            </div>
            
            <div className="space-y-6">
              {/* Botones para exportar/importar datos y guardar en LocalStorage */}
              <div className="flex gap-4 flex-wrap">
                {/* Botón Guardar Contactos - HU1 Lab 08 */}
                <button 
                  onClick={handleSaveContactsToLocalStorage}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg transition-all font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Guardar Contactos
                </button>
                
                {/* Botón Cargar Contactos - HU2 Lab 08 */}
                <button 
                  onClick={handleLoadContactsFromLocalStorage}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg transition-all font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Cargar Contactos
                </button>
                
                {/* Botón Sincronizar Datos - HU4 Lab 08 */}
                <button 
                  onClick={handleSyncDataFromAPI}
                  disabled={isLoadingFromAPI}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white text-sm py-2 px-4 rounded-lg transition-all font-medium"
                >
                  {isLoadingFromAPI ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  {isLoadingFromAPI ? 'Sincronizando...' : 'Sincronizar Datos'}
                </button>
                
                {/* Botón Eliminar Todo - Logro Adicional */}
                <button 
                  onClick={handleClearLocalStorage}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg transition-all font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar Todo
                </button>
                
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
                  onDeleteContact={handleDeleteContact} // Añadimos la función para eliminar contactos
                  onEditContact={handleEditContact} // Añadimos la función para editar contactos
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
