import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GitCompare,
  Plus,
  X,
  MessageCircle,
  Gauge,
  Calendar,
  Fuel,
  Weight,
  Zap,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';
import { Motorcycle } from '../types/motorcycle';
import { useComparison } from '../context/ComparisonContext';
import { api } from '../services/api';

export const ComparatorPage: React.FC = () => {
  const { comparisonList, removeFromComparison, addToComparison, clearComparison } = useComparison();
  const [availableMotos, setAvailableMotos] = useState<Motorcycle[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    async function loadMotos() {
      try {
        const all = await api.getMotorcycles();
        setAvailableMotos(all);
      } catch (err) {
        console.error(err);
      }
    }
    loadMotos();
  }, []);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getWhatsAppUrl = (moto: Motorcycle) => {
    const msg = encodeURIComponent(
      `Olá ${moto.sellerName}! Vi a ${moto.brand} ${moto.model} no comparador da Global Motos e tenho interesse.`
    );
    return `https://wa.me/55${moto.sellerPhone.replace(/\D/g, '')}?text=${msg}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" />
            <span>Ferramenta de Comparação Técnica</span>
          </div>
          <h1 className="font-['Outfit'] text-3xl font-extrabold text-slate-900 tracking-tight">
            Comparador Lado a Lado
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare especificações, consumo, potência e preços de até 3 motocicletas para tomar a melhor decisão.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {comparisonList.length > 0 && (
            <button
              type="button"
              onClick={clearComparison}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Limpar Lista
            </button>
          )}

          {comparisonList.length < 3 && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Moto ({comparisonList.length}/3)</span>
            </button>
          )}
        </div>
      </div>

      {comparisonList.length > 0 && (
        <div className="lg:hidden flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
          <span className="font-semibold text-slate-700">Dica:</span>
          <span>Deslize a tabela horizontalmente para comparar todos os modelos</span>
        </div>
      )}

      {comparisonList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <GitCompare className="w-8 h-8" />
          </div>
          <h2 className="font-['Outfit'] font-bold text-xl text-slate-900">
            Nenhuma moto selecionada para comparação
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Selecione até 3 motocicletas a partir do catálogo ou clique no botão abaixo para adicionar motos da nossa vitrine demonstrativa.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all min-h-[44px]"
            >
              Escolher Motos da Lista
            </button>
            <Link
              to="/motos"
              className="px-5 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all min-h-[44px] flex items-center justify-center"
            >
              Navegar no Catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto pb-2">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">
                  Especificação
                </th>
                {comparisonList.map((m) => (
                  <th key={m.id} className="p-4 w-1/4">
                    <div className="relative group space-y-2">
                      <button
                        type="button"
                        onClick={() => removeFromComparison(m.id)}
                        className="absolute -top-1 -right-1 p-1 bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-full border border-slate-200 shadow-sm transition-colors"
                        title="Remover moto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={m.images[0]}
                          alt={m.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <Link
                        to={`/moto/${m.id}`}
                        className="block font-['Outfit'] font-bold text-sm text-slate-900 hover:text-blue-600 leading-snug"
                      >
                        {m.brand} {m.model}
                      </Link>
                      <span className="text-base font-extrabold text-blue-600 tabular-nums block">
                        {formatCurrency(m.price)}
                      </span>
                      <a
                        href={getWhatsAppUrl(m)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Negociar</span>
                      </a>
                    </div>
                  </th>
                ))}
                {/* Empty slot placeholder if less than 3 */}
                {Array.from({ length: 3 - comparisonList.length }).map((_, idx) => (
                  <th key={idx} className="p-4 w-1/4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(true)}
                      className="w-full h-full min-h-[220px] border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl flex flex-col items-center justify-center gap-2 p-4 text-slate-400 hover:text-blue-600 transition-all cursor-pointer"
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-xs font-bold">Adicionar Moto</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              <tr>
                <td className="p-4 font-semibold text-slate-600">Categoria</td>
                {comparisonList.map((m) => (
                  <td key={m.id} className="p-4 font-bold capitalize text-slate-800">
                    {m.category}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <td key={i} className="p-4 text-slate-300">-</td>
                ))}
              </tr>

              <tr className="bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-600">Ano Fabricação / Modelo</td>
                {comparisonList.map((m) => (
                  <td key={m.id} className="p-4 font-bold text-slate-800 tabular-nums">
                    {m.yearManufacture} / {m.yearModel}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <td key={i} className="p-4 text-slate-300">-</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-600">Quilometragem</td>
                {comparisonList.map((m) => (
                  <td key={m.id} className="p-4 font-bold text-slate-800 tabular-nums">
                    {m.mileage === 0 ? '0 km (Zero)' : `${m.mileage.toLocaleString('pt-BR')} km`}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <td key={i} className="p-4 text-slate-300">-</td>
                ))}
              </tr>

              <tr className="bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-600">Cilindrada (cc)</td>
                {comparisonList.map((m) => (
                  <td key={m.id} className="p-4 font-bold text-slate-800 tabular-nums">
                    {m.engineCapacity} cc
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <td key={i} className="p-4 text-slate-300">-</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-600">Potência Máxima</td>
                {comparisonList.map((m) => (
                  <td key={m.id} className="p-4 font-bold text-slate-800 tabular-nums">
                    {m.technicalSpecs?.powerHp ? `${m.technicalSpecs.powerHp} cv` : 'N/D'}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <td key={i} className="p-4 text-slate-300">-</td>
                ))}
              </tr>

              <tr className="bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-600">Torque Máximo</td>
                {comparisonList.map((m) => (
                  <td key={m.id} className="p-4 font-bold text-slate-800 tabular-nums">
                    {m.technicalSpecs?.torqueNm ? `${m.technicalSpecs.torqueNm} Nm` : 'N/D'}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <td key={i} className="p-4 text-slate-300">-</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-600">Peso em Ordem de Marcha</td>
                {comparisonList.map((m) => (
                  <td key={m.id} className="p-4 font-bold text-slate-800 tabular-nums">
                    {m.technicalSpecs?.weightKg ? `${m.technicalSpecs.weightKg} kg` : 'N/D'}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <td key={i} className="p-4 text-slate-300">-</td>
                ))}
              </tr>

              <tr className="bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-600">Consumo Médio Estimado</td>
                {comparisonList.map((m) => (
                  <td key={m.id} className="p-4 font-bold text-slate-800 tabular-nums">
                    {m.technicalSpecs?.consumptionKmPerL ? `${m.technicalSpecs.consumptionKmPerL} km/l` : 'N/D'}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <td key={i} className="p-4 text-slate-300">-</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-600">Tanque de Combustível</td>
                {comparisonList.map((m) => (
                  <td key={m.id} className="p-4 font-bold text-slate-800 tabular-nums">
                    {m.technicalSpecs?.tankCapacityL ? `${m.technicalSpecs.tankCapacityL} litros` : 'N/D'}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <td key={i} className="p-4 text-slate-300">-</td>
                ))}
              </tr>

              <tr className="bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-600">Câmbio / Transmissão</td>
                {comparisonList.map((m) => (
                  <td key={m.id} className="p-4 font-bold text-slate-800">
                    {m.transmission}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <td key={i} className="p-4 text-slate-300">-</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-600">Localização</td>
                {comparisonList.map((m) => (
                  <td key={m.id} className="p-4 text-slate-700">
                    {m.city}, {m.state}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <td key={i} className="p-4 text-slate-300">-</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Add Moto Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                Escolha uma moto para comparar
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {availableMotos.map((m) => {
                const isSelected = comparisonList.some((c) => c.id === m.id);
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={m.images[0]}
                        alt={m.title}
                        className="w-16 h-12 object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{m.title}</h4>
                        <span className="text-[11px] text-slate-500 tabular-nums">
                          {m.yearModel} · {m.engineCapacity}cc · {formatCurrency(m.price)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isSelected}
                      onClick={() => {
                        addToComparison(m);
                        if (comparisonList.length >= 2) {
                          setShowAddModal(false);
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      }`}
                    >
                      {isSelected ? 'Já Adicionada' : 'Selecionar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
