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
    <div className="pt-36 md:pt-28 min-h-screen px-margin-mobile md:px-gutter max-w-container-max mx-auto relative bg-background">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <h1 className="font-display-lg text-4xl mb-8 text-on-surface">
        Your Wishlist <span className="text-on-surface-variant font-body-md text-lg font-normal">({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})</span>
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center mt-20 glass-card p-12 rounded-2xl max-w-lg mx-auto shadow-sm flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant bg-surface-container p-4 rounded-full">
            favorite_border
          </span>
          <p className="text-on-surface font-headline-md text-2xl font-semibold m-0">Your wishlist is empty</p>
          <p className="text-sm text-on-surface-variant max-w-xs m-0">
            Browse the catalog and toggle the heart icon to save items for later.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 px-8 py-3.5 bg-primary text-on-primary font-bold font-label-md rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm"
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
                className="glass-card p-6 rounded-lg group relative overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                {/* Category Badge */}
                <span className="absolute top-4 left-4 bg-surface border border-outline-variant text-on-surface-variant font-label-sm px-3 py-1 rounded-full z-10 shadow-sm">
                  {product.category || 'TECH'}
                </span>

                {/* Heart Toggle */}
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleWishlist(product); 
                  }}
                  className={`absolute top-4 right-4 transition-all duration-300 z-10 p-1.5 rounded-full ${
                    isFav
                      ? 'text-error bg-error/10 border border-error/20' 
                      : 'text-on-surface-variant hover:text-error bg-surface border border-outline-variant shadow-sm'
                  }`}
                  title="Remove from Wishlist"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>

                {/* Image */}
                <div className="aspect-square mt-10 mb-6 overflow-hidden flex items-center justify-center p-2">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                  />
                </div>

                {/* Title & Price */}
                <div>
                  <h4 className="font-headline-md text-body-md font-semibold text-on-surface mb-2 truncate" title={product.name}>
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-on-surface font-sans font-bold text-lg tabular-nums">₹{product.price}</span>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        addToCart(product); 
                      }}
                      className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-all shadow-sm"
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
