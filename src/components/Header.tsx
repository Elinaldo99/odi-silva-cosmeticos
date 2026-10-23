import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, Sparkles, Heart, Settings, User as UserIcon, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { STORE_CONFIG } from '../config/storeConfig';

interface HeaderProps {
  onNavigateToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToSection }) => {
  const { totalItems, openCart, searchQuery, setSearchQuery, setIsAdminOpen, openDeliveryModal } = useCart();
  const { user, profile, openAuthModal, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    onNavigateToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { label: 'Início', id: 'inicio' },
    { label: 'Produtos', id: 'produtos' },
    { label: 'Categorias', id: 'categorias' },
    { label: 'Ofertas', id: 'ofertas' },
    { label: 'Sobre Nós', id: 'sobre' },
    { label: 'Contato', id: 'contato' },
  ];

  return (
    <>
      {/* Top promotional bar */}
      <button
        type="button"
        onClick={openDeliveryModal}
        className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white text-[11px] sm:text-xs py-1.5 px-3 text-center font-medium tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 hover:brightness-105 transition-all cursor-pointer shadow-xs"
        title="Clique para ver regras de entregas e frete em Roraima"
      >
        <MapPin className="w-3.5 h-3.5 text-amber-200 animate-pulse shrink-0" />
        <span className="truncate sm:overflow-visible">
          <strong>Entregas em Roraima:</strong> Boa Vista (Motoboy) • Interior (Táxi) • <span className="underline decoration-pink-200 font-bold">Saiba mais</span>
        </span>
      </button>

      {/* Main Header */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100 py-3'
            : 'bg-white/90 backdrop-blur-sm border-b border-pink-100/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 rounded-xl text-stone-700 hover:text-pink-600 hover:bg-pink-50 transition-colors focus:outline-none"
                aria-label="Abrir menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-initial text-center lg:text-left">
              <a
                href="#inicio"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('inicio');
                }}
                className="inline-flex flex-col items-center lg:items-start group focus:outline-none"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-stone-900 group-hover:text-pink-700 transition-colors uppercase">
                    ODI SILVA
                  </span>
                  <span className="text-amber-500 text-xs font-semibold tracking-widest px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200/60 hidden sm:inline-block">
                    LUXURY
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-pink-600 uppercase -mt-1">
                  COSMÉTICOS
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  onClick={() => handleNavClick(item.id)}
                  className="text-stone-700 hover:text-pink-600 font-medium text-sm transition-colors relative py-1 hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-pink-500 after:transition-all after:duration-200"
                >
                  {item.label}
                  {item.id === 'ofertas' && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-700 rounded-full">
                      %
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Toggle / Input */}
              <div className="relative">
                <button
                  id="search-toggle-btn"
                  onClick={() => {
                    setIsSearchVisible(!isSearchVisible);
                    if (!isSearchVisible) {
                      handleNavClick('produtos');
                    }
                  }}
                  className="p-2 rounded-xl text-stone-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                  aria-label="Buscar produtos"
                  title="Buscar produtos"
                >
                  <Search className="w-5 h-5" />
                </button>

                {isSearchVisible && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white shadow-xl rounded-2xl border border-pink-100 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar maquiagem, skincare..."
                        className="w-full pl-9 pr-8 py-2 text-sm bg-pink-50/60 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500 text-stone-800 placeholder-stone-400"
                        autoFocus
                      />
                      <Search className="w-4 h-4 text-pink-500 absolute left-3 top-2.5" />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Authentication Button */}
              {user ? (
                <button
                  id="header-user-btn"
                  onClick={() => openAuthModal('login')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full transition-all text-xs font-medium active:scale-95 shadow-sm ${
                    isAdmin
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-pink-50 hover:bg-pink-100/90 text-stone-800 border border-pink-200/80'
                  }`}
                  title={isAdmin ? 'Painel Admin (Clique para ver)' : 'Minha Conta Supabase'}
                  aria-label="Perfil do Usuário"
                >
                  <div
                    className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-[11px] shadow-sm uppercase ${
                      isAdmin
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-600'
                        : 'bg-gradient-to-tr from-pink-600 to-rose-400'
                    }`}
                  >
                    {profile?.nome?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline font-semibold max-w-[90px] truncate">
                    {profile?.nome?.split(' ')[0] || (isAdmin ? 'Admin' : 'Conta')}
                  </span>
                  {isAdmin && (
                    <span className="hidden lg:inline text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950 uppercase tracking-wider">
                      Admin
                    </span>
                  )}
                </button>
              ) : (
                <button
                  id="header-auth-btn"
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-stone-700 hover:text-pink-700 hover:bg-pink-50/80 transition-all font-medium text-xs border border-pink-100/80 hover:border-pink-200 active:scale-95"
                  title="Entrar ou Criar Conta"
                  aria-label="Entrar na conta"
                >
                  <UserIcon className="w-4 h-4 text-pink-600" />
                  <span className="hidden sm:inline font-semibold">Entrar</span>
                </button>
              )}

              {/* Cart Button with Count Badge */}
              <button
                id="header-cart-btn"
                onClick={openCart}
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100/80 text-pink-700 transition-all active:scale-95 border border-pink-200/70 shadow-sm"
                aria-label={`Carrinho com ${totalItems} itens`}
              >
                <ShoppingBag className="w-5 h-5 text-pink-600" />
                <span className="hidden md:inline font-semibold text-xs tracking-wide">Carrinho</span>
                <span
                  id="header-cart-counter"
                  className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white rounded-full transition-transform ${
                    totalItems > 0
                      ? 'bg-pink-600 scale-100 shadow-sm animate-bounce-once'
                      : 'bg-stone-300 scale-90'
                  }`}
                >
                  {totalItems}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-pink-100 bg-white/98 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-lg">
            {/* Mobile Auth Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openAuthModal('login');
              }}
              className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-pink-800 bg-pink-50/80 hover:bg-pink-100 border border-pink-200/60 transition-colors flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {user ? (profile?.nome?.charAt(0) || user.email?.charAt(0) || 'U') : <UserIcon className="w-4 h-4" />}
                </div>
                <span>{user ? `Olá, ${profile?.nome || 'Cliente'}` : 'Entrar / Criar Conta'}</span>
              </div>
              <span className="text-xs text-pink-600 font-bold">
                {user ? 'Ver Perfil' : 'Acessar'}
              </span>
            </button>

            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-base font-medium text-stone-700 hover:bg-pink-50 hover:text-pink-700 transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.id === 'ofertas' && (
                  <span className="text-xs bg-pink-100 text-pink-700 font-semibold px-2 py-0.5 rounded-full">
                    Destaques
                  </span>
                )}
              </button>
            ))}

            {isAdmin && (
              <div className="pt-3 border-t border-pink-100 flex items-center justify-between px-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAdminOpen(true);
                  }}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 py-1"
                >
                  <Settings className="w-4 h-4 text-amber-600" />
                  Painel do Administrador
                </button>
                <div className="text-[11px] text-pink-500 font-medium">
                  {STORE_CONFIG.hours}
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};
