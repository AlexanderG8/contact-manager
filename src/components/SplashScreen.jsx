// Componente que muestra pantalla de carga
const SplashScreen = ({ isLoading }) => {
  // Si no está cargando, no renderizar nada
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      
      {/* Spinner animado */}
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      
      {/* Mensaje de carga */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        📇 Iniciando Contact Manager...
      </h2>
      
      {/* CSS para animación del spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;