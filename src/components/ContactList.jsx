import { useState, useEffect } from "react";
import ContactCard from "./ContactCard";
import { contactService } from "../services/contactService";


const ContactList = ({
  contactsToShow,
  toggleFavorite,
  handleSelectContact,
  handleNextContact,
  selectContact,
  searchTerm,
  onEditContact,
  onDeleteContact, // Añadimos la función para eliminar contactos
  setContacts, // Añadimos setContacts para actualizar el estado en App.jsx
}) => {
  // Estados para el fetch usando Service Layer
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Reto Autónomo 2A: Contador de fetches
  const [fetchCount, setFetchCount] = useState(0);
  // Reto Autónomo 2B: Timestamp de última carga exitosa
  const [lastFetchTime, setLastFetchTime] = useState(null);
  // Estado para mostrar estadísticas del servicio
  const [showStats, setShowStats] = useState(false);
  // Estado para almacenar metadata de la última respuesta
  const [responseMetadata, setResponseMetadata] = useState(null);
  // Estado para almacenar estadísticas del servicio
  const [serviceStats, setServiceStats] = useState(null);
  
  /**
   * Función asíncrona para obtener contactos usando el Service Layer
   * Esta implementación usa contactService en lugar de fetch directo
   */
  async function fetchContactsDirectly() {
    setIsLoading(true);
    setError(null);
    setShowStats(false);
    
    try {
      // Usar el servicio en lugar de fetch directo
      const { contacts, metadata } = await contactService.fetchContacts();
      
      // Actualizar el estado de contactos en el componente padre
      setContacts(contacts);
      
      // Guardar metadata para mostrarla en UI
      setResponseMetadata(metadata);
      
      // Actualizar contador de fetches (Reto Autónomo 2A)
      setFetchCount(prevCount => prevCount + 1);
      
      // Actualizar timestamp de última carga exitosa (Reto Autónomo 2B)
      setLastFetchTime(metadata.timestamp.toLocaleString());
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  /**
   * Función para buscar contactos usando el Service Layer
   * Implementación del Reto Autónomo 3A
   */
  async function searchContactsByName(query) {
    if (!query.trim()) {
      return fetchContactsDirectly();
    }
    
    setIsLoading(true);
    setError(null);
    setShowStats(false);
    
    try {
      // Usar el método de búsqueda del servicio
      const { contacts, metadata } = await contactService.searchContacts(query);
      
      // Actualizar el estado de contactos en el componente padre
      setContacts(contacts);
      
      // Guardar metadata para mostrarla en UI
      setResponseMetadata(metadata);
      
      // Actualizar contador de fetches
      setFetchCount(prevCount => prevCount + 1);
      
      // Actualizar timestamp de última carga exitosa
      setLastFetchTime(metadata.timestamp.toLocaleString());
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  /**
   * Función para mostrar estadísticas del servicio
   */
  function toggleServiceStats() {
    // Si ya estamos mostrando las estadísticas, ocultarlas
    if (showStats) {
      setShowStats(false);
      return;
    }
    
    // Obtener estadísticas actualizadas del servicio
    const stats = contactService.getStats();
    setServiceStats(stats);
    setShowStats(true);
  }
  return (
    <section className="w-full h-[calc(120vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400/20 scrollbar-track-transparent">
      {/* Barra de acciones con botones para interactuar con el Service Layer */}
      <div className="flex justify-between items-center mb-4 p-2">
        <div className="flex gap-2">
          <button 
            onClick={fetchContactsDirectly}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>📡 Cargar Contactos</span>
            {isLoading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </button>
          
          {/* Botón para buscar contactos por nombre (Reto Autónomo 3A) */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar por nombre..." 
              className="bg-slate-800 text-white border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && searchContactsByName(e.target.value)}
            />
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              onClick={(e) => searchContactsByName(e.target.previousElementSibling.value)}
            >
              🔍
            </button>
          </div>
          
          {/* Botón para mostrar estadísticas del servicio */}
          <button 
            onClick={toggleServiceStats}
            className={`${showStats ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white font-medium py-2 px-4 rounded-lg transition-colors`}
          >
            📊 {showStats ? 'Ocultar Stats' : 'Ver Stats'}
          </button>
        </div>
      </div>
      
      {/* Panel de estadísticas del servicio */}
      {showStats && serviceStats && (
        <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl border border-purple-700/50 p-4 mb-4 text-white">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <span className="text-purple-300">📊</span> Estadísticas del Service Layer
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-purple-800/50 p-3 rounded-lg">
              <div className="text-sm text-purple-300">Total Requests</div>
              <div className="text-2xl font-bold">{serviceStats.totalRequests}</div>
            </div>
            <div className="bg-green-800/50 p-3 rounded-lg">
              <div className="text-sm text-green-300">Exitosos</div>
              <div className="text-2xl font-bold">{serviceStats.successfulRequests}</div>
            </div>
            <div className="bg-red-800/50 p-3 rounded-lg">
              <div className="text-sm text-red-300">Fallidos</div>
              <div className="text-2xl font-bold">{serviceStats.failedRequests}</div>
            </div>
            <div className="bg-blue-800/50 p-3 rounded-lg">
              <div className="text-sm text-blue-300">Última Petición</div>
              <div className="text-lg font-bold">{serviceStats.lastRequestTime}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Estado de carga */}
      {isLoading && (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8 text-center animate-pulse">
          <div className="text-slate-400 mb-3 text-5xl">🔄</div>
          <h3 className="text-white text-lg font-medium mb-2">Cargando contactos desde API...</h3>
          <p className="text-slate-400 text-sm">Por favor espera mientras obtenemos tus contactos</p>
        </div>
      )}
      
      {/* Estado de error */}
      {error && !isLoading && (
        <div className="bg-red-900/30 backdrop-blur-sm rounded-xl border border-red-700/50 p-8 text-center">
          <div className="text-red-400 mb-3 text-5xl">⚠️</div>
          <h3 className="text-white text-lg font-medium mb-2">Error al cargar contactos</h3>
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchContactsDirectly}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}
      
      {/* Sin contactos (pero sin error ni cargando) */}
      {contactsToShow.length === 0 && !isLoading && !error && (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8 text-center">
          <div className="text-slate-400 mb-3 text-5xl">📋</div>
          <h3 className="text-white text-lg font-medium mb-2">No hay contactos cargados</h3>
          <p className="text-slate-400 text-sm mb-4">Haz clic en Cargar Contactos para obtener datos desde la API</p>
        </div>
      )}
      
      {/* Lista de contactos */}
      {contactsToShow.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-2">
          {contactsToShow.map((contact) => (
            <div 
              key={contact.id} 
              onClick={() => handleSelectContact(contact)}
              className="cursor-pointer transition-transform hover:-translate-y-1"
            >
              <ContactCard
                contact={contact}
                toggleFavorite={toggleFavorite}
                handleNextContact={handleNextContact}
                selectContact={selectContact}
                searchTerm={searchTerm}
                onEdit={onEditContact}
                onDelete={onDeleteContact} // Pasamos la función para eliminar contactos
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ContactList;
