import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Check, ArrowUpRight } from 'lucide-react';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';
import { getProducts, getWelcomeMessage, restockProduct } from './services/api';

const GithubIcon = ({ size = 13, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'inventory'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);
  const [restockingId, setRestockingId] = useState(null);

  // Modal state: { type: 'detail' | 'create' | 'edit' | null, productId: null, product: null }
  const [modal, setModal] = useState({ type: null, productId: null, product: null });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [welcome, prods] = await Promise.allSettled([
        getWelcomeMessage(),
        getProducts(),
      ]);

      if (welcome.status === 'fulfilled') {
        setApiOnline(true);
      } else {
        setApiOnline(false);
      }

      if (prods.status === 'fulfilled') {
        setProducts(prods.value || []);
      }
    } catch {
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modal.type) {
        setModal({ type: null, productId: null, product: null });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal.type]);

  const handleRestock = async (productId) => {
    try {
      setRestockingId(productId);
      const updated = await restockProduct(productId, 10);
      setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
      showToast('Restocked +10 units');
    } catch (err) {
      alert(err.message || 'Restock failed');
    } finally {
      setRestockingId(null);
    }
  };

  const handleProductSaved = (savedProduct, message) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      }
      return [savedProduct, ...prev];
    });
    showToast(message || 'Changes saved');
  };

  const handleProductDeleted = (deletedId) => {
    setProducts((prev) => prev.filter((p) => p.id !== deletedId));
    showToast('Product deleted');
  };

  const openDetail = (productId) => {
    setModal({ type: 'detail', productId, product: null });
  };

  const openCreate = () => {
    setModal({ type: 'create', productId: null, product: null });
  };

  const openEdit = (product) => {
    setModal({ type: 'edit', productId: product.id, product });
  };

  const closeModal = () => {
    setModal({ type: null, productId: null, product: null });
  };

  const [inventoryFilter, setInventoryFilter] = useState('all');

  const handleViewChange = (view, filter = 'all') => {
    setCurrentView(view);
    if (view === 'inventory') {
      setInventoryFilter(filter);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="navbar-inner">
          {/* Decluttered brand button: clicking logo or name reloads page */}
          <button className="brand-link" onClick={handleReload} title="Reload page">
            <span className="brand-icon-naked">
              <Package size={20} />
            </span>
            <span>Crate</span>
          </button>

          <div className="nav-right">
            <div className="status-indicator">
              <span className={`status-dot ${apiOnline ? '' : 'error'}`}></span>
              <span>{apiOnline ? 'API connected' : 'Offline'}</span>
            </div>

            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <Plus size={14} /> Add Product
            </button>
          </div>
        </div>
      </header>

      {/* Centered Symmetrical Navigation Bar below Header */}
      <div className="subnav-center-bar">
        <nav className="nav-tabs-centered">
          <button
            className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleViewChange('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-tab ${currentView === 'inventory' ? 'active' : ''}`}
            onClick={() => handleViewChange('inventory', 'all')}
          >
            <span>Inventory</span>
            <span className="tab-count">{products.length}</span>
          </button>
        </nav>
      </div>

      {/* Main View Area */}
      <main className="main-content">
        {currentView === 'dashboard' ? (
          <Home
            products={products}
            loading={loading}
            onViewChange={handleViewChange}
            onSelectProduct={openDetail}
            onRestockProduct={handleRestock}
            restockingId={restockingId}
          />
        ) : (
          <ProductList
            products={products}
            loading={loading}
            onSelectProduct={openDetail}
            onOpenCreate={openCreate}
            initialFilter={inventoryFilter}
            onRestockProduct={handleRestock}
            restockingId={restockingId}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <span className="footer-brand">Crate</span>
            <span className="footer-dot">·</span>
            <span className="footer-desc">Inventory Manager</span>
          </div>

          <div className="footer-right">
            <a
              href="https://shreyansr.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              <span>Shreyan Sardar</span>
              <ArrowUpRight size={13} className="footer-icon-arrow" />
            </a>
            <span className="footer-slash">/</span>
            <a
              href="https://github.com/shreyansr01/crate"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              <GithubIcon size={13} className="footer-icon-github" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Centered Symmetrical Modals */}
      {modal.type === 'detail' && (
        <ProductDetail
          productId={modal.productId}
          onClose={closeModal}
          onEdit={openEdit}
          onProductDeleted={handleProductDeleted}
        />
      )}

      {(modal.type === 'create' || modal.type === 'edit') && (
        <ProductForm
          productToEdit={modal.product}
          onClose={closeModal}
          onSaved={handleProductSaved}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          <Check size={14} style={{ color: 'var(--success)' }} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
