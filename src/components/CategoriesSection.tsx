import React from 'react';
import { CATEGORIES } from '../data/categories';
import { CategoryCard } from './CategoryCard';
import { Sparkles } from 'lucide-react';

interface CategoriesSectionProps {
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categorias" className="py-16 bg-[#FFF8F9]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-700 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Navegue por Categoria</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Categorias em Destaque
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Descubra linhas completas de maquiagem, fragrâncias, skincare e cuidados corporais especialmente selecionadas para você.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.slug}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
