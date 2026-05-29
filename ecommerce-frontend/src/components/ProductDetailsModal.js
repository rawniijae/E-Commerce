import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const PRODUCT_DETAILS = {
  "Apple iPhone 15 Pro Max": {
    description: "Designed with aerospace-grade titanium, featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    stock: 7,
    specs: {
      "Processor": "A17 Pro chip (6-core CPU, 6-core GPU, 16-core Neural Engine)",
      "Display": "6.7-inch Super Retina XDR OLED (120Hz ProMotion, 2000 nits peak)",
      "Camera": "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto",
      "Material": "Aerospace-grade titanium, Ceramic Shield front",
      "Battery": "Up to 29 hours video playback",
      "Weight": "221 grams"
    }
  },
  "Samsung Galaxy S24 Ultra": {
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.",
    stock: 5,
    specs: {
      "Processor": "Snapdragon 8 Gen 3 for Galaxy",
      "Display": "6.8-inch Dynamic AMOLED 2X, QHD+, 120Hz, HDR10+",
      "Camera": "200MP Main + 50MP Telephoto + 12MP Ultra Wide + 10MP Telephoto",
      "S-Pen": "Integrated Bluetooth stylus with air actions",
      "Battery": "5000 mAh (45W Fast Charging, 15W Wireless)",
      "Weight": "232 grams"
    }
  },
  "Sony WH-1000XM5 Headphones": {
    description: "Rewriting the rules of distraction-free listening. Dual processors control eight microphones for unprecedented noise cancellation and exceptional call quality.",
    stock: 12,
    specs: {
      "Driver Unit": "30mm specially designed dome-type driver",
      "Noise Cancelling": "Industry-leading dual processor Auto NC Optimizer",
      "Battery Life": "Up to 30 hours (ANC ON), 40 hours (ANC OFF)",
      "Connectivity": "Bluetooth 5.2 (LDAC, AAC, SBC), Multi-point connection",
      "Microphones": "8 mics total with beamforming and AI noise reduction",
      "Weight": "250 grams"
    }
  },
  "Apple MacBook Air M3": {
    description: "Strikingly thin and fast, the MacBook Air with M3 chip is built for work and play. With up to 18 hours of battery life, you can take it anywhere.",
    stock: 8,
    specs: {
      "Processor": "Apple M3 chip (8-core CPU, 10-core GPU, 16-core Neural Engine)",
      "Display": "13.6-inch Liquid Retina display (500 nits, P3 Wide Color)",
      "Memory": "8GB Unified Memory (Configurable up to 24GB)",
      "Storage": "256GB SSD (Configurable up to 2TB)",
      "Battery": "Up to 18 hours Apple TV app movie playback",
      "Weight": "1.24 kg"
    }
  },
  "Dell XPS 15 Laptop": {
    description: "Balance power and portability with the XPS 15 laptop. High-performance CPU and stunning InfinityEdge display deliver premium performance for creators.",
    stock: 4,
    specs: {
      "Processor": "13th Gen Intel Core i7-13700H (14 Cores, up to 5.0 GHz)",
      "Display": "15.6-inch FHD+ InfinityEdge (1920x1200, 500 nits)",
      "Graphics": "NVIDIA GeForce RTX 4050 6GB GDDR6",
      "Memory": "16GB DDR5 Dual Channel (4800MHz)",
      "Storage": "1TB PCIe NVMe SSD",
      "Battery": "86 WHr 6-Cell Battery"
    }
  },
  "Apple AirPods Pro 2": {
    description: "Re-engineered for richer audio. Next-level Active Noise Cancellation and Adaptive Audio dynamically tailor sound control to your environment.",
    stock: 15,
    specs: {
      "Processor": "Apple H2 headphone chip, Apple U1/U2 chip in case",
      "Noise Cancellation": "Active Noise Cancellation, Adaptive Audio, Transparency Mode",
      "Battery Life": "Up to 6 hours listening time (up to 30 hours with case)",
      "Charging Case": "MagSafe Charging Case (USB-C) with speaker and lanyard loop",
      "Resistance": "IP54 dust, sweat, and water resistant",
      "Weight": "5.3 grams (each earbud)"
    }
  },
  "Samsung 55-inch 4K Smart TV": {
    description: "Elevate your viewing experience. Dynamic Crystal Color delivers lifelike variations so you can see every subtlety, powered by advanced 4K upscaling.",
    stock: 3,
    specs: {
      "Display Size": "55-inch diagonal",
      "Resolution": "4K Ultra HD (3840 x 2160 pixels)",
      "Processor": "Crystal Processor 4K",
      "Smart OS": "Tizen Smart TV OS",
      "Audio Output": "20W (2-Channel speakers)",
      "Connectivity": "3 x HDMI, 2 x USB, Wi-Fi 5, Bluetooth 5.2"
    }
  },
  "PlayStation 5 Console": {
    description: "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.",
    stock: 6,
    specs: {
      "Processor": "AMD Zen 2 (8 Cores @ 3.5GHz, Variable)",
      "Graphics": "Custom AMD RDNA 2 GPU (10.28 TFLOPs)",
      "Storage": "825GB Custom NVMe SSD (5.5 GB/s Read bandwidth)",
      "Display Outputs": "HDMI 2.1 (4K 120Hz, 8K, VRR support)",
      "Optical Drive": "4K UHD Blu-ray drive (disc version)",
      "Controller": "DualSense Wireless Controller with haptic feedback"
    }
  },
  "Apple Watch Series 9": {
    description: "Smarter. Brighter. Mightier. The most powerful chip in Apple Watch ever. A magical new way to use your watch without touching the screen.",
    stock: 9,
    specs: {
      "Processor": "S9 SiP (System in Package), 4-core Neural Engine",
      "Display": "Always-On Retina LTPO OLED (up to 2000 nits)",
      "Sensors": "Blood Oxygen, ECG, optical heart sensor, Fall/Crash detection",
      "Controls": "Double Tap gesture, Digital Crown with haptic feedback",
      "Durability": "IP6X dust resistant, WR50 water resistant (50m)",
      "Battery Life": "Up to 18 hours (36 hours in Low Power Mode)"
    }
  },
  "JBL Charge 5 Bluetooth Speaker": {
    description: "Take the party with you no matter what the weather. The JBL Charge 5 speaker delivers bold JBL Original Pro Sound, with its optimized long excursion driver.",
    stock: 14,
    specs: {
      "Output Power": "30W RMS Woofer, 10W RMS Tweeter",
      "Transducer": "52mm x 90mm woofer, 20mm tweeter",
      "Frequency Response": "60Hz - 20kHz",
      "Waterproofing": "IP67 dustproof and waterproof rating",
      "Battery Life": "Up to 20 hours music playing time",
      "Charging Time": "4 hours (5V / 3A input)"
    }
  },
  "Logitech MX Master 3S Mouse": {
    description: "An icon remastered. Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor.",
    stock: 11,
    specs: {
      "Sensor Technology": "Darkfield high precision (nominal 1000 DPI, range 200-8000 DPI)",
      "Scroll Wheel": "MagSpeed electromagnetic scroll wheel with Smart-shift",
      "Battery": "Rechargeable Li-Po (500 mAh) up to 70 days on full charge",
      "Custom Software": "Logi Options+ support",
      "Wireless Tech": "Logi Bolt USB Receiver, Bluetooth Low Energy",
      "Ergonomics": "Scuplt-design fit for right hand comfort"
    }
  },
  "iPad Air M2 11-inch": {
    description: "Now available in an 11-inch design, iPad Air is supercharged by the incredibly fast Apple M2 chip. It features a stunning Liquid Retina display and new landscape camera.",
    stock: 6,
    specs: {
      "Processor": "Apple M2 chip (8-core CPU, 9-core GPU, 16-core Neural Engine)",
      "Display": "11-inch Liquid Retina LED backlit IPS (2360x1640 resolution)",
      "Camera": "12MP Wide rear camera, 12MP Landscape Ultra Wide front camera",
      "Wireless": "Wi-Fi 6E, Bluetooth 5.3",
      "Compatibility": "Apple Pencil Pro, Magic Keyboard",
      "Weight": "462 grams"
    }
  },
  "Apple Watch Ultra 2": {
    description: "The ultimate sports and adventure watch is back. Supercharged by the S9 SiP. The brightest Apple display ever. And the most accurate GPS in a sports watch.",
    stock: 4,
    specs: {
      "Processor": "S9 SiP (System in Package), 4-core Neural Engine",
      "Display": "Always-On Retina LTPO OLED (up to 3000 nits)",
      "GPS": "Precision dual-frequency GPS (L1 and L5)",
      "Battery Life": "Up to 36 hours (72 hours in Low Power Mode)",
      "Sensors": "Depth gauge, water temp sensor, ECG, Blood Oxygen",
      "Durability": "Titanium case, Sapphire front, MIL-STD 810H certified"
    }
  },
  "Microsoft Xbox Series X": {
    description: "The fastest, most powerful Xbox ever. Explore rich new worlds with 12 teraflops of raw graphic processing power, DirectX ray tracing, and custom SSD.",
    stock: 5,
    specs: {
      "CPU": "8-core Custom AMD Zen 2 @ 3.8 GHz",
      "GPU": "Custom AMD RDNA 2 GPU (12.15 TFLOPs, 52 CUs @ 1.825 GHz)",
      "Memory": "16GB GDDR6 memory",
      "Internal Storage": "1TB Custom NVMe SSD (2.4 GB/s raw throughput)",
      "Gaming Resolution": "True 4K (up to 8K support, up to 120 FPS)",
      "Optical Drive": "4K UHD Blu-ray drive"
    }
  },
  "Nintendo Switch OLED": {
    description: "Meet the newest member of the Nintendo Switch family. Play on your TV at home or on-the-go with a vibrant 7-inch OLED screen, wide adjustable stand, and wired LAN port.",
    stock: 8,
    specs: {
      "Screen": "7.0-inch OLED touchscreen (1280 x 720 resolution)",
      "Storage": "64GB internal storage (expandable with microSD card)",
      "Battery Life": "Approx. 4.5 to 9.0 hours",
      "Output": "Up to 1080p via HDMI in TV mode, 720p in handheld mode",
      "Dock Connectivity": "Wired LAN port built into dock, 2x USB, HDMI",
      "Play Modes": "TV mode, Tabletop mode, Handheld mode"
    }
  },
  "Meta Quest 3 VR Headset": {
    description: "Asylum of virtual realities. Transform your home into a virtual playground where virtual elements blend with your physical space, powered by mixed reality.",
    stock: 7,
    specs: {
      "Processor": "Snapdragon XR2 Gen 2 platform",
      "Display Resolution": "2064 x 2208 pixels per eye (Infinite Display, 90/120Hz)",
      "Mixed Reality": "Dual RGB cameras for full-color high-fidelity passthrough",
      "Controllers": "Touch Plus controllers with TruTouch haptic feedback",
      "Audio": "Integrated 3D spatial audio speakers, 3.5mm jack",
      "IPD Adjustment": "Continuous mechanical wheel (58mm - 71mm)"
    }
  }
};

