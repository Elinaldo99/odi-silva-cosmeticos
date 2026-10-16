import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS } from '../src/data/products.js';

const SUPABASE_URL = 'https://tymudevqzzlewgtngrld.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bXVkZXZxenpsZXdndG5ncmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMDUwODUsImV4cCI6MjEwNzY4MTA4NX0.N7zuv4lHUOCTAzWuLZU5woWf6FV8ozjQdxxbOlrKK3c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seed() {
  console.log('Seeding products to Supabase...');
  
  for (const product of INITIAL_PRODUCTS) {
    const { error } = await supabase.from('products').upsert({
      id: product.id,
      nome: product.nome,
      slug: product.slug,
      descricao: product.descricao,
      descricao_completa: product.descricao_completa,
      categoria: product.categoria,
      preco: product.preco,
      preco_promocional: product.preco_promocional || null,
      imagem: product.imagem,
      imagens: product.imagens || [product.imagem],
      estoque: product.estoque,
      destaque: product.destaque,
      mais_vendido: product.mais_vendido,
      oferta: product.oferta,
      volume_ou_peso: product.volume_ou_peso || null,
      avaliacao: product.avaliacao || 5.0,
      total_avaliacoes: product.total_avaliacoes || 0,
      beneficios: product.beneficios || [],
      modo_de_uso: product.modo_de_uso || null,
      created_at: product.created_at || new Date().toISOString()
    });

    if (error) {
      console.error(`Error inserting ${product.nome}:`, error.message);
    } else {
      console.log(`Inserted: ${product.nome}`);
    }
  }

  console.log('Finished seeding products!');
}

seed().catch(console.error);
