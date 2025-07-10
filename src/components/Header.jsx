export default function Header() {
  return (
    <header className="py-6 px-4 relative overflow-hidden">
      <div className="container mx-auto flex items-center justify-center">
        <div className="text-center relative z-10">
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
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-pink-500/10 to-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl"></div>
    </header>
  );
}