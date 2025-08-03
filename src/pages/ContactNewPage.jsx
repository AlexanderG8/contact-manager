import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { contactService } from '../services/contactService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Toaster, toast } from 'sonner';

export default function ContactNewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'The name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'The phone is required';
    } else {
      const phoneRegex = /^[0-9\s\(\)\-]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Invalid format. Example: (51) 998-123-567';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'The email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'The email must contain an @';
    }
    
    if (!formData.category) {
      newErrors.category = 'The category is required';
    }
    
    return newErrors;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newContactData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const newContact = await contactService.createContact(newContactData);
      
      toast.success('The contact was created successfully');
      setHasUnsavedChanges(false);
      
      // 🏆 Reto Autónomo 3C: Navegación Contextual
      // Mostrar opciones de navegación inteligente
      showNavigationOptions(newContact);
      
    } catch (error) {
      console.error('Error creating contact:', error);
      toast.error('Error creating contact');
      setErrors({ general: error.message || 'Error creating contact' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 🏆 Reto Autónomo 3C: Navegación inteligente tras crear contacto
  const showNavigationOptions = (newContact) => {
    // Crear un modal personalizado con opciones
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-slate-800 rounded-xl p-6 max-w-md mx-4 border border-slate-700">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">The contact was created successfully!</h3>
          <p class="text-slate-400">¿What would you like to do next?</p>
        </div>

        <div class="space-y-3">
          <button id="createAnother" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create Another Contact
          </button>

          <button id="goToList" class="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
            Go to Contact List
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#createAnother').onclick = () => {
      document.body.removeChild(modal);
      // Limpiar formulario para crear otro
      setFormData({ name: '', phone: '', email: '', category: '' });
      setErrors({});
      setHasUnsavedChanges(false);
      toast.success('Ready to create another contact');
    };
    
    modal.querySelector('#goToList').onclick = () => {
      document.body.removeChild(modal);
      // 🏆 Reto Autónomo 3C: Mantener parámetros de búsqueda
      const searchParams = location.state?.searchParams || '';
      navigate(`/contacts${searchParams}`, {
        state: { message: 'The contact was created successfully!' }
      });
    };
    
    // Cerrar modal al hacer click fuera
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        navigate(`/contact/${newContact.id}`, {
          state: { message: 'The contact was created successfully!' }
        });
      }
    };
  };

  // Manejar cancelación
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('¿Are you sure you want to cancel? Unsaved changes will be lost.')) {
        // 🏆 Reto Autónomo 3C: Mantener parámetros de búsqueda al cancelar
        const searchParams = location.state?.searchParams || '';
        navigate(`/contacts${searchParams}`);
      }
    } else {
      const searchParams = location.state?.searchParams || '';
      navigate(`/contacts${searchParams}`);
    }
  };

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
            {/* 🏆 Reto Autónomo 3C: Breadcrumbs dinámicos */}
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
                  <span className="text-white font-medium">Create New Contact</span>
                </li>
              </ol>
            </nav>
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Create New Contact</h1>
              <p className="text-slate-400">Complete the information to add a new contact</p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-green-500/50 ring-2 ring-green-500/20 p-6 shadow-lg">
              {/* Indicador de modo creación */}
              <div className="mb-4 bg-green-500/20 text-green-300 px-3 py-2 rounded-lg text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Creating new contact
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
                    className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
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
                    className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
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
                    className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>
                
                {/* Campo Categoría */}
                <div className="form-group">
                  <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                    className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a category</option>
                    <option value="trabajo">Work</option>
                    <option value="personal">Personal</option>
                    <option value="familia">Family</option>
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
                </div>
              </div>
              
              {/* Botones */}
              <div className="flex gap-3 mt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Contact
                    </>
                  )}
                </button>
                
                <button 
                  type="button" 
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="py-2 px-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
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