import { CartItem, Product, StoreConfig } from '../types';

/**
 * ============================================================================
 * CONFIGURAÇÃO CENTRAL DA LOJA E WHATSAPP
 * ============================================================================
 * IMPORTANTE: Configure aqui o número do WhatsApp da Odi Silva Cosméticos.
 * Formato internacional: Código do País + DDD + Número (apenas dígitos).
 * Exemplo para o Brasil (DDD 11): "5511999998888"
 */
export const WHATSAPP_NUMBER = "5511999998888";

export const STORE_CONFIG: StoreConfig = {
  whatsappNumber: WHATSAPP_NUMBER,
  storeName: "ODI SILVA COSMÉTICOS",
  storeTagline: "Beleza, cuidado e autoestima em um só lugar.",
  storeDescription:
    "Na Odi Silva Cosméticos, acreditamos que cuidar da beleza é também uma forma de cuidar de si. Trabalhamos para oferecer produtos de beleza selecionados, proporcionando praticidade, qualidade e uma experiência de compra especial para nossas clientes.",
  hours: "Segunda a Sábado, das 09h às 19h",
  location: "Atendimento online com envios para todo o Brasil 🇧🇷",
  instagramHandle: "@odisilvacosmeticos",
  facebookUrl: "https://facebook.com",
  tiktokUrl: "https://tiktok.com",
};

/**
 * Formata um valor numérico para a moeda brasileira (Real - R$)
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Calcula a porcentagem de desconto entre preço original e promocional
 */
export function calculateDiscountPercentage(originalPrice: number, promotionalPrice?: number): number {
  if (!promotionalPrice || promotionalPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - promotionalPrice) / originalPrice) * 100);
}

/**
 * Retorna o preço efetivo do produto (promocional se houver, ou normal)
 */
export function getEffectivePrice(product: Product): number {
  return product.preco_promocional && product.preco_promocional > 0
    ? product.preco_promocional
    : product.preco;
}

/**
 * Gera a mensagem oficial estruturada do carrinho para envio via WhatsApp,
 * exatamente no formato especificado nos requisitos da loja.
 */
export function generateWhatsAppOrderMessage(cart: CartItem[]): string {
  let totalOrder = 0;

  const itemsList = cart
    .map((item) => {
      const unitPrice = getEffectivePrice(item.product);
      const subtotal = unitPrice * item.quantity;
      totalOrder += subtotal;

      return `• ${item.product.nome}\nQuantidade: ${item.quantity}\nPreço: ${formatCurrency(unitPrice)}\nSubtotal: ${formatCurrency(subtotal)}`;
    })
    .join('\n\n');

  const totalFormatted = formatCurrency(totalOrder);

  return `Olá! Gostaria de fazer um pedido na Odi Silva Cosméticos 💗\n\n🛍️ MEU PEDIDO:\n\n${itemsList}\n\n💰 Total do pedido: ${totalFormatted}\n\nGostaria de confirmar a disponibilidade e receber as informações para pagamento e entrega.`;
}

/**
 * Cria a URL completa do WhatsApp para finalizar a compra do carrinho
 */
export function getWhatsAppCheckoutUrl(cart: CartItem[], customNumber?: string): string {
  const number = customNumber || WHATSAPP_NUMBER;
  const message = generateWhatsAppOrderMessage(cart);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Cria a URL completa para comprar um único produto diretamente via WhatsApp
 */
export function getWhatsAppDirectProductUrl(product: Product, quantity: number = 1, customNumber?: string): string {
  const number = customNumber || WHATSAPP_NUMBER;
  const price = getEffectivePrice(product);
  const subtotal = price * quantity;

  const message = `Olá! Gostaria de fazer um pedido na Odi Silva Cosméticos 💗\n\n🛍️ MEU PEDIDO:\n\n• ${product.nome}\nQuantidade: ${quantity}\nPreço: ${formatCurrency(price)}\nSubtotal: ${formatCurrency(subtotal)}\n\n💰 Total do pedido: ${formatCurrency(subtotal)}\n\nGostaria de confirmar a disponibilidade e receber as informações para pagamento e entrega.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Cria a URL do botão flutuante para tirar dúvidas gerais
 */
export function getWhatsAppInquiryUrl(customNumber?: string): string {
  const number = customNumber || WHATSAPP_NUMBER;
  const message = "Olá! Gostaria de mais informações sobre os produtos da Odi Silva Cosméticos.";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
