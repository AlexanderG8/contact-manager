import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function ContactForm ({handleAddContact, contacts, editingContact, formMode, setFormMode, onCancelEdit}) {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        category: "" // Reto Final 1: Categorías de Contactos
    });

    const [errors, setErrors] = useState({});
    
    // Estado para detectar cambios no guardados (Reto Final 3)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    // Valores originales para restaurar al cancelar (Reto Final 3)
    const [originalValues, setOriginalValues] = useState({});
    
    // Estado para el indicador de progreso (Reto Autónomo 1)
    const [completedFields, setCompletedFields] = useState(0);
    
    // Referencias para los campos del formulario (Reto 3: Modo "Edición Rápida")
    const phoneInputRef = useRef(null);
    
    // Estado para controlar la animación de highlight (Reto 3)
    const [highlightPhone, setHighlightPhone] = useState(false);
    
    // Efecto para actualizar el contador de campos completados (Reto Autónomo 1)
    useEffect(() => {
        let count = 0;
        if (formData.name.trim()) count++;
        if (formData.phone.trim()) count++;
        if (formData.email.trim()) count++;
        if (formData.category) count++; // Contar categoría como campo completado
        setCompletedFields(count);
    }, [formData.name, formData.phone,formData.email, formData.category]);
    
    // Efecto para cargar datos del contacto en edición (Reto Final 3)
    useEffect(() => {
        if (editingContact && formMode === 'edit') {
            const contactData = {
                name: editingContact.name,
                phone: editingContact.phone,
                email: editingContact.email,
                category: editingContact.category || ''
            };
            setFormData(contactData);
            setOriginalValues(contactData);
            setHasUnsavedChanges(false);
        } else if (formMode === 'create') {
            setFormData({name: "", phone: "", email: "", category: ""});
            setErrors({});
            setHasUnsavedChanges(false);
        }
    }, [editingContact, formMode]);
    
    // 🏆 Reto Autónomo 3B: Confirmación de Navegación
    // Prevenir salir con cambios sin guardar
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '¿Estás seguro de que deseas salir? Se perderán los cambios no guardados.';
                return e.returnValue;
            }
        };
        
        // Agregar el event listener
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Cleanup: remover el event listener
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);
    
    function validateForm(){
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido";
        } else if (formMode === 'create' && contacts && contacts.some(contact => contact.name.toLowerCase() === formData.name.toLowerCase())) {
            // Reto Autónomo 3: Prevenir contactos duplicados (solo en modo creación)
            newErrors.name = "Este contacto ya existe en tu lista";
        }
        
        // Validación de categoría (Reto Final 1)
        if (!formData.category) {
            newErrors.category = "La categoría es requerida";
        }
        
        // Validación del teléfono (Reto 2: Validación Avanzada de Teléfono)
        if (!formData.phone.trim()) {
            newErrors.phone = "El teléfono es requerido";
        } else {
            // Regex que permite números, espacios, guiones y paréntesis
            const phoneRegex = /^[0-9\s\(\)\-]+$/;
            if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = "Formato inválido. Ejemplo válido: (51) 998-123-567 o 01 234 5678";
            }
        }
        
        if (!formData.email.trim()) newErrors.email = "El email es requerido";
        if(!formData.email.trim().includes("@")) newErrors.email = "El email debe contener un @";
        return newErrors;
    }

  const handleChangeContact = (event) => {
    // Lo que realizo es obtengo los datos del formulario y los actualizo
    // con los datos que se ingresan en el formulario
    const nameValue = event.target.value;
    setFormData({... formData, name: nameValue});
    
    // Marcar que hay cambios no guardados (Reto Final 3)
    if (formMode === 'edit') {
      setHasUnsavedChanges(true);
    }
    
    // Reto 3: Modo "Edición Rápida"
    // Verificar si el valor contiene solo números y tiene al menos 3 caracteres
    if (/^\d{3,}$/.test(nameValue)) {
      // Cambiar el foco al campo de teléfono
      if (phoneInputRef.current) {
        phoneInputRef.current.focus();
        // Activar la animación de highlight
        setHighlightPhone(true);
        // Desactivar el highlight después de 1.5 segundos
        setTimeout(() => setHighlightPhone(false), 1500);
      }
    }
  };
  const handleChangeTelContact = (event) => {
    setFormData({... formData, phone: event.target.value});
    
    // Marcar que hay cambios no guardados (Reto Final 3)
    if (formMode === 'edit') {
      setHasUnsavedChanges(true);
    }
    
    // Validación en tiempo real para el teléfono (Reto 2)
    if (event.target.value) {
      const phoneRegex = /^[0-9\s\(\)\-]+$/;
      if (!phoneRegex.test(event.target.value)) {
        setErrors({...errors, phone: "Format invalid. Example valid: (51) 998-123-456 o 01 234 5678"});
      } else {
        // Si el formato es válido, eliminar el error si existe
        const newErrors = {...errors};
        delete newErrors.phone;
        setErrors(newErrors);
      }
    }
  };

  const handleChangeEmail = (event) => {
    setFormData({... formData, email: event.target.value});
    
    // Marcar que hay cambios no guardados (Reto Final 3)
    if (formMode === 'edit') {
      setHasUnsavedChanges(true);
    }
  };
  
  // Manejador para el cambio de categoría (Reto Final 1)
  const handleChangeCategory = (event) => {
    setFormData({... formData, category: event.target.value});
    
    // Marcar que hay cambios no guardados (Reto Final 3)
    if (formMode === 'edit') {
      setHasUnsavedChanges(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if(Object.keys(formErrors).length > 0){
        setErrors(formErrors);
        return;
    }

    setErrors({});

    const contactData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      category: formData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    try {
      // Llamo al callback onAddContact y le paso el contacto
      if (formMode === 'edit' && editingContact) {
        // En modo edición, incluir el ID existente
        await handleAddContact({...contactData, id: editingContact.id}, 'edit');
        setHasUnsavedChanges(false);
        // Volver al modo creación después de guardar
        setFormMode && setFormMode('create');
        
        // NAVEGACIÓN PROGRAMÁTICA tras edición exitosa
        navigate(`/contact/${editingContact.id}`, {
          state: { message: '¡Contacto actualizado exitosamente!' }
        });
      } else {
        // En modo creación
        const newContact = await handleAddContact(contactData, 'create');
        
        // NAVEGACIÓN PROGRAMÁTICA tras creación exitosa
        if (newContact && newContact.id) {
          navigate(`/contact/${newContact.id}`, {
            state: { message: '¡Contacto creado exitosamente!' }
          });
        }
      }
      
      // Limpiar el formulario
      setFormData({name: "", phone: "", email: "", category: ""});
      
    } catch (error) {
      setErrors({ general: error.message || 'Error al procesar el contacto' });
    }
  };
  
  // Función para cancelar la edición (Reto Final 3)
  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      if (confirm("¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.")) {
        cancelEdit();
      }
    } else {
      cancelEdit();
    }
  };
  
  // Función auxiliar para cancelar la edición
  const cancelEdit = () => {
    setFormData({name: "", phone: "", email: "", category: ""});
    setErrors({});
    setHasUnsavedChanges(false);
    setFormMode && setFormMode('create');
    onCancelEdit && onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-slate-800/40 backdrop-blur-sm rounded-xl border ${formMode === 'edit' ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-slate-700/50'} p-6 shadow-lg`}>
      {/* Indicador de modo edición (Reto Final 3) */}
      {formMode === 'edit' && (
        <div className="mb-4 bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Editing contact: {editingContact?.name}
        </div>
      )}
      
      {/* Reto Autónomo 1: Indicador visual de progreso */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-slate-300">Completed fields: {completedFields}/4</div>
        <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300" 
            style={{ width: `${(completedFields / 4) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
          <div className="relative">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChangeContact}
              placeholder="Enter name"
              required
              className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 sm:text-sm"></span>
            </div>
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
          <div className="relative">
            <input
              type="text"
              id="phone"
              value={formData.phone}
              onChange={handleChangeTelContact}
              placeholder="Enter phone number (e.g. (51) 998-567-128)"
              required
              ref={phoneInputRef}
              className={`w-full bg-slate-900/50 text-white border ${highlightPhone ? 'border-pink-500 ring-2 ring-pink-500' : 'border-slate-700'} rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <div className="relative">
            <input
              type="text"
              id="email"
              value={formData.email}
              onChange={handleChangeEmail}
              placeholder="Enter email"
              required
              className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>
        
        {/* Reto Final 1: Campo de categoría */}
        <div className="form-group">
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
          <div className="relative">
            <select
              id="category"
              value={formData.category}
              onChange={handleChangeCategory}
              required
              className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="">Select a category</option>
              <option value="trabajo">Work</option>
              <option value="personal">Personal</option>
              <option value="familia">Family</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
        </div>
        
        {/* Botones de acción */}
        <div className="flex gap-2">
          {formMode === 'edit' ? (
            <>
              {/* Botones para modo edición */}
              <button 
                type="submit" 
                className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
              
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="py-2 px-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              
              {/* Botón de navegación hacia atrás en historial */}
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Atrás
              </button>
            </>
          ) : (
            <>
              {/* Botones para modo creación */}
              <button 
                type="submit" 
                className="flex-1 py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Save Contact
              </button>
              
              <button 
                type="button" 
                onClick={() => {
                  // Verificar si hay datos en algún campo
                  const hasData = formData.name || formData.phone || formData.email || formData.category;
                  
                  // Si hay datos, mostrar confirmación
                  if (hasData) {
                    if (confirm("¿Estás seguro de que deseas limpiar todos los campos?")) {
                      // Limpiar campos y errores
                      setFormData({name: "", phone: "", email: "", category: ""});
                      setErrors({});
                    }
                  } else {
                    // Si no hay datos, limpiar directamente
                    setFormData({name: "", phone: "", email: "", category: ""});
                    setErrors({});
                  }
                }}
                className="py-2 px-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium rounded-lg transition-all shadow-lg flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
              {/* Botón de navegación - Volver a Contactos */}
              <button 
                type="button" 
                onClick={() => navigate('/contacts')}
                className="py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
};
