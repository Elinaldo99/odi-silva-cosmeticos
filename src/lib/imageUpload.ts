import { supabase } from './supabase';

/**
 * Resizes and compresses an image file in the browser using HTML5 Canvas.
 * This guarantees fast uploads, prevents memory errors, and optimizes performance.
 */
export const compressImage = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<{ blob: Blob; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível inicializar o contexto 2D para a imagem.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp if supported, or jpeg
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, dataUrl });
            } else {
              reject(new Error('Falha ao processar arquivo de imagem.'));
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Erro ao carregar os dados da imagem.'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo do dispositivo.'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Uploads a product image directly to Supabase Storage bucket 'products'.
 * Falls back to compressed data URL if Supabase upload fails.
 */
export const uploadProductImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
  }

  // 10MB limit before compression
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('A imagem selecionada é muito grande (máximo 10MB permitidos).');
  }

  onProgress?.(25);

  try {
    // Compress image to save bandwidth and storage space
    const { blob, dataUrl } = await compressImage(file);
    onProgress?.(60);

    const fileExt = file.type === 'image/png' ? 'png' : 'jpg';
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const fileName = `${Date.now()}-${cleanFileName}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Try uploading to Supabase Storage bucket 'products'
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, blob, {
        contentType: blob.type,
        cacheControl: '31536000',
        upsert: false,
      });

    onProgress?.(90);

    if (uploadError) {
      console.warn('Supabase storage upload error, falling back to compressed local data:', uploadError.message);
      onProgress?.(100);
      // Fallback: return compressed dataUrl so the user can still use and save their product
      return dataUrl;
    }

    // Get public URL from Supabase
    const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filePath);

    onProgress?.(100);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn('Error during image processing, attempting raw fallback:', err);
    // If canvas or compression had an issue, attempt direct read as data URL
    return new Promise((resolve, reject) => {
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => {
        onProgress?.(100);
        resolve(fallbackReader.result as string);
      };
      fallbackReader.onerror = () => reject(new Error('Não foi possível processar a foto.'));
      fallbackReader.readAsDataURL(file);
    });
  }
};
