import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductDetailsModal from './ProductDetailsModal';
import { API_BASE_URL } from '../config';
import heroImg from '../assets/hero_tech.png';

function ProductList() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fallbackProducts = [
      { id: '1', name: "Apple iPhone 15 Pro Max", price: 159900, category: "Phones", imageUrl: "/images/iphone_15_pro.png" },
      { id: '2', name: "Samsung Galaxy S24 Ultra", price: 129999, category: "Phones", imageUrl: "/images/galaxy_s24_ultra.png" },
      { id: '3', name: "Apple Watch Series 9", price: 41900, category: "Wearables", imageUrl: "/images/apple_watch_9.png" },
      { id: '4', name: "Apple Watch Ultra 2", price: 89900, category: "Wearables", imageUrl: "/images/apple_watch_ultra.png" },
      { id: '5', name: "iPad Air M2 11-inch", price: 59900, category: "Tablets", imageUrl: "/images/ipad_air_m2.png" },
      { id: '6', name: "JBL Charge 5 Bluetooth Speaker", price: 14999, category: "Audio", imageUrl: "/images/jbl_charge_5.png" },
      { id: '7', name: "Meta Quest 3 VR Headset", price: 49990, category: "VR", imageUrl: "/images/meta_quest_3.png" },
      { id: '8', name: "Nintendo Switch OLED", price: 34990, category: "Gaming", imageUrl: "/images/nintendo_switch_oled.png" },
      { id: '9', name: "Samsung 55-inch 4K Smart TV", price: 64990, category: "TVs", imageUrl: "/images/samsung_tv.png" },
      { id: '10', name: "Microsoft Xbox Series X", price: 49990, category: "Gaming", imageUrl: "/images/xbox_series_x.png" },
      { id: '11', name: "Sony WH-1000XM5 Headphones", price: 29990, category: "Audio", imageUrl: "/images/sony_headphones.png" },
      { id: '12', name: "Apple MacBook Air M3", price: 114900, category: "Laptops", imageUrl: "/images/macbook_air_m3.png" }
    ];

    const headers = {};
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`${API_BASE_URL}/api/products`, { headers })
      .then((res) => res.json())
      .then((data) => {
        const fetchedData = data && data.length > 0 ? data : [];
        const fetchedNames = new Set(fetchedData.map(p => p.name));
        const missingProducts = fallbackProducts.filter(p => !fetchedNames.has(p.name));
        setProducts([...fetchedData, ...missingProducts]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProducts(fallbackProducts);
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
    <main className="pt-32 md:pt-20 bg-background min-h-screen">
      {/* Hero Section - Only displayed when no search query is active */}
      {!searchQuery && (
        <section className="relative min-h-[60vh] flex items-center overflow-hidden px-margin-mobile md:px-gutter max-w-container-max mx-auto py-12 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center relative z-10 w-full">
            {/* Hero Content */}
            <div className="space-y-stack-md">
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-primary font-label-md uppercase tracking-wider text-[10px] font-bold">New Arrivals</span>
              </div>
              <h1 className="font-display-lg text-display-lg leading-tight text-on-surface">
                Next-Gen Tech <br />
                <span className="text-primary">Up to 15% Off</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-lg">
                Discover the latest electronics engineered for peak performance and elegant minimalist aesthetics.
              </p>
            </div>
            {/* Hero Image */}
            <div className="relative flex justify-center items-center">
              <div className="absolute w-[100%] h-[100%] bg-primary/5 blur-[80px] rounded-full -z-10"></div>
              <img 
                className="w-full max-w-xl floating-anim drop-shadow-xl rounded-2xl" 
                alt="Hero Tech" 
                src={heroImg} 
              />
            </div>
          </div>
        </section>
      )}

      {/* Tech Catalog Grid */}
      <section className={`px-margin-mobile md:px-gutter max-w-container-max mx-auto mb-section-gap ${searchQuery ? 'pt-12' : ''}`}>
        <div className="flex justify-between items-end mb-stack-lg border-b border-outline-variant pb-4">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Trending Products</h2>
          {searchQuery && (
            <span className="text-on-surface-variant text-sm font-body-md">
              Filtered by: <span className="text-primary font-bold">"{searchQuery}"</span> ({filteredProducts.length} items)
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="text-center text-on-surface-variant py-20 font-label-md uppercase tracking-wider">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-card text-center py-20 text-on-surface-variant rounded-2xl border border-outline-variant max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant bg-surface-container p-4 rounded-full">
              search_off
            </span>
            <h3 className="font-headline-md text-2xl text-on-surface">No Products Match Search Criteria</h3>
            <p className="font-body-md max-w-md px-6 text-on-surface-variant">
              We couldn't locate any items matching your search for <span className="text-primary font-bold">"{searchQuery}"</span>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter pb-40">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="glass-card p-6 rounded-lg group relative overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <span className="absolute top-4 left-4 bg-surface border border-outline-variant text-on-surface-variant font-label-sm px-3 py-1 rounded-full z-10 shadow-sm">
                  {product.category || 'TECH'}
                </span>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleWishlist(product); 
                  }}
                  className={`absolute top-4 right-4 transition-all duration-300 z-10 p-1.5 rounded-full ${
                    isInWishlist(product.id)
                      ? 'text-error bg-error/10 border border-error/20' 
                      : 'text-on-surface-variant hover:text-error bg-surface border border-outline-variant shadow-sm'
                  }`}
                  title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isInWishlist(product.id) ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>
                
                <div className="aspect-square mt-10 mb-6 overflow-hidden flex items-center justify-center p-2">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                  />
                </div>
                
                <div>
                  <h4 className="font-headline-md text-body-md font-semibold text-on-surface mb-2 truncate" title={product.name}>
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-on-surface font-sans font-bold text-lg tabular-nums">₹{product.price}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-all shadow-sm"
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