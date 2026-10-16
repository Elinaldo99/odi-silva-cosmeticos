import React from 'react';
import { Truck, HeartHandshake, Sparkles, Smartphone } from 'lucide-react';

export const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: Truck,
      title: 'Entrega Segura',
      description: 'Enviamos seu pedido com segurança para todo o Brasil',
      color: 'bg-pink-50 text-pink-600 border-pink-200/80',
    },
    {
      icon: HeartHandshake,
      title: 'Atendimento',
      description: 'Atendimento personalizado e atencioso para você',
      color: 'bg-rose-50 text-rose-600 border-rose-200/80',
    },
    {
      icon: Sparkles,
      title: 'Produtos Selecionados',
      description: 'Cosméticos de alta qualidade e procedência garantida',
      color: 'bg-amber-50 text-amber-600 border-amber-200/80',
    },
    {
      icon: Smartphone,
      title: 'Compra Fácil',
      description: 'Faça seu pedido diretamente pelo WhatsApp sem complicação',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-pink-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF8F9] hover:bg-pink-50/70 border border-pink-100/80 transition-all duration-200 shadow-xs hover:shadow-sm group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${benefit.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
