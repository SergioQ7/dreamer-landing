import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase, SiteSettings, Product } from "@/lib/supabase";

const DEFAULT_PRODUCTS: Product[] = [];

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [actualPassword, setActualPassword] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);



  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await supabase.getSiteSettings();
      if (data) {
        if (data.products) {
          setProducts(data.products);
        }
        if (data.catalog_password) {
          setActualPassword(data.catalog_password);
          const saved = localStorage.getItem('dreamer_unlocked_prices');
          if (saved === data.catalog_password) {
            setIsUnlocked(true);
          } else {
            setIsUnlocked(false);
          }
        } else {
          setIsUnlocked(true);
        }
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#071729", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#A1C1D8", fontSize: "18px", textAlign: "center" }}>Loading catalog...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#071729", color: "#F5F0EB", fontFamily: "'Montserrat', sans-serif" }}>
      {/* Header / Nav */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10, 10, 10, 0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        padding: "20px 0"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/">
            <img 
              src="https://dreamerjeans.co/cdn/shop/files/DREAMER_LOGO.png?v=1729086588&width=230" 
              alt="DREAMER Logo" 
              style={{ height: "30px", filter: "brightness(0) invert(1)", cursor: "pointer" }}
            />
          </Link>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/">
              <span style={{ color: "#A1C1D8", textDecoration: "none", fontSize: "14px", cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase" }}>Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section for Catalog */}
      <section style={{ 
        padding: "80px 24px", 
        textAlign: "center",
        background: "linear-gradient(to bottom, rgba(26, 26, 46, 0.8), #071729)"
      }}>
        <h1 style={{ 
          fontFamily: "'Anton', sans-serif", 
          fontSize: "clamp(40px, 8vw, 80px)", 
          letterSpacing: "4px",
          color: "#fff",
          marginBottom: "16px",
          textTransform: "uppercase"
        }}>
          Official Catalog
        </h1>
        <p style={{ 
          fontSize: "clamp(14px, 3vw, 18px)", 
          color: "#a1c1d8", 
          maxWidth: "600px", 
          margin: "0 auto",
          lineHeight: 1.6 
        }}>
          Discover our latest collection. Exclusive designs and premium quality in every piece.
        </p>
      </section>

      {/* Products Grid */}
      <section style={{ padding: "40px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        {products.length === 0 ? (
          <div style={{ textAlign: "center", color: "#a1c1d8", padding: "60px 0", fontSize: "18px" }}>
            No products available at the moment.
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: "32px" 
          }}>
            {products.map((product) => (
              <a href="/#contact" key={product.id} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div style={{ 
                  background: "#1a1a2e",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid rgba(161,193,216,0.15)",
                  transition: "transform 0.3s, border-color 0.3s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.borderColor = "rgba(161,193,216,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(161,193,216,0.15)";
                }}
                >
                  <div style={{ position: "relative", paddingTop: "133%" /* 3:4 aspect ratio */ }}>
                    <img 
                      src={product.img} 
                      alt={product.code} 
                      style={{ 
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover" 
                      }}
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x533?text=Imagen+No+Disponible"; }}
                    />
                    <div style={{ 
                      position: "absolute", 
                      top: "12px", 
                      left: "12px", 
                      background: "rgba(0,0,0,0.6)", 
                      padding: "4px 8px", 
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "bold",
                      letterSpacing: "1px"
                    }}>
                      {product.code}
                      {product.category && (
                        <span style={{ 
                          marginLeft: "8px", 
                          background: "var(--dreamer-blue)", 
                          color: "var(--dreamer-navy)",
                          padding: "2px 6px", 
                          borderRadius: "2px", 
                          fontSize: "10px", 
                          fontWeight: "bold",
                          textTransform: "uppercase"
                        }}>
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {product.images && product.images.length > 0 && (
                    <div style={{ display: "flex", gap: "8px", padding: "16px 20px 0 20px", overflowX: "auto" }}>
                      <img src={product.img} alt="Main" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "2px solid #A1C1D8" }} />
                      {product.images.map((imgSrc, i) => (
                        <img key={i} src={imgSrc} alt={`Color ${i+1}`} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1px solid rgba(161,193,216,0.3)" }} />
                      ))}
                    </div>
                  )}
                  
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px" }}>
                      <div>
                        <h3 style={{ 
                          margin: "0 0 4px 0", 
                          fontSize: "12px", 
                          color: "#a1c1d8", 
                          textTransform: "uppercase", 
                          letterSpacing: "1px" 
                        }}>
                          Wholesale Price
                        </h3>
                        {isUnlocked ? (
                          <span style={{ 
                            fontSize: "24px", 
                            fontWeight: "600", 
                            color: "#fff" 
                          }}>
                            ${product.price}
                          </span>
                        ) : (
                          <button 
                            onClick={(e) => { e.preventDefault(); setShowModal(true); }}
                            style={{ 
                              background: "rgba(161,193,216,0.1)", 
                              border: "1px solid rgba(161,193,216,0.3)",
                              color: "#A1C1D8",
                              padding: "4px 12px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <span>🔒</span> Unlock Price
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
                      <h4 style={{ 
                        margin: "0 0 8px 0", 
                        fontSize: "12px", 
                        color: "#a1c1d8", 
                        textTransform: "uppercase", 
                        letterSpacing: "1px" 
                      }}>
                        Available Sizes
                      </h4>
                      <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#fff" }}>
                        {product.sizes}
                      </p>
                      
                      <div style={{ textAlign: "center", background: "rgba(161,193,216,0.1)", padding: "10px", borderRadius: "4px", color: "#A1C1D8", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Click to apply
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
      
      {/* Unlock Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
        }}>
          <div style={{ background: "#1a1a2e", padding: "32px", borderRadius: "8px", maxWidth: "400px", width: "90%", border: "1px solid rgba(161,193,216,0.2)" }}>
            <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "24px", color: "#fff", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>Enter Access Code</h2>
            <p style={{ fontSize: "14px", color: "#a1c1d8", marginBottom: "24px" }}>Enter the VIP access code to view wholesale prices.</p>
            <input 
              type="text" 
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Access Code"
              style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(161,193,216,0.3)", color: "#fff", marginBottom: "16px", borderRadius: "4px", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={() => {
                  if (inputPassword === actualPassword) {
                    setIsUnlocked(true);
                    localStorage.setItem('dreamer_unlocked_prices', actualPassword);
                    setShowModal(false);
                  } else {
                    alert("Incorrect code. Please try again.");
                  }
                }}
                style={{ flex: 1, padding: "12px", background: "#A1C1D8", color: "#071729", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "12px", textTransform: "uppercase" }}
              >
                Unlock
              </button>
              <button 
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid rgba(161,193,216,0.3)", color: "#A1C1D8", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "12px", textTransform: "uppercase" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ 
        padding: "40px 24px", 
        textAlign: "center", 
        borderTop: "1px solid rgba(161,193,216,0.1)",
        marginTop: "40px"
      }}>
        <img 
          src="https://dreamerjeans.co/cdn/shop/files/DREAMER_LOGO.png?v=1729086588&width=230" 
          alt="DREAMER Logo" 
          style={{ height: "24px", filter: "brightness(0) invert(1)", marginBottom: "16px", opacity: 0.5 }}
        />
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
          © {new Date().getFullYear()} DREAMER Jeans. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
