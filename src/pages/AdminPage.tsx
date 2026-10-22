import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Star,
  Eye,
  Users,
  Layers,
  DollarSign,
  Images,
  PlusCircle,
  Search,
  ExternalLink
} from 'lucide-react';
import { Motorcycle } from '../types/motorcycle';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const [allMotos, adminStats] = await Promise.all([
          api.getMotorcycles({}),
          api.getAdminStats()
        ]);
        setMotorcycles(allMotos);
        setStats(adminStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-['Outfit'] font-bold text-2xl text-slate-900">
          Acesso Restrito à Administração
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Esta área é reservada para a administração da Global Motos. Conecte-se com a conta autorizada para prosseguir.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 transition-colors cursor-pointer"
        >
          Entrar como Administrador
        </button>
      </div>
    );
  }

  const handleToggleFeature = async (moto: Motorcycle) => {
    try {
      const updated = await api.updateMotorcycle(moto.id, { featured: !moto.featured });
      setMotorcycles(motorcycles.map((m) => (m.id === moto.id ? { ...m, featured: updated.featured } : m)));
    } catch {
      alert('Erro ao atualizar destaque.');
    }
  };

  const handleToggleStatus = async (moto: Motorcycle, newStatus: 'active' | 'sold') => {
    try {
      await api.updateMotorcycle(moto.id, { status: newStatus });
      setMotorcycles(motorcycles.map((m) => (m.id === moto.id ? { ...m, status: newStatus } : m)));
    } catch {
      alert('Erro ao alterar status da moto.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este anúncio permanentemente como administrador?')) return;
    try {
      await api.deleteMotorcycle(id);
      setMotorcycles(motorcycles.filter((m) => m.id !== id));
    } catch {
      alert('Erro ao excluir anúncio.');
    }
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const filtered = motorcycles.filter((m) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      m.title.toLowerCase().includes(q) ||
      m.brand.toLowerCase().includes(q) ||
      m.model.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Módulo de Gestão Global Motos</span>
          </div>
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Painel Geral da Administração
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhe o volume do estoque, modere anúncios, controle destaques e acesse a aba de fotos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/anuncios"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Images className="w-4 h-4 text-blue-600" />
            <span>Aba de Anúncios & Fotos</span>
          </Link>

          <Link
            to="/anunciar"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nova Moto</span>
          </Link>
        </div>
      </div>

      {/* Stats KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total de Motos</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {motorcycles.length}
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Destaques Home</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {motorcycles.filter((m) => m.featured).length}
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Valor do Estoque</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tabular-nums">
            {formatCurrency(motorcycles.reduce((acc, curr) => acc + (curr.price || 0), 0))}
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fotos Cadastradas</span>
            <Images className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {motorcycles.reduce((acc, curr) => acc + (curr.images?.length || 0), 0)}
          </span>
        </div>
      </div>

      {/* Moderation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-['Outfit'] font-bold text-base sm:text-lg text-slate-900">
              Estoque Ativo & Moderação
            </h2>
            <p className="text-xs text-slate-500">
              Gerencie a visibilidade dos anúncios, fotos de capa e status de venda.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrar por modelo ou cidade..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="p-4">Motocicleta</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Fotos</th>
                <th className="p-4">Localização</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((moto) => (
                <tr key={moto.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={moto.images[0] || '/src/assets/images/category_naked_street_1792660797743.jpg'}
                        alt={moto.title}
                        className="w-12 h-10 object-cover rounded-lg shrink-0 border border-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <Link
                          to={`/moto/${moto.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 block line-clamp-1"
                        >
                          {moto.brand} {moto.model} {moto.version ? `· ${moto.version}` : ''}
                        </Link>
                        <span className="text-[11px] text-slate-500 tabular-nums">
                          {moto.yearModel} · {moto.mileage.toLocaleString('pt-BR')} km · {moto.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-extrabold text-slate-900 tabular-nums whitespace-nowrap">
                    {formatCurrency(moto.price)}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <Link
                      to="/admin/anuncios"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md font-semibold text-[11px] transition-colors"
                    >
                      <Images className="w-3.5 h-3.5 text-blue-600" />
                      <span>{moto.images?.length || 0} fotos</span>
                    </Link>
                  </td>

                  <td className="p-4 text-slate-600 whitespace-nowrap">
                    {moto.city}, {moto.state}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        moto.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {moto.status === 'active' ? 'Ativo' : 'Vendido'}
                    </span>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {/* Manage Photos shortcut */}
                      <Link
                        to="/admin/anuncios"
                        className="p-1.5 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                        title="Gerenciar Fotos na Aba de Anúncios"
                      >
                        <Images className="w-3.5 h-3.5" />
                      </Link>

                      {/* Toggle Featured */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(moto)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          moto.featured
                            ? 'bg-amber-50 text-amber-600 border-amber-300'
                            : 'bg-white text-slate-400 border-slate-200 hover:text-amber-500'
                        }`}
                        title={moto.featured ? 'Remover dos Destaques' : 'Destacar na Home'}
                      >
                        <Star className={`w-3.5 h-3.5 ${moto.featured ? 'fill-amber-500' : ''}`} />
                      </button>

                      {/* View */}
                      <Link
                        to={`/moto/${moto.id}`}
                        className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors"
                        title="Ver Anúncio"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      {/* Toggle status */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(moto, moto.status === 'active' ? 'sold' : 'active')}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
                        title={moto.status === 'active' ? 'Marcar como Vendido' : 'Reativar Anúncio'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(moto.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-700 bg-white border border-slate-200 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remover Anúncio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
