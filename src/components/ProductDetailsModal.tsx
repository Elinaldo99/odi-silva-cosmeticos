import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, MessageCircle, Star, ShieldCheck, Truck, Sparkles, Check, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import {
  formatCurrency,
  calculateDiscountPercentage,
  getEffectivePrice,
  getWhatsAppDirectProductUrl,
} from '../config/storeConfig';

export const ProductDetailsModal: React.FC = () => {
  const { selectedProduct, closeProductDetails, addToCart, products, openProductDetails, whatsappNumber } = useCart();
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const maxStock = typeof selectedProduct?.estoque === 'number' ? selectedProduct.estoque : 99;
  const isOutOfStock = maxStock <= 0;

  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.imagem);
      const stock = typeof selectedProduct.estoque === 'number' ? selectedProduct.estoque : 99;
      setQuantity(stock > 0 ? 1 : 0);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const discount = calculateDiscountPercentage(selectedProduct.preco, selectedProduct.preco_promocional);
  const effectivePrice = getEffectivePrice(selectedProduct);

  // Related products (same category or top rated, excluding current)
  const relatedProducts = products
    .filter((p) => p.id !== selectedProduct.id && (p.categoria === selectedProduct.categoria || p.destaque))
    .slice(0, 3);

  const handleIncrease = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddAndClose = () => {
    if (isOutOfStock) return;
    addToCart(selectedProduct, quantity);
  };

  const handleDirectWhatsAppBuy = () => {
    if (isOutOfStock) return;
    const url = getWhatsAppDirectProductUrl(selectedProduct, quantity, whatsappNumber);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const galleryImages =
    selectedProduct.imagens && selectedProduct.imagens.length > 0
      ? selectedProduct.imagens
      : [selectedProduct.imagem];

  return (
    <div
      id="product-details-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProductDetails();
      }}
    >
      <div
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-pink-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-details-btn"
          onClick={closeProductDetails}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-pink-600 hover:bg-white shadow-md flex items-center justify-center transition-all"
          aria-label="Fechar modal de detalhes"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 max-h-[88vh] overflow-y-auto">
          {/* Main Product Presentation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: Image & Gallery */}
            <div className="md:col-span-6 space-y-4">
              {/* Active Large Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-pink-50 border border-pink-100 shadow-xs">
                <img
                  src={activeImage || selectedProduct.imagem}
                  alt={selectedProduct.nome}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    {discount}% OFF
                  </div>
                )}

                {selectedProduct.mais_vendido && (
                  <div className="absolute top-3 right-3 bg-stone-900/90 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    🔥 Mais Vendido
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImage === img
                          ? 'border-pink-600 ring-2 ring-pink-400/30'
                          : 'border-pink-100 hover:border-pink-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Information & Buy Actions */}
            <div className="md:col-span-6 space-y-5">
              {/* Category & Badge */}
              <div className="flex items-center justify-between">
                <span className="uppercase text-xs font-bold tracking-wider text-pink-600 bg-pink-50 px-2.5 py-1 rounded-md">
                  {selectedProduct.categoria.replace('-', ' ')}
                </span>
                {maxStock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                    <Check className="w-3.5 h-3.5" />
                    {maxStock <= 5 ? `Apenas ${maxStock} em estoque` : 'Pronta Entrega'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-red-700 bg-red-50 font-semibold px-2.5 py-1 rounded-full border border-red-200">
                    Esgotado
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                {selectedProduct.nome}
              </h2>

              {/* Rating & Volume */}
              <div className="flex items-center gap-4 text-xs text-stone-500 pb-3 border-b border-pink-100">
                {selectedProduct.avaliacao && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-stone-800">{selectedProduct.avaliacao.toFixed(1)}</span>
                    <span>({selectedProduct.total_avaliacoes} avaliações)</span>
                  </div>
                )}
                {selectedProduct.volume_ou_peso && (
                  <div className="text-stone-600 font-medium">
                    Conteúdo: <span className="font-bold">{selectedProduct.volume_ou_peso}</span>
                  </div>
                )}
              </div>

              {/* Pricing Box */}
              <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-100 space-y-1">
                {selectedProduct.preco_promocional && selectedProduct.preco_promocional > 0 ? (
                  <>
                    <div className="text-xs text-stone-400 line-through">
                      De: {formatCurrency(selectedProduct.preco)}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-pink-600">
                        {formatCurrency(effectivePrice)}
                      </span>
                      <span className="text-xs font-bold text-white bg-pink-600 px-2 py-0.5 rounded">
                        Economize {discount}%
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-2xl sm:text-3xl font-bold text-stone-900">
                    {formatCurrency(effectivePrice)}
                  </div>
                )}
                <p className="text-[11px] text-stone-500 pt-1">
                  Pagamento via Pix ou Cartão com confirmação rápida via WhatsApp.
                </p>
              </div>

              {/* Descriptions & Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Descrição do Produto
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {selectedProduct.descricao_completa || selectedProduct.descricao}
                </p>
              </div>

              {/* Product Benefits list */}
              {selectedProduct.beneficios && selectedProduct.beneficios.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Destaques & Benefícios
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-600">
                    {selectedProduct.beneficios.map((b, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-pink-500 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Selector & Action Buttons */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs font-semibold text-stone-700">Quantidade:</span>
                  <div className="flex items-center border border-pink-200 rounded-xl bg-white shadow-xs">
                    <button
                      onClick={handleDecrease}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="px-3 py-1.5 text-stone-600 hover:text-pink-600 font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-stone-600"
                      aria-label="Diminuir quantidade"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-sm font-bold text-stone-900 min-w-[2.5rem] text-center">
                      {isOutOfStock ? 0 : quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      disabled={quantity >= maxStock || isOutOfStock}
                      className="px-3 py-1.5 text-stone-600 hover:text-pink-600 font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-stone-600"
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-400">
                    Subtotal: <strong className="text-stone-800">{formatCurrency(effectivePrice * (isOutOfStock ? 0 : quantity))}</strong>
                  </span>
                  {maxStock > 0 && (
                    <span className="text-[11px] text-stone-500 font-medium">
                      ({maxStock} {maxStock === 1 ? 'disponível' : 'disponíveis'})
                    </span>
                  )}
                </div>

                {maxStock > 0 && quantity >= maxStock && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl font-medium inline-flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Quantidade máxima disponível em estoque atingida ({maxStock} {maxStock === 1 ? 'unidade' : 'unidades'}).</span>
                  </p>
                )}

                {isOutOfStock && (
                  <p className="text-xs text-red-700 bg-red-50 border border-red-200/80 px-3 py-1.5 rounded-xl font-medium inline-flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Produto esgotado no momento.</span>
                  </p>
                )}

                {/* Primary Buy CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Add to Cart */}
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAddAndClose}
                    disabled={isOutOfStock}
                    className="w-full py-3.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-wide shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}</span>
                  </button>

                  {/* Direct WhatsApp Buy */}
                  <button
                    id="modal-buy-whatsapp-btn"
                    onClick={handleDirectWhatsAppBuy}
                    disabled={isOutOfStock}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-wide shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{isOutOfStock ? 'Indisponível via WhatsApp' : 'Comprar pelo WhatsApp'}</span>
                  </button>
                </div>
              </div>

              {/* Guarantees banner */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-pink-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
                  Produto 100% Original
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-pink-500" />
                  Envio seguro e protegido
                </span>
              </div>
            </div>
          </div>

          {/* Related Products: "Você também pode gostar" */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-pink-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                    Você Também Pode Gostar
                  </h3>
                  <p className="text-xs text-stone-500">
                    Sugestões especiais selecionadas para combinar com seu pedido
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => {
                  const relPrice = getEffectivePrice(rel);
                  return (
                    <div
                      key={rel.id}
                      onClick={() => openProductDetails(rel)}
                      className="group p-3 rounded-2xl bg-[#FFF8F9] hover:bg-white border border-pink-100 hover:border-pink-300 transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center gap-3.5"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0">
                        <img
                          src={rel.imagem}
                          alt={rel.nome}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-stone-900 truncate group-hover:text-pink-600 transition-colors">
                          {rel.nome}
                        </h5>
                        <p className="text-[11px] text-pink-600 font-bold mt-0.5">
                          {formatCurrency(relPrice)}
                        </p>
                        <span className="text-[10px] text-stone-400 flex items-center gap-0.5 mt-0.5">
                          Ver item <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
