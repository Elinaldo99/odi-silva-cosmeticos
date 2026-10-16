import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductCard } from './ProductCard';

interface BestSellersSectionProps {
  onViewAllBestSellers: () => void;
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({ onViewAllBestSellers }) => {
  const { products } = useCart();

  const bestSellers = products.filter((p) => p.mais_vendido);

  if (bestSellers.length === 0) return null;

  return (
    <section className="py-16 bg-[#FFF8F9]/70 border-t border-pink-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold tracking-wide mb-2.5">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>Favoritos das Clientes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Mais Vendidos
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Conheça os queridinhos mais pedidos e elogiados de Odi Silva Cosméticos.
            </p>
          </div>

          <button
            onClick={onViewAllBestSellers}
            className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 hover:text-pink-800 transition-colors uppercase tracking-wider group"
          >
            <span>Explorar Mais Vendidos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Best sellers grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
