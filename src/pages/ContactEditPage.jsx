import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactService } from '../services/contactService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Toaster, toast } from 'sonner';
import { useContactHistory, CONTACT_ACTIONS } from '../hooks/useContactHistory';

export default function ContactEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addAction } = useContactHistory();
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: ''
  });
  
  const [errors, setErrors] = useState({});

  // Cargar datos del contacto
  useEffect(() => {
    const loadContact = async () => {
      // Validar ID
      if (!id || isNaN(Number(id))) {
        setError('ID inválido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const contactData = await contactService.fetchContactById(Number(id));
        
        if (contactData) {
          setContact(contactData);
          setFormData({
            name: contactData.name || '',
            phone: contactData.phone || '',
            email: contactData.email || '',
            category: contactData.category || ''
          });
        } else {
          setError('Contact not found');
        }
      } catch (err) {
        console.error('Error loading contact:', err);
        setError(err.message || 'Error loading contact');
        toast.error('Error loading contact');
      } finally {
        setIsLoading(false);
      }
    };

    loadContact();
  }, [id]);
  
  // 🏆 Reto Autónomo 3B: Confirmación de Navegación
  // Prevenir salir con cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to exit? Unsaved changes will be lost.';
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

  // Validación individual de campos
  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          return 'Name is required';
        }
        // Solo letras, espacios y algunos caracteres especiales
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.\-']+$/;
        if (!nameRegex.test(value)) {
          return 'Name can only contain letters and spaces';
        }
        return '';
      
      case 'phone':
        if (!value.trim()) {
          return 'Phone is required';
        }
        // Solo números, espacios, paréntesis y guiones
        const phoneRegex = /^[0-9\s\(\)\-]+$/;
        if (!phoneRegex.test(value)) {
          return 'Phone can only contain numbers, spaces, parentheses and hyphens';
        }
        return '';
      
      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        }
        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      
      case 'category':
        if (!value) {
          return 'Category is required';
        }
        return '';
      
      default:
        return '';
    }
  };

  // Validación del formulario completo
  const validateForm = () => {
    const newErrors = {};
    
    newErrors.name = validateField('name', formData.name);
    newErrors.phone = validateField('phone', formData.phone);
    newErrors.email = validateField('email', formData.email);
    newErrors.category = validateField('category', formData.category);
    
    // Filtrar errores vacíos
    Object.keys(newErrors).forEach(key => {
      if (newErrors[key] === '') {
        delete newErrors[key];
      }
    });
    
    return newErrors;
  };

  // Manejar cambios en el formulario con validación en tiempo real
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    
    // Validar el campo en tiempo real
    const fieldError = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: fieldError }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const updatedContactData = {
        ...formData,
        id: Number(id),
        updatedAt: new Date().toISOString()
      };

      const updatedContact = await contactService.updateContact(Number(id), updatedContactData);
      
      // Registrar la acción en el historial
      addAction(CONTACT_ACTIONS.UPDATE, updatedContact.name, updatedContact.id, 'Contact updated successfully');
      
      toast.success('Contact updated successfully');
      setHasUnsavedChanges(false);
      
      // NAVEGACIÓN PROGRAMÁTICA tras actualización exitosa
      navigate(`/contacts`, {
        state: { message: '¡Contact updated successfully!' }
      });
      
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Error updating contact');
      setErrors({ general: error.message || 'Error updating contact' });
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
        navigate('/contacts');
      }
    } else {
      navigate('/contacts');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#020617] relative">
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
        
        <Toaster position="top-right" richColors />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-grow container mx-auto px-4 py-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/70">Loading contact...</p>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="min-h-screen w-full bg-[#020617] relative">
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
        
        <Toaster position="top-right" richColors />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-grow container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">😔</div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {error || 'Contact not found'}
                </h1>
                <p className="text-slate-400 mb-6">
                  Cannot edit the requested contact.
                </p>
                <button 
                  onClick={() => navigate('/contacts')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Go back to contacts
                </button>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#020617] relative">
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
      
      <Toaster position="top-right" richColors />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-slate-400">
                <li>
                  <button 
                    onClick={() => navigate('/contacts')}
                    className="hover:text-white transition-colors"
                  >
                    Contacts
                  </button>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-white font-medium">Editing Contact</span>
                </li>
              </ol>
            </nav>
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Edit Contact</h1>
              <p className="text-slate-400">Modify the information of {contact.name}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-blue-500/50 ring-2 ring-blue-500/20 p-6 shadow-lg">
              {/* Indicador de modo edición */}
              <div className="mb-4 bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editing contact: {contact.name}
              </div>
              
              {/* Error general */}
              {errors.general && (
                <div className="mb-4 bg-red-500/20 text-red-300 px-3 py-2 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              
              <div className="space-y-4">
                {/* Campo Nombre */}
                <div className="form-group">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter name"
                    required
                    className={`w-full bg-slate-900/50 text-white border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      errors.name ? 'border-red-500' : 
                      formData.name && !errors.name ? 'border-green-500' : 
                      'border-slate-700'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                  {formData.name && !errors.name && (
                    <p className="mt-1 text-sm text-green-400">✓ Valid name</p>
                  )}
                </div>
                
                {/* Campo Teléfono */}
                <div className="form-group">
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Example: (51) 998-123-567"
                    required
                    className={`w-full bg-slate-900/50 text-white border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      errors.phone ? 'border-red-500' : 
                      formData.phone && !errors.phone ? 'border-green-500' : 
                      'border-slate-700'
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                  {formData.phone && !errors.phone && (
                    <p className="mt-1 text-sm text-green-400">✓ Valid phone number</p>
                  )}
                </div>
                
                {/* Campo Email */}
                <div className="form-group">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Example: example@correo.com"
                    required
                    className={`w-full bg-slate-900/50 text-white border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-500' : 
                      formData.email && !errors.email ? 'border-green-500' : 
                      'border-slate-700'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  {formData.email && !errors.email && (
                    <p className="mt-1 text-sm text-green-400">✓ Valid email address</p>
                  )}
                </div>
                
                {/* Campo Categoría */}
                <div className="form-group">
                  <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                    className={`w-full bg-slate-900/50 text-white border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      errors.category ? 'border-red-500' : 
                      formData.category && !errors.category ? 'border-green-500' : 
                      'border-slate-700'
                    }`}
                  >
                    <option value="">Select category</option>
                    <option value="trabajo">Work</option>
                    <option value="personal">Personal</option>
                    <option value="familia">Family</option>
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
                  {formData.category && !errors.category && (
                    <p className="mt-1 text-sm text-green-400">✓ Category selected</p>
                  )}
                </div>
              </div>
              
              {/* Indicador de estado del formulario */}
              <div className="mb-4">
                {Object.values(errors).every(error => error === '') && formData.name && formData.phone && formData.email && formData.category ? (
                  <div className="flex items-center text-green-400 text-sm">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ✓ All fields are valid - Ready to update contact
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-400 text-sm">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Please fix the validation errors above
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-6">
                <button 
                  type="submit" 
                  disabled={Object.values(errors).some(error => error !== '')}
                  className={`flex-1 py-2 px-4 font-medium rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                    Object.values(errors).some(error => error !== '') 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  } text-white`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Contact
                </button>
                
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="py-2 px-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}