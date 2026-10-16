export interface Product {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  descricao_completa?: string;
  categoria: string;
  preco: number;
  preco_promocional?: number;
  imagem: string;
  imagens: string[];
  estoque: number;
  destaque: boolean;
  mais_vendido: boolean;
  oferta: boolean;
  created_at: string;
  volume_ou_peso?: string;
  avaliacao?: number;
  total_avaliacoes?: number;
  beneficios?: string[];
  modo_de_uso?: string;
}

export interface Category {
  id: string;
  nome: string;
  slug: string;
  imagem: string;
  descricao: string;
  destaque?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreConfig {
  whatsappNumber: string;
  storeName: string;
  storeTagline: string;
  storeDescription: string;
  hours: string;
  location: string;
  instagramHandle: string;
  facebookUrl?: string;
  tiktokUrl?: string;
}
