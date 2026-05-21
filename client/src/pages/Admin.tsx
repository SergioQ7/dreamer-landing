import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { SiteSettings, CollectionSetting } from "@/lib/supabase";

const DEFAULT_SETTINGS: SiteSettings = {
  hero_img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663589279883/DFEqF8ZJpAMU9AbgUrCZG2/dreamer-hero-bg-Ph8LChmw9VgHdQryvMA9J8.webp",
  essence_img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663589279883/DFEqF8ZJpAMU9AbgUrCZG2/dreamer-essence-gCunjygkhPcyMfBDB9p4zy.webp",
  collections: [
    {
      id: 1,
      name: "Tropical Getaway",
      tagline: "Exclusive prints that will capture every eye in your storefront.",
      pieces: "12 Styles",
      img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663589279883/DFEqF8ZJpAMU9AbgUrCZG2/dreamer-collection-resort-CsVtXaN5NYGmKtoMXHzpwe.webp",
      tag: "SUMMER TREND",
    },
    {
      id: 2,
      name: "Urban Elegance",
      tagline: "Structured denim pieces for the modern and sophisticated client.",
      pieces: "15 Styles",
      img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663589279883/DFEqF8ZJpAMU9AbgUrCZG2/dreamer-collection-denim-m8PkPD2rGo3DyXkHzjCJG4.webp",
      tag: "CORE COLLECTION",
    },
    {
      id: 3,
      name: "Perfect White",
      tagline: "Light and feminine textures your clients will buy season after season.",
      pieces: "8 Styles",
      img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663589279883/DFEqF8ZJpAMU9AbgUrCZG2/dreamer-collection-essentials-iQYC2tJwDTEawmfpYesarE.webp",
      tag: "EVERYDAY LUXURY",
    },
    {
      id: 4,
      name: "Signature Tailoring",
      tagline: "Denim innovation for clients seeking unique and distinctive pieces.",
      pieces: "10 Styles",
      img: "https://vpjagklivtoyocmzyjhp.supabase.co/storage/v1/object/sign/collections/structured-elegance.PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xN2U5ODMxZi0yYzZiLTRlOGUtYWNlZi05NzBmZGVmMDU2ZjAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb2xsZWN0aW9ucy9zdHJ1Y3R1cmVkLWVsZWdhbmNlLlBORyIsImlhdCI6MTc3NzQwODc5NCwiZXhwIjoxODA4OTQ0Nzk0fQ.dXoe-18MWLml-B1ayHBAI7AT4i6odJDxAZSfGGIsnew",
      tag: "NEW ARRIVAL",
    },
    {
      id: 5,
      name: "Elegant Comfort",
      tagline: "Lightweight premium fabrics, ideal for seasonal transitions.",
      pieces: "9 Styles",
      img: "https://vpjagklivtoyocmzyjhp.supabase.co/storage/v1/object/sign/collections/architectural-simplicity.PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xN2U5ODMxZi0yYzZiLTRlOGUtYWNlZi05NzBmZGVmMDU2ZjAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb2xsZWN0aW9ucy9hcmNoaXRlY3R1cmFsLXNpbXBsaWNpdHkuUE5HIiwiaWF0IjoxNzc3NDA4NzgyLCJleHAiOjE3ODAwMDA3ODJ9.ryo5RR2i5Jn7Muwh6nqeqckKEi0oEd2Ni_tSsSM8ip8",
      tag: "CRUISE COLLECTION",
    },
    {
      id: 6,
      name: "Monochromatic Chic",
      tagline: "Effortless sophistication in pastel tones dominating the trends.",
      pieces: "14 Styles",
      img: "https://vpjagklivtoyocmzyjhp.supabase.co/storage/v1/object/sign/collections/striped-minimalism.PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xN2U5ODMxZi0yYzZiLTRlOGUtYWNlZi05NzBmZGVmMDU2ZjAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb2xsZWN0aW9ucy9zdHJpcGVkLW1pbmltYWxpc20uUE5HIiwiaWF0IjoxNzc3NDA4NzY2LCJleHAiOjE3ODAwMDA3NjZ9.EWaTU0D1UKHy4P6dZxHuufPpmc3jlLlbkntMzEFVCJY",
      tag: "NEW COLLECTION",
    },
  ],
};

const DREAMER_LOGO = "https://dreamerjeans.co/cdn/shop/files/DREAMER_LOGO.png?v=1729086588&width=230";

export default function Admin() {
  const { isAuthenticated, isLoading: authLoading, logout, userEmail } = useAuth();
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImg, setHeroImg] = useState(DEFAULT_SETTINGS.hero_img);
  const [essenceImg, setEssenceImg] = useState(DEFAULT_SETTINGS.essence_img);
  const [catalogPassword, setCatalogPassword] = useState("");
  const [editingCollection, setEditingCollection] = useState<number | null>(null);
  const [draftCollection, setDraftCollection] = useState<CollectionSetting | null>(null);

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

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await supabase.getSiteSettings();
      if (data) {
        setSettings(data);
        setHeroImg(data.hero_img);
        setEssenceImg(data.essence_img);
        setCatalogPassword(data.catalog_password || "");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssets = async () => {
    setSaving(true);
    try {
      const newSettings = { ...settings, hero_img: heroImg, essence_img: essenceImg, catalog_password: catalogPassword };
      await supabase.saveSiteSettings(newSettings);
      setSettings(newSettings);
      toast.success("Settings updated successfully", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } catch (error) {
      console.error("Error saving assets:", error);
      toast.error("Failed to save settings", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditCollection = (col: CollectionSetting) => {
    setEditingCollection(col.id);
    setDraftCollection({ ...col });
  };

  const handleSaveCollection = async () => {
    if (!draftCollection) return;
    setSaving(true);
    try {
      const updatedCollections = settings.collections.map(c =>
        c.id === draftCollection.id ? draftCollection : c
      );
      const newSettings = { ...settings, collections: updatedCollections };
      await supabase.saveSiteSettings(newSettings);
      setSettings(newSettings);
      setEditingCollection(null);
      setDraftCollection(null);
      toast.success("Collection updated successfully", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } catch (error) {
      console.error("Error saving collection:", error);
      toast.error("Failed to save collection", {
        style: { background: "#1a1a2e", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCollection(null);
    setDraftCollection(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#071729", display: "flex", alignItems: "center", justifyContent: "center", cursor: "auto" }}>
        <div style={{ color: "#A1C1D8", fontSize: "18px", textAlign: "center" }}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#071729", color: "#F5F0EB", fontFamily: "'Montserrat', sans-serif", cursor: "auto" }}>
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
          <img src={DREAMER_LOGO} alt="DREAMER" style={{ height: "40px", filter: "brightness(0) invert(1)" }} />
          <span style={{ fontSize: "16px", letterSpacing: "2px", color: "#A1C1D8", fontWeight: "bold" }}>DREAMER ADMIN</span>
          <nav style={{ display: "flex", gap: "16px", marginLeft: "20px" }}>
            <span style={{ color: "#a1c1d8", cursor: "pointer", fontSize: "13px" }} onClick={() => setLocation("/admin")}>Inscripciones</span>
            <span style={{ color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #fff" }}>Configuración</span>
            <span style={{ color: "#a1c1d8", cursor: "pointer", fontSize: "13px" }} onClick={() => setLocation("/admin/products")}>Productos</span>
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span style={{ fontSize: "13px", color: "#a1c1d8" }}>admin · {userEmail}</span>
          <button
            onClick={() => { logout(); setLocation("/login"); }}
            style={{
              padding: "10px 20px",
              background: "transparent",
              border: "1px solid rgba(161,193,216,0.3)",
              color: "#A1C1D8",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "1px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = "rgba(161,193,216,0.1)";
              (e.target as HTMLButtonElement).style.borderColor = "rgba(161,193,216,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = "transparent";
              (e.target as HTMLButtonElement).style.borderColor = "rgba(161,193,216,0.3)";
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 40px" }}>
        {/* Assets Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{
            fontSize: "clamp(24px, 5vw, 36px)",
            letterSpacing: "4px",
            marginBottom: "30px",
            color: "#F5F0EB",
            textTransform: "uppercase",
            fontWeight: "600",
          }}>Site Images</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" }}>
            {/* Hero Image */}
            <div style={{
              background: "#1a1a2e",
              border: "1px solid rgba(161,193,216,0.15)",
              padding: "24px",
            }}>
              <label style={{
                display: "block",
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#A1C1D8",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}>Banner Image (Hero)</label>

              <img
                src={heroImg}
                alt="Hero Preview"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  marginBottom: "16px",
                  background: "#0a0a0a",
                }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />

              <input
                type="text"
                value={heroImg}
                onChange={(e) => setHeroImg(e.target.value)}
                placeholder="https://..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "transparent",
                  border: "1px solid rgba(161,193,216,0.2)",
                  color: "#F5F0EB",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "13px",
                  marginBottom: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(161,193,216,0.5)"; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(161,193,216,0.2)"; }}
              />

              <button
                onClick={handleSaveAssets}
                disabled={saving}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  background: "#A1C1D8",
                  color: "#071729",
                  border: "none",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  if (!saving) (e.target as HTMLButtonElement).style.background = "#c5d9e8";
                }}
                onMouseLeave={(e) => {
                  if (!saving) (e.target as HTMLButtonElement).style.background = "#A1C1D8";
                }}
              >
                {saving ? "Saving..." : "Save Banner"}
              </button>
            </div>

            {/* Essence Image */}
            <div style={{
              background: "#1a1a2e",
              border: "1px solid rgba(161,193,216,0.15)",
              padding: "24px",
            }}>
              <label style={{
                display: "block",
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#A1C1D8",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}>Essence Image</label>

              <img
                src={essenceImg}
                alt="Essence Preview"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  marginBottom: "16px",
                  background: "#0a0a0a",
                }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />

              <input
                type="text"
                value={essenceImg}
                onChange={(e) => setEssenceImg(e.target.value)}
                placeholder="https://..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "transparent",
                  border: "1px solid rgba(161,193,216,0.2)",
                  color: "#F5F0EB",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "13px",
                  marginBottom: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(161,193,216,0.5)"; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(161,193,216,0.2)"; }}
              />

              <button
                onClick={handleSaveAssets}
                disabled={saving}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  background: "#A1C1D8",
                  color: "#071729",
                  border: "none",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  if (!saving) (e.target as HTMLButtonElement).style.background = "#c5d9e8";
                }}
                onMouseLeave={(e) => {
                  if (!saving) (e.target as HTMLButtonElement).style.background = "#A1C1D8";
                }}
              >
                {saving ? "Saving..." : "Save Image"}
              </button>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{
            fontSize: "clamp(24px, 5vw, 36px)",
            letterSpacing: "4px",
            marginBottom: "30px",
            color: "#F5F0EB",
            textTransform: "uppercase",
            fontWeight: "600",
          }}>Security</h2>

          <div style={{
            background: "#1a1a2e",
            border: "1px solid rgba(161,193,216,0.15)",
            padding: "24px",
            maxWidth: "600px",
          }}>
            <label style={{
              display: "block",
              fontSize: "10px",
              letterSpacing: "2px",
              color: "#A1C1D8",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}>Catalog Access Password (To View Prices)</label>

            <input
              type="text"
              value={catalogPassword}
              onChange={(e) => setCatalogPassword(e.target.value)}
              placeholder="e.g. DREAMERVIP"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "transparent",
                border: "1px solid rgba(161,193,216,0.2)",
                color: "#F5F0EB",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "13px",
                marginBottom: "16px",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(161,193,216,0.5)"; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(161,193,216,0.2)"; }}
            />

            <button
              onClick={handleSaveAssets}
              disabled={saving}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: "#A1C1D8",
                color: "#071729",
                border: "none",
                fontWeight: "600",
                letterSpacing: "1px",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
                fontSize: "12px",
                textTransform: "uppercase",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                if (!saving) (e.target as HTMLButtonElement).style.background = "#c5d9e8";
              }}
              onMouseLeave={(e) => {
                if (!saving) (e.target as HTMLButtonElement).style.background = "#A1C1D8";
              }}
            >
              {saving ? "Saving..." : "Save Password"}
            </button>
            <p style={{ marginTop: "12px", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
              If you leave this blank, the prices will be public for everyone.
            </p>
          </div>
        </section>

        {/* Collections Section */}
        <section>
          <h2 style={{
            fontSize: "clamp(24px, 5vw, 36px)",
            letterSpacing: "4px",
            marginBottom: "30px",
            color: "#F5F0EB",
            textTransform: "uppercase",
            fontWeight: "600",
          }}>Collections</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {settings.collections.map((collection) => (
              <div key={collection.id}>
                {editingCollection === collection.id ? (
                  // Edit Mode
                  <div style={{
                    background: "#1a1a2e",
                    border: "1px solid rgba(161,193,216,0.3)",
                    padding: "24px",
                  }}>
                    <h3 style={{ fontSize: "14px", color: "#A1C1D8", marginBottom: "16px", letterSpacing: "1px", textTransform: "uppercase" }}>
                      Editing Collection
                    </h3>

                    <label style={{
                      display: "block",
                      fontSize: "10px",
                      letterSpacing: "2px",
                      color: "#A1C1D8",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}>Name</label>
                    <input
                      type="text"
                      value={draftCollection?.name || ""}
                      onChange={(e) => draftCollection && setDraftCollection({ ...draftCollection, name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "transparent",
                        border: "1px solid rgba(161,193,216,0.2)",
                        color: "#F5F0EB",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "13px",
                        marginBottom: "12px",
                        boxSizing: "border-box",
                      }}
                    />

                    <label style={{
                      display: "block",
                      fontSize: "10px",
                      letterSpacing: "2px",
                      color: "#A1C1D8",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}>Tagline</label>
                    <input
                      type="text"
                      value={draftCollection?.tagline || ""}
                      onChange={(e) => draftCollection && setDraftCollection({ ...draftCollection, tagline: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "transparent",
                        border: "1px solid rgba(161,193,216,0.2)",
                        color: "#F5F0EB",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "13px",
                        marginBottom: "12px",
                        boxSizing: "border-box",
                      }}
                    />

                    <label style={{
                      display: "block",
                      fontSize: "10px",
                      letterSpacing: "2px",
                      color: "#A1C1D8",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}>Tag</label>
                    <input
                      type="text"
                      value={draftCollection?.tag || ""}
                      onChange={(e) => draftCollection && setDraftCollection({ ...draftCollection, tag: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "transparent",
                        border: "1px solid rgba(161,193,216,0.2)",
                        color: "#F5F0EB",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "13px",
                        marginBottom: "12px",
                        boxSizing: "border-box",
                      }}
                    />

                    <label style={{
                      display: "block",
                      fontSize: "10px",
                      letterSpacing: "2px",
                      color: "#A1C1D8",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}>Image URL</label>
                    <input
                      type="text"
                      value={draftCollection?.img || ""}
                      onChange={(e) => draftCollection && setDraftCollection({ ...draftCollection, img: e.target.value })}
                      placeholder="https://..."
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "transparent",
                        border: "1px solid rgba(161,193,216,0.2)",
                        color: "#F5F0EB",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "13px",
                        marginBottom: "12px",
                        boxSizing: "border-box",
                      }}
                    />

                    {draftCollection?.img && (
                      <img
                        src={draftCollection.img}
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          marginBottom: "12px",
                          background: "#0a0a0a",
                        }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}

                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={handleSaveCollection}
                        disabled={saving}
                        style={{
                          flex: 1,
                          padding: "10px 12px",
                          background: "#A1C1D8",
                          color: "#071729",
                          border: "none",
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                          cursor: saving ? "not-allowed" : "pointer",
                          opacity: saving ? 0.6 : 1,
                          fontSize: "11px",
                          textTransform: "uppercase",
                        }}
                      >
                        {saving ? "..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={saving}
                        style={{
                          flex: 1,
                          padding: "10px 12px",
                          background: "transparent",
                          color: "#A1C1D8",
                          border: "1px solid rgba(161,193,216,0.3)",
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                          cursor: saving ? "not-allowed" : "pointer",
                          opacity: saving ? 0.6 : 1,
                          fontSize: "11px",
                          textTransform: "uppercase",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div style={{
                    background: "#1a1a2e",
                    border: "1px solid rgba(161,193,216,0.15)",
                    overflow: "hidden",
                    transition: "all 0.3s",
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(161,193,216,0.35)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(161,193,216,0.15)";
                    }}
                  >
                    <img
                      src={collection.img}
                      alt={collection.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        background: "#0a0a0a",
                      }}
                      onError={(e) => { (e.target as HTMLImageElement).style.height = "0"; }}
                    />

                    <div style={{ padding: "20px" }}>
                      <h3 style={{
                        fontSize: "14px",
                        color: "#F5F0EB",
                        marginBottom: "6px",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                      }}>
                        {collection.name}
                      </h3>

                      <p style={{
                        fontSize: "12px",
                        color: "#a1c1d8",
                        marginBottom: "12px",
                        lineHeight: "1.5",
                      }}>
                        {collection.tagline}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{
                          fontSize: "10px",
                          color: "#A1C1D8",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        }}>
                          {collection.tag}
                        </span>
                      </div>

                      <button
                        onClick={() => handleEditCollection(collection)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          background: "transparent",
                          color: "#A1C1D8",
                          border: "1px solid rgba(161,193,216,0.3)",
                          cursor: "pointer",
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.background = "rgba(161,193,216,0.1)";
                          (e.target as HTMLButtonElement).style.borderColor = "rgba(161,193,216,0.6)";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.background = "transparent";
                          (e.target as HTMLButtonElement).style.borderColor = "rgba(161,193,216,0.3)";
                        }}
                      >
                        ✏ Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
