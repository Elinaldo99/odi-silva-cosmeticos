import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { CategoriesSection } from './components/CategoriesSection';
import { OffersSection } from './components/OffersSection';
import { BestSellersSection } from './components/BestSellersSection';
import { ProductGrid } from './components/ProductGrid';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminProductModal } from './components/AdminProductModal';
import { AuthModal } from './components/AuthModal';
import { ToastNotification } from './components/ToastNotification';
import { DeliveryNoticeModal } from './components/DeliveryNoticeModal';

const StoreContent: React.FC = () => {
  const { setSelectedCategory } = useCart();

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleSelectCategory = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    scrollToSection('produtos');
  };

  const handleExploreProducts = () => {
    setSelectedCategory('todas');
    scrollToSection('produtos');
  };

  const handleExploreOffers = () => {
    setSelectedCategory('ofertas');
    scrollToSection('ofertas');
  };

  const handleViewAllBestSellers = () => {
    setSelectedCategory('todas');
    scrollToSection('produtos');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F9] text-stone-800 font-sans selection:bg-pink-200 selection:text-pink-900">
      {/* Fixed Luxury Header */}
      <Header onNavigateToSection={scrollToSection} />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreProducts={handleExploreProducts}
          onExploreOffers={handleExploreOffers}
        />

        {/* 4 Core Store Benefits */}
        <Benefits />

        {/* Visual Category Showcase */}
        <CategoriesSection
          selectedCategory=""
          onSelectCategory={handleSelectCategory}
        />

        {/* Special Offers Section */}
        <OffersSection onViewAllOffers={handleExploreOffers} />

        {/* Best Sellers Section */}
        <BestSellersSection onViewAllBestSellers={handleViewAllBestSellers} />

        {/* Complete Product Catalog with Live Filters & Search */}
        <ProductGrid />

        {/* About the Store Section */}
        <AboutSection />
      </main>

      {/* Complete Luxury Footer */}
      <Footer onNavigateToSection={scrollToSection} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Product Details Modal with Gallery */}
      <ProductDetailsModal />

      {/* Floating Always-accessible WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Administrative Product & Config Modal */}
      <AdminProductModal />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Toast Feedback */}
      <ToastNotification />

      {/* First-time Delivery Information Popup for Roraima */}
      <DeliveryNoticeModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StoreContent />
      </CartProvider>
    </AuthProvider>
  );
}

