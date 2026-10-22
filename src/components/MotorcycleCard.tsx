import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Gauge, Calendar, MessageCircle, GitCompare, Check } from 'lucide-react';
import { Motorcycle } from '../types/motorcycle';
import { useComparison } from '../context/ComparisonContext';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
}

export const MotorcycleCard: React.FC<MotorcycleCardProps> = ({ motorcycle }) => {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inComp = isInComparison(motorcycle.id);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatMileage = (val: number) => {
    return val === 0 ? '0 km (Nova)' : `${val.toLocaleString('pt-BR')} km`;
  };

  // WhatsApp link formatted for Global Motos
  const whatsappMsg = encodeURIComponent(
    `Olá ${motorcycle.sellerName}! Vi seu anúncio da ${motorcycle.brand} ${motorcycle.model} (${motorcycle.yearModel}) por ${formatCurrency(motorcycle.price)} no site Global Motos e gostaria de mais informações.`
  );
  const whatsappUrl = `https://wa.me/55${motorcycle.sellerPhone.replace(/\D/g, '')}?text=${whatsappMsg}`;

  const primaryImage = motorcycle.images[0] || '/src/assets/images/category_naked_street_1792660797743.jpg';

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {!imageError ? (
          <img
            src={primaryImage}
            alt={`${motorcycle.brand} ${motorcycle.model}`}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <span className="text-sm font-semibold">{motorcycle.brand}</span>
            <span className="text-xs">{motorcycle.model}</span>
          </div>
        )}

        {/* Featured marker */}
        {motorcycle.featured && (
          <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
            Destaque
          </div>
        )}

        {/* Quick Compare action */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (inComp) {
              removeFromComparison(motorcycle.id);
            } else {
              addToComparison(motorcycle);
            }
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-all shadow-sm ${
            inComp
              ? 'bg-blue-600 text-white'
              : 'bg-white/90 text-slate-700 hover:bg-white hover:text-blue-600'
          }`}
          title={inComp ? 'Remover da comparação' : 'Comparar ficha técnica'}
        >
          {inComp ? <Check className="w-4 h-4" /> : <GitCompare className="w-4 h-4" />}
        </button>

        {/* Fipe difference indicator */}
        {motorcycle.fipePrice > motorcycle.price && (
          <div className="absolute bottom-2.5 left-2.5 bg-emerald-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
            Abaixo da Tabela FIPE
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Unboxed Metadata Header */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
            {motorcycle.brand}
          </span>
          <span aria-hidden="true">·</span>
          <span>{motorcycle.engineCapacity}cc</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{motorcycle.category}</span>
        </div>

        {/* Title */}
        <Link to={`/moto/${motorcycle.id}`} className="block group-hover:text-blue-600 transition-colors">
          <h3 className="font-['Outfit'] font-bold text-base text-slate-900 leading-snug line-clamp-1">
            {motorcycle.model} {motorcycle.version ? `· ${motorcycle.version}` : ''}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2.5 mb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              {formatCurrency(motorcycle.price)}
            </span>
            {motorcycle.fipePrice > 0 && (
              <span className="block text-[11px] text-slate-500 tabular-nums">
                FIPE: {formatCurrency(motorcycle.fipePrice)}
              </span>
            )}
          </div>
        </div>

        {/* Specs snippet */}
        <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-slate-100 text-xs text-slate-600 my-auto">
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="tabular-nums">
              {motorcycle.yearManufacture}/{motorcycle.yearModel}
            </span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="tabular-nums">{formatMileage(motorcycle.mileage)}</span>
          </div>
        </div>

        {/* Location & Seller Footer */}
        <div className="mt-3 pt-1 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 truncate max-w-[150px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {motorcycle.city}, {motorcycle.state}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-600 capitalize">
            {motorcycle.sellerType === 'concessionaria' ? 'Revenda' : 'Particular'}
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-3.5 pt-2 grid grid-cols-2 gap-2">
          <Link
            to={`/moto/${motorcycle.id}`}
            className="flex items-center justify-center py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-blue-600 rounded-lg transition-colors text-center"
          >
            Ver Detalhes
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-200 transition-colors text-center"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
