export default function ContactCard({contact, toggleFavorite, handleNextContact, selectContact}) {
  const isSelected = selectContact?.id === contact.id;
  
  return (
    <div className={`relative overflow-hidden backdrop-blur-sm rounded-xl border transition-all duration-300 ${isSelected 
      ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/50 shadow-lg shadow-pink-500/10' 
      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60'}`}>
      
      {/* Card content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-white font-medium text-lg truncate">{contact?.name}</h3>
          <button
            className={`text-lg transition-transform hover:scale-110 ${contact?.isFavorite ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'}`}
            onClick={() => toggleFavorite(contact.id)}
            aria-label={contact?.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {contact?.isFavorite ? "⭐" : "⚝"}
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-slate-300">
            <span className="mr-2">📱</span>
            <span className="text-sm">{contact?.phone}</span>
          </div>
          <div className="flex items-center text-slate-300">
            <span className="mr-2">✉️</span>
            <span className="text-sm truncate">{contact?.email}</span>
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