import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { WHATSAPP_NUMBER } from '../config/storeConfig';
import { supabase } from '../lib/supabase';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Selected product for quick modal view
  selectedProduct: Product | null;
  openProductDetails: (product: Product) => void;
  closeProductDetails: () => void;

  // Search and Category Navigation State
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Notification Toast
  notification: string | null;
  showNotification: (msg: string) => void;

  // Custom WhatsApp Number configuration
  whatsappNumber: string;
  setWhatsappNumber: (num: string) => void;

  // Products state (synchronized with Supabase)
  products: Product[];
  isLoadingProducts: boolean;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (id: string, updatedFields: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetProductsToDefault: () => Promise<void>;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // Delivery / Shipping notice popup for Roraima
  isDeliveryModalOpen: boolean;
  setIsDeliveryModalOpen: (open: boolean) => void;
  openDeliveryModal: () => void;
  closeDeliveryModal: (dontShowAgain?: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'odi_silva_cart_v1';
const PRODUCTS_STORAGE_KEY = 'odi_silva_products_v1';
const WHATSAPP_STORAGE_KEY = 'odi_silva_whatsapp_number';
const DELIVERY_NOTICE_KEY = 'odi_silva_delivery_notice_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Products state with localStorage fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Configurable WhatsApp number
  const [whatsappNumber, setWhatsappNumberState] = useState<string>(() => {
    try {
      return localStorage.getItem(WHATSAPP_STORAGE_KEY) || WHATSAPP_NUMBER;
    } catch {
      return WHATSAPP_NUMBER;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState<boolean>(false);

  // Check if visitor has seen the Roraima delivery notice before
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem(DELIVERY_NOTICE_KEY);
      if (!hasSeen) {
        // Trigger popup on first visit after a soft delay
        const timer = setTimeout(() => {
          setIsDeliveryModalOpen(true);
        }, 650);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Error reading delivery notice localStorage:', e);
    }
  }, []);

  const openDeliveryModal = useCallback(() => {
    setIsDeliveryModalOpen(true);
  }, []);

  const closeDeliveryModal = useCallback((dontShowAgain = true) => {
    setIsDeliveryModalOpen(false);
    if (dontShowAgain) {
      try {
        localStorage.setItem(DELIVERY_NOTICE_KEY, 'seen');
      } catch (e) {
        console.warn('Error saving delivery notice localStorage:', e);
      }
    }
  }, []);

  // Function to load products from Supabase
  const loadProductsFromSupabase = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Could not load products from Supabase:', error.message);
      } else if (data && data.length > 0) {
        const formatted: Product[] = data.map((item) => ({
          ...item,
          preco: Number(item.preco),
          preco_promocional: item.preco_promocional ? Number(item.preco_promocional) : undefined,
          estoque: Number(item.estoque) || 0,
          avaliacao: item.avaliacao ? Number(item.avaliacao) : 5.0,
          total_avaliacoes: item.total_avaliacoes ? Number(item.total_avaliacoes) : 0,
          imagens: Array.isArray(item.imagens) ? item.imagens : [item.imagem],
          beneficios: Array.isArray(item.beneficios) ? item.beneficios : [],
        }));
        setProducts(formatted);
      }
    } catch (err) {
      console.warn('Network issue fetching Supabase products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Function to load settings from Supabase
  const loadSettingsFromSupabase = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 'config')
        .maybeSingle();

      if (!error && data?.whatsapp_number) {
        setWhatsappNumberState(data.whatsapp_number);
      }
    } catch (err) {
      console.warn('Could not load store_settings from Supabase:', err);
    }
  }, []);

  // Initial load and Realtime listener
  useEffect(() => {
    loadProductsFromSupabase();
    loadSettingsFromSupabase();

    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        loadProductsFromSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadProductsFromSupabase, loadSettingsFromSupabase]);

  const setWhatsappNumber = async (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    setWhatsappNumberState(cleaned);
    try {
      localStorage.setItem(WHATSAPP_STORAGE_KEY, cleaned);
    } catch (e) {
      console.error(e);
    }

    try {
      await supabase.from('store_settings').upsert({
        id: 'config',
        whatsapp_number: cleaned,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to sync whatsapp number to Supabase:', err);
    }
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const addToCart = (product: Product, quantity = 1) => {
    const maxStock = typeof product.estoque === 'number' ? product.estoque : 999;
    if (maxStock <= 0) {
      showNotification(`"${product.nome}" está esgotado!`);
      return;
    }

    let reachedLimit = false;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, maxStock);
        if (newQty === currentQty) {
          reachedLimit = true;
          return prevCart;
        }
        if (currentQty + quantity > maxStock) {
          reachedLimit = true;
        }
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const clampedQty = Math.min(quantity, maxStock);
        if (quantity > maxStock) {
          reachedLimit = true;
        }
        return [...prevCart, { product, quantity: clampedQty }];
      }
    });

    if (reachedLimit) {
      showNotification(`Limite de estoque atingido para "${product.nome}" (${maxStock} unid.)`);
    } else {
      showNotification(`"${product.nome}" adicionado ao carrinho! 💗`);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showNotification('Item removido do carrinho.');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = typeof item.product.estoque === 'number' ? item.product.estoque : 999;
          const clampedQty = Math.min(quantity, maxStock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    showNotification('Carrinho esvaziado.');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.preco_promocional && item.product.preco_promocional > 0
      ? item.product.preco_promocional
      : item.product.preco;
    return sum + price * item.quantity;
  }, 0);

  // Administrative actions with Supabase persistence
  const addProduct = async (newProd: Omit<Product, 'id' | 'created_at'>) => {
    const createdProduct: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setProducts((prev) => [createdProduct, ...prev]);

    try {
      const { error } = await supabase.from('products').insert([
        {
          id: createdProduct.id,
          nome: createdProduct.nome,
          slug: createdProduct.slug,
          descricao: createdProduct.descricao,
          descricao_completa: createdProduct.descricao_completa,
          categoria: createdProduct.categoria,
          preco: createdProduct.preco,
          preco_promocional: createdProduct.preco_promocional || null,
          imagem: createdProduct.imagem,
          imagens: createdProduct.imagens,
          estoque: createdProduct.estoque,
          destaque: createdProduct.destaque,
          mais_vendido: createdProduct.mais_vendido,
          oferta: createdProduct.oferta,
          volume_ou_peso: createdProduct.volume_ou_peso || null,
          avaliacao: createdProduct.avaliacao || 5.0,
          total_avaliacoes: createdProduct.total_avaliacoes || 0,
          beneficios: createdProduct.beneficios || [],
          modo_de_uso: createdProduct.modo_de_uso || null,
          created_at: createdProduct.created_at,
        },
      ]);
      if (error) {
        console.error('Supabase add product error:', error.message);
      }
    } catch (err) {
      console.error('Failed to insert product into Supabase:', err);
    }

    showNotification('Novo produto cadastrado com sucesso!');
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );

    try {
      const payload: Record<string, any> = { ...updatedFields };
      if (payload.preco !== undefined) payload.preco = Number(payload.preco);
      if (payload.preco_promocional !== undefined) {
        payload.preco_promocional = payload.preco_promocional ? Number(payload.preco_promocional) : null;
      }
      const { error } = await supabase.from('products').update(payload).eq('id', id);
      if (error) {
        console.error('Supabase update product error:', error.message);
      }
    } catch (err) {
      console.error('Failed to update product in Supabase:', err);
    }

    showNotification('Produto atualizado!');
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from cart if present
    setCart((prev) => prev.filter((item) => item.product.id !== id));

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete product error:', error.message);
      }
    } catch (err) {
      console.error('Failed to delete product from Supabase:', err);
    }

    showNotification('Produto excluído.');
  };

  const resetProductsToDefault = async () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);

    try {
      for (const p of INITIAL_PRODUCTS) {
        await supabase.from('products').upsert({
          ...p,
          preco_promocional: p.preco_promocional || null,
          volume_ou_peso: p.volume_ou_peso || null,
          modo_de_uso: p.modo_de_uso || null,
        });
      }
    } catch (err) {
      console.error('Failed to reset products in Supabase:', err);
    }

    showNotification('Produtos restaurados para os dados padrão.');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        toggleCart,
        selectedProduct,
        openProductDetails,
        closeProductDetails,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        notification,
        showNotification,
        whatsappNumber,
        setWhatsappNumber,
        products,
        isLoadingProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        isAdminOpen,
        setIsAdminOpen,
        isDeliveryModalOpen,
        setIsDeliveryModalOpen,
        openDeliveryModal,
        closeDeliveryModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
