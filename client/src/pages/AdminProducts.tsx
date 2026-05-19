import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { supabase, SiteSettings, Product } from "@/lib/supabase";
import { toast } from "sonner";

export default function AdminProducts() {
  const { isAuthenticated, isLoading: authLoading, logout, userEmail } = useAuth();
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  
  const [draftProducts, setDraftProducts] = useState<Partial<Product>[]>([]);
  const [uploadingBulk, setUploadingBulk] = useState(false);

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingBulk(true);
    const newDrafts: Partial<Product>[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const publicUrl = await supabase.uploadProductImage(file);
        newDrafts.push({
          id: `draft_${Date.now()}_${i}`,
          img: publicUrl,
          code: "",
          price: "",
          sizes: "S, M, L",
          category: ""
        });
      }
      setDraftProducts(prev => [...prev, ...newDrafts]);
      toast.success(`${files.length} imágenes cargadas. Completa los datos abajo.`, {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error("Error al subir algunas imágenes. Asegúrate de tener el bucket 'products' creado.", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } finally {
      setUploadingBulk(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleSaveDrafts = async () => {
    if (draftProducts.some(d => !d.code || !d.price)) {
      toast.error("Por favor completa el código y precio de todos los productos", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
      return;
    }
    
    setSaving(true);
    try {
      const newProducts = draftProducts.map(d => ({
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        code: d.code,
        price: d.price,
        sizes: d.sizes || "",
        img: d.img,
        category: d.category || ""
      })) as Product[];
      
      const updatedProducts = [...newProducts, ...products];
      const newSettings = { ...(settings as SiteSettings), products: updatedProducts };
      await supabase.saveSiteSettings(newSettings);
      
      setSettings(newSettings);
      setProducts(updatedProducts);
      setDraftProducts([]);
      
      toast.success(`${newProducts.length} productos guardados exitosamente`, {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } catch (error) {
      console.error("Error saving bulk products:", error);
      toast.error("Error al guardar productos", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    try {
      const publicUrl = await supabase.uploadProductImage(file);
      setEditingProduct(prev => prev ? { ...prev, img: publicUrl } : null);
      toast.success("Imagen cargada exitosamente", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error al cargar imagen. Asegúrate de tener el bucket 'products' creado.", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } finally {
      setUploadingImg(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated]);

  // Restore normal cursor for admin panel
  useEffect(() => {
    document.body.style.cursor = "auto";
    return () => {
      document.body.style.cursor = "none";
    };
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await supabase.getSiteSettings();
      if (data) {
        setSettings(data);
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Error al cargar productos", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct && !isAddingNew) return;
    
    setSaving(true);
    try {
      let updatedProducts = [...products];
      
      if (isAddingNew && editingProduct) {
        const newProduct = {
          ...editingProduct,
          id: Date.now().toString()
        };
        updatedProducts.push(newProduct);
      } else if (editingProduct) {
        updatedProducts = updatedProducts.map(p => 
          p.id === editingProduct.id ? editingProduct : p
        );
      }

      const newSettings = { ...(settings as SiteSettings), products: updatedProducts };
      await supabase.saveSiteSettings(newSettings);
      
      setSettings(newSettings);
      setProducts(updatedProducts);
      setEditingProduct(null);
      setIsAddingNew(false);
      
      toast.success("Producto guardado", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error al guardar producto", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    
    setSaving(true);
    try {
      const updatedProducts = products.filter(p => p.id !== id);
      const newSettings = { ...(settings as SiteSettings), products: updatedProducts };
      await supabase.saveSiteSettings(newSettings);
      
      setSettings(newSettings);
      setProducts(updatedProducts);
      
      toast.success("Producto eliminado", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar producto", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#071729", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#A1C1D8", fontSize: "18px" }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#071729", color: "#F5F0EB", fontFamily: "'Montserrat', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "#1a1a2e",
        borderBottom: "1px solid rgba(161,193,216,0.15)",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span style={{ fontSize: "16px", letterSpacing: "2px", color: "#A1C1D8", fontWeight: "bold" }}>DREAMER ADMIN</span>
          <nav style={{ display: "flex", gap: "16px" }}>
            <Link href="/admin"><span style={{ color: "#a1c1d8", cursor: "pointer", fontSize: "13px" }}>Inscripciones</span></Link>
            <Link href="/admin/settings"><span style={{ color: "#a1c1d8", cursor: "pointer", fontSize: "13px" }}>Configuración</span></Link>
            <span style={{ color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #fff" }}>Productos</span>
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span style={{ fontSize: "13px", color: "#a1c1d8" }}>{userEmail}</span>
          <button
            onClick={() => { logout(); setLocation("/login"); }}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid rgba(161,193,216,0.3)",
              color: "#A1C1D8",
              cursor: "pointer",
              fontSize: "12px",
              borderRadius: "4px"
            }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "24px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "600" }}>
            Gestión de Catálogo
          </h2>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link href="/catalogo">
              <button
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  color: "#A1C1D8",
                  border: "1px solid rgba(161,193,216,0.3)",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "13px",
                  borderRadius: "4px"
                }}
              >
                Ver Catálogo
              </button>
            </Link>
            <button
              onClick={() => {
                setIsAddingNew(true);
                setEditingProduct({ id: "", code: "", price: "", sizes: "", img: "" });
              }}
              style={{
                padding: "10px 20px",
                background: "transparent",
                color: "#A1C1D8",
                border: "1px solid rgba(161,193,216,0.3)",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "13px",
                borderRadius: "4px"
              }}
            >
              + 1 Producto
            </button>
            <label style={{
              padding: "10px 20px",
              background: "#A1C1D8",
              color: "#071729",
              border: "none",
              fontWeight: "600",
              cursor: uploadingBulk ? "not-allowed" : "pointer",
              fontSize: "13px",
              borderRadius: "4px",
              display: "inline-block",
              opacity: uploadingBulk ? 0.7 : 1
            }}>
              {uploadingBulk ? "Subiendo..." : "+ Carga Masiva (Fotos)"}
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleBulkUpload} 
                disabled={uploadingBulk}
                style={{ display: "none" }} 
              />
            </label>
          </div>
        </div>

        {/* Product Editor Modal / Form */}
        {(isAddingNew || editingProduct) && (
          <div style={{
            background: "#1a1a2e",
            border: "1px solid rgba(161,193,216,0.3)",
            padding: "24px",
            marginBottom: "40px",
            borderRadius: "8px"
          }}>
            <h3 style={{ fontSize: "16px", color: "#A1C1D8", marginBottom: "20px" }}>
              {isAddingNew ? "Nuevo Producto" : "Editar Producto"}
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#A1C1D8", marginBottom: "6px" }}>CÓDIGO / REFERENCIA</label>
                <input
                  type="text"
                  value={editingProduct?.code || ""}
                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, code: e.target.value} : null)}
                  style={{ width: "100%", padding: "10px", background: "transparent", border: "1px solid rgba(161,193,216,0.2)", color: "#fff", borderRadius: "4px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#A1C1D8", marginBottom: "6px" }}>PRECIO MAYORISTA</label>
                <input
                  type="text"
                  value={editingProduct?.price || ""}
                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, price: e.target.value} : null)}
                  style={{ width: "100%", padding: "10px", background: "transparent", border: "1px solid rgba(161,193,216,0.2)", color: "#fff", borderRadius: "4px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#A1C1D8", marginBottom: "6px" }}>TALLAS DISPONIBLES</label>
                <input
                  type="text"
                  placeholder="Ej: S, M, L, XL"
                  value={editingProduct?.sizes || ""}
                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, sizes: e.target.value} : null)}
                  style={{ width: "100%", padding: "10px", background: "transparent", border: "1px solid rgba(161,193,216,0.2)", color: "#fff", borderRadius: "4px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#A1C1D8", marginBottom: "6px" }}>TIPO DE PRENDA</label>
                <select
                  value={editingProduct?.category || ""}
                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, category: e.target.value} : null)}
                  style={{ width: "100%", padding: "10px", background: "#071729", border: "1px solid rgba(161,193,216,0.2)", color: "#fff", borderRadius: "4px" }}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Sets">Sets</option>
                  <option value="Dress">Dress</option>
                  <option value="Pants">Pants</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Shorts">Shorts</option>
                  <option value="Tops">Tops</option>
                  <option value="Jumpsuits">Jumpsuits</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "11px", color: "#A1C1D8", marginBottom: "6px" }}>IMAGEN (CARGAR O URL)</label>
                <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImg}
                    style={{ width: "100%", padding: "8px", background: "rgba(161,193,216,0.05)", border: "1px dashed rgba(161,193,216,0.3)", color: "#A1C1D8", borderRadius: "4px", fontSize: "12px", cursor: uploadingImg ? "not-allowed" : "pointer" }}
                  />
                  <input
                    type="text"
                    placeholder="O pega la URL de la imagen aquí..."
                    value={editingProduct?.img || ""}
                    onChange={(e) => setEditingProduct(prev => prev ? {...prev, img: e.target.value} : null)}
                    style={{ width: "100%", padding: "10px", background: "transparent", border: "1px solid rgba(161,193,216,0.2)", color: "#fff", borderRadius: "4px" }}
                  />
                  {uploadingImg && <span style={{ fontSize: "11px", color: "#A1C1D8" }}>Subiendo imagen...</span>}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button
                onClick={handleSaveProduct}
                disabled={saving}
                style={{ padding: "10px 20px", background: "#A1C1D8", color: "#071729", border: "none", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer", borderRadius: "4px" }}
              >
                {saving ? "Guardando..." : "Guardar Producto"}
              </button>
              <button
                onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                style={{ padding: "10px 20px", background: "transparent", color: "#A1C1D8", border: "1px solid rgba(161,193,216,0.3)", cursor: "pointer", borderRadius: "4px" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Bulk Drafts */}
        {draftProducts.length > 0 && (
          <div style={{
            background: "#1a1a2e",
            border: "1px solid rgba(161,193,216,0.3)",
            padding: "24px",
            marginBottom: "40px",
            borderRadius: "8px"
          }}>
            <h3 style={{ fontSize: "16px", color: "#A1C1D8", marginBottom: "20px" }}>
              Carga Masiva: {draftProducts.length} producto(s) pendiente(s) por completar
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", marginBottom: "24px" }}>
              {draftProducts.map((draft, idx) => (
                <div key={draft.id} style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(161,193,216,0.1)" }}>
                  <img src={draft.img} alt={`Draft ${idx}`} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px", marginBottom: "16px" }} />
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#A1C1D8", marginBottom: "4px" }}>CÓDIGO</label>
                      <input type="text" value={draft.code || ""} onChange={(e) => {
                        const newDrafts = [...draftProducts];
                        newDrafts[idx].code = e.target.value;
                        setDraftProducts(newDrafts);
                      }} style={{ width: "100%", padding: "8px", background: "transparent", border: "1px solid rgba(161,193,216,0.2)", color: "#fff", borderRadius: "4px" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#A1C1D8", marginBottom: "4px" }}>PRECIO</label>
                      <input type="text" value={draft.price || ""} onChange={(e) => {
                        const newDrafts = [...draftProducts];
                        newDrafts[idx].price = e.target.value;
                        setDraftProducts(newDrafts);
                      }} style={{ width: "100%", padding: "8px", background: "transparent", border: "1px solid rgba(161,193,216,0.2)", color: "#fff", borderRadius: "4px" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#A1C1D8", marginBottom: "4px" }}>TALLAS</label>
                      <input type="text" value={draft.sizes || ""} onChange={(e) => {
                        const newDrafts = [...draftProducts];
                        newDrafts[idx].sizes = e.target.value;
                        setDraftProducts(newDrafts);
                      }} style={{ width: "100%", padding: "8px", background: "transparent", border: "1px solid rgba(161,193,216,0.2)", color: "#fff", borderRadius: "4px" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#A1C1D8", marginBottom: "4px" }}>TIPO DE PRENDA</label>
                      <select value={draft.category || ""} onChange={(e) => {
                        const newDrafts = [...draftProducts];
                        newDrafts[idx].category = e.target.value;
                        setDraftProducts(newDrafts);
                      }} style={{ width: "100%", padding: "8px", background: "#071729", border: "1px solid rgba(161,193,216,0.2)", color: "#fff", borderRadius: "4px" }}>
                        <option value="">Selecciona</option>
                        <option value="Sets">Sets</option>
                        <option value="Dress">Dress</option>
                        <option value="Pants">Pants</option>
                        <option value="Jeans">Jeans</option>
                        <option value="Shorts">Shorts</option>
                        <option value="Tops">Tops</option>
                        <option value="Jumpsuits">Jumpsuits</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => {
                    const newDrafts = [...draftProducts];
                    newDrafts.splice(idx, 1);
                    setDraftProducts(newDrafts);
                  }} style={{ marginTop: "16px", width: "100%", padding: "8px", background: "rgba(255,59,48,0.1)", border: "none", color: "#ff3b30", cursor: "pointer", borderRadius: "4px" }}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button
                onClick={handleSaveDrafts}
                disabled={saving}
                style={{ padding: "10px 20px", background: "#A1C1D8", color: "#071729", border: "none", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer", borderRadius: "4px" }}
              >
                {saving ? "Guardando..." : "Guardar Todos los Productos"}
              </button>
              <button
                onClick={() => setDraftProducts([])}
                style={{ padding: "10px 20px", background: "transparent", color: "#A1C1D8", border: "1px solid rgba(161,193,216,0.3)", cursor: "pointer", borderRadius: "4px" }}
              >
                Cancelar Carga Masiva
              </button>
            </div>
          </div>
        )}

        {/* Products List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "24px" }}>
          {products.map(product => (
            <div key={product.id} style={{ background: "#1a1a2e", border: "1px solid rgba(161,193,216,0.15)", borderRadius: "8px", overflow: "hidden" }}>
              <img src={product.img} alt={product.code} style={{ width: "100%", height: "300px", objectFit: "cover" }} />
              <div style={{ padding: "16px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#fff" }}>
                  {product.code} {product.category && <span style={{ fontSize: "12px", color: "#A1C1D8", fontWeight: "normal", background: "rgba(161,193,216,0.1)", padding: "2px 6px", borderRadius: "4px", marginLeft: "8px" }}>{product.category}</span>}
                </h4>
                <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#A1C1D8" }}>${product.price}</p>
                <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Tallas: {product.sizes}</p>
                
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    onClick={() => { setEditingProduct(product); setIsAddingNew(false); }}
                    style={{ flex: 1, padding: "8px", background: "rgba(161,193,216,0.1)", border: "none", color: "#A1C1D8", cursor: "pointer", borderRadius: "4px" }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    style={{ flex: 1, padding: "8px", background: "rgba(255,59,48,0.1)", border: "none", color: "#ff3b30", cursor: "pointer", borderRadius: "4px" }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && !isAddingNew && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#A1C1D8" }}>
              No hay productos registrados. Haz clic en "Agregar Producto" para comenzar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
