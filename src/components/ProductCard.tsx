import React from 'react';
import { ShoppingBag, Eye, Star, Flame } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, calculateDiscountPercentage, getEffectivePrice } from '../config/storeConfig';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, openProductDetails } = useCart();
  const discount = calculateDiscountPercentage(product.preco, product.preco_promocional);
  const effectivePrice = getEffectivePrice(product);

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-pink-100/90 hover:border-pink-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-pink-50/50">
        <img
          src={product.imagem}
          alt={product.nome}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.oferta && discount > 0 && (
            <span className="px-2 py-1 bg-pink-600 text-white text-[11px] font-bold rounded-lg shadow-sm tracking-wide">
              {discount}% OFF
            </span>
          )}
          {product.mais_vendido && (
            <span className="px-2 py-1 bg-stone-900/90 text-amber-300 text-[11px] font-bold rounded-lg shadow-sm backdrop-blur-xs flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Mais vendido</span>
            </span>
          )}
        </div>

        {/* Stock warning or out-of-stock badge */}
        {product.estoque <= 0 ? (
          <div className="absolute top-2.5 right-2.5 bg-red-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
            Esgotado
          </div>
        ) : product.estoque <= 10 ? (
          <div className="absolute top-2.5 right-2.5 bg-amber-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
            Restam {product.estoque}
          </div>
        ) : null}

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-stone-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={() => openProductDetails(product)}
            className="px-4 py-2 rounded-xl bg-white/95 backdrop-blur-xs text-stone-800 hover:text-pink-600 hover:bg-white text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
            title="Ver detalhes completos do produto"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Detalhes</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="uppercase text-[10px] font-bold tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
              {product.categoria.replace('-', ' ')}
            </span>
            {product.avaliacao && (
              <div className="flex items-center gap-1 text-stone-600 font-medium">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{product.avaliacao.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400">({product.total_avaliacoes})</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => openProductDetails(product)}
            className="font-medium text-stone-900 hover:text-pink-600 text-sm sm:text-base leading-snug cursor-pointer transition-colors line-clamp-2"
          >
            {product.nome}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.descricao}
          </p>
        </div>

        {/* Pricing & Action */}
        <div className="mt-4 pt-3 border-t border-pink-100/70">
          <div className="mb-3">
            {product.preco_promocional && product.preco_promocional > 0 ? (
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 line-through">
                    De: {formatCurrency(product.preco)}
                  </span>
                  <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.2 rounded">
                    {discount}% OFF
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-stone-900">
                  <span className="text-xs font-normal text-stone-500 mr-1">Por:</span>
                  <span className="text-pink-600">{formatCurrency(effectivePrice)}</span>
                </div>
              </div>
            ) : (
              <div className="text-lg sm:text-xl font-bold text-stone-900">
                {formatCurrency(effectivePrice)}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-2">
            <button
              id={`add-to-cart-${product.id}`}
              onClick={() => addToCart(product, 1)}
              disabled={product.estoque <= 0}
              className={`col-span-4 py-2.5 px-3 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-98 ${
                product.estoque <= 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700 text-white hover:shadow-md'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{product.estoque <= 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}</span>
            </button>

            <button
              onClick={() => openProductDetails(product)}
              className="col-span-1 py-2.5 rounded-xl border border-pink-200 hover:bg-pink-50 text-stone-600 hover:text-pink-600 flex items-center justify-center transition-colors"
              title="Ver detalhes"
              aria-label="Ver detalhes"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
