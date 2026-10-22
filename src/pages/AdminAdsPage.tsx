import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Images,
  Plus,
  Trash2,
  Star,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  ArrowLeft,
  ArrowRight,
  Eye,
  PlusCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { Motorcycle } from '../types/motorcycle';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

// High-resolution presets for rapid motorcycle photos
const MOTO_PHOTO_PRESETS = [
  {
    name: 'BMW Adventure Trail HD',
    url: '/src/assets/images/category_adventure_trail_1792660796794.jpg',
    category: 'Trail / Big Trail'
  },
  {
    name: 'Honda / Yamaha Naked HD',
    url: '/src/assets/images/category_naked_street_1792660797743.jpg',
    category: 'Street / Naked'
  },
  {
    name: 'Ducati Superbike Sport HD',
    url: '/src/assets/images/category_sport_superbike_1792660798613.jpg',
    category: 'Esportiva'
  },
  {
    name: 'Scooter Urbana City HD',
    url: '/src/assets/images/category_urban_scooter_1792660799028.jpg',
    category: 'Scooter'
  },
  {
    name: 'Showroom Global Motos HD',
    url: '/src/assets/images/hero_portal_motos_1792660797180.jpg',
    category: 'Showroom'
  }
];

export const AdminAdsPage: React.FC = () => {
  const { isAuthenticated, isAdmin, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoto, setSelectedMoto] = useState<Motorcycle | null>(null);

  // Photo management state for selected moto
  const [currentPhotos, setCurrentPhotos] = useState<string[]>([]);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [savingPhotos, setSavingPhotos] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      try {
        const list = await api.getMotorcycles();
        setMotorcycles(list);
        if (list.length > 0 && !selectedMoto) {
          setSelectedMoto(list[0]);
          setCurrentPhotos(list[0].images || []);
        }
      } catch (err) {
        console.error('Erro ao carregar anúncios:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, []);

  const selectMotoForPhotos = (moto: Motorcycle) => {
    setSelectedMoto(moto);
    setCurrentPhotos(moto.images && moto.images.length > 0 ? [...moto.images] : []);
    setNotification(null);
  };

  // Add photo via direct URL
  const handleAddPhotoByUrl = () => {
    if (!newUrlInput.trim()) return;
    const url = newUrlInput.trim();
    const updated = [...currentPhotos, url];
    setCurrentPhotos(updated);
    setNewUrlInput('');
    setNotification({ type: 'success', message: 'Foto adicionada à galeria! Clique em Salvar Alterações.' });
  };

  // Upload local photos from device (FileReader to Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    let loadedCount = 0;
    const newImgs: string[] = [];

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImgs.push(event.target.result as string);
        }
        loadedCount++;
        if (loadedCount === fileList.length) {
          setCurrentPhotos((prev) => [...prev, ...newImgs]);
          setNotification({
            type: 'success',
            message: `${newImgs.length} foto(s) carregada(s) do dispositivo! Clique em Salvar Alterações.`
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add preset photo
  const handleAddPreset = (presetUrl: string) => {
    setCurrentPhotos((prev) => [...prev, presetUrl]);
    setNotification({ type: 'success', message: 'Foto de alta definição adicionada! Clique em Salvar Alterações.' });
  };

  // Set photo as primary cover
  const handleSetAsCover = (index: number) => {
    if (index === 0) return;
    const updated = [...currentPhotos];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setCurrentPhotos(updated);
    setNotification({ type: 'success', message: 'Nova foto de capa principal definida! Clique em Salvar Alterações.' });
  };

  // Remove photo
  const handleRemovePhoto = (index: number) => {
    if (currentPhotos.length <= 1) {
      if (!window.confirm('O anúncio precisa de pelo menos uma foto. Deseja realmente remover?')) return;
    }
    const updated = currentPhotos.filter((_, idx) => idx !== index);
    setCurrentPhotos(updated);
    setNotification({ type: 'success', message: 'Foto removida da galeria.' });
  };

  // Move photo left/right
  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentPhotos.length) return;
    const updated = [...currentPhotos];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCurrentPhotos(updated);
  };

  // Persist updated photos to API/Storage
  const handleSavePhotos = async () => {
    if (!selectedMoto) return;
    if (currentPhotos.length === 0) {
      setNotification({ type: 'error', message: 'Adicione pelo menos uma foto para salvar o anúncio.' });
      return;
    }

    setSavingPhotos(true);
    setNotification(null);

    try {
      const updated = await api.updateMotorcycle(selectedMoto.id, {
        images: currentPhotos
      });

      // Update state
      setMotorcycles((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, images: updated.images } : m))
      );
      setSelectedMoto(updated);
      setNotification({
        type: 'success',
        message: 'Galeria de fotos do anúncio atualizada com sucesso no portal!'
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Erro ao salvar alterações de fotos.'
      });
    } finally {
      setSavingPhotos(false);
    }
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Filtered ads
  const filteredMotorcycles = motorcycles.filter((m) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      m.title.toLowerCase().includes(q) ||
      m.brand.toLowerCase().includes(q) ||
      m.model.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q)
    );
  });

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-['Outfit'] font-bold text-2xl text-slate-900">
          Acesso Restrito ao Administrador
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Esta aba é reservada para a administração da Global Motos gerenciar anúncios e fazer upload de fotos. Faça login com as credenciais de administrador para prosseguir.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-sm shadow-blue-200"
        >
          Entrar como Administrador
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Images className="w-4 h-4" />
            <span>Aba de Anúncios & Gestão Visual</span>
          </div>
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gerenciador de Anúncios e Fotos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Selecione qualquer moto do estoque para adicionar fotos por arquivo, URL ou galeria HD, definir foto de capa e publicar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/anunciar"
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Nova Moto</span>
          </Link>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-xl border animate-in fade-in duration-150 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Main Grid: Left List of Ads, Right Photo Management Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inventory List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Outfit'] font-bold text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Estoque de Motos</span>
              <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                {motorcycles.length}
              </span>
            </h2>
            <span className="text-[11px] text-slate-400">Clique para editar fotos</span>
          </div>

          {/* Search filter input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por marca, modelo ou cidade..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          {/* List of Ads */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-10 text-xs text-slate-400">Carregando anúncios...</div>
            ) : filteredMotorcycles.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                Nenhum anúncio encontrado para a busca.
              </div>
            ) : (
              filteredMotorcycles.map((moto) => {
                const isSelected = selectedMoto?.id === moto.id;
                const photoCount = moto.images?.length || 0;
                return (
                  <button
                    key={moto.id}
                    type="button"
                    onClick={() => selectMotoForPhotos(moto)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <img
                      src={moto.images[0] || '/src/assets/images/category_naked_street_1792660797743.jpg'}
                      alt={moto.title}
                      className="w-16 h-12 object-cover rounded-lg shrink-0 border border-slate-100"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-['Outfit'] font-bold text-xs text-slate-900 truncate">
                          {moto.brand} {moto.model}
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100/70 px-1.5 py-0.5 rounded shrink-0">
                          📷 {photoCount}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-700">
                        {formatCurrency(moto.price)}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {moto.yearModel} · {moto.category} · {moto.city}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Dedicated Photo Studio (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
          {selectedMoto ? (
            <>
              {/* Active Moto Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                    Editando fotos do anúncio:
                  </span>
                  <h3 className="font-['Outfit'] text-xl font-extrabold text-slate-900">
                    {selectedMoto.brand} {selectedMoto.model} {selectedMoto.version ? `· ${selectedMoto.version}` : ''}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Preço: {formatCurrency(selectedMoto.price)} · Ano {selectedMoto.yearModel} · {currentPhotos.length} fotos na galeria
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/moto/${selectedMoto.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ver no Site</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSavePhotos}
                    disabled={savingPhotos}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-200 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{savingPhotos ? 'Salvando...' : 'Salvar Alterações'}</span>
                  </button>
                </div>
              </div>

              {/* Photo Upload & Add Controls */}
              <div className="space-y-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block">
                  Adicionar Novas Fotos ao Anúncio
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Option */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      1. Upload do seu celular / computador
                    </label>
                    <label className="flex items-center justify-center gap-2 p-2.5 bg-white border border-dashed border-blue-400 hover:border-blue-600 rounded-lg cursor-pointer transition-colors text-xs font-semibold text-blue-700">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Escolher Fotos do Arquivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* URL Input Option */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      2. Inserir link de imagem da Web
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newUrlInput}
                        onChange={(e) => setNewUrlInput(e.target.value)}
                        placeholder="https://exemplo.com/foto.jpg"
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={handleAddPhotoByUrl}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shrink-0 cursor-pointer"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stock HD Presets */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-600 block mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>3. Inserir Fotos Rápidas em Alta Resolução (Presets do Sistema)</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {MOTO_PHOTO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddPreset(preset.url)}
                        className="text-[11px] font-medium bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-blue-600" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photos Gallery Management Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Galeria Atual ({currentPhotos.length} fotos)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    A primeira foto da esquerda é a Capa Principal do anúncio.
                  </span>
                </div>

                {currentPhotos.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                    Nenhuma foto cadastrada neste anúncio. Use as opções acima para adicionar fotos.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currentPhotos.map((imgUrl, index) => {
                      const isCover = index === 0;
                      return (
                        <div
                          key={index}
                          className={`group relative aspect-[4/3] rounded-xl overflow-hidden border bg-slate-100 transition-all ${
                            isCover ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />

                          {/* Cover badge */}
                          {isCover && (
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" />
                              <span>Capa Principal</span>
                            </div>
                          )}

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <div className="flex justify-end gap-1">
                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsCover(index)}
                                  className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                  title="Definir como foto de capa"
                                >
                                  <Star className="w-3 h-3" />
                                  <span>Capa</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(index)}
                                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer"
                                title="Remover esta foto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-white text-[10px]">
                              <span>Foto {index + 1} de {currentPhotos.length}</span>
                              <div className="flex gap-1">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMovePhoto(index, 'left')}
                                    className="p-1 bg-white/20 hover:bg-white/40 rounded cursor-pointer"
                                    title="Mover para esquerda"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}
                                {index < currentPhotos.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMovePhoto(index, 'right')}
                                    className="p-1 bg-white/20 hover:bg-white/40 rounded cursor-pointer"
                                    title="Mover para direita"
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Save Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Total de {currentPhotos.length} foto(s) configurada(s).
                </span>
                <button
                  type="button"
                  onClick={handleSavePhotos}
                  disabled={savingPhotos}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-sm shadow-blue-200 transition-all cursor-pointer"
                >
                  {savingPhotos ? 'Salvando...' : 'Salvar Fotos do Anúncio'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-xs text-slate-400">
              Selecione uma moto à esquerda para gerenciar as fotos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
