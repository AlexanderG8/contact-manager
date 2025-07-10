export default function Filters({
  showOnlyFavorites,
  handleChangeFavorite,
  handleChangeAllFavorite,
  contacts,
  handlerClearContacts,
}) {
  // Contador de favoritos
  const favoriteCount = contacts.filter(contact => contact.isFavorite).length;
  
  return (
    <section className="mb-6">
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700/50 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-4 flex-wrap">
          {/* Show favorites checkbox */}
          <div className="flex items-center">
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="showOnlyFavorites" 
                checked={showOnlyFavorites}
                onChange={handleChangeFavorite}
                className="peer sr-only" 
              />
              <label 
                htmlFor="showOnlyFavorites"
                className="block overflow-hidden h-6 rounded-full bg-slate-700 cursor-pointer peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-500 after:content-[''] after:block after:bg-white after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-white"
              ></label>
            </div>
            <label 
              htmlFor="showOnlyFavorites" 
              className="text-slate-300 text-sm cursor-pointer"
            >
              Show favorites
            </label>
          </div>
          
          {/* Mark/Unmark all checkbox */}
          <div className="flex items-center">
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="markAllFavorites" 
                onChange={handleChangeAllFavorite}
                className="peer sr-only" 
              />
              <label 
                htmlFor="markAllFavorites"
                className="block overflow-hidden h-6 rounded-full bg-slate-700 cursor-pointer peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-500 after:content-[''] after:block after:bg-white after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-white"
              ></label>
            </div>
            <label 
              htmlFor="markAllFavorites" 
              className="text-slate-300 text-sm cursor-pointer"
            >
              Mark/Unmark favorites to all
            </label>
          </div>
          
          {/* Clear contacts button */}
          <button
            onClick={handlerClearContacts}
            className="px-4 py-2 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-red-500/20 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Contacts
          </button>
          
          {/* Counters */}
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-lg">⭐</span>
              <span className="text-slate-300 text-sm">{favoriteCount} favorite{favoriteCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="text-slate-400 text-sm">
              {contacts.length} total contact{contacts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
