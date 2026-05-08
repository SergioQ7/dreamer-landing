/**
 * DREAMER Wholesale Portal — Home Page
 * Design: Colombian Noir Editorial
 * Sections: Hero, Essence, Collections, Timeline, B2B Form, Footer
 */

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { supabase } from "@/lib/supabase";

// ── Asset URLs ──
const ASSETS = {
  logo: "https://dreamerjeans.co/cdn/shop/files/DREAMER_LOGO.png?v=1729086588&width=230",
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663589279883/DFEqF8ZJpAMU9AbgUrCZG2/dreamer-hero-bg-Ph8LChmw9VgHdQryvMA9J8.webp",
  essence: "https://d2xsxph8kpxj0f.cloudfront.net/310519663589279883/DFEqF8ZJpAMU9AbgUrCZG2/dreamer-essence-gCunjygkhPcyMfBDB9p4zy.webp",
  resort: "https://d2xsxph8kpxj0f.cloudfront.net/310519663589279883/DFEqF8ZJpAMU9AbgUrCZG2/dreamer-collection-resort-CsVtXaN5NYGmKtoMXHzpwe.webp",
  denim: "https://d2xsxph8kpxj0f.cloudfront.net/310519663589279883/DFEqF8ZJpAMU9AbgUrCZG2/dreamer-collection-denim-m8PkPD2rGo3DyXkHzjCJG4.webp",
  essentials: "https://d2xsxph8kpxj0f.cloudfront.net/310519663589279883/DFEqF8ZJpAMU9AbgUrCZG2/dreamer-collection-essentials-iQYC2tJwDTEawmfpYesarE.webp",
};

// ── Timeline Data ──
const TIMELINE = [
  { year: "2017", title: "Born in Colombia", desc: "DREAMER is founded with a vision: high-quality casual fashion for authentic dreamers who refuse to compromise style for comfort." },
  { year: "2018", title: "First Showroom", desc: "Inauguration of the first DREAMER Showroom experience — a curated space where fashion meets lifestyle." },
  { year: "2019", title: "Franchise Launch", desc: "The franchise model takes flight. First DREAMER Stores open, bringing the brand closer to its community." },
  { year: "2020", title: "Bogotá Expansion", desc: "Strategic expansion across key locations in Bogotá, cementing DREAMER as a household name in Colombian fashion." },
  { year: "2022", title: "Medellín Showroom", desc: "Opening of the Medellín Showroom — the city of eternal spring welcomes DREAMER's elevated aesthetic." },
  { year: "2024", title: "Major Retail Centers", desc: "Expansion into Plaza de las Américas & Floresta, reaching hundreds of thousands of new customers." },
  { year: "Today", title: "Miami & Beyond", desc: "Bringing our Colombian heritage to Miami's B2B wholesale market. Partnering with premier boutiques to dress the world." },
];

