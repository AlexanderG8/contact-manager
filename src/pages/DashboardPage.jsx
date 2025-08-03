import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Dashboard from '../components/dashboard/Dashboard';
import { Toaster } from 'sonner';

const DashboardPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#020617] relative">
      {/* Magenta Orb Grid Background */}
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
      
      {/* Componente Toaster de Sonner */}
      <Toaster position="top-right" richColors />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-6">
          <Dashboard />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default DashboardPage;