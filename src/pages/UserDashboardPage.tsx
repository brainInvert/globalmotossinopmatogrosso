import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  Calendar,
  Gauge,
  MapPin,
  AlertCircle,
  Bike
} from 'lucide-react';
import { Motorcycle } from '../types/motorcycle';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const UserDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isAdmin, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [myMotorcycles, setMyMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserAds() {
      if (!user) return;
      setLoading(true);
      try {
        const ads = await api.getUserMotorcycles(user.id);
        setMyMotorcycles(ads);
      } catch (err) {
        console.error('Error loading user ads:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadUserAds();
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-['Outfit'] font-bold text-2xl text-slate-900">
          Acesso Restrito ao Administrador
        </h2>
        <p className="text-xs text-slate-500">
          O gerenciamento de anúncios na Global Motos é exclusivo para a administração.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          Entrar como Administrador
        </button>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja remover este anúncio definitivamente?')) {
      return;
    }
    setDeletingId(id);
    try {
      await api.deleteMotorcycle(id);
      setMyMotorcycles(myMotorcycles.filter((m) => m.id !== id));
    } catch (err) {
      alert('Não foi possível excluir o anúncio.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleSold = async (moto: Motorcycle) => {
    const newStatus = moto.status === 'sold' ? 'active' : 'sold';
    try {
      await api.updateMotorcycle(moto.id, { status: newStatus });
      setMyMotorcycles(
        myMotorcycles.map((m) => (m.id === moto.id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      alert('Erro ao atualizar status do anúncio.');
    }
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalValue = myMotorcycles.reduce((acc, curr) => acc + curr.price, 0);
  const activeCount = myMotorcycles.filter((m) => m.status === 'active').length;
  const soldCount = myMotorcycles.filter((m) => m.status === 'sold').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-['Outfit'] text-3xl font-extrabold text-slate-900 tracking-tight">
            Painel do Vendedor
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie, pause ou atualize as informações de todas as suas motos anunciadas.
          </p>
        </div>

        <Link
          to="/anunciar"
          className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Anunciar Nova Moto</span>
        </Link>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Anúncios Ativos
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{activeCount}</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Motos Vendidas
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">{soldCount}</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Valor Total em Ofertas
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      {/* Listings Section */}
      <div className="space-y-4">
        <h2 className="font-['Outfit'] font-bold text-lg text-slate-900">
          Seus Anúncios Publicados ({myMotorcycles.length})
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : myMotorcycles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Bike className="w-6 h-6" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
              Você ainda não tem nenhum anúncio ativo
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Anuncie sua moto hoje mesmo para milhares de compradores em potencial em todo o Brasil.
            </p>
            <Link
              to="/anunciar"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Criar Primeiro Anúncio</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myMotorcycles.map((moto) => (
              <div
                key={moto.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                  <div className="w-full sm:w-28 h-40 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={moto.images[0]}
                      alt={moto.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1 w-full sm:w-auto min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          moto.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {moto.status === 'active' ? 'Ativo na Busca' : 'Vendido'}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 capitalize">{moto.category}</span>
                    </div>

                    <h3 className="font-['Outfit'] font-bold text-base text-slate-900 leading-snug">
                      {moto.brand} {moto.model} {moto.version ? `· ${moto.version}` : ''}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500">
                      <span className="font-extrabold text-slate-900 tabular-nums">
                        {formatCurrency(moto.price)}
                      </span>
                      <span>·</span>
                      <span className="tabular-nums">{moto.yearModel}</span>
                      <span>·</span>
                      <span className="tabular-nums">{moto.mileage.toLocaleString('pt-BR')} km</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link
                    to={`/moto/${moto.id}`}
                    className="flex-1 sm:flex-none p-2 sm:px-3 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors min-h-[40px]"
                    title="Ver página do anúncio"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleToggleSold(moto)}
                    className="flex-1 sm:flex-none p-2 sm:px-3 text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors min-h-[40px]"
                    title={moto.status === 'sold' ? 'Reativar anúncio' : 'Marcar como vendido'}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{moto.status === 'sold' ? 'Reativar' : 'Vendido'}</span>
                  </button>

                  <Link
                    to={`/editar/${moto.id}`}
                    className="flex-1 sm:flex-none p-2 sm:px-3 text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors min-h-[40px]"
                    title="Editar informações"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </Link>

                  <button
                    type="button"
                    disabled={deletingId === moto.id}
                    onClick={() => handleDelete(moto.id)}
                    className="flex-1 sm:flex-none p-2 sm:px-3 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50 min-h-[40px]"
                    title="Excluir anúncio"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
