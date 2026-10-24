import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Check,
  Phone,
  Package,
  Save,
  Upload,
  Image as ImageIcon,
  Camera,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatCurrency } from '../config/storeConfig';
import { uploadProductImage } from '../lib/imageUpload';

// Quick cosmetic preset samples for testing or fast cataloging
const SAMPLE_COSMETIC_PHOTOS = [
  {
    name: 'Gloss Rosa',
    url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sérum Facial',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Creme Hidratante',
    url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Perfume Elegance',
    url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Body Splash',
    url: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
  },
];

export const AdminProductModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    whatsappNumber,
    setWhatsappNumber,
  } = useCart();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'products' | 'new' | 'settings'>('products');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Editable phone number
  const [phoneInput, setPhoneInput] = useState(whatsappNumber);

  // New/Edit product form state
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    descricao_completa: '',
    categoria: 'maquiagem',
    preco: '',
    preco_promocional: '',
    imagem: '',
    estoque: '20',
    destaque: true,
    mais_vendido: false,
    oferta: false,
    volume_ou_peso: '',
  });

  // Additional gallery images
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  // Image upload UI states
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = useState<boolean>(false);

  if (!isAdminOpen) return null;

  const handleStartNewProduct = () => {
    setEditingProductId(null);
    setFormData({
      nome: '',
      descricao: '',
      descricao_completa: '',
      categoria: 'maquiagem',
      preco: '',
      preco_promocional: '',
      imagem: '',
      estoque: '20',
      destaque: true,
      mais_vendido: false,
      oferta: false,
      volume_ou_peso: '',
    });
    setAdditionalImages([]);
    setUploadError(null);
    setImageTab('upload');
    setActiveTab('new');
  };

  const handleStartEdit = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      nome: product.nome,
      descricao: product.descricao,
      descricao_completa: product.descricao_completa || product.descricao,
      categoria: product.categoria,
      preco: product.preco.toString(),
      preco_promocional: product.preco_promocional ? product.preco_promocional.toString() : '',
      imagem: product.imagem,
      estoque: product.estoque.toString(),
      destaque: product.destaque,
      mais_vendido: product.mais_vendido,
      oferta: product.oferta,
      volume_ou_peso: product.volume_ou_peso || '',
    });
    const extras = (product.imagens || []).filter((img) => img && img !== product.imagem);
    setAdditionalImages(extras);
    setUploadError(null);
    setImageTab(product.imagem ? 'upload' : 'upload');
    setActiveTab('new');
  };

  // Primary photo upload handler
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(15);
    try {
      const publicUrl = await uploadProductImage(file, (progress) => {
        setUploadProgress(progress);
      });
      setFormData((prev) => ({ ...prev, imagem: publicUrl }));
    } catch (err: any) {
      console.error('Error uploading product photo:', err);
      setUploadError(err?.message || 'Falha ao processar ou enviar a foto.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    } else if (file) {
      setUploadError('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
    }
  };

  // Additional gallery photos handler
  const handleAdditionalFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingAdditional(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadProductImage(file));
      const urls = await Promise.all(uploadPromises);
      setAdditionalImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      alert('Erro ao enviar foto adicional: ' + (err?.message || 'Tente novamente'));
    } finally {
      setIsUploadingAdditional(false);
    }
  };

  const removeAdditionalImage = (indexToRemove: number) => {
    setAdditionalImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.preco) {
      alert('Por favor, preencha pelo menos o nome e o preço do produto.');
      return;
    }

    const precoNum = parseFloat(formData.preco.replace(',', '.'));
    const promoNum = formData.preco_promocional
      ? parseFloat(formData.preco_promocional.replace(',', '.'))
      : undefined;
    const estoqueNum = parseInt(formData.estoque, 10) || 10;

    const defaultImg =
      formData.imagem.trim() ||
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80';

    const allImages = Array.from(new Set([defaultImg, ...additionalImages.filter(Boolean)]));

    if (editingProductId) {
      updateProduct(editingProductId, {
        nome: formData.nome,
        descricao: formData.descricao,
        descricao_completa: formData.descricao_completa,
        categoria: formData.categoria,
        preco: precoNum,
        preco_promocional: promoNum,
        imagem: defaultImg,
        imagens: allImages,
        estoque: estoqueNum,
        destaque: formData.destaque,
        mais_vendido: formData.mais_vendido,
        oferta: formData.oferta,
        volume_ou_peso: formData.volume_ou_peso,
      });
      setEditingProductId(null);
    } else {
      const slug = formData.nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');

      addProduct({
        nome: formData.nome,
        slug,
        descricao: formData.descricao || 'Produto de beleza de alta performance.',
        descricao_completa: formData.descricao_completa || formData.descricao,
        categoria: formData.categoria,
        preco: precoNum,
        preco_promocional: promoNum,
        imagem: defaultImg,
        imagens: allImages,
        estoque: estoqueNum,
        destaque: formData.destaque,
        mais_vendido: formData.mais_vendido,
        oferta: formData.oferta,
        volume_ou_peso: formData.volume_ou_peso || 'Unidade',
        avaliacao: 5.0,
        total_avaliacoes: 1,
      });
    }

    // Reset form and return to list
    setFormData({
      nome: '',
      descricao: '',
      descricao_completa: '',
      categoria: 'maquiagem',
      preco: '',
      preco_promocional: '',
      imagem: '',
      estoque: '20',
      destaque: true,
      mais_vendido: false,
      oferta: false,
      volume_ou_peso: '',
    });
    setAdditionalImages([]);
    setUploadError(null);
    setActiveTab('products');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setWhatsappNumber(phoneInput);
    alert('Configurações do WhatsApp atualizadas com sucesso! 💗');
  };

  return (
    <div
      id="admin-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAdminOpen(false);
      }}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#FFF8F9] border-b border-pink-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-pink-600 uppercase bg-pink-100 px-2 py-0.5 rounded">
              ADMINISTRAÇÃO
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              Gerenciamento da Loja & Produtos
            </h2>
            <p className="text-xs text-stone-500">
              Cadastre, edite produtos, ajuste preços, controle estoque e configure o WhatsApp.
            </p>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="w-9 h-9 rounded-full bg-white text-stone-500 hover:text-pink-600 shadow-xs flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50 text-xs font-semibold">
          <button
            onClick={() => {
              setEditingProductId(null);
              setActiveTab('products');
            }}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-pink-600 text-pink-700 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Produtos Cadastrados ({products.length})</span>
          </button>

          <button
            onClick={() => {
              if (!editingProductId) {
                handleStartNewProduct();
              } else {
                setActiveTab('new');
              }
            }}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'new'
                ? 'border-pink-600 text-pink-700 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingProductId ? 'Editar Produto' : 'Cadastrar Novo Produto'}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-pink-600 text-pink-700 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Configuração do WhatsApp</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: Product List */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-500">
                  Gerencie o catálogo ativo da loja. As alterações são refletidas imediatamente.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleStartNewProduct}
                    className="px-3 py-1.5 rounded-lg bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Produto</span>
                  </button>

                  <button
                    onClick={resetProductsToDefault}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-600 text-xs font-semibold flex items-center gap-1"
                    title="Restaurar lista original de demonstração"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar Padrão</span>
                  </button>
                </div>
              </div>

              {/* Table or Cards */}
              <div className="divide-y divide-stone-200 border border-stone-200 rounded-2xl overflow-hidden">
                {products.map((p) => (
                  <div key={p.id} className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-pink-50/40">
                    <img
                      src={p.imagem}
                      alt={p.nome}
                      className="w-14 h-14 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">
                          {p.categoria.replace(/-/g, ' ')}
                        </span>
                        {p.oferta && (
                          <span className="text-[10px] font-bold text-white bg-pink-600 px-1.5 rounded">
                            Oferta
                          </span>
                        )}
                        {p.mais_vendido && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 rounded">
                            Mais vendido
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate mt-0.5">
                        {p.nome}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span>Preço: <strong>{formatCurrency(p.preco)}</strong></span>
                        {p.preco_promocional && (
                          <span className="text-pink-600 font-semibold">
                            Promo: {formatCurrency(p.preco_promocional)}
                          </span>
                        )}
                        <span>Estoque: <strong>{p.estoque}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="p-2 rounded-lg text-stone-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        title="Editar produto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja excluir "${p.nome}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Add/Edit Product Form */}
          {activeTab === 'new' && (
            <form onSubmit={handleSaveProduct} className="space-y-4 max-w-2xl mx-auto">
              <h3 className="font-serif text-lg font-bold text-stone-900 border-b pb-2">
                {editingProductId ? 'Editar Informações do Produto' : 'Cadastrar Novo Cosmético'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Gloss Labial Rosa Hidratante"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-pink-500 focus:outline-none bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Conteúdo / Volume
                  </label>
                  <input
                    type="text"
                    value={formData.volume_ou_peso}
                    onChange={(e) => setFormData({ ...formData, volume_ou_peso: e.target.value })}
                    placeholder="Ex: 50g, 100ml, 5ml"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Preço Regular (R$) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    placeholder="Ex: 29.90"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Preço Promocional (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.preco_promocional}
                    onChange={(e) => setFormData({ ...formData, preco_promocional: e.target.value })}
                    placeholder="Ex: 24.90"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Quantidade em Estoque
                  </label>
                  <input
                    type="number"
                    value={formData.estoque}
                    onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>

                {/* Photo Upload Section */}
                <div className="sm:col-span-2 space-y-3 bg-pink-50/50 p-4 sm:p-5 rounded-2xl border border-pink-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-pink-600" />
                          <span>Foto do Cosmético</span>
                        </label>
                        <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">
                          {formData.imagem ? 'Foto Definida' : 'Obrigatório / Recomendado'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Adicione a foto do produto direto da sua galeria/computador ou insira um link.
                      </p>
                    </div>

                    {/* Mode Switch: Upload vs Link URL */}
                    <div className="flex bg-stone-200/80 p-0.5 rounded-xl text-xs self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setImageTab('upload')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                          imageTab === 'upload'
                            ? 'bg-white text-pink-700 shadow-xs font-semibold'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Carregar Arquivo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab('url')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                          imageTab === 'url'
                            ? 'bg-white text-pink-700 shadow-xs font-semibold'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Link / URL</span>
                      </button>
                    </div>
                  </div>

                  {/* Hidden file input for primary photo */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    className="hidden"
                  />

                  {/* Mode 1: File Upload / Drag & Drop */}
                  {imageTab === 'upload' && (
                    <div className="space-y-3">
                      {formData.imagem ? (
                        /* Image Preview Card */
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-pink-200 shadow-xs">
                          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-xs">
                            <img
                              src={formData.imagem}
                              alt="Prévia do produto"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1.5 left-1.5 bg-pink-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              Principal
                            </div>
                          </div>

                          <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-emerald-700">
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span>Foto pronta para salvar!</span>
                            </div>
                            <p className="text-[11px] text-stone-500 truncate max-w-md">
                              {formData.imagem.startsWith('data:')
                                ? 'Imagem local pronta e comprimida para alta performance'
                                : formData.imagem}
                            </p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="px-3 py-1.5 rounded-lg border border-pink-300 text-pink-700 hover:bg-pink-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span>Trocar foto</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, imagem: '' })}
                                disabled={isUploading}
                                className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remover foto</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Drag and Drop Upload Area */
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => !isUploading && fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                            isDragging
                              ? 'border-pink-500 bg-pink-100/70 scale-[1.01]'
                              : 'border-pink-300 hover:border-pink-500 bg-white hover:bg-pink-50/40'
                          }`}
                        >
                          {isUploading ? (
                            <div className="flex flex-col items-center justify-center gap-2 py-4">
                              <Loader2 className="w-9 h-9 text-pink-600 animate-spin" />
                              <p className="text-xs font-bold text-stone-800">Processando e enviando foto...</p>
                              <div className="w-48 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-pink-600 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-stone-500">{uploadProgress}% concluído</span>
                            </div>
                          ) : (
                            <>
                              <div className="w-13 h-13 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center shadow-xs">
                                <Upload className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-bold text-stone-800">
                                  <span className="text-pink-600 underline">Clique para selecionar do dispositivo</span> ou arraste aqui
                                </p>
                                <p className="text-[11px] text-stone-500">
                                  Suporta fotos tiradas na câmera ou salvas na galeria (JPG, PNG, WEBP até 10MB)
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode 2: Link / URL Input */}
                  {imageTab === 'url' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.imagem}
                          onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                          placeholder="Cole aqui o link direto da imagem (ex: https://images.unsplash.com/...)"
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:border-pink-500 focus:outline-none bg-white"
                        />
                        {formData.imagem && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imagem: '' })}
                            className="px-3 py-2 rounded-xl text-stone-500 hover:text-rose-600 border border-stone-200 hover:bg-rose-50 text-xs font-medium"
                          >
                            Limpar
                          </button>
                        )}
                      </div>

                      {formData.imagem && (
                        <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-stone-200">
                          <img
                            src={formData.imagem}
                            alt="Prévia da URL"
                            className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0 border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div className="text-xs min-w-0 flex-1">
                            <span className="font-semibold text-stone-800 block truncate">Prévia do link informado</span>
                            <span className="text-[10px] text-stone-400 truncate block">{formData.imagem}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error Notification */}
                  {uploadError && (
                    <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Quick Cosmetic Presets (for fast test or demo) */}
                  <div className="pt-2">
                    <p className="text-[10px] text-stone-500 font-medium mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-pink-500" />
                      <span>Ou escolha uma foto de cosmético demonstrativa pronta:</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SAMPLE_COSMETIC_PHOTOS.map((sample) => (
                        <button
                          key={sample.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, imagem: sample.url })}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all ${
                            formData.imagem === sample.url
                              ? 'border-pink-600 bg-pink-50/80 ring-1 ring-pink-500'
                              : 'border-stone-200 bg-white hover:border-pink-300 hover:bg-pink-50/30'
                          }`}
                        >
                          <img
                            src={sample.url}
                            alt={sample.name}
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                          <span className="text-[10px] font-semibold text-stone-700 truncate">
                            {sample.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Galeria de Fotos Adicionais (Mais ângulos) */}
                  <div className="pt-3 border-t border-pink-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
                        <span>Galeria / Fotos Adicionais (Opcional)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => additionalFileInputRef.current?.click()}
                        disabled={isUploadingAdditional}
                        className="text-[11px] font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1 bg-pink-100 hover:bg-pink-200/80 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        {isUploadingAdditional ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                        <span>+ Adicionar Mais Fotos</span>
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={additionalFileInputRef}
                      onChange={(e) => handleAdditionalFiles(e.target.files)}
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      multiple
                      className="hidden"
                    />

                    {additionalImages.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {additionalImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-stone-200 bg-white shadow-xs group"
                          >
                            <img
                              src={imgUrl}
                              alt={`Foto adicional ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(idx)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-85 hover:opacity-100 shadow-sm transition-opacity"
                              title="Remover foto adicional"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-stone-400 italic">
                        Nenhuma foto adicional adicionada. Você pode enviar outros ângulos ou embalagem para a galeria.
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Descrição Curta
                  </label>
                  <input
                    type="text"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Breve resumo para o card do produto"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Descrição Completa & Modo de Uso
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descricao_completa}
                    onChange={(e) => setFormData({ ...formData, descricao_completa: e.target.value })}
                    placeholder="Detalhes completos exibidos no modal de produto"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>

                {/* Status Toggles */}
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.oferta}
                      onChange={(e) => setFormData({ ...formData, oferta: e.target.checked })}
                      className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
                    />
                    <span>Produto em Oferta Especial</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.mais_vendido}
                      onChange={(e) => setFormData({ ...formData, mais_vendido: e.target.checked })}
                      className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
                    />
                    <span>Identificar como Mais Vendido 🔥</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.destaque}
                      onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                      className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
                    />
                    <span>Destaque na Página Inicial</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProductId(null);
                    setActiveTab('products');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProductId ? 'Atualizar Produto' : 'Salvar Produto'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Store and WhatsApp Settings */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-lg mx-auto">
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Configurações do WhatsApp para Vendas
                </h3>
                <p className="text-xs text-stone-600">
                  Configure o número oficial que receberá as mensagens formatadas de pedidos gerados pelos clientes.
                </p>
              </div>

              <div className="space-y-2 bg-pink-50/60 p-4 rounded-2xl border border-pink-100">
                <label className="block text-xs font-bold text-stone-800">
                  Número de WhatsApp da Loja (com DDI e DDD)
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="5511999998888"
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white text-sm font-mono focus:border-pink-500 focus:outline-none shadow-xs"
                />
                <p className="text-[11px] text-stone-500">
                  Formato internacional (somente números): <strong>55</strong> (Brasil) + <strong>DDD</strong> + <strong>Número</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
                <p className="font-semibold text-stone-800">Preparado para Banco de Dados (Supabase / Firestore):</p>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  A estrutura modular foi projetada com tipos TypeScript padronizados (<code className="text-pink-600 font-mono">Product</code>, <code className="text-pink-600 font-mono">Category</code>, <code className="text-pink-600 font-mono">CartItem</code>), facilitando a migração para qualquer banco relacional ou API no futuro.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Número do WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
