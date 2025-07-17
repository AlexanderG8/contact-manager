const API_URL = import.meta.env.VITE_API_URL;

// GET - Obtener todos los contactos
export async function fetchContacts() {
  try {
    console.log('🌐 Cargando contactos...');
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const contacts = await response.json();
    console.log('✅ Contactos cargados:', contacts.length);
    return contacts;
    
  } catch (error) {
    console.error('❌ Error al cargar contactos:', error);
    throw error;
  }
}

// POST - Crear un nuevo contacto (ejemplo para futuras implementaciones)
export async function createContact(contactData) {
  try {
    console.log('📝 Creando nuevo contacto...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const newContact = await response.json();
    console.log('✅ Contacto creado:', newContact);
    return newContact;
    
  } catch (error) {
    console.error('❌ Error al crear contacto:', error);
    throw error;
  }
}

// PUT - Actualizar un contacto existente (ejemplo para futuras implementaciones)
export async function updateContact(contactId, contactData) {
  try {
    console.log(`📝 Actualizando contacto ${contactId}...`);
    const response = await fetch(`${API_URL}/${contactId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const updatedContact = await response.json();
    console.log('✅ Contacto actualizado:', updatedContact);
    return updatedContact;
    
  } catch (error) {
    console.error('❌ Error al actualizar contacto:', error);
    throw error;
  }
}

// DELETE - Eliminar un contacto (ejemplo para futuras implementaciones)
export async function deleteContact(contactId) {
  try {
    console.log(`🗑️ Eliminando contacto ${contactId}...`);
    const response = await fetch(`${API_URL}/${contactId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    console.log('✅ Contacto eliminado correctamente');
    return true;
    
  } catch (error) {
    console.error('❌ Error al eliminar contacto:', error);
    throw error;
  }
}