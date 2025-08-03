import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="py-6 px-4 relative overflow-hidden">
      <div className="container mx-auto flex items-center justify-between">
        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-6 relative z-10">
          <button
            onClick={() => navigate('/')}
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/' 
                ? 'text-pink-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${
              location.pathname === '/dashboard' 
                ? 'text-pink-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard
          </button>
          <button
            onClick={() => navigate('/contacts')}
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/contacts' 
                ? 'text-pink-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Contacts
          </button>
          <button
            onClick={() => navigate('/contacts/history')}
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${
              location.pathname === '/contacts/history' 
                ? 'text-pink-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
          <button
            onClick={() => navigate('/about')}
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${
              location.pathname === '/about' 
                ? 'text-pink-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </button>
        </nav>

        {/* Logo and Title */}
        <div className="text-center relative z-10 flex-1 md:flex-none">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/20 mr-3">
              <span className="text-xl">📞</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              Contact Manager
            </h1>
          </div>
          <p className="text-slate-400 text-sm md:text-base">
            Manage your important contacts <span className="text-yellow-400">⭐</span>
          </p>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden relative z-10">
          <button
            onClick={() => navigate('/contacts/history')}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Contact History"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-pink-500/10 to-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl"></div>
    </header>
  );
}