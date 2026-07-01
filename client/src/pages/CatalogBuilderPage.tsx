import { useState, useEffect, useRef } from "react";

/**
 * CatalogBuilderPage
 * -------------------
 * Subpágina para armar un catálogo mayorista descargable en PDF,
 * usando la identidad visual de DREAMER (Anton / Playfair Display / Montserrat, navy #071729).
 *
 * Cómo integrarla en tu proyecto (dreamer-landing):
 * 1. Copia este archivo a: src/pages/CatalogBuilderPage.tsx
 * 2. En App.tsx agrega la ruta:
 *      import CatalogBuilderPage from "./pages/CatalogBuilderPage";
 *      <Route path="/catalog-builder" element={<CatalogBuilderPage />} />
 * 3. Visita /catalog-builder en tu sitio (local o desplegado).
 * 4. Sube tus productos, ajusta portada, y da clic en "Descargar PDF".
 *    Esto abre el diálogo de impresión del navegador -> "Guardar como PDF".
 *
 * No requiere instalar ninguna librería nueva (jsPDF, html2canvas, etc.),
 * usa la función nativa de impresión del navegador con estilos @media print.
 *
 * Los productos se guardan en localStorage del navegador, así que puedes
 * cerrar la pestaña y regresar después sin perder tu trabajo.
 */

type Product = {
  id: string;
  image: string; // base64 dataURL
  name: string;
  styleCode: string;
  price: string;
  sizes: string;
  minQty: string;
  category: string;
};

const STORAGE_KEY = "dreamer_catalog_builder_v1";

const emptyDraft = {
  image: "",
  name: "",
  styleCode: "",
  price: "",
  sizes: "",
  minQty: "",
  category: "",
};

