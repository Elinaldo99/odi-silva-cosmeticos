import React from 'react';
import { Heart, Sparkles, Award, Users } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image with Luxury Framing */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative pastel halo */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-pink-200/50 to-rose-100/50 rounded-3xl blur-xl" />

              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl aspect-[4/5] bg-pink-100">
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85"
                  alt="Espaço e cuidado Odi Silva Cosméticos"
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Experience Card */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-pink-100 text-center">
                  <div className="font-serif text-2xl font-bold text-pink-700">
                    Autoestima & Elegância
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Cada pedido preparado com carinho e dedicação
                  </p>
                </div>
              </div>

              {/* Floating aesthetic stamp */}
              <div className="absolute -top-3 -right-3 bg-pink-600 text-white p-3 rounded-2xl shadow-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="text-xs font-bold tracking-wide">100% Amor & Cuidado</span>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Philosophy */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold tracking-wide">
              <Heart className="w-3.5 h-3.5 text-pink-600 fill-pink-600" />
              <span>Nossa Filosofia</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Sobre a <span className="text-pink-600">Odi Silva Cosméticos</span>
            </h2>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-normal">
              Na <strong className="text-pink-700 font-semibold">Odi Silva Cosméticos</strong>, acreditamos que cuidar da beleza é também uma forma de cuidar de si. Trabalhamos para oferecer produtos de beleza selecionados, proporcionando praticidade, qualidade e uma experiência de compra especial para nossas clientes.
            </p>

            <p className="text-sm text-stone-600 leading-relaxed">
              Nossa missão é aproximar você das melhores tendências mundiais de maquiagem, skincare e perfumaria, tudo com um atendimento consultivo e acolhedor direto no seu WhatsApp. Cada item do nosso catálogo é escolhido a dedo para valorizar seus traços e elevar sua confiança no dia a dia.
            </p>

            {/* Pillar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-pink-100/90">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Qualidade Garantida</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Procedência e fórmulas aprovadas</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-pink-100/90">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Atendimento Próximo</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Tire dúvidas de tons e aplicações</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
