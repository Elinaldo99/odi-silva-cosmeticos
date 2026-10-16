import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onSelectCategory,
}) => {
  return (
    <div
      onClick={() => onSelectCategory(category.slug)}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border ${
        isSelected
          ? 'border-pink-500 ring-2 ring-pink-500/30 shadow-md'
          : 'border-pink-100 hover:border-pink-300 hover:shadow-lg'
      } bg-white`}
    >
      {/* Aspect Ratio Container */}
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-pink-50">
        <img
          src={category.imagem}
          alt={category.nome}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

        {/* Top tag if category is Ofertas */}
        {category.slug === 'ofertas' && (
          <div className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs tracking-wide">
            OFERTAS ESPECIAIS
          </div>
        )}

        {/* Content bottom */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white flex flex-col justify-end">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide group-hover:text-pink-200 transition-colors">
                {category.nome}
              </h3>
              <p className="text-xs text-white/80 line-clamp-1 mt-0.5 hidden sm:block">
                {category.descricao}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs group-hover:bg-pink-600 text-white flex items-center justify-center shrink-0 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-pink-200 font-semibold group-hover:text-white">
            <span>Ver Produtos</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
