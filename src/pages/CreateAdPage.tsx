import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Upload,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Image as ImageIcon,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Motorcycle, MotorcycleCategory } from '../types/motorcycle';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BRANDS = ['Honda', 'Yamaha', 'BMW', 'Kawasaki', 'Triumph', 'Ducati', 'Royal Enfield', 'Harley-Davidson', 'Suzuki', 'Dafra', 'KTM', 'Bajaj'];

const CATEGORIES: { id: MotorcycleCategory; label: string }[] = [
  { id: 'street', label: 'Street & Naked' },
  { id: 'trail', label: 'Trail & Adventure' },
  { id: 'sport', label: 'Esportiva' },
  { id: 'scooter', label: 'Scooter & Cub' },
  { id: 'custom', label: 'Custom & Chopper' },
  { id: 'touring', label: 'Touring' }
];

const COMMON_FEATURES = [
  'Freios ABS',
  'Partida Elétrica',
  'Painel Digital LCD / TFT',
  'Controle de Tração',
  'Quickshifter',
  'Faróis Full LED',
  'Aquecedor de Manoplas',
  'Entrada USB',
  'Chave Presencial (Keyless)',
  'Protetor de Motor / Sliders',
  'Baú / Suporte de Bagageiro',
  'Único Dono',
  'IPVA Pago',
  'Manual e Chave Reserva',
  'Revisões em Concessionária'
];

const STOCK_PHOTO_PRESETS = [
  { name: 'Trail / Big Trail HD', url: '/src/assets/images/category_adventure_trail_1792660796794.jpg' },
  { name: 'Naked / Street HD', url: '/src/assets/images/category_naked_street_1792660797743.jpg' },
  { name: 'Superbike Esportiva HD', url: '/src/assets/images/category_sport_superbike_1792660798613.jpg' },
  { name: 'Scooter Urbana HD', url: '/src/assets/images/category_urban_scooter_1792660799028.jpg' },
  { name: 'Showroom Global Motos HD', url: '/src/assets/images/hero_portal_motos_1792660797180.jpg' }
];

