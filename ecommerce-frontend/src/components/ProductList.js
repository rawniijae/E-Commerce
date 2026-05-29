import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductDetailsModal from './ProductDetailsModal';
import { API_BASE_URL } from '../config';

function ProductList() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const headers = {};
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`${API_BASE_URL}/api/products`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter products based solely on the text search query (matching name or category)
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const nameMatches = product.name.toLowerCase().includes(query);
    const categoryMatches = product.category && product.category.toLowerCase().includes(query);
    
    return nameMatches || categoryMatches;
  });

  return (
    <main className="pt-20">
      {/* Hero Section - Only displayed when no search query is active */}
      {!searchQuery && (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden px-margin-mobile md:px-gutter max-w-container-max mx-auto py-12 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center relative z-10 w-full">
            {/* Hero Content */}
            <div className="space-y-stack-lg">
              <div className="inline-flex items-center gap-2 bg-secondary-fixed/10 border border-secondary-fixed/20 px-4 py-1 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
                <span className="text-secondary-fixed font-label-md uppercase tracking-widest text-[10px]">Next-Gen Precision</span>
              </div>
              <h1 className="font-display-lg text-display-lg leading-tight">
                Hot Gadgets <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-fixed to-primary-container neon-glow-text">Up to 15% Off</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-lg">
                The hottest tech. The coolest offers. Engineered for those who demand peak performance and futuristic aesthetics.
              </p>
            </div>
            {/* Hero Image */}
            <div className="relative flex justify-center items-center">
              <div className="absolute w-[120%] h-[120%] bg-primary-container/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
              <img 
                className="w-full max-w-2xl floating-anim drop-shadow-[0_40px_60px_rgba(0,253,238,0.25)] rounded-2xl" 
                alt="Hero Tech" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt9XSJnAnPsUjvA-fTa6kNceB-DWnbLWBVv-oizfrB1udofTcc0Fd4L203UAgNQ_ueZbIOolQZqn0JAalkBX4sN5r9JVD23MB1fbb9lkg9u2iMW_uz_0D_zWWyXjdJ7kuI9AKIpKvYgWsIVSTYB_k8uQKqYtlJ0fHQmHZU8WZIeCu5BZHdA8N3VVZBWuatmTZfF6NmFP3dPjgvuH5VwWdmJzn6t2pwjdWz1p_-CnjXXzmtNMWDZPMcD-YO2SnN77M-ef4osMVfQ1Y" 
              />
            </div>
          </div>
        </section>
      )}

      {/* Tech Catalog Grid */}
      <section className={`px-margin-mobile md:px-gutter max-w-container-max mx-auto mb-section-gap ${searchQuery ? 'pt-12' : ''}`}>
        <div className="flex justify-between items-end mb-stack-lg border-b border-outline/10 pb-4">
          <h2 className="font-headline-lg text-headline-lg">Tech Catalog</h2>
          {searchQuery && (
            <span className="text-on-surface-variant text-sm font-body-md">
              Filtered by: <span className="text-secondary-fixed font-bold">"{searchQuery}"</span> ({filteredProducts.length} units found)
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="text-center text-secondary-fixed py-20 animate-pulse font-label-md uppercase tracking-wider">
            Loading precision inventory...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-card text-center py-20 text-on-surface-variant rounded-3xl border border-outline/10 max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
            <span className="material-symbols-outlined text-[64px] text-error shadow-[0_0_15px_rgba(255,59,48,0.2)] bg-error/10 p-4 rounded-full">
              search_off
            </span>
            <h3 className="font-headline-md text-2xl text-on-surface">No Products Match Search Criteria</h3>
            <p className="font-body-md max-w-md px-6 text-on-surface-variant">
              We couldn't locate any tech components matching your search for <span className="text-secondary-fixed font-bold">"{searchQuery}"</span>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter pb-40">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="glass-card p-6 rounded-3xl group relative overflow-hidden flex flex-col justify-between border border-outline/10 hover:border-secondary-fixed/30 cursor-pointer transition-all duration-300"
              >
                <span className="absolute top-4 left-4 bg-surface-container/80 backdrop-blur-md text-on-surface-variant font-label-md text-[10px] px-3 py-1 rounded-full z-10 border border-outline/20">
                  {product.category || 'TECH'}
                </span>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleWishlist(product); 
                  }}
                  className={`absolute top-4 right-4 transition-all duration-300 z-10 ${
                    isInWishlist(product.id)
                      ? 'text-error shadow-[0_0_15px_rgba(255,180,171,0.4)] bg-error/10 p-1.5 rounded-full border border-error/20' 
                      : 'text-on-surface-variant hover:text-error'
                  }`}
                  title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isInWishlist(product.id) ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>
                
                <div className="aspect-square mt-8 mb-6 overflow-hidden flex items-center justify-center p-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 floating-anim"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                  />
                </div>
                
                <div>
                  <h4 className="font-headline-md text-body-lg mb-2 truncate" title={product.name}>
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-fixed font-sans font-bold text-lg tabular-nums">₹{product.price}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline/20 flex items-center justify-center hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all shadow-sm"
                      title="Add to Cart"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Details & Specifications Modal */}
      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          addToCart={addToCart}
        />
      )}
    </main>
  );
}

export default ProductList;