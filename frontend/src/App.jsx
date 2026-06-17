import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import useAuth from './hooks/useAuth';

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-gray-400 text-sm">
        <div className="flex flex-col items-center gap-2">
          <span className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <span>Booting Question Engine...</span>
        </div>
      </div>
    );
  }

  // Render without nav elements if not authenticated (Login/Register screens)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col justify-between">
        <main className="flex-1 flex flex-col">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    );
  }

  // Render dashboard layout with Sidebar & Navbar if authenticated
  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col justify-between">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row w-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#060A13]">
          <AppRoutes />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
