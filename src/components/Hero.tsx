import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Star } from 'lucide-react';

interface HeroProps {
  onExploreProducts: () => void;
  onExploreOffers: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts, onExploreOffers }) => {
  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-b from-pink-50 via-rose-50/40 to-white pt-6 pb-16 lg:pt-12 lg:pb-24">
      {/* Decorative subtle ambient circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-200/20 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-pink-200/80 shadow-xs text-pink-700 text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Coleção Exclusiva & Cuidados Especiais</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
              Realce sua beleza com{' '}
              <span className="text-pink-600 relative inline-block">
                ODI SILVA
                <svg
                  className="absolute -bottom-1 left-0 w-full h-2 text-pink-300 -z-10"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path d="M0,0 Q50,12 100,0" fill="currentColor" />
                </svg>
              </span>{' '}
              COSMÉTICOS
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Cosméticos e produtos de beleza para você cuidar, valorizar e destacar sua beleza todos os dias.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="hero-ver-produtos-btn"
                onClick={onExploreProducts}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm tracking-wide shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>VER PRODUTOS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-ver-ofertas-btn"
                onClick={onExploreOffers}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-pink-50 text-pink-700 font-semibold text-sm tracking-wide border border-pink-200 shadow-xs hover:border-pink-300 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>VER OFERTAS</span>
              </button>
            </div>

            {/* Mini Trust Highlights */}
            <div className="pt-6 border-t border-pink-100/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-pink-500" />
                <span>100% Originais & Testados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-100" />
                <span>Feito com carinho para você</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Mais de 2.500 clientes felizes</span>
              </div>
            </div>
          </div>

          {/* Right Image / Banner Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative soft halo */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-pink-300/40 via-rose-200/30 to-amber-200/30 blur-lg" />

              {/* Main Photo Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-pink-100">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85"
                  alt="Odi Silva Cosméticos - Produtos de Maquiagem e Beleza"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent pointer-events-none" />

                {/* Floating highlight card on the photo */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-pink-100/80 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center font-serif font-bold text-lg">
                      OS
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-900">Atendimento Humanizado</p>
                      <p className="text-[11px] text-pink-600 font-medium">Finalize seu pedido no WhatsApp</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                    Online agora
                  </span>
                </div>
              </div>

              {/* Top Floating Badge */}
              <div className="absolute -top-4 -left-4 bg-white shadow-xl rounded-2xl p-3 border border-pink-100 hidden sm:flex items-center gap-2.5 animate-bounce-slow">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">
                  💗
                </div>
                <div className="text-left pr-2">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Qualidade</p>
                  <p className="text-xs font-bold text-stone-800">Skincare & Makes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