// ── Collections Data ──
const COLLECTIONS = [
  {
    id: 1,
    name: "Tropical Getaway",
    tagline: "Exclusive prints that will capture every eye in your storefront.",
    pieces: "42 Styles",
    img: ASSETS.resort,
    tag: "SUMMER TREND",
  },
  {
    id: 2,
    name: "Urban Elegance",
    tagline: "Structured denim pieces for the modern and sophisticated client.",
    pieces: "38 Styles",
    img: ASSETS.denim,
    tag: "CORE COLLECTION",
  },
  {
    id: 3,
    name: "Perfect White",
    tagline: "Light and feminine textures your clients will buy season after season.",
    pieces: "55 Styles",
    img: ASSETS.essentials,
    tag: "EVERYDAY LUXURY",
  },
  {
    id: 4,
    name: "Signature Tailoring",
    tagline: "Denim innovation for clients seeking unique and distinctive pieces.",
    pieces: "45 Styles",
    img: "https://vpjagklivtoyocmzyjhp.supabase.co/storage/v1/object/sign/collections/structured-elegance.PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xN2U5ODMxZi0yYzZiLTRlOGUtYWNlZi05NzBmZGVmMDU2ZjAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb2xsZWN0aW9ucy9zdHJ1Y3R1cmVkLWVsZWdhbmNlLlBORyIsImlhdCI6MTc3NzQwODc5NCwiZXhwIjoxODA4OTQ0Nzk0fQ.dXoe-18MWLml-B1ayHBAI7AT4i6odJDxAZSfGGIsnew",
    tag: "NEW ARRIVAL",
  },
  {
    id: 5,
    name: "Elegant Comfort",
    tagline: "Lightweight premium fabrics, ideal for seasonal transitions.",
    pieces: "38 Styles",
    img: "https://vpjagklivtoyocmzyjhp.supabase.co/storage/v1/object/sign/collections/architectural-simplicity.PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xN2U5ODMxZi0yYzZiLTRlOGUtYWNlZi05NzBmZGVmMDU2ZjAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb2xsZWN0aW9ucy9hcmNoaXRlY3R1cmFsLXNpbXBsaWNpdHkuUE5HIiwiaWF0IjoxNzc3NDA4NzgyLCJleHAiOjE3ODAwMDA3ODJ9.ryo5RR2i5Jn7Muwh6nqeqckKEi0oEd2Ni_tSsSM8ip8",
    tag: "CRUISE COLLECTION",
  },
  {
    id: 6,
    name: "Monochromatic Chic",
    tagline: "Effortless sophistication in pastel tones dominating the trends.",
    pieces: "32 Styles",
    img: "https://vpjagklivtoyocmzyjhp.supabase.co/storage/v1/object/sign/collections/striped-minimalism.PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xN2U5ODMxZi0yYzZiLTRlOGUtYWNlZi05NzBmZGVmMDU2ZjAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb2xsZWN0aW9ucy9zdHJpcGVkLW1pbmltYWxpc20uUE5HIiwiaWF0IjoxNzc3NDA4NzY2LCJleHAiOjE3ODAwMDA3NjZ9.EWaTU0D1UKHy4P6dZxHuufPpmc3jlLlbkntMzEFVCJY",
    tag: "NEW COLLECTION",
  },
];

// ── Custom Cursor ──
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    const onEnter = () => ringRef.current?.classList.add("hovering");
    const onLeave = () => ringRef.current?.classList.remove("hovering");

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button, .product-card, input, select, textarea").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    raf.current = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ pointerEvents: "none" }} />
      <div ref={ringRef} className="cursor-ring" style={{ pointerEvents: "none" }} />
    </>
  );
}

// ── Loading Screen ──
function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div className="loading-screen">
      <div style={{ textAlign: "center" }}>
        <img src={ASSETS.logo} alt="DREAMER" style={{ width: 160, filter: "brightness(0) invert(1)", marginBottom: 32 }} />
        <div style={{ width: 200, height: 1, background: "rgba(161,193,216,0.2)", position: "relative", overflow: "hidden" }}>
          <div className="loading-bar" style={{ position: "absolute", top: 0, left: 0, height: "100%" }} />
        </div>
      </div>
    </div>
  );
}

// ── Navigation ──
function Navigation({ onApply }: { onApply: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "16px 40px" : "28px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(7,23,41,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(161,193,216,0.1)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <img src={ASSETS.logo} alt="DREAMER" style={{ height: 28, filter: "brightness(0) invert(1)" }} />

      {/* Desktop Nav */}
      <div style={{ gap: 40, alignItems: "center" }} className="hidden md:flex">
        {[
          { label: "Our Essence", id: "essence" },
          { label: "Collections", id: "collections" },
          { label: "Our Journey", id: "timeline" },
          { label: "Partner With Us", id: "contact" },
        ].map(({ label, id }) => (
          <button key={id} onClick={() => scrollTo(id)} className="nav-link" style={{ background: "none", border: "none" }}>
            {label}
          </button>
        ))}
        <button onClick={onApply} className="btn-luxury" style={{ padding: "12px 24px" }}>
          <span>Apply for Access</span>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden"
        style={{ background: "none", border: "none", color: "white", padding: 8 }}
        aria-label="Menu"
      >
        <div style={{ width: 24, display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ display: "block", height: 2, background: menuOpen ? "var(--dreamer-blue)" : "white", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", height: 2, background: menuOpen ? "var(--dreamer-blue)" : "white", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", height: 2, background: menuOpen ? "var(--dreamer-blue)" : "white", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </div>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "rgba(7,23,41,0.98)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(161,193,216,0.1)",
          padding: "24px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {[
            { label: "Our Essence", id: "essence" },
            { label: "Collections", id: "collections" },
            { label: "Our Journey", id: "timeline" },
            { label: "Partner With Us", id: "contact" },
          ].map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} className="nav-link" style={{ background: "none", border: "none", textAlign: "left" }}>
              {label}
            </button>
          ))}
          <button onClick={() => { onApply(); setMenuOpen(false); }} className="btn-luxury" style={{ alignSelf: "flex-start" }}>
            <span>Apply for Access</span>
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Hero Section ──
function HeroSection({ onApply, heroImg }: { onApply: () => void; heroImg: string }) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        const y = window.scrollY;
        const img = heroRef.current.querySelector(".parallax-img") as HTMLElement;
        if (img) img.style.transform = `translateY(${y * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 700,
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      {/* Background Image with Parallax */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <img
          src={heroImg}
          alt="DREAMER Hero"
          className="parallax-img"
          style={{
            width: "100%",
            height: "115%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
        />
        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(7,23,41,0.85) 0%, rgba(7,23,41,0.4) 50%, rgba(7,23,41,0.7) 100%)",
        }} />
        <div className="noise-overlay" />
      </div>

      {/* Video placeholder indicator */}
      <div style={{
        position: "absolute",
        top: "50%",
        right: "8%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: 0.5,
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: "1px solid rgba(161,193,216,0.4)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="5 3 19 12 5 21 5 3" fill="rgba(161,193,216,0.8)" stroke="none" />
          </svg>
        </div>
        <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(161,193,216,0.6)", writingMode: "vertical-rl", textTransform: "uppercase", fontFamily: "Montserrat" }}>
          Play Reel
        </span>
      </div>

      {/* Hero Content — bottom left */}
      <div style={{ position: "relative", zIndex: 2, padding: "0 40px 80px", maxWidth: 760 }}>
        <div className="hero-animate hero-animate-1" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <span className="gold-line" />
          <span className="section-number">Wholesale Portal — Miami, FL</span>
        </div>

        <h1
          className="hero-animate hero-animate-2"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(48px, 7vw, 96px)",
            fontWeight: 400,
            color: "white",
            lineHeight: 1.0,
            marginBottom: 8,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          DREAMER
        </h1>
        <h2
          className="hero-animate hero-animate-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--dreamer-blue)",
            lineHeight: 1.2,
            marginBottom: 28,
          }}
        >
          Dress Your Dreams.
        </h2>

        <p
          className="hero-animate hero-animate-3"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 15,
            fontWeight: 300,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.7,
            maxWidth: 480,
            marginBottom: 40,
          }}
        >
          Exclusive wholesale collections for Miami's premier boutiques.
          Colombian craftsmanship, global vision.
        </p>

        <div className="hero-animate hero-animate-4" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <button onClick={onApply} className="btn-luxury">
            <span>Apply for Wholesale Access</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ position: "relative", zIndex: 1 }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-outline-luxury"
          >
            <span>View Collections</span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: 32,
        right: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: 0.5,
      }}>
        <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)", writingMode: "vertical-rl", textTransform: "uppercase", fontFamily: "Montserrat" }}>
          Scroll
        </span>
        <div style={{
          width: 1,
          height: 48,
          background: "linear-gradient(to bottom, rgba(161,193,216,0.6), transparent)",
          animation: "fadeInUp 2s ease infinite",
        }} />
      </div>
    </section>
  );
}

// ── Marquee Banner ──
function MarqueeBanner() {
  const items = ["Miami Resort Wear", "Urban Denim", "Elevated Essentials", "Colombian Heritage", "B2B Wholesale", "SS 2025 Collection"];
  return (
    <div style={{
      background: "var(--dreamer-blue)",
      padding: "14px 0",
      overflow: "hidden",
      position: "relative",
    }}>
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--dreamer-navy)",
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}>
            {item}
            <span style={{ width: 4, height: 4, background: "var(--dreamer-navy)", borderRadius: "50%", opacity: 0.4 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Essence Section ──
function EssenceSection({ essenceImg }: { essenceImg: string }) {
  return (
    <section id="essence" style={{ padding: "120px 0", position: "relative", overflow: "hidden" }}>
      {/* Watermark */}
      <div style={{ position: "absolute", top: "50%", left: "-5%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <span className="watermark-text">DREAMER</span>
      </div>

      <div className="container">
        <div className="essence-grid">

          {/* Image Side */}
          <div className="reveal-left" style={{ position: "relative" }}>
            <div style={{
              position: "relative",
              height: "auto",
              overflow: "hidden",
            }}>
              <img
                src={essenceImg}
                alt="DREAMER Essence"
                style={{ width: "100%", height: "auto", display: "block", objectFit: "contain", objectPosition: "center top" }}
              />
              {/* Accent frame */}
              <div style={{
                position: "absolute",
                top: 20,
                left: -20,
                right: 20,
                bottom: -20,
                border: "1px solid rgba(161,193,216,0.2)",
                pointerEvents: "none",
                zIndex: -1,
              }} />
            </div>
            {/* Stats badge */}
            <div style={{
              position: "absolute",
              bottom: -20,
              right: -20,
              background: "var(--dreamer-blue)",
              color: "var(--dreamer-navy)",
              padding: "24px 28px",
              minWidth: 160,
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>7+</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 6 }}>Years of Excellence</div>
            </div>
          </div>

          {/* Text Side */}
          <div className="reveal-right" style={{ paddingLeft: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <span className="gold-line" />
              <span className="section-number">01 — Our Essence</span>
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 4vw, 52px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              marginBottom: 12,
            }}>
              Fashion Is More
            </h2>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 400,
              fontStyle: "italic",
              color: "var(--dreamer-blue)",
              marginBottom: 36,
            }}>
              Than Clothing.
            </h3>

            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 15,
              fontWeight: 300,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.9,
              marginBottom: 24,
            }}>
              We believe fashion is more than clothing; it's a way to dream big. Inspired by those who challenge limits and find beauty in the everyday.
            </p>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 15,
              fontWeight: 300,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.9,
              marginBottom: 40,
            }}>
              We fuse classic and modern styles, ensuring high quality and comfort. Dreamer is not just a brand; it's a <em style={{ color: "var(--dreamer-blue)", fontStyle: "italic" }}>lifestyle without borders.</em>
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 40, borderTop: "1px solid rgba(161,193,216,0.15)", paddingTop: 32 }}>
              {[
                { num: "135+", label: "Wholesale Partners" },
                { num: "3", label: "Showrooms" },
                { num: "2017", label: "Est. Colombia" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "white" }}>{num}</div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(161,193,216,0.6)", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Collections Section ──
function CollectionsSection({ onApply, collections }: { onApply: () => void; collections: typeof COLLECTIONS }) {
  return (
    <section id="collections" style={{
      padding: "120px 0",
      background: "rgba(255,255,255,0.02)",
      position: "relative",
    }}>
      <div className="noise-overlay" />
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64 }}>
          <div className="reveal">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <span className="gold-line" />
              <span className="section-number">02 — The Wholesale Experience</span>
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
            }}>
              Featured<br />
              <span style={{ fontStyle: "italic", color: "var(--dreamer-blue)" }}>Collections</span>
            </h2>
          </div>
          <div className="reveal" style={{ textAlign: "right" }}>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
              fontWeight: 300,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 280,
              lineHeight: 1.7,
            }}>
              Curated for boutiques that demand quality, versatility, and authentic style.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="collections-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}>
          {collections.map((col, i) => (
            <div
              key={col.id}
              className="reveal product-card"
              style={{
                height: 580,
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              <img src={col.img} alt={col.name} className="product-card-img" style={{ height: "100%", width: "100%" }} />
              <div className="product-card-overlay" />
              <div className="product-card-overlay-hover">
                <button onClick={onApply} className="btn-luxury">
                  <span>Unlock Wholesale Pricing</span>
                </button>
              </div>

              {/* Card content */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "28px 28px 32px",
                zIndex: 2,
              }}>
                <div style={{
                  display: "inline-block",
                  background: "var(--dreamer-blue)",
                  color: "var(--dreamer-navy)",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  marginBottom: 12,
                }}>
                  {col.tag}
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 6,
                }}>
                  {col.name}
                </h3>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 12,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.65)",
                  marginBottom: 20,
                }}>
                  {col.tagline}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(161,193,216,0.7)",
                  }}>
                    {col.pieces}
                  </span>
                  <button
                    onClick={onApply}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--dreamer-blue)",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    View B2B Catalog
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA below grid */}
        <div className="reveal" style={{ textAlign: "center", marginTop: 64 }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 13,
            fontWeight: 300,
            color: "rgba(255,255,255,0.5)",
            marginBottom: 24,
          }}>
            Access exclusive wholesale pricing, minimum order details, and full lookbooks.
          </p>
          <button onClick={onApply} className="btn-luxury">
            <span>Request Full B2B Catalog Access</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ position: "relative", zIndex: 1 }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Timeline Section ──
function TimelineSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && lineRef.current) {
          lineRef.current.classList.add("animated");
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="timeline" style={{ padding: "120px 0", position: "relative", overflow: "hidden" }}>
      {/* Watermark */}
      <div style={{ position: "absolute", top: "50%", right: "-5%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <span className="watermark-text">JOURNEY</span>
      </div>

      <div className="container">
        <div className="reveal" style={{ marginBottom: 80 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span className="gold-line" />
            <span className="section-number">03 — Our Journey</span>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(36px, 4vw, 56px)",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.1,
          }}>
            Born in Colombia,<br />
            <span style={{ fontStyle: "italic", color: "var(--dreamer-blue)" }}>Built for the World.</span>
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: 40 }}>
          {/* Vertical line */}
          <div ref={lineRef} className="timeline-line" />

          {TIMELINE.map((item, i) => (
            <div
              key={item.year}
              className="reveal timeline-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: 40,
                marginBottom: i < TIMELINE.length - 1 ? 56 : 0,
                transitionDelay: `${i * 0.1}s`,
                position: "relative",
              }}
            >
              {/* Dot on line */}
              <div style={{
                position: "absolute",
                left: -44,
                top: 6,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: item.year === "Today" ? "var(--dreamer-blue)" : "var(--dreamer-gold)",
                border: "2px solid var(--dreamer-navy)",
                boxShadow: item.year === "Today" ? "0 0 16px rgba(161,193,216,0.5)" : "none",
              }} />

              {/* Year */}
              <div>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: item.year === "Today" ? 18 : 28,
                  fontWeight: 700,
                  color: item.year === "Today" ? "var(--dreamer-blue)" : "var(--dreamer-gold)",
                  letterSpacing: item.year === "Today" ? "0.1em" : "-0.02em",
                }}>
                  {item.year}
                </span>
              </div>

              {/* Content */}
              <div>
                <h4 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 8,
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.7,
                  maxWidth: 520,
                }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── B2B Form Section ──
function ContactSection() {
  const [formData, setFormData] = useState({
    boutiqueName: "",
    buyerName: "",
    email: "",
    phone: "",
    address: "",
    collections: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.boutiqueName || !formData.buyerName || !formData.email) {
      toast.error("Please fill in all required fields.", {
        style: { background: "var(--dreamer-charcoal)", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
      return;
    }
    setSubmitting(true);
    
    try {
      // Sanitize inputs to prevent XSS
      const sanitizedData = {
        boutique_name: DOMPurify.sanitize(formData.boutiqueName),
        buyer_name: DOMPurify.sanitize(formData.buyerName),
        email: DOMPurify.sanitize(formData.email),
        phone: DOMPurify.sanitize(formData.phone),
        address: DOMPurify.sanitize(formData.address),
        collections: DOMPurify.sanitize(formData.collections),
      };

      // Save to Supabase
      await supabase.addInscription(sanitizedData);

      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        boutiqueName: "",
        buyerName: "",
        email: "",
        phone: "",
        address: "",
        collections: "",
      });

      toast.success("Application received! Our wholesale team will contact you within 24 hours.", {
        style: { background: "var(--dreamer-charcoal)", color: "white", border: "1px solid rgba(161,193,216,0.3)" },
        duration: 6000,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitting(false);
      toast.error("Failed to submit application. Please try again.", {
        style: { background: "var(--dreamer-charcoal)", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    }
  };

  return (
    <section id="contact" style={{
      padding: "120px 0",
      background: "var(--dreamer-charcoal)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div className="noise-overlay" />

      {/* Watermark */}
      <div style={{ position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }}>
        <span className="watermark-text" style={{ opacity: 0.5 }}>PARTNER</span>
      </div>

      <div className="container">
        <div className="contact-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 80,
          alignItems: "start",
        }}>

          {/* Left: Info */}
          <div className="reveal-left">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <span className="gold-line" />
              <span className="section-number">04 — B2B Partnership</span>
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 4vw, 52px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              marginBottom: 12,
            }}>
              Become a
            </h2>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px, 3vw, 40px)",
              fontWeight: 400,
              fontStyle: "italic",
              color: "var(--dreamer-blue)",
              marginBottom: 32,
            }}>
              DREAMER Partner.
            </h3>

            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.9,
              marginBottom: 48,
            }}>
              Join Miami's most exclusive wholesale network. Access competitive pricing, priority inventory, and dedicated account management for your boutique.
            </p>

            {/* Benefits */}
            {[
              { icon: "◆", title: "Exclusive Pricing", desc: "Wholesale rates up to 60% below retail" },
              { icon: "◆", title: "Priority Access", desc: "First look at new collections before launch" },
              { icon: "◆", title: "Dedicated Support", desc: "Personal account manager for your boutique" },
              { icon: "◆", title: "Flexible MOQ", desc: "Minimum orders designed for boutique scale" },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                display: "flex",
                gap: 20,
                marginBottom: 24,
                paddingBottom: 24,
                borderBottom: "1px solid rgba(161,193,216,0.08)",
              }}>
                <span style={{ color: "var(--dreamer-blue)", fontSize: 8, marginTop: 6, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: "white", letterSpacing: "0.05em", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Form */}
          <div className="reveal-right">
            {submitted ? (
              <div style={{
                padding: "60px 40px",
                border: "1px solid rgba(161,193,216,0.2)",
                textAlign: "center",
              }}>
                <div style={{
                  width: 64,
                  height: 64,
                  border: "1px solid var(--dreamer-blue)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--dreamer-blue)" strokeWidth="1.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "white", marginBottom: 12 }}>Application Received</h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                  Thank you for your interest in becoming a DREAMER wholesale partner. Our team will review your application and contact you within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  <div className="form-field">
                    <input
                      type="text"
                      name="boutiqueName"
                      placeholder=" "
                      value={formData.boutiqueName}
                      onChange={handleChange}
                      required
                    />
                    <label>Boutique Name *</label>
                  </div>
                  <div className="form-field">
                    <input
                      type="text"
                      name="buyerName"
                      placeholder=" "
                      value={formData.buyerName}
                      onChange={handleChange}
                      required
                    />
                    <label>Buyer's Full Name *</label>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  <div className="form-field">
                    <input
                      type="email"
                      name="email"
                      placeholder=" "
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label>Email Address *</label>
                  </div>
                  <div className="form-field">
                    <input
                      type="tel"
                      name="phone"
                      placeholder=" "
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <label>Phone Number</label>
                  </div>
                </div>

                <div className="form-field">
                  <input
                    type="text"
                    name="address"
                    placeholder=" "
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <label>Miami Store Address</label>
                </div>

                <div className="form-field">
                  <select
                    name="collections"
                    value={formData.collections}
                    onChange={handleChange}
                    required
                    style={{ cursor: "none" }}
                  >
                    <option value="" disabled>Select collections of interest</option>
                    <option value="resort">Miami Resort Wear</option>
                    <option value="denim">Urban Denim</option>
                    <option value="essentials">Elevated Essentials</option>
                    <option value="all">All Collections</option>
                    <option value="custom">Custom Curation</option>
                  </select>
                  <label style={{ top: -4, fontSize: 9, color: "var(--dreamer-blue)" }}>Collections of Interest *</label>
                </div>

                <button
                  type="submit"
                  className="btn-luxury"
                  disabled={submitting}
                  style={{ alignSelf: "flex-start", opacity: submitting ? 0.7 : 1 }}
                >
                  <span>{submitting ? "Submitting..." : "Request Wholesale Account"}</span>
                  {!submitting && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ position: "relative", zIndex: 1 }}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )}
                </button>

                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.35)",
                  lineHeight: 1.6,
                }}>
                  By submitting this form, you agree to be contacted by our wholesale team. Your information is kept strictly confidential.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ──
function Footer({ onApply }: { onApply: () => void }) {
  return (
    <footer style={{
      background: "var(--dreamer-navy)",
      borderTop: "1px solid rgba(161,193,216,0.1)",
      padding: "80px 0 40px",
    }}>
      <div className="container">
        <div className="footer-grid" style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 60,
          marginBottom: 64,
        }}>

          {/* Brand */}
          <div>
            <img src={ASSETS.logo} alt="DREAMER" style={{ height: 28, filter: "brightness(0) invert(1)", marginBottom: 20 }} />
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
              fontWeight: 300,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.8,
              maxWidth: 260,
              marginBottom: 24,
            }}>
              Colombian heritage meets Miami's wholesale market. Bringing authentic fashion to boutiques across the USA.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {["Instagram", "LinkedIn", "WhatsApp"].map(social => (
                <a
                  key={social}
                  href="#"
                  style={{
                    width: 36,
                    height: 36,
                    border: "1px solid rgba(161,193,216,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(161,193,216,0.6)",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 9,
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--dreamer-blue)";
                    (e.currentTarget as HTMLElement).style.color = "var(--dreamer-blue)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(161,193,216,0.2)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(161,193,216,0.6)";
                  }}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h5 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--dreamer-blue)", marginBottom: 20 }}>Collections</h5>
            {["Miami Resort Wear", "Urban Denim", "Elevated Essentials", "New Arrivals"].map(item => (
              <button key={item} onClick={onApply} style={{ display: "block", background: "none", border: "none", fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.5)", marginBottom: 12, textAlign: "left", transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >{item}</button>
            ))}
          </div>

          {/* Company */}
          <div>
            <h5 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--dreamer-blue)", marginBottom: 20 }}>Company</h5>
            {["Our Story", "Showrooms", "Press", "Careers"].map(item => (
              <button key={item} onClick={() => toast.info("Coming soon", { style: { background: "var(--dreamer-charcoal)", color: "white" } })} style={{ display: "block", background: "none", border: "none", fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.5)", marginBottom: 12, textAlign: "left", transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >{item}</button>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--dreamer-blue)", marginBottom: 20 }}>Contact</h5>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
              <p style={{ marginBottom: 8 }}>Miami, Florida</p>
              <p style={{ marginBottom: 8 }}>wholesale@dreamerjeans.co</p>
              <p style={{ marginBottom: 20 }}>+1 (305) 000-0000</p>
              <button onClick={onApply} className="btn-luxury" style={{ padding: "10px 20px" }}>
                <span style={{ fontSize: 9 }}>Apply Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(161,193,216,0.1)",
          paddingTop: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.3)" }}>
            © 2025 DREAMER. All rights reserved. Born in Colombia, dreaming globally.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service", "Wholesale Agreement"].map(item => (
              <button key={item} onClick={() => toast.info("Coming soon", { style: { background: "var(--dreamer-charcoal)", color: "white" } })} style={{ background: "none", border: "none", fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 300, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em", transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(161,193,216,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              >{item}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Scroll Reveal Hook ──
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

// ── Main Home Component ──
export default function Home() {
  useScrollReveal();
  const [heroImg, setHeroImg] = useState(ASSETS.hero);
  const [essenceImg, setEssenceImg] = useState(ASSETS.essence);
  const [collectionsData, setCollectionsData] = useState(COLLECTIONS);

  useEffect(() => {
    supabase.getSiteSettings().then(settings => {
      if (settings) {
        setHeroImg(settings.hero_img);
        setEssenceImg(settings.essence_img);
        setCollectionsData(settings.collections);
      }
    }).catch(() => {});
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "var(--dreamer-navy)", minHeight: "100vh" }}>
      <LoadingScreen />
      <CustomCursor />
      <Navigation onApply={scrollToContact} />
      <HeroSection onApply={scrollToContact} heroImg={heroImg} />
      <MarqueeBanner />
      <EssenceSection essenceImg={essenceImg} />
      <CollectionsSection onApply={scrollToContact} collections={collectionsData} />
      <TimelineSection />
      <ContactSection />
      <Footer onApply={scrollToContact} />
    </div>
  );
}
