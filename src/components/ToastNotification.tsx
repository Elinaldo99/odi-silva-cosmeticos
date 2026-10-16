import React from 'react';
import { Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ToastNotification: React.FC = () => {
  const { notification, openCart } = useCart();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-pink-500/40 flex items-center gap-3 text-xs sm:text-sm font-medium">
        <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
        <span>{notification}</span>
        {notification.includes('adicionado') && (
          <button
            onClick={openCart}
            className="ml-2 text-pink-300 hover:text-white font-bold underline text-xs"
          >
            Ver Carrinho
          </button>
        )}
      </div>
    </div>
  );
};