export default function CatalogBuilderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [season, setSeason] = useState("Spring / Summer 2026");
  const [contact, setContact] = useState("dreamerjeans.usa · WhatsApp +1 (___) ___-____");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar / guardar en localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProducts(parsed.products ?? []);
        setSeason(parsed.season ?? season);
        setContact(parsed.contact ?? contact);
      } catch {
        /* ignore corrupt data */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ products, season, contact })
    );
  }, [products, season, contact]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const addProduct = () => {
    if (!draft.name || !draft.image) return;
    setProducts((p) => [...p, { ...draft, id: crypto.randomUUID() }]);
    setDraft(emptyDraft);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeProduct = (id: string) =>
    setProducts((p) => p.filter((prod) => prod.id !== id));

  const moveProduct = (index: number, dir: -1 | 1) => {
    setProducts((p) => {
      const next = [...p];
      const target = index + dir;
      if (target < 0 || target >= next.length) return p;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleDownload = () => window.print();

  // Paginar productos: 6 por página (grid 2x3)
  const PAGE_SIZE = 6;
  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += PAGE_SIZE) {
    pages.push(products.slice(i, i + PAGE_SIZE));
  }

  return (
    <div style={styles.wrapper}>
      <style>{printStyles}</style>

      {/* ---------- CONTROLES (no se imprimen) ---------- */}
      <div className="no-print" style={styles.controlsPanel}>
        <h1 style={styles.controlsTitle}>Constructor de Catálogo — DREAMER</h1>
        <p style={styles.controlsSubtitle}>
          Sube tus productos, ajusta la portada, y descarga el catálogo en PDF.
        </p>

        <div style={styles.fieldRow}>
          <label style={styles.label}>
            Temporada / título de portada
            <input
              style={styles.input}
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            />
          </label>
          <label style={styles.label}>
            Contacto (pie de página)
            <input
              style={styles.input}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </label>
        </div>

        <div style={styles.formCard}>
          <h2 style={styles.formCardTitle}>Agregar producto</h2>
          <div style={styles.fieldRow}>
            <label style={styles.label}>
              Foto
              <input
                ref={fileInputRef}
                style={styles.input}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            <label style={styles.label}>
              Nombre / estilo
              <input
                style={styles.input}
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="Ej. High-Waist Wide Leg"
              />
            </label>
            <label style={styles.label}>
              Código de estilo
              <input
                style={styles.input}
                value={draft.styleCode}
                onChange={(e) => setDraft((d) => ({ ...d, styleCode: e.target.value }))}
                placeholder="Ej. DJ-1042"
              />
            </label>
          </div>
          <div style={styles.fieldRow}>
            <label style={styles.label}>
              Categoría
              <input
                style={styles.input}
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                placeholder="Ej. Denim / Tops"
              />
            </label>
            <label style={styles.label}>
              Precio mayoreo
              <input
                style={styles.input}
                value={draft.price}
                onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                placeholder="Ej. $12.50 / pieza"
              />
            </label>
            <label style={styles.label}>
              Tallas disponibles
              <input
                style={styles.input}
                value={draft.sizes}
                onChange={(e) => setDraft((d) => ({ ...d, sizes: e.target.value }))}
                placeholder="Ej. S–XL"
              />
            </label>
            <label style={styles.label}>
              Mínimo de compra
              <input
                style={styles.input}
                value={draft.minQty}
                onChange={(e) => setDraft((d) => ({ ...d, minQty: e.target.value }))}
                placeholder="Ej. 6 pzas por estilo"
              />
            </label>
          </div>
          <button style={styles.addButton} onClick={addProduct}>
            + Agregar al catálogo
          </button>
        </div>

        <div style={styles.listHeader}>
          <span>{products.length} producto(s) en el catálogo</span>
          <button style={styles.downloadButton} onClick={handleDownload}>
            Descargar PDF
          </button>
        </div>

        <div style={styles.productList}>
          {products.map((p, i) => (
            <div key={p.id} style={styles.productRow}>
              <img src={p.image} alt={p.name} style={styles.thumb} />
              <div style={{ flex: 1 }}>
                <strong>{p.name}</strong> — {p.styleCode} — {p.price}
              </div>
              <button style={styles.smallButton} onClick={() => moveProduct(i, -1)}>↑</button>
              <button style={styles.smallButton} onClick={() => moveProduct(i, 1)}>↓</button>
              <button style={styles.removeButton} onClick={() => removeProduct(p.id)}>Quitar</button>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- CATÁLOGO IMPRIMIBLE ---------- */}
      <div id="catalog-print-area">
        {/* Portada */}
        <section className="print-page" style={styles.coverPage}>
          <div style={styles.coverEyebrow}>WHOLESALE CATALOG</div>
          <h1 style={styles.coverTitle}>DREAMER</h1>
          <div style={styles.coverDivider} />
          <p style={styles.coverSeason}>{season}</p>
          <p style={styles.coverTagline}>Dress Your Dreams — Colombian heritage, global fashion.</p>
          <div style={styles.coverFooter}>{contact}</div>
        </section>

        {/* Páginas de productos */}
        {pages.map((pageProducts, pageIndex) => (
          <section className="print-page" style={styles.productPage} key={pageIndex}>
            <div style={styles.pageHeader}>
              <span style={styles.pageHeaderBrand}>DREAMER</span>
              <span style={styles.pageHeaderMeta}>{season} — Pág. {pageIndex + 1}</span>
            </div>
            <div style={styles.grid}>
              {pageProducts.map((p) => (
                <div key={p.id} style={styles.card}>
                  <img src={p.image} alt={p.name} style={styles.cardImage} />
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardName}>{p.name}</h3>
                    <p style={styles.cardCode}>{p.styleCode} {p.category ? `· ${p.category}` : ""}</p>
                    <div style={styles.cardDivider} />
                    <p style={styles.cardDetail}><span style={styles.cardLabel}>Precio mayoreo:</span> {p.price}</p>
                    <p style={styles.cardDetail}><span style={styles.cardLabel}>Tallas:</span> {p.sizes}</p>
                    <p style={styles.cardDetail}><span style={styles.cardLabel}>Mínimo:</span> {p.minQty}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.pageFooter}>{contact}</div>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Tokens de marca ---------------- */
const COLORS = {
  navy: "#071729",
  cream: "#F7F3EC",
  gold: "#B8935A",
  charcoal: "#1C1C1C",
  white: "#FFFFFF",
  hair: "#E4DED2",
};

const FONT_DISPLAY = "'Anton', sans-serif";
const FONT_SERIF = "'Playfair Display', serif";
const FONT_BODY = "'Montserrat', sans-serif";

/* ---------------- Estilos inline (pantalla) ---------------- */
const styles: Record<string, React.CSSProperties> = {
  wrapper: { fontFamily: FONT_BODY, color: COLORS.charcoal, background: "#fafafa" },
  controlsPanel: {
    maxWidth: 980,
    margin: "0 auto",
    padding: "32px 24px 64px",
  },
  controlsTitle: { fontFamily: FONT_SERIF, fontSize: 28, marginBottom: 4, color: COLORS.navy },
  controlsSubtitle: { fontSize: 14, color: "#666", marginBottom: 24 },
  fieldRow: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 },
  label: { display: "flex", flexDirection: "column", fontSize: 12, fontWeight: 600, flex: "1 1 180px", color: "#444" },
  input: {
    marginTop: 6,
    padding: "10px 12px",
    borderRadius: 6,
    border: `1px solid ${COLORS.hair}`,
    fontSize: 14,
    fontFamily: FONT_BODY,
  },
  formCard: {
    background: COLORS.white,
    border: `1px solid ${COLORS.hair}`,
    borderRadius: 10,
    padding: 20,
    marginBottom: 24,
  },
  formCardTitle: { fontFamily: FONT_SERIF, fontSize: 18, marginBottom: 12, color: COLORS.navy },
  addButton: {
    background: COLORS.navy,
    color: COLORS.white,
    border: "none",
    padding: "10px 20px",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  downloadButton: {
    background: COLORS.gold,
    color: COLORS.white,
    border: "none",
    padding: "10px 20px",
    borderRadius: 6,
    fontWeight: 700,
    cursor: "pointer",
  },
  productList: { display: "flex", flexDirection: "column", gap: 8 },
  productRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: COLORS.white,
    border: `1px solid ${COLORS.hair}`,
    borderRadius: 8,
    padding: 8,
  },
  thumb: { width: 44, height: 44, objectFit: "cover", borderRadius: 4 },
  smallButton: {
    border: `1px solid ${COLORS.hair}`,
    background: COLORS.white,
    borderRadius: 4,
    cursor: "pointer",
    padding: "4px 8px",
  },
  removeButton: {
    border: "none",
    background: "#f5e2e2",
    color: "#a33",
    borderRadius: 4,
    cursor: "pointer",
    padding: "4px 10px",
  },

  /* ---- Catálogo (impresión) ---- */
  coverPage: {
    height: "100vh",
    background: COLORS.navy,
    color: COLORS.white,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 40,
  },
  coverEyebrow: {
    fontFamily: FONT_BODY,
    letterSpacing: 4,
    fontSize: 12,
    color: COLORS.gold,
    marginBottom: 16,
  },
  coverTitle: { fontFamily: FONT_DISPLAY, fontSize: 96, margin: 0, letterSpacing: 2 },
  coverDivider: { width: 80, height: 2, background: COLORS.gold, margin: "24px 0" },
  coverSeason: { fontFamily: FONT_SERIF, fontSize: 22, fontStyle: "italic", marginBottom: 8 },
  coverTagline: { fontFamily: FONT_BODY, fontSize: 13, color: "#c9d1db", maxWidth: 420 },
  coverFooter: {
    position: "absolute",
    bottom: 32,
    fontSize: 11,
    letterSpacing: 1,
    color: "#8b95a3",
  },
  productPage: {
    minHeight: "100vh",
    background: COLORS.cream,
    padding: "36px 40px",
    display: "flex",
    flexDirection: "column",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    borderBottom: `2px solid ${COLORS.navy}`,
    paddingBottom: 8,
    marginBottom: 24,
  },
  pageHeaderBrand: { fontFamily: FONT_DISPLAY, fontSize: 22, color: COLORS.navy, letterSpacing: 1 },
  pageHeaderMeta: { fontFamily: FONT_BODY, fontSize: 11, color: "#666", letterSpacing: 1 },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridAutoRows: "1fr",
    gap: 20,
    flex: 1,
  },
  card: {
    background: COLORS.white,
    border: `1px solid ${COLORS.hair}`,
    borderRadius: 6,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  cardImage: { width: "100%", height: 160, objectFit: "cover" },
  cardBody: { padding: 14, flex: 1, display: "flex", flexDirection: "column" },
  cardName: { fontFamily: FONT_SERIF, fontSize: 16, margin: "0 0 2px", color: COLORS.navy },
  cardCode: { fontSize: 10, letterSpacing: 1, color: "#888", margin: "0 0 8px", textTransform: "uppercase" },
  cardDivider: { width: 24, height: 2, background: COLORS.gold, margin: "0 0 8px" },
  cardDetail: { fontSize: 11.5, margin: "2px 0", color: "#333" },
  cardLabel: { fontWeight: 700, color: COLORS.navy },
  pageFooter: {
    marginTop: 20,
    fontSize: 10,
    letterSpacing: 1,
    color: "#888",
    textAlign: "center",
  },
};

/* ---------------- Estilos de impresión ---------------- */
const printStyles = `
  @media print {
    .no-print { display: none !important; }
    #catalog-print-area { margin: 0; }
    .print-page {
      page-break-after: always;
      break-after: page;
    }
    .print-page:last-child {
      page-break-after: auto;
    }
    @page {
      size: letter;
      margin: 0;
    }
  }
  @media screen {
    #catalog-print-area {
      max-width: 850px;
      margin: 0 auto 60px;
      box-shadow: 0 0 24px rgba(0,0,0,0.1);
    }
    .print-page {
      margin-bottom: 24px;
    }
  }
`;
