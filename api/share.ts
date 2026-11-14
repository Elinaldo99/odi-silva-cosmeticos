import { INITIAL_PRODUCTS } from '../src/data/products';

// Standard Supabase REST API credentials for dynamic products created in Admin panel
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tymudevqzzlewgtngrld.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bXVkZXZxenpsZXdndG5ncmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMDUwODUsImV4cCI6MjEwNzY4MTA4NX0.N7zuv4lHUOCTAzWuLZU5woWf6FV8ozjQdxxbOlrKK3c';

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeUrl(str: string): string {
  return str.replace(/"/g, '%22').replace(/'/g, '%27');
}

export default async function handler(req: any, res: any) {
  const { id } = req.query || {};
  const productId = typeof id === 'string' ? id.trim() : '';

  let product = null;

  // 1. Check local static initial products first for instant response
  if (productId) {
    product = INITIAL_PRODUCTS.find(
      (p) => p.id === productId || p.slug === productId || p.id.toLowerCase() === productId.toLowerCase()
    );
  }

  // 2. If not found in static list, attempt to fetch from Supabase (for admin added products)
  if (!product && productId && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const query = `id=eq.${encodeURIComponent(productId)}`;
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?${query}&select=*&limit=1`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          product = {
            id: item.id,
            nome: item.nome,
            descricao: item.descricao || '',
            preco: Number(item.preco),
            preco_promocional: item.preco_promocional ? Number(item.preco_promocional) : undefined,
            imagem: item.imagem || '',
          };
        }
      }
    } catch {
      // Gracefully continue if network error occurs
    }
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'odisilvacosmeticos.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  // If no product is found, redirect to home page with default store meta tags
  if (!product) {
    const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>ODI SILVA COSMÉTICOS | Loja Virtual de Beleza &amp; Cuidados</title>
  <meta property="og:title" content="ODI SILVA COSMÉTICOS | Loja Virtual de Beleza &amp; Cuidados" />
  <meta property="og:description" content="Realce sua beleza com cosméticos, maquiagem e skincare de alta qualidade." />
  <meta property="og:image" content="${baseUrl}/logo-circular.png" />
  <meta property="og:url" content="${baseUrl}" />
  <meta http-equiv="refresh" content="0;url=/" />
  <script>window.location.replace('/');</script>
</head>
<body>Redirecionando para a loja...</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  // Calculate pricing & discount
  const effectivePrice = product.preco_promocional && product.preco_promocional > 0
    ? product.preco_promocional
    : product.preco;

  const formattedPrice = formatBRL(effectivePrice);
  const discount = product.preco_promocional && product.preco > product.preco_promocional
    ? Math.round(((product.preco - product.preco_promocional) / product.preco) * 100)
    : 0;

  const priceText = discount > 0
    ? `De ${formatBRL(product.preco)} por apenas ${formattedPrice} (${discount}% OFF)`
    : `Apenas ${formattedPrice}`;

  const title = `${product.nome} • ${formattedPrice}`;
  const description = `${priceText}! ${product.descricao || 'Confira os detalhes e faça seu pedido direto na Odi Silva Cosméticos.'}`;
  const targetUrl = `${baseUrl}/?produto=${encodeURIComponent(product.id)}`;
  const imageUrl = product.imagem.startsWith('http') ? product.imagem : `${baseUrl}${product.imagem}`;

  // Full HTML response with rich Open Graph, Twitter Cards, and Product schema for social media scrapers
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | ODI SILVA COSMÉTICOS</title>
  <meta name="description" content="${escapeHtml(description)}" />

  <!-- Open Graph / WhatsApp / Facebook / Telegram -->
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="ODI SILVA COSMÉTICOS" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeUrl(imageUrl)}" />
  <meta property="og:image:secure_url" content="${escapeUrl(imageUrl)}" />
  <meta property="og:image:width" content="800" />
  <meta property="og:image:height" content="800" />
  <meta property="og:image:alt" content="${escapeHtml(product.nome)}" />
  <meta property="og:url" content="${escapeUrl(targetUrl)}" />
  <meta property="product:price:amount" content="${effectivePrice.toFixed(2)}" />
  <meta property="product:price:currency" content="BRL" />

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeUrl(imageUrl)}" />

  <!-- Instant client-side redirect for human visitors -->
  <meta http-equiv="refresh" content="0;url=${escapeUrl(targetUrl)}" />
  <script>
    window.location.replace('${targetUrl.replace(/'/g, "\\'")}');
  </script>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #FFF8F9;
      color: #292524;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      max-width: 400px;
      border: 1px solid #FCE7F3;
    }
    .thumb {
      width: 160px;
      height: 160px;
      object-fit: cover;
      border-radius: 16px;
      margin-bottom: 16px;
    }
    .price {
      font-size: 22px;
      font-weight: bold;
      color: #DB2777;
      margin: 10px 0;
    }
    .btn {
      display: inline-block;
      margin-top: 15px;
      padding: 10px 24px;
      background: #DB2777;
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(product.nome)}" class="thumb" />
    <h1 style="font-size: 18px; margin: 0;">${escapeHtml(product.nome)}</h1>
    <div class="price">${escapeHtml(formattedPrice)}</div>
    <a href="${escapeHtml(targetUrl)}" class="btn">Abrir na Loja</a>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache response for 10 minutes, stale-while-revalidate for 1 hour
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
  return res.status(200).send(html);
}
