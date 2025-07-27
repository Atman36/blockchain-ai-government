## 1) Color System

### Base Palette (Core)
- **Primary / Institute Blue** — **#0A2540**  
  Trust, institutional stability, connection to the public sector.
- **Accent / Neo-Cyan** — **#00D4FF**  
  Web3/AI innovations, highlighting CTAs and interactivity.
- **Depth / Navy** — **#1A3C60**  
  Depth for gradients, panels, and cards.
- **Success** — **#22C55E** or **#4CAF50** (if a more "material-classic" tone is needed)  
  For confirmations and positive statuses.

### Neutrals
- **Neutral 900** #0E1621  
- **Neutral 700** #344355  
- **Neutral 500** #A0AEC0  
- **Neutral 100** #F5F7FA  
Neutral grays support readability and hierarchy, aligning with your choice of #A0AEC0.

### Background Gradients
- **Dark gradient**: `linear-gradient(135deg, #0A2540 0%, #1A3C60 100%)` — main background.
- **Alt dark**: `linear-gradient(to bottom right, #121212, #0A2540)` — for "technology/data" sections.

### Light Theme
- **Background**: #FFFFFF  
- **Text primary**: #0A2540  
- **Text secondary**: #344355  
- **Surfaces**: #F5F7FA / #FFFFFF with a thin border #E2E8F0  
- **Links/CTA**: #0A2540 on #00D4FF background (invert for dark theme)  
The light theme maintains institutional seriousness, relying on the same accent neon. Dark is primary; light is for readability of long texts, reports, and government audiences. The dark theme and neon accents align with Web3 trends for 2025.

> **Accessibility Note.** For CTAs in the dark theme, use **#00D4FF** as background and text **#0A2540** or **#001320** — check contrast no lower than WCAG AA; for light theme — text **#0A2540** on an outline button with **#00D4FF** border.

---

## 2) Typography

- **Headings and text:** **Inter**  
  Screen geometry, high readability, neutral technological feel. Recommended weights: 700/600 for H1–H3, 500 for subtitles, 400 for body text.
- **Technical inserts / code / Transaction IDs:** **Fira Code** 400/500, 13–14 px. Emphasizes engineering, convenient for hashes and smart contracts.

Rhythm recommendation: H1 48–56, H2 36, H3 28, Body 18/28 (desktop), 16/26 (mobile). Calm line-height (1.5), large margins.

---

## 3) Logo Concept

**Meaning:** "Network of Trust" — a stable hexagon as a "ledger cell" + a distributed network of nodes (DAO) + a thin "neural" weave (AI) integrated within. Hexagon – stability and modularity; node network – decentralization; neural layer – intelligent automation and transparent algorithms.

**Construction:**
- Outline of a regular hexagon (60° angle), outline thickness 2.5–3.0% of the side.  
- Inside — 6–8 nodes connected by edges forming a "minimum spanning tree" + 1–2 diagonals; in the center — a small "register" node.  
- **Mono** version (flat) and **Grid** version (with a thin neural network).  
- **Main palette:** outline **#0A2540**, nodes and connections **#00D4FF**; for light theme — invert outline to **#0A2540**, connections **#1A3C60**.  
- **Scaling:** pictogram 16×16 (favicon) — only hexagon + 3 nodes; 24×24 — add a diagonal; 32×32+ — full grid.

---

## 4) Visual Style

**Futuristic minimalism**: clean surfaces, "layered glass", thin lines, neon cyan for interactivity, emphasis on data and process transparency.

- **Background:** dark gradients with a low-contrast network pattern (opacity 6–10%). Nodes can gently "breathe" (pulse 3s ease-in-out, amplitude 0.1→0.2).
- **Shapes:** hexagons, connected dots, thin lines — basic interface and illustration language.
- **Icons:** linear, 2 px thickness, oval endings, active state — light outer cyan glow.
- **Transparency:** semi-transparent cards/panels ("glass") over a gradient background → metaphor for open data.
- **Data:** interactive diagrams of citizen participation, voting, smart contract audits — key visual content.
- **Animation tone:** micro-reactions on hover/focus; avoid "gamey" excess. The trend of dark interfaces is confirmed by 2025 sources.

---

## 5) UI Tokens (CSS Variables)

```css
:root {
  /* Light */
  --bg: #FFFFFF;
  --text: #0A2540;
  --text-muted: #344355;
  --surface: #F5F7FA;
  --border: #E2E8F0;

  --primary: #0A2540;
  --accent:  #00D4FF;
  --success: #22C55E;
  --warning: #F59E0B;
  --danger:  #F44336;

  --link:    #0A2540;
  --code-bg: #F5F7FA;
}

[data-theme="dark"] {
  --bg: #0A2540;
  --text: #FFFFFF;
  --text-muted: #A0AEC0;
  --surface: rgba(255,255,255,0.06);
  --border: rgba(255,255,255,0.12);

  --primary: #00D4FF;
  --accent:  #00D4FF;
  --success: #22C55E;
  --warning: #F59E0B;
  --danger:  #F44336;

  --link:    #00D4FF;
  --code-bg: rgba(255,255,255,0.04);
}
```

(Dark background and values correspond to your recommendations for gradients, micro-animations, and glass-effect cards.)

---

## 6) Layout and Content Modules

- **Hero:** large H1, subheading, CTA; animated "node network" in the background (opacity 0.06–0.1).
- **Advantages/principles:** cards with icons — Transparency, Decentralization, Direct Democracy, Sustainability.
- **How it works:** illustrations with hexagons/neural connections.
- **Trust Dashboard:** live metrics of DAO votes, audit logs, transaction trajectory.
- **Use cases:** implementation cases.

---

## 7) Accessibility and Quality

- Contrast check for pairs **#00D4FF** ↔ **#0A2540/#001320** and **#FFFFFF** ↔ **#121212/#0A2540** (WCAG AA/AAA for key text).
- Animation optimization: low frequency, disable with `prefers-reduced-motion`.
- Cross-browser testing and Lighthouse/ARIA.

---

## 8) Quick next steps

1) Create 2 logo variants (Mono and Grid) + pictograms 16/24/32 px.  
2) Layout the hero section with a node pattern and CTA.  
3) Prototype "Trust Dashboard": DAO voting activity graph + smart contract audit log.  
4) Conduct a contrast audit of key components. 