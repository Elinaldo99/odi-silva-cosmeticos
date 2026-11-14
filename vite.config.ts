import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function sharePreviewDevPlugin(): Plugin {
  return {
    name: 'share-preview-dev',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        const match = url.match(/^\/(?:p|produto)\/([^/?]+)/);
        if (match) {
          const productId = decodeURIComponent(match[1]);
          // In local dev, redirect to /?produto=<id> so the modal opens immediately
          res.writeHead(302, {
            Location: `/?produto=${encodeURIComponent(productId)}`,
          });
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), sharePreviewDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
