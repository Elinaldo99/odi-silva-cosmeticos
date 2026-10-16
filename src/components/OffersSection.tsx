import React from 'react';
import { Tag, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductCard } from './ProductCard';

interface OffersSectionProps {
  onViewAllOffers: () => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onViewAllOffers }) => {
  const { products } = useCart();

  // Filter products with promo prices or marked as oferta
  const offerProducts = products.filter(
    (p) => p.oferta || (p.preco_promocional && p.preco_promocional < p.preco)
  );

  if (offerProducts.length === 0) return null;

  return (
    <section id="ofertas" className="py-16 bg-gradient-to-b from-[#FFF8F9] to-white relative overflow-hidden">
      {/* Soft background ambient accent */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and "Ver todas" action */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold tracking-wide mb-2.5">
              <Tag className="w-3.5 h-3.5 text-pink-600" />
              <span>Descontos Imperdíveis</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Ofertas Especiais</span>
              <span className="text-pink-500 animate-pulse">💗</span>
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Aproveite valores promocionais exclusivos por tempo limitado para renovar seus cosméticos favoritos.
            </p>
          </div>

          <button
            onClick={onViewAllOffers}
            className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 hover:text-pink-800 transition-colors uppercase tracking-wider group"
          >
            <span>Ver todas as ofertas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
