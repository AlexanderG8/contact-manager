import { useState } from "react";

export default function ContactCard({contact, toggleFavorite, handleNextContact, selectContact, searchTerm, onEdit}) {
  const isSelected = selectContact?.id === contact.id;
  // Estado para el hover
  const [isHovered, setIsHovered] = useState(false);
  
  // Colores para las categorías (Reto Final 1)
  const categoryColors = {
    trabajo: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/30",
      color: "#2563eb"
    },
    personal: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      border: "border-green-500/30",
      color: "#16a34a"
    },
    familia: {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      border: "border-orange-500/30",
      color: "#ea580c"
    },
    social: {
      bg: "bg-purple-500/20",
      text: "text-purple-400",
      border: "border-purple-500/30",
      color: "#8b5cf6"
    }
  };
  
  // Obtener los estilos de la categoría del contacto
  const getCategoryStyles = () => {
    if (!contact.category || !categoryColors[contact.category]) {
      return {
        bg: "bg-slate-500/20",
        text: "text-slate-400",
        border: "border-slate-500/30",
        color: "#64748b"
      };
    }
    return categoryColors[contact.category];
  };
  
  const categoryStyle = getCategoryStyles();
  
  return (
    <div className={`relative overflow-hidden backdrop-blur-sm rounded-xl border transition-all duration-300 ${isSelected 
      ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/50 shadow-lg shadow-pink-500/10' 
      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60'}`}>
      
      {/* Card content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-medium text-sm truncate">
              {searchTerm ? (
                <span dangerouslySetInnerHTML={{ 
                  __html: contact?.name.replace(
                    new RegExp(searchTerm, 'gi'), 
                    match => `<mark class="bg-pink-500/30 text-white px-1 rounded">${match}</mark>`
                  ) 
                }} />
              ) : (
                contact?.name
              )}
            </h3>
            
            
          </div>
          {/* Botón de editar (Reto Final 3) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(contact);
            }}
            className={`ml-2 p-1.5 rounded-full transition-all ${isHovered ? "bg-slate-700/50" : ""}`}
            title="Edit contact"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          
          <button
            className={`text-lg transition-transform hover:scale-110 ${contact?.isFavorite ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'}`}
            onClick={() => toggleFavorite(contact.id)}
            aria-label={contact?.isFavorite ? "Remove from favorites" : "Add to favorites"}
            title="Toggle favorite"
          >
            {contact?.isFavorite ? "⭐" : "⚝"}
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-slate-300">
            {/* Badge de categoría (Reto Final 1) */}
            <span 
              className={`text-xs px-2 py-1 rounded-full ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} border`}
              data-category={contact.category || "none"}
            >
              {contact.category === "trabajo" ? "Work" : 
               contact.category === "personal" ? "Personal" : 
               contact.category === "familia" ? "Family" : 
               contact.category === "social" ? "Social" : "Sin categoría"}
            </span>
          </div>
          <div className="flex items-center text-slate-300">
            <span className="mr-2">📱</span>
            <span className="text-sm">
              {searchTerm ? (
                <span dangerouslySetInnerHTML={{ 
                  __html: contact?.phone.replace(
                    new RegExp(searchTerm, 'gi'), 
                    match => `<mark class="bg-pink-500/30 text-white px-1 rounded">${match}</mark>`
                  ) 
                }} />
              ) : (
                contact?.phone
              )}
            </span>
          </div>
          <div className="flex items-center text-slate-300">
            <span className="mr-2">✉️</span>
            <span className="text-sm truncate">
              {searchTerm ? (
                <span dangerouslySetInnerHTML={{ 
                  __html: contact?.email.replace(
                    new RegExp(searchTerm, 'gi'), 
                    match => `<mark class="bg-pink-500/30 text-white px-1 rounded">${match}</mark>`
                  ) 
                }} />
              ) : (
                contact?.email
              )}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => {handleNextContact(contact)}}
          className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-pink-500/80 to-purple-500/80 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all shadow-md flex items-center justify-center gap-1"
        >
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/5 blur-xl"></div>
    </div>
  );
}