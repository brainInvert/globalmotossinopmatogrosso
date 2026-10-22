import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  Calculator,
  Zap,
  ArrowRight,
  Bike
} from 'lucide-react';
import { Motorcycle, MotorcycleCategory } from '../types/motorcycle';
import { api } from '../services/api';
import { MotorcycleCard } from '../components/MotorcycleCard';

import heroImg from '../assets/images/hero_portal_motos_1792660797180.jpg';
import trailImg from '../assets/images/category_adventure_trail_1792660796794.jpg';
import nakedImg from '../assets/images/category_naked_street_1792660797743.jpg';
import sportImg from '../assets/images/category_sport_superbike_1792660798613.jpg';
import scooterImg from '../assets/images/category_urban_scooter_1792660799028.jpg';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Search form states
  const [searchBrand, setSearchBrand] = useState('');
  const [searchCategory, setSearchCategory] = useState<string>('');
  const [searchMaxPrice, setSearchMaxPrice] = useState<string>('');
  const [searchState, setSearchState] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Featured motos
  const [featuredMotos, setFeaturedMotos] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick simulator states
  const [simPrice, setSimPrice] = useState<number>(35000);
  const [simDown, setSimDown] = useState<number>(7000);
  const [simMonths, setSimMonths] = useState<number>(36);

  useEffect(() => {
    async function loadData() {
      try {
        const list = await api.getMotorcycles();
        setFeaturedMotos(list.slice(0, 6));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('query', searchQuery.trim());
    if (searchBrand) params.append('brand', searchBrand);
    if (searchCategory) params.append('category', searchCategory);
    if (searchMaxPrice) params.append('maxPrice', searchMaxPrice);
    if (searchState) params.append('state', searchState);

    navigate(`/motos?${params.toString()}`);
  };

  // Calculate simulated monthly payment
  const financedAmount = Math.max(0, simPrice - simDown);
  const monthlyRate = 0.0169; // 1.69% a.m. average CDC
  const simInstallment = financedAmount > 0
    ? (financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, simMonths))) / (Math.pow(1 + monthlyRate, simMonths) - 1)
    : 0;

  const categories = [
    { id: 'trail', name: 'Trail & Adventure', count: 'BMW GS, CB500X, Tiger', img: trailImg },
    { id: 'street', name: 'Naked & Street', count: 'MT-07, CB650R, Titan', img: nakedImg },
    { id: 'sport', name: 'Esportivas', count: 'Panigale, Ninja, CBR', img: sportImg },
    { id: 'scooter', name: 'Scooter & City', count: 'TMAX, PCX, NMAX, Biz', img: scooterImg }
  ];

  const popularBrands = [
    'Honda', 'Yamaha', 'BMW', 'Kawasaki', 'Triumph', 'Ducati', 'Royal Enfield', 'Harley-Davidson', 'Suzuki'
  ];

  return (
    <div className="space-y-16">
      {/* 1. Hero Section with Integrated Search */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background photo with contrast scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Showroom de motos modernas Global Motos"
            className="w-full h-full object-cover opacity-35 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/25 border border-blue-500/40 rounded-lg text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Bike className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Global Motos · Concessionária & Estoque Digital</span>
            </div>
            <h1 className="font-['Outfit'] text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight">
              Acelere rumo à sua próxima moto.
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Encontre modelos seminovos e zero km verificados, simule parcelas na hora e negocie diretamente com a nossa equipe pelo WhatsApp.
            </p>
          </div>

          {/* Integrated Search Console */}
          <div className="mt-8 sm:mt-10 bg-white rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-900 border border-slate-100 max-w-4xl">
            <form onSubmit={handleSearchSubmit} className="space-y-3 sm:space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Marca, modelo ou cc (ex: MT-07, BMW 1250, Ninja, PCX...)"
                  className="w-full pl-10.5 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {/* Brand select */}
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Marca
                  </label>
                  <select
                    value={searchBrand}
                    onChange={(e) => setSearchBrand(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 min-h-[42px]"
                  >
                    <option value="">Todas as Marcas</option>
                    {popularBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Category select */}
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Estilo
                  </label>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 min-h-[42px]"
                  >
                    <option value="">Todas as Categorias</option>
                    <option value="trail">Trail / Big Trail</option>
                    <option value="street">Naked / Street</option>
                    <option value="sport">Esportiva</option>
                    <option value="scooter">Scooter / Cub</option>
                    <option value="custom">Custom / Bobber</option>
                    <option value="touring">Touring</option>
                  </select>
                </div>

                {/* Max price */}
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Preço Até
                  </label>
                  <select
                    value={searchMaxPrice}
                    onChange={(e) => setSearchMaxPrice(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 min-h-[42px]"
                  >
                    <option value="">Sem limite</option>
                    <option value="25000">Até R$ 25.000</option>
                    <option value="45000">Até R$ 45.000</option>
                    <option value="70000">Até R$ 70.000</option>
                    <option value="100000">Até R$ 100.000</option>
                    <option value="150000">Até R$ 150.000</option>
                  </select>
                </div>

                {/* State UF */}
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Estado (UF)
                  </label>
                  <select
                    value={searchState}
                    onChange={(e) => setSearchState(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 min-h-[42px]"
                  >
                    <option value="">Brasil inteiro</option>
                    <option value="SP">São Paulo (SP)</option>
                    <option value="RJ">Rio de Janeiro (RJ)</option>
                    <option value="MG">Minas Gerais (MG)</option>
                    <option value="PR">Paraná (PR)</option>
                    <option value="SC">Santa Catarina (SC)</option>
                    <option value="RS">Rio Grande do Sul (RS)</option>
                    <option value="GO">Goiás (GO)</option>
                    <option value="MT">Mato Grosso (MT)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                  <span className="font-medium">Populares:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Honda', 'Yamaha', 'BMW', 'Kawasaki'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setSearchBrand(b);
                          navigate(`/motos?brand=${b}`);
                        }}
                        className="text-slate-700 hover:text-blue-600 font-semibold underline decoration-slate-300 transition-colors py-1 cursor-pointer"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Ver Estoque Disponível</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Categories Visual Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-['Outfit'] text-2xl font-extrabold text-slate-900 tracking-tight">
              Navegue por Estilo de Pilotagem
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Escolha a categoria que combina com a sua rotina e sonhos de estrada
            </p>
          </div>
          <Link
            to="/motos"
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Ver todas</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/motos?category=${cat.id}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-75"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-['Outfit'] font-bold text-lg leading-tight group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-['Outfit'] text-2xl font-extrabold text-slate-900 tracking-tight">
              Motos em Destaque
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Motos inspecionadas e revisadas no estoque da Global Motos
            </p>
          </div>
          <Link
            to="/motos"
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Explorar catálogo completo ({featuredMotos.length}+ motos)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMotos.map((moto) => (
              <MotorcycleCard key={moto.id} motorcycle={moto} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Quick Financing & Benefits Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl text-white p-8 lg:p-12 overflow-hidden relative shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left copy */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Planejamento & Financiamento
              </span>
              <h2 className="font-['Outfit'] text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Simule as parcelas da sua moto na Global Motos.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Estimativas transparentes com base nas taxas de crédito automotivo atuais. Escolha o valor da moto, a sua entrada e o prazo que cabe no seu bolso.
              </p>

              <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sem compromisso</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Cálculo com Tabela Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp Direto</span>
                </div>
              </div>
            </div>

            {/* Right Mini Calculator Widget */}
            <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                Simulador Rápido
              </h3>

              {/* Price input */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Valor da Moto</span>
                  <span className="text-slate-900 font-bold tabular-nums">
                    {simPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="170000"
                  step="2500"
                  value={simPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSimPrice(val);
                    if (simDown > val * 0.7) setSimDown(Math.round(val * 0.2));
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Down payment */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Valor de Entrada</span>
                  <span className="text-slate-900 font-bold tabular-nums">
                    {simDown.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={simPrice * 0.8}
                  step="1000"
                  value={simDown}
                  onChange={(e) => setSimDown(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Term buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Prazo de Financiamento
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[12, 24, 36, 48].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSimMonths(m)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        simMonths === m
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Result display */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Parcela Estimada:</span>
                  <span className="text-2xl font-extrabold text-blue-600 tabular-nums">
                    {simInstallment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    <span className="text-xs font-normal text-slate-500"> /mês</span>
                  </span>
                </div>
                <Link
                  to="/simulador"
                  className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Brand Logos Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-6">
          Principais montadoras disponíveis na Global Motos
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {popularBrands.map((b) => (
            <Link
              key={b}
              to={`/motos?brand=${b}`}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 shadow-sm transition-all hover:scale-105"
            >
              {b}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
