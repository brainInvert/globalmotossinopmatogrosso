import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  LogOut,
  PlusCircle,
  ShieldCheck,
  Images,
  Bike
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 sm:h-18">
          {/* Brand Wordmark: GLOBAL MOTOS */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 text-slate-900 group min-w-0"
          >
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Bike className="w-5 h-5 stroke-[2.2]" />
            </span>
            <div className="flex flex-col">
              <span className="font-['Outfit'] font-extrabold text-lg sm:text-xl tracking-tight leading-none text-slate-900">
                GLOBAL <span className="text-blue-600">MOTOS</span>
              </span>
              <span className="hidden xs:inline-block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Marketplace de Motos
              </span>
            </div>
          </Link>

          {/* Action Zone: Admin Access or Logged User Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px]"
                >
                  <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2.5 border-b border-slate-100 text-xs">
                      <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        Administrador Global Motos
                      </span>
                    </div>

                    <Link
                      to="/admin/anuncios"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                    >
                      <Images className="w-4 h-4 text-blue-600" />
                      Aba de Anúncios & Fotos
                    </Link>

                    <Link
                      to="/anunciar"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-blue-600" />
                      Cadastrar Nova Moto
                    </Link>

                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Métricas e Moderação
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da conta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Acesso Admin</span>
              </button>
            )}

            {/* Quick Action Button for Admin */}
            {isAdmin ? (
              <button
                type="button"
                onClick={() => navigate('/anunciar')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-all hover:shadow-md hover:shadow-blue-300 whitespace-nowrap shrink-0 cursor-pointer min-h-[38px]"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden xs:inline">Nova Moto</span>
                <span className="xs:hidden">Nova</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
