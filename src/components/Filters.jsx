import { Link } from 'react-router-dom';

export default function Filters({
  showOnlyFavorites,
  handleChangeFavorite,
  handleChangeAllFavorite,
  contacts,
  handlerClearContacts,
  searchTerm,
  handleSearchChange,
  sortOption,
  handleSortChange,
  handleCategoryChange,
  categoryFilter,
  categoryCounts
}) {
  // Contador de favoritos
  const favoriteCount = contacts.filter(contact => contact.isFavorite).length;
  
  return (
    <section className="mb-6">
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700/50 shadow-lg">
        {/* Reto Extra 1: Campo de búsqueda inteligente */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, phone or email"
              className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button 
                onClick={() => handleSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* 🏆 Reto Autónomo 3C: Botón Crear Nuevo Contacto */}
        <div className="mb-4">
          <Link 
            to="/contacts/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Contact
          </Link>
        </div>
        
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
          
          {/* Reto Extra 2: Dropdown de ordenamiento */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 rounded-lg py-2 pl-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
            >
              <option value="default">Sort by...</option>
              <option value="az">Alphabetic A-Z</option>
              <option value="za">Alphabetic Z-A</option>
              <option value="favorites">Favorites first</option>
              <option value="recent">Newly added</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          {/* Filtro por categoría (Reto Final 1) */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 rounded-lg py-2 pl-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
            >
              <option value="all">All categories</option>
              <option value="trabajo">Work</option>
              <option value="personal">Personal</option>
              <option value="familia">Family</option>
              <option value="social">Social</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          {/* Counters */}
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-lg">⭐</span>
              <span className="text-slate-300 text-sm">{favoriteCount} favorite{favoriteCount !== 1 ? 's' : ''}</span>
            </div>
            
            {/* Contadores por categoría (Reto Final 1) */}
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs" title="Work contacts">
                W: {categoryCounts?.trabajo || 0}
              </span>
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs" title="Personal contacts">
                P: {categoryCounts?.personal || 0}
              </span>
              <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs" title="Family contacts">
                F: {categoryCounts?.familia || 0}
              </span>
              <span className="bg-purple-500/20 text-orange-300 px-2 py-1 rounded-full text-xs" title="Family contacts">
                S: {categoryCounts?.social || 0}
              </span>
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
