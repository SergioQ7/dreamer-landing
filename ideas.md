# DREAMER Wholesale Portal — Design Ideas

## Filosofía de diseño elegida

### Enfoque seleccionado: "Colombian Noir Editorial"

**Design Movement:** Dark Editorial Luxury — inspirado en las grandes casas de moda europeas (Chanel, Celine, Bottega Veneta) pero con la calidez y sensualidad del origen colombiano de la marca.

**Core Principles:**
1. Contraste absoluto: fondo negro profundo con tipografía blanca rompedora, interrumpido por destellos de azul acero (#A1C1D8) como acento de lujo.
2. Asimetría editorial: layouts que rompen la cuadrícula, texto que se superpone a imágenes, márgenes deliberadamente irregulares.
3. Tipografía como arquitectura: Playfair Display para titulares (serif elegante) + Montserrat para cuerpo (sans-serif limpio) — contraste de personalidades.
4. Espacio negativo como protagonista: el silencio visual amplifica el impacto de cada elemento.

**Color Philosophy:**
- Fondo: #071729 (azul marino casi negro — evoca la noche de Bogotá y la sofisticación de Miami)
- Texto primario: #FFFFFF (blanco puro — máximo contraste)
- Acento: #A1C1D8 (azul acero suave — el color de marca, usado con precisión quirúrgica)
- Crema: #F5F0E8 (para secciones de contraste, evoca papel de revista de lujo)
- Oro sutil: #C9A96E (para detalles de línea y separadores)

**Layout Paradigm:**
- Hero: Full-bleed con video, texto anclado en esquina inferior izquierda (no centrado)
- Secciones alternadas: izquierda-derecha asimétrico, nunca centrado uniforme
- Grid de colecciones: masonry editorial, no cuadrícula uniforme
- Timeline: vertical escalonado con línea de tiempo lateral

**Signature Elements:**
1. Línea horizontal delgada en dorado que separa secciones (1px, 60% del ancho)
2. Letras capitulares gigantes en fondo como marca de agua tipográfica
3. Números de sección en estilo editorial (01, 02, 03...) en acento azul

**Interaction Philosophy:**
- Hover en imágenes: zoom suave + overlay oscuro con texto emergente
- Botones: sin border-radius, con efecto de relleno deslizante (fill-slide)
- Scroll: fade-in con translación Y sutil (20px → 0px)
- Cursor: personalizado con punto pequeño que sigue el mouse

**Animation:**
- Entrada de secciones: opacity 0→1 + translateY(30px→0) con IntersectionObserver
- Hero headline: letra por letra con stagger de 80ms
- Imágenes de colección: scale(1.05) en hover con transition 600ms ease
- Timeline: línea que se dibuja al hacer scroll

**Typography System:**
- H1: Playfair Display, 72-96px, weight 700, letter-spacing -0.02em
- H2: Playfair Display, 42-56px, weight 400 italic
- H3: Montserrat, 14px, weight 600, letter-spacing 0.2em, UPPERCASE
- Body: Montserrat, 16px, weight 300, line-height 1.8
- Caption: Montserrat, 11px, weight 400, letter-spacing 0.15em, UPPERCASE

---

<response>
<text>Enfoque 1: Colombian Noir Editorial (seleccionado)</text>
<probability>0.08</probability>
</response>

<response>
<text>Enfoque 2: Miami Blanc — todo blanco y crema, tipografía condensada, líneas finas en dorado, sensación de galería de arte contemporáneo en South Beach.</text>
<probability>0.06</probability>
</response>

<response>
<text>Enfoque 3: Brutalist Warmth — tipografía enorme que ocupa toda la pantalla, colores tierra (terracota, beige, negro), layout completamente roto y asimétrico, inspirado en el arte callejero de Bogotá.</text>
<probability>0.05</probability>
</response>
