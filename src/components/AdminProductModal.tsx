import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, RotateCcw, Check, Phone, Package, Tag, Flame, Star, Save } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatCurrency } from '../config/storeConfig';

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

  if (!isAdminOpen) return null;

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
    setActiveTab('new');
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

    if (editingProductId) {
      updateProduct(editingProductId, {
        nome: formData.nome,
        descricao: formData.descricao,
        descricao_completa: formData.descricao_completa,
        categoria: formData.categoria,
        preco: precoNum,
        preco_promocional: promoNum,
        imagem: defaultImg,
        imagens: [defaultImg],
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
        imagens: [defaultImg],
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
            onClick={() => setActiveTab('new')}
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
                    onClick={() => {
                      setEditingProductId(null);
                      setActiveTab('new');
                    }}
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
                          {p.categoria}
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

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    value={formData.imagem}
                    onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-pink-500 focus:outline-none"
                  />
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
