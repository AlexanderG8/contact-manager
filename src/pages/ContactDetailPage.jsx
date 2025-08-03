import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { contactService } from '../services/contactService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Toaster, toast } from 'sonner';
import { useContactHistory, CONTACT_ACTIONS } from '../hooks/useContactHistory';

export default function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addAction } = useContactHistory();
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allContactIds, setAllContactIds] = useState([]);

  useEffect(() => {
    async function loadContact() {
      setIsLoading(true);
      setError(null);
      
      // 🏆 Reto Autónomo 2A: Validación de ID inválido
      if (!id || isNaN(parseInt(id))) {
        setError('ID inválido');
        setIsLoading(false);
        return;
      }
      
      try {
        // Usar la nueva función fetchContactById del service layer
        const contactData = await contactService.fetchContactById(id);
        setContact(contactData);
        
        // 🏆 Reto Autónomo 2B: Cargar todos los IDs para navegación secuencial
        const { contacts } = await contactService.fetchContacts();
        const ids = contacts.map(c => c.id).sort((a, b) => a - b);
        setAllContactIds(ids);
        
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) {
      loadContact();
    }
  }, [id]);

  // 🏆 Reto Autónomo 2B: Funciones de navegación secuencial
  const getCurrentIndex = () => {
    return allContactIds.findIndex(contactId => contactId === parseInt(id));
  };
  
  const handlePreviousContact = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      const previousId = allContactIds[currentIndex - 1];
      navigate(`/contact/${previousId}`);
    }
  };
  
  const handleNextContact = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < allContactIds.length - 1) {
      const nextId = allContactIds[currentIndex + 1];
      navigate(`/contact/${nextId}`);
    }
  };
  
  const canGoPrevious = () => {
    return getCurrentIndex() > 0;
  };
  
  const canGoNext = () => {
    return getCurrentIndex() < allContactIds.length - 1;
  };

  const handleToggleFavorite = async () => {
    if (!contact) return;
    
    try {
      const updatedContact = {
        ...contact,
        isFavorite: !contact.isFavorite,
        updatedAt: new Date().toISOString()
      };
      
      // Actualizar en el servicio
      await contactService.updateContact(contact.id, updatedContact);
      
      // Actualizar estado local
      setContact(updatedContact);
      
      toast.success(
        updatedContact.isFavorite 
          ? `${contact.name} agregado a favoritos` 
          : `${contact.name} removido de favoritos`
      );
    } catch (err) {
      console.error('Error al actualizar favorito:', err);
      toast.error('Error al actualizar favorito');
    }
  };

  const handleDeleteContact = async () => {
    if (!contact) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${contact.name}?`)) {
      return;
    }
    
    try {
      const success = await contactService.deleteContact(contact.id);
      
      if (success) {
        // Registrar la acción en el historial
        addAction(CONTACT_ACTIONS.DELETE, contact.name, contact.id, 'Contact deleted successfully');
        
        toast.success(`Contacto ${contact.name} eliminado correctamente`);
        navigate('/contacts');
      }
    } catch (err) {
      console.error('Error al eliminar contacto:', err);
      toast.error('Error al eliminar contacto');
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
                <p className="text-white/70">Cargando contacto...</p>
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
          
          {/* Navegación */}
          <nav className="px-4 py-2">
            <div className="container mx-auto">
              <Link 
                to="/contacts" 
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                ← Volver a contactos
              </Link>
            </div>
          </nav>
          
          <main className="flex-grow container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">😔</div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {error || 'Contacto no encontrado'}
                </h1>
                <p className="text-slate-400 mb-6">
                  El contacto que buscas no existe o ha sido eliminado.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link 
                    to="/contacts" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Ver todos los contactos
                  </Link>
                  <Link 
                    to="/" 
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Ir al inicio
                  </Link>
                </div>
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
        
        {/* Mostrar mensaje si viene de navegación programática */}
        {location.state?.message && (
          <div className="mx-4 mt-4">
            <div className="container mx-auto">
              <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span>{location.state.message}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Navegación */}
        <nav className="px-4 py-2">
          <div className="container mx-auto">
            <Link 
              to="/contacts" 
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              ← Volver a contactos
            </Link>
          </div>
        </nav>
        
        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            {/* Tarjeta principal del contacto */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      {contact.name}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.category === 'trabajo' ? 'bg-blue-500/20 text-blue-400' :
                        contact.category === 'personal' ? 'bg-green-500/20 text-green-400' :
                        contact.category === 'familia' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {contact.category || 'Sin categoría'}
                      </span>
                      {contact.isFavorite && (
                        <span className="text-yellow-400 text-sm">⭐ Favorito</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-lg transition-colors ${
                    contact.isFavorite 
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                  title={contact.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  {contact.isFavorite ? '⭐' : '☆'}
                </button>
              </div>
              
              {/* Información de contacto */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400">📧</span>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white font-medium">{contact.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400">📱</span>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Teléfono</p>
                    <p className="text-white font-medium">{contact.phone}</p>
                  </div>
                </div>
              </div>
              
              {/* Metadatos */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Creado</p>
                    <p className="text-white">
                      {new Date(contact.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Última actualización</p>
                    <p className="text-white">
                      {new Date(contact.updatedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 🏆 Reto Autónomo 2B: Navegación secuencial */}
            {allContactIds.length > 1 && (
              <div className="mb-6">
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handlePreviousContact}
                    disabled={!canGoPrevious()}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      canGoPrevious() 
                        ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    ← Anterior
                  </button>
                  
                  <span className="px-4 py-2 text-slate-400 text-sm flex items-center">
                    {getCurrentIndex() + 1} de {allContactIds.length}
                  </span>
                  
                  <button
                    onClick={handleNextContact}
                    disabled={!canGoNext()}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      canGoNext() 
                        ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            )}
            
            {/* Acciones */}
            <div className="flex gap-4 justify-center">
              <Link 
                to={`/contacts/edit/${contact.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>📝</span>
                Editar contacto
              </Link>
              
              <button
                onClick={handleDeleteContact}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>🗑️</span>
                Eliminar
              </button>
              
              <Link 
                to="/contacts" 
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>📋</span>
                Ver todos
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}