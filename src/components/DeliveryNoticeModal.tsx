import React from 'react';
import { X, MapPin, Bike, Car, Check, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getWhatsAppInquiryUrl } from '../config/storeConfig';

export const DeliveryNoticeModal: React.FC = () => {
  const { isDeliveryModalOpen, closeDeliveryModal, whatsappNumber } = useCart();

  if (!isDeliveryModalOpen) return null;

  const handleWhatsAppContact = () => {
    const url = getWhatsAppInquiryUrl(whatsappNumber);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="delivery-notice-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDeliveryModal();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-modal-title"
    >
      <div
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-pink-100 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header Accent */}
        <div className="h-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 w-full" />

        {/* Close Button */}
        <button
          onClick={() => closeDeliveryModal()}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-pink-100 text-stone-500 hover:text-pink-700 flex items-center justify-center transition-colors"
          aria-label="Fechar aviso"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header Title with Map Pin Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 text-white shadow-lg shadow-pink-500/25 mb-1">
              <MapPin className="w-7 h-7" />
            </div>

            <div className="inline-block">
              <span className="text-[11px] font-extrabold tracking-wider uppercase bg-pink-100 text-pink-700 px-3 py-1 rounded-full border border-pink-200">
                📍 Aviso Importante de Entregas
              </span>
            </div>

            <h2
              id="delivery-modal-title"
              className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight"
            >
              Envios Exclusivos para Roraima
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Para garantir agilidade e atendimento de excelência, informamos que realizamos entregas e envios{' '}
              <strong className="text-pink-600 font-bold">apenas dentro do Estado de Roraima</strong>.
            </p>
          </div>

          {/* Delivery Method Options */}
          <div className="space-y-3 pt-1">
            {/* Option 1: Boa Vista / Motoboy */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 to-rose-50/40 border border-pink-200/80 flex items-start gap-3.5 transition-all hover:border-pink-300">
              <div className="w-11 h-11 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Bike className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-stone-900">
                    Boa Vista (Capital)
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase bg-pink-200/80 text-pink-800 px-2 py-0.5 rounded-md">
                    Via Motoboy 🛵
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Entregas rápidas por <strong className="text-stone-800">motoboy</strong> em todos os bairros de Boa Vista, diretamente no seu endereço residencial ou comercial.
                </p>
              </div>
            </div>

            {/* Option 2: Interior de Roraima / Taxi */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 to-rose-50/40 border border-amber-200/80 flex items-start gap-3.5 transition-all hover:border-amber-300">
              <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Car className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-stone-900">
                    Demais Municípios de Roraima
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
                    Via Táxi / Lotação 🚕
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Envios por <strong className="text-stone-800">táxi de linha intermunicipal</strong> para todo o estado (Cantá, Bonfim, Pacaraima, Mucajaí, Caracaraí, Rorainópolis e demais localidades).
                </p>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 bg-amber-100/80 px-2 py-1 rounded-lg mt-1">
                  <span>Taxa de envio conforme o valor cobrado pelo taxista.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice about WhatsApp confirmation */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center gap-2.5 text-xs text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Ao concluir sua compra no carrinho, combinamos os detalhes da entrega com você via WhatsApp!
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              id="confirm-delivery-notice-btn"
              onClick={() => closeDeliveryModal()}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>Entendi e Quero Ver os Produtos</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsAppContact}
              className="w-full py-2.5 px-4 text-xs font-semibold text-stone-600 hover:text-pink-600 flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dúvidas sobre frete? Fale com a gente no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
