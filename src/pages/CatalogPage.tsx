import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  ChevronDown,
  Filter,
  Check
} from 'lucide-react';
import { Motorcycle, MotorcycleCategory, MotorcycleFilterParams } from '../types/motorcycle';
import { api } from '../services/api';
import { MotorcycleCard } from '../components/MotorcycleCard';

const BRANDS = ['Honda', 'Yamaha', 'BMW', 'Kawasaki', 'Triumph', 'Ducati', 'Royal Enfield', 'Harley-Davidson', 'Suzuki'];

const CATEGORIES: { id: MotorcycleCategory; label: string }[] = [
  { id: 'trail', label: 'Trail & Big Trail' },
  { id: 'street', label: 'Street & Naked' },
  { id: 'sport', label: 'Esportivas' },
  { id: 'scooter', label: 'Scooter & Cub' },
  { id: 'custom', label: 'Custom & Chopper' },
  { id: 'touring', label: 'Touring' }
];

const STATES = [
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'PR', name: 'Paraná' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'ES', name: 'Espírito Santo' }
];

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL
  const queryParam = searchParams.get('query') || '';
  const brandParam = searchParams.get('brand') || '';
  const categoryParam = (searchParams.get('category') as MotorcycleCategory) || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const minYearParam = searchParams.get('minYear') || '';
  const maxYearParam = searchParams.get('maxYear') || '';
  const minCcParam = searchParams.get('minEngineCapacity') || '';
  const maxCcParam = searchParams.get('maxEngineCapacity') || '';
  const stateParam = searchParams.get('state') || '';
  const sellerTypeParam = searchParams.get('sellerType') || '';
  const sortByParam = (searchParams.get('sortBy') as any) || 'recent';

  // Local filter states
  const [query, setQuery] = useState(queryParam);
  const [brand, setBrand] = useState(brandParam);
  const [category, setCategory] = useState<MotorcycleCategory | ''>(categoryParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [minYear, setMinYear] = useState(minYearParam);
  const [maxYear, setMaxYear] = useState(maxYearParam);
  const [minCc, setMinCc] = useState(minCcParam);
  const [maxCc, setMaxCc] = useState(maxCcParam);
  const [state, setState] = useState(stateParam);
  const [sellerType, setSellerType] = useState(sellerTypeParam);
  const [sortBy, setSortBy] = useState(sortByParam);

  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    setQuery(searchParams.get('query') || '');
    setBrand(searchParams.get('brand') || '');
    setCategory((searchParams.get('category') as MotorcycleCategory) || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setMinYear(searchParams.get('minYear') || '');
    setMaxYear(searchParams.get('maxYear') || '');
    setMinCc(searchParams.get('minEngineCapacity') || '');
    setMaxCc(searchParams.get('maxEngineCapacity') || '');
    setState(searchParams.get('state') || '');
    setSellerType(searchParams.get('sellerType') || '');
    setSortBy((searchParams.get('sortBy') as any) || 'recent');
  }, [searchParams]);

  // Fetch data
  useEffect(() => {
    async function fetchFiltered() {
      setLoading(true);
      try {
        const filters: MotorcycleFilterParams = {
          query: queryParam || undefined,
          brand: brandParam || undefined,
          category: categoryParam || undefined,
          minPrice: minPriceParam ? parseInt(minPriceParam, 10) : undefined,
          maxPrice: maxPriceParam ? parseInt(maxPriceParam, 10) : undefined,
          minYear: minYearParam ? parseInt(minYearParam, 10) : undefined,
          maxYear: maxYearParam ? parseInt(maxYearParam, 10) : undefined,
          minEngineCapacity: minCcParam ? parseInt(minCcParam, 10) : undefined,
          maxEngineCapacity: maxCcParam ? parseInt(maxCcParam, 10) : undefined,
          state: stateParam || undefined,
          sellerType: (sellerTypeParam as any) || undefined,
          sortBy: sortByParam
        };

        const results = await api.getMotorcycles(filters);
        setMotorcycles(results);
      } catch (err) {
        console.error('Failed to load catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFiltered();
  }, [
    queryParam,
    brandParam,
    categoryParam,
    minPriceParam,
    maxPriceParam,
    minYearParam,
    maxYearParam,
    minCcParam,
    maxCcParam,
    stateParam,
    sellerTypeParam,
    sortByParam
  ]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.append('query', query.trim());
    if (brand) params.append('brand', brand);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (minYear) params.append('minYear', minYear);
    if (maxYear) params.append('maxYear', maxYear);
    if (minCc) params.append('minEngineCapacity', minCc);
    if (maxCc) params.append('maxEngineCapacity', maxCc);
    if (state) params.append('state', state);
    if (sellerType) params.append('sellerType', sellerType);
    if (sortBy) params.append('sortBy', sortBy);

    setSearchParams(params);
    setMobileFiltersOpen(false);
  };

  const handleResetFilters = () => {
    setQuery('');
    setBrand('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinYear('');
    setMaxYear('');
    setMinCc('');
    setMaxCc('');
    setState('');
    setSellerType('');
    setSortBy('recent');
    setSearchParams(new URLSearchParams());
  };

  const activeFiltersCount = [
    brand,
    category,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    minCc,
    maxCc,
    state,
    sellerType
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters();
          }}
          className="flex flex-col sm:flex-row items-stretch gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por modelo, versão, marca ou cidade..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-['Outfit'] font-bold text-base text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                Filtros de Busca
              </span>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpar
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
                Marca
              </label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="">Todas as marcas</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
                Estilo / Categoria
              </label>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setCategory('')}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    category === ''
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Todas</span>
                  {category === '' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      category === cat.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {category === cat.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
                Preço (R$)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 tabular-nums"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 tabular-nums"
                />
              </div>
            </div>

            {/* Year Range */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
                Ano Modelo
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="De (ex: 2020)"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 tabular-nums"
                />
                <input
                  type="number"
                  placeholder="Até (ex: 2026)"
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 tabular-nums"
                />
              </div>
            </div>

            {/* Engine Capacity (cc) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
                Cilindrada (cc)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Mín cc"
                  value={minCc}
                  onChange={(e) => setMinCc(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 tabular-nums"
                />
                <input
                  type="number"
                  placeholder="Máx cc"
                  value={maxCc}
                  onChange={(e) => setMaxCc(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 tabular-nums"
                />
              </div>
            </div>

            {/* State UF */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
                Localização (Estado)
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="">Todo o Brasil</option>
                {STATES.map((st) => (
                  <option key={st.uf} value={st.uf}>
                    {st.name} ({st.uf})
                  </option>
                ))}
              </select>
            </div>

            {/* Seller Type */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
                Tipo de Vendedor
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSellerType(sellerType === 'particular' ? '' : 'particular')}
                  className={`p-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    sellerType === 'particular'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Particular
                </button>
                <button
                  type="button"
                  onClick={() => setSellerType(sellerType === 'concessionaria' ? '' : 'concessionaria')}
                  className={`p-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    sellerType === 'concessionaria'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Revenda
                </button>
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={applyFilters}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Aplicar Filtros
            </button>
          </div>
        </aside>

        {/* Results Main Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-['Outfit'] font-bold text-lg text-slate-900">
                Motos à Venda
              </h1>
              <p className="text-xs text-slate-500">
                {loading
                  ? 'Carregando anúncios...'
                  : `${motorcycles.length} motos encontradas`}
                {brand ? ` · Marca: ${brand}` : ''}
                {category ? ` · Categoria: ${category}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const p = new URLSearchParams(searchParams);
                  p.set('sortBy', e.target.value);
                  setSearchParams(p);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="recent">Mais Recentes / Destaques</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="year_desc">Ano Mais Novo</option>
                <option value="mileage_asc">Menor Quilometragem</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-88 bg-slate-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : motorcycles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {motorcycles.map((moto) => (
                <MotorcycleCard key={moto.id} motorcycle={moto} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                Nenhuma moto encontrada com esses filtros
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tente ajustar os critérios de busca, remover restrições de preço ou selecionar todo o Brasil.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpar todos os filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileFiltersOpen(false);
          }}
        >
          <div className="w-full max-w-sm bg-white min-h-screen p-5 sm:p-6 space-y-5 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-['Outfit'] font-bold text-lg text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                  Filtrar Motos
                </span>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  aria-label="Fechar filtros"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase">
                  Marca
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]"
                >
                  <option value="">Todas as marcas</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]"
                >
                  <option value="">Todas as categorias</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase">
                  Faixa de Preço (R$)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Mínimo"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Máximo"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]"
                  />
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase">
                  Ano Modelo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    placeholder="De (ano)"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]"
                  />
                  <input
                    type="number"
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                    placeholder="Até (ano)"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]"
                  />
                </div>
              </div>

              {/* Engine CC */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase">
                  Cilindrada (cc)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minCc}
                    onChange={(e) => setMinCc(e.target.value)}
                    placeholder="Mín cc"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]"
                  />
                  <input
                    type="number"
                    value={maxCc}
                    onChange={(e) => setMaxCc(e.target.value)}
                    placeholder="Máx cc"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase">
                  Estado (UF)
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]"
                >
                  <option value="">Todo o Brasil</option>
                  {STATES.map((s) => (
                    <option key={s.uf} value={s.uf}>{s.name} ({s.uf})</option>
                  ))}
                </select>
              </div>

              {/* Seller Type */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase">
                  Tipo de Vendedor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSellerType(sellerType === 'particular' ? '' : 'particular')}
                    className={`p-2.5 text-xs font-bold rounded-lg border text-center transition-colors min-h-[44px] ${
                      sellerType === 'particular'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Particular
                  </button>
                  <button
                    type="button"
                    onClick={() => setSellerType(sellerType === 'concessionaria' ? '' : 'concessionaria')}
                    className={`p-2.5 text-xs font-bold rounded-lg border text-center transition-colors min-h-[44px] ${
                      sellerType === 'concessionaria'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Revenda
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-3 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl min-h-[44px] cursor-pointer"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={applyFilters}
                className="flex-1 py-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm min-h-[44px] cursor-pointer"
              >
                Ver Resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
