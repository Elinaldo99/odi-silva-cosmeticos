import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, Flame, Tag, RotateCcw, PackageOpen } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/categories';
import { useCart } from '../context/CartContext';
import { formatCurrency, getEffectivePrice } from '../config/storeConfig';

export const ProductGrid: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useCart();

  // Additional Filter states
  const [filterOfertasOnly, setFilterOfertasOnly] = useState(false);
  const [filterBestSellersOnly, setFilterBestSellersOnly] = useState(false);
  const [filterPriceRange, setFilterPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search filter (name or category or description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.nome.toLowerCase().includes(query);
        const matchesCategory = product.categoria.toLowerCase().includes(query);
        const matchesDesc = product.descricao.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory && selectedCategory !== 'todas') {
        if (selectedCategory === 'ofertas') {
          if (!product.oferta) return false;
        } else if (product.categoria !== selectedCategory) {
          return false;
        }
      }

      // 3. Quick toggle filters
      if (filterOfertasOnly && !product.oferta) return false;
      if (filterBestSellersOnly && !product.mais_vendido) return false;

      // 4. Price range filter
      const effectivePrice = getEffectivePrice(product);
      if (filterPriceRange === 'under-40' && effectivePrice > 40) return false;
      if (filterPriceRange === '40-80' && (effectivePrice < 40 || effectivePrice > 80)) return false;
      if (filterPriceRange === 'over-80' && effectivePrice < 80) return false;

      return true;
    }).sort((a, b) => {
      const priceA = getEffectivePrice(a);
      const priceB = getEffectivePrice(b);

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'bestsellers') return (b.mais_vendido ? 1 : 0) - (a.mais_vendido ? 1 : 0);
      if (sortBy === 'rating') return (b.avaliacao || 0) - (a.avaliacao || 0);
      return 0; // Default: as listed in inventory
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    filterOfertasOnly,
    filterBestSellersOnly,
    filterPriceRange,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSelectedCategory('todas');
    setSearchQuery('');
    setFilterOfertasOnly(false);
    setFilterBestSellersOnly(false);
    setFilterPriceRange('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'todas' ||
    searchQuery !== '' ||
    filterOfertasOnly ||
    filterBestSellersOnly ||
    filterPriceRange !== 'all';

  return (
    <section id="produtos" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold tracking-wide mb-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Catálogo Completo</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Nossos Cosméticos
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Explore fórmulas premium selecionadas para transformar seu autocuidado.
            </p>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Exibindo <span className="font-bold text-stone-900">{filteredProducts.length}</span> produtos
          </div>
        </div>

        {/* Filter Toolbar Box */}
        <div className="bg-[#FFF8F9] rounded-2xl p-4 sm:p-6 border border-pink-100/90 shadow-xs mb-8 space-y-4">
          {/* Top row: Search Bar & Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <input
                id="search-products-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Buscar produtos pelo nome ou categoria..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-white border border-pink-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-pink-500 shadow-xs"
              />
              <Search className="w-4 h-4 text-pink-500 absolute left-4 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-xs text-stone-400 hover:text-pink-600 p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="md:col-span-4 flex gap-2">
              <select
                id="sort-products-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-3.5 rounded-xl bg-white border border-pink-200 text-sm text-stone-800 font-medium focus:outline-none focus:border-pink-500 shadow-xs cursor-pointer"
              >
                <option value="featured">Destaques da Loja</option>
                <option value="bestsellers">Mais Vendidos</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="rating">Melhor Avaliados</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar (Scrollable on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <span className="text-stone-500 font-semibold shrink-0 mr-1 hidden sm:inline">
              Categorias:
            </span>

            <button
              onClick={() => setSelectedCategory('todas')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
                selectedCategory === 'todas'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-pink-100/60 border border-pink-200/80'
              }`}
            >
              Todas
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-1 ${
                  selectedCategory === cat.slug
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-pink-100/60 border border-pink-200/80'
                }`}
              >
                <span>{cat.nome}</span>
                {cat.slug === 'ofertas' && <span className="text-amber-400">★</span>}
              </button>
            ))}
          </div>

          {/* Secondary Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-pink-100/80">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-500 font-semibold mr-1">Filtros rápidos:</span>

              {/* Ofertas toggle */}
              <button
                onClick={() => setFilterOfertasOnly(!filterOfertasOnly)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border ${
                  filterOfertasOnly
                    ? 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                    : 'bg-white text-stone-600 border-pink-200/80 hover:bg-pink-50'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-pink-600" />
                <span>Em Oferta</span>
              </button>

              {/* Mais Vendidos toggle */}
              <button
                onClick={() => setFilterBestSellersOnly(!filterBestSellersOnly)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border ${
                  filterBestSellersOnly
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                    : 'bg-white text-stone-600 border-pink-200/80 hover:bg-pink-50'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Mais Vendidos</span>
              </button>

              {/* Price Range selector buttons */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-pink-200/80">
                <button
                  onClick={() => setFilterPriceRange('all')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    filterPriceRange === 'all' ? 'bg-pink-600 text-white' : 'text-stone-600'
                  }`}
                >
                  Todos Preços
                </button>
                <button
                  onClick={() => setFilterPriceRange('under-40')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    filterPriceRange === 'under-40' ? 'bg-pink-600 text-white' : 'text-stone-600'
                  }`}
                >
                  Até R$ 40
                </button>
                <button
                  onClick={() => setFilterPriceRange('40-80')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    filterPriceRange === '40-80' ? 'bg-pink-600 text-white' : 'text-stone-600'
                  }`}
                >
                  R$ 40 - R$ 80
                </button>
                <button
                  onClick={() => setFilterPriceRange('over-80')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    filterPriceRange === 'over-80' ? 'bg-pink-600 text-white' : 'text-stone-600'
                  }`}
                >
                  Acima de R$ 80
                </button>
              </div>
            </div>

            {/* Clear Filters button */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-semibold text-pink-700 hover:text-pink-900 flex items-center gap-1 py-1 px-2 rounded hover:bg-pink-100/50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Filtros</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-pink-50/40 rounded-2xl border border-pink-100">
            <PackageOpen className="w-12 h-12 text-pink-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-900">Nenhum produto encontrado</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto mt-1 mb-5">
              Não encontramos produtos para os critérios de busca selecionados. Tente remover filtros ou buscar por outro termo.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-5 py-2.5 rounded-xl bg-pink-600 text-white font-semibold text-xs tracking-wide shadow-sm hover:bg-pink-700 transition-colors"
            >
              Ver Todos os Produtos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
