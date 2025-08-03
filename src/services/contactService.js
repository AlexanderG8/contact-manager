/**
 * ContactService - Implementación del patrón Service Layer para gestionar contactos
 * Esta clase encapsula toda la lógica de comunicación con la API y transformación de datos
 */
class ContactService {
  /**
   * Constructor de la clase ContactService
   * Inicializa la URL de la API y el contador de peticiones
   */
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL;
    this.requestCount = 0;
    this.lastRequestTime = null;
    this.successCount = 0;
    this.errorCount = 0;
  }

  /**
   * Obtiene todos los contactos desde la API
   * @returns {Promise<Object>} Objeto con los contactos y metadata
   */
  async fetchContacts() {
    this.requestCount++;
    console.log('🌐 Service Layer: Cargando contactos...');
    
    try {
      const startTime = performance.now();
      const response = await this._fetchWithRetry(this.apiUrl);
      const endTime = performance.now();
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const rawContacts = await response.json();
      const transformedContacts = this._transformContactsData(rawContacts);
      
      this.lastRequestTime = new Date();
      this.successCount++;
      
      console.log('✅ Service Layer: Contactos cargados:', transformedContacts.length);
      
      // Retornamos un objeto con los contactos y metadata adicional
      return {
        contacts: transformedContacts,
        metadata: {
          timestamp: this.lastRequestTime,
          count: transformedContacts.length,
          responseTime: Math.round(endTime - startTime),
          source: 'Service Layer Pattern'
        }
      };
      
    } catch (error) {
      console.error('❌ Service Layer: Error al cargar contactos:', error);
      this.errorCount++;
      throw error;
    }
  }
  
  /**
   * Implementación de retry automático para peticiones fetch
   * Reto Autónomo 3B: Si falla, espera 2 segundos y reintenta una vez
   * @param {string} url - URL a la que hacer la petición
   * @param {Object} options - Opciones para fetch
   * @returns {Promise<Response>} Respuesta del fetch
   */
  async _fetchWithRetry(url, options = {}) {
    try {
      // Aseguramos que siempre tenga headers con Content-Type
      const fetchOptions = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };
      
      return await fetch(url, fetchOptions);
    } catch (error) {
      console.log('⚠️ Service Layer: Error en fetch, reintentando en 2 segundos...');
      
      // Esperar 2 segundos antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reintentar una vez
      return await fetch(url, options);
    }
  }
  
  /**
   * Transforma los datos de contactos recibidos de la API al formato esperado por la aplicación
   * @param {Array} rawContacts - Contactos sin procesar desde la API
   * @returns {Array} Contactos transformados
   */
  _transformContactsData(rawContacts) {
    return rawContacts.map((contact, index) => ({
      id: contact.id || Date.now() + index,
      name: contact.fullname,
      // Formatear teléfono: si tiene 9 dígitos, formato XXX-XXX-XXX
      phone: this._formatPhoneNumber(contact.phonenumber) || 'Sin teléfono',
      email: contact.email || 'Sin email',
      category: contact.type || 'personal',
      isFavorite: contact.isFavorite || false,
      createdAt: contact.createdAt || new Date().toISOString(),
      updatedAt: contact.updatedAt || new Date().toISOString()
    }));
  }
  
  /**
   * Formatea un número de teléfono para mejor visualización
   * @param {string} phone - Número de teléfono sin formato
   * @returns {string} Número de teléfono formateado
   */
  _formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Eliminar cualquier caracter que no sea número
    const cleaned = phone.replace(/\D/g, '');
    
    // Aplicar formato según la longitud
    if (cleaned.length === 9) {
      return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    } else if (cleaned.length > 9) {
      return `+${cleaned.substring(0, cleaned.length-9)}-${cleaned.substring(cleaned.length-9, cleaned.length-6)}-${cleaned.substring(cleaned.length-6, cleaned.length-3)}-${cleaned.substring(cleaned.length-3)}`;
    }
    
    return cleaned;
  }
  
  /**
   * Reto Autónomo 3A: Busca contactos por nombre
   * @param {string} query - Texto a buscar
   * @returns {Promise<Object>} Objeto con los contactos filtrados y metadata
   */
  async searchContacts(query) {
    this.requestCount++;
    console.log(`🔍 Service Layer: Buscando contactos con "${query}"...`);
    
    try {
      // Obtenemos todos los contactos primero
      const { contacts } = await this.fetchContacts();
      
      // Filtramos por la query (insensible a mayúsculas/minúsculas)
      const queryLower = query.toLowerCase();
      const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(queryLower) ||
        contact.email.toLowerCase().includes(queryLower) ||
        contact.phone.includes(query)
      );
      
      return {
        contacts: filteredContacts,
        metadata: {
          timestamp: new Date(),
          count: filteredContacts.length,
          query,
          source: 'Service Layer Search'
        }
      };
      
    } catch (error) {
      console.error('❌ Service Layer: Error al buscar contactos:', error);
      this.errorCount++;
      throw error;
    }
  }
  
  /**
   * Obtener contacto individual por ID
   * @param {number|string} id - ID del contacto a obtener
   * @returns {Promise<Object>} Contacto individual transformado
   */
  async fetchContactById(id) {
    try {
      console.log(`🌐 Cargando contacto ID: ${id}...`);
      const response = await fetch(`${this.apiUrl}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Contacto no encontrado');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const rawContact = await response.json();
      
      // Transformar el contacto al formato esperado por la aplicación
      const transformedContact = {
        id: rawContact.id || Date.now(),
        name: rawContact.fullname,
        phone: this._formatPhoneNumber(rawContact.phonenumber) || 'Sin teléfono',
        email: rawContact.email || 'Sin email',
        category: rawContact.type || 'personal',
        isFavorite: rawContact.isFavorite || false,
        createdAt: rawContact.createdAt || new Date().toISOString(),
        updatedAt: rawContact.updatedAt || new Date().toISOString()
      };
      
      console.log('✅ Contacto cargado y transformado:', transformedContact);
      return transformedContact;
      
    } catch (error) {
      console.error('❌ Error al cargar contacto:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene estadísticas del servicio
   * @returns {Object} Estadísticas de uso del servicio
   */
  getStats() {
    return {
      totalRequests: this.requestCount,
      successfulRequests: this.successCount,
      failedRequests: this.errorCount,
      lastRequestTime: this.lastRequestTime ? this.lastRequestTime.toLocaleString() : 'Nunca',
      uptime: this._getServiceUptime()
    };
  }
  
  /**
   * Calcula el tiempo que lleva funcionando el servicio
   * @returns {string} Tiempo formateado
   */
  _getServiceUptime() {
    // Esta es una implementación simple. En un caso real, guardaríamos el tiempo de inicio del servicio.
    return 'Desde la carga de la página';
  }
  
  async convertNewContactLocal(newContact){
    const convertNewContact = {
        id: newContact.id,
        name: newContact.fullname,
        // Formatear teléfono: si tiene 9 dígitos, formato XXX-XXX-XXX
        phone: this._formatPhoneNumber(newContact.phonenumber) || 'Sin teléfono',
        email: newContact.email || 'Sin email',
        category: newContact.type || 'personal',
        isFavorite: newContact.isFavorite || false,
        createdAt: newContact.createdAt || new Date().toISOString(),
        updatedAt: newContact.updatedAt || new Date().toISOString()
      }
    return convertNewContact;
  }

  /**
   * Crea un nuevo contacto (ejemplo para futuras implementaciones)
   * @param {Object} contactData - Datos del nuevo contacto
   * @returns {Promise<Object>} Contacto creado
   */
  async createContact(contactData) {
    const newDate = new Date().toISOString().split('T')[0];
    const convertContact = {
      "fullname":contactData.name,
      "phonenumber":contactData.phone,
      "email": contactData.email,
      "type":contactData.category,
      "company":"",
      "birthday": newDate
    }
    this.requestCount++;
    try {
      console.log('📝 Service Layer: Creando nuevo contacto...');
      const response = await this._fetchWithRetry(this.apiUrl, {
        method: 'POST',
        body: JSON.stringify(convertContact)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const newContact = await response.json();
      this.successCount++;
      const convertNewContact = this.convertNewContactLocal(newContact);
      console.log('✅ Service Layer: Contacto creado:', convertNewContact);
      return convertNewContact;
      
    } catch (error) {
      console.error('❌ Service Layer: Error al crear contacto:', error);
      this.errorCount++;
      throw error;
    }
  }
  
  /**
   * Actualiza un contacto existente (ejemplo para futuras implementaciones)
   * @param {number|string} contactId - ID del contacto a actualizar
   * @param {Object} contactData - Nuevos datos del contacto
   * @returns {Promise<Object>} Contacto actualizado
   */
  async updateContact(contactId, contactData) {
    const newDate = new Date().toISOString().split('T')[0];
    const convertContact = {
      "id": contactData.id,
      "fullname":contactData.name,
      "phonenumber":contactData.phone,
      "email": contactData.email,
      "type":contactData.category,
      "company":"",
      "birthday": newDate
    }
    this.requestCount++;
    try {
      console.log(`📝 Service Layer: Actualizando contacto ${contactId}...`);
      const response = await this._fetchWithRetry(`${this.apiUrl}/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify(convertContact)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const updatedContact = await response.json();
      this.successCount++;
      const convertUpdateContact = this.convertNewContactLocal(updatedContact);
      console.log('✅ Service Layer: Contacto actualizado:', convertUpdateContact);
      return convertUpdateContact;
      
    } catch (error) {
      console.error('❌ Service Layer: Error al actualizar contacto:', error);
      this.errorCount++;
      throw error;
    }
  }
  
  /**
   * Elimina un contacto (ejemplo para futuras implementaciones)
   * @param {number|string} contactId - ID del contacto a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  async deleteContact(contactId) {
    this.requestCount++;
    try {
      console.log(`🗑️ Service Layer: Eliminando contacto ${contactId}...`);
      const response = await this._fetchWithRetry(`${this.apiUrl}/${contactId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      this.successCount++;
      console.log('✅ Service Layer: Contacto eliminado correctamente');
      return true;
      
    } catch (error) {
      console.error('❌ Service Layer: Error al eliminar contacto:', error);
      this.errorCount++;
      throw error;
    }
  }
}

// Exportamos una instancia única del servicio (patrón Singleton)
export const contactService = new ContactService();