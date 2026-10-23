import React from 'react';
import { Instagram, Facebook, MessageCircle, Clock, MapPin, Phone, Heart, Sparkles } from 'lucide-react';
import { STORE_CONFIG, WHATSAPP_NUMBER } from '../config/storeConfig';
import { useCart } from '../context/CartContext';

interface FooterProps {
  onNavigateToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSection }) => {
  const { whatsappNumber, openDeliveryModal } = useCart();
  const currentYear = 2026;

  const currentNumber = whatsappNumber || WHATSAPP_NUMBER;

  return (
    <footer id="contato" className="bg-[#1C1917] text-stone-300 pt-16 pb-8 border-t-4 border-pink-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-white uppercase">
                ODI SILVA
              </span>
              <span className="text-amber-400 text-xs font-semibold px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700">
                COSMÉTICOS
              </span>
            </div>

            <p className="text-sm text-stone-400 italic font-serif">
              "{STORE_CONFIG.storeTagline}"
            </p>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Sua loja virtual especializada em destacar o seu brilho natural. Maquiagens de alta performance, perfumes marcantes e cuidados para pele e cabelos.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-pink-600 text-stone-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-pink-600 text-stone-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-pink-600 text-stone-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="TikTok"
              >
                <span className="font-bold text-xs">TikTok</span>
              </a>
              <a
                href={`https://wa.me/${currentNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-pink-400">
              Links Rápidos
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateToSection('inicio')}
                  className="hover:text-pink-400 transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('produtos')}
                  className="hover:text-pink-400 transition-colors"
                >
                  Produtos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('categorias')}
                  className="hover:text-pink-400 transition-colors"
                >
                  Categorias
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('ofertas')}
                  className="hover:text-pink-400 transition-colors"
                >
                  Ofertas Especiais
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('sobre')}
                  className="hover:text-pink-400 transition-colors"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('contato')}
                  className="hover:text-pink-400 transition-colors"
                >
                  Contato & Atendimento
                </button>
              </li>
              <li>
                <button
                  onClick={openDeliveryModal}
                  className="text-pink-400 hover:text-pink-300 font-medium transition-colors flex items-center gap-1"
                >
                  <span>📍 Regras de Entregas (Roraima)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service and Info Column */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-pink-400">
              Informações de Contato & Pedidos
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-stone-200">WhatsApp Oficial:</span>
                  <a
                    href={`https://wa.me/${currentNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-400 transition-colors"
                  >
                    +{currentNumber}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-stone-200">Horário de Atendimento:</span>
                  <span>{STORE_CONFIG.hours}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="block font-semibold text-stone-200">Cidade / Região de Atendimento:</span>
                  <p className="text-xs text-pink-400 font-semibold">
                    Entregas e envios apenas no Estado de Roraima (RR)
                  </p>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    🛵 <strong className="text-stone-300">Boa Vista:</strong> Entregas por toda a cidade via motoboy.
                  </p>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    🚕 <strong className="text-stone-300">Todo o Estado:</strong> Envios de táxi conforme o valor da taxa do taxista.
                  </p>
                  <button
                    type="button"
                    onClick={openDeliveryModal}
                    className="text-[11px] text-pink-400 hover:text-pink-300 underline font-medium pt-0.5 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Ver aviso e detalhes de entrega</span>
                  </button>
                </div>
              </li>
            </ul>

            {/* Quick WhatsApp order badge */}
            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Compre sem burocracia</p>
                <p className="text-[11px] text-stone-400">Adicione ao carrinho e confirme no WhatsApp</p>
              </div>
              <a
                href={`https://wa.me/${currentNumber}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre os cosméticos.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shrink-0"
              >
                Iniciar Chat
              </a>
            </div>
          </div>
        </div>

        {/* Copyright and Legal row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {currentYear} Odi Silva Cosméticos. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Desenvolvido com carinho para valorizar sua beleza</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
