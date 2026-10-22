import React from 'react';
import { Link } from 'react-router-dom';
import { Bike, ShieldCheck, PhoneCall, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200">
                <Bike className="w-4 h-4 stroke-[2.2]" />
              </span>
              <span className="font-['Outfit'] font-extrabold text-lg tracking-tight text-slate-900">
                GLOBAL <span className="text-blue-600">MOTOS</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              O marketplace especializado de compra e venda de motos com estoque selecionado, fichas técnicas completas, simulador de financiamento e contato direto via WhatsApp.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Estoque inspecionado e anúncios verificados</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Outfit'] font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Categorias em Alta
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/motos?category=trail" className="hover:text-blue-600 transition-colors">
                  Trail & Big Trail (Adventure)
                </Link>
              </li>
              <li>
                <Link to="/motos?category=street" className="hover:text-blue-600 transition-colors">
                  Street & Naked
                </Link>
              </li>
              <li>
                <Link to="/motos?category=sport" className="hover:text-blue-600 transition-colors">
                  Esportivas & Superbikes
                </Link>
              </li>
              <li>
                <Link to="/motos?category=scooter" className="hover:text-blue-600 transition-colors">
                  Scooters Urbanas & Cub
                </Link>
              </li>
              <li>
                <Link to="/motos?category=custom" className="hover:text-blue-600 transition-colors">
                  Custom & Bobber
                </Link>
              </li>
            </ul>
          </div>

          {/* Ferramentas */}
          <div>
            <h4 className="font-['Outfit'] font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Ferramentas & Catálogo
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/motos" className="hover:text-blue-600 transition-colors">
                  Ver Todo o Estoque de Motos
                </Link>
              </li>
              <li>
                <Link to="/simulador" className="hover:text-blue-600 transition-colors">
                  Simulador de Financiamento CDC
                </Link>
              </li>
              <li>
                <Link to="/comparar" className="hover:text-blue-600 transition-colors">
                  Comparador de Fichas Técnicas
                </Link>
              </li>
              <li>
                <Link to="/motos?sortBy=price_asc" className="hover:text-blue-600 transition-colors">
                  Motos com Menor Preço
                </Link>
              </li>
            </ul>
          </div>

          {/* Gestão Administrativa */}
          <div>
            <h4 className="font-['Outfit'] font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Acesso da Loja
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Área exclusiva para o administrador cadastrar novas motos, atualizar fotos em alta resolução e gerenciar o estoque.
            </p>
            {isAuthenticated ? (
              <Link
                to="/admin/anuncios"
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Gerenciar Anúncios & Fotos</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Acesso Administrativo</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Global Motos. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Tabela FIPE Oficial</span>
            <span>·</span>
            <span>Termos de Uso</span>
            <span>·</span>
            <span>Política de Privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
