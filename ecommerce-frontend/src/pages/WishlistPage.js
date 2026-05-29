import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductDetailsModal from '../components/ProductDetailsModal';

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="pt-36 md:pt-28 min-h-screen px-margin-mobile md:px-gutter max-w-container-max mx-auto relative">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <h1 className="font-display-lg text-4xl mb-8">
        Your Wishlist <span className="text-on-surface-variant font-body-md text-lg">({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})</span>
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center mt-20 glass-card p-12 rounded-3xl max-w-lg mx-auto border border-outline/10 shadow-lg flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40 bg-surface-container-highest/30 p-4 rounded-full">
            heart_broken
          </span>
          <p className="text-on-surface-variant font-headline-md text-2xl m-0">Your wishlist is empty</p>
          <p className="text-sm text-on-surface-variant max-w-xs m-0">
            Browse the tech catalog and toggle the heart icon to save items to your personal coordinates.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="mt-2 px-8 py-4 bg-primary-container text-on-primary-fixed font-bold font-label-md rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,170,255,0.3)]"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter pb-40 animate-fade-in">
          {wishlistItems.map((product) => {
            const isFav = isInWishlist(product.id);
            return (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="glass-card p-6 rounded-3xl group relative overflow-hidden flex flex-col justify-between border border-outline/10 hover:border-secondary-fixed/30 cursor-pointer transition-all duration-300"
              >
                {/* Category Badge */}
                <span className="absolute top-4 left-4 bg-surface-container/80 backdrop-blur-md text-on-surface-variant font-label-md text-[10px] px-3 py-1 rounded-full z-10 border border-outline/20">
                  {product.category || 'TECH'}
                </span>

                {/* Heart Toggle */}
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleWishlist(product); 
                  }}
                  className={`absolute top-4 right-4 transition-all duration-300 z-10 ${
                    isFav
                      ? 'text-error shadow-[0_0_15px_rgba(255,180,171,0.4)] bg-error/10 p-1.5 rounded-full border border-error/20' 
                      : 'text-on-surface-variant hover:text-error'
                  }`}
                  title="Remove from Wishlist"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>

                {/* Image */}
                <div className="aspect-square mt-8 mb-6 overflow-hidden flex items-center justify-center p-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 floating-anim"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                  />
                </div>

                {/* Title & Price */}
                <div>
                  <h4 className="font-headline-md text-body-lg mb-2 truncate" title={product.name}>
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-fixed font-sans font-bold text-lg tabular-nums">₹{product.price}</span>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        addToCart(product); 
                      }}
                      className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline/20 flex items-center justify-center hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all shadow-sm"
                      title="Add to Cart"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Product Details & Specifications Modal */}
      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}
