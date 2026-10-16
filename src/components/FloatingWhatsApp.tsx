import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getWhatsAppInquiryUrl, WHATSAPP_NUMBER } from '../config/storeConfig';

export const FloatingWhatsApp: React.FC = () => {
  const { whatsappNumber } = useCart();
  const [showTooltip, setShowTooltip] = useState(true);

  const handleOpenWhatsApp = () => {
    const url = getWhatsAppInquiryUrl(whatsappNumber || WHATSAPP_NUMBER);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      {/* Speech bubble tooltip */}
      {showTooltip && (
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-pink-100 max-w-xs text-xs text-stone-700 relative animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center text-[10px]"
            title="Fechar balão"
            aria-label="Fechar mensagem"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="font-semibold text-pink-700 flex items-center gap-1">
            <span>Dúvidas sobre cosméticos?</span> 💗
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Fale conosco no WhatsApp para tirar dúvidas e fazer seu pedido!
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={handleOpenWhatsApp}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/50 flex items-center justify-center transition-all duration-300 transform hover:scale-108 active:scale-95 focus:outline-none"
        aria-label="Falar conosco no WhatsApp"
        title="Falar no WhatsApp"
      >
        {/* Subtle pulsing outer ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 pointer-events-none" />
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-emerald-600" />
      </button>
    </div>
  );
};
