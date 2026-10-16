import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
  formatCurrency,
  getEffectivePrice,
  getWhatsAppCheckoutUrl,
  WHATSAPP_NUMBER,
} from '../config/storeConfig';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
    whatsappNumber,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;
    const url = getWhatsAppCheckoutUrl(cart, whatsappNumber || WHATSAPP_NUMBER);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-pink-100 transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between bg-[#FFF8F9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight">
                Seu Carrinho
              </h2>
              <p className="text-xs text-stone-500">
                {totalItems} {totalItems === 1 ? 'item adicionado' : 'itens adicionados'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                id="clear-cart-btn"
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-rose-600 px-2 py-1 rounded transition-colors"
                title="Limpar todos os produtos"
              >
                Limpar
              </button>
            )}
            <button
              id="close-cart-btn"
              onClick={closeCart}
              className="w-9 h-9 rounded-xl text-stone-500 hover:text-pink-600 hover:bg-pink-50 flex items-center justify-center transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-pink-50 text-pink-400 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-stone-800">
                  Seu carrinho está vazio
                </h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Aproveite nossos cosméticos, maquiagens e produtos de skincare para realçar sua beleza!
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-6 py-3 rounded-xl bg-pink-600 text-white font-semibold text-xs tracking-wide hover:bg-pink-700 shadow-sm transition-all"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="divide-y divide-pink-100/70">
              {cart.map((item) => {
                const effectivePrice = getEffectivePrice(item.product);
                const itemSubtotal = effectivePrice * item.quantity;

                return (
                  <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-pink-50 shrink-0 border border-pink-100">
                      <img
                        src={item.product.imagem}
                        alt={item.product.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 leading-tight">
                            {item.product.nome}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 transition-colors shrink-0"
                            title="Remover produto"
                            aria-label={`Remover ${item.product.nome}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Unitário: {formatCurrency(effectivePrice)}
                        </p>
                      </div>

                      {/* Quantity & Subtotal row */}
                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-pink-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-stone-600 hover:text-pink-600 transition-colors"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-800 min-w-[1.75rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-stone-600 hover:text-pink-600 transition-colors"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 block">Subtotal</span>
                          <span className="text-sm font-bold text-pink-600">
                            {formatCurrency(itemSubtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart Footer / Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-pink-100 bg-[#FFF8F9] space-y-4">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal dos produtos</span>
                <span className="font-semibold text-stone-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Frete</span>
                <span className="text-emerald-700 font-medium">A combinar via WhatsApp</span>
              </div>
              <div className="pt-2 border-t border-pink-200/80 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900">Total do pedido:</span>
                <span className="text-xl font-bold text-pink-600">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {/* Primary Action Button: Finalizar Pedido pelo WhatsApp */}
            <button
              id="cart-checkout-whatsapp-btn"
              onClick={handleCheckoutWhatsApp}
              className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 transition-all flex items-center justify-center gap-2.5 active:scale-98"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>FINALIZAR PEDIDO PELO WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Seu pedido será gerado e enviado para confirmação direta</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