export const CreateAdPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, openAuthModal } = useAuth();

  // Form Fields
  const [brand, setBrand] = useState('Honda');
  const [model, setModel] = useState('');
  const [version, setVersion] = useState('');
  const [category, setCategory] = useState<MotorcycleCategory>('street');
  const [yearManufacture, setYearManufacture] = useState(2024);
  const [yearModel, setYearModel] = useState(2024);
  const [price, setPrice] = useState<number | ''>('');
  const [fipePrice, setFipePrice] = useState<number | ''>('');
  const [mileage, setMileage] = useState<number | ''>('');
  const [engineCapacity, setEngineCapacity] = useState<number | ''>(500);
  const [fuelType, setFuelType] = useState<'Gasolina' | 'Flex' | 'Elétrica' | 'Diesel' | 'Híbrido'>('Gasolina');
  const [transmission, setTransmission] = useState<'Manual' | 'Automático' | 'CVT' | 'Quickshifter' | 'Semi-Automático'>('Manual');
  const [color, setColor] = useState('Preto');
  const [state, setState] = useState('SP');
  const [city, setCity] = useState('São Paulo');
  const [description, setDescription] = useState('');
  const [sellerName, setSellerName] = useState('Global Motos Concessionária');
  const [sellerPhone, setSellerPhone] = useState('11999990000');
  const [sellerType, setSellerType] = useState<'particular' | 'concessionaria'>('concessionaria');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Freios ABS',
    'Partida Elétrica',
    'IPVA Pago'
  ]);

  // Images state
  const [images, setImages] = useState<string[]>([
    '/src/assets/images/category_naked_street_1792660797743.jpg'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // If editing, load data
  useEffect(() => {
    async function loadToEdit() {
      if (!id) return;
      try {
        const item = await api.getMotorcycleById(id);
        if (item) {
          setBrand(item.brand);
          setModel(item.model);
          setVersion(item.version || '');
          setCategory(item.category);
          setYearManufacture(item.yearManufacture);
          setYearModel(item.yearModel);
          setPrice(item.price);
          setFipePrice(item.fipePrice);
          setMileage(item.mileage);
          setEngineCapacity(item.engineCapacity);
          setFuelType(item.fuelType);
          setTransmission(item.transmission);
          setColor(item.color);
          setState(item.state);
          setCity(item.city);
          setDescription(item.description);
          setSellerName(item.sellerName || 'Global Motos Concessionária');
          setSellerPhone(item.sellerPhone || '11999990000');
          setSellerType(item.sellerType || 'concessionaria');
          setSelectedFeatures(item.features || []);
          if (item.images && item.images.length > 0) {
            setImages(item.images);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadToEdit();
  }, [id]);

  // Auth enforcement: Only admin can advertise
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-['Outfit'] font-bold text-2xl text-slate-900">
          Acesso Restrito ao Administrador
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Apenas a administração da Global Motos tem autorização para cadastrar, editar e publicar anúncios no sistema.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 transition-all cursor-pointer"
        >
          Entrar como Administrador
        </button>
      </div>
    );
  }

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setImages(updated);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!model.trim() || !price || !mileage === undefined) {
      setErrorMessage('Por favor, preencha modelo, ano, preço e quilometragem.');
      return;
    }

    if (images.length === 0) {
      setErrorMessage('Adicione pelo menos 1 foto da motocicleta.');
      return;
    }

    setIsSubmitting(true);

    const payload: Partial<Motorcycle> = {
      title: `${brand} ${model} ${version ? version : ''}`.trim(),
      brand,
      model,
      version,
      category,
      yearManufacture: Number(yearManufacture),
      yearModel: Number(yearModel),
      price: Number(price),
      fipePrice: fipePrice ? Number(fipePrice) : Number(price) * 1.05,
      mileage: Number(mileage),
      engineCapacity: Number(engineCapacity) || 300,
      fuelType,
      transmission,
      color,
      state,
      city,
      description,
      sellerName: sellerName || user?.name || 'Global Motos Concessionária',
      sellerPhone: sellerPhone || user?.phone || '11999990000',
      sellerType,
      images,
      features: selectedFeatures
    };

    try {
      if (isEditing && id) {
        await api.updateMotorcycle(id, payload);
        setSuccessMessage('Anúncio atualizado com sucesso!');
        setTimeout(() => navigate('/admin/anuncios'), 1200);
      } else {
        const created = await api.createMotorcycle(payload);
        setSuccessMessage('Moto cadastrada e publicada no catálogo com sucesso!');
        setTimeout(() => navigate(`/moto/${created.id}`), 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao salvar anúncio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/admin/anuncios"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para a Aba de Anúncios</span>
        </Link>
        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
          Painel de Gestão · Global Motos
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
        <div>
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEditing ? 'Editar Anúncio da Moto' : 'Cadastrar Moto no Estoque'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Preencha os dados técnicos, fotos em alta resolução e valor de venda para publicar na Global Motos.
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-2.5 p-3.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Identification */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span>1. Identificação da Motocicleta</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Marca *</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                >
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: CB 650R, MT-09, R 1250 GS"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Versão / Edição</label>
                <input
                  type="text"
                  placeholder="Ex: Neo Sports Cafe, Triple Black, ABS"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MotorcycleCategory)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cilindrada (cc) *</label>
                <input
                  type="number"
                  required
                  placeholder="Ex: 650"
                  value={engineCapacity}
                  onChange={(e) => setEngineCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ano Fabricação *</label>
                <input
                  type="number"
                  required
                  min={1990}
                  max={2027}
                  value={yearManufacture}
                  onChange={(e) => setYearManufacture(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ano Modelo *</label>
                <input
                  type="number"
                  required
                  min={1990}
                  max={2027}
                  value={yearModel}
                  onChange={(e) => setYearModel(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 2. Values and Condition */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 border-b border-slate-100 pb-2">
              2. Valores e Quilometragem
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preço de Venda (R$) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ex: 48900"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white font-bold text-slate-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valor Tabela FIPE (Opcional R$)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 51200"
                  value={fipePrice}
                  onChange={(e) => setFipePrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quilometragem (km) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="0 se for zero km"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Combustível</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                >
                  <option value="Gasolina">Gasolina</option>
                  <option value="Flex">Flex (Álcool/Gasolina)</option>
                  <option value="Elétrica">Elétrica</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Câmbio</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                  <option value="CVT">CVT</option>
                  <option value="Quickshifter">Quickshifter</option>
                  <option value="Semi-Automático">Semi-Automático</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cor</label>
                <input
                  type="text"
                  placeholder="Ex: Vermelho, Preto"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade / UF *</label>
                <input
                  type="text"
                  placeholder="São Paulo, SP"
                  value={`${city}, ${state}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    setCity(parts[0]?.trim() || '');
                    if (parts[1]) setState(parts[1]?.trim().toUpperCase().slice(0, 2));
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 3. Photos Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>3. Galeria de Fotos do Anúncio ({images.length})</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                A 1ª foto é a Capa Principal do anúncio
              </span>
            </div>

            {/* Photo upload options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {/* File upload */}
              <div>
                <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Upload do celular / computador:
                </span>
                <label className="flex items-center justify-center gap-2 p-2 bg-white border border-dashed border-blue-400 hover:border-blue-600 rounded-lg cursor-pointer transition-colors text-xs font-semibold text-blue-700">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Selecionar Fotos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL */}
              <div>
                <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Ou adicione URL da foto:
                </span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shrink-0"
                  >
                    Inserir
                  </button>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Presets HD Rápidos:</span>
              </span>
              {STOCK_PHOTO_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImages((prev) => [...prev, preset.url])}
                  className="text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition-colors"
                >
                  + {preset.name}
                </button>
              ))}
            </div>

            {/* Thumbnail Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {images.map((img, index) => {
                const isCover = index === 0;
                return (
                  <div
                    key={index}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border bg-slate-100 group ${
                      isCover ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {isCover && (
                      <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        <span>Capa</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(index)}
                          className="p-1.5 bg-blue-600 text-white rounded text-[10px] font-bold cursor-pointer"
                          title="Definir como capa"
                        >
                          Capa
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 bg-rose-600 text-white rounded cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Description & Features */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 border-b border-slate-100 pb-2">
              4. Descrição e Opcionais
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descrição Detalhada do Veículo
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o estado dos pneus, revisões efetuadas, acessórios instalados e histórico de conservação..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Opcionais e Itens de Série
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMMON_FEATURES.map((feat) => {
                  const checked = selectedFeatures.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      className={`text-left p-2 rounded-lg border text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        checked
                          ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{feat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/admin/anuncios"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancelar e Voltar
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-sm shadow-blue-200 transition-all cursor-pointer min-h-[44px]"
            >
              {isSubmitting ? (
                <span>Salvando Informações...</span>
              ) : (
                <span>{isEditing ? 'Atualizar Moto no Estoque' : 'Publicar Moto no Catálogo'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
