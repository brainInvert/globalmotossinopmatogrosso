import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ComparisonDock } from './components/ComparisonDock';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { MotorcycleDetailPage } from './pages/MotorcycleDetailPage';
import { ComparatorPage } from './pages/ComparatorPage';
import { FinancingPage } from './pages/FinancingPage';
import { CreateAdPage } from './pages/CreateAdPage';
import { AdminAdsPage } from './pages/AdminAdsPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ComparisonProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/motos" element={<CatalogPage />} />
                <Route path="/moto/:id" element={<MotorcycleDetailPage />} />
                <Route path="/comparar" element={<ComparatorPage />} />
                <Route path="/simulador" element={<FinancingPage />} />
                <Route path="/anunciar" element={<CreateAdPage />} />
                <Route path="/editar/:id" element={<CreateAdPage />} />
                <Route path="/admin/anuncios" element={<AdminAdsPage />} />
                <Route path="/painel" element={<Navigate to="/admin/anuncios" replace />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <ComparisonDock />
            <AuthModal />
          </div>
        </ComparisonProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
