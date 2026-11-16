// Supabase credentials for fetching product details dynamically
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tymudevqzzlewgtngrld.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bXVkZXZxenpsZXdndG5ncmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMDUwODUsImV4cCI6MjEwNzY4MTA4NX0.N7zuv4lHUOCTAzWuLZU5woWf6FV8ozjQdxxbOlrKK3c';

// Known social media crawlers and bots that generate link previews
const BOT_REGEX = /bot|facebookexternalhit|whatsapp|twitterbot|telegrambot|linkedinbot|discordbot|slackbot|skypeuripreview/i;

function formatBRL(value) {
  if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeUrl(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '%22').replace(/'/g, '%27');
}

export default async function handler(req, res) {
  const { id } = req.query || {};
  const productId = typeof id === 'string' ? id.trim() : '';

  // Determine if caller is a social network preview bot or a real human visitor
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_REGEX.test(userAgent);

  // 1. FAST PATH FOR HUMANS:
  // If a human visitor opens the link in their browser (Chrome, Safari, mobile browser, etc.),
  // immediately issue an HTTP 302 redirect directly to the store with the product parameter.
  // This takes ~5ms and completely eliminates cold starts and error screens!
  if (!isBot && productId) {
    res.writeHead(302, {
      Location: `/?produto=${encodeURIComponent(productId)}`,
    });
    return res.end();
  }

  // 2. BOT PATH (WhatsApp, Facebook, Twitter, Telegram, etc.):
  // Query product data from Supabase to render rich Open Graph tags with photo and price.
  try {
    let product = null;

    if (productId && SUPABASE_URL && SUPABASE_ANON_KEY) {
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
              preco: Number(item.preco) || 0,
              preco_promocional: item.preco_promocional ? Number(item.preco_promocional) : undefined,
              imagem: item.imagem || '',
            };
          }
        }
      } catch (fetchErr) {
        console.warn('Supabase fetch error in share handler:', fetchErr);
      }
    }

    const host = req.headers['x-forwarded-host'] || req.headers.host || 'odi-silva-cosmeticos.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${proto}://${host}`;

    // If product wasn't found in database, return safe store home redirect
    if (!product) {
      const targetUrl = productId ? `${baseUrl}/?produto=${encodeURIComponent(productId)}` : baseUrl;
      const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>ODI SILVA COSMÉTICOS | Loja Virtual de Beleza</title>
  <meta property="og:title" content="ODI SILVA COSMÉTICOS | Loja Virtual de Beleza" />
  <meta property="og:description" content="Realce sua beleza com maquiagens, skincare e perfumes de alta qualidade." />
  <meta property="og:image" content="${baseUrl}/logo-circular.png" />
  <meta property="og:url" content="${baseUrl}" />
  <meta http-equiv="refresh" content="0;url=${escapeUrl(targetUrl)}" />
  <script>window.location.replace('${escapeUrl(targetUrl)}');</script>
</head>
<body>Redirecionando para a loja...</body>
</html>`;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }

    // Pricing & discount calculations
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
    const description = `${priceText}! ${product.descricao || 'Confira os detalhes e compre direto na Odi Silva Cosméticos.'}`;
    const targetUrl = `${baseUrl}/?produto=${encodeURIComponent(product.id)}`;
    const imageUrl = product.imagem.startsWith('http') ? product.imagem : `${baseUrl}${product.imagem}`;

    // Full rich Open Graph HTML response for WhatsApp, Facebook, Telegram crawlers
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
    window.location.replace('${escapeUrl(targetUrl)}');
  </script>
</head>
<body>
  <p>Redirecionando para ${escapeHtml(product.nome)}...</p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
    return res.status(200).send(html);
  } catch (err) {
    console.error('Unhandled error in api/share:', err);
    // ABSOLUTE FAILSAFE: Never return 500 error to user!
    // Redirect to the store home with query param so the customer can continue browsing.
    res.writeHead(302, {
      Location: `/?produto=${encodeURIComponent(productId || '')}`,
    });
    return res.end();
  }
}
