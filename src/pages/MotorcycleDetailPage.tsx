import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MessageCircle,
  GitCompare,
  ShieldCheck,
  ChevronLeft,
  Share2,
  Check,
  Info,
  Calculator,
  UserCheck
} from 'lucide-react';
import { Motorcycle } from '../types/motorcycle';
import { api } from '../services/api';
import { useComparison } from '../context/ComparisonContext';

export const MotorcycleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();

  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Embedded loan simulation
  const [downPayment, setDownPayment] = useState<number>(0);
  const [months, setMonths] = useState<number>(36);

  useEffect(() => {
    async function loadMoto() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getMotorcycleById(id);
        if (data) {
          setMotorcycle(data);
          setDownPayment(Math.round(data.price * 0.2));
        }
      } catch (err) {
        console.error('Error fetching moto details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMoto();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-96 bg-slate-200 rounded-2xl" />
            <div className="lg:col-span-4 h-96 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!motorcycle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h2 className="font-['Outfit'] text-2xl font-bold text-slate-900">
          Motocicleta não encontrada
        </h2>
        <p className="text-sm text-slate-500">
          O anúncio pode ter sido removido ou o código informado é inválido.
        </p>
        <Link
          to="/motos"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para as ofertas
        </Link>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const inComp = isInComparison(motorcycle.id);

  // Direct WhatsApp Link
  const whatsappMsg = encodeURIComponent(
    `Olá ${motorcycle.sellerName}! Vi o anúncio da ${motorcycle.brand} ${motorcycle.model} (${motorcycle.yearModel}) por ${formatCurrency(motorcycle.price)} no site Global Motos e gostaria de tirar algumas dúvidas.`
  );
  const whatsappUrl = `https://wa.me/55${motorcycle.sellerPhone.replace(/\D/g, '')}?text=${whatsappMsg}`;

  // Loan computation
  const loanBalance = Math.max(0, motorcycle.price - downPayment);
  const monthlyRate = 0.0169;
  const monthlyInstallment = loanBalance > 0
    ? (loanBalance * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1)
    : 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const images = motorcycle.images.length > 0
    ? motorcycle.images
    : ['/src/assets/images/category_naked_street_1792660797743.jpg'];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-28 lg:pb-8">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
        <Link
          to="/motos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors py-1 min-h-[40px]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para a lista de motos</span>
        </Link>

        <div className="flex items-center gap-2 self-end xs:self-auto">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm min-h-[40px] cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden xxs:inline">{copiedLink ? 'Copiado!' : 'Compartilhar'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (inComp) {
                removeFromComparison(motorcycle.id);
              } else {
                addToComparison(motorcycle);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm min-h-[40px] cursor-pointer ${
              inComp
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:text-blue-600'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{inComp ? 'No Comparador' : 'Comparar'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery on left, Purchase Box on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column (Images, Specs, Description) */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Gallery Module */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-sm overflow-hidden space-y-3">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={motorcycle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {motorcycle.featured && (
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded shadow-md">
                  Anúncio Destaque
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 sm:w-24 h-14 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all min-h-[44px] cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-blue-600 scale-102 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specs Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
            <h2 className="font-['Outfit'] font-bold text-base sm:text-lg text-slate-900 mb-3 sm:mb-4">
              Visão Rápida da Moto
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Ano Fabricação/Modelo</span>
                </div>
                <span className="font-['Outfit'] font-bold text-sm sm:text-base text-slate-900 tabular-nums">
                  {motorcycle.yearManufacture}/{motorcycle.yearModel}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Gauge className="w-4 h-4 text-slate-400" />
                  <span>Quilometragem</span>
                </div>
                <span className="font-['Outfit'] font-bold text-sm sm:text-base text-slate-900 tabular-nums truncate block">
                  {motorcycle.mileage === 0 ? '0 km (Nova)' : `${motorcycle.mileage.toLocaleString('pt-BR')} km`}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Fuel className="w-4 h-4 text-slate-400" />
                  <span>Combustível</span>
                </div>
                <span className="font-['Outfit'] font-bold text-sm sm:text-base text-slate-900 truncate block">
                  {motorcycle.fuelType}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Cilindrada</span>
                </div>
                <span className="font-['Outfit'] font-bold text-sm sm:text-base text-slate-900 tabular-nums">
                  {motorcycle.engineCapacity} cc
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
            <h2 className="font-['Outfit'] font-bold text-base sm:text-lg text-slate-900">
              Descrição do Vendedor
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {motorcycle.description}
            </p>
          </div>

          {/* Features / Equipamentos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
            <h2 className="font-['Outfit'] font-bold text-base sm:text-lg text-slate-900">
              Itens & Opcionais Inclusos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {motorcycle.features.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 py-0.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Table */}
          {motorcycle.technicalSpecs && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
              <h2 className="font-['Outfit'] font-bold text-base sm:text-lg text-slate-900">
                Ficha Técnica de Fábrica
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Potência Máxima:</span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    {motorcycle.technicalSpecs.powerHp} cv
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Torque Máximo:</span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    {motorcycle.technicalSpecs.torqueNm} Nm
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Peso em Ordem de Marcha:</span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    {motorcycle.technicalSpecs.weightKg} kg
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Capacidade do Tanque:</span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    {motorcycle.technicalSpecs.tankCapacityL} litros
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Consumo Médio Estimado:</span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    {motorcycle.technicalSpecs.consumptionKmPerL} km/l
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Câmbio:</span>
                  <span className="font-bold text-slate-800">{motorcycle.transmission}</span>
                </div>
                {motorcycle.technicalSpecs.frontBrake && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100 sm:col-span-2">
                    <span className="text-slate-500">Freio Dianteiro:</span>
                    <span className="font-bold text-slate-800">{motorcycle.technicalSpecs.frontBrake}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Column (Price, Seller Box, Loan Simulator) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Contiguous Purchase / Contact Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  {motorcycle.brand}
                </span>
                <span aria-hidden="true">·</span>
                <span>{motorcycle.city}, {motorcycle.state}</span>
              </div>
              <h1 className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-slate-900 leading-tight">
                {motorcycle.title}
              </h1>
            </div>

            {/* Price section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-0.5">Preço à vista</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                {formatCurrency(motorcycle.price)}
              </span>

              {motorcycle.fipePrice > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Referência Tabela FIPE:</span>
                  <span className="font-bold text-slate-700 tabular-nums">
                    {formatCurrency(motorcycle.fipePrice)}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop WhatsApp Contact CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-200 transition-all hover:scale-[1.01] min-h-[44px]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chamar Vendedor no WhatsApp</span>
            </a>

            {/* Seller profile info */}
            <div className="p-4 border border-slate-100 rounded-xl bg-white space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{motorcycle.sellerName}</h4>
                  <span className="text-[11px] text-slate-500 capitalize block">
                    {motorcycle.sellerType === 'concessionaria' ? 'Revenda de Veículos' : 'Vendedor Particular'}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Localizado em {motorcycle.city} - {motorcycle.state}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Dica do Portal: Exija vistoria cautelar e nunca transfira valores de sinal antecipado sem ver a moto.
              </span>
            </div>
          </div>

          {/* Contextual Loan Simulator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Calculator className="w-4 h-4 text-blue-600" />
              <h3 className="font-['Outfit'] font-bold text-sm text-slate-900">
                Financiamento desta Moto
              </h3>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                <span>Entrada</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {downPayment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={motorcycle.price * 0.8}
                step="500"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2"
              />
            </div>

            <div>
              <span className="block text-xs text-slate-600 mb-1.5 font-medium">Prazo</span>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {[12, 24, 36, 48].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMonths(m)}
                    className={`py-2 rounded-lg font-bold transition-all min-h-[40px] cursor-pointer ${
                      months === m
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {m}x
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
              <span className="text-[11px] text-slate-600 block">Parcela Estimada:</span>
              <span className="text-lg sm:text-xl font-extrabold text-blue-600 tabular-nums">
                {monthlyInstallment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Taxa de 1,69% a.m. (sujeito à análise de crédito)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Floating Bottom Contact Bar (Best practice on vehicle portals) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Valor à vista
          </span>
          <span className="text-base font-extrabold text-slate-900 tabular-nums truncate block">
            {formatCurrency(motorcycle.price)}
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md transition-all shrink-0 min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Falar no WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