export const getProductDetails = (product) => {
  return PRODUCT_DETAILS[product.name] || {
    description: `High-performance ${product.name} designed for ultimate precision and usability.`,
    stock: 5,
    specs: {
      "Category": product.category || "General Tech",
      "Price": `₹${product.price}`,
      "Warranty": "1-Year standard warranty",
      "Model Code": `EL-${product.id ? product.id.slice(-6).toUpperCase() : 'UNKNOWN'}`
    }
  };
};

export default function ProductDetailsModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const details = getProductDetails(product);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFav = isInWishlist(product.id);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="glass-card max-w-4xl w-full p-8 rounded-3xl border border-outline/20 relative flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-secondary-fixed transition-colors"
        >
          <span className="material-symbols-outlined text-[28px]">close</span>
        </button>

        {/* Favorite Button */}
        <button 
          onClick={() => toggleWishlist(product)}
          className={`absolute top-4 right-14 transition-colors duration-300 ${
            isFav ? 'text-error' : 'text-on-surface-variant hover:text-error'
          }`}
          title={isFav ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </button>

        {/* Left Column: Image Area */}
        <div className="md:w-1/2 flex flex-col items-center justify-center bg-surface-container/30 rounded-2xl p-6 border border-outline/10 relative overflow-hidden group">
          <div className="absolute w-[120%] h-[120%] bg-secondary-fixed/5 blur-[80px] rounded-full -z-10 animate-pulse"></div>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="max-h-[300px] object-contain transition-transform duration-500 group-hover:scale-105 floating-anim drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
          />
        </div>

        {/* Right Column: Details & Tech Specs */}
        <div className="md:w-1/2 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-secondary-fixed font-label-md text-[11px] uppercase tracking-widest bg-secondary-fixed/10 px-3 py-1 rounded-full border border-secondary-fixed/20">
              {product.category || 'Tech'}
            </span>
            <h3 className="font-headline-lg text-2xl md:text-3xl text-on-surface mt-4 mb-2 font-headline-md">
              {product.name}
            </h3>
            <span className="text-secondary-fixed font-sans font-bold text-2xl tabular-nums">₹{product.price}</span>
            
            {/* Stock Level Indicator */}
            <div className="flex items-center gap-2 mt-3 text-sm font-body-md text-on-surface-variant">
              <span className={`w-2.5 h-2.5 rounded-full ${details.stock > 3 ? 'bg-secondary-fixed' : 'bg-error'} animate-pulse`}></span>
              <span>{details.stock} units operational in local sector</span>
            </div>

            <p className="font-body-md text-on-surface-variant mt-4 leading-relaxed">
              {details.description}
            </p>
          </div>

          {/* Specs Grid */}
          <div className="border-t border-b border-outline/10 py-4">
            <h5 className="font-label-lg text-secondary-fixed uppercase tracking-wider mb-3 text-[11px] font-bold">
              Technical Specifications
            </h5>
            <div className="grid grid-cols-1 gap-2.5 max-h-[180px] overflow-y-auto pr-2">
              {Object.entries(details.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs font-body-sm py-1 border-b border-outline/5 last:border-0">
                  <span className="text-on-surface-variant font-bold">{key}</span>
                  <span className="text-on-surface text-right max-w-[70%]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls and Add to Cart */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center border border-outline/20 rounded-full bg-surface-container/50">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="w-8 text-center text-sm font-label-lg font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(details.stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              className="flex-1 min-w-[150px] py-3 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md uppercase tracking-wider hover:bg-secondary-fixed/80 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
