import React, { useState, useRef, useEffect, Fragment, createContext, useContext } from "react";

/* ════════════════════════════════════════════════════════
   NABOMBUJ — BOMBÍK BRAND TOKENS
   Cream paper + ink + teal accent + cta orange
   ════════════════════════════════════════════════════════ */
const BOMBIK = {
  // Core
  paper: "#F9F7F2",
  cream: "#F4EEE3",
  ink: "#0F1B1D",
  inkSoft: "#4A5759",
  line: "#D9D0BC",
  lineSoft: "#E8E1CD",
  // Brand
  teal: "#1E938D",
  tealDeep: "#0F6661",
  tealSoft: "#7CB8B4",
  cta: "#E06D1E",
  ctaDeep: "#B5530E",
  // Sémantické
  success: "#2E7D32",
  warning: "#E0A92C",
  danger: "#C0392B",
  info: "#1E938D",
};

/* VSE = legacy mapping. Klíče zachovány (ffu/fmv/fph/fis/nf/fm) — barvy přemappované
   na Bombík-friendly varianty teal + cta + neutrály, aby předměty zůstaly odlišené,
   ale nelámaly Bombík paletu. */
const VSE = {
  primary: BOMBIK.teal,
  primaryLight: BOMBIK.tealSoft,
  primaryDeep: BOMBIK.tealDeep,
  // Per-subject accent (Management→teal, Leadership→cta, atd.)
  ffu: "#1E938D",   // Management — primary teal
  fmv: "#E06D1E",   // Leadership — cta orange
  fph: "#0F6661",   // HR — deep teal
  fis: "#B5530E",   // Marketing+Logistika — deep cta
  nf:  "#4A5759",   // Strategie — ink soft
  fm:  "#7CB8B4",   // Rozhodování — soft teal
  // Sémantické
  success: BOMBIK.success,
  warning: BOMBIK.warning,
  danger: BOMBIK.danger,
  info: BOMBIK.teal,
};

/* Theme tokens — light = cream paper, dark = ink + paper text + teal accent */
const THEMES = {
  light: {
    bg: BOMBIK.paper,
    bgDeep: BOMBIK.cream,
    surface: BOMBIK.paper,
    surfaceSolid: "#FFFFFF",
    surfaceHover: BOMBIK.cream,
    surfaceMuted: BOMBIK.cream,
    border: BOMBIK.line,
    borderSoft: BOMBIK.lineSoft,
    borderStrong: "#B8AE94",
    text: BOMBIK.ink,
    textMuted: BOMBIK.inkSoft,
    textSubtle: "#7A8487",
    accent: BOMBIK.teal,
    accentDeep: BOMBIK.tealDeep,
    cta: BOMBIK.cta,
    ctaDeep: BOMBIK.ctaDeep,
    shadow: "0 1px 2px rgba(15,27,29,0.04), 0 4px 12px rgba(15,27,29,0.04)",
    shadowStrong: "0 4px 16px rgba(15,27,29,0.08), 0 12px 32px rgba(15,27,29,0.06)",
    isDark: false,
  },
  dark: {
    bg: BOMBIK.ink,
    bgDeep: "#0A1314",
    surface: "#162426",
    surfaceSolid: "#1A292B",
    surfaceHover: "#1E2F31",
    surfaceMuted: "#1A292B",
    border: "rgba(249,247,242,0.10)",
    borderSoft: "rgba(249,247,242,0.06)",
    borderStrong: "rgba(249,247,242,0.18)",
    text: BOMBIK.paper,
    textMuted: "rgba(249,247,242,0.65)",
    textSubtle: "rgba(249,247,242,0.45)",
    accent: BOMBIK.tealSoft,
    accentDeep: BOMBIK.teal,
    cta: BOMBIK.cta,
    ctaDeep: "#F08A4A",
    shadow: "0 2px 8px rgba(0,0,0,0.35)",
    shadowStrong: "0 8px 32px rgba(0,0,0,0.5)",
    isDark: true,
  },
};

const ThemeCtx = createContext(THEMES.light);
const useTheme = () => useContext(ThemeCtx);

/* Bombík typografie — Inter Tight (display+sans) + Geist (italic accent) + Geist Mono */
const fontDisplay = "'Inter Tight', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
const fontSans = "'Inter Tight', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
const fontItalic = "'Geist', sans-serif";
const fontMono = "'Geist Mono', 'JetBrains Mono', 'SF Mono', Menlo, monospace";

/* Spacing scale (Bombík tokens) */
const SPACE = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48, hero: 64 };
const RADIUS = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 };

/* Card surface — flat paper, no glass */
const cardStyle = (t, variant = "default") => {
  const base = {
    background: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: RADIUS.lg,
    boxShadow: t.shadow,
  };
  if (variant === "ink") return { ...base, background: t.isDark ? "#0A1314" : BOMBIK.ink, color: BOMBIK.paper, borderColor: t.isDark ? "rgba(249,247,242,0.08)" : BOMBIK.ink };
  if (variant === "cream") return { ...base, background: t.bgDeep };
  if (variant === "muted") return { ...base, background: t.surfaceMuted, borderColor: t.borderSoft };
  return base;
};

/* GlassBox — kept as named alias for backwards compat. Rendered as flat Card. */
function GlassBox({ children, style, opacity = 0.5, variant = "default" }) {
  const t = useTheme();
  return <div style={{ ...cardStyle(t, variant), ...style }}>{children}</div>;
}
const glass = cardStyle; // legacy alias used in some inline calls

// Icon component — paste at top of statnice-hub-vse.jsx after constants

/* ════════════════════════════════════════════════════════
   BOMBÍK — maskot (kresleny portrét, malinois v "Nabombuj" vestě)
   ════════════════════════════════════════════════════════ */

function Bombik({ mood = "happy", size = 120, style = {} }) {
  // Mapování nálad na asset + drobnou transformaci.
  // mood: "happy" | "think" | "sad" | "ready"
  const config = {
    happy:  { src: "/assets/bombik-hero.png",     transform: "none",                 filter: "none" },
    think:  { src: "/assets/bombik-hero.png",     transform: "rotate(-4deg)",        filter: "none" },
    sad:    { src: "/assets/bombik-headshot.png", transform: "rotate(3deg)",         filter: "saturate(0.7) brightness(0.97)" },
    ready:  { src: "/assets/bombik-headshot.png", transform: "none",                 filter: "none" },
  }[mood] || { src: "/assets/bombik-hero.png", transform: "none", filter: "none" };

  return (
    <img
      src={config.src}
      alt={`Bombík (${mood})`}
      width={size}
      height={size}
      draggable={false}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        userSelect: "none",
        transform: config.transform,
        filter: config.filter,
        display: "block",
        ...style,
      }}
    />
  );
}

function BombikEmpty({ mood = "think", size = 120, caption = "Nic tu zatím není.", sub = "" }) {
  const t = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, maxWidth: 480, margin: "0 auto" }}>
      <Bombik mood={mood} size={size} />
      <div>
        <div style={{ fontSize: 18, fontFamily: fontSans, fontWeight: 600, color: t.text, letterSpacing: "-0.015em", marginBottom: sub ? 8 : 0, textWrap: "balance" }}>{caption}</div>
        {sub && (
          <div style={{ fontSize: 14, color: t.textMuted, fontFamily: fontSans, lineHeight: 1.55, textWrap: "pretty" }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

function Icon({ name, size = 20, color = "currentColor", style = {} }) {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style };
  const svgProps = { viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", style: s };

  const icons = {
    // ── SUBJECTS ──
    building: ( // Management 🏢
      <svg {...svgProps}>
        <rect x="3" y="7" width="18" height="14" rx="1.5"/><path d="M3 11h18"/><path d="M7 7V4h10v3"/><path d="M7 15h2m6 0h2"/><path d="M7 18h2m6 0h2"/>
      </svg>
    ),
    crown: ( // Leadership 👑
      <svg {...svgProps}>
        <path d="M3 18h18l-2-10-4 4-3-6-3 6-4-4-2 10z"/><path d="M3 18c0 1 1 2 2 2h14c1 0 2-1 2-2"/>
      </svg>
    ),
    people: ( // HR 👥
      <svg {...svgProps}>
        <circle cx="9" cy="7" r="3"/><circle cx="17" cy="8" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M15 13c2 0 4 1.5 4 4"/>
      </svg>
    ),
    chart: ( // Marketing 📊
      <svg {...svgProps}>
        <path d="M4 20h16"/><rect x="5" y="12" width="3" height="8" rx="0.5"/><rect x="10.5" y="6" width="3" height="14" rx="0.5"/><rect x="16" y="9" width="3" height="11" rx="0.5"/>
      </svg>
    ),
    target: ( // Strategie 🎯
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill={color}/>
      </svg>
    ),
    compass: ( // Manažerské rozhodování 🧭
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="9"/><polygon points="12,3 13.5,10.5 12,12 10.5,10.5" fill={color} stroke="none"/><polygon points="12,21 10.5,13.5 12,12 13.5,13.5" fill={`${color}40`} stroke="none"/><path d="M12 3v1m0 16v1m8-9h1M3 12h1"/>
      </svg>
    ),
    lightbulb: ( // Inovace 💡
      <svg {...svgProps}>
        <path d="M9 21h6"/><path d="M10 18h4"/><path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/>
      </svg>
    ),
    coins: ( // Finance 💰
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="9"/><path d="M12 6v12"/><path d="M15 9.5c0-1.5-1.3-2.5-3-2.5s-3 1-3 2.5 1.3 2.5 3 2.5 3 1 3 2.5-1.3 2.5-3 2.5"/>
      </svg>
    ),
    // ── STUDY SECTIONS ──
    refresh: ( // Koordinace 🔄
      <svg {...svgProps}>
        <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.5 9A9 9 0 005.6 5.6L1 10"/><path d="M3.5 15a9 9 0 0014.9 3.4L23 14"/>
      </svg>
    ),
    pillar: ( // Hierarchie/Byrokracie 🏛️
      <svg {...svgProps}>
        <path d="M3 21h18"/><path d="M5 21V8"/><path d="M9 21V8"/><path d="M15 21V8"/><path d="M19 21V8"/><path d="M3 8l9-5 9 5"/>
      </svg>
    ),
    hive: ( // Emergence 🐝
      <svg {...svgProps}>
        <path d="M12 2l5 3v6l-5 3-5-3V5z"/><path d="M7 8l-5 3v6l5 3"/><path d="M17 8l5 3v6l-5 3"/>
      </svg>
    ),
    scale: ( // Hybridní modely / Rozhodování ⚖️
      <svg {...svgProps}>
        <path d="M12 3v18"/><path d="M4 7l8-4 8 4"/><path d="M2 12l4-5 4 5"/><path d="M14 12l4-5 4 5"/><circle cx="4" cy="13" r="2" fill="none"/><circle cx="20" cy="13" r="2" fill="none"/>
      </svg>
    ),
    graduation: ( // Tažené otázky 🎓
      <svg {...svgProps}>
        <path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/><path d="M22 10v6"/>
      </svg>
    ),
    bolt: ( // Distribuce moci ⚡
      <svg {...svgProps}>
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill={`${color}20`} stroke={color}/>
      </svg>
    ),
    dna: ( // Org. struktury 🧬
      <svg {...svgProps}>
        <path d="M4 4c4 4 12 4 16 0"/><path d="M4 12c4 4 12 4 16 0"/><path d="M4 20c4 4 12 4 16 0"/><path d="M8 2v20"/><path d="M16 2v20"/>
      </svg>
    ),
    brain: ( // Collective Wisdom 🧠
      <svg {...svgProps}>
        <path d="M12 2C8 2 5 4.5 5 8c0 2 1 3.5 2 4.5V20h10v-7.5c1-1 2-2.5 2-4.5 0-3.5-3-6-7-6z"/><path d="M12 2v18"/><path d="M7 9h4m2 0h4"/><path d="M8 13h3m2 0h3"/>
      </svg>
    ),
    // ── FRENCH-RAVEN ──
    scroll: ( // Legitimní 📜
      <svg {...svgProps}>
        <path d="M5 3h12a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5"/><path d="M5 5a2 2 0 012-2h12"/><path d="M9 9h6m-6 4h4"/>
      </svg>
    ),
    hammer: ( // Donucovací 🔨
      <svg {...svgProps}>
        <path d="M15 12l-8.5 8.5a1.5 1.5 0 01-2-2L13 10"/><path d="M17.6 6.4a4 4 0 00-5.6 0L10 8.4l5.6 5.6 2-2a4 4 0 000-5.6z"/>
      </svg>
    ),
    gift: ( // Odměňovací 🎁
      <svg {...svgProps}>
        <rect x="3" y="10" width="18" height="11" rx="1.5"/><path d="M3 14h18"/><path d="M12 10v11"/><path d="M12 10c-2-3-6-3-6 0h6"/><path d="M12 10c2-3 6-3 6 0h-6"/>
      </svg>
    ),
    star: ( // Referenční ✨
      <svg {...svgProps}>
        <path d="M12 2l3 6.3 7 1-5 4.9L18.2 21 12 17.8 5.8 21 7 14.2 2 9.3l7-1z" fill={`${color}15`}/>
      </svg>
    ),
    // ── ORG STRUCTURES ──
    blob: ( // Améby 🦠
      <svg {...svgProps}>
        <ellipse cx="8" cy="10" rx="5" ry="4" /><ellipse cx="17" cy="8" rx="4" ry="3.5" /><ellipse cx="15" cy="16" rx="5" ry="4" /><circle cx="7" cy="10" r="1" fill={color}/><circle cx="17" cy="8" r="1" fill={color}/><circle cx="15" cy="16" r="1" fill={color}/>
      </svg>
    ),
    circles: ( // Holokracie ⭕
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="3" r="1.5" fill={color}/><circle cx="12" cy="21" r="1.5" fill={color}/><circle cx="3" cy="12" r="1.5" fill={color}/><circle cx="21" cy="12" r="1.5" fill={color}/>
      </svg>
    ),
    noodles: ( // Špagety 🍝
      <svg {...svgProps}>
        <path d="M4 6c4 6 8-2 12 4"/><path d="M3 12c5 5 9-3 14 2"/><path d="M4 18c4-4 8 4 12-2"/><circle cx="6" cy="8" r="1.5" fill={color}/><circle cx="14" cy="14" r="1.5" fill={color}/>
      </svg>
    ),
    microscope: ( // Adhokracie 🔬
      <svg {...svgProps}>
        <circle cx="14" cy="6" r="4"/><path d="M14 10v4"/><path d="M10 18h8"/><path d="M14 14v4"/><path d="M8 21h12"/>
      </svg>
    ),
    globe: ( // Network 🌐
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="9"/><path d="M12 3c-3 3-3 15 0 18"/><path d="M12 3c3 3 3 15 0 18"/><path d="M3 12h18"/><path d="M4 7.5h16"/><path d="M4 16.5h16"/>
      </svg>
    ),
    // ── RESULTS ──
    trophy: ( // 🎉
      <svg {...svgProps}>
        <path d="M6 9a6 6 0 0012 0V4H6v5z"/><path d="M6 5H3v3a3 3 0 003 3"/><path d="M18 5h3v3a3 3 0 01-3 3"/><path d="M12 15v3"/><path d="M8 21h8"/><path d="M8 21v-3h8v3"/>
      </svg>
    ),
    muscle: ( // 💪
      <svg {...svgProps}>
        <path d="M7 11c-1-3 1-7 5-7 3 0 5 3 5 6"/><path d="M12 4c2-2 6-1 7 2s0 5-2 6"/><path d="M17 12c2 1 3 3 2 5s-3 3-5 2"/><path d="M14 19c0 2-2 3-4 2s-3-3-2-5"/>
      </svg>
    ),
    book: ( // 📚
      <svg {...svgProps}>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/>
      </svg>
    ),
    construction: ( // 🚧
      <svg {...svgProps}>
        <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/><path d="M3 7l9-4 9 4"/>
      </svg>
    ),
    chili: ( // 🌶️
      <svg {...svgProps} viewBox="0 0 16 16" style={{ ...s, width: size * 0.7, height: size * 0.7 }}>
        <path d="M8 1c0 2-3 2-3 4" strokeWidth="1.5"/><path d="M5 5c-3 2-4 7-1 10 2 2 5 1 7-1s3-6 1-9c-1 0-2 1-2 2" fill={`${color}25`} strokeWidth="1.5"/>
      </svg>
    ),
    map: ( // 🗺️ Lokalizace
      <svg {...svgProps}>
        <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z"/><path d="M9 3v15"/><path d="M15 6v15"/>
      </svg>
    ),
  };

  return icons[name] || <span style={s}>{name}</span>;
}



/* ════════════════════════════════════════════════════════
   SUBJECTS DATA
   ════════════════════════════════════════════════════════ */
const SUBJECTS = [
  {
    id: "mng", name: "Management", color: VSE.ffu, icon: "building",
    okruhy: [
      { n: 1, title: "Současné přístupy, BM × MM, inovace managementu", status: "done", difficulty: 2 },
      { n: 2, title: "Výzvy 21. století, paradigmata (Birkinshaw)", status: "done", difficulty: 2 },
      { n: 3, title: "Koordinování (byrokracie × emergence)", status: "done", difficulty: 2 },
      { n: 4, title: "Rozhodování (hierarchie × collective wisdom) + distribuce moci", status: "done", difficulty: 3 },
      { n: 5, title: "Plánování (alignment × obliquity)", status: "done", difficulty: 2 },
      { n: 6, title: "Modely a systémy řízení, měkké × tvrdé prvky", status: "done", difficulty: 3 },
      { n: 7, title: "Performance Management", status: "done", difficulty: 2 },
      { n: 8, title: "Change management (Kotter, Lewin, U-křivka)", status: "done", difficulty: 3 },
      { n: 9, title: "Trendy v managementu, Birkinshaw modely", status: "done", difficulty: 3 },
      { n: 10, title: "Globální a lokální řízení firmy", status: "done", difficulty: 2 },
      { n: 11, title: "Etika v managementu, CSR/ESG", status: "done", difficulty: 2 },
    ],
  },
  {
    id: "lead", name: "Leadership", color: VSE.fmv, icon: "crown",
    okruhy: [
      { n: 1, title: "Kompetence leadera, metody rozvoje", status: "todo", difficulty: 2 },
      { n: 2, title: "Styly leadershipu", status: "todo", difficulty: 2 },
      { n: 3, title: "Kreativní klima v organizaci", status: "todo", difficulty: 2 },
      { n: 4, title: "Teorie motivace, ovlivňování", status: "todo", difficulty: 3 },
      { n: 5, title: "Moc, distribuce moci, zdroje moci", status: "todo", difficulty: 2 },
      { n: 6, title: "Team excellence (Larson, LaFasto)", status: "todo", difficulty: 2 },
    ],
  },
  {
    id: "hr", name: "Personální řízení", color: VSE.fph, icon: "people",
    okruhy: [
      { n: 1, title: "Strategie, struktura, kultura × motivace", status: "todo", difficulty: 3 },
      { n: 2, title: "Motivace, odměňování zaměstnanců", status: "todo", difficulty: 2 },
      { n: 3, title: "HR globální × lokální, expatrianti", status: "todo", difficulty: 2 },
      { n: 4, title: "Diverzita a její řízení", status: "todo", difficulty: 2 },
      { n: 5, title: "Talent management, rozvoj zaměstnanců", status: "todo", difficulty: 2 },
      { n: 6, title: "Nové trendy v HR a strategie HR", status: "todo", difficulty: 2 },
      { n: 7, title: "Intelektuální kapitál", status: "todo", difficulty: 2 },
    ],
  },
  {
    id: "mkt", name: "Marketing + Logistika", color: VSE.fis, icon: "chart",
    okruhy: [
      { n: 1, title: "Segmentace, typy, kritéria", status: "todo", difficulty: 2 },
      { n: 2, title: "Positioning, POP, POD, referenční rámec", status: "todo", difficulty: 2 },
      { n: 3, title: "Výrobek, charakteristiky, výrobková řada", status: "todo", difficulty: 2 },
      { n: 4, title: "Cenotvorba, cenové strategie, diskriminace", status: "todo", difficulty: 2 },
      { n: 5, title: "Distribuce, distribuční kanály, logistické řetězce", status: "todo", difficulty: 2 },
      { n: 6, title: "Integrovaná marketingová komunikace", status: "todo", difficulty: 2 },
      { n: 7, title: "Hromadná marketingová komunikace (reklama, PR)", status: "todo", difficulty: 2 },
      { n: 8, title: "Osobní marketing, direct marketing", status: "todo", difficulty: 2 },
      { n: 9, title: "Branding, modely hodnoty značky", status: "todo", difficulty: 2 },
      { n: 10, title: "Marketingový výzkum, analytické metody", status: "todo", difficulty: 3 },
      { n: 11, title: "Cenový výzkum, cenové testy", status: "todo", difficulty: 2 },
      { n: 12, title: "Produktový výzkum, uvedení na trh", status: "todo", difficulty: 2 },
      { n: 13, title: "Mediální výzkum, měření reklamy", status: "todo", difficulty: 2 },
      { n: 14, title: "Výzkum marketingové komunikace", status: "todo", difficulty: 2 },
      { n: 15, title: "Marketing služeb, kvalita, outsourcing v log.", status: "todo", difficulty: 2 },
      { n: 16, title: "MIS a pohyb informací v logistice", status: "todo", difficulty: 2 },
      { n: 17, title: "Řízení marketingových kampaní", status: "todo", difficulty: 2 },
      { n: 18, title: "Hodnota značky, prvky, strategie", status: "todo", difficulty: 2 },
      { n: 19, title: "Konkurenční strategie a logistický systém", status: "todo", difficulty: 3 },
    ],
  },
  {
    id: "str", name: "Strategie", color: VSE.nf, icon: "target",
    okruhy: [
      { n: 1, title: "Strategické uvažování — intuitivní × logické", status: "todo", difficulty: 3 },
      { n: 2, title: "Zisk × CSR, shareholder × stakeholder", status: "todo", difficulty: 2 },
      { n: 3, title: "Tržní × zdrojový přístup volby strategie", status: "todo", difficulty: 2 },
      { n: 4, title: "Integrace × samostatnost (SBU)", status: "todo", difficulty: 2 },
      { n: 5, title: "Kooperace × konkurence", status: "todo", difficulty: 2 },
      { n: 6, title: "Proces strategie, Mintzberg 5P", status: "todo", difficulty: 3 },
      { n: 7, title: "Strategická změna, evoluce × revoluce", status: "todo", difficulty: 2 },
      { n: 8, title: "Strategie inovací, exploitation × exploration", status: "todo", difficulty: 2 },
      { n: 9, title: "Kontextový rozměr strategie", status: "todo", difficulty: 3 },
    ],
  },
  {
    id: "roz", name: "Manažerské rozhodování", color: VSE.fm, icon: "compass",
    okruhy: [
      { n: 1, title: "Rozhodovací problém, Kepner-Tregoe", status: "todo", difficulty: 3 },
      { n: 2, title: "Cíle, stakeholdery, kritéria, varianty", status: "todo", difficulty: 2 },
      { n: 3, title: "Rizika, závažnost, opatření, MEAT", status: "todo", difficulty: 3 },
      { n: 4, title: "Metody rozhodování (Monte Carlo, strom, scénáře)", status: "todo", difficulty: 3 },
      { n: 5, title: "Postaudit, vyhodnocení rozhodnutí", status: "todo", difficulty: 2 },
    ],
  },
  {
    id: "inov", name: "Inovace", color: VSE.primary, icon: "lightbulb",
    okruhy: [
      { n: 1, title: "Definice inovace dle Schumpetera, typy", status: "todo", difficulty: 2 },
      { n: 2, title: "Zdroje inovací dle Druckera", status: "todo", difficulty: 2 },
      { n: 3, title: "Inovační modely — lineární × nelineární", status: "todo", difficulty: 3 },
      { n: 4, title: "Inovační techniky, Design Thinking", status: "todo", difficulty: 2 },
      { n: 5, title: "Stage Gate Control Process (SGCP)", status: "todo", difficulty: 3 },
      { n: 6, title: "Lean Canvas, Business Model Canvas, Gassmann", status: "todo", difficulty: 2 },
      { n: 7, title: "Financování inovací, bariéry, VC × PE", status: "todo", difficulty: 3 },
      { n: 8, title: "Inovační podnikání, determinanty", status: "todo", difficulty: 2 },
    ],
  },
  {
    id: "fin", name: "Finance", color: VSE.danger, icon: "coins",
    okruhy: [
      { n: 1, title: "Finanční analýza, ukazatele výkonnosti", status: "todo", difficulty: 3 },
      { n: 2, title: "Bankrotní modely", status: "todo", difficulty: 2 },
      { n: 3, title: "Pracovní kapitál, ČPK, optimální výše", status: "todo", difficulty: 3 },
      { n: 4, title: "Kapitálová struktura, WACC", status: "todo", difficulty: 3 },
      { n: 5, title: "Časová hodnota peněz, hodnocení investic", status: "todo", difficulty: 3 },
      { n: 6, title: "Řízení rizika, finanční deriváty", status: "todo", difficulty: 3 },
      { n: 7, title: "Krize a úpadek podniku, řešení úpadku", status: "todo", difficulty: 3 },
    ],
  },
];

const TOTAL = SUBJECTS.reduce((s, sub) => s + sub.okruhy.length, 0);
const DONE = SUBJECTS.reduce((s, sub) => s + sub.okruhy.filter(o => o.status === "done").length, 0);

/* ════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════ */
function Def({ children, color }) {
  const t = useTheme();
  const c = color || t.accent;
  return <div style={{ background: t.surfaceMuted, border: `1px solid ${t.borderSoft}`, borderLeft: `3px solid ${c}`, borderRadius: RADIUS.md, padding: "14px 16px", marginBottom: 12, fontSize: 14, color: t.text, lineHeight: 1.6, fontFamily: fontSans }}>{children}</div>;
}
function Tag({ children, color }) {
  const t = useTheme();
  return <div style={{ fontSize: 10.5, fontWeight: 600, color: color || t.textMuted, fontFamily: fontMono, textTransform: "uppercase", letterSpacing: "1.6px", marginTop: 14, marginBottom: 6 }}>{children}</div>;
}
function Bullet({ items, color }) {
  const t = useTheme();
  const c = color || t.accent;
  return <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>{items.map((item, i) => (
    <div key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: t.text, lineHeight: 1.55, fontFamily: fontSans }}>
      <span style={{ color: c, flexShrink: 0, fontFamily: fontMono }}>›</span><span>{item}</span>
    </div>
  ))}</div>;
}
function PlusMinus({ type, items }) {
  const t = useTheme();
  const isP = type === "plus"; const col = isP ? VSE.success : VSE.danger;
  return (
    <div style={{ background: t.surfaceMuted, border: `1px solid ${t.borderSoft}`, borderLeft: `3px solid ${col}`, borderRadius: RADIUS.md, padding: 14 }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: col, fontFamily: fontMono, marginBottom: 8, letterSpacing: "1.6px", textTransform: "uppercase" }}>{isP ? "Ano · plusy" : "Ne · mínusy"}</div>
      {items.map((it, i) => <div key={i} style={{ fontSize: 13, color: t.text, lineHeight: 1.5, fontFamily: fontSans, marginBottom: 4, paddingLeft: 12, borderLeft: `1px solid ${t.borderSoft}` }}>{it}</div>)}
    </div>
  );
}
function ModelCard({ name, color, items }) {
  const t = useTheme();
  const c = color || t.accent;
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.borderSoft}`, borderRadius: RADIUS.md, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: 99, background: c }} />
        <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text, fontFamily: fontSans, letterSpacing: "-0.01em" }}>{name}</div>
      </div>
      {items.map((it, i) => <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: t.textMuted, lineHeight: 1.55, fontFamily: fontSans, marginBottom: 3 }}><span style={{ color: c, flexShrink: 0 }}>–</span><span>{it}</span></div>)}
    </div>
  );
}
function ExamQ({ komise, otazka, pozn }) {
  const t = useTheme();
  return (
    <div style={{ background: t.surfaceMuted, border: `1px solid ${t.borderSoft}`, borderRadius: RADIUS.md, padding: "14px 16px", marginBottom: 8, marginTop: 4 }}>
      <div style={{ fontSize: 10.5, color: t.textSubtle, fontFamily: fontMono, marginBottom: 6, letterSpacing: "1.6px", textTransform: "uppercase", fontWeight: 600 }}>{komise}</div>
      <div style={{ fontSize: 14, color: t.text, fontWeight: 500, fontFamily: fontSans, marginBottom: 6, lineHeight: 1.45 }}>„{otazka}”</div>
      <div style={{ fontSize: 12.5, color: t.cta, fontFamily: fontItalic, fontStyle: "italic" }}>→ {pozn}</div>
    </div>
  );
}

function Difficulty({ sloz, roz, freq }) {
  const t = useTheme();
  const P = ({ f, col }) => <span style={{ width: 6, height: 6, borderRadius: 99, background: f ? col : t.borderSoft, display: "inline-block" }} />;
  const items = [
    { lbl: "Složitost", val: sloz, col: sloz === 3 ? t.cta : sloz === 2 ? VSE.warning : t.accent },
    { lbl: "Rozsah", val: roz, col: roz === 3 ? t.cta : roz === 2 ? VSE.warning : t.accent },
    { lbl: "Frekvence", val: freq, col: freq === 3 ? t.cta : freq === 2 ? VSE.warning : t.accent },
  ];
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", padding: "10px 0", flexWrap: "wrap" }}>
      {items.map((x, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: t.surface, border: `1px solid ${t.borderSoft}`, borderRadius: RADIUS.pill, padding: "7px 14px" }}>
          <span style={{ fontSize: 10.5, color: t.textMuted, fontFamily: fontMono, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.4px" }}>{x.lbl}</span>
          <div style={{ display: "flex", gap: 3 }}>{[1,2,3].map(i => <P key={i} f={i <= x.val} col={x.col} />)}</div>
        </div>
      ))}
    </div>
  );
}

function ChecklistGeneric({ items }) {
  const t = useTheme();
  const [checked, setChecked] = useState(new Set());
  const toggle = (id) => setChecked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const pct = Math.round((checked.size / items.length) * 100);
  return (
    <div style={{ ...cardStyle(t), padding: 20, marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase" }}>Checklist přípravy</span>
        <span style={{ fontSize: 13, fontFamily: fontMono, color: pct === 100 ? VSE.success : t.accent, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: t.borderSoft, borderRadius: 99, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? VSE.success : t.accent, borderRadius: 99, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      {items.map((it) => (
        <div key={it.id} onClick={() => toggle(it.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 10px", borderRadius: RADIUS.sm, cursor: "pointer", marginBottom: 2, background: checked.has(it.id) ? t.surfaceMuted : "transparent", transition: "background 0.2s" }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${checked.has(it.id) ? VSE.success : t.borderStrong}`, background: checked.has(it.id) ? VSE.success : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: "#fff", transition: "all 0.2s" }}>
            {checked.has(it.id) && "✓"}
          </div>
          <span style={{ fontSize: 14, fontFamily: fontSans, color: checked.has(it.id) ? t.textMuted : t.text, textDecoration: checked.has(it.id) ? "line-through" : "none", transition: "all 0.2s" }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function Section({ s, isOpen, onToggle, subjectId, okruhN, subjectLabel }) {
  const t = useTheme();
  const showWatch = subjectId && okruhN;
  const accent = s.color || t.accent;
  return (
    <div style={{ marginBottom: 4 }}>
      <div onClick={onToggle} style={{
        background: isOpen ? t.surface : t.surface,
        border: `1px solid ${isOpen ? t.borderStrong : t.borderSoft}`,
        borderRadius: RADIUS.lg, padding: isOpen ? "20px 22px" : "14px 18px",
        cursor: "pointer", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: isOpen ? t.shadow : "none",
        position: "relative", overflow: "hidden",
      }}>
        {isOpen && <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: accent }} />}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
            <Icon name={s.emoji} size={20} color={isOpen ? accent : t.textMuted} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text, fontFamily: fontSans, letterSpacing: "-0.015em" }}>{s.title}</div>
              {s.subtitle && <div style={{ fontSize: 12.5, color: t.textMuted, fontFamily: fontSans, marginTop: 3 }}>{s.subtitle}</div>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {showWatch && isOpen && <WatchToggleButton subjectId={subjectId} okruhN={okruhN} sectionId={s.id} sectionTitle={s.title} subjectLabel={subjectLabel} />}
            <span style={{ color: t.textMuted, fontSize: 12, fontFamily: fontMono, transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
          </div>
        </div>
        {isOpen && <div style={{ marginTop: 18 }}>{s.content}</div>}
      </div>
    </div>
  );
}

function FlashcardsTab({ data }) {
  const t = useTheme();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // Klíč pro localStorage = hash z první otázky (krátký a stabilní)
  const storageKey = `nabombuj_flashcards_${(data[0]?.term || "").substring(0, 30).replace(/\s/g, "_")}`;
  const [known, setKnown] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const card = data[idx];
  const mark = (know) => {
    setKnown(p => {
      const n = new Set(p);
      if (know) n.add(idx);
      else n.delete(idx);
      try { localStorage.setItem(storageKey, JSON.stringify(Array.from(n))); } catch {}
      return n;
    });
    setFlipped(false);
    setIdx((idx + 1) % data.length);
    // Streak activity
    try { recordActivity(); window.dispatchEvent(new Event("streak-updated")); } catch {}
  };
  const resetProgress = () => {
    setKnown(new Set());
    setIdx(0);
    setFlipped(false);
    try { localStorage.removeItem(storageKey); } catch {}
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontFamily: fontMono, color: t.textMuted }}>{idx + 1}/{data.length}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, fontFamily: fontMono, color: VSE.success, fontWeight: 700 }}>Umím: {known.size}/{data.length}</span>
          {known.size > 0 && (
            <button onClick={resetProgress} title="Resetovat pokrok kartiček" style={{
              padding: "4px 10px", borderRadius: 8, border: `1px solid ${t.border}`,
              background: "transparent", color: t.textMuted, cursor: "pointer",
              fontSize: 10.5, fontFamily: fontMono, letterSpacing: "0.5px",
            }}>↻ RESET</button>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
        {data.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i === idx ? t.accent : known.has(i) ? VSE.success : t.borderSoft, transition: "background 0.3s" }} />)}
      </div>
      <div onClick={() => setFlipped(!flipped)} style={{
        ...cardStyle(t),
        minHeight: 240, padding: 36,
        cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, marginBottom: 14, letterSpacing: "1.6px", fontWeight: 600, textTransform: "uppercase" }}>{card.tag}</div>
        {!flipped ? (
          <><div style={{ fontSize: 28, fontWeight: 500, color: t.text, fontFamily: fontSans, marginBottom: 16, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{card.term}</div>
          <div style={{ fontSize: 12, color: t.textMuted, fontFamily: fontMono, letterSpacing: "1.2px", textTransform: "uppercase" }}>klikni pro odpověď</div></>
        ) : (
          <><div style={{ fontSize: 14, fontWeight: 600, color: t.accent, fontFamily: fontSans, marginBottom: 12, letterSpacing: "-0.01em" }}>{card.term}</div>
          <div style={{ fontSize: 15, color: t.text, fontFamily: fontSans, lineHeight: 1.65, textWrap: "pretty" }}>{card.def}</div></>
        )}
      </div>
      {flipped && (
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={() => mark(false)} style={{ flex: 1, padding: 14, borderRadius: RADIUS.md, border: `1px solid ${t.border}`, background: t.surface, color: t.textMuted, fontSize: 13.5, fontWeight: 500, fontFamily: fontSans, cursor: "pointer", transition: "all 0.2s" }}>Neumím</button>
          <button onClick={() => mark(true)} style={{ flex: 1, padding: 14, borderRadius: RADIUS.md, border: `1px solid ${t.accent}`, background: t.accent, color: BOMBIK.paper, fontSize: 13.5, fontWeight: 600, fontFamily: fontSans, cursor: "pointer", transition: "all 0.2s" }}>Umím ✓</button>
        </div>
      )}
    </div>
  );
}

function QuizTab({ data }) {
  const t = useTheme();
  const storageKey = `nabombuj_quiz_${(data[0]?.q || "").substring(0, 30).replace(/\s/g, "_")}`;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const [bestScore, setBestScore] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const handleSelect = (i) => {
    if (answers[current] !== undefined) return;
    setSelected(i);
    setAnswers(p => ({ ...p, [current]: i }));
    // Streak activity
    try { recordActivity(); window.dispatchEvent(new Event("streak-updated")); } catch {}
  };
  const next = () => {
    if (current < data.length - 1) { setCurrent(current + 1); setSelected(null); }
    else {
      setShowResult(true);
      // Ulož best score
      const finalScore = Object.entries({ ...answers }).filter(([k, v]) => data[k].correct === v).length;
      if (!bestScore || finalScore > bestScore.score) {
        const newBest = { score: finalScore, total: data.length, date: new Date().toISOString().split("T")[0] };
        setBestScore(newBest);
        try { localStorage.setItem(storageKey, JSON.stringify(newBest)); } catch {}
      }
    }
  };
  const reset = () => { setCurrent(0); setAnswers({}); setShowResult(false); setSelected(null); };
  const score = Object.entries(answers).filter(([k, v]) => data[k].correct === v).length;

  if (showResult) {
    const pct = Math.round((score / data.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <div style={{ marginBottom: 16 }}><Icon name={pct >= 80 ? "trophy" : pct >= 50 ? "muscle" : "book"} size={48} color={pct >= 80 ? VSE.success : pct >= 50 ? t.cta : t.textMuted} /></div>
        <div style={{ fontSize: 56, fontWeight: 600, fontFamily: fontSans, color: t.text, marginBottom: 6, letterSpacing: "-0.03em", lineHeight: 1 }}>{score}<span style={{ color: t.textSubtle, fontWeight: 400 }}>/{data.length}</span></div>
        <div style={{ fontSize: 16, color: t.text, marginBottom: 4, fontStyle: "italic", fontFamily: fontItalic }}>{pct >= 80 ? "Tohle zvládáš." : pct >= 50 ? "Dobrý základ, doplň mezery." : "Projít materiály znovu."}</div>
        <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, marginBottom: 28, letterSpacing: "1.6px", textTransform: "uppercase" }}>{pct}% správně</div>
        <div style={{ textAlign: "left", marginBottom: 20 }}>
          {data.map((q, i) => {
            const isCorrect = answers[i] === q.correct;
            return (
              <div key={i} style={{ padding: "12px 14px", marginBottom: 6, borderRadius: RADIUS.sm, background: t.surfaceMuted, border: `1px solid ${t.borderSoft}`, borderLeft: `3px solid ${isCorrect ? VSE.success : t.cta}` }}>
                <div style={{ fontSize: 13, color: t.text, fontFamily: fontSans, lineHeight: 1.45 }}>{i + 1}. {q.q}</div>
                {!isCorrect && <div style={{ fontSize: 12.5, color: VSE.success, fontFamily: fontSans, marginTop: 4, fontWeight: 500 }}>Správně: {q.opts[q.correct]}</div>}
              </div>
            );
          })}
        </div>
        <button onClick={reset} style={{ padding: "12px 28px", borderRadius: RADIUS.pill, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13.5, fontWeight: 500, fontFamily: fontSans, cursor: "pointer" }}>Zkusit znovu</button>
      </div>
    );
  }

  const q = data[current];
  const answered = answers[current] !== undefined;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
        <span style={{ fontSize: 12, fontFamily: fontMono, color: t.textMuted }}>Otázka {current + 1}/{data.length}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {bestScore && (
            <span style={{ fontSize: 11, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}30` }}>
              ★ {bestScore.score}/{bestScore.total}
            </span>
          )}
          <span style={{ fontSize: 12, fontFamily: fontMono, color: VSE.success, fontWeight: 700 }}>{score} správně</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 3, marginBottom: 22 }}>
        {data.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i === current ? t.accent : answers[i] !== undefined ? (data[i].correct === answers[i] ? VSE.success : t.cta) : t.borderSoft }} />)}
      </div>
      <div style={{ fontSize: 19, fontWeight: 500, color: t.text, fontFamily: fontSans, lineHeight: 1.4, marginBottom: 22, letterSpacing: "-0.02em", textWrap: "pretty" }}>{q.q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.opts.map((opt, i) => {
          let bg = t.surface; let border = t.borderSoft; let tc = t.text;
          if (answered) {
            if (i === q.correct) { bg = t.surfaceMuted; border = VSE.success; tc = t.text; }
            else if (i === answers[current] && i !== q.correct) { bg = t.surfaceMuted; border = t.cta; tc = t.cta; }
            else { tc = t.textMuted; }
          } else if (selected === i) { bg = t.surfaceMuted; border = t.accent; }
          return (
            <div key={i} onClick={() => handleSelect(i)} style={{
              padding: "14px 16px", borderRadius: RADIUS.md, border: `1.5px solid ${border}`,
              background: bg,
              cursor: answered ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${answered ? (i === q.correct ? VSE.success : i === answers[current] ? t.cta : t.borderSoft) : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11.5, fontWeight: 600, color: answered && i === q.correct ? BOMBIK.paper : tc, fontFamily: fontMono, background: answered && i === q.correct ? VSE.success : "transparent" }}>
                {answered ? (i === q.correct ? "✓" : i === answers[current] ? "✗" : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
              </div>
              <span style={{ fontSize: 14.5, color: tc, fontFamily: fontSans, textWrap: "pretty" }}>{opt}</span>
            </div>
          );
        })}
      </div>
      {answered && (
        <button onClick={next} style={{ marginTop: 18, width: "100%", padding: 14, borderRadius: RADIUS.md, border: "none", background: t.text, color: t.bg, fontSize: 14, fontWeight: 600, fontFamily: fontSans, cursor: "pointer", letterSpacing: "-0.01em" }}>
          {current < data.length - 1 ? "Další otázka →" : "Zobrazit výsledek"}
        </button>
      )}
    </div>
  );
}

function OrgSvg({ type, color }) {
  const c = color || VSE.primary;
  if (type === "ameby") return (
    <svg viewBox="0 0 100 60" style={{ width: 80, height: 48 }}>
      <ellipse cx="25" cy="28" rx="18" ry="14" fill={`${c}25`} stroke={c} strokeWidth="1"><animate attributeName="rx" values="18;21;18" dur="3s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="65" cy="22" rx="14" ry="12" fill={`${c}20`} stroke={c} strokeWidth="1"><animate attributeName="ry" values="12;15;12" dur="2.5s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="75" cy="42" rx="16" ry="12" fill={`${c}18`} stroke={c} strokeWidth="1"/>
      {[[18,24],[32,32],[58,18],[72,26],[68,40],[82,44]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="2.5" fill={c} opacity=".7"/>)}
    </svg>);
  if (type === "holo") return (
    <svg viewBox="0 0 100 60" style={{ width: 80, height: 48 }}>
      <circle cx="50" cy="30" r="22" fill="none" stroke={`${c}40`} strokeWidth="1" strokeDasharray="3 2"/>
      <circle cx="50" cy="30" r="12" fill="none" stroke={`${c}55`} strokeWidth="1" strokeDasharray="3 2"/>
      {[0,72,144,216,288].map((a,i)=>{const r=22;const rad=a*Math.PI/180;return <circle key={i} cx={50+r*Math.cos(rad)} cy={30+r*Math.sin(rad)} r="3" fill={c} opacity=".8"/>})}
    </svg>);
  if (type === "spag") return (
    <svg viewBox="0 0 100 60" style={{ width: 80, height: 48 }}>
      <path d="M10,15 Q30,50 55,20 Q75,0 95,35" fill="none" stroke={`${c}45`} strokeWidth="1.5"/>
      <path d="M8,40 Q25,10 50,42 Q70,55 95,22" fill="none" stroke={`${c}40`} strokeWidth="1.5"/>
      {[[10,15],[55,20],[95,35],[8,40],[50,42],[95,22]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill={c} opacity=".7"/>)}
    </svg>);
  if (type === "net") return (
    <svg viewBox="0 0 100 60" style={{ width: 80, height: 48 }}>
      {[[20,15],[50,15],[80,15],[35,35],[65,35],[20,50],[50,50],[80,50]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill={c} opacity=".8"/>)}
      {[["20,15","35,35"],["50,15","35,35"],["50,15","65,35"],["80,15","65,35"],["35,35","20,50"],["35,35","50,50"],["65,35","50,50"],["65,35","80,50"]].map((pair, i) => {
        const [a, b] = pair; const [x1,y1] = a.split(","); const [x2,y2] = b.split(",");
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`${c}40`} strokeWidth="1"/>;
      })}
    </svg>);
  return null;
}

/* ════════════════════════════════════════════════════════
   OKRUH 3 — KOORDINACE
   ════════════════════════════════════════════════════════ */
const studySections3 = [

  { id: "intro", title: "Co je koordinace aktivit", subtitle: "Birkinshawova dimenze č. 1", color: VSE.ffu, emoji: "refresh",
    content: (<div>
      <Def color={VSE.ffu}>
        <b>Koordinace aktivit</b> = proces rozdělení rolí v organizaci a sladění aktivit. Díky ní jsme schopni vyřešit složitější úkoly. <b>Birkinshawova dimenze č. 1:</b> Tradiční pól = <b>Byrokracie</b> ↔ Moderní pól = <b>Emergence</b>.
      </Def>
      <Tag color={VSE.ffu}>Jednoduchá otázka, kterou si firma musí položit</Tag>
      <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.ffu}`, borderRadius: 12, marginTop: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 10 }}>🏛️ „Řídíme to pravidly nebo instinktem?”</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
          <div>→ <b style={{ color: VSE.ffu }}>Pravidly</b> = Byrokracie (každý úkol má postup)</div>
          <div>→ <b style={{ color: VSE.fis }}>Instinktem</b> = Emergence (tým se zorganizuje sám)</div>
          <div>→ <b style={{ color: VSE.fmv }}>Mezi tím</b> = Hybrid (kombinace obojího)</div>
        </div>
      </GlassBox>
    </div>) },

  { id: "byro", title: "Byrokracie — formální řád", subtitle: "= Rozpis směn v továrně — každý ví, kdy a co", color: VSE.ffu, emoji: "pillar",
    content: (<div>
      <Def color={VSE.ffu}>
        <b>Horizontální koordinace</b> založená na procesech a formálních pravidlech. Vše musí být racionální a férové.
      </Def>
      <Tag color={VSE.ffu}>Klíčové principy</Tag>
      <Bullet items={[
        "Specializovaná oddělení — každý dělá to svoje",
        "Přísná hierarchie autorit — jasně dané pravomoci",
        "Formální pravidla, standardizace — napsané procesy",
        "Rigidní systém kariérního růstu — postupuješ po patrech",
        "Neosobnost — pravidla platí pro všechny stejně",
        "Job Design — práce je jasně daná a předepsaná",
      ]} color={VSE.ffu} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        <PlusMinus type="plus" items={[
          "Jasná odpovědnost — víš, kdo je za co",
          "Vyšší efektivita rutinních úkolů",
          "Méně stresu — všichni vědí, co dělat",
        ]} />
        <PlusMinus type="minus" items={[
          "Zabíjí kreativitu, demotivuje",
          "Pomalá reakce na změny trhu",
          "Netransparentnost",
          "Nefunguje v dynamickém prostředí",
        ]} />
      </div>
      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Kde funguje:</b> Stabilní prostředí, rutinní práce — státní správa, banky, výroba.
      </div>
      {/* Komise miluje - Svobodová */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE SVOBODOVÁ — POZOR NA PŘESNÉ DEFINICE!</div>
          <span>Svobodová u Machkem chce přesné definice. Nauč se všech <b>6 principů</b> byrokracie nazpaměť — nespokojí se s „pravidla a hierarchie”.</span>
        </div>
      </div>
    </div>) },

  { id: "emer", title: "Emergence — spontánní řád", subtitle: "= Hejno ptáků — nikdo neřídí, ale letí to v jednom směru", color: VSE.fis, emoji: "hive",
    content: (<div>
      <Def color={VSE.fis}>
        <b>Spontánní kolektivní práce</b> a sebeorganizace. Z interakce jednotlivých prvků systému vzniká určitý řád (hejno ptáků, včelí úl, organizace mravenců).
      </Def>
      <Tag color={VSE.fis}>Klíčové principy</Tag>
      <Bullet items={[
        "Samostatnost — člověk rozhoduje sám",
        "Odpovědnost — nese důsledky rozhodnutí",
        "Akceschopnost — musí udělat akci, ne čekat na někoho",
        "Nejsou manažeři (nebo jen minimálně)",
        "Job Crafting — zaměstnanec si sám najde/upraví práci",
      ]} color={VSE.fis} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        <PlusMinus type="plus" items={[
          "Flexibilita reakcí na trh",
          "Motivovaní zaměstnanci (vnitřní motivace)",
          "Podpora inovací",
          "Rychlé rozhodování bez schvalovaček",
        ]} />
        <PlusMinus type="minus" items={[
          "Chaos (zejména na začátku)",
          "Tlak na zaměstnance",
          "Potřebuje zralé a motivované lidi",
          "Těžko se škáluje (50 lidí OK, 500 se rozpadne)",
        ]} />
      </div>
      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Kde funguje:</b> Kreativní práce, startupy, znalostní práce — IT, design, R&D.
      </div>
      {/* Zajímavost — mravenci */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — MRAVENČÍ KOLONIE</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          Mravenci v kolonii nemají „královnu-šéfku” — ta jen klade vajíčka. <b>Koordinace vzniká přes feromony</b> (chemické signály). Když mravenec najde jídlo, zanechá stopu. Víc mravenců = silnější stopa = víc následovatelů. <b>Emergentní systém bez jediného manažera — a funguje miliony let.</b> Přesně to, co popisuje Birkinshawova emergence.
        </div>
      </GlassBox>
    </div>) },

  { id: "job", title: "Job Design × Job Crafting", subtitle: "Kdo definuje, co budeš dělat", color: VSE.fmv, emoji: "hammer",
    content: (<div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.ffu}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 2 }}>🔧 Job Design</div>
          <div style={{ fontSize: 11, color: VSE.ffu, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= Kuchařka s přesným receptem</div>
          <Bullet items={[
            "Manažer definuje pracovní náplň",
            "Úkoly jsou jasně rozepsané",
            "Patří k byrokracii",
            "Příklad: „Tvoje náplň: 50 faktur denně”",
          ]} color={VSE.ffu} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.fis}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.fis, fontFamily: fontSans, marginBottom: 2 }}>🎨 Job Crafting</div>
          <div style={{ fontSize: 11, color: VSE.fis, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= Prázdné plátno + barvy</div>
          <Bullet items={[
            "Zaměstnanec sám upravuje svoji práci",
            "Hledá, kde může přidat hodnotu",
            "Patří k emergenci",
            "Příklad: „Viděl jsem, že klientům chybí reporting — začnu ho dělat”",
          ]} color={VSE.fis} />
        </GlassBox>
      </div>
      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Rozdíl jednou větou:</b> V Job Designu dostaneš roli, v Job Craftingu si ji tvoříš.
      </div>
    </div>) },

  { id: "hybrid", title: "Hybridní modely", subtitle: "Mezi byrokracií a emergencí — co reálně funguje", color: VSE.fm, emoji: "scale",
    content: (<div>
      <Def color={VSE.fm}>
        Realita je, že <b>většina firem není ani čistá byrokracie, ani čistá emergence</b>. Používají hybridní modely — kombinaci obojího.
      </Def>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
        {/* Flexibilní byrokracie */}
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.fmv}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.fmv, fontFamily: fontSans, marginBottom: 2 }}>🏛️ Flexibilní byrokracie</div>
          <div style={{ fontSize: 11, color: VSE.fmv, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= Pravidla s lidskou tváří</div>
          <Bullet items={[
            "Pravidla existují, ale méně omezují",
            "Workshopy, transparentnost, autonomie v rámci pravidel",
            "Příklad: Toyota — tvrdá hierarchie pro výrobu, ale každý dělník může zastavit linku (kaizen)",
          ]} color={VSE.fmv} />
        </GlassBox>
        {/* Model vnitřního trhu */}
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.fm}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.fm, fontFamily: fontSans, marginBottom: 2 }}>💱 Model vnitřního trhu</div>
          <div style={{ fontSize: 11, color: VSE.fm, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= Burza nápadů uvnitř firmy</div>
          <Bullet items={[
            "Trh s nápady, kapitálem a talenty uvnitř firmy",
            "Zaměstnanec si vybírá projekty, projekty si vybírají zaměstnance",
            "Příklad: W.L. Gore (Gore-Tex) — mentor provede nového, pak si hledá sám",
            "Pravidlo 150: tým nesmí přesáhnout 150 lidí, pak se rozdělí",
          ]} color={VSE.fm} />
        </GlassBox>
        {/* Síťový model */}
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.nf}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.nf, fontFamily: fontSans, marginBottom: 2 }}>🌐 Síťový model</div>
          <div style={{ fontSize: 11, color: VSE.nf, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= Firma jako platforma, ne hierarchie</div>
          <Bullet items={[
            "Koordinace mezi organizacemi, ne uvnitř",
            "Firma je spíš platforma — spojuje partnery",
            "Příklad: Poradenské firmy (McKinsey, BCG) — konzultanti se spojují podle projektu",
          ]} color={VSE.nf} />
        </GlassBox>
      </div>
    </div>) },

  { id: "app", title: "Aplikace na případovku", subtitle: "Postup pro zkoušku — jak na to", color: VSE.success, emoji: "target",
    content: (<div>
      <Def color={VSE.success}>
        Na PS musíš umět <b>zařadit firmu</b>, vyhodnotit jestli jí to vyhovuje, najít napětí a navrhnout posun.
      </Def>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 1 — Zařaď firmu</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>Je to spíš <b>byrokracie, emergence, nebo hybrid</b>? Hledej znaky: formální procesy? hierarchie? tituly? samoorganizace?</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 2 — Vyhodnoť, jestli to firmě vyhovuje</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Stabilní prostředí + rutinní práce → byrokracie je OK<br/>→ Turbulence + kreativita → potřebuje emergenci</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 3 — Najdi napětí</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Pomalá reakce na změny → moc byrokracie<br/>→ Chaos a duplicity → moc emergence</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 4 — Navrhni posun</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Tradiční firma v turbulentním prostředí → <b>flexibilní byrokracie</b> nebo <b>model vnitřního trhu</b><br/>→ Rozpadající se startup → přidat prvky byrokracie (procesy pro HR, finance)</div>
        </GlassBox>
      </div>
      {/* Komise Machek */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MACHEK — HODNĚ SE DOPTÁVÁ!</div>
          <span>Machek chce konkrétní příklady firem. Připrav si 3 v hlavě: <b>Česká pošta</b> (byrokracie), <b>Valve</b> (emergence), <b>Toyota</b> (hybrid). Máš pak munici na doplňující otázky.</span>
        </div>
      </div>
    </div>) },

];

const flashcards3 = [
  { term: "Koordinace aktivit", def: "Proces rozdělení rolí v organizaci a sladění aktivit.", tag: "DEFINICE" },
  { term: "Byrokracie", def: "Horizontální koordinace na formálních pravidlech, standardizaci.", tag: "TRADIČNÍ" },
  { term: "Emergence", def: "Spontánní kolektivní práce, sebeorganizace. Samostatnost, odpovědnost, akceschopnost.", tag: "ALTERNATIVNÍ" },
  { term: "Job Design vs Job Crafting", def: "Job Design = práce jasně daná (byrokracie). Job Crafting = zaměstnanec si sám najde práci (emergence).", tag: "KLÍČOVÝ POJEM" },
  { term: "Flexibilní byrokracie", def: "Výhody pravidel ale méně omezující. Více autonomie, transparentnost.", tag: "HYBRID" },
  { term: "Model vnitřního trhu", def: "Emergentní koordinace uvnitř firmy. Trh s nápady, talenty. Gore.", tag: "HYBRID" },
  { term: "Síťový model", def: "Koordinace mezi organizacemi — konzultanti, mentoři. Poradenské firmy.", tag: "HYBRID" },
  { term: "Byrokracie (6 principů Webera)", def: "Hierarchie, dělba práce, formální pravidla, neosobnost, kvalifikace, kariéra. Ideální typ podle Maxe Webera.", tag: "MODEL" },
  { term: "Améba", def: "Malé samostatné týmy 5-50 lidí (Kyocera). Každá améba má vlastní P&L, sama si volí lídra.", tag: "STRUKTURA" },
  { term: "Holokracie", def: "Místo manažerů jsou kruhy a role. Lidé v rolích, ne v pozicích. Zappos, Spotify.", tag: "STRUKTURA" },
  { term: "Špagety org. (Oticon)", def: "Bez stálých rolí, projekty vznikají dle potřeby. Stoly na kolečkách. Použila firma Oticon.", tag: "STRUKTURA" },
  { term: "Adhokracie", def: "Flexibilní, bez formálních hierarchií. Vznikají dočasné týmy pro konkrétní úkoly.", tag: "STRUKTURA" },
  { term: "Job Design", def: "Top-down design pracovní pozice. Manažer definuje úkoly, KPIs, zodpovědnosti.", tag: "POJEM" },
  { term: "Job Crafting", def: "Bottom-up úprava práce zaměstnancem — sám si přizpůsobí úkoly své motivaci.", tag: "POJEM" },
  { term: "Flexibilní byrokracie", def: "Hybridní model: pevná pravidla pro core procesy, emergence pro inovace. Toyota, Spotify.", tag: "HYBRID" },
  { term: "Kolektivní moudrost", def: "Rozhodování na základě sdílených znalostí a perspektiv více lidí. Wisdom of the crowd.", tag: "POJEM" },
];

const quiz3 = [
  { q: "Koordinace aktivit patří do které Birkinshawovy dimenze?", opts: ["Managing Objectives","Managing Across Activities","Managing Down Decisions","Managing Motivation"], correct: 1 },
  { q: "Co je Job Crafting?", opts: ["Jasně daná pozice","Zaměstnanec si sám najde práci","Formální redesign","Manažer přiřazuje úkoly"], correct: 1 },
  { q: "Co NENÍ princip emergence?", opts: ["Samostatnost","Akceschopnost","Standardizace","Odpovědnost"], correct: 2 },
  { q: "Hlavní mínusy byrokracie:", opts: ["Chaos","Demotivace a omezení kreativity","Pomalé rozhodování","Autonomie"], correct: 1 },
  { q: "U Mládkové je nejdůležitější:", opts: ["Aplikace na CS","Přesné definice pojmů","Příklady z praxe","Filozofovat"], correct: 1 },
  { q: "Kolik principů má klasická Weberova byrokracie?", opts: ["3", "5", "6", "7"], correct: 2 },
  { q: "Co je to Améba (Kyocera)?", opts: ["Klasická hierarchie", "Malé samostatné týmy 5-50 lidí s vlastním P&L", "IT systém", "Marketingový nástroj"], correct: 1 },
  { q: "Holokracii zavedla mimo jiné firma:", opts: ["Apple", "Zappos", "Tesla", "ČSOB"], correct: 1 },
  { q: "Špagetová organizační struktura znamená:", opts: ["Tvrdá hierarchie", "Bez stálých rolí, projekty dle potřeby", "Outsourcing", "Franchising"], correct: 1 },
  { q: "Job Crafting je:", opts: ["Top-down design pozice", "Bottom-up úprava práce zaměstnancem", "Outsourcing práce", "Roční hodnocení"], correct: 1 },
  { q: "Flexibilní byrokracie kombinuje:", opts: ["Žádná pravidla a chaos", "Pevná pravidla pro core + emergence pro inovace", "Jen byrokracii", "Jen emergence"], correct: 1 },
  { q: "Které firmy používají hybrid byrokracie + emergence?", opts: ["McDonald's", "Toyota a Spotify", "ČSOB", "Česká pošta"], correct: 1 },
];


function HierarchyVsCollective() {
  const t = useTheme();
  return (
    <div style={{ ...cardStyle(t), padding: 20, marginTop: 14 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase" }}>VIZUÁLNÍ POROVNÁNÍ</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, alignItems: "start" }}>
        <div>
          <svg viewBox="0 0 150 100" style={{ width: "100%", height: 80 }}>
            <polygon points="75,10 95,35 55,35" fill={`${VSE.ffu}40`} stroke={VSE.ffu} strokeWidth="1.5"/>
            <polygon points="55,35 95,35 110,65 40,65" fill={`${VSE.ffu}25`} stroke={VSE.ffu} strokeWidth="1.5"/>
            <polygon points="40,65 110,65 130,95 20,95" fill={`${VSE.ffu}15`} stroke={VSE.ffu} strokeWidth="1.5"/>
            <text x="75" y="25" textAnchor="middle" fill={VSE.ffu} fontSize="7" fontWeight="bold" fontFamily={fontSans}>CEO</text>
            <text x="75" y="52" textAnchor="middle" fill={VSE.ffu} fontSize="6" fontFamily={fontSans}>MANAŽEŘI</text>
            <text x="75" y="82" textAnchor="middle" fill={VSE.ffu} fontSize="6" fontFamily={fontSans}>ZAMĚSTNANCI</text>
          </svg>
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginTop: 6 }}>HIERARCHIE</div>
          <div style={{ textAlign: "center", fontSize: 10, color: t.textMuted, fontFamily: fontMono }}>↓ top-down</div>
        </div>
        <div>
          <svg viewBox="0 0 150 100" style={{ width: "100%", height: 80 }}>
            <circle cx="75" cy="50" r="40" fill="none" stroke={`${VSE.fis}30`} strokeWidth="1" strokeDasharray="2 2"/>
            {[0,45,90,135,180,225,270,315].map((a,i)=>{const r=35;const rad=a*Math.PI/180;const x=75+r*Math.cos(rad);const y=50+r*Math.sin(rad);return <circle key={i} cx={x} cy={y} r="5" fill={`${VSE.fis}30`} stroke={VSE.fis} strokeWidth="1"/>})}
            <circle cx="75" cy="50" r="8" fill={`${VSE.fis}20`} stroke={VSE.fis} strokeWidth="1.5" strokeDasharray="2 1"/>
            <text x="75" y="53" textAnchor="middle" fill={VSE.fis} fontSize="6" fontFamily={fontSans} fontWeight="bold">TÝM</text>
          </svg>
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: VSE.fis, fontFamily: fontSans, marginTop: 6 }}>COLLECTIVE WISDOM</div>
          <div style={{ textAlign: "center", fontSize: 10, color: t.textMuted, fontFamily: fontMono }}>⟲ rovnocenné hlasy</div>
        </div>
      </div>
    </div>
  );
}

function FrenchRavenViz() {
  const t = useTheme();
  const types = [
    { icon: "scroll", name: "Legitimní", desc: "Formální autorita — přiřazovat úkoly, utrácet peníze", color: VSE.fph, example: "Ředitel firmy" },
    { icon: "hammer", name: "Donucovací", desc: "Možnost trestat nebo odebírat odměny", color: VSE.danger, example: "Hrozba výpovědí" },
    { icon: "gift", name: "Odměňovací", desc: "Možnost odměnit za shodu", color: VSE.success, example: "Bonusy za výkon" },
    { icon: "brain", name: "Expertní", desc: "Významné znalosti nebo dovednosti", color: VSE.fis, example: "IT architekt" },
    { icon: "star", name: "Referenční", desc: "Charisma — lidi ji chtějí následovat", color: VSE.fmv, example: "Steve Jobs" },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: 18, marginTop: 14 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 12, fontWeight: 600, textTransform: "uppercase" }}>FRENCH-RAVEN · 5 ZDROJŮ MOCI</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {types.map((ty, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: `${ty.color}08`, border: `1px solid ${ty.color}25`, borderRadius: 12, borderLeft: `3px solid ${ty.color}` }}>
            <Icon name={ty.icon} size={26} color={ty.color} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: ty.color, fontFamily: fontSans }}>{ty.name}</div>
              <div style={{ fontSize: 11.5, color: t.text, fontFamily: fontSans, lineHeight: 1.45, marginTop: 2 }}>{ty.desc}</div>
              <div style={{ fontSize: 10.5, color: t.textMuted, fontFamily: fontSans, fontStyle: "italic", marginTop: 3 }}>→ {ty.example}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeorieXYTable() {
  const t = useTheme();
  const rows = [
    ["Teorie X", "Teorie Y"],
    ["Poslušnost", "Self-management"],
    ["Delegování", "Zmocnění"],
    ["Rozhoduje manažer", "Rozhoduje skupina"],
    ["Několik úrovní řízení", "Jedna úroveň řízení"],
    ["Nejsme si rovni", "Jsme si rovni"],
    ["Manažer ví nejlépe", "Skupina ví nejlépe"],
    ["Jasná odpovědnost", "Všichni za všechny"],
  ];
  return (
    <div style={{ ...cardStyle(t), padding: 18, marginTop: 14 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 12, fontWeight: 600, textTransform: "uppercase" }}>MCGREGOR · TEORIE X vs Y</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, borderRadius: 10, overflow: "hidden" }}>
        {rows.map((row, i) => (
          <Fragment key={i}>
            <div style={{ padding: "10px 14px", background: i === 0 ? `${VSE.ffu}20` : `${VSE.ffu}${i%2===0?"08":"04"}`, fontSize: 12, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? VSE.ffu : t.text, fontFamily: fontSans, borderRight: `1px solid ${t.border}` }}>{row[0]}</div>
            <div style={{ padding: "10px 14px", background: i === 0 ? `${VSE.fis}20` : `${VSE.fis}${i%2===0?"08":"04"}`, fontSize: 12, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? VSE.fis : t.text, fontFamily: fontSans }}>{row[1]}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

const studySections4 = [

  { id: "intro", title: "Co je distribuce moci", subtitle: "Birkinshawova dimenze č. 2", color: VSE.ffu, emoji: "scale",
    content: (<div>
      <Def color={VSE.ffu}>
        <b>Distribuce moci</b> = jak je řízená organizace, aby byla jasně definována autorita. Organizace zodpovědnosti, vztahů a moci. <b>Birkinshawova dimenze č. 2:</b> Tradiční pól = <b>Hierarchie</b> ↔ Moderní pól = <b>Collective Wisdom</b>.
      </Def>
      <Tag color={VSE.ffu}>Jednoduchá otázka pro firmu</Tag>
      <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.ffu}`, borderRadius: 12, marginTop: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 10 }}>🏛️ „Rozhoduje jeden shora, nebo víc lidí dohromady?”</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
          <div>→ <b style={{ color: VSE.ffu }}>Shora</b> = Hierarchie (rychlé, ale riziko zneužití moci)</div>
          <div>→ <b style={{ color: VSE.fis }}>Dohromady</b> = Collective Wisdom (lepší rozhodnutí, ale pomalejší)</div>
        </div>
      </GlassBox>
      <HierarchyVsCollective />
    </div>) },

  { id: "hier", title: "Hierarchie — vertikální proces", subtitle: "= Armádní velení — generál rozhoduje, vojáci plní", color: VSE.ffu, emoji: "pillar",
    content: (<div>
      <Def color={VSE.ffu}>
        <b>Vertikální proces</b>. Nadřízený rozhoduje, podřízený poslouchá. Pevně daná pravidla — každý ví, o čem může rozhodovat.
      </Def>
      <Tag color={VSE.ffu}>Klíčové principy</Tag>
      <Bullet items={[
        "Vertikální top-down proces",
        "Formální struktury a vztahy",
        "Nadřízenost × podřízenost",
        "Jasná autorita",
        "Typicky: armáda, policie, úřady, banky",
      ]} color={VSE.ffu} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        <PlusMinus type="plus" items={[
          "Přehledné i při velkém počtu",
          "Jasné přidělení odpovědnosti",
          "Stabilita, efektivita",
          "Snadné hodnocení výkonnosti",
        ]} />
        <PlusMinus type="minus" items={[
          "Informace se neposouvají svobodně",
          "Kreativita potlačena",
          "Demotivace na nižších úrovních",
          "Zneužití moci",
        ]} />
      </div>
      {/* Stanfordský experiment */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — STANFORDSKÝ VĚZEŇSKÝ EXPERIMENT (1971)</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          Psycholog Zimbardo rozdělil 24 studentů na „vězně” a „dozorce” ve sklepě univerzity. Experiment musel být přerušen po <b>6 dnech místo plánovaných 14</b> — dozorci začali vězně sadisticky týrat. <b>Lekce pro management:</b> Hierarchická moc bez kontroly rychle korumpuje. Proto v moderních firmách existují kontrolní mechanismy (360° hodnocení, ombudsman, whistleblowing).
        </div>
      </GlassBox>
    </div>) },

  { id: "collec", title: "Collective Wisdom — kolektivní moudrost", subtitle: "= Wikipedia — miliony editorů píšou nejpřesnější encyklopedii", color: VSE.fis, emoji: "brain",
    content: (<div>
      <Def color={VSE.fis}>
        Velká skupina s odlišnými názory dosáhne <b>lepšího rozhodnutí než jeden expert</b>. Nelze delegovat — rozhoduje celý tým.
      </Def>
      <Tag color={VSE.fis}>Klíčové principy</Tag>
      <Bullet items={[
        "Funguje v dynamickém a nepředvídatelném prostředí",
        "Benevolentnější styl, sebeřízení",
        "Rozhoduje celý tým — skupina nad jednotlivcem",
        "Všichni za všechny",
      ]} color={VSE.fis} />
      <Tag color={VSE.fis}>Koncept 3S — požadavky na zaměstnance</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { num: "1", name: "Self-management", what: "Nastavit si vlastní práci", how: "Sám si plánuji týden" },
          { num: "2", name: "Self-organization", what: "Organizovat práci k cílům", how: "Sám zvolím postup úkolu" },
          { num: "3", name: "Self-control", what: "Kontrolovat výsledky", how: "Sám zkontroluji, jestli to funguje" },
        ].map((s, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.fis}`, borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: VSE.fis, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, fontFamily: fontMono, flexShrink: 0 }}>{s.num}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fis, fontFamily: fontMono }}>{s.name}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 6 }}>{s.what}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", lineHeight: 1.5, paddingLeft: 8, borderLeft: `2px solid ${VSE.fis}30` }}>→ {s.how}</div>
          </GlassBox>
        ))}
      </div>
      <Tag color={VSE.nf}>Metody získávání názorů skupiny</Tag>
      <Bullet items={[
        "Brainstorming — volné generování nápadů, bez kritiky",
        "Delphi — anonymní odborníci, iterativní konsenzus (vyhýbá se skupinovému tlaku)",
        "Nominální skupinová technika — strukturovaný brainstorming (každý zapíše sám, pak diskuse)",
      ]} color={VSE.nf} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        <PlusMinus type="plus" items={[
          "Podpora kreativity",
          "Více hlav ví víc (moudrost davu)",
          "Levnější objevy",
          "Rovnost moci",
        ]} />
        <PlusMinus type="minus" items={[
          "Možná ztráta kontroly",
          "Komunikace musí být nastavena",
          "Překřikování, dlouhé domluvy",
          "Nelze delegovat",
        ]} />
      </div>
    </div>) },

  { id: "french_raven", title: "French-Raven — 5 zdrojů moci", subtitle: "⚠️ NEJDŮLEŽITĚJŠÍ SEKCE — 4× v ZS 2026", color: VSE.fmv, emoji: "bolt",
    content: (<div>
      <Def color={VSE.fmv}>
        French a Raven rozdělili moc na <b>5 základních zdrojů</b>. Manažer obvykle kombinuje víc typů, ale pozná se to podle toho, <b>proč ho lidi poslouchají</b>.
      </Def>
      {/* Komise miluje — HNED NAHORU */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}20, ${VSE.danger}08)`, border: `2px solid ${VSE.danger}50`, borderRadius: 12, padding: "12px 16px", marginTop: 12, marginBottom: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 11, letterSpacing: "1.5px", marginBottom: 4 }}>KOMISE MILUJE — 4× ZA ZS 2026!</div>
          <span>French-Raven padá <b>nejčastěji ze všech okruhů Managementu</b>. Naučit <b>všech 5 typů s příklady</b> nazpaměť. Komise Bočková chce <b>aplikaci na PS</b>: jaké zdroje manažer používá + rizika + doporučení.</span>
        </div>
      </div>
      <FrenchRavenViz />
      <Tag color={VSE.fmv}>Aplikace na PS — jak číst French-Raven v firmě</Tag>
      <Bullet items={[
        "Identifikuj, kterými typy moci manažer vládne (často kombinace)",
        "Vyhodnoť: je to vyvážené, nebo přehnaně donucovací/legitimní?",
        "Rizika: samotná donucovací/legitimní moc → demotivace, fluktuace",
        "Doporučení: ideální mix obsahuje expertní a referenční moc",
      ]} color={VSE.fmv} />
    </div>) },

  { id: "weber_mikro", title: "Weber, podoby moci, mikropolitika", subtitle: "Další vrstvy moci + Mládkové pozor", color: VSE.primary, emoji: "compass",
    content: (<div>
      {/* Podoby moci — 3 karty */}
      <Tag color={VSE.danger}>Podoby moci — vývojové fáze</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { name: "Trestající", desc: "Trest, sankce, násilí. Nejstarší forma moci.", color: VSE.danger },
          { name: "Kompenzační", desc: "Něco za něco. Ekonomická výhoda za poslušnost.", color: VSE.fmv },
          { name: "Podmíněná", desc: "Neuvědomujeme si ji. Marketing, reklama, ideologie.", color: VSE.fm },
        ].map((p, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${p.color}`, borderRadius: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: p.color, fontFamily: fontMono, marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5 }}>{p.desc}</div>
          </GlassBox>
        ))}
      </div>

      {/* Weberovy zdroje — 3 karty */}
      <Tag color={VSE.primary}>Weberovy zdroje moci</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { name: "Osobnost", desc: "Jsme silní, druzí mají strach nebo respekt.", example: "Charismatický lídr" },
          { name: "Vlastnictví", desc: "Něco máme (majetek, kapitál), díky tomu rozhodujeme.", example: "Majitel firmy" },
          { name: "Organizace", desc: "Jsme v organizační struktuře vysoko postavení.", example: "CEO, ředitel" },
        ].map((w, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.primary}`, borderRadius: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: VSE.primary, fontFamily: fontMono, marginBottom: 6 }}>{w.name}</div>
            <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 6 }}>{w.desc}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", paddingLeft: 8, borderLeft: `2px solid ${VSE.primary}30` }}>→ {w.example}</div>
          </GlassBox>
        ))}
      </div>

      {/* Mikropolitika */}
      <Tag color={VSE.fm}>Mikropolitika — zákulisní politika ve firmě</Tag>
      <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6, marginBottom: 8 }}>
        Cesty a způsoby <b>prosazení vlastních zájmů</b> v organizaci. Lídr ji musí umět uplatňovat — v etických mantinelech.
      </div>
      <Bullet items={[
        "Stávky — nátlak",
        "Vytváření koalic",
        "Výměna (pozor na hranice korupce!)",
        "Odvolání se k vyšší autoritě",
        "Rozumný dialog podložený fakty",
      ]} color={VSE.fm} />

      {/* Mládková warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 14, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MLÁDKOVÁ — POZOR!</div>
          <span>Mládková NEchce hierarchii vs collective wisdom — chce <b>FORMÁLNÍ vs NEFORMÁLNÍ</b> moc.<br/>→ <b>Formální</b> = legitimní moc z pozice, oficiální rozhodování<br/>→ <b>Neformální</b> = referenční, expertní, charisma, mikropolitika</span>
        </div>
      </div>
    </div>) },

  { id: "xy", title: "Teorie X × Y (McGregor)", subtitle: "Dva pohledy na to, jací lidi jsou", color: VSE.fph, emoji: "scale",
    content: (<div>
      <Def color={VSE.fph}>
        McGregor popsal <b>2 základní předpoklady manažera o zaměstnancích</b>. Oba jsou někdy platné — chyba je aplikovat X na kreativní tým nebo Y na rutinní výrobu.
      </Def>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.danger}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.danger, fontFamily: fontSans, marginBottom: 2 }}>🦹 Teorie X</div>
          <div style={{ fontSize: 11, color: VSE.danger, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= „Lidi jsou líní, musí se hnát”</div>
          <Bullet items={[
            "Zaměstnanec je pasivní, nechce pracovat",
            "Musí se kontrolovat a trestat",
            "Manažer = autorita, dohlížitel",
            "Vhodné: rutinní práce, hierarchie",
          ]} color={VSE.danger} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.success}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 2 }}>😇 Teorie Y</div>
          <div style={{ fontSize: 11, color: VSE.success, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= „Lidi chtějí pracovat, pokud jim to dává smysl”</div>
          <Bullet items={[
            "Zaměstnanec je proaktivní, hledá smysl",
            "Motivovat, ne kontrolovat",
            "Manažer = kouč, umožňovatel",
            "Vhodné: kreativní práce, collective wisdom",
          ]} color={VSE.success} />
        </GlassBox>
      </div>
      <TeorieXYTable />
    </div>) },

  { id: "struct", title: "Organizační struktury", subtitle: "Od hierarchických po moderní", color: VSE.primary, emoji: "dna",
    content: (<div>
      <Def color={VSE.primary}>
        <b>Organizační struktura</b> = hierarchické uspořádání mezi pracovními místy (typ sociální sítě). Nezbytná pro řízení většího počtu lidí.
      </Def>
      <Tag color={"#6E6E73"}>Tradiční struktury — armádní velení</Tag>
      <GlassBox opacity={0.4} style={{ borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          <b style={{ color: VSE.ffu }}>Liniová</b> (N-P) · <b style={{ color: VSE.fmv }}>Funkční</b> (N-P-P) · <b style={{ color: VSE.warning }}>Štábní</b> · <b style={{ color: VSE.fph }}>Maticová</b> (podle úkolů)
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Podle úrovní → <b>strmé × ploché</b></div>
        </div>
      </GlassBox>
      <Tag color={VSE.primary}>Moderní struktury — po zploštění</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          {
            name: "Améby (Kyocera)",
            color: VSE.primary,
            type: "ameby",
            what: "Firma rozdělená na malé autonomní buňky (améby) s vlastním P&L. Každá má 5–20 lidí a chová se jako mini-firma.",
            how: ["Buňky mezi sebou obchodují jako samostatné firmy","Když améba roste, rozdělí se; když klesá, spojí se","Kyocera má 3000+ améb"],
          },
          {
            name: "Holokracie (Zappos)",
            color: VSE.fph,
            type: "holo",
            what: "Struktura bez manažerů. Místo pozic existují „kruhy” s rolemi, které si lidé sami berou.",
            how: ["Self-organization — týmy se řídí samy","Rovnocenný hlas — každý může rozhodnout","Funguje u malých firem; u velkých často selhává"],
          },
          {
            name: "Špagety (Oticon)",
            color: VSE.fm,
            type: "spag",
            what: "Zaměstnanci nemají pevné projekty. Kdo má nápad, hledá si sám tým — projekty si konkurují o lidi.",
            how: ["Dánská firma na naslouchátka (1991)","Projekt získá finance, když zaujme zákazníky","Zaměstnanec pracuje na více projektech zároveň"],
          },
          {
            name: "Network",
            color: VSE.nf,
            type: "net",
            what: "Firma jako platforma, která propojuje vlastní i externí partnery. Hodně outsourcingu.",
            how: ["Plochá decentralizovaná struktura","Jádro firmy zůstává malé","Partneři (dodavatelé, freelanceři) se zapojují podle potřeby"],
          },
        ].map((s) => (
          <div key={s.type} style={{ background: `${s.color}08`, border: `1px solid ${s.color}25`, borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: s.color, fontFamily: fontSans, marginBottom: 6 }}>{s.name}</div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><OrgSvg type={s.type} color={s.color} /></div>
            <div style={{ fontSize: 11.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 8 }}>{s.what}</div>
            {s.how.map((it,i) => <div key={i} style={{ fontSize: 10.5, color: "var(--text-muted)", lineHeight: 1.45, fontFamily: fontSans, paddingLeft: 6, borderLeft: `2px solid ${s.color}25`, marginBottom: 3 }}>→ {it}</div>)}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: "10px 14px", background: `${VSE.success}08`, borderRadius: 10, border: `1px solid ${VSE.success}25`, fontSize: 12, color: "var(--text)", fontFamily: fontSans }}>
        <b style={{ color: VSE.success }}>Adhokracie</b> — experti rozhodují, ne šéfové. NASA, krizové řízení, R&D centra. Pravomoc jde <b>za kompetencí</b>, ne za pozicí.
      </div>
      {/* Zappos experiment */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — ZAPPOS A HOLOKRACIE</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          Tony Hsieh v roce 2013 <b>zrušil všechny manažerské pozice</b> a přešel na holokracii. <b>14 % zaměstnanců dalo hned výpověď</b>, rozhodování se zpomalilo. Po 2 letech Zappos <b>částečně vrátil</b> seniorní role pro strategii. <b>Lekce:</b> collective wisdom funguje pro nápady, ale finální rozhodnutí musí někdo udělat.
        </div>
      </GlassBox>
    </div>) },

  { id: "app", title: "Aplikace na případovku", subtitle: "Postup pro zkoušku — jak na to", color: VSE.success, emoji: "target",
    content: (<div>
      <Def color={VSE.success}>
        Na PS musíš <b>zařadit strukturu</b>, identifikovat zdroje moci (French-Raven!) a <b>navrhnout modernější variantu</b>.
      </Def>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 1 — Zařaď firmu</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>Hierarchie, CW, nebo hybrid? Hledej: kdo rozhoduje? formální pravidla? meetingy? porady?</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 2 — Jakou org. strukturu má?</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Tradiční (liniová, funkční, maticová) × moderní (améby, holokracie)<br/>→ Strmá × plochá</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 3 — Identifikuj French-Raven moc</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Jakými zdroji moci manažer vládne?<br/>→ Je to vyvážené, nebo přehnaně donucovací/legitimní?</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 4 — Navrhni posun</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Rigidní hierarchie → přidat prvky CW (pravidelné porady, 3S)<br/>→ Chaos v CW → přidat lídra s legitimní mocí<br/>→ Donucovací moc převládá → doporuč expertní/referenční</div>
        </GlassBox>
      </div>
      {/* Nový/Vávra/Heřman warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE NOVÝ / VÁVRA / HEŘMAN</div>
          <span>Chtějí vidět, že umíš <b>navrhnout modernější variantu</b>. Nestačí popsat — musíš dát <b>konkrétní doporučení</b> (např. „doporučuji přejít na maticovou strukturu s prvky holokracie pro R&D oddělení”).</span>
        </div>
      </div>
    </div>) },

];

const flashcards4 = [
  { term: "Distribuce moci", def: "Jak je řízená organizace. Organizace zodpovědnosti, vztahů a moci.", tag: "DEFINICE" },
  { term: "Hierarchie", def: "Vertikální proces, top-down. Nadřízený rozhoduje.", tag: "TRADIČNÍ" },
  { term: "Collective Wisdom", def: "Velká skupina s odlišnými názory dosahuje lepšího rozhodnutí. Nelze delegovat.", tag: "ALTERNATIVNÍ" },
  { term: "Koncept 3S", def: "Self-management, Self-organization, Self-control. Požadavky v collective wisdom.", tag: "KLÍČOVÝ POJEM" },
  { term: "Brainstorming", def: "Volné generování nápadů ve skupině, bez kritiky.", tag: "METODA" },
  { term: "Delphi metoda", def: "Anonymní odborníci, konsenzus. Vyhýbá se skupinovému tlaku.", tag: "METODA" },
  { term: "Teorie X (McGregor)", def: "Poslušnost, delegování. Odpovídá hierarchii.", tag: "TEORIE" },
  { term: "Teorie Y (McGregor)", def: "Self-management, zmocnění. Odpovídá collective wisdom.", tag: "TEORIE" },
  { term: "Moc (definice)", def: "Sociální vztah, kdy jeden ovlivňuje ostatní i přes jejich vůli.", tag: "MOC" },
  { term: "Zdroje moci — Weber", def: "Osobnost, vlastnictví, organizace.", tag: "ZDROJE MOCI" },
  { term: "French-Raven: Legitimní", def: "Spojena s formální autoritou — přiřazovat úkoly.", tag: "FRENCH-RAVEN" },
  { term: "French-Raven: Donucovací", def: "Možnost trestat nebo odebírat odměny.", tag: "FRENCH-RAVEN" },
  { term: "French-Raven: Odměňovací", def: "Možnost odměnit za shodu (bonusy).", tag: "FRENCH-RAVEN" },
  { term: "French-Raven: Expertní", def: "Spojena s významnými znalostmi nebo dovednostmi.", tag: "FRENCH-RAVEN" },
  { term: "French-Raven: Referenční", def: "Spojena s charismatem — lidi ji chtějí následovat.", tag: "FRENCH-RAVEN" },
  { term: "Mikropolitika", def: "Cesty prosazení vlastních zájmů. Stávky, koalice, dialog.", tag: "MOC" },
  { term: "Améby", def: "Bez pevných pozic. Úkol → týmy se tvoří → nejlepší vyhrává.", tag: "STRUKTURA" },
  { term: "Holokracie", def: "Self-organization, nahrazuje hierarchii. Rovnocenný hlas.", tag: "STRUKTURA" },
  { term: "Špagety (Oticon)", def: "Samořídící týmy volí projekt. Naslouchátka Oticon.", tag: "STRUKTURA" },
  { term: "Network", def: "Plochá decentralizovaná struktura. Outsourcing.", tag: "STRUKTURA" },
  { term: "Adhokracie", def: "Experti rozhodují, ne šéfové. NASA, krize.", tag: "STRUKTURA" },
];

const quiz4 = [
  { q: "Co je distribuce moci?", opts: ["Způsob odměňování","Organizace zodpovědnosti, vztahů a moci","Nástroj performance managementu","Typ leadershipu"], correct: 1 },
  { q: "Co NENÍ součástí konceptu 3S v collective wisdom?", opts: ["Self-management","Self-organization","Self-control","Self-promotion"], correct: 3 },
  { q: "Která moc je spojena s charismatem?", opts: ["Legitimní","Expertní","Referenční","Odměňovací"], correct: 2 },
  { q: "Bonus za splnění cíle je příklad které moci?", opts: ["Legitimní","Donucovací","Odměňovací","Expertní"], correct: 2 },
  { q: "Hrozba výpovědí je příklad moci:", opts: ["Donucovací","Referenční","Expertní","Odměňovací"], correct: 0 },
  { q: "Která metoda využívá anonymitu odborníků?", opts: ["Brainstorming","Delphi","Nominální technika","MBO"], correct: 1 },
  { q: "Organizační struktura Oticon se nazývá:", opts: ["Améby","Holokracie","Špagety","Adhokracie"], correct: 2 },
  { q: "V holokracii:", opts: ["Manažer rozhoduje top-down","Jeden expert řídí vše","Týmy se řídí samy","Striktně hierarchická pravidla"], correct: 2 },
  { q: "Stanford prison experiment je typický příklad:", opts: ["Collective wisdom","Zneužití hierarchie","Holokracie","Delphi metody"], correct: 1 },
  { q: "MyFC (fotbalový klub řízený fanoušky) je příklad:", opts: ["Hierarchie","Collective wisdom","Byrokracie","Adhokracie"], correct: 1 },
  { q: "Mezi Weberovy zdroje moci NEPATŘÍ:", opts: ["Osobnost","Vlastnictví","Organizace","Charisma"], correct: 3 },
  { q: "Teorie Y podle McGregora odpovídá:", opts: ["Hierarchii","Collective wisdom","Byrokracii","Alignment"], correct: 1 },
];


/* ════════════════════════════════════════════════════════
   OKRUH 1 — Současné přístupy, BM × MM, inovace managementu
   ════════════════════════════════════════════════════════ */
const studySections1 = [

  { id: "def", title: "Co je management", subtitle: "Definice + 3 způsoby chápání", color: VSE.ffu, emoji: "building",
    content: (<div>
      <Def color={VSE.ffu}>
        <b>Management</b> = souhrn všech činností potřebných pro zabezpečení chodu organizace (dosahování účelu a cílů). Správná volba cest, prostředků, nástrojů a aktivit, které prostřednictvím lidí umožňují dosahovat cílů.
      </Def>
      <Tag color={VSE.ffu}>3 způsoby, jak o managementu přemýšlet</Tag>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>„Jak zajistit, aby firma rostla a nepadla?”</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}><b>→ Globální prosperita a růst.</b> Nejvyšší pohled — management má firmu držet naživu.</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>„Jak se dostaneme z bodu A do bodu B?”</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}><b>→ Cesta k cílům.</b> Strategická úroveň — kudy vést firmu k tomu, co chce dosáhnout.</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>„Co konkrétně dělat každý den?”</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}><b>→ Proces.</b> Praktická úroveň — plánovat, organizovat, řídit, kontrolovat, rozhodovat.</div>
        </GlassBox>
      </div>
    </div>) },

  { id: "faze", title: "4 fáze vývoje managementu", subtitle: "Od Taylora po umělou inteligenci", color: VSE.fmv, emoji: "pillar",
    content: (<div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <ModelCard name="1. Klasický mng (1890–1930)" color={VSE.ffu} items={[
          "Taylor, Ford, Baťa, Fayol",
          "Vědecké řízení, člověk = stroj",
          "Zaměření na procesy a efektivitu",
          "Úkolová mzda",
        ]} />
        <ModelCard name="2. Moderní mng (1931–1970)" color={VSE.fmv} items={[
          "Maslow (teorie potřeb), McGregor (X a Y)",
          "Herzberg (hygienické faktory)",
          "Zapojení sociálních prvků",
          "Důležitost lidského kapitálu",
        ]} />
        <ModelCard name="3. Post-moderní mng (1980–2000)" color={VSE.fis} items={[
          "Narušení stability — ropné šoky",
          "Nabídka > poptávka",
          "Zakázková produkce",
          "Drucker — Management by Objectives",
        ]} />
        <ModelCard name="4. Průmysl 4.0 (21. století)" color={VSE.fm} items={[
          "Lidské zdroje na prvním místě",
          "Individualizace masové výroby",
          "Google, Meta, Microsoft",
          "AI, Big Data, biotechnologie",
        ]} />
      </div>
      {/* Přirozená vsuvka — Baťa */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — BAŤŮV ODKAZ</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          Tomáš Baťa měřil zaměstnance stopkami jako Taylor ve Filadelfii — ale šel dál. Ve Zlíně postavil zaměstnancům domy, školy, nemocnice a zavedl <b>týdenní bilance každé dílny</b> (= předchůdce dnešních KPI dashboardů). Klasický management s humanistickými prvky <b>60 let před moderním managementem</b>.
        </div>
      </GlassBox>
    </div>) },

  { id: "birk", title: "Birkinshaw — 4 dimenze managementu", subtitle: "= Řídicí pult se 4 přepínači", color: VSE.fis, emoji: "compass",
    content: (<div>
      <Def color={VSE.fis}>
        Každá firma má <b>4 základní rozhodnutí</b>, jak se bude řídit. U každého přepínače si vybere <b>tradiční</b> nebo <b>moderní</b> pól. Kombinací vzniká její <b>management model</b>.
      </Def>
      {/* Komise miluje - warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 10, marginBottom: 4, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MILUJE — NAUČIT TABULKU NAZPAMĚŤ!</div>
          <span>Každá dimenze = jeden další okruh státnic (<b>3, 4, 5</b>). Když pochopíš Birkinshawa, máš kostru pro 3 další otázky. <b>Investice za všechny peníze.</b></span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 14 }}>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: "var(--text-muted)", fontWeight: 700 }}>DIMENZE</div>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: VSE.ffu, fontWeight: 700, textAlign: "center" }}>TRADIČNÍ</div>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: VSE.fis, fontWeight: 700, textAlign: "center" }}>MODERNÍ</div>
        {[
          ["Koordinace aktivit", "Byrokracie", "Emergence"],
          ["Rozhodování", "Hierarchie", "Collective Wisdom"],
          ["Stanovení cílů", "Alignment", "Obliquity"],
          ["Motivace", "Extrinsic", "Intrinsic"],
        ].map((row, i) => (
          <Fragment key={i}>
            <div style={{ fontSize: 11.5, fontFamily: fontSans, color: "var(--text)", padding: "6px 0", borderTop: `1px solid var(--border)` }}>{row[0]}</div>
            <div style={{ fontSize: 11.5, fontFamily: fontSans, color: VSE.ffu, textAlign: "center", padding: "6px 0", borderTop: `1px solid var(--border)` }}>{row[1]}</div>
            <div style={{ fontSize: 11.5, fontFamily: fontSans, color: VSE.fis, textAlign: "center", padding: "6px 0", borderTop: `1px solid var(--border)` }}>{row[2]}</div>
          </Fragment>
        ))}
      </div>
    </div>) },

  { id: "bmvm", title: "Business Model × Management Model", subtitle: "Co firma dělá vs. jak to řídí", color: VSE.nf, emoji: "scale",
    content: (<div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Business Model */}
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.nf}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.nf, fontFamily: fontSans, marginBottom: 2 }}>💼 Business Model</div>
          <div style={{ fontSize: 11, color: VSE.nf, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 4, opacity: 0.85 }}>= Popis stroje na peníze</div>
          <div style={{ fontSize: 12.5, fontStyle: "italic", color: "var(--text-muted)", fontFamily: fontSans, marginBottom: 8 }}>„Jak vyděláváme?”</div>
          <Bullet items={[
            "KDO jsou naši zákazníci",
            "CO jim nabízíme (hodnotová nabídka)",
            "JAK z toho vyděláváme",
            "Není strategie, je její součástí",
            "Příklad: Netflix = předplatné za neomezený obsah",
          ]} color={VSE.nf} />
        </GlassBox>
        {/* Management Model */}
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.primary}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.primary, fontFamily: fontSans, marginBottom: 2 }}>🎛️ Management Model</div>
          <div style={{ fontSize: 11, color: VSE.primary, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 4, opacity: 0.85 }}>= Návod na ovládání firmy</div>
          <div style={{ fontSize: 12.5, fontStyle: "italic", color: "var(--text-muted)", fontFamily: fontSans, marginBottom: 8 }}>„Jak firmu řídíme?”</div>
          <Bullet items={[
            "JAK koordinujeme práci (Birkinshaw 1)",
            "KDO rozhoduje (Birkinshaw 2)",
            "JAK zadáváme cíle (Birkinshaw 3)",
            "ČÍM motivujeme (Birkinshaw 4)",
            "Příklad: Google = emergence + CW + obliquity + intrinsic",
          ]} color={VSE.primary} />
        </GlassBox>
      </div>
      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Rozdíl jednou větou:</b> BM říká <b>co</b> firma dělá, MM říká <b>jak</b> to dělá.
      </div>
      {/* Komise miluje */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE NOVÝ — CHCE JASNÝ ROZDÍL!</div>
          <span>Nový se ptá explicitně: „Co je management model? Jak se liší od business modelu?” — odpověz přímo tou větou výše.</span>
        </div>
      </div>
    </div>) },

  { id: "canvas", title: "BMC vs Lean Canvas", subtitle: "Dvě šablony — pro koho která", color: VSE.fph, emoji: "scroll",
    content: (<div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* BMC */}
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.fph}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.fph, fontFamily: fontSans, marginBottom: 2 }}>📘 Business Model Canvas</div>
          <div style={{ fontSize: 11, color: VSE.fph, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= Profesionální fotka firmy</div>
          <Bullet items={[
            "Starší, komplexnější — 9 bloků",
            "Pro etablované firmy ve stabilním prostředí",
            "Neměl by se často měnit",
            "Neposkytuje metriky (není kontrola výkonu)",
          ]} color={VSE.fph} />
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: fontSans, marginTop: 8, lineHeight: 1.55, paddingLeft: 4, borderLeft: `2px solid ${VSE.fph}30` }}>
            <b style={{ color: VSE.fph }}>9 bloků:</b> Zákaznické segmenty, Hodnotová nabídka, Kanály, Vztahy, Zdroje příjmů, Klíčové zdroje, Klíčové aktivity, Klíčoví partneři, Nákladová struktura
          </div>
        </GlassBox>
        {/* Lean Canvas */}
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.fis}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.fis, fontFamily: fontSans, marginBottom: 2 }}>✏️ Lean Canvas</div>
          <div style={{ fontSize: 11, color: VSE.fis, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= Skeč startupu na ubrousku</div>
          <Bullet items={[
            "Pro startupy a nové nápady",
            "Má se průběžně měnit (iterace)",
            "Vychází z BMC",
            "Obsahuje metriky výkonnosti",
            "Cíl: jedna A4, rychlá prezentace, kontrola rizik",
          ]} color={VSE.fis} />
        </GlassBox>
      </div>
      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.7 }}>
        <b style={{ color: VSE.warning }}>Kdy co použít:</b><br/>
        → Zakládáš startup? → <b>Lean Canvas</b><br/>
        → Analyzuješ zavedenou firmu? → <b>BMC</b>
      </div>
      {/* Komise Svobodová */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE SVOBODOVÁ — CHCE POPIS VŠECH ČÁSTÍ!</div>
          <span>Svobodová chce popsat <b>jednotlivé bloky</b> BMC a LC. Znát všech 9 bloků BMC nazpaměť.</span>
        </div>
      </div>
    </div>) },

  { id: "gass", title: "Gassmann — inovace business modelu", subtitle: "= Kuchařka s 55 osvědčenými recepty", color: VSE.fm, emoji: "lightbulb",
    content: (<div>
      <Def color={VSE.fm}>
        Gassmann identifikoval <b>55 originálních podnikatelských modelů</b>. <b>90 % všech modelů jsou adaptace a kombinace</b> existujících. K inovaci business modelu musíme změnit <b>alespoň 2 ze 4 prvků</b>.
      </Def>
      <Tag color={VSE.fm}>4 otázky Gassmanna — naučit nazpaměť!</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 8 }}>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: "var(--text-muted)", fontWeight: 700 }}>OTÁZKA</div>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: VSE.fm, fontWeight: 700, textAlign: "left" }}>CO ZNAMENÁ</div>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: VSE.fis, fontWeight: 700, textAlign: "left" }}>PŘÍKLAD (NETFLIX)</div>
        {[
          ["KDO?", "Cíloví zákazníci", "Domácnosti bez kabelovky"],
          ["CO?", "Co nabízíme", "Neomezený streaming"],
          ["JAK?", "Jak generujeme příjmy", "Měsíční předplatné"],
          ["HODNOTA?", "Proč je to hodnotné", "Neplatíš kabelovku, sleduj kdykoli"],
        ].map((row, i) => (
          <Fragment key={i}>
            <div style={{ fontSize: 12, fontFamily: fontMono, fontWeight: 700, color: VSE.ffu, padding: "6px 0", borderTop: `1px solid var(--border)` }}>{row[0]}</div>
            <div style={{ fontSize: 11.5, fontFamily: fontSans, color: "var(--text)", padding: "6px 0", borderTop: `1px solid var(--border)` }}>{row[1]}</div>
            <div style={{ fontSize: 11.5, fontFamily: fontSans, color: "var(--text-muted)", padding: "6px 0", borderTop: `1px solid var(--border)` }}>{row[2]}</div>
          </Fragment>
        ))}
      </div>
      <Tag color={VSE.danger}>Postup inovace (4 kroky)</Tag>
      <Bullet items={[
        "1. Analýza 4 otázek na současný model",
        "2. Porovnání s 55 existujícími vzory → vytvoř si vlastní",
        "3. Kontrola konzistence (pasují odpovědi k sobě?)",
        "4. Implementace — test → praxe",
      ]} color={VSE.danger} />
      {/* Komise Smrčka */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE SMRČKA — POZOR!</div>
          <span>Smrčka chce jasně slyšet, že pro inovaci BM stačí změnit <b>minimálně 2 ze 4 prvků</b> — ne všechny. A znát, že je <b>55 existujících vzorů</b>.</span>
        </div>
      </div>
    </div>) },

  { id: "inovmng", title: "Inovace managementu — nejsilnější KV", subtitle: "Pyramida, S-křivka, 5 výzev", color: VSE.primary, emoji: "bolt",
    content: (<div>
      <Def color={VSE.primary}>
        <b>Inovace managementu</b> = změna způsobu, kterým se realizuje výkon managementu. <b>Není to nový produkt, ale nový způsob řízení.</b>
      </Def>
      <Tag color={VSE.ffu}>Pyramida inovací — zdola nahoru (lehké → těžké)</Tag>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
        {[
          { level: 4, label: "Inovace MANAGEMENTU", note: "Nejtěžší, největší KV — 10+ let", color: VSE.danger, width: "40%" },
          { level: 3, label: "Inovace strategie a cílů", note: "Nová strategie, nové cíle", color: VSE.fmv, width: "60%" },
          { level: 2, label: "Inovace výrobků a služeb", note: "Produktová — KV 1-2 roky", color: VSE.fis, width: "80%" },
          { level: 1, label: "Inovace provozních činností", note: "Nejlehčí — procesní zlepšení", color: VSE.success, width: "100%" },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: row.width, background: `${row.color}15`, border: `1px solid ${row.color}40`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: row.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, fontFamily: fontMono, flexShrink: 0 }}>{row.level}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: row.color, fontFamily: fontSans }}>{row.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: fontSans }}>{row.note}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Tag color={VSE.success}>Proč inovace managementu dává nejsilnější KV</Tag>
      <Bullet items={[
        "Hard to copy — hluboko zakořeněná v kultuře firmy",
        "Systémový dopad — nemění produkt, ale celé myšlení",
        "Dlouhodobá — 10+ let vs. produkt 1-2 roky",
      ]} color={VSE.success} />
      <Tag color={VSE.fis}>S-křivka inovace</Tag>
      <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>
        Každá inovace má svůj <b>životní cyklus</b>. Když dosáhne zralosti, musíš přijít s novou — jinak tě konkurence předběhne.
      </div>
      <Tag color={VSE.danger}>5 výzev pro inovaci managementu (podle Hamela)</Tag>
      <Bullet items={[
        "Demokracie nápadů — když nemůžeš mluvit uvnitř, stěžuješ si externě",
        "Zesílení lidské přitažlivosti — máme zdroje udělat ze zaměstnanců inovátory?",
        "Relokace zdrojů — manažeři pod tlakem kvartálních cílů, nechtějí riskovat",
        "Zbavit se zaběhnutých mentálních modelů — staré myšlení blokuje nové",
        "Dát příležitost všem — ne jen top managementu",
      ]} color={VSE.danger} />
      {/* Přirozená vsuvka — Google 20 % */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — GOOGLE 20 %</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          Inženýři v Google 1 den v týdnu dělají cokoli chtějí. Takhle vznikl <b>Gmail, Google News a AdSense</b>. Tohle není produktová inovace — je to <b>inovace managementu</b>. Konkurence to nezkopíruje rok — kopíruje desetiletí (a většina firem to stejně neumí).
        </div>
      </GlassBox>
    </div>) },

];

const flashcards1 = [
  { term: "Management (definice)", def: "Souhrn činností potřebných pro zabezpečení chodu organizace. Správná volba cest, prostředků a nástrojů prostřednictvím lidí.", tag: "DEFINICE" },
  { term: "3 způsoby chápání mng", def: "1) Globální prosperita a růst. 2) Cesta naplnění účelů a cílů org. 3) Proces (plánování, organizování, řízení, kontrolování).", tag: "DEFINICE" },
  { term: "Klasický management", def: "1890-1930. Taylor, Ford, Baťa. Vědecké řízení, člověk = stroj. Proces a efektivita.", tag: "FÁZE VÝVOJE" },
  { term: "Moderní management", def: "1931-1970. Sociální prvky. Maslow, McGregor, Herzberg. Lidský kapitál důležitý.", tag: "FÁZE VÝVOJE" },
  { term: "Post-moderní management", def: "1980-2000. Ropné šoky, nabídka > poptávka. Drucker, MBO. Zakázková produkce.", tag: "FÁZE VÝVOJE" },
  { term: "Birkinshaw 4 dimenze", def: "Koordinace (byrokracie/emergence), Rozhodování (hierarchie/CW), Cíle (alignment/obliquity), Motivace (extrinsic/intrinsic).", tag: "KLÍČOVÝ POJEM" },
  { term: "Business Model", def: "Vysvětluje KDO jsou zákazníci, JAK vyděláváme, CO nabízíme. Není strategie, ale její součást.", tag: "BM vs MM" },
  { term: "Management Model", def: "JAK řídím organizaci. Birkinshawovy 4 dimenze — volba pólů koordinace, rozhodování, cílů, motivace.", tag: "BM vs MM" },
  { term: "BMC vs Lean Canvas", def: "BMC: starší, složitější, pro etablované firmy, bez metrik. LC: pro startupy, iterativní, má metriky, jedna A4.", tag: "MODELY" },
  { term: "Gassmann 4 otázky", def: "KDO? (zákazníci), CO? (nabídka), JAK? (příjmy), HODNOTA? (proč). Změnit 2 ze 4 = inovace BM.", tag: "INOVACE BM" },
  { term: "Pyramida inovací mng", def: "Zdola: 1) Provozní činnosti, 2) Výrobky/služby, 3) Strategie a cíle, 4) Management (nejtěžší, největší KV).", tag: "INOVACE MNG" },
  { term: "S-křivka inovace", def: "Životní cyklus inovace. Ve fázi zralosti přijít s novou, jinak konkurence předstihne.", tag: "INOVACE MNG" },
  { term: "5 výzev pro inovaci mng", def: "Demokracie nápadů, Zesílení lidské přitažlivosti, Relokace zdrojů, Zbavit se mentálních modelů, Dát příležitost všem.", tag: "INOVACE MNG" },
  { term: "Birkinshaw 4 dimenze", def: "Koordinace · Odpovědnost · Cíle · Motivace. Podle těchto otázek se firmy liší v management modelu.", tag: "MODEL" },
  { term: "Innovation Pyramid (Hamel)", def: "Produktová (1-2 roky KV) → Strategická (3-5 let KV) → Manažerská (10+ let KV). Manažerská = nejsilnější.", tag: "MODEL" },
  { term: "Gassmannův framework", def: "Kdo je zákazník · Co nabízíme · Jak se to vyrábí · Proč je to ziskové. 4 dimenze byznys modelu.", tag: "MODEL" },
];

const quiz1 = [
  { q: "Co NENÍ jeden ze 3 způsobů chápání managementu?", opts: ["Zajistit globální prosperitu","Cesta naplnění účelů a cílů","Maximalizace zisku akcionářů","Proces plánování a řízení"], correct: 2 },
  { q: "Kdo je spojen s klasickým managementem?", opts: ["Maslow","Taylor","Drucker","Birkinshaw"], correct: 1 },
  { q: "Kolik dimenzí má Birkinshawův model?", opts: ["3","4","5","6"], correct: 1 },
  { q: "Lean Canvas je primárně určen pro:", opts: ["Etablované firmy","Startupy a nové nápady","Velké korporace","Neziskové organizace"], correct: 1 },
  { q: "Kolik prvků musíme změnit podle Gassmanna pro inovaci BM?", opts: ["1","2","3","Všechny 4"], correct: 1 },
  { q: "Co je na vrcholu pyramidy inovací?", opts: ["Inovace výrobků","Inovace strategie","Inovace managementu","Inovace procesů"], correct: 2 },
  { q: "Management Model podle Birkinshawa řeší:", opts: ["Komu prodáváme","Jak řídíme organizaci","Kolik vyděláváme","Jakou máme strategii"], correct: 1 },
  { q: "BMC oproti Lean Canvas:", opts: ["Je novější","Obsahuje metriky","Je pro etablované firmy","Je na jednu A4"], correct: 2 },
  { q: "Která Birkinshawova dimenze řeší motivaci?", opts: ["Managing Across Activities","Managing Down Decisions","Managing Objectives","Managing Individual Motivation"], correct: 3 },
  { q: "S-křivka v inovacích ukazuje:", opts: ["Náklady inovace","Životní cyklus inovace","Počet zaměstnanců","Tržní podíl"], correct: 1 },
  { q: "Co Birkinshaw definuje jako 4. dimenzi management modelu?", opts: ["Strategie", "Motivace", "Procesy", "Kultura"], correct: 1 },
  { q: "Která inovace má nejdelší dobu udržení KV (10+ let)?", opts: ["Produktová", "Strategická", "Manažerská", "Marketingová"], correct: 2 },
];

const praxe1 = {
  caseStudy: {
    company: "IKEA — byznys model, který změnil svět nábytku",
    subtitle: "Jak Ingvar Kamprad převrátil celé odvětví",
    content: (<>
      V 50. letech se nábytek v Evropě prodával jako luxus: drahý, těžký, doručený smontovaný. <b>Ingvar Kamprad</b> v IKEA to celé obrátil naruby a vytvořil úplně nový byznys model:<br/><br/>
      <b style={{ color: VSE.fmv }}>Zákazník dělá práci</b> — nábytek si odveze a sestaví sám, IKEA tím šetří na logistice a montážích.<br/>
      <b style={{ color: VSE.fis }}>Ploché balení</b> — na paletu se vejde 10× víc skříní, obrovská úspora na dopravě.<br/>
      <b style={{ color: VSE.nf }}>Obchoďák jako zážitek</b> — labyrintem projdeš kolem všeho, nahoře restaurace s masovými kuličkami.<br/>
      <b style={{ color: VSE.primary }}>Vlastní značka</b> — žádní zprostředkovatelé, design přímo z Švédska.<br/><br/>
      <b>Proč je to tak zajímavé:</b> IKEA neměla lepší židli než konkurence. Změnila <b>4 věci z Gassmanna najednou</b> (komu, co, jak a za kolik) — a vytvořila úplně nový trh. To je přesně to, co zkoušející chtějí slyšet na „inovaci business modelu”.
    </>),
    lessons: "IKEA ukazuje rozdíl mezi inovací produktu a inovací business modelu. Produktová inovace = lepší židle. BM inovace = úplně jiný způsob, jak se židle dostane k zákazníkovi. BM inovace je mnohem silnější, ale těžší ji zkopírovat."
  },
  miniExamples: [
    { company: "Netflix", tag: "LEAN CANVAS", color: VSE.danger, content: "Netflix začínal jako DVD v obálce. Testoval jednu hypotézu (platí lidé měsíčně za filmy bez poplatků za zpoždění?) — přesně jak popisuje Lean Canvas. Až pak přidal streaming a vlastní tvorbu. Kdyby začal rovnou jako HBO, zkrachoval by." },
    { company: "Tesla", tag: "PYRAMIDA INOVACÍ", color: VSE.fmv, content: "Tesla neinovuje jen auta (produkt), ale celou strategii (prodej bez dealerů, Gigafactory, autopilot). Proto je Tesla v pyramidě inovací výš než třeba Škoda — ta inovuje hlavně produkty." },
    { company: "Google Ads", tag: "MANAGEMENT MODEL", color: VSE.success, content: "Google má 20% pravidlo — inženýři můžou 1 den v týdnu dělat cokoli. Gmail a Google News vznikly takto. Netradiční management model, který by v klasické firmě nebyl možný." }
  ]
};

const examQuestions1 = [
  { komise: "6.2.2026 — Heřman, Schovancová, Vávra (Výroba kol)", otazka: "Výzvy 21. století v managementu (globalizace, turbulentní prostředí, automatizace, průmysl 4.0 - NEJSOU na otázce uvedeny). Zasadit do paradigmatu Birkinshaw", pozn: "Uplně pohodová komise, Heřman ani nechtěl políčka Lean Canvas/BM Canvas, očividně toho moc o inovacích moc sám nevěděl. Schovanocová byla hodná, chtěla jen minimum teorie, zejména aplikovat (říct, proč top-down tradiční paradigma nebude asi fungovat atd.), Vávra víceméně nechtěl nic kromě grafů a popsání těch fází - řekl jsem, kde jsou klasická ..." },
  { komise: "6.2.2026 — Mládková, Kolouchová, Mikan (Horská chata)", otazka: "Management diverzity - jaké dimenze jsou v managementu diverzity (věk, národnost...), výhody a nevýhody diverzity na pracovišti, aplikovat na případovku - řekl jsem, že by tam měli vzít studenty (dimenze věku), a možná přijmout více žen, protože tam je ta manželka, ale to se jim tolik nelíbílo, říkali, že by ta manželka stejně byla manželka majitele/spolumajitelka a víc žen v chatě by to moc neovlivnilo.", pozn: "Co bych doporučil nejvíc je Notebook LM. Já jsem tam říkal různý příklady (právě z podcastů, co notebook LM vytvořil) a komise říkala, že tyhle příklady ještě neslyšeli a že to je osvěžující. Tak jsem jim říkal, že jsem se učil pomocí toho Notebook LM a Mládková říkala, že to je asi důvod, proč celková kvalita vystoupení studentů u státnic v tom..." },
  { komise: "4.2.2025 — Vrbová, Tahal, Svobodová (Vinařská firma)", otazka: "Trendy v managementu, management modely (Birkinshaw), vztahnout na případovku" },
  { komise: "3.2.2025 — Bočková, Nový, Kolouchová (Software)", otazka: "Výzvy 21. století v managementu (globalizace, turbulentní prostředí, automatizace, průmysl 4.0,…) zasadit do paradigmatu Birkinshaw" },
  { komise: "27.1.2025 — Vrbová, Špaček, Machek (Připadovka: lázně)", otazka: "podrobne Canvas, HR controlling a žádný speciální vzorecky počítat, nic nechtěla Vrbová, takže asi nebude chtit nikdo" },
];

const podcast1 = { title: "Současné přístupy k managementu", description: "Stručný přehled BM vs MM, Birkinshaw, BMC vs Lean Canvas. 8 minut.", audioUrl: "/audio/mng-1.mp3", notebookLmUrl: null };

const examStrategy1 = `
  <b style="color:#A82A5F">1.</b> Definuj management (3 způsoby chápání).<br/>
  <b style="color:#A82A5F">2.</b> Rozliš BM vs MM jasně (Nový se ptá!).<br/>
  <b style="color:#A82A5F">3.</b> Birkinshaw 4 dimenze — napojit na okruhy 3, 4, 5.<br/>
  <b style="color:#A82A5F">4.</b> BMC vs Lean Canvas — pro koho + rozdíly (Svobodová).<br/>
  <b style="color:#A82A5F">5.</b> Gassmann — 4 otázky + <b>min. 2 změny</b> = inovace (Smrčka!).<br/>
  <b style="color:#A82A5F">6.</b> Pyramida inovací — proč MM inovace = nejsilnější KV.
`;

function OkruhMng1Panel() {
  return (
    <OkruhPanel
      subject="Management" subjectId="mng" number={1} title="Současné přístupy k managementu" subtitle="BM × MM / Birkinshaw / BMC vs LC / Inovace mng" color={VSE.ffu}
      questionText="Současné přístupy k managementu, business model a management model, inovace managementu."
      questionDesc="Definuj management, fáze vývoje, Birkinshaw 4 dimenze. Rozliš BM vs MM. BMC vs Lean Canvas. Gassmann. Pyramida inovací mng."
      sloz={2} roz={3} freq={2}
      examStrategy={examStrategy1}
      studySections={studySections1}
      flashcards={flashcards1}
      quiz={quiz1}
      praxe={praxe1}
      examQuestions={examQuestions1}
      podcast={podcast1}
    />
  );
}

/* ════════════════════════════════════════════════════════
   OKRUH 2 — Výzvy 21. století, paradigmata
   ════════════════════════════════════════════════════════ */
const studySections2 = [

  { id: "par", title: "Co je paradigma", subtitle: "Schéma myšlení + klíčové pojmy", color: VSE.primary, emoji: "brain",
    content: (<div>
      <Def color={VSE.primary}>
        <b>Paradigma</b> = přijímané schéma, vzorec myšlení či model. Soubor základních předpokladů a přístupů, které sdílíme v rámci oboru. <b>Posun paradigmatu</b> = zásadní změna v myšlení (např. od „člověk = stroj” k „člověk = kreativní bytost”).
      </Def>
      <Tag color={VSE.primary}>Klíčové pojmy — komise chce slyšet</Tag>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.danger}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.danger, fontFamily: fontSans, marginBottom: 2 }}>🦢 Černá labuť</div>
          <div style={{ fontSize: 11, color: VSE.danger, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 6, opacity: 0.85 }}>= Nečekaný blesk z čistého nebe</div>
          <Bullet items={[
            "Nečekaná událost s obrovským dopadem (COVID, 9/11, Lehman Brothers 2008)",
            "Po události se tváří, jakoby byla předvídatelná — ale nebyla",
          ]} color={VSE.danger} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.fmv}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fmv, fontFamily: fontSans, marginBottom: 2 }}>🌪️ Turbulence</div>
          <div style={{ fontSize: 11, color: VSE.fmv, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 6, opacity: 0.85 }}>= Letadlo v bouřce</div>
          <Bullet items={[
            "Rychlé změny ovlivňující osud firmy",
            "Firma musí umět reagovat v řádu týdnů, ne let",
          ]} color={VSE.fmv} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.fm}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fm, fontFamily: fontSans, marginBottom: 2 }}>🚫 Diskontinuita</div>
          <div style={{ fontSize: 11, color: VSE.fm, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 6, opacity: 0.85 }}>= Přetržená nit</div>
          <Bullet items={[
            "Nelze na základě předchozího vývoje předpovídat budoucnost",
            "Staré modely přestávají platit",
          ]} color={VSE.fm} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.fis}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fis, fontFamily: fontSans, marginBottom: 2 }}>⚡ Moorův zákon</div>
          <div style={{ fontSize: 11, color: VSE.fis, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 6, opacity: 0.85 }}>= Technologický Matterhorn</div>
          <Bullet items={[
            "Každé 2 roky se počet tranzistorů v čipu zdvojnásobí",
            "Výkon roste exponenciálně — staré firmy nestíhají",
          ]} color={VSE.fis} />
        </GlassBox>
      </div>
    </div>) },

  { id: "trad_post", title: "Tradiční × postmoderní paradigma", subtitle: "Dva světy managementu", color: VSE.ffu, emoji: "scale",
    content: (<div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.nf}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.nf, fontFamily: fontSans, marginBottom: 2 }}>📜 Tradiční paradigma</div>
          <div style={{ fontSize: 11, color: VSE.nf, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= Industriální továrna 20. století</div>
          <Bullet items={[
            "Stabilní prostředí + předvídatelnost",
            "Vítězí efektivita, standardizace, úspory z rozsahu",
            "Hierarchická kontrola, autokratické řízení",
            "Kvantita: vyrobit víc, levněji",
            "Příklad: ČEZ, ČSOB, výrobní koncerny",
          ]} color={VSE.nf} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.fis}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.fis, fontFamily: fontSans, marginBottom: 2 }}>🌐 Postmoderní paradigma</div>
          <div style={{ fontSize: 11, color: VSE.fis, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= Síť propojených uzlů</div>
          <Bullet items={[
            "Turbulentní prostředí + nepředvídatelnost",
            "Vítězí flexibilita, inovace, schopnost učit se",
            "Zploštělé struktury, coaching, partnerství",
            "Kvalita: přizpůsobit se zákazníkovi",
            "Příklad: Rohlík, Alza, tech scale-upy",
          ]} color={VSE.fis} />
        </GlassBox>
      </div>
      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Klíčová myšlenka:</b> Ani jedno paradigma není „lepší” — záleží na prostředí. Stabilní firma jede pořád dobře na tradičním. Tech scale-up bez postmoderního umře.
      </div>
      {/* Komise miluje */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE KOLOUCHOVÁ — CHCE VÝHODY A NEVÝHODY!</div>
          <span>Kolouchová chce identifikovat paradigma v PS a vyjmenovat <b>výhody/nevýhody</b> obou pólů. Nespokojí se jen s definicí.</span>
        </div>
      </div>
    </div>) },

  { id: "vyvoj", title: "Posun paradigmatu — dříve × nyní", subtitle: "Jak se konkrétně změnil management", color: VSE.ffu, emoji: "refresh",
    content: (<div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, borderRadius: 10, overflow: "hidden" }}>
        {[
          ["Dříve", "Nyní"],
          ["Autokratické řízení lidí", "Partnerství a coaching"],
          ["Autokratické hodnocení", "Hodnocení 360°"],
          ["Inovace z top managementu", "Konzultace s řadovými zaměstnanci"],
          ["Zaměření na zisk", "Zisk + CSR/ESG"],
          ["Řízení lidí", "Vedení a leadership"],
          ["Ustálené pracovní postupy", "Rozvoj a flexibilita"],
          ["Zaměření na individualitu", "Zaměření na týmy"],
        ].map((row, i) => (
          <Fragment key={i}>
            <div style={{ padding: "8px 12px", background: i === 0 ? `${VSE.ffu}20` : `${VSE.ffu}${i%2===0?"06":"03"}`, fontSize: 11.5, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? VSE.ffu : "var(--text)", fontFamily: fontSans, borderRight: `1px solid var(--border)` }}>{row[0]}</div>
            <div style={{ padding: "8px 12px", background: i === 0 ? `${VSE.fis}20` : `${VSE.fis}${i%2===0?"06":"03"}`, fontSize: 11.5, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? VSE.fis : "var(--text)", fontFamily: fontSans }}>{row[1]}</div>
          </Fragment>
        ))}
      </div>
    </div>) },

  { id: "vyzvy", title: "5 oblastí výzev 21. století", subtitle: "S čím se dnes firma potýká", color: VSE.danger, emoji: "bolt",
    content: (<div>
      <Def color={VSE.danger}>
        <b>Výzvy 21. století</b> = vnější faktory, které nutí firmu měnit management. Pokud firma nereaguje, konkurence ji předběhne.
      </Def>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <ModelCard name="🖥️ Technologie a internet" color={VSE.fis} items={[
          "AI, Moorův zákon, IoT",
          "Digitální dvojčata, robotizace",
          "Firmy expandují přes web",
          "Tempo digitální revoluce",
        ]} />
        <ModelCard name="👥 Lidský kapitál" color={VSE.fmv} items={[
          "Outsourcing, freelance, part-time (gig economy)",
          "Gen Y (work-life balance, smysluplná práce)",
          "Gen Z (neustále online, flexibilita, těžko uchopitelní)",
          "Volný pohyb osob a kapitálu",
        ]} />
        <ModelCard name="🌍 Globalizace" color={VSE.nf} items={[
          "Hyperkonkurence — volný pohyb kapitálu + osob",
          "Otevírání hranic mezi odvětvími",
          "Dodávání po celém světě (Amazon, Aliexpress)",
          "Vliv cizích ekonomik na firmu přes půl světa",
        ]} />
        <ModelCard name="🌪️ Turbulentní prostředí" color={VSE.danger} items={[
          "Rychlé tempo inovací, černé labutě",
          "Zprávy z celého světa do pár minut",
          "Masový názor na sociálních sítích → vliv na značku",
          "Firma musí být agilní",
        ]} />
        <ModelCard name="🌱 Další vlivy (ESG)" color={VSE.fph} items={[
          "Environment — klimatická krize, udržitelnost",
          "Zkracování životních cyklů produktů",
          "Hodnotové sítě — partnerství dodavatelů a odběratelů",
          "Etika a odpovědnost",
        ]} />
      </div>
    </div>) },

  { id: "prumysl", title: "Průmysl 4.0", subtitle: "= Továrna, která myslí sama", color: VSE.fm, emoji: "hive",
    content: (<div>
      <Def color={VSE.fm}>
        <b>Průmysl 4.0</b> = čtvrtá průmyslová revoluce. Propojení fyzického a digitálního světa — stroje komunikují mezi sebou, výroba se přizpůsobuje zákazníkovi.
      </Def>
      <Tag color={VSE.fm}>Klíčové technologie</Tag>
      <Bullet items={[
        "AI a machine learning — stroje predikují poruchy",
        "IoT (Internet věcí) — senzory na všem, data o všem",
        "3D tisk — prototypy v hodinách, ne týdnech",
        "Big Data + Cloud — rozhodování na datech, ne intuici",
        "Rozšířená realita — vzdálená údržba, zaškolení",
      ]} color={VSE.fm} />
      <Tag color={VSE.primary}>Důsledky pro management</Tag>
      <Bullet items={[
        "Plně automatizované závody — člověk v roli IT operátora na dálku",
        "Mění se požadavky na vzdělání (technické + IT dovednosti)",
        "60 % dnešních školáků bude pracovat v profesích, které ještě neexistují",
        "Globální firmy vytvářejí centra sdílených služeb",
      ]} color={VSE.primary} />
      {/* Přirozená vsuvka — Škoda Auto */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — ŠKODA AUTO V MLADÉ BOLESLAVI</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          V Mladé Boleslavi jezdí <b>AGV roboti</b> po hale bez řidiče a vozí díly. Výrobní linky si samy hlásí, kdy potřebují údržbu. Tohle není sci-fi — je to Průmysl 4.0 <b>v ČR, dnes</b>. Dobrý příklad, pokud dostaneš PS s výrobní firmou.
        </div>
      </GlassBox>
    </div>) },

  { id: "csr", title: "CSR × CSV", subtitle: "Od charity ke strategii", color: VSE.fph, emoji: "star",
    content: (<div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.fph}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.fph, fontFamily: fontSans, marginBottom: 2 }}>🎗️ CSR</div>
          <div style={{ fontSize: 11, color: VSE.fph, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 4, opacity: 0.85 }}>= Firemní charita</div>
          <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", marginBottom: 8 }}>Corporate Social Responsibility</div>
          <Bullet items={[
            "Dobrovolné aktivity NAD rámec zákona",
            "Filantropie, komunita, životní prostředí",
            "Často vnímáno jako náklad",
            "Typicky: sponzoring, darování, dobrovolnictví",
          ]} color={VSE.fph} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: 14, borderLeft: `4px solid ${VSE.fis}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.fis, fontFamily: fontSans, marginBottom: 2 }}>🤝 CSV</div>
          <div style={{ fontSize: 11, color: VSE.fis, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 4, opacity: 0.85 }}>= Win-win byznys model</div>
          <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", marginBottom: 8 }}>Creating Shared Value (Porter, Kramer 2011)</div>
          <Bullet items={[
            "Společenská hodnota + zisk firmy zároveň",
            "Součást STRATEGIE, ne charita",
            "Konkurenční výhoda (Porter: CSV = KV)",
            "Typicky: udržitelný produkt, který je ziskový",
          ]} color={VSE.fis} />
        </GlassBox>
      </div>
      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Rozdíl jednou větou:</b> CSR dáváš peníze mimo firmu, CSV firma vydělává tím, že je odpovědná.
      </div>
      {/* Přirozená vsuvka — Patagonia */}
      <GlassBox opacity={0.5} style={{ marginTop: 10, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — PATAGONIA</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          Patagonia neříká jen „dáváme 1 % na ekologii” (CSR). Celá <b>strategie</b> je postavená na udržitelnosti — opravuje oblečení, vykupuje použité kusy. Ekologie není náklad, je to <b>konkurenční výhoda</b> (CSV). Proto má kultovní fanoušky a firma roste dvojciferně.
        </div>
      </GlassBox>
    </div>) },

  { id: "birk_link", title: "Propojení s Birkinshawem", subtitle: "Jak výzvy mění management model firmy", color: VSE.ffu, emoji: "compass",
    content: (<div>
      <Def color={VSE.ffu}>
        Výzvy 21. století <b>tlačí firmy z tradičního Birkinshawova pólu</b> (byrokracie, hierarchie, alignment, extrinsic) <b>k modernímu</b> (emergence, collective wisdom, obliquity, intrinsic).
      </Def>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 6, marginTop: 10 }}>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: "var(--text-muted)", fontWeight: 700 }}>VÝZVA</div>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: VSE.ffu, fontWeight: 700 }}>TLAČÍ BIRKINSHAWOVU DIMENZI</div>
        {[
          ["Turbulence → rychlá reakce", "Koordinace: byrokracie → emergence"],
          ["Znalostní práce → lidé ví víc než šéf", "Rozhodování: hierarchie → collective wisdom"],
          ["Nepředvídatelnost trhu", "Cíle: alignment → obliquity"],
          ["Gen Y/Z → smysluplná práce", "Motivace: extrinsic → intrinsic"],
        ].map((row, i) => (
          <Fragment key={i}>
            <div style={{ fontSize: 11.5, fontFamily: fontSans, color: "var(--text)", padding: "8px 0", borderTop: `1px solid var(--border)` }}>{row[0]}</div>
            <div style={{ fontSize: 11.5, fontFamily: fontSans, color: VSE.ffu, padding: "8px 0", borderTop: `1px solid var(--border)`, fontWeight: 600 }}>{row[1]}</div>
          </Fragment>
        ))}
      </div>
      {/* Komise miluje */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 14, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE BOČKOVÁ / HEŘMAN — PROPOJIT S BIRKINSHAWEM!</div>
          <span>Chtějí vidět, že umíš propojit okruh 2 (výzvy) s okruhem 1 (Birkinshaw). <b>Nejen je vyjmenovat samostatně.</b> Tohle je tvá výhoda proti ostatním studentům.</span>
        </div>
      </div>
    </div>) },

];

const flashcards2 = [
  { term: "Paradigma", def: "Přijímané schéma, vzorec myšlení či model. Posun paradigmatu = zásadní změna v přístupu k managementu.", tag: "DEFINICE" },
  { term: "Černá labuť", def: "Nečekaná událost s velkým dopadem. COVID, 9/11, finanční krize 2008.", tag: "KONCEPT" },
  { term: "Turbulence", def: "Události ovlivňující osud firmy. Rychlé změny prostředí, nelze předvídat.", tag: "KONCEPT" },
  { term: "Diskontinuita", def: "Nelze na základě předchozího vývoje předpovídat budoucnost.", tag: "KONCEPT" },
  { term: "Moorův zákon", def: "Každý rok se počet tranzistorů zdvojnásobí. Exponenciální růst technologií.", tag: "TECHNOLOGIE" },
  { term: "Generace Y", def: "Work-life balance, smysluplná práce, znalost IT a jazyků.", tag: "LIDSKÝ KAPITÁL" },
  { term: "Generace Z", def: "Neustále online, freelance, těžce uchopitelná pro firmy.", tag: "LIDSKÝ KAPITÁL" },
  { term: "Hyperkonkurence", def: "Důsledek globalizace — volný pohyb osob, zboží, kapitálu otevírá hranice mezi odvětvími.", tag: "GLOBALIZACE" },
  { term: "Průmysl 4.0", def: "4. průmyslová revoluce: AI, 3D tisk, robotizace, chytré továrny, IoT, customizace.", tag: "TREND" },
  { term: "CSR", def: "Corporate Social Responsibility — dobrovolné aktivity firmy nad rámec zákona. Filantropie, komunita, environment.", tag: "CSR vs CSV" },
  { term: "CSV", def: "Creating Shared Value (Porter) — win-win, firma profituje a zároveň přispívá společnosti. Součást strategie.", tag: "CSR vs CSV" },
  { term: "Vývoj: řízení → vedení", def: "Dříve autokrativní řízení → nyní partnerství, coaching, leadership, hodnocení 360.", tag: "PARADIGMA" },
  { term: "5 výzev pro mng", def: "Technologie, lidský kapitál, globalizace, turbulentní prostředí, další vlivy (environment, hodnotové sítě).", tag: "KLÍČOVÝ POJEM" },
  { term: "VUCA", def: "Volatility, Uncertainty, Complexity, Ambiguity. Charakteristika světa 21. století.", tag: "POJEM" },
  { term: "Postmoderní paradigma", def: "Flexibilita, plochá struktura, kolektivní moudrost, smysl > zisk. Kontrast k tradičnímu paradigmatu.", tag: "PARADIGMA" },
  { term: "Generace Y/Z", def: "Mladší zaměstnanci chtějí work-life balance, smysluplnou práci, flexibilitu, ne hierarchii.", tag: "TREND" },
];

const quiz2 = [
  { q: "Co je paradigma v kontextu managementu?", opts: ["Finanční ukazatel","Přijímané schéma/vzorec myšlení","Organizační struktura","Typ strategie"], correct: 1 },
  { q: "Co je černá labuť?", opts: ["Běžná událost","Plánovaný risk","Nečekaná událost s velkým dopadem","Marketingový termín"], correct: 2 },
  { q: "Moorův zákon říká, že:", opts: ["Zisky rostou lineárně","Počet tranzistorů se zdvojnásobí","Počet zaměstnanců klesá","Cena technologií stagnuje"], correct: 1 },
  { q: "Generace Z je charakteristická:", opts: ["Loajalitou k zaměstnavateli","Prací v továrně","Neustále online, freelance","Odporem k technologiím"], correct: 2 },
  { q: "CSV oproti CSR:", opts: ["Je jen charita","Je součást strategie, win-win","Nezajímá se o společnost","Je povinné ze zákona"], correct: 1 },
  { q: "Průmysl 4.0 NEZAHRNUJE:", opts: ["3D tisk","AI","Ruční montáž","Robotizaci"], correct: 2 },
  { q: "Hyperkonkurence vzniká díky:", opts: ["Monopolu","Globalizaci a volnému pohybu","Státní regulaci","Snížení poptávky"], correct: 1 },
  { q: "Dříve: autokrativní hodnocení → Nyní:", opts: ["Žádné hodnocení","Hodnocení 360","Jen finanční metriky","Hodnocení šéfem"], correct: 1 },
  { q: "Který trend NEPATŘÍ mezi trendy v managementu?", opts: ["Zplošťování struktur","Globalizace vs Lokalizace","Centralizace moci","Etika"], correct: 2 },
  { q: "Diskontinuita znamená:", opts: ["Stabilní vývoj","Nelze předpovídat budoucnost z minulosti","Plynulý růst","Opakující se cyklus"], correct: 1 },
  { q: "Co znamená 'C' v zkratce VUCA?", opts: ["Capacity", "Complexity", "Change", "Continuity"], correct: 1 },
  { q: "Co charakterizuje postmoderní paradigma?", opts: ["Tvrdá hierarchie", "Flexibilita a smysl > zisk", "Centralizace", "Standardizace"], correct: 1 },
];

const praxe2 = {
  caseStudy: {
    company: "Nokia — jak černá labuť zabila krále mobilů",
    subtitle: "Klasika turbulentního prostředí",
    content: (<>
      V roce 2007 ovládala Nokia 49 % trhu s mobily. O pět let později byla firma na prodej. Co se stalo? Přesně to, co popisují <b>výzvy 21. století</b>:<br/><br/>
      <b style={{ color: VSE.danger }}>Černá labuť</b> → v roce 2007 Apple představil iPhone. Nokia se tomu smála — „nemá to klávesnici, nikdo to nekoupí”.<br/>
      <b style={{ color: VSE.fmv }}>Rychlé tempo inovací</b> → zatímco Nokia pracovala 3 roky na novém telefonu, Apple vypustil App Store a třetí strany vytvořily 500 000 aplikací.<br/>
      <b style={{ color: VSE.nf }}>Zkracování životního cyklu</b> → dřív mobil vydržel 5 let. Po iPhonu 2 roky. Nokia nedokázala tak rychle inovovat.<br/>
      <b style={{ color: VSE.primary }}>Staré paradigma</b> → Nokia myslela „hardware”. Apple myslel „platforma s ekosystémem”.<br/><br/>
      <b>Výsledek:</b> Microsoft koupil Nokia Mobile za 7 miliard v roce 2014 a o rok později celou divizi zavřel. Nokia dnes dělá síťové prvky pro operátory — o mobilech už ani nemluví.
    </>),
    lessons: "Nokia je učebnicový příklad toho, co se stane firmě, která ignoruje výzvy 21. století. Nebyla to špatná firma — byla to firma optimalizovaná pro jiný svět. To je rozdíl mezi tradičním a postmoderním paradigmatem: v tradičním paradigmatu vítězí efektivita, v postmoderním flexibilita."
  },
  miniExamples: [
    { company: "Patagonia", tag: "CSR → CSV", color: VSE.success, content: "Patagonia neříká jen „dáváme 1% na ekologii” (klasické CSR). Celá strategie firmy je postavená na udržitelnosti — opravuje oblečení, vykupuje použité kusy. Ekologie není náklad, je to konkurenční výhoda (CSV). Proto má kultovní fanoušky." },
    { company: "Škoda Auto", tag: "PRŮMYSL 4.0", color: VSE.nf, content: "V Mladé Boleslavi jsou AGV roboti, kteří vozí díly bez řidiče. Výrobní linky si samy hlásí, kdy je potřeba údržba. To je Průmysl 4.0 v praxi — stroje komunikují mezi sebou bez lidí." },
    { company: "TikTok", tag: "HYPERKONKURENCE", color: VSE.fm, content: "TikTok vstoupil na trh, kde dominoval Instagram. Během 3 let získal miliardu uživatelů. Ukázka hyperkonkurence — kvůli otevřenému trhu a volnému pohybu kapitálu může kdokoli odkudkoli sebrat trh zavedeným hráčům." }
  ]
};

const examQuestions2 = [
  { komise: "6.2.2026 — Heřman, Schovancová, Vávra (Výroba kol)", otazka: "Výzvy 21. století v managementu (globalizace, turbulentní prostředí, automatizace, průmysl 4.0 - NEJSOU na otázce uvedeny). Zasadit do paradigmatu Birkinshaw", pozn: "Uplně pohodová komise, Heřman ani nechtěl políčka Lean Canvas/BM Canvas, očividně toho moc o inovacích moc sám nevěděl. Schovanocová byla hodná, chtěla jen minimum teorie, zejména aplikovat (říct, proč top-down tradiční paradigma nebude asi fungovat atd.), Vávra víceméně nechtěl nic kromě grafů a popsání těch fází - řekl jsem, kde jsou klasická ..." },
  { komise: "13.6.2025 — Cejthamr, Machek, Heřman (Tchibo)", otazka: "Výzvy 21. století, paradigmata" },
  { komise: "10.6.2025 — Mikovcová, Vávra, Viktora (Lázně)", otazka: "Výzvy 21. stol, Paradigmata, aplikace na případovku", pozn: "Viktora se hodně doptával, co je to konkrétně, nebyl spokojený jen s teorií a vyjmenováním, chtěl hodně z praxe, ptal se i na AI v managementu jaké má/bude mít dopady a co by konkrétně v odvětví lázní se mělo/mohlo v managementu změnit; Mikovcová sice se doptávala, ale i tak bylo vidět, že to chce dát a nedělat peklo; Vávra v pohodě, stačilo mu ..." },
  { komise: "10.6.2025 — Stříteský, Andera, Kučera (Developerská společnost)", otazka: "Výzvy pro management ve 21. století, paradigmata, dalo se dobře aplikovat na případovku", pozn: "Všichni 3 mi přišli vpohodě, Kučera si chtěl povídat jakoby víc filozoficky o managementu a některý věci se ptal spíš jakoby z logiky než co by bylo napsaný v učebnici, celkově teorii tolik nechtěli a na případovku to šlo všecko dobře aplikovat" },
  { komise: "9.6.2025 — Abíková, Kolouchová, Smrčka (Nejake trubky nevim resil jsem management)", otazka: "Management 21. stoleti, zminit i historii vyvoje managementu, paradigmata, aplikovat na pripadovku" },
  { komise: "4.2.2025 — Mikovcová, Kolouchová, Viktora (Firma vyrábějící hrnce)", otazka: "Vyzvy 21. stoleti. Paradigma." },
  { komise: "3.2.2025 — Bočková, Nový, Kolouchová (Software)", otazka: "Výzvy 21. století v managementu (globalizace, turbulentní prostředí, automatizace, průmysl 4.0,…) zasadit do paradigmatu Birkinshaw" },
  { komise: "29.1.2025 — Vávra, Mládková, Svobodová (případovka: lázně)", otazka: "Výzvy 21. století. Porovnat tradiční a postmoderní paradigmata, (co to je paradigma), najít výzvy 21. století v CS, identifikovat paradigma v CS, říct výhody a nevýhod." },
];

const podcast2 = { title: "Výzvy 21. století", description: "Paradigmata, Průmysl 4.0, CSR vs CSV. 8 minut.", audioUrl: "/audio/mng-2.mp3", notebookLmUrl: null };

const examStrategy2 = `
  <b style="color:#A82A5F">1.</b> Definuj paradigma + klíčové pojmy (černá labuť, turbulence, diskontinuita).<br/>
  <b style="color:#A82A5F">2.</b> Tradiční vs postmoderní paradigma — <b>výhody a nevýhody</b> (Kolouchová!).<br/>
  <b style="color:#A82A5F">3.</b> 5 oblastí výzev 21. století (technologie, lidé, globalizace, turbulence, ESG).<br/>
  <b style="color:#A82A5F">4.</b> Průmysl 4.0 — AI, IoT, smart továrny.<br/>
  <b style="color:#A82A5F">5.</b> CSR → CSV (Porter).<br/>
  <b style="color:#A82A5F">6.</b> <b>Propojit s Birkinshawem</b> (Bočková/Heřman!) — výzvy tlačí firmy k modernímu pólu.<br/>
  <b style="color:#A82A5F">7.</b> ⚠️ U Viktory: přeskočit teorii, rovnou identifikovat výzvy v PS.
`;

function OkruhMng2Panel() {
  return (
    <OkruhPanel
      subject="Management" subjectId="mng" number={2} title="Výzvy 21. století" subtitle="Paradigmata / Birkinshaw / Průmysl 4.0 / CSR vs CSV" color={VSE.ffu}
      questionText="Výzvy 21. století, porovnat tradiční a postmoderní paradigmata. Aplikovat na případovku."
      questionDesc="Co je paradigma. Najít výzvy 21. století v PS. Identifikovat paradigma v PS. Říct výhody a nevýhody. Průmysl 4.0. CSR vs CSV."
      sloz={2} roz={3} freq={2}
      examStrategy={examStrategy2}
      studySections={studySections2}
      flashcards={flashcards2}
      quiz={quiz2}
      praxe={praxe2}
      examQuestions={examQuestions2}
      podcast={podcast2}
    />
  );
}

/* ════════════════════════════════════════════════════════
   OKRUH 5 — Plánování (Alignment × Obliquity)
   ════════════════════════════════════════════════════════ */
const studySections5 = [

  { id: "intro5", title: "Co je plánování", subtitle: "Birkinshawova dimenze č. 3", color: VSE.ffu, emoji: "target",
    content: (<div>
      <Def color={VSE.ffu}>
        <b>Plánování</b> = stanovení cíle a cesty, která k němu vede. Příprava na budoucnost, minimalizace rizika, alokace zdrojů, stanovení priorit. <b>Birkinshawova dimenze č. 3 (Managing Objectives):</b> Tradiční pól = <b>Alignment</b> ↔ Moderní pól = <b>Obliquity</b>.
      </Def>
      <Tag color={VSE.ffu}>Jednoduchá otázka pro firmu</Tag>
      <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.ffu}`, borderRadius: 12, marginTop: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 10 }}>🎯 „Jdeme rovnou k cíli, nebo hledáme cestu za pochodu?”</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
          <div>→ <b style={{ color: VSE.ffu }}>Rovnou</b> = Alignment (jasné KPI, tvrdé cíle)</div>
          <div>→ <b style={{ color: VSE.fis }}>Za pochodu</b> = Obliquity (flexibilita, hledáme inovaci)</div>
        </div>
      </GlassBox>
    </div>) },

  { id: "align", title: "Alignment — přímé cíle", subtitle: "= GPS navigace — zadáš cíl, algoritmus tě dovede", color: VSE.ffu, emoji: "pillar",
    content: (<div>
      <Def color={VSE.ffu}>
        Stanovení cílů <b>přímo</b> — zaměstnanci dělají úkony, aby bylo dosaženo společného cíle. Tradiční přístup: <b>úkol, odměna, trest</b>. Přednost <b>shareholderů</b> (akcionářů).
      </Def>
      <Tag color={VSE.ffu}>Klíčové principy</Tag>
      <Bullet items={[
        "Cíle jsou stanoveny shora dolů (od CEO k pracovníkovi)",
        "Odpovídá na otázku CO (ne PROČ)",
        "Jednoznačně měřitelné výsledky",
        "Krátkodobý horizont (kvartální, roční)",
      ]} color={VSE.ffu} />

      <Tag color={VSE.ffu}>Nástroje alignmentu</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { name: "MBO", full: "Management by Objectives", what: "Cíle kaskádově od CEO k pracovníkovi. Zajímá mě CO, ne JAK." },
          { name: "KPI", full: "Key Performance Indicators", what: "Měřitelné ukazatele výkonnosti. Náklady, kvalita, čas, růst." },
          { name: "BSC", full: "Balanced Scorecard", what: "4 perspektivy: Finance, Procesy, Zákazníci, Učení." },
        ].map((n, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.ffu}`, borderRadius: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: VSE.ffu, fontFamily: fontMono, marginBottom: 2 }}>{n.name}</div>
            <div style={{ fontSize: 10.5, color: VSE.ffu, fontFamily: fontSans, fontStyle: "italic", marginBottom: 6, opacity: 0.8 }}>{n.full}</div>
            <div style={{ fontSize: 11.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5 }}>{n.what}</div>
          </GlassBox>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        <PlusMinus type="plus" items={[
          "Jednoduché řízení (1 jasný cíl)",
          "Všechny zdroje na splnění",
          "Jasné KPI, měřitelnost",
        ]} />
        <PlusMinus type="minus" items={[
          "Zaměstnanci se neztotožňují s cílem",
          "Přednost krátkodobých cílů",
          "Limituje rozvoj a inovaci",
          "Odpovídá na CO, ne PROČ",
        ]} />
      </div>
      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Příklad:</b> McDonald's — hamburger za 90 sekund, přesný recept globálně.
      </div>
    </div>) },

  { id: "obliq", title: "Obliquity — nepřímé cíle", subtitle: "= Jízda na horském kole — cíl vidíš, ale cestu hledáš přes překážky", color: VSE.fis, emoji: "hive",
    content: (<div>
      <Def color={VSE.fis}>
        Cíle nemohou být přesně nadefinovány — okolí se pořád mění. Základ = <b>OKR (Objectives and Key Results)</b>. Cesta je cíl. Zisk přijde jako důsledek. Přednost <b>stakeholderů</b>.
      </Def>
      <Tag color={VSE.fis}>Klíčové principy</Tag>
      <Bullet items={[
        "Cíle nedefinuje jen CEO, ale i zaměstnanci",
        "Odpovídá na otázku PROČ (ne CO)",
        "Flexibilita a iterace",
        "Dlouhodobý horizont",
      ]} color={VSE.fis} />

      <Tag color={VSE.fis}>3 přístupy k obliquity</Tag>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.fis}`, borderRadius: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: VSE.fis, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, fontFamily: fontMono }}>1</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fis, fontFamily: fontSans }}>Nepřímý cíl</div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5 }}>Skrz nepřímý cíl dosahuješ ultimátní cíl.<br/><span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>→ Univerzity: učí studenty → přilákají investory<br/>→ Firma: spokojení zaměstnanci → lepší zisk</span></div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.fis}`, borderRadius: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: VSE.fis, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, fontFamily: fontMono }}>2</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fis, fontFamily: fontSans }}>Kreativní cíl</div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5 }}>Volnost v činnostech vede k inovacím.<br/><span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>→ Google 20 % — inženýři 1 den v týdnu na vlastních projektech<br/>→ Vznikly: Gmail, AdSense, Google News</span></div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.fis}`, borderRadius: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: VSE.fis, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, fontFamily: fontMono }}>3</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fis, fontFamily: fontSans }}>Krok do neznáma (skok víry)</div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5 }}>Věřit, že zisk není na prvním místě.<br/><span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>→ Více stakeholderů než jen akcionáři<br/>→ Podpora komunity, lokální zaměstnávání, CSR/CSV</span></div>
        </GlassBox>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        <PlusMinus type="plus" items={[
          "Spokojenost zaměstnanců",
          "Nízká fluktuace",
          "Podpora inovací",
          "Vyšší flexibilita",
        ]} />
        <PlusMinus type="minus" items={[
          "Finanční riziko",
          "Organizační riziko",
          "Vyšší míra chaosu",
          "Pomalý feedback",
        ]} />
      </div>
      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Příklad:</b> IKEA — levný nábytek dostupný pro všechny. Zisk je důsledek poslání.
      </div>

      {/* Zajímavost — 3M Post-It */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — 3M A POST-IT</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          Firma 3M má už od 40. let <b>15 % pravidlo</b> — inženýři můžou 15 % času pracovat na vlastních projektech. V 70. letech Spencer Silver hledal super-silné lepidlo. Vyrobil super-slabé — na nic se nehodilo. Bez 15 % pravidla by to hodil do koše. Jeho kolega Art Fry ho ale použil jako záložku do zpěvníku v kostele. <b>Vznikl Post-It</b> — produkt za miliardy dolarů. Obliquity v čisté podobě.
        </div>
      </GlassBox>
    </div>) },

  { id: "mbo_okr", title: "MBO × OKR — porovnání", subtitle: "Nástroj alignmentu × nástroj obliquity", color: VSE.fm, emoji: "scale",
    content: (<div>
      <Def color={VSE.fm}>
        Komise často chce slyšet, <b>jaký je rozdíl mezi MBO a OKR</b>. Oba jsou o stanovení cílů, ale fungují úplně jinak.
      </Def>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10 }}>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: "var(--text-muted)", fontWeight: 700 }}>OTÁZKA</div>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: VSE.ffu, fontWeight: 700, textAlign: "center" }}>MBO (alignment)</div>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: VSE.fis, fontWeight: 700, textAlign: "center" }}>OKR (obliquity)</div>
        {[
          ["Kdo stanoví cíl", "CEO top-down", "Tým si definuje sám"],
          ["Časový horizont", "Roční", "Kvartální"],
          ["Orientace", "Na výsledek", "Na ambici"],
          ["Měření", "Binární (splněno/ne)", "% dosažení (70 % = OK)"],
          ["Riziko", "Nízké, cíle splnitelné", "Vyšší — cíle ambiciózní"],
          ["Příklad", "Amazon, Toyota", "Google, Intel, LinkedIn"],
        ].map((row, i) => (
          <Fragment key={i}>
            <div style={{ fontSize: 11.5, fontFamily: fontSans, color: "var(--text-muted)", padding: "8px 0", borderTop: `1px solid var(--border)`, fontWeight: 600 }}>{row[0]}</div>
            <div style={{ fontSize: 11.5, fontFamily: fontSans, color: VSE.ffu, padding: "8px 0", borderTop: `1px solid var(--border)`, textAlign: "center" }}>{row[1]}</div>
            <div style={{ fontSize: 11.5, fontFamily: fontSans, color: VSE.fis, padding: "8px 0", borderTop: `1px solid var(--border)`, textAlign: "center" }}>{row[2]}</div>
          </Fragment>
        ))}
      </div>
    </div>) },

  { id: "4mod", title: "4 modely Birkinshaw matice", subtitle: "Kombinace cílů × prostředků = typ firmy", color: VSE.primary, emoji: "compass",
    content: (<div>
      <Def color={VSE.primary}>
        Birkinshaw kombinuje osu <b>MEANS</b> (způsob: tight/loose) a <b>ENDS</b> (cíle: tight/loose) do <b>4 kvadrantů</b>. Každý kvadrant = jiný typ firmy.
      </Def>

      {/* Matice 2x2 */}
      <Tag color={VSE.primary}>Matice 2×2</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 6, marginTop: 6 }}>
        <div></div>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: "var(--text-muted)", fontWeight: 700, textAlign: "center", padding: "6px 0" }}>TIGHT MEANS<br/><span style={{ opacity: 0.7 }}>(pevné procesy)</span></div>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: "var(--text-muted)", fontWeight: 700, textAlign: "center", padding: "6px 0" }}>LOOSE MEANS<br/><span style={{ opacity: 0.7 }}>(volné procesy)</span></div>

        <div style={{ fontSize: 10, fontFamily: fontMono, color: "var(--text-muted)", fontWeight: 700, padding: "14px 8px 0 0", textAlign: "right" }}>TIGHT ENDS<br/><span style={{ opacity: 0.7 }}>(pevné cíle)</span></div>
        <div style={{ background: `${VSE.danger}12`, border: `1px solid ${VSE.danger}35`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.danger, fontFamily: fontSans }}>PLANNING</div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: fontMono, marginTop: 2 }}>McDonald's</div>
        </div>
        <div style={{ background: `${VSE.fm}12`, border: `1px solid ${VSE.fm}35`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fm, fontFamily: fontSans }}>QUEST</div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: fontMono, marginTop: 2 }}>Tesla, Apple</div>
        </div>

        <div style={{ fontSize: 10, fontFamily: fontMono, color: "var(--text-muted)", fontWeight: 700, padding: "14px 8px 0 0", textAlign: "right" }}>LOOSE ENDS<br/><span style={{ opacity: 0.7 }}>(volné cíle)</span></div>
        <div style={{ background: `${VSE.fph}12`, border: `1px solid ${VSE.fph}35`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fph, fontFamily: fontSans }}>SCIENCE</div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: fontMono, marginTop: 2 }}>Pfizer, R&D</div>
        </div>
        <div style={{ background: `${VSE.success}12`, border: `1px solid ${VSE.success}35`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans }}>DISCOVERY</div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: fontMono, marginTop: 2 }}>Google</div>
        </div>
      </div>

      <Tag color={VSE.primary}>4 modely v detailu</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          {
            name: "Planning",
            analogy: "= Armáda",
            color: VSE.danger,
            what: "Jasné cíle + jasné procesy. Firma přesně ví, co dělá a jak to dělá.",
            how: ["Standardy, KPI, MBO, formální procesy", "Stabilní prostředí, nízká flexibilita", "McDonald's, Toyota výroba"],
          },
          {
            name: "Quest",
            analogy: "= Tým moonshotů",
            color: VSE.fm,
            what: "Jasný cíl, volné prostředky. Víš, kam chceš dojít — jak, to je na tobě.",
            how: ["Jasný cíl (dostat se na Mars)", "Kreativita + motivace + inovace", "Tesla, Apple, SpaceX"],
          },
          {
            name: "Science",
            analogy: "= Vědecká laboratoř",
            color: VSE.fph,
            what: "Volný cíl, pevné prostředky. Nevíš, co najdeš, ale víš, jak hledat.",
            how: ["Výzkum, léčiva, architekti", "Cíl = zkoumání a bádání", "Pfizer R&D, farmaceutické firmy"],
          },
          {
            name: "Discovery",
            analogy: "= Hackathon",
            color: VSE.success,
            what: "Volné cíle + volné prostředky. Prostor pro úplnou inovaci bez omezení.",
            how: ["Neformální struktury, kampus", "Projekt max 6 týdnů, 3–6 lidí", "Google (20 %), Meta R&D"],
          },
        ].map((m, i) => (
          <div key={i} style={{ background: `${m.color}08`, border: `1px solid ${m.color}25`, borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: m.color, fontFamily: fontSans, marginBottom: 2 }}>{m.name}</div>
            <div style={{ fontSize: 11, color: m.color, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>{m.analogy}</div>
            <div style={{ fontSize: 11.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 8 }}>{m.what}</div>
            {m.how.map((it, j) => <div key={j} style={{ fontSize: 10.5, color: "var(--text-muted)", lineHeight: 1.45, fontFamily: fontSans, paddingLeft: 6, borderLeft: `2px solid ${m.color}25`, marginBottom: 3 }}>→ {it}</div>)}
          </div>
        ))}
      </div>
    </div>) },

  { id: "app5", title: "Aplikace na případovku", subtitle: "Postup pro zkoušku — jak na to", color: VSE.success, emoji: "target",
    content: (<div>
      <Def color={VSE.success}>
        Na PS musíš <b>zařadit firmu</b> do kvadrantu Birkinshaw matice, vyhodnotit jestli jí to vyhovuje, a navrhnout posun.
      </Def>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 1 — Jaký je produkt firmy?</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Rutinní, stabilní (burgery, výroba) → Planning/Alignment<br/>→ Inovativní, nejistý (software, R&D) → Discovery/Obliquity</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 2 — Jaké prostředí?</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Stabilní, regulované → tight means<br/>→ Turbulentní, konkurenční → loose means</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 3 — Jaké cíle?</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Jasně měřitelné → tight ends (Planning/Quest)<br/>→ Průzkumné, nejasné → loose ends (Science/Discovery)</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 4 — Navrhni posun</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Rigidní Planning v měnícím se prostředí → přejít na Quest (přidat OKR)<br/>→ Chaotický Discovery → přidat hladké procesy (BSC, KPI pro core)</div>
        </GlassBox>
      </div>
      {/* Mládková warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MLÁDKOVÁ — POZOR NA PŘESNÉ DEFINICE!</div>
          <span><b>Obliquity ≠ žádné plánování</b>. Je to <b>nepřímé</b> plánování přes OKR.<br/><b>Alignment ≠ diktatura</b>. Je to <b>přímé</b> plánování přes MBO.<br/>Mládková chytá na slovíčkaření — nepleť si termíny.</span>
        </div>
      </div>
    </div>) },

];

const flashcards5 = [
  { term: "Plánování", def: "Stanovení cíle a cesty k němu. Birkinshaw: Managing Objectives.", tag: "DEFINICE" },
  { term: "Alignment", def: "Přímé cíle, MBO, KPI. Shareholderři. McDonald’s. Odpovídá na CO, ne PROČ.", tag: "TRADIČNÍ" },
  { term: "Obliquity", def: "Nepřímé cíle, OKR. Cesta je cíl. Zisk jako důsledek. Stakeholdeři. IKEA.", tag: "ALTERNATIVNÍ" },
  { term: "MBO", def: "Management by Objectives. Cíle kaskádově od CEO k pracovníkovi. Zajímá CO, ne JAK.", tag: "NÁSTROJ" },
  { term: "OKR", def: "Objectives and Key Results. Nedefinuje CEO ale zaměstnanci. Flexibilní.", tag: "NÁSTROJ" },
  { term: "Planning model", def: "Tight/tight. Jasné cíle + jasné procesy. McDonald’s. Stabilní prostředí.", tag: "BIRKINSHAW" },
  { term: "Discovery model", def: "Loose/loose. Volné cíle + volné prostředky. Google. Inovace, kampus.", tag: "BIRKINSHAW" },
  { term: "Science model", def: "Loose ends / tight means. Výzkum, léčiva. Cíl = zkoumání.", tag: "BIRKINSHAW" },
  { term: "Quest model", def: "Tight ends / loose means. Jasné cíle, volné prostředky.", tag: "BIRKINSHAW" },
  { term: "3 přístupy k obliquity", def: "1) Nepřímý cíl, 2) Kreativní cíl (Google 20%), 3) Krok do neznáma (skok víry).", tag: "KLÍČOVÝ POJEM" },
  { term: "OKR — Objectives & Key Results", def: "Ambiciózní cíle (Objectives) + měřitelné výsledky (Key Results). Google, Intel, LinkedIn.", tag: "NÁSTROJ" },
  { term: "Planning Model (Birkinshaw)", def: "TIGHT means + TIGHT ends. Pevné cíle + pevné procesy. McDonald's, Toyota výroba.", tag: "MODEL" },
  { term: "Discovery Model (Birkinshaw)", def: "LOOSE means + LOOSE ends. Volné cíle, volné prostředky. Google 20 %, startupy.", tag: "MODEL" },
  { term: "Quest Model (Birkinshaw)", def: "TIGHT ends + LOOSE means. Jasné cíle, volné prostředky. Tesla (cíl Mars, jak na inženýrech).", tag: "MODEL" },
  { term: "Science Model (Birkinshaw)", def: "LOOSE ends + TIGHT means. Volné cíle, pevné prostředky. Pfizer R&D, MIT, architekti.", tag: "MODEL" },
  { term: "MBO vs OKR", def: "MBO = top-down kaskáda, roční. OKR = bottom-up, kvartální, ambiciózní. Rozdíl je v autonomii.", tag: "POROVNÁNÍ" },
];
const quiz5 = [
  { q: "Alignment odpovídá na otázku:", opts: ["PROČ?","CO?","JAK?","KDO?"], correct: 1 },
  { q: "OKR je nástroj:", opts: ["Alignment","Obliquity","Byrokracie","Emergence"], correct: 1 },
  { q: "McDonald’s je příklad:", opts: ["Discovery modelu","Planning modelu","Quest modelu","Science modelu"], correct: 1 },
  { q: "Google 20% času je příklad:", opts: ["Alignment","Nepřímého cíle","Kreativního cíle (obliquity)","MBO"], correct: 2 },
  { q: "Obliquity dává přednost:", opts: ["Shareholderům","Stakeholderům","Pouze manažerům","Pouze zákazníkům"], correct: 1 },
  { q: "Science model má:", opts: ["Tight ends, tight means","Loose ends, tight means","Loose ends, loose means","Tight ends, loose means"], correct: 1 },
  { q: "Hlavní mínus obliquity:", opts: ["Příliš jasné cíle","Finanční a organizační riziko","Nízká motivace","Příliš rychlý feedback"], correct: 1 },
  { q: "IKEA je příklad:", opts: ["Alignment","Obliquity","Planning modelu","Science modelu"], correct: 1 },
  { q: "Která firma používá OKR?", opts: ["McDonald's", "Google, Intel, LinkedIn", "ČSOB", "Česká pošta"], correct: 1 },
  { q: "Tesla je příkladem kterého modelu?", opts: ["Planning", "Discovery", "Quest", "Science"], correct: 2 },
  { q: "Pfizer R&D je příkladem:", opts: ["Planning", "Discovery", "Quest", "Science"], correct: 3 },
  { q: "Hlavní rozdíl MBO vs OKR:", opts: ["MBO je dražší", "MBO = top-down roční, OKR = bottom-up kvartální ambiciózní", "OKR je jen marketing", "Žádný rozdíl"], correct: 1 },
];

const praxe5 = {
  caseStudy: {
    company: "Google 20% pravidlo — plánování bez plánování",
    subtitle: "Ukázka obliquity v praxi",
    content: (<>
      Google má od začátku pravidlo: <b>každý zaměstnanec může 1 den v týdnu pracovat na čemkoli, co ho baví.</b> Z pohledu tradičního plánování (alignment) je to nesmysl — jak můžeš plánovat, když lidi dělají nevím co?<br/><br/>
      <b style={{ color: VSE.nf }}>Ale z pohledu obliquity</b> to dává smysl. Když nevíš, kde vznikne příští velký nápad, nemůžeš to nadiktovat shora. Musíš vytvořit prostor, kde nápady <b>můžou</b> vzniknout.<br/><br/>
      <b>Co z toho vzniklo:</b> Gmail, Google News, AdSense, Google Maps. Všechno velké produkty, které dnes Google generuje miliardy — a žádný z nich nebyl v oficiálním plánu.<br/><br/>
      <b>Birkinshaw matice:</b> Google je <b>Discovery model</b> (loose cíle + loose prostředky). McDonald's je pravý opak — <b>Planning model</b> (tight cíle: hamburger za 90 sekund + tight prostředky: přesný recept). Obojí funguje, ale pro jiný typ byznysu.
    </>),
    lessons: "Plánování není jedna správná odpověď. V prostředí, kde přesně víš, co děláš (rychlé občerstvení), funguje alignment. V prostředí, kde hledáš něco nového (tech inovace), funguje obliquity. Na zkoušce musíš umět rozhodnout, co je vhodné pro firmu v případovce."
  },
  miniExamples: [
    { company: "Amazon — Bezos memos", tag: "ALIGNMENT", color: VSE.fmv, content: "Bezos zrušil PowerPointy a každý projekt musí začít 6-stránkovou textovou analýzou. Jasná kritéria, jasný postup, MBO v praxi. Proto Amazon dokáže spustit AWS, Prime, Alexa — každý projekt má jasný cíl měřený čísly." },
    { company: "3M — 15% pravidlo", tag: "OBLIQUITY", color: VSE.success, content: "3M (firma s Post-It lístky) má od 40. let pravidlo, že 15 % času můžou inženýři dělat vlastní projekty. Post-It lístek vznikl omylem — inženýr hledal super-silné lepidlo, vyrobil super-slabé. Bez 15% pravidla by to hodil do koše." },
    { company: "McDonald's", tag: "PLANNING", color: VSE.danger, content: "V McDonald's má každý pohyb v kuchyni standard. Jak dlouho se smaží hranolky, kolik sekund grilovat burger. Extrémní tight/tight. Proto má burger v Praze stejnou chuť jako v Tokiu." }
  ]
};

const examQuestions5 = [
  { komise: "11.9.2025 — Mládková, Černá, Kopkáně (Postižení)", otazka: "Plánování v organizaci - co je to alignment a obliquity" },
  { komise: "9.6.2025 — Tahal, Pauknerová, Schonfeld (vinárna)", otazka: "planning + aplikovat na pripadovku", pozn: "Veľmi v pohode, nechceli veľa, stačili základy + aplikovanie na prípadovku ak to bolo v zadaní otázly" },
  { komise: "2.6.2025 — Nový, Müllerová, Kolouchová (Prádlo)", otazka: "Jaký systém plánování může organizace využít? Jaký využívá organizace v případové studii? Jaké jsou jeho přínosy, podmínky a limity? Jaká opatření je možné doporučit ke zvýšení výkonnosti organizace v této oblasti?" },
  { komise: "28.1.2025 — Tahal, Kuděj, Kučera", otazka: "Plánování - principy, limity, aplikace na případovku a doporučit nějaké zlepšení" },
];

const podcast5 = { title: "Plánování — alignment × obliquity", description: "Plánování v Birkinshawovi — alignment × obliquity, 4 modely (Planning, Discovery, Science, Quest), MBO vs OKR, jak je aplikovat na PS. Ideální na cestu metrem — 7 minut.", audioUrl: "/audio/mng-5.mp3", notebookLmUrl: null };

const examStrategy5 = `
  <b style="color:#A82A5F">1.</b> Definuj plánování (Birkinshaw dimenze 3 — Managing Objectives).<br/>
  <b style="color:#A82A5F">2.</b> Alignment — principy, nástroje (MBO, KPI, BSC), plusy/mínusy.<br/>
  <b style="color:#A82A5F">3.</b> Obliquity — OKR, 3 přístupy (nepřímý/kreativní/skok víry), plusy/mínusy.<br/>
  <b style="color:#A82A5F">4.</b> MBO × OKR — jasný rozdíl (kdo stanoví cíl + horizont + měření).<br/>
  <b style="color:#A82A5F">5.</b> <b>4 modely Birkinshaw matice</b> (Planning/Quest/Science/Discovery).<br/>
  <b style="color:#A82A5F">6.</b> Aplikace na PS — zařadit kvadrant + navrhnout posun.<br/>
  <b style="color:#A82A5F">7.</b> ⚠️ U Mládkové: přesné definice (obliquity ≠ žádné plánování).
`;

function OkruhMng5Panel() {
  return (<OkruhPanel subject="Management" subjectId="mng" number={5} title="Plánování" subtitle="Alignment × Obliquity / 4 modely (Planning, Discovery, Science, Quest)" color={VSE.ffu}
    questionText="Plánování (alignment × obliquity) — principy, limity, aplikace na případovku a doporučit zlepšení."
    questionDesc="Popiš oba póly. Vysvětli nástroje (MBO vs OKR). 4 modely Birkinshaw matice. Identifikuj v PS a navrhni změnu."
    sloz={2} roz={2} freq={2}
    examStrategy={examStrategy5}
    studySections={studySections5} flashcards={flashcards5} quiz={quiz5}
    praxe={praxe5} examQuestions={examQuestions5} podcast={podcast5} />);
}

/* ════════════════════════════════════════════════════════
   OKRUH 6 — Modely a systémy řízení, měkké × tvrdé prvky
   ════════════════════════════════════════════════════════ */
const studySections6 = [

  { id: "modely", title: "4 modely řízení", subtitle: "Vývoj pohledu na zaměstnance za 130 let", color: VSE.ffu, emoji: "pillar",
    content: (<div>
      <Def color={VSE.ffu}>
        <b>Model řízení</b> = celkový přístup firmy k zaměstnancům. Postupně se měnil od „člověk = stroj” k „člověk = smysl”.
      </Def>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        {[
          {
            name: "1. Klasický (Taylorismus)",
            period: "1890–1930",
            analogy: "= Člověk jako stroj",
            color: VSE.danger,
            items: [
              "Práce = nutné zlo, člověk = nástroj výroby",
              "Motivace = peníze, odměna > práce",
              "Skeptický pohled na člověka",
              "Dnes: Amazon warehouses (měřený pohyb)",
            ],
          },
          {
            name: "2. Paternalistický",
            period: "1910–1940",
            analogy: "= Firma jako rodina",
            color: VSE.fmv,
            items: [
              "Charakteristická osobnost v čele (Baťa, Ford)",
              "Firma ovlivňuje výrobu i volný čas",
              "Rodinná kultura, dobré výsledky",
              "Dnes: Baťovy domky ve Zlíně",
            ],
          },
          {
            name: "3. Model lidských vztahů",
            period: "1930–1960",
            analogy: "= Vztahy mají váhu",
            color: VSE.nf,
            items: [
              "Mezilidské vztahy na pracovišti = klíč",
              "Příznivé sociální klima, týmová práce",
              "Hawthornské experimenty — lidé reagují na pozornost",
              "Dnes: rodinné firmy, týmové kultury",
            ],
          },
          {
            name: "4. Humanistický",
            period: "1970–dnes",
            analogy: "= Člověk jako smysl",
            color: VSE.success,
            items: [
              "Člověk = těžiště, jeho potřeby",
              "Manažer zná potřeby podřízených",
              "Pracovní motivace = rozhodující faktor",
              "Dnes: Patagonia (školka na pracovišti)",
            ],
          },
        ].map((m, i) => (
          <div key={i} style={{ background: `${m.color}08`, border: `1px solid ${m.color}25`, borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: m.color, fontFamily: fontSans, marginBottom: 2 }}>{m.name}</div>
            <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: fontMono, marginBottom: 2 }}>{m.period}</div>
            <div style={{ fontSize: 11, color: m.color, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>{m.analogy}</div>
            {m.items.map((it, j) => <div key={j} style={{ fontSize: 11, color: "var(--text)", lineHeight: 1.45, fontFamily: fontSans, paddingLeft: 6, borderLeft: `2px solid ${m.color}25`, marginBottom: 3 }}>→ {it}</div>)}
          </div>
        ))}
      </div>
      {/* Baťa vsuvka */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — BAŤA BYL PŘEDCHŮDCE 7S</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          Tomáš Baťa ve Zlíně (1894–1932) měl <b>všechny prvky paternalistického modelu</b>: domky, školy, nemocnice, noviny. Zároveň ale zavedl <b>tvrdé prvky</b> klasického modelu — <b>týdenní bilance dílen</b>, přesné KPI výroby, úkolovou mzdu. <b>Dokonalá kombinace tvrdých a měkkých prvků 50 let před 7S McKinsey.</b>
        </div>
      </GlassBox>
    </div>) },

  { id: "hard", title: "Tvrdé prvky prosperity", subtitle: "= Věci, které se dají změřit a nařídit", color: VSE.ffu, emoji: "chart",
    content: (<div>
      <Def color={VSE.ffu}>
        <b>Tvrdé prvky</b> = měřitelné, dají se nařídit, plánovat a vymezit. Jsou <b>formální a dokumentovatelné</b>.
      </Def>
      <Tag color={VSE.ffu}>6 tvrdých prvků</Tag>
      <Bullet items={[
        "Organizační struktura — hierarchie, komunikace, kompetence",
        "Strategie — psaná, rozpracovaná do dílčích (mkt, HR, finance)",
        "Performance Management — implementace strategie, KPI, BSC",
        "Procesní řízení — jak fungují interní procesy",
        "Risk management — řízení rizik",
        "Inovace — KV, zvýšení podílu na trhu, snížení nákladů",
      ]} color={VSE.ffu} />

      {/* Mise/Vize warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}20, ${VSE.danger}08)`, border: `2px solid ${VSE.danger}50`, borderRadius: 12, padding: "12px 16px", marginTop: 14, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 11, letterSpacing: "1.5px", marginBottom: 4 }}>KOMISE CHYTÁ NA MISI A VIZI!</div>
          <span>Mise i vize jsou <b>formálně napsané dokumenty</b> → <b>PATŘÍ MEZI TVRDÉ PRVKY</b>. Studenti je často řadí mezi měkké (protože „jsou o smyslu”), ale to je chyba. <b>Komise to testuje opakovaně.</b></span>
        </div>
      </div>
    </div>) },

  { id: "soft", title: "Měkké prvky prosperity", subtitle: "= Věci vázané na lidi, které nelze nařídit", color: VSE.fis, emoji: "brain",
    content: (<div>
      <Def color={VSE.fis}>
        <b>Měkké prvky</b> = vázány na člověka a mezilidské vztahy. <b>Nejsou popsány, nelze je nařídit</b> — prostě se dějí.
      </Def>
      <Tag color={VSE.fis}>6 měkkých prvků</Tag>
      <Bullet items={[
        "Organizační kultura — Scheinův model (3 vrstvy)",
        "Leadership — lídr řídí výkonnost, zhodnocuje zdroje",
        "Engagement zaměstnanců — produktivita, kreativita",
        "Atmosféra — jak se ve firmě cítíš",
        "Komunikace — jak spolu lidé mluví",
        "Hodnoty — co si firma doopravdy váží",
      ]} color={VSE.fis} />

      <Tag color={VSE.fis}>Scheinův model kultury — 3 vrstvy ledovce</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { num: "1", name: "Artefakty", what: "Viditelné na povrchu", how: "Logo, dress code, kancelář" },
          { num: "2", name: "Hodnoty", what: "Formalizované, psané", how: "Code of conduct, firemní pravidla" },
          { num: "3", name: "Základní předpoklady", what: "Nevědomé, hluboko", how: "Co si lidé automaticky myslí" },
        ].map((s, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.fis}`, borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: VSE.fis, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, fontFamily: fontMono, flexShrink: 0 }}>{s.num}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fis, fontFamily: fontSans }}>{s.name}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 6 }}>{s.what}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", lineHeight: 1.5, paddingLeft: 8, borderLeft: `2px solid ${VSE.fis}30` }}>→ {s.how}</div>
          </GlassBox>
        ))}
      </div>
    </div>) },

  { id: "7s", title: "7S McKinsey", subtitle: "7 faktorů, které musí být v souladu", color: VSE.primary, emoji: "globe",
    content: (<div>
      <Def color={VSE.primary}>
        <b>McKinsey 7S</b> definuje <b>7 vzájemně propojených faktorů</b> organizace. <b>3 tvrdé</b> (Strategy, Structure, Systems) + <b>4 měkké</b> (Style, Staff, Skills, Shared values). Všech 7 musí být v souladu — <b>když jeden kulhá, kulhá celek</b>.
      </Def>

      <Tag color={VSE.ffu}>Tvrdé S (Hard)</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { name: "Strategy", what: "Jak dosáhnu cílů", how: "Plán akcí, strategické plány" },
          { name: "Structure", what: "Organizační struktura", how: "Hierarchie, kdo komu šéfuje" },
          { name: "Systems", what: "Systémy řízení", how: "IT, procesy, reporty, KPI" },
        ].map((s, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.ffu}`, borderRadius: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontMono, marginBottom: 6 }}>{s.name}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 4 }}>{s.what}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", lineHeight: 1.5 }}>→ {s.how}</div>
          </GlassBox>
        ))}
      </div>

      <Tag color={VSE.fis}>Měkké S (Soft)</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { name: "Style", what: "Styl vedení", how: "Autoritářský / coaching / laissez-faire" },
          { name: "Staff", what: "Spolupracovníci", how: "Kdo ve firmě pracuje, jaké lidi najímáme" },
          { name: "Skills", what: "Schopnosti a dovednosti", how: "Co lidi umí, kompetence týmu" },
          { name: "Shared values", what: "Základ kultury", how: "Co všichni ve firmě sdílejí" },
        ].map((s, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.fis}`, borderRadius: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fis, fontFamily: fontMono, marginBottom: 6 }}>{s.name}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 4 }}>{s.what}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", lineHeight: 1.5 }}>→ {s.how}</div>
          </GlassBox>
        ))}
      </div>

      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 14, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Klíčová myšlenka:</b> Když změníš <b>Strategy</b>, musíš upravit i <b>Structure</b> a <b>Systems</b>. Když změníš <b>Shared values</b>, změní se i <b>Style</b> a <b>Staff</b>. Všech 7 se ovlivňuje.
      </div>

      {/* Microsoft Nadella vsuvka */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — MICROSOFT POD NADELLOU</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          Když Satya Nadella převzal Microsoft (2014), změnil <b>Shared values</b> z „know-it-all” na „learn-it-all”. Pak musel změnit <b>Style</b> (z command&control na coaching), <b>Systems</b> (ze stack rankingu na check-in) a <b>Skills</b> (investice do cloud expertů). <b>Klasická 7S transformace</b> — změna jednoho S si vynutila změnu dalších.
        </div>
      </GlassBox>
    </div>) },

  { id: "csf", title: "CSF — kritické faktory úspěchu", subtitle: "+ další systémy řízení", color: VSE.fm, emoji: "target",
    content: (<div>
      <Def color={VSE.fm}>
        <b>CSF (Critical Success Factors)</b> = nejpodstatnější faktory pro úspěch firmy. Když vyberu správné faktory a propojím vazby → <b>synergie</b> → maximální úspěch.
      </Def>
      <Tag color={VSE.fm}>Typické CSF</Tag>
      <Bullet items={[
        "Lídři — kvalitní vedení",
        "Pracovníci — kompetentní tým",
        "Struktura — správná organizace",
        "Strategie — jasný plán",
        "Procesy — efektivní fungování",
        "IT — technologická podpora",
        "Stakeholdeři — podpora všech zainteresovaných",
      ]} color={VSE.fm} />

      <Tag color={VSE.primary}>Další systémy řízení</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.primary}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.primary, fontFamily: fontSans, marginBottom: 6 }}>Model sdílené odpovědnosti</div>
          <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5 }}>Vychází z MBO, rozšiřuje o <b>týmové cíle</b>. Tým je odpovědný jako celek, ne jen jednotlivec.</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.primary}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.primary, fontFamily: fontSans, marginBottom: 6 }}>Model kokpitu</div>
          <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5 }}>Dashboard metrik pro manažera. <b>Všechna klíčová čísla na 1 obrazovce</b> — rychlá orientace.</div>
        </GlassBox>
      </div>
    </div>) },

  { id: "app6", title: "Aplikace na případovku", subtitle: "Postup pro zkoušku — jak na to", color: VSE.success, emoji: "target",
    content: (<div>
      <Def color={VSE.success}>
        Na PS musíš <b>identifikovat model řízení</b>, roztřídit prvky (tvrdé × měkké), projít 7S, najít CSF a navrhnout změny.
      </Def>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 1 — Identifikuj model řízení</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Striktní kontrola + KPI → Klasický (Taylor)<br/>→ Silná osobnost + benefity → Paternalistický<br/>→ Týmy + sociální klima → Lidské vztahy<br/>→ Smysl a růst → Humanistický</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 2 — Roztřiď prvky (tvrdé × měkké)</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>Nezapomeň: <b>mise a vize = TVRDÉ prvky!</b></div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 3 — Projdi 7S</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>Je všech 7 v souladu? Často: strategie se mění, ale kultura (Shared values) zůstává stará → problém.</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 4 — Najdi CSF</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Tech startup: Skills + Systems<br/>→ Výroba: Procesy + Staff<br/>→ Luxusní značka: Shared values + Style</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.success}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 4 }}>Krok 5 — Navrhni změny</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>Co posílit, co změnit. Pamatuj: <b>změna jednoho S si vynutí změnu dalších</b>.</div>
        </GlassBox>
      </div>

      {/* Mise/Vize warning podruhé */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>TVŮJ NÁSKOK PŘED OSTATNÍMI</div>
          <span>Až budeš třídit prvky, řekni nahlas: <i>„Mise a vize patří mezi tvrdé prvky, protože jsou formálně napsané.”</i> Komise to miluje — většina studentů to řekne špatně.</span>
        </div>
      </div>
    </div>) },

];

const flashcards6 = [
  { term: "Tvrdé prvky", def: "Měřitelné, naříditelné: org. struktura, strategie, PM, procesy, risk mng, inovace.", tag: "ZÁKLAD" },
  { term: "Měkké prvky", def: "Vázány na člověka: kultura, leadership, vize, mise, engagement, atmosféra.", tag: "ZÁKLAD" },
  { term: "Klasický model", def: "Taylor. Práce = nutné zlo. Člověk = stroj. Motivace = peníze.", tag: "MODEL" },
  { term: "Paternalistický model", def: "Baťa. Rodinná kultura. Ovlivňuje výrobu i volný čas.", tag: "MODEL" },
  { term: "Model lidských vztahů", def: "Důležité jsou mezilidské vztahy a sociální klima.", tag: "MODEL" },
  { term: "Humanistický model", def: "Člověk je těžiště. Manažer zná potřeby podřízených. Práce = smysl.", tag: "MODEL" },
  { term: "7S McKinsey", def: "3 tvrdé (Strategy, Structure, Systems) + 4 měkké (Style, Staff, Skills, Shared values).", tag: "SYSTÉM" },
  { term: "CSF", def: "Critical Success Factors. Klíčové faktory úspěchu: lídři, pracovníci, struktura, strategie, procesy.", tag: "SYSTÉM" },
  { term: "Scheinův model", def: "3 vrstvy kultury: artefakty (viditelné), hodnoty (pravidla), základní předpoklady (nevědomé).", tag: "KULTURA" },
  { term: "Shared Values (7S)", def: "Měkký prvek 7S — co všichni ve firmě sdílejí. Základ kultury.", tag: "7S" },
  { term: "Style (7S)", def: "Měkký prvek 7S — styl vedení (autoritářský / coaching / laissez-faire).", tag: "7S" },
  { term: "Staff (7S)", def: "Měkký prvek 7S — kdo ve firmě pracuje, jaké lidi najímáme.", tag: "7S" },
  { term: "Skills (7S)", def: "Měkký prvek 7S — co lidi umí, kompetence týmu.", tag: "7S" },
  { term: "Strategy (7S)", def: "Tvrdý prvek 7S — plán akcí, jak dosáhnout cílů.", tag: "7S" },
  { term: "Structure (7S)", def: "Tvrdý prvek 7S — organizační struktura, hierarchie.", tag: "7S" },
  { term: "Systems (7S)", def: "Tvrdý prvek 7S — IT, procesy, reporty, KPI.", tag: "7S" },
];
const quiz6 = [
  { q: "Co PATŘÍ mezi tvrdé prvky?", opts: ["Leadership","Organizační struktura","Atmosféra","Engagement"], correct: 1 },
  { q: "Co PATŘÍ mezi měkké prvky?", opts: ["Strategie","Risk management","Organizační kultura","KPI"], correct: 2 },
  { q: "Baťa je příklad:", opts: ["Klasického modelu","Paternalistického modelu","Humanistického modelu","Modelů lidských vztahů"], correct: 1 },
  { q: "7S McKinsey obsahuje:", opts: ["5 tvrdých + 2 měkké","3 tvrdé + 4 měkké","4 tvrdé + 3 měkké","Všechny tvrdé"], correct: 1 },
  { q: "Mise a vize jsou:", opts: ["Vždy měkké prvky","Tvrdé prvky (formálně zapisovatelné)","Ani jedno","Záleží na firmě"], correct: 1 },
  { q: "Scheinův model má kolik vrstev?", opts: ["2","3","4","5"], correct: 1 },
  { q: "Shared values v 7S jsou:", opts: ["Tvrdé S","Měkké S","Externí faktor","Finanční ukazatel"], correct: 1 },
  { q: "Humanistický model staví do centra:", opts: ["Stroj","Procesy","Člověka a jeho potřeby","Zisk"], correct: 2 },
  { q: "Kolik tvrdých S je v 7S McKinsey?", opts: ["2", "3", "4", "5"], correct: 1 },
  { q: "Která S NEPATŘÍ mezi měkká?", opts: ["Style", "Staff", "Skills", "Structure"], correct: 3 },
  { q: "Které prvky řadíme mezi tvrdé prvky prosperity?", opts: ["Kultura a vize", "Mise a vize (formálně psané)", "Engagement zaměstnanců", "Atmosféra"], correct: 1 },
  { q: "Kdo zavedl model 7S?", opts: ["Friedman", "McKinsey & Company", "Welch", "Drucker"], correct: 1 },
];

const praxe6 = {
  caseStudy: {
    company: "Zappos — když měkké prvky válcují tvrdé",
    subtitle: "Jak firma prodala za miliardu díky kultuře",
    content: (<>
      <b>Zappos</b> je americký e-shop s botami. Když ho Amazon v roce 2009 kupoval za 1,2 miliardy dolarů, hlavní důvod nebyl produkt (boty jako všude), ale <b>firemní kultura</b>.<br/><br/>
      <b style={{ color: VSE.fis }}>Měkké prvky v Zappos:</b> 10 hodnot firmy (např. „Create Fun and A Little Weirdness”), CEO chodí do práce v tričku, každý nový zaměstnanec dostává po měsíci nabídku <b>2 000 $ aby dal výpověď</b> — když ji vezme, znamená to, že se mu tam nelíbí a ušetří to všem problémy.<br/><br/>
      <b style={{ color: VSE.ffu }}>Tvrdé prvky:</b> call centrum s neomezenou délkou hovoru (rekord 10 hodin), doprava zdarma, vrácení bez problémů do 365 dnů. Standardní procesy, měřené KPI.<br/><br/>
      <b>Proč to funguje:</b> Tvrdé prvky (procesy) jsou nastavené tak, aby podporovaly měkké prvky (kulturu „šťastný zákazník”). Zaměstnanec nedostává odměnu za rychlost hovoru, ale za spokojenost zákazníka. To je klasická <b>7S McKinsey</b> — tvrdé a měkké musí být v souladu.
    </>),
    lessons: "Kdyby Zappos měl skvělou kulturu ale špatné procesy (pomalá doprava, složité reklamace), kultura by nic nevyřešila. Kdyby měl skvělé procesy ale toxickou kulturu, lidé by odcházeli. Tvrdé a měkké prvky se musí doplňovat — v tom je síla 7S modelu."
  },
  miniExamples: [
    { company: "Baťa", tag: "PATERNALISTICKÝ", color: VSE.fmv, content: "Baťa stavěl zaměstnancům domy, školy, nemocnice. „Baťovy domky” ve Zlíně stojí dodnes. Paternalistický model = firma se stará o zaměstnance jako otec o rodinu. Funguje v homogenní společnosti, dnes už těžko." },
    { company: "Amazon warehouses", tag: "KLASICKÝ (TAYLOR)", color: VSE.danger, content: "Ve skladech Amazonu zaměstnanci chodí přesně definovanou cestu, každý pohyb je měřený. Člověk = stroj. Efektivní, ale vysoká fluktuace. Klasický taylorismus 100 let po Taylorovi." },
    { company: "Patagonia", tag: "HUMANISTICKÝ", color: VSE.success, content: "V Patagonii je na pracovišti dětská školka, zaměstnanci můžou brát děti do práce, firma platí surfaři když jsou dobré vlny. Humanistický model — člověk není prostředek, je smysl." }
  ]
};

const examQuestions6 = [
  { komise: "12.9.2025 — Krause, Vávra, Pauknerová (Víno)", otazka: "Systém/model řízení, měkké a tvrdé prvky, najít které se objevují v případovce a jak je upravit" },
  { komise: "16.6.2025 — Špaček, Kučera, Zamazalová (Víno)", otazka: "Management: Modell řízení + měkké a tvrdé prvky + najít v případovce + najít příležitosti pro zlepšení a proč", pozn: "Vinařství, akciová společnost, management: planning model, HR: špatně motivace, odměňování, dobře vztah k zákazníkům, kultura prostředí, CEO + 5 náměstků, #3-4 na trhu, hodně o produktech, hraje roli turbuletní doba - potřeba rychle se přizpůsobit Jinak komise příjemná, Kučera hodně filosof, hodně otevřených otázek, ale v pohodě týpek, chce si p..." },
  { komise: "10.6.2025 — Double Stříteský, Müllerová (Neziskovka)", otazka: "Trendy v managementu, inovace managementu, proč přinášejí KV, modely management model - popsat na případovce" },
  { komise: "10.6.2025 — Nový, Svobodová, Kolouchová (Neziskovka)", otazka: "Modely/styly řízení, měkké a tvrdé prvky, aplikovat na případovku, doporučit jak zvýšit výkonnost firmy v případovce" },
  { komise: "10.6.2025 — Mikovcová, Vávra, Viktora (Lázně)", otazka: "Motivace zaměstnanců v lázních (přečíst pripadovku a hned říct jak v reálným životě motivovat lidi - jak zvednout výkon atd.)", pozn: "Naprosto OK - Vávra zlatej. Na marketingový výzkumy sem mu řekl, že bych udělal Instagram a Facebook profil a on mi řekl, že je vidět, že patřím do moderní doby 😁. Mikovcová v pohodě - ta to za mě celý vedla, protože v těch lázních osobně byla, takže jakmile vidí že umíte řekne \"diky, to stačí\" a poslední byl Viktora - který se snažil byl tvrd..." },
  { komise: "9.6.2025 — Abíková, Kolouchová, Smrčka (Sucho)", otazka: "Měkké a tvrdé prvky v organizaci, rozdíl mezi strukturou a modelem řízení, vyjmenovat prvky a napasovat je na případovku (a mise a vize jsou opravdu tvrdé prvky :))", pozn: "zlatá komise, Abíková se mě pak přišla ven zeptat, jestli je studentům příjemnější když nechává otevřené otázky nebo jsme radši když se doptávají :D, Smrčka chtěl jít co nejdřív na oběd, Kolouchová se doptávala ale ne nic zákeřného" },
  { komise: "4.2.2025 — Nový, Müllerová, Vávra (Lázně)", otazka: "Systém řízení (management model) - měkké a tvrdé prvky řízení" },
  { komise: "4.2.2025 — Vrbová, Tahal, Svobodová (Vinařská firma)", otazka: "Trendy v managementu, management modely (Birkinshaw), vztahnout na případovku" },
  { komise: "4.2.2025 — Mikovcová, Kolouchová, Viktora (Firma vyrábějící hrnce (má to být asi Tescoma))", otazka: "Trendy v managementu, inovace managementu, proč přinášejí KV, modely management modelu… (Viktora nechce vůbec teorii, ptal se pouze na ty trendy, jaké jsou a něco najít v případovce)" },
  { komise: "3.2.2025 — Stříteský, Bočková, Lorenzová (Horská chata)", otazka: "Scheinův model a Denisonův model organizační kultury. Aplikace na případovku. Jak se vy vyvinula organizační kultura v případovce? Jaký typ organizační kultury byste doporučila?" },
  { komise: "29.1.2025 — Vávra, Mládková, Svobodová (případovka: lázně)", otazka: "Systém řízení (management model) - měkké a tvrdé prvky řízení" },
  { komise: "27.1.2025 — Vrbová, Špaček, Machek (Připadovka: lázně)", otazka: "2) tvrdé a měkké prvky řízení" },
];

const podcast6 = { title: "Modely řízení — tvrdé a měkké prvky", description: "Modely řízení od Taylora po humanismus, tvrdé × měkké prvky prosperity, 7S McKinsey (3 hard + 4 soft), CSF a Scheinův model kultury. Klíčové: mise a vize patří mezi TVRDÉ prvky. Ideální opakování — 8 minut.", audioUrl: "/audio/mng-6.mp3", notebookLmUrl: null };

const examStrategy6 = `
  <b style="color:#A82A5F">1.</b> 4 modely řízení (Klasický → Paternalistický → Lidské vztahy → Humanistický).<br/>
  <b style="color:#A82A5F">2.</b> Tvrdé prvky (6) — ⚠️ <b>mise a vize jsou TVRDÉ!</b> (komise chytá).<br/>
  <b style="color:#A82A5F">3.</b> Měkké prvky (6) — kultura (Scheinův model), leadership, engagement.<br/>
  <b style="color:#A82A5F">4.</b> <b>7S McKinsey</b> — 3 tvrdé (Strategy, Structure, Systems) + 4 měkké (Style, Staff, Skills, Shared values).<br/>
  <b style="color:#A82A5F">5.</b> CSF — kritické faktory úspěchu.<br/>
  <b style="color:#A82A5F">6.</b> Aplikace na PS — identifikuj model, roztřiď prvky, projdi 7S, najdi CSF, navrhni změny.
`;

function OkruhMng6Panel() {
  return (<OkruhPanel subject="Management" subjectId="mng" number={6} title="Modely a systémy řízení" subtitle="Měkké × tvrdé prvky / 7S McKinsey / CSF" color={VSE.ffu}
    questionText="Modely a systémy řízení (management model), tvrdé a měkké prvky."
    questionDesc="4 modely řízení (Taylor→humanismus). Tvrdé vs měkké prvky prosperity. 7S McKinsey. CSF. Aplikuj na PS — co funguje, co ne."
    sloz={3} roz={3} freq={3}
    examStrategy={examStrategy6}
    studySections={studySections6} flashcards={flashcards6} quiz={quiz6}
    praxe={praxe6} examQuestions={examQuestions6} podcast={podcast6} />);
}

/* ════════════════════════════════════════════════════════
   OKRUH 7 — Performance Management
   ════════════════════════════════════════════════════════ */

function NPSVisual() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  // Figurka (silueta) — vrací SVG g element
  const Figure = ({ x, color }) => (
    <g transform={`translate(${x}, 0)`}>
      <circle cx="0" cy="8" r="5" fill={color}/>
      <path d={`M -6 15 L -6 28 L -3 28 L -3 40 L 3 40 L 3 28 L 6 28 L 6 15 Z`} fill={color}/>
    </g>
  );
  const groups = [
    { id: "det", label: "DETRACTORS", subtitle: "Kritici", range: "0-6", count: 7, color: VSE.danger, desc: "Nespokojení zákazníci. Aktivně odrazují ostatní — negativní WOM, recenze." },
    { id: "pas", label: "PASSIVES", subtitle: "Vlažní", range: "7-8", count: 2, color: VSE.warning, desc: "Spokojení, ale nenadšení. Nedoporučují, ale ani neškodí. Snadno odejdou ke konkurenci." },
    { id: "pro", label: "PROMOTERS", subtitle: "Fanoušci", range: "9-10", count: 2, color: VSE.success, desc: "Nadšení zákazníci. Aktivně doporučují — pozitivní WOM, zvyšují retenci a příjmy." },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "18px 18px", marginTop: 14 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase" }}>NPS · NET PROMOTER SCORE</div>

      {/* Škála s figurkami */}
      <div style={{ display: "grid", gridTemplateColumns: "7fr 2fr 2fr", gap: 8, marginBottom: 14 }}>
        {groups.map(g => {
          const isHov = hovered === g.id;
          return (
            <div key={g.id}
              onMouseEnter={() => setHovered(g.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: `${g.color}12`,
                border: `2px solid ${g.color}${isHov ? "" : "50"}`,
                borderRadius: 12,
                padding: "10px 8px 8px",
                cursor: "pointer",
                transition: "all 200ms ease",
                opacity: hovered && !isHov ? 0.55 : 1,
                boxShadow: isHov ? `0 0 16px ${g.color}40` : "none",
              }}>
              <div style={{ fontSize: 10, fontFamily: fontMono, color: g.color, fontWeight: 800, letterSpacing: "1.2px", textAlign: "center", marginBottom: 8 }}>{g.label}</div>
              {/* Figurky */}
              <svg viewBox={`0 0 ${g.count * 18} 48`} style={{ width: "100%", height: 44 }}>
                {[...Array(g.count)].map((_, i) => <Figure key={i} x={9 + i * 18} color={g.color} />)}
              </svg>
              {/* Čísla škály */}
              <div style={{ display: "flex", justifyContent: "space-around", marginTop: 4, fontSize: 10, fontFamily: fontMono, color: g.color, fontWeight: 700 }}>
                {g.id === "det" && [0,1,2,3,4,5,6].map(n => <span key={n}>{n}</span>)}
                {g.id === "pas" && [7,8].map(n => <span key={n}>{n}</span>)}
                {g.id === "pro" && [9,10].map(n => <span key={n}>{n}</span>)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vzoreček */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        <div style={{ background: VSE.nf, color: "#fff", padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, fontFamily: fontSans, display: "flex", alignItems: "center" }}>
          Net Promoter Score
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 18, fontWeight: 800, color: t.text, fontFamily: fontMono }}>=</div>
        <div style={{ background: VSE.success, color: "#fff", padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, fontFamily: fontSans, display: "flex", alignItems: "center" }}>
          % Promoters
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 18, fontWeight: 800, color: t.text, fontFamily: fontMono }}>−</div>
        <div style={{ background: VSE.danger, color: "#fff", padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, fontFamily: fontSans, display: "flex", alignItems: "center" }}>
          % Detractors
        </div>
      </div>

      {/* Hover detail */}
      {hovered && (
        <div style={{ marginTop: 14, padding: "10px 14px", background: `${groups.find(g => g.id === hovered).color}10`, border: `1px solid ${groups.find(g => g.id === hovered).color}40`, borderRadius: 10, fontSize: 12, fontFamily: fontSans, color: t.text, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, color: groups.find(g => g.id === hovered).color, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 4 }}>
            {groups.find(g => g.id === hovered).label} · {groups.find(g => g.id === hovered).subtitle} · skóre {groups.find(g => g.id === hovered).range}
          </div>
          <div>{groups.find(g => g.id === hovered).desc}</div>
        </div>
      )}
      {!hovered && (
        <div style={{ marginTop: 12, padding: "8px 12px", fontSize: 11, fontFamily: fontSans, color: t.textMuted, textAlign: "center", fontStyle: "italic" }}>
          Výsledek: −100 až +100 · nad +50 = výborný (Apple ~60, Tesla ~95)
        </div>
      )}
    </div>
  );
}

function PMGearVisual() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const benefits = [
    { id: 1, side: "left", y: 70, icon: "lightbulb", label: "Rozvoj dovedností do budoucna", color: VSE.fmv, desc: "Investice do růstu týmu předchází krizi talentů" },
    { id: 2, side: "left", y: 160, icon: "bolt", label: "Vyšší angažovanost zaměstnanců", color: VSE.fm, desc: "Lidé ví, proč dělají svoji práci a jak přispívají" },
    { id: 3, side: "right", y: 70, icon: "star", label: "Vyšší retence zaměstnanců", color: VSE.fis, desc: "Jasné rozvojové cesty snižují fluktuaci" },
    { id: 4, side: "right", y: 160, icon: "gift", label: "Kultura zpětné vazby a důvěry", color: VSE.nf, desc: "Check-in místo check-out — pravidelné rozhovory" },
    { id: 5, side: "left", y: 250, icon: "chart", label: "Lepší výkonnost organizace", color: VSE.success, desc: "Propojení individuálních cílů se strategií firmy" },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "22px 20px", marginBottom: 14 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>CO JE PERFORMANCE MANAGEMENT</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1fr", gap: 14, alignItems: "center" }}>
        {/* Levý sloupec */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {benefits.filter(b => b.side === "left").map(b => (
            <div key={b.id}
              onMouseEnter={() => setHovered(b.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", opacity: hovered && hovered !== b.id ? 0.5 : 1, transition: "opacity 200ms ease" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${b.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={b.icon} size={20} color={b.color} />
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: t.text, fontFamily: fontSans, lineHeight: 1.35, textAlign: "right", flex: 1 }}>{b.label}</div>
            </div>
          ))}
        </div>

        {/* Prostředek — ozubené kolo */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <svg viewBox="0 0 260 260" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
            <defs>
              <linearGradient id="gearGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={VSE.fis} />
                <stop offset="50%" stopColor={VSE.ffu} />
                <stop offset="100%" stopColor={VSE.primary} />
              </linearGradient>
            </defs>
            {/* Ozubené kolo — 12 zubů přes SVG path */}
            <g transform="translate(130, 130)">
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const x1 = Math.cos(angle) * 95;
                const y1 = Math.sin(angle) * 95;
                const x2 = Math.cos(angle) * 115;
                const y2 = Math.sin(angle) * 115;
                const w = 12;
                const perpX = -Math.sin(angle) * w;
                const perpY = Math.cos(angle) * w;
                return <polygon key={i} points={`${x1-perpX},${y1-perpY} ${x1+perpX},${y1+perpY} ${x2+perpX*0.7},${y2+perpY*0.7} ${x2-perpX*0.7},${y2-perpY*0.7}`} fill="url(#gearGrad)" opacity="0.9"/>;
              })}
              <circle r="95" fill="url(#gearGrad)" opacity="0.9"/>
              <circle r="62" fill={t.surfaceSolid} opacity="0.95"/>
              {/* Čísla 1-5 okolo vnitřního kruhu */}
              {[0, 1, 2, 3, 4].map(i => {
                const angle = (i * 72 - 90) * (Math.PI / 180);
                const cx = Math.cos(angle) * 80;
                const cy = Math.sin(angle) * 80;
                const num = i + 1;
                const isHov = hovered === num;
                return (
                  <g key={i} onMouseEnter={() => setHovered(num)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                    <circle cx={cx} cy={cy} r={isHov ? 13 : 11} fill={VSE.warning} opacity={isHov ? 1 : 0.95} style={{ transition: "all 200ms ease", filter: isHov ? `drop-shadow(0 0 8px ${VSE.warning}80)` : "none" }} />
                    <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800" fontFamily={fontMono}>{num}</text>
                  </g>
                );
              })}
            </g>
            {/* Text uvnitř */}
            <text x="130" y="115" textAnchor="middle" fill={t.text} fontSize="13" fontWeight="800" fontFamily={fontSans}>Performance</text>
            <text x="130" y="132" textAnchor="middle" fill={t.text} fontSize="13" fontWeight="800" fontFamily={fontSans}>Management</text>
            <text x="130" y="150" textAnchor="middle" fill={t.textMuted} fontSize="8" fontFamily={fontMono} letterSpacing="1.5">INTEGROVANÝ SYSTÉM</text>
          </svg>
        </div>

        {/* Pravý sloupec */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {benefits.filter(b => b.side === "right").map(b => (
            <div key={b.id}
              onMouseEnter={() => setHovered(b.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", opacity: hovered && hovered !== b.id ? 0.5 : 1, transition: "opacity 200ms ease" }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: t.text, fontFamily: fontSans, lineHeight: 1.35, flex: 1 }}>{b.label}</div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${b.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={b.icon} size={20} color={b.color} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover popis */}
      {hovered && (
        <div style={{ marginTop: 14, padding: "10px 14px", background: t.surfaceHover, borderRadius: 10, fontSize: 12, fontFamily: fontSans, color: t.text, textAlign: "center", lineHeight: 1.5 }}>
          <b style={{ color: VSE.warning }}>{hovered}. {benefits.find(b => b.id === hovered).label}:</b> {benefits.find(b => b.id === hovered).desc}
        </div>
      )}
    </div>
  );
}

function BSCVisual() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const perspectives = [
    { id: "fin", label: "Finanční", icon: "chart", color: VSE.fm, x: 75, y: 25, kpis: ["ROI", "Cash flow", "Finanční výsledky"] },
    { id: "cust", label: "Zákaznická", icon: "star", color: VSE.warning, x: 25, y: 25, kpis: ["Spokojenost zákazníků", "Retence", "Kvalita dodávek"] },
    { id: "proc", label: "Interní procesy", icon: "refresh", color: VSE.fis, x: 25, y: 75, kpis: ["Aktivity na funkci", "Alignment procesů", "Automatizace"] },
    { id: "learn", label: "Učení a růst", icon: "brain", color: VSE.nf, x: 75, y: 75, kpis: ["Spokojenost zaměstnanců", "Fluktuace", "Znalosti a dovednosti", "Vzdělávání"] },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "22px 20px", marginTop: 14 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 12, fontWeight: 600, textTransform: "uppercase" }}>BALANCED SCORECARD · 4 PERSPEKTIVY</div>
      <div style={{ position: "relative", width: "100%", maxWidth: 380, aspectRatio: "1 / 1", margin: "0 auto" }}>
        <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
          {/* 4 kvadranty — circle segments */}
          {perspectives.map(p => {
            const isHov = hovered === p.id;
            let d = "";
            // Vytvořit path pro každý kvadrant (90° výsek kruhu)
            if (p.id === "cust") d = "M 100 100 L 100 10 A 90 90 0 0 0 10 100 Z";      // TL
            if (p.id === "fin")  d = "M 100 100 L 190 100 A 90 90 0 0 0 100 10 Z";     // TR
            if (p.id === "proc") d = "M 100 100 L 10 100 A 90 90 0 0 0 100 190 Z";     // BL
            if (p.id === "learn") d = "M 100 100 L 100 190 A 90 90 0 0 0 190 100 Z";   // BR
            return (
              <g key={p.id} onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                <path d={d} fill={p.color} opacity={isHov ? 1 : 0.85} style={{ transition: "all 200ms ease", filter: isHov ? `drop-shadow(0 0 8px ${p.color}80)` : "none" }} />
              </g>
            );
          })}
          {/* Text v kvadrantech */}
          {perspectives.map(p => {
            // Posun textu do centra každého kvadrantu
            const tx = p.x === 25 ? 55 : 145;
            const ty = p.y === 25 ? 55 : 145;
            return (
              <g key={p.id + "_text"} style={{ pointerEvents: "none" }}>
                <text x={tx} y={ty} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily={fontSans}>{p.label.split(" ")[0]}</text>
                {p.label.split(" ")[1] && <text x={tx} y={ty + 12} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily={fontSans}>{p.label.split(" ").slice(1).join(" ")}</text>}
              </g>
            );
          })}
          {/* Šipky mezi kvadranty (naznačují propojení) */}
          <g stroke={t.text} strokeWidth="1.5" fill="none" opacity="0.3">
            <path d="M 50 5 Q 100 5 150 5" markerEnd="url(#arrH)" />
            <path d="M 195 50 Q 195 100 195 150" markerEnd="url(#arrH)" />
            <path d="M 150 195 Q 100 195 50 195" markerEnd="url(#arrH)" />
            <path d="M 5 150 Q 5 100 5 50" markerEnd="url(#arrH)" />
          </g>
          <defs>
            <marker id="arrH" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={t.text} opacity="0.4"/>
            </marker>
          </defs>
          {/* Střed — Vision & Strategy */}
          <circle cx="100" cy="100" r="28" fill={t.surfaceSolid} stroke={VSE.primary} strokeWidth="2" />
          <text x="100" y="96" textAnchor="middle" fill={t.text} fontSize="8" fontWeight="800" fontFamily={fontSans} letterSpacing="0.5">VIZE A</text>
          <text x="100" y="106" textAnchor="middle" fill={t.text} fontSize="8" fontWeight="800" fontFamily={fontSans} letterSpacing="0.5">STRATEGIE</text>
        </svg>
      </div>

      {/* Hover detail — KPIs */}
      {hovered && (
        <div style={{ marginTop: 14, padding: "12px 16px", background: `${perspectives.find(p => p.id === hovered).color}10`, border: `1px solid ${perspectives.find(p => p.id === hovered).color}35`, borderRadius: 10, fontSize: 12, fontFamily: fontSans, color: t.text, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, color: perspectives.find(p => p.id === hovered).color, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 6 }}>PERSPEKTIVA: {perspectives.find(p => p.id === hovered).label.toUpperCase()}</div>
          <div>Typické KPIs: {perspectives.find(p => p.id === hovered).kpis.join(" · ")}</div>
        </div>
      )}
      {!hovered && (
        <div style={{ marginTop: 14, padding: "10px 14px", background: t.surfaceHover, borderRadius: 10, fontSize: 11.5, fontFamily: fontSans, color: t.textMuted, textAlign: "center", fontStyle: "italic" }}>
          Najeď myší na některou ze 4 perspektiv pro detail KPIs
        </div>
      )}
    </div>
  );
}

const studySections7 = [

  { id: "pm", title: "Co je Performance Management", subtitle: "= Integrovaný systém pro převedení strategie do reality", color: VSE.ffu, emoji: "chart",
    content: (<div>
      <PMGearVisual />
      <Def color={VSE.ffu}>
        <b>Performance Management (PM)</b> = integrovaný systém zahrnující úplný řídící, plánovací a kontrolní cyklus. Nadřazený koncept propojující metodologie pro zlepšení podnikatelského výkonu (BSC, Six Sigma, ERP, CRM, KPI, ABC).
      </Def>
      <Tag color={VSE.ffu}>Otázka pro firmu</Tag>
      <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.ffu}`, borderRadius: 12, marginTop: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>🎯 „Jak z papírové strategie udělat realitu?”</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", lineHeight: 1.5 }}>PM rozděluje strategii na konkrétní úkoly s měřitelnými čísly.</div>
      </GlassBox>

      <Tag color={VSE.ffu}>K čemu PM slouží</Tag>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>„Jak z papírové strategie udělat realitu?”</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>Rozdělím ji na konkrétní úkoly s čísly, která jdou měřit.</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>„Komu dát odměnu a koho vyměnit?”</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>Data místo pocitu, kdo je fakt přínosný.</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>„Co mám udělat příští týden?”</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>Manažer vidí, kde se drhne, a rozhoduje hned — ne za 3 měsíce v reportu.</div>
        </GlassBox>
      </div>

      {/* Komise warning - PM je top téma */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>PM = TOP FREKVENCE — PADL 13× V TAŽENÝCH</div>
          <span>Performance Management je <b>nejčastěji tažené téma</b>. Komise vždy chce <b>nástroje + aplikaci na PS</b>. Mít připravené: KPI, BSC, NPS, Six Sigma + jak je v PS firma využívá (nebo ne).</span>
        </div>
      </div>
    </div>) },

  { id: "coci", title: "Check-in × Check-out", subtitle: "= Moderní průběžný feedback × klasický roční rozhovor", color: VSE.fmv, emoji: "refresh",
    content: (<div>
      <Def color={VSE.fmv}>
        Dva přístupy ke <b>zpětné vazbě</b> v PM. Trend je jasný — moderní firmy přechází <b>od ročního Check-out k průběžnému Check-in</b>.
      </Def>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.danger}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.danger, fontFamily: fontSans, marginBottom: 2 }}>Check-out</div>
          <div style={{ fontSize: 11, color: VSE.danger, fontFamily: fontMono, fontStyle: "italic", marginBottom: 8, opacity: 0.85 }}>= Roční vysvědčení</div>
          <Bullet items={[
            "1× ročně, většinou na konci roku",
            "Zaměřuje se na minulost — co se stalo",
            "Hodnocení (1-5), kategorizace zaměstnanců",
            "Rozhoduje o odměnách, povýšení",
            "Riziko: stack ranking, demotivace",
          ]} color={VSE.danger} />
          <div style={{ fontSize: 10.5, color: VSE.warning, fontFamily: fontMono, marginTop: 8 }}>→ Microsoft (do 2014), GE pod Welchem</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.success}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 2 }}>Check-in</div>
          <div style={{ fontSize: 11, color: VSE.success, fontFamily: fontMono, fontStyle: "italic", marginBottom: 8, opacity: 0.85 }}>= Průběžný kouč</div>
          <Bullet items={[
            "Pravidelně (týdně, měsíčně)",
            "Zaměřuje se na budoucnost — co dál",
            "Coaching, rozvoj, feedback",
            "Bez rigidního skóre — kontinuální zlepšování",
            "Manažer = mentor, ne soudce",
          ]} color={VSE.success} />
          <div style={{ fontSize: 10.5, color: VSE.warning, fontFamily: fontMono, marginTop: 8 }}>→ Microsoft pod Nadellou, Adobe, Deloitte</div>
        </GlassBox>
      </div>

      <Tag color={VSE.fmv}>Proč firmy přechází na Check-in</Tag>
      <Bullet items={[
        "Roční hodnocení = pozdě — feedback potřebuje rychlost",
        "Stack ranking demotivuje (Microsoft to zrušil v 2013)",
        "Mladší generace chce průběžnou zpětnou vazbu",
        "Změny tempa — strategie se mění víc než 1× ročně",
      ]} color={VSE.fmv} />

      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — MICROSOFT POD NADELLOU</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          Když Satya Nadella v roce 2014 převzal Microsoft, jednou z prvních věcí byla <b>zrušení stack rankingu</b> a přechod na Check-in. Místo „rate your peers” začalo „learn from your peers”. Výsledek: kultura se otevřela, akcie firmy vzrostly z 38 USD na 400+ USD za 10 let.
        </div>
      </GlassBox>
    </div>) },

  { id: "mbo_kpi", title: "MBO + KPI hierarchie", subtitle: "= Kaskádování cílů shora dolů", color: VSE.fis, emoji: "target",
    content: (<div>
      <Def color={VSE.fis}>
        <b>MBO (Management by Objectives)</b> + <b>KPI (Key Performance Indicators)</b> = klasický nástroj PM. Cíle <b>kaskádují shora dolů</b> — od CEO k jednotlivci.
      </Def>

      <Tag color={VSE.fis}>Jak funguje MBO kaskáda</Tag>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
        {[
          { lvl: "1. CEO/Strategie", color: VSE.primary, what: "Strategický cíl: „Růst tržeb o 20 % za rok”" },
          { lvl: "2. Oddělení", color: VSE.fph, what: "Marketing: „+30 % leadů”. Sales: „+25 % konverze”. Produkt: „2 nové features”" },
          { lvl: "3. Tým", color: VSE.fis, what: "Sales tým EU: „+30 enterprise klientů”. Sales tým US: „+50 SMB klientů”" },
          { lvl: "4. Jednotlivec", color: VSE.success, what: "Account exec: „10 enterprise klientů”. SDR: „150 quality meetings”" },
        ].map((s, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "10px 14px", borderLeft: `3px solid ${s.color}`, borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: s.color, fontFamily: fontMono, minWidth: 120 }}>{s.lvl}</div>
              <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, flex: 1 }}>{s.what}</div>
            </div>
          </GlassBox>
        ))}
      </div>

      <Tag color={VSE.fis}>2 typy KPI</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.danger}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.danger, fontFamily: fontSans, marginBottom: 2 }}>Lagging KPI</div>
          <div style={{ fontSize: 11, color: VSE.danger, fontFamily: fontMono, fontStyle: "italic", marginBottom: 8, opacity: 0.85 }}>= Měříš, co už se stalo</div>
          <Bullet items={[
            "Tržby, zisk, ROI, market share",
            "Snadno se měří, ale pozdě reaguje",
            "Důležité pro výsledky, ne pro řízení",
          ]} color={VSE.danger} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.success}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 2 }}>Leading KPI</div>
          <div style={{ fontSize: 11, color: VSE.success, fontFamily: fontMono, fontStyle: "italic", marginBottom: 8, opacity: 0.85 }}>= Předpovídáš, co se stane</div>
          <Bullet items={[
            "Počet meetingů, NPS, engagement",
            "Včas signalizuje problémy",
            "Důležité pro proaktivní řízení",
          ]} color={VSE.success} />
        </GlassBox>
      </div>

      <Tag color={VSE.fis}>SMART cíle</Tag>
      <Bullet items={[
        "S — Specific (konkrétní)",
        "M — Measurable (měřitelné)",
        "A — Achievable (dosažitelné)",
        "R — Relevant (relevantní)",
        "T — Time-bound (časově omezené)",
      ]} color={VSE.fis} />
    </div>) },

  { id: "bsc", title: "BSC — Balanced Scorecard", subtitle: "= 4 perspektivy: nejen finance, ale celá firma", color: VSE.fis, emoji: "scale",
    content: (<div>
      <Def color={VSE.fis}>
        <b>Balanced Scorecard (BSC)</b> = strategický nástroj od Kaplana a Nortona (1992). Měří firmu <b>ze 4 stran</b> — ne jen z finanční. Vize a strategie firmy je <b>přeložena do měřitelných cílů</b>.
      </Def>

      <BSCVisual />

      <Tag color={VSE.fis}>4 perspektivy v detailu</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { name: "Finanční", color: VSE.fm, what: "Jak vypadáme pro investory?", kpis: "ROI, ROE, cash flow, EBITDA, marže" },
          { name: "Zákaznická", color: VSE.warning, what: "Jak nás vidí zákazníci?", kpis: "NPS, retence, spokojenost, market share" },
          { name: "Interní procesy", color: VSE.fis, what: "V čem musíme vynikat?", kpis: "Doba dodání, kvalita, automatizace, defekty" },
          { name: "Učení a růst", color: VSE.nf, what: "Jak se neustále zlepšujeme?", kpis: "Školení, fluktuace, engagement, kompetence" },
        ].map((p, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${p.color}`, borderRadius: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: p.color, fontFamily: fontSans, marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: p.color, fontFamily: fontMono, fontStyle: "italic", marginBottom: 8, opacity: 0.85 }}>→ {p.what}</div>
            <div style={{ fontSize: 11.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5 }}>
              <b>KPIs:</b> {p.kpis}
            </div>
          </GlassBox>
        ))}
      </div>

      <Tag color={VSE.fis}>Proč BSC funguje</Tag>
      <Bullet items={[
        "Vize není jen heslo na zdi — překládá se do konkrétních KPIs",
        "Vyvážené — nesoustředí se jen na peníze",
        "Propojuje krátkodobé akce s dlouhodobou strategií",
        "Měří to, co je důležité (ne jen to, co jde snadno změřit)",
      ]} color={VSE.fis} />
    </div>) },

  { id: "nps_sigma", title: "NPS + Six Sigma", subtitle: "= Měření spokojenosti zákazníků + řízení kvality procesů", color: VSE.success, emoji: "star",
    content: (<div>
      <Def color={VSE.success}>
        Dva klíčové nástroje PM mimo MBO/BSC: <b>NPS</b> měří loyalitu zákazníků jednou otázkou, <b>Six Sigma</b> systematicky redukuje chyby v procesech.
      </Def>

      <Tag color={VSE.success}>NPS — Net Promoter Score</Tag>
      <NPSVisual />

      {/* Komise warning - NPS */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 14, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE STŘÍTESKÝ/SCHÖNFELD/CEJTHAMR (11.9.2025)</div>
          <span>Konkrétně se ptali na <b>NPS</b>. Mít připravené: 1 otázka (0-10), výpočet (% Promoters − % Detractors), benchmarky (Apple ~60, Tesla ~95).</span>
        </div>
      </div>

      <Tag color={VSE.fmv}>Six Sigma — DMAIC cyklus</Tag>
      <Def color={VSE.fmv}>
        <b>Six Sigma</b> = systematický přístup k redukci chyb a variabilitě v procesech. Cílem je <b>3,4 chyby na milion příležitostí</b>. Vyvinuto v Motoroli (1986).
      </Def>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 6, marginTop: 8 }}>
        {[
          { letter: "D", name: "Define", what: "Definuj problém" },
          { letter: "M", name: "Measure", what: "Měř současný stav" },
          { letter: "A", name: "Analyze", what: "Analyzuj příčiny" },
          { letter: "I", name: "Improve", what: "Zlepši proces" },
          { letter: "C", name: "Control", what: "Kontroluj výsledek" },
        ].map((s, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "10px 8px", borderLeft: `3px solid ${VSE.fmv}`, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: VSE.fmv, fontFamily: fontMono, marginBottom: 2 }}>{s.letter}</div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: VSE.fmv, fontFamily: fontSans, marginBottom: 2 }}>{s.name}</div>
            <div style={{ fontSize: 9.5, color: "var(--text-muted)", fontFamily: fontSans, lineHeight: 1.3 }}>{s.what}</div>
          </GlassBox>
        ))}
      </div>

      <Tag color={VSE.fmv}>Sigma Mindset</Tag>
      <div style={{ background: `linear-gradient(135deg, ${VSE.fmv}25, ${VSE.danger}15)`, border: `1px solid ${VSE.fmv}50`, borderRadius: 12, padding: "14px 18px", marginTop: 6, fontSize: 12, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.7 }}>
        <div style={{ fontSize: 32, marginBottom: 4 }}>🗿</div>
        <b style={{ color: VSE.fmv, fontFamily: fontMono, letterSpacing: "1px" }}>SIGMA MINDSET</b><br/>
        Six Sigma má 5 stupňů (Yellow/Green/Black/Master Black Belt + Champion). <b>Black Belt</b> = expert na DMAIC, řídí projekty zlepšování. Toyota, GE, Motorola — všichni měli své „Black Belty”. Jack Welch v GE prosadil, že každý manažer musí mít alespoň Green Belt certifikaci.
      </div>
    </div>) },

  { id: "app7", title: "Aplikace na případovku", subtitle: "Postup pro zkoušku — 4 kroky", color: VSE.ffu, emoji: "target",
    content: (<div>
      <Def color={VSE.ffu}>
        Na PS musíš <b>identifikovat současný PM systém firmy</b>, najít <b>chyby/díry</b> a navrhnout <b>konkrétní nástroje</b> ke zlepšení.
      </Def>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 1 — Jak firma měří výkon?</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>
            → Má KPI? Jaké? Lagging nebo leading?<br/>
            → Měří jen finance, nebo i zákazníky/procesy/učení?<br/>
            → Existuje BSC (vyvážené) nebo jen ROI?
          </div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 2 — Jak firma dává feedback?</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>
            → Roční hodnocení (Check-out) nebo průběžné (Check-in)?<br/>
            → Existuje stack ranking? (= demotivace)<br/>
            → Manažer = soudce, nebo coach?
          </div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 3 — Najdi díry</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>
            → Chybí měření zákaznické spokojenosti? → Doporuč <b>NPS</b><br/>
            → Vysoká chybovost v procesech? → Doporuč <b>Six Sigma</b><br/>
            → Strategie nesedí s denní prací? → Doporuč <b>BSC</b><br/>
            → Zaměstnanci nevědí, co dělají? → Doporuč <b>MBO + SMART cíle</b>
          </div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 4 — Navrhni zavedení</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>
            → Jak konkrétně zavést (kdo, kdy, kolik to bude stát)?<br/>
            → Jaké budou KPIs zlepšení?<br/>
            → Jaký bude timeline (Quick wins do 3 měsíců, full rollout 12 měsíců)?
          </div>
        </GlassBox>
      </div>

      <Tag color={VSE.ffu}>Typické díry v případovkách</Tag>
      <Bullet items={[
        "Firma měří jen tržby, ignoruje spokojenost zákazníků → BSC + NPS",
        "Roční hodnocení demotivuje → přechod na Check-in",
        "Nejasné cíle pro zaměstnance → MBO + SMART",
        "Vysoká chybovost ve výrobě → Six Sigma DMAIC",
        "Strategie nepropagována shora dolů → BSC kaskáda",
      ]} color={VSE.ffu} />

      <div style={{ background: `linear-gradient(90deg, ${VSE.warning}15, ${VSE.warning}05)`, border: `1px solid ${VSE.warning}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>💡</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.warning, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>HLAVNÍ TIP NA ZKOUŠKU</div>
          <span>PM padá <b>nejčastěji</b>. Komise vždy chce <b>konkrétní nástroj + důvod proč + jak ho zavést</b>. Nestačí říct „doporučuji KPI” — musíš dodat <b>jaké KPIs</b>, <b>jakou kaskádu</b>, <b>na co budou napojené</b>.</span>
        </div>
      </div>
    </div>) },

];

const flashcards7 = [
  { term: "Performance Management", def: "Integrovaný systém propojující BSC, KPI, MBO, Six Sigma, ERP. Pro implementaci strategie.", tag: "DEFINICE" },
  { term: "Check-out", def: "Starý přístup. Roční hodnocení, 9Box, distribuce hodnocení, odměna a trest.", tag: "PŘÍSTUP" },
  { term: "Check-in", def: "Nový přístup. Budoucnost, silné stránky, pravidelné rozhovory, rozvoj > hodnocení.", tag: "PŘÍSTUP" },
  { term: "KPI", def: "Key Performance Indicators. Měřitelné ukazatele výkonnosti: náklady, kvalita, čas, růst.", tag: "NÁSTROJ" },
  { term: "BSC", def: "Balanced Scorecard. 4 perspektivy: finanční, procesy, zákazníci, učení se a růst.", tag: "NÁSTROJ" },
  { term: "MBO", def: "Management by Objectives. SMART cíle kaskádově od CEO k pracovníkovi.", tag: "NÁSTROJ" },
  { term: "Six Sigma", def: "DMAIC: Define, Measure, Analyze, Improve, Control. Eliminace chyb v procesech.", tag: "NÁSTROJ" },
  { term: "ERP", def: "Enterprise Resource Planning. Softwarové napojení na všechny systémy firmy.", tag: "NÁSTROJ" },
  { term: "9Box", def: "Matice hodnocení: výsledky (osa X) × přístup/chování (osa Y). Používá se v check-out.", tag: "METODA" },
  { term: "NPS", def: "Net Promoter Score. Doporučil byste nás? Skóre -100 až +100. Komise se ptala!", tag: "BONUS" },
  { term: "Lagging KPI", def: "Měří, co už se stalo. Tržby, zisk, ROI. Pozdě reaguje, ale měří výsledky.", tag: "KPI" },
  { term: "Leading KPI", def: "Předpovídá, co se stane. Počet meetingů, NPS, engagement. Včas signalizuje problémy.", tag: "KPI" },
  { term: "SMART cíle", def: "Specific, Measurable, Achievable, Relevant, Time-bound. Standard pro definici cílů.", tag: "MBO" },
  { term: "Six Sigma DMAIC", def: "Define → Measure → Analyze → Improve → Control. Cyklus pro redukci chyb v procesech.", tag: "NÁSTROJ" },
  { term: "Stack ranking", def: "Roční hodnocení s nucenou distribucí (top 20% / mid 70% / bottom 10%). Microsoft to zrušil v 2013.", tag: "KRITIKA" },
  { term: "Kaplan & Norton (BSC)", def: "Robert Kaplan a David Norton zavedli Balanced Scorecard v 1992. Harvard Business School.", tag: "AUTOŘI" },
];
const quiz7 = [
  { q: "PM je:", opts: ["Jeden nástroj","Integrovaný systém propojující více metod","Typ org. struktury","Finanční ukazatel"], correct: 1 },
  { q: "BSC má kolik perspektiv?", opts: ["2","3","4","5"], correct: 2 },
  { q: "Check-in se zaměřuje na:", opts: ["Minulost a trest","Budoucnost a silné stránky","Pouze finance","Pouze KPI"], correct: 1 },
  { q: "Six Sigma používá:", opts: ["SMART","SWOT","DMAIC","PEST"], correct: 2 },
  { q: "9Box se používá v:", opts: ["Check-in","Check-out","BSC","ERP"], correct: 1 },
  { q: "Která NENÍ perspektiva BSC?", opts: ["Finanční","Zákaznická","Konkurence","Učení se a růst"], correct: 2 },
  { q: "MBO stanoví cíle:", opts: ["Pouze pro CEO","Kaskádově od CEO k pracovníkovi","Pouze pro HR","Náhodně"], correct: 1 },
  { q: "PM slouží hlavně pro:", opts: ["Implementaci strategie","Tvorbu produktů","Design webových stránek","Logistiku"], correct: 0 },
  { q: "NPS měří:", opts: ["Výkonnost procesů","Doporučení zákazníků","Počet zaměstnanců","Zisk firmy"], correct: 1 },
  { q: "PM padl v taženkách kolikrát?", opts: ["3×","6×","12×","20×"], correct: 2 },
  { q: "Six Sigma má cíl:", opts: ["10 % chyb", "1 % chyb", "0,1 % chyb", "3,4 chyby na milion"], correct: 3 },
  { q: "Co je rozdíl mezi Lagging a Leading KPI?", opts: ["Žádný rozdíl", "Lagging měří minulost, Leading předpovídá budoucnost", "Lagging je dražší", "Leading je nepřesný"], correct: 1 },
];

const praxe7 = {
  caseStudy: {
    company: "Adobe — zrušili roční hodnocení a ušetřili 80 000 hodin",
    subtitle: "Přechod z Check-out na Check-in v praxi",
    content: (<>
      V roce 2012 měl Adobe klasický systém: jednou ročně šéf hodnotí zaměstnance, zařadí je na škále 1-5, podle toho se dávají odměny. Výsledek? <b>Manažeři strávili 80 000 hodin ročně vyplňováním formulářů</b>, zaměstnanci nenáviděli tento systém, 20 % lidí dalo výpověď do měsíce po hodnocení.<br/><br/>
      <b style={{ color: VSE.success }}>Co Adobe udělal — přechod na Check-in:</b><br/>
      <b style={{ color: VSE.danger }}>Zrušili</b> roční hodnocení a žebříčky (9Box, ranking).<br/>
      <b style={{ color: VSE.nf }}>Zavedli</b> krátké rozhovory manažer-zaměstnanec každé 2 týdny.<br/>
      <b style={{ color: VSE.primary }}>Zaměřili se</b> na budoucnost a silné stránky, ne na minulé chyby.<br/>
      <b style={{ color: VSE.fmv }}>Přenesli</b> odměňování do kontinuálního procesu — nemusíš čekat rok na zvýšení.<br/><br/>
      <b>Výsledek po 2 letech:</b> Fluktuace klesla o 30 %. Manažeři získali zpět 80 000 hodin ročně. Zaměstnanci vědí, jak si stojí <b>v reálném čase</b>, ne jednou za 12 měsíců.
    </>),
    lessons: "Klasický Performance Management (check-out) byl vymyšlen pro tovární dělníky 20. století. V dnešním prostředí, kde se úkoly mění každý měsíc, nemá smysl hodnotit jednou ročně. Check-in je lepší pro kreativní a znalostní práci. Ale pozor — check-in funguje jen tam, kde je důvěra. V toxické kultuře dopadne stejně špatně jako check-out."
  },
  miniExamples: [
    { company: "Tesla Gigafactory", tag: "KPI & BSC", color: VSE.fis, content: "Tesla měří každou minutu každou linku: kolik baterií se vyrobilo, kolik s vadou, kolik energie spotřebovala linka. BSC v praxi — finanční (náklady), procesní (výtěžnost), zákaznická (kvalita), učení (nové procesy)." },
    { company: "Motorola — Six Sigma", tag: "SIX SIGMA", color: VSE.primary, content: "Motorola vymyslela Six Sigma v 80. letech. Cíl: max 3,4 defektu na milion. Zachránilo to firmu — z krize na 16 miliard dolarů úspor za 10 let. DMAIC (Define, Measure, Analyze, Improve, Control) je dnes standard v automotive i zdravotnictví." },
    { company: "Netflix — bez KPI", tag: "MINUS PM", color: VSE.danger, content: "Netflix slavně nemá KPI pro kreativní týmy. „Měříme výsledek, ne aktivitu.” Šéf scénářů nemá deadline ani počet seriálů. Funguje, protože Netflix má top talenty a velkou kulturu svobody. V průměrné firmě by to byla katastrofa." }
  ]
};

const examQuestions7 = [
  { komise: "29.1.2026 — Svobodová, Nový, Machek (Horská chata)", otazka: "Performance management, aplikace na případovku", pozn: "Bylo to náročné, zejména u Svobodové" },
  { komise: "11.9.2025 — Stříteský, Schönfeld, Cejthamr (Lázně)", otazka: "Performance management, ukazatelé a aplikace na případovku, co by měli zlepšit; ptali se na NPS", pozn: "Nejzlatější komise na světě :) Ta případovka teda byla slušně dlouhá, nestíhala jsem ji na tom potítku dočíst a najít tam ty svoje věci, šla jsem ale první a pak za mnou přišel Stříteský, ať už fakt jdu, vzal do ruky moje otázky a řekl, že 2/3 tam vlastně ani nemám :D Hodní byli ale úplně všichni, žádný chození do detailů, definice, stačilo jim ..." },
  { komise: "13.6.2025 — Cejthamr, Machek, Heřman (Tchibo)", otazka: "Performance management" },
  { komise: "13.6.2025 — Machek, Kučera, Kolouchová (Lázně)", otazka: "Performance management (aplikace na případovku)", pozn: "Kučera chtěl hodně napojení na případovku a ptal se na věci mimo otázku, moc nechce slyšet teorii ani váš názor mi přislo, ale má v hlavě nějakou věc co chce přesně slyšet. Řekl mi, že jsem málo mluvila a že se mě musel furt doptávat, tak asi doporučuju hodně mluvit. Machek chtěl jenom teorii a hlavně správné pojmy u těch financí, pozor na obrat..." },
  { komise: "12.6.2025 — Pichanič, Kuděj, Zamazalová (Víno)", otazka: "Performance management", pozn: "Všichni byli moc hodní, snažili se pomáhat, chtěli všechno aplikovat na případovku, ale zajímala je i teorie. Hodně se doptávali. První 4 měli samý jedničky" },
  { komise: "10.6.2025 — Mikovcová, Vávra, Viktora (Lázně)", otazka: "Management: Performance management, jaké principy jsou ve firmě používaný, jaké nejsou a jaká by s tím mohla být pojena rizika.", pozn: "Všetci z komisie chceli prepojenie na prípadovku, aj keď iba pri Performance managemente sa na to otázka pýtala. Mikovcová keď videla, že teóriu viete, nenechala ani dopovedať (povedala som len inovaci Schumpeter a determinanty) a hneď sa dopýtavala na to či sú Lázne inovačná organizace + ako z nej spraviť inovačnú organizaci. Chcela vidieť, že ..." },
  { komise: "9.6.2025 — Tahal, Lorencová, Schonfeld", otazka: "Performace management, metody napárovat na případovku", pozn: "Tahal a Shonfeld super, hodně pomáhají, nechají v klidu mluvit. Lorencová docela potrápí, hodně se doptává a něco chce hodně do podrobna. Celkově ale fajn komise" },
  { komise: "5.6.2025 — (asi) Kolouchova, Viktora, Honig (Firma vyrábějící nadobi)", otazka: "Performance managment, metody, KPI", pozn: "Všichni byli hodní a usměvaví. Chtěli nějaký základ teorie (vysvětlit pojmy z otázky) a potom už případovka. O případovce byla diskuse, takže stačilo obhájit svůj názor." },
  { komise: "4.6.2025 — Mikovcová, Viktora, Kolouchová (Horská bouda)", otazka: "Performance Management", pozn: "Viktora a Kolouchová úplně pohodička, stačilo téma uvést pár větama a pak už přátelský povidání nad case sturdy. Mikovcová chtěla víc slyšet teroii, ale pak už zase tolik neřešila case study. Byla z nich ale určitě nejpřísnější." },
  { komise: "3.2.2025 — Nový, Machek, Kolouchová (Výrobce kol (zakázková výroba))", otazka: "Performance Management, jeho nástroje + aplikovat na případovku, co dělají špatně, co dobře" },
  { komise: "28.1.2025 — Smrčka, Kolouchová, Říhová", otazka: "Performance management, aplikovat na případovku" },
  { komise: "4.6. — Tahal, Cejthamr, Schonfeld (kolo)", otazka: "Performance managment a kriteria" },
  { komise: "10.6. — Double Stříteský, Müllerová (Neziskovka)", otazka: "Performance management" },
];

const examStrategy7 = `
  <b style="color:#A82A5F">1.</b> Definuj PM (integrovaný systém, propojující BSC, KPI, MBO...).<br/>
  <b style="color:#A82A5F">2.</b> Check-out vs Check-in — starý vs nový přístup.<br/>
  <b style="color:#A82A5F">3.</b> Vyjmenuj nástroje: KPI, BSC (4 perspektivy!), MBO, Six Sigma.<br/>
  <b style="color:#A82A5F">4.</b> Na PS: co firma používá + co chybí + doporučení.<br/>
  <b style="color:#A82A5F">5.</b> Bonusově: NPS, ERP, CRM — komise se občas doptávají.
`;

const podcast7 = { title: "Performance Management", description: "Performance Management — top frekvence v tažených otázkách. Check-in × Check-out, MBO + KPI hierarchie, BSC 4 perspektivy, NPS, Six Sigma. Plus jak aplikovat na PS. Ideální poslech před zkouškou — 9 minut.", audioUrl: "/audio/mng-7.mp3", notebookLmUrl: null };

function OkruhMng7Panel() {
  return (<OkruhPanel subject="Management" subjectId="mng" number={7} title="Performance Management" subtitle="KPI / BSC / MBO / Six Sigma / Check-in vs Check-out" color={VSE.ffu}
    questionText="Performance Management, jeho nástroje + aplikovat na případovku, co dělají špatně, co dobře."
    questionDesc="Definuj PM. Check-out vs Check-in. Nástroje (KPI, BSC, MBO, Six Sigma, ERP). Na PS identifikuj nástroje, navrhni doplnění."
    sloz={2} roz={3} freq={3}
    examStrategy={examStrategy7}
    studySections={studySections7} flashcards={flashcards7} quiz={quiz7}
    praxe={praxe7} examQuestions={examQuestions7} podcast={podcast7} />);
}

/* ════════════════════════════════════════════════════════
   OKRUH 8 — Change Management (Kotter, Lewin, Teorie U)
   ════════════════════════════════════════════════════════ */

function TeorieUVisual() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const left = [
    { id: "l1", label: "Downloading", sub: "Past patterns", desc: "Posloucháme jen to, co potvrzuje naše přesvědčení — stará schémata." },
    { id: "l2", label: "Suspending", sub: "Seeing with fresh eyes", desc: "Pozastavíme stará pravidla a zkusíme vidět nově." },
    { id: "l3", label: "Redirecting", sub: "Sensing from the field", desc: "Měníme pohled — díváme se očima ostatních, vnímáme kontext." },
    { id: "l4", label: "Letting go", sub: "Pustit staré", desc: "Opustíme staré vzorce, předsudky a identity." },
  ];
  const right = [
    { id: "r4", label: "Letting come", sub: "Nechat přijít", desc: "Přijmout nové myšlenky a směr, který se objevuje." },
    { id: "r3", label: "Enacting", sub: "Crystallizing · Vision", desc: "Krystalizujeme vizi a záměr — co přesně chceme tvořit." },
    { id: "r2", label: "Embodying", sub: "Prototyping · Head, heart, hand", desc: "Prototypujeme nové řešení — spojujeme myšlení, cítění a činy." },
    { id: "r1", label: "Performing", sub: "By operating · Form the whole", desc: "Implementujeme nové fungování jako celek." },
  ];
  const principles = [
    { id: "mind", label: "Open Mind", sub: "naslouchání, zvědavost", color: VSE.nf, y: 90 },
    { id: "heart", label: "Open Heart", sub: "empatie, soucit", color: VSE.fm, y: 145 },
    { id: "will", label: "Open Will", sub: "odvaha inovovat, sebedůvěra", color: VSE.fmv, y: 200 },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "22px 20px", marginTop: 14, marginBottom: 4 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase" }}>TEORIE U · SCHARMER</div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.2fr 1.1fr", gap: 12, alignItems: "stretch" }}>
        {/* Levá strana — sestup */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {left.map((l, i) => (
            <div key={l.id}
              onMouseEnter={() => setHovered(l.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ padding: "8px 10px", background: hovered === l.id ? `${VSE.fm}18` : `${VSE.fm}08`, border: `1px solid ${VSE.fm}${hovered === l.id ? "60" : "25"}`, borderRadius: 10, cursor: "pointer", transition: "all 200ms ease", opacity: hovered && hovered !== l.id ? 0.5 : 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: VSE.fm, fontFamily: fontMono }}>{i+1}. {l.label}</div>
              <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", marginTop: 2 }}>→ {l.sub}</div>
            </div>
          ))}
        </div>

        {/* Střed — U tvar s principy */}
        <div style={{ position: "relative" }}>
          <svg viewBox="0 0 200 280" style={{ width: "100%", height: "100%", display: "block" }}>
            <defs>
              <linearGradient id="uGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={VSE.primary} stopOpacity="0.15"/>
                <stop offset="100%" stopColor={VSE.primary} stopOpacity="0.35"/>
              </linearGradient>
            </defs>
            {/* U-shape path */}
            <path d="M 30 30 L 30 200 Q 30 260 100 260 Q 170 260 170 200 L 170 30"
              fill="none" stroke="url(#uGrad)" strokeWidth="42" strokeLinecap="round"/>
            <path d="M 30 30 L 30 200 Q 30 260 100 260 Q 170 260 170 200 L 170 30"
              fill="none" stroke={VSE.primary} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            {/* Principy uvnitř */}
            {principles.map(p => {
              const isHov = hovered === p.id;
              return (
                <g key={p.id} onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                  <rect x="40" y={p.y - 14} width="120" height="28" rx="14" fill={p.color} opacity={isHov ? 1 : 0.92} style={{ transition: "all 200ms ease", filter: isHov ? `drop-shadow(0 0 8px ${p.color}80)` : "none" }}/>
                  <text x="100" y={p.y + 4} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800" fontFamily={fontSans} letterSpacing="0.5">{p.label}</text>
                </g>
              );
            })}
            {/* Presencing dole */}
            <circle cx="100" cy="260" r="6" fill={VSE.warning} stroke="#fff" strokeWidth="2"/>
            <text x="100" y="278" textAnchor="middle" fill={t.text} fontSize="9" fontWeight="800" fontFamily={fontMono} letterSpacing="0.5">PRESENCING</text>
          </svg>
        </div>

        {/* Pravá strana — vzestup */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {right.map((r, i) => (
            <div key={r.id}
              onMouseEnter={() => setHovered(r.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ padding: "8px 10px", background: hovered === r.id ? `${VSE.fis}18` : `${VSE.fis}08`, border: `1px solid ${VSE.fis}${hovered === r.id ? "60" : "25"}`, borderRadius: 10, cursor: "pointer", transition: "all 200ms ease", opacity: hovered && hovered !== r.id ? 0.5 : 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: VSE.fis, fontFamily: fontMono }}>{i+1}. {r.label}</div>
              <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", marginTop: 2 }}>→ {r.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover popis */}
      {hovered && (
        <div style={{ marginTop: 14, padding: "10px 14px", background: t.surfaceHover, borderRadius: 10, fontSize: 12, fontFamily: fontSans, color: t.text, lineHeight: 1.6 }}>
          <b style={{ color: VSE.primary }}>{[...left, ...right, ...principles].find(n => n.id === hovered)?.label}:</b>{" "}
          {[...left, ...right, ...principles].find(n => n.id === hovered)?.desc || [...left, ...right, ...principles].find(n => n.id === hovered)?.sub}
        </div>
      )}
      {!hovered && (
        <div style={{ marginTop: 12, padding: "8px 12px", fontSize: 11, fontFamily: fontSans, color: t.textMuted, textAlign: "center", fontStyle: "italic", lineHeight: 1.5 }}>
          Cesta dolů = opuštění starých vzorců · Dno = Presencing (spojení se zdrojem) · Cesta nahoru = tvorba nového
        </div>
      )}
    </div>
  );
}

function KotterCycleVisual() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const steps = [
    { num: 1, label: "Pocit naléhavosti", short: "Naléhavost", color: VSE.danger, desc: "Vytvořit burning platform — lidé musí cítit, že změna je nutná." },
    { num: 2, label: "Vůdčí koalice", short: "Koalice", color: VSE.fmv, desc: "Silný tým lídrů s různými funkcemi a expertízou." },
    { num: 3, label: "Vize + strategie", short: "Vize", color: VSE.fm, desc: "Jasný cíl, kam jdeme + cesta, jak se tam dostat." },
    { num: 4, label: "Komunikace vize", short: "Komunikace", color: VSE.fis, desc: "Se všemi zainteresovanými — současný stav, další kroky, soulad se změnou." },
    { num: 5, label: "Akce + odstranění bariér", short: "Delegování", color: VSE.nf, desc: "Posílení lidí na všech úrovních, nové role, odstranění překážek." },
    { num: 6, label: "Krátkodobá vítězství", short: "Rychlé výhry", color: VSE.primary, desc: "Posiluje důvěru, oslavuje dílčí výsledky, udržuje momentum." },
    { num: 7, label: "Konsolidace vítězství", short: "Další změny", color: VSE.fph, desc: "Nepovolit tempo, budovat na úspěších, ambicióznější kroky." },
    { num: 8, label: "Zakotvení nových přístupů", short: "Zakotvení", color: VSE.success, desc: "Nové chování = normální. Lidé si zvykají a sžívají se." },
  ];
  const cx = 200, cy = 200, r = 135;
  return (
    <div style={{ ...cardStyle(t), padding: "22px 20px", marginTop: 14, marginBottom: 4 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase" }}>KOTTERŮV MODEL · 8 KROKŮ</div>
      <div style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
        <svg viewBox="0 0 400 400" style={{ width: "100%", height: "auto" }}>
          {/* Centrální kruh */}
          <circle cx={cx} cy={cy} r="62" fill={`${VSE.ffu}15`} stroke={VSE.ffu} strokeWidth="2"/>
          <text x={cx} y={cy - 6} textAnchor="middle" fill={t.text} fontSize="14" fontWeight="800" fontFamily={fontSans}>Kotterův</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill={t.text} fontSize="14" fontWeight="800" fontFamily={fontSans}>model</text>
          <text x={cx} y={cy + 28} textAnchor="middle" fill={t.textMuted} fontSize="8" fontWeight="700" fontFamily={fontMono} letterSpacing="1">8 KROKŮ</text>

          {/* 8 kruhů okolo */}
          {steps.map((s, i) => {
            const angle = (i * 45 - 90) * (Math.PI / 180);
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            const isHov = hovered === s.num;
            return (
              <g key={s.num} onMouseEnter={() => setHovered(s.num)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                <line x1={cx + Math.cos(angle) * 62} y1={cy + Math.sin(angle) * 62} x2={cx + Math.cos(angle) * (r - 38)} y2={cy + Math.sin(angle) * (r - 38)} stroke={s.color} strokeWidth="1" opacity="0.3" strokeDasharray="2 3"/>
                <circle cx={x} cy={y} r="38" fill={s.color} opacity={isHov ? 1 : 0.9} style={{ transition: "all 200ms ease", filter: isHov ? `drop-shadow(0 0 12px ${s.color}80)` : "none" }}/>
                <text x={x} y={y - 6} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800" fontFamily={fontMono}>{s.num}</text>
                <text x={x} y={y + 12} textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="700" fontFamily={fontSans}>{s.short}</text>
              </g>
            );
          })}
        </svg>
      </div>
      {/* Hover popis */}
      {hovered && (
        <div style={{ marginTop: 10, padding: "10px 14px", background: `${steps.find(s => s.num === hovered).color}15`, border: `1px solid ${steps.find(s => s.num === hovered).color}40`, borderRadius: 10, fontSize: 12, fontFamily: fontSans, color: t.text, lineHeight: 1.6 }}>
          <b style={{ color: steps.find(s => s.num === hovered).color, fontFamily: fontMono }}>{hovered}. {steps.find(s => s.num === hovered).label}:</b> {steps.find(s => s.num === hovered).desc}
        </div>
      )}
      {!hovered && (
        <div style={{ marginTop: 10, padding: "8px 12px", fontSize: 11, fontFamily: fontSans, color: t.textMuted, textAlign: "center", fontStyle: "italic", lineHeight: 1.5 }}>
          Kroky 1-3 = Příprava · 4-6 = Implementace · 7-8 = Zakotvení
        </div>
      )}
    </div>
  );
}

function ProgramPlatformVisual() {
  const t = useTheme();
  return (
    <div style={{ ...cardStyle(t), padding: "22px 20px", marginTop: 14 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase" }}>EVOLUCE: PROGRAM → PLATFORM</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center" }}>
        {/* Levá strana — 2 karty pod sebou */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <GlassBox opacity={0.5} style={{ padding: 14, border: `2px solid ${VSE.fmv}40`, borderRadius: 14 }}>
            <div style={{ fontSize: 11, fontFamily: fontMono, color: VSE.fmv, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 8 }}>CHANGE PROGRAM</div>
            <Bullet items={[
              "Přístup vycházející z hierarchie",
              "Změna iniciována shora",
              "Návrh změn postupně schvalován, hodnocen, testován",
              "Ke změně dochází pozdě a křečovitým způsobem",
            ]} color={VSE.fmv} />
          </GlassBox>
          <GlassBox opacity={0.5} style={{ padding: 14, border: `2px solid ${VSE.success}40`, borderRadius: 14 }}>
            <div style={{ fontSize: 11, fontFamily: fontMono, color: VSE.success, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 8 }}>CHANGE PLATFORM</div>
            <Bullet items={[
              "Přístup založen na graduálním procesu změn",
              "Iniciovat změnu může kdokoliv — rekrutovat kolegy, navrhovat řešení, experimentovat",
              "Změna přichází zdola nahoru",
              "Vyvrací předpoklady Programu: change starts at the top, change is rolled, change is engineered",
            ]} color={VSE.success} />
          </GlassBox>
        </div>
        {/* Pravá strana — velké písmo + šipka */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, minWidth: 120 }}>
          <div style={{ fontSize: 22, fontWeight: 900, fontFamily: fontSans, color: VSE.fmv, textAlign: "center", lineHeight: 1 }}>
            CHANGE<br/>PROGRAM
          </div>
          <svg width="30" height="60" viewBox="0 0 30 60">
            <line x1="15" y1="5" x2="15" y2="45" stroke={t.text} strokeWidth="2.5"/>
            <path d="M 15 55 L 7 42 L 23 42 Z" fill={t.text}/>
          </svg>
          <div style={{ fontSize: 22, fontWeight: 900, fontFamily: fontSans, color: VSE.success, textAlign: "center", lineHeight: 1 }}>
            CHANGE<br/>PLATFORM
          </div>
        </div>
      </div>
    </div>
  );
}

const studySections8 = [
  { id: "proc", title: "Proč potřebujeme Change Management", subtitle: "Turbulentní prostředí a konkurenční výhoda", color: VSE.danger, emoji: "bolt",
    content: (<div>
      <Def label="Definice" color={VSE.danger}>
        <b>Change management</b> = systém k zabezpečení plynulého a hladkého implementování změn. Máme ho, protože je konkurenční prostředí, rychlé tempo změn a vše se vyvíjí. Místo reagování na chaos ho očekávám a čelím mu.
      </Def>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <ModelCard name="Podněty ZVENČÍ" color={VSE.fmv} items={[
          "Stakeholdeři, okolí podniku",
          "Konkurence, trh, legislativa",
          "Digitalizace, technologie",
        ]} />
        <ModelCard name="Podněty ZEVNITŘ" color={VSE.fis} items={[
          "Zaměstnanci a manažeři",
          "Informační systémy",
          "Organizace a procesy",
        ]} />
      </div>
      <Tag>KONKRÉTNÍ PODOBY ZMĚN</Tag>
      <Bullet items={[
        "Černé labutě — nečekané události s velkým dopadem",
        "Zkracování životního cyklu výrobků",
        "Udržitelnost a ESG trendy",
        "Změny v chování zákazníků",
        "Globalizace a hyperkonkurence",
      ]} color={VSE.danger} />
      <Tag>TYPY ORGANIZACÍ PODLE SCHOPNOSTI REAGOVAT</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 6 }}>
        <ModelCard name="Resilientní" color={VSE.success} items={[
          "Odolná, přetváří strategii",
          "Předpovídá a předvídá trendy",
        ]} />
        <ModelCard name="Health" color={VSE.fis} items={[
          "V turbulencích stále zdravá",
          "Uspokojující kultura",
        ]} />
        <ModelCard name="Spirituální" color={VSE.primary} items={[
          "Vzájemná důvěra",
          "Závazek k zaměstnancům",
        ]} />
      </div>
    </div>) },

  { id: "lewin", title: "Lewin — 3 fáze změny", subtitle: "Klasický třífázový model", color: VSE.nf, emoji: "refresh",
    content: (<div>
      <Def label="Kdy použít" color={VSE.nf}>
        Vhodný pro <b>jednodušší, jasně definované změny</b> v relativně stabilním prostředí. Lineární, top-down přístup.
      </Def>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
        <ModelCard name="1. UNFREEZE" color={VSE.nf} items={[
          "Rozvolňuji pravidla a zvyklosti",
          "Připravuji lidi na změnu",
          "Vyvolávám pocit naléhavosti",
        ]} />
        <ModelCard name="2. CHANGE" color={VSE.fmv} items={[
          "Probíhá samotná změna",
          "Může nastat zmatek a nejistota",
          "Klíčová je komunikace",
        ]} />
        <ModelCard name="3. FREEZE" color={VSE.success} items={[
          "Zakotvení nových pravidel",
          "Nové zvyklosti a přemýšlení",
          "Stabilizace stavu",
        ]} />
      </div>
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MILUJE FREEZE!</div>
          <span>U Lewina komise chtěla hlavně <b>FREEZE fázi</b> — tam se studenti sekají. Nový/Vávra/Heřman (30.1.2025) se na ni přímo doptali.</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <PlusMinus type="plus" items={[
          "Jednoduchý na pochopení",
          "Funguje v stabilním prostředí",
          "Jasné fáze",
        ]} />
        <PlusMinus type="minus" items={[
          "Freeze je v turbulentním prostředí iluzorní",
          "Lineární — neumí adaptaci",
          "Příliš top-down",
        ]} />
      </div>
    </div>) },

  { id: "kotter", title: "Kotter — 8 kroků změny", subtitle: "= Stavební plán transformace — 8 postupných stupňů", color: VSE.fmv, emoji: "target",
    content: (<div>
      <Def color={VSE.fmv}>
        <b>Nejdůležitější model</b> change managementu. Rozdělen do <b>3 částí</b>: Příprava (1-3) · Implementace (4-6) · Zakotvení (7-8).
      </Def>

      <KotterCycleVisual />

      {/* Komise miluje */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}20, ${VSE.danger}08)`, border: `2px solid ${VSE.danger}50`, borderRadius: 12, padding: "12px 16px", marginTop: 14, marginBottom: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 11, letterSpacing: "1.5px", marginBottom: 4 }}>KOMISE MILUJE — HÁŠA CHCE CHRONOLOGICKY!</div>
          <span>Nový/Vávra/Heřman (30.1.2025) chtěli PODROBNĚ na PS. Háša chce všech <b>8 kroků ve správném pořadí</b>. Lorencová chce přesné názvy kroků — slovíčkaření.</span>
        </div>
      </div>

      <Tag>1. ČÁST — PŘÍPRAVA</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 6 }}>
        <ModelCard name="1) Naléhavost" color={VSE.danger} items={[
          "Lidé musí cítit, že změna je nutná",
          "Vytvořit burning platform",
        ]} />
        <ModelCard name="2) Koalice" color={VSE.fmv} items={[
          "Silný tým lídrů",
          "Různé funkce a expertízy",
        ]} />
        <ModelCard name="3) Vize + strategie" color={VSE.fis} items={[
          "Jasný cíl kam jdeme",
          "Cesta jak se tam dostat",
        ]} />
      </div>

      <Tag>2. ČÁST — IMPLEMENTACE</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 6 }}>
        <ModelCard name="4) Komunikace vize" color={VSE.nf} items={[
          "Se všemi zainteresovanými",
          "Současný stav + další kroky",
          "Vyvolává souhlas se změnou",
        ]} />
        <ModelCard name="5) Delegování" color={VSE.primary} items={[
          "Posílení zaměstnanců na všech úrovních",
          "Nové role",
          "Odstranění překážek",
        ]} />
        <ModelCard name="6) Krátkodobá vítězství" color={VSE.fm} items={[
          "Posiluje důvěru v úspěch",
          "Oslavují se dílčí výsledky",
          "Udržuje momentum",
        ]} />
      </div>

      <Tag>3. ČÁST — ZAKOTVENÍ</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 6 }}>
        <ModelCard name="7) Další změny" color={VSE.fph} items={[
          "Nepovolit tempo, budovat na úspěších",
          "Větší a ambicióznější kroky",
        ]} />
        <ModelCard name="8) Zakotvení do kultury" color={VSE.success} items={[
          "Lidé si zvykají a sžívají se",
          "Nové chování = normální",
        ]} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <PlusMinus type="plus" items={[
          "Step by step, jasná struktura",
          "Zaměřuje se na připravenost",
          "Sedí tradičním hierarchickým org.",
        ]} />
        <PlusMinus type="minus" items={[
          "Málo příležitostí ke spolutvorbě",
          "Může vyvolat frustraci zaměstnanců",
          "Některé kroky jsou někdy zbytečné",
        ]} />
      </div>
    </div>) },

  { id: "u", title: "Teorie U (Scharmer)", subtitle: "= Hluboké ponoření dolů a vynoření s novým pohledem", color: VSE.primary, emoji: "brain",
    content: (<div>
      <Def label="Pro koho" color={VSE.primary}>
        Pro <b>manažery, akademiky, politiky</b> — cílem je odbourat neproduktivní vzorce chování a dostat se k čistému, tvořivému myšlení.
      </Def>

      <TeorieUVisual />

      <Tag>TŘI PRINCIPY</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 6 }}>
        <ModelCard name="Open Mind" color={VSE.nf} items={[
          "Otevřená mysl",
          "Schopnost vidět nově",
          "Zbavit se předsudků",
        ]} />
        <ModelCard name="Open Heart" color={VSE.fm} items={[
          "Otevřené srdce",
          "Empatie, cítění s druhými",
        ]} />
        <ModelCard name="Open Will" color={VSE.fmv} items={[
          "Otevřená vůle",
          "Plná zapálenost pro věc",
          "Jednat odvážně",
        ]} />
      </div>
      <Tag>4 ÚROVNĚ NASLOUCHÁNÍ — naučit v tomto pořadí</Tag>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
        <ModelCard name="1) Downloading" color={VSE.danger} items={[
          "Slyším jen to, co potvrzuje moje přesvědčení",
          "Nejpovrchnější forma",
        ]} />
        <ModelCard name="2) Factual listening" color={VSE.warning} items={[
          "Poslouchám, když slyším něco odlišného od toho, co znám",
          "Přijímám fakta",
        ]} />
        <ModelCard name="3) Empathic listening" color={VSE.fis} items={[
          "Dívám se na svět očima jiných",
          "Respektuji je a rozumím jim",
        ]} />
        <ModelCard name="4) Generative listening" color={VSE.success} items={[
          "Bez ega, s intuicí",
          "Spolu s druhými můžeme dojít k průlomovým nápadům",
          "Nejhlubší, nejkreativnější forma",
        ]} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <PlusMinus type="plus" items={[
          "Generuje průlomové myšlenky",
          "Zapojuje kolektivní moudrost",
          "Vhodné pro kulturní změnu",
        ]} />
        <PlusMinus type="minus" items={[
          "Dlouhodobé cíle — pomalé výsledky",
          "Manažer může ztratit kontrolu",
          "Je to předepsané, konstruované",
        ]} />
      </div>
    </div>) },

  { id: "platform", title: "Change Program × Change Platform", subtitle: "Top-down projekt × kontinuální kultura změn", color: VSE.fis, emoji: "scale",
    content: (<div>
      <Def color={VSE.fis}>
        <b>Program</b> = jednorázový projekt se začátkem a koncem. Využívá modely Kotter a Lewin.<br/>
        <b>Platform</b> = kontinuální systém, který umožňuje neustálé návrhy zdola.
      </Def>

      <ProgramPlatformVisual />

      {/* Komise miluje */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 14, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MILUJE — MIKOVCOVÁ / VIKTORA / TAHAL / CEJTHAMR</div>
          <span>Chtějí rozdíl + aplikaci na PS + <b>obhájit volbu</b> pro konkrétní firmu.</span>
        </div>
      </div>

      <GlassBox opacity={0.5} style={{ marginTop: 10, border: `1px solid ${VSE.warning}35`, borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: VSE.warning, fontFamily: fontMono, marginBottom: 10, letterSpacing: "1px" }}>JAK TO NA ZKOUŠCE ROZLIŠIT</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.7, fontFamily: fontSans }}>
          <b style={{ color: VSE.ffu }}>Klíčová myšlenka:</b> Program = jednorázový projekt se začátkem a koncem. Platform = kontinuální systém, který umožňuje neustálé návrhy změn zdola.<br/><br/>
          <b style={{ color: VSE.ffu }}>Na případovku:</b> rigidní hierarchie + jasný cíl → Program (Kotter). Turbulentní odvětví + potenciál zaměstnanců → Platform.
        </div>
      </GlassBox>
    </div>) },

  { id: "barriers", title: "Bariéry změny", subtitle: "= Proč změny ve firmách tak často selhávají", color: VSE.fm, emoji: "construction",
    content: (<div>
      <Def color={VSE.fm}>
        Ve firmě jsou <b>2 velké skupiny bariér</b>: (1) <b>3 typy odporu</b> ze strany lidí a (2) <b>4 lock-in efekty</b> — firma je „zamčená” v minulých rozhodnutích. Musíš rozumět oběma, abys uměl navrhnout řešení.
      </Def>

      <Tag>3 TYPY ODPORU KE ZMĚNĚ</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          {
            name: "Psychologický", color: VSE.danger,
            analogy: "= Strach z neznámého",
            items: [
              "„Co když to nezvládnu?”",
              "Ztráta jistoty, bezpečí, rutiny",
              "Podpora status quo (zachování stávajícího stavu)",
            ],
            example: "Zaměstnanec se bojí, že mu AI vezme práci",
          },
          {
            name: "Kulturní", color: VSE.fmv,
            analogy: "= „U nás se to nedělá”",
            items: [
              "Zažité normy, tradice, rituály",
              "Kultura změnu aktivně odmítá",
              "Nejtěžší změnit — trvá roky",
            ],
            example: "„Takhle jsme to dělali 20 let”",
          },
          {
            name: "Politický", color: VSE.primary,
            analogy: "= Ztráta moci a vlivu",
            items: [
              "Mocenské boje, ztráta pozice",
              "„Kdo bude novým šéfem?”",
              "Chrání starý pořádek",
            ],
            example: "Střední management blokuje ploché struktury",
          },
        ].map((o, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${o.color}`, borderRadius: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: o.color, fontFamily: fontSans, marginBottom: 2 }}>{o.name}</div>
            <div style={{ fontSize: 11, color: o.color, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85, fontStyle: "italic" }}>{o.analogy}</div>
            {o.items.map((it, j) => <div key={j} style={{ fontSize: 11.5, color: "var(--text)", lineHeight: 1.5, fontFamily: fontSans, paddingLeft: 6, borderLeft: `2px solid ${o.color}25`, marginBottom: 3 }}>→ {it}</div>)}
            <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}30`, borderRadius: 6, padding: "6px 10px", marginTop: 8, fontSize: 10.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.5 }}>
              <b style={{ color: VSE.warning }}>Příklad:</b> {o.example}
            </div>
          </GlassBox>
        ))}
      </div>

      {/* Status Quo zajímavost */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "14px 18px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 8 }}>💡 POJEM — STATUS QUO & STATUS QUO BIAS</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          <b>Status quo</b> (latinsky „stav, v němž”) = současný stav věcí. V managementu: jak to ve firmě fungovalo dosud.<br/><br/>
          <b>Status quo bias</b> (kognitivní zkreslení) = lidská tendence <b>preferovat současný stav před změnou</b>, i když by změna byla objektivně lepší.<br/><br/>
          <b>Proč je důležitý?</b> Mozek vnímá ztrátu silněji než zisk (Kahneman, „prospect theory”). Proto lidé raději zůstávají u neefektivních procesů, než aby riskovali změnu.<br/><br/>
          <b>V praxi:</b> když navrhuješ změnu, musíš ukázat, že <b>současný stav je neudržitelný</b> (Kotterův krok 1 — pocit naléhavosti).
        </div>
      </GlassBox>

      <Tag>4 LOCK-IN EFEKTY</Tag>
      <div style={{ background: `${VSE.fm}08`, border: `1px solid ${VSE.fm}25`, borderRadius: 10, padding: "10px 14px", marginTop: 6, marginBottom: 10, fontSize: 12, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.fm }}>Co je lock-in?</b> „Zamčení” firmy v současném stavu kvůli minulým rozhodnutím. Firma vidí, že by se mělo změnit, ale <b>něco ji drží zpátky</b>.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          {
            name: "1) Investiční lock-in", color: VSE.nf,
            analogy: "= „Drahá svatba, teď se neumím rozvést”",
            what: "Investovali jsme do technologie a měnit by znamenalo vyhodit peníze.",
            example: "SAP za 50 milionů — nelze snadno nahradit.",
          },
          {
            name: "2) Kompetenční lock-in", color: VSE.fis,
            analogy: "= „Umíme jen staré”",
            what: "Nemáme lidi, kteří by uměli s novým pracovat.",
            example: "Banka s COBOL programátory potřebuje cloud experty.",
          },
          {
            name: "3) Stakeholder lock-in", color: VSE.fm,
            analogy: "= „Máme rozjeté smlouvy”",
            what: "Smlouvy s dodavateli, partnery, klienty — nelze vypovědět.",
            example: "10-letá smlouva s cloud providerem.",
          },
          {
            name: "4) Systémový lock-in", color: VSE.primary,
            analogy: "= „Všechno je propojené”",
            what: "IT systémy a procesy jsou napojené. Změna jednoho spustí dominové efekty.",
            example: "Změna CRM → přepsat integrace s účetnictvím, BI, webem.",
          },
        ].map((l, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${l.color}`, borderRadius: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: l.color, fontFamily: fontSans, marginBottom: 2 }}>{l.name}</div>
            <div style={{ fontSize: 11, color: l.color, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85, fontStyle: "italic" }}>{l.analogy}</div>
            <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 6 }}>{l.what}</div>
            <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}30`, borderRadius: 6, padding: "6px 10px", fontSize: 10.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.5 }}>
              <b style={{ color: VSE.warning }}>Příklad:</b> {l.example}
            </div>
          </GlassBox>
        ))}
      </div>

      <Tag color={VSE.fm}>Další brzdné síly</Tag>
      <Bullet items={[
        "Efekt osvědčeného výsledku — preferujeme to, co dříve fungovalo",
        "Apatie a předsudky — strach z radikální změny byznys modelu",
        "Efekt rychlé zpětné vazby — preferujeme krátkodobé výsledky před dlouhodobými",
      ]} color={VSE.fm} />
    </div>) },

  { id: "reseni", title: "Řešení a doporučení", subtitle: "Který model kdy použít", color: VSE.success, emoji: "hammer",
    content: (<div>
      <Tag>TŘI OBLASTI ŘEŠENÍ</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 6 }}>
        <ModelCard name="Struktura" color={VSE.fph} items={[
          "Plošší org. struktura",
          "Decentralizace rozhodování",
          "Synergie napříč odděleními",
        ]} />
        <ModelCard name="Prostředí" color={VSE.fis} items={[
          "Multikulturní, otevřené",
          "Podporuje experimenty",
          "Selhání = součást učení",
        ]} />
        <ModelCard name="Manažeři" color={VSE.fmv} items={[
          "Připraveni měnit se",
          "Zbavit se starých paradigmat",
          "Pozor na status quo bias",
        ]} />
      </div>

      <GlassBox opacity={0.5} style={{ marginTop: 14, border: `1px solid ${VSE.success}35`, borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: VSE.success, fontFamily: fontMono, marginBottom: 10, letterSpacing: "1px" }}>KDY KTERÝ MODEL?</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.8, fontFamily: fontSans }}>
          <b style={{ color: VSE.nf }}>Stabilní prostředí + jasný cíl</b> → Lewin nebo Kotter<br/>
          <b style={{ color: VSE.fmv }}>Velká transformace s odporem</b> → Kotter (strukturovaný postup)<br/>
          <b style={{ color: VSE.primary }}>Kulturní změna + hledání směru</b> → Teorie U (reflexe)<br/>
          <b style={{ color: VSE.success }}>Turbulentní prostředí + zapojení lidí</b> → Change Platform
        </div>
      </GlassBox>
    </div>) },

];

const flashcards8 = [
  { term: "Change Management", def: "Systém k zabezpečení plynulého implementování změn. Pro udržení KV v turbulentním prostředí.", tag: "DEFINICE" },
  { term: "Lewin — 3 fáze", def: "1) Unfreeze (rozvolnění), 2) Change (samotná změna), 3) Freeze (zakotvení). Pozor na FREEZE — komise chytá.", tag: "MODEL" },
  { term: "Kotter — 8 kroků", def: "1) Naléhavost, 2) Koalice, 3) Vize, 4) Komunikace, 5) Delegování, 6) Krátkodobá vítězství, 7) Další změny, 8) Zakotvení.", tag: "MODEL" },
  { term: "Teorie U — 3 principy", def: "Open Mind (otevřená mysl), Open Heart (empatie), Open Will (plná angažovanost). Autor: Scharmer.", tag: "MODEL" },
  { term: "4 úrovně naslouchání", def: "Downloading → Factual → Empathic → Generative. Generative = nejhlubší, průlomové nápady.", tag: "MODEL" },
  { term: "Change Program", def: "Top-down, rozhodnutí managementu, jasně dané bez úprav. Lineární. Používá Kotter/Lewin.", tag: "PŘÍSTUP" },
  { term: "Change Platform", def: "Bottom-up, neustálé návrhy zdola, zapojení zaměstnanců, experimentování. Emergentní, STAV ne projekt.", tag: "PŘÍSTUP" },
  { term: "Investiční lock-in", def: "Investovali jsme do něčeho (technologie, zařízení) a teď bychom to měli měnit = drahé.", tag: "BARIÉRA" },
  { term: "Kompetenční lock-in", def: "Nemáme nikoho, kdo by s novým uměl pracovat. Potřebujeme nábor/zaškolení.", tag: "BARIÉRA" },
  { term: "Stakeholder lock-in", def: "Máme smlouvy s dodavateli — nemůžeme je jen tak vypovědět.", tag: "BARIÉRA" },
  { term: "Systémový lock-in", def: "Napojení na další procesy, které se musí změně také přizpůsobit.", tag: "BARIÉRA" },
  { term: "3 typy odporu", def: "Psychologický (strach), Kulturní (zažité hodnoty), Politický (mocenské boje).", tag: "BARIÉRA" },
  { term: "Resilientní organizace", def: "Odolná, přetváří strategii podle podmínek, kontinuálně předvídá trendy.", tag: "ORG. TYP" },
  { term: "Rozdíl Kotter × U", def: "Kotter = lineární, strukturovaný, top-down, 8 kroků. U = reflektivní, generativní, bottom-up, úrovně naslouchání.", tag: "POROVNÁNÍ" },
  { term: "Kdy Lewin nefunguje", def: "V turbulentním prostředí — freeze je iluzorní, organizace musí být v neustálém pohybu.", tag: "LIMIT" },
  { term: "Lock-in efekt", def: "Zamčení firmy v současném stavu kvůli minulým rozhodnutím. 4 typy: investiční, kompetenční, stakeholder, systémový.", tag: "BARIÉRA" },
];

const quiz8 = [
  { q: "Kolik kroků má Kotterův model změny?", opts: ["5", "7", "8", "10"], correct: 2 },
  { q: "První fáze Lewinova modelu je:", opts: ["Change", "Freeze", "Unfreeze", "Refreeze"], correct: 2 },
  { q: "Který princip NEPATŘÍ do Teorie U?", opts: ["Open Mind", "Open Heart", "Open Will", "Open Door"], correct: 3 },
  { q: "Change Platform je:", opts: ["Top-down rozhodnutí", "Jednorázový projekt", "Bottom-up kontinuální systém", "Software na měření změn"], correct: 2 },
  { q: "Nejhlubší úroveň naslouchání v Teorii U je:", opts: ["Downloading", "Factual", "Empathic", "Generative"], correct: 3 },
  { q: "Který lock-in = nemáme nikoho, kdo by to uměl?", opts: ["Investiční", "Kompetenční", "Stakeholder", "Systémový"], correct: 1 },
  { q: "Proč Lewin nemusí fungovat v turbulentním prostředí?", opts: ["Má málo fází", "Freeze je iluzorní — změna je kontinuální", "Je drahý", "Neobsahuje vizi"], correct: 1 },
  { q: "Firma s rigidní hierarchii a odporem zaměstnanců — co použít?", opts: ["Change Platform", "Kotter — strukturovaný postup", "Teorie U", "Nic, počkat"], correct: 1 },
  { q: "Rodinná kultura, zažité normy — jaký typ odporu?", opts: ["Psychologický", "Kulturní", "Politický", "Systémový"], correct: 1 },
  { q: "Autor Teorie U je:", opts: ["Kotter", "Lewin", "Scharmer", "Drucker"], correct: 2 },
  { q: "Change Program vs Platform — hlavní rozdíl?", opts: ["Cena", "Délka trvání", "Top-down vs bottom-up", "Počet lidí"], correct: 2 },
  { q: "Komise Háša chce u Kottera:", opts: ["Jen vize", "Všech 8 kroků chronologicky", "Pouze kritika", "Alternativy"], correct: 1 },
];

const praxe8 = {
  caseStudy: {
    company: "Microsoft — jak Nadella zachránil firmu",
    subtitle: "Učebnicový příklad Kottera v praxi (2014-dnes)",
    content: (<>
      V roce 2014 byl Microsoft v krizi. Zaměstnanci se hádali mezi sebou (divize Windows vs Azure vs Office), akcie 10 let stagnovaly. Nový šéf <b>Satya Nadella</b> použil přesně Kotterových 8 kroků:<br/><br/>
      <b style={{ color: VSE.danger }}>Naléhavost</b> → hned v prvním emailu řekl „mobile & cloud first, nebo skončíme”.<br/>
      <b style={{ color: VSE.fis }}>Vize</b> → „Pomáhat každému člověku dosáhnout víc.”<br/>
      <b style={{ color: VSE.nf }}>Komunikace</b> → doporučil všem zaměstnancům knihu o „growth mindset”.<br/>
      <b style={{ color: VSE.primary }}>Delegování</b> → zrušil systém, kde se zaměstnanci vzájemně ničili v hodnocení.<br/>
      <b style={{ color: VSE.fm }}>Krátkodobá vítězství</b> → Azure rostl 100% ročně, Office běžel i na iPhonu.<br/>
      <b style={{ color: VSE.success }}>Zakotvení</b> → nová kultura „learn-it-all” místo „know-it-all”.<br/><br/>
      <b>Výsledek:</b> z 300 miliard na 3 biliony dolarů za 10 let.
    </>),
    lessons: "Proč Kotter a ne Change Platform? Microsoft měl rigidní hierarchii a jasnou krizi. Kdyby Nadella zapojoval všechny do diskuzí („co bychom měli změnit?”), divize by se nikdy nedohodly. Top-down autorita byla potřeba — hlavně pro zrušení stack rankingu, proti kterému byla půlka managementu."
  },
  miniExamples: [
    {
      company: "Baťa (Zlín 1894)",
      tag: "LEWIN",
      color: VSE.nf,
      content: "Tomáš Baťa přivezl z USA pásovou výrobu. Unfreeze = rozbil staré cechovní zvyky. Change = zavedl pás a akordovou mzdu. Freeze = „baťovský systém” jako celoživotní kultura. Funguje, když se prostředí mění jen jednou za generaci."
    },
    {
      company: "Kodak (pád 2012)",
      tag: "LOCK-IN",
      color: VSE.fm,
      content: "Kodak vymyslel digitální fotoaparát v roce 1975, ale nepustil ho na trh. Měl miliardy v továrnách na film, chemiky místo programátorů a smlouvy s fotolaby. Zbořit celý svůj byznys bylo moc těžké — tak radši neudělal nic. A skončil."
    },
    {
      company: "Spotify",
      tag: "PLATFORM",
      color: VSE.success,
      content: "Místo reorganizace jednou za 5 let má Spotify tzv. squads — malé týmy, které si samy určují, co a jak budou dělat. Změna není projekt se začátkem a koncem, ale trvalý stav. Sedí pro tech firmy, kde se prostředí mění každý měsíc."
    }
  ]
};

const examQuestions8 = [
  { komise: "6.2.2026 — Kupec, Mládková, Kolouchová (Coffee Pot)", otazka: "Změna v organizaci, modely změny (Lewin, Kotler, U-křivka), co je to change platforma, v případovce najít co by se dalo v rámci managementu změnit", pozn: "Kupec naprosto skvělej, věřím, že u něj bych prošla i s otázkou z financí :D Mládkova chtěla přesně definovat jednotlivé pojmy, bez toho se nešlo dál. Moje otázka u ní byla hodně vztažena na případovka, takže teorie tolik nechtěla. Kolouchová mě nechala mluvit, ai se nedoptávala, takže v pohodě.V hodnocení byli hodně mírní" },
  { komise: "6.2.2026 — Střítestký, Krause, Zamazalová (Realitní firma)", otazka: "change platform, vyjmenovát ty metody z managementu (toerie u, kotter, lewin) aplikovat na pripadovku, kterou metodu bych aplikovala, jak proc a na co z pripadovky atd", pozn: "Super komise, chteli navazat vsecko na pripadovku, jinak staci zaklady co se teorie rtyce, sedi se dlouho na potitku, doporucuju si s sebou vzit vodu:Ddd" },
  { komise: "17.6.2025 — Krause, Lorencova, vavra (Kolá)", otazka: "Přístupy k change managementu a využití change platform v případovce, bariéry, Kotter a U model - v čem se liší", pozn: "Lorencovej sa nepáčilo že som k situačnému leadershipu povedal skúsenosti namiesto znalosti :)))))), inak veľmi slovickarenie pri nej, nechápali sme sa. Vavra skvelý ale pri tej otázke som fakt netušil čo chce a nechce po mne. Krause bol super a nápomocný ale ta otázka SGCP je pain takže to bolo zaujímavé. Inak neboli celkovo zlá komisia ale veľ..." },
  { komise: "16.6.2025 — Špaček, Háša, Zamazalová (Neziskovka)", otazka: "Přístupy k change managementu a využití change platform v případovce, bariéry, Kotter a U model - v čem se liší", pozn: "Komise v pohodě, největším překvapením byl Háša, který se na všechny smál, nepokládal složité otázky a oceňoval přístup, jak nad nimi přemýšlíme - u Kottera chtěl vyjmenovat chronologicky všechny body. Zamazalová nechala mluvit, řekl jsem celou teroii ze Zuzky a ani se na nic nedoptala. Špaček hodnotí mírně a snaží se pomoci. Mluvte u něj nahlas..." },
  { komise: "4.6.2025 — Mikovcová, Viktora, Kolouchová (Horská bouda)", otazka: "Change management - platform x program, bariéry, aplikace na případovku", pozn: "všichni tři v pohodě, hodně aplikace na případovku (všech 3 otázek)" },
  { komise: "4.6.2025 — Tahal, Cejthamr, Schonfeld (kolo)", otazka: "Přístupy k change managementu a využití change platform v případovce, bariéry, chtěl základní 3 modely - Lewin, Kotter a ten U model" },
  { komise: "2.6.2025 — Nový, Müllerová, Kolouchová (Prádlo)", otazka: "jak na rizeni zmeny, aplikace pripadovku, rozdil mezi kotterem a tim u-scharmerem", pozn: "jen o pripadovce, ocenili big picture, celkove propojeni do dnesniho sveta" },
  { komise: "30.1.2025 — Nový, Vávra, Heřman (Horská chata)", otazka: "Změna organizace (Change management) bariéry, metody a postupy, proč to potřebujeme - chtěli slyšet hrubý základ teorie a paak hodně aplikace na případovku - Kotter 8kroků podrobně popsat a projít celý ten proces na případovce a pak se už jen doptávali na Lewina (freeze) a U-křivku a proč pro t enhle případ nejsou vhodné" },
];

const podcast8 = {
  title: "Change Management — Kotter, Lewin, Teorie U",
  description: "10-minutový souhrn všech 3 modelů, rozdílu Program vs Platform a bariér. Ideální na cestu metrem.",
  audioUrl: "/audio/mng-8.mp3", // TODO: přidej MP3 URL jakmile bude podcast vygenerovaný v Notebook LM
  notebookLmUrl: null, // TODO: odkaz na zdrojový Notebook LM projekt
  transcript: null, // volitelně přepis
};

const examStrategy8 = `
  <b style="color:#A82A5F">1.</b> Definuj Change Mng + proč ho potřebujeme (turbulence, KV).<br/>
  <b style="color:#A82A5F">2.</b> Lewin — 3 fáze + důraz na <b>FREEZE</b> (Nový/Vávra/Heřman!).<br/>
  <b style="color:#A82A5F">3.</b> <b>Kotter — 8 kroků CHRONOLOGICKY</b> (Háša!).<br/>
  <b style="color:#A82A5F">4.</b> Teorie U — 3 principy (Mind/Heart/Will) + 4 úrovně naslouchání.<br/>
  <b style="color:#A82A5F">5.</b> Change Program × Platform — obhájit volbu pro firmu v PS (Mikovcová, Tahal).<br/>
  <b style="color:#A82A5F">6.</b> Bariéry — 3 typy odporu + 4 lock-in efekty.<br/>
  <b style="color:#A82A5F">7.</b> Aplikace na PS — <b>vybrat 1 metodu a obhájit ji</b>.<br/>
  <b style="color:#A82A5F">8.</b> ⚠️ U Mládkové / Lorencové: přesné definice (slovíčkaření).
`;

function OkruhMng8Panel() {
  return (<OkruhPanel subject="Management" subjectId="mng" number={8} title="Change Management" subtitle="Kotter / Lewin / Teorie U / Program vs Platform" color={VSE.ffu}
    questionText="Change management, modely, rozdíly, bariéry, metody a postupy, proč to potřebujeme."
    questionDesc="Proč change management. 3 modely (Lewin, Kotter, Teorie U) + rozdíly. Change Program vs Change Platform. Bariéry (3 odpory + 4 lock-in). Aplikace na PS."
    sloz={3} roz={3} freq={3}
    examStrategy={examStrategy8}
    studySections={studySections8} flashcards={flashcards8} quiz={quiz8}
    praxe={praxe8} examQuestions={examQuestions8} podcast={podcast8} />);
}

/* ════════════════════════════════════════════════════════
   OKRUH 9 — Trendy v managementu, Birkinshaw modely
   ════════════════════════════════════════════════════════ */

function BirkinshawMatrixV2() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const quadrants = [
    { id: "science", x: 60, y: 60, w: 200, h: 130, name: "SCIENCE", color: VSE.fm, ends: "LOOSE", means: "TIGHT",
      analogy: "= Laborka s pravidly", desc: "Volné cíle, pevné prostředky. Cesta je cíl — bádání a zkoumání.",
      examples: "Bayer, Roche, univerzity, MIT, architekti" },
    { id: "discovery", x: 280, y: 60, w: 200, h: 130, name: "DISCOVERY", color: VSE.fis, ends: "LOOSE", means: "LOOSE",
      analogy: "= Sandbox pro experimenty", desc: "Vše volné. Obliquity cíle jako výzva. Prostor pro inovace.",
      examples: "Google, Spotify, 3M, startupy" },
    { id: "planning", x: 60, y: 220, w: 200, h: 130, name: "PLANNING", color: VSE.primary, ends: "TIGHT", means: "TIGHT",
      analogy: "= Hodinový strojek", desc: "Vše úzké. Jasné cíle + standardizované procesy. KPI, MBO.",
      examples: "McDonald's, Amazon sklady, ČSOB" },
    { id: "quest", x: 280, y: 220, w: 200, h: 130, name: "QUEST", color: VSE.fmv, ends: "TIGHT", means: "LOOSE",
      analogy: "= Expedice s cílem", desc: "Pevné cíle, volné prostředky. Manažer je umožňovatel.",
      examples: "Banky, fintech scale-upy, Tesla" },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "20px 20px 16px", marginBottom: 4, overflow: "hidden" }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 12, fontWeight: 600, textTransform: "uppercase" }}>BIRKINSHAW MATICE — MEANS × ENDS</div>
      <svg viewBox="0 0 540 430" style={{ width: "100%", height: "auto", maxHeight: 480 }}>
        <defs>
          <marker id="arrEvo" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill={VSE.warning}/>
          </marker>
        </defs>

        {/* Osy popisky — ENDS vlevo */}
        <text x="28" y="115" fontSize="11" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle">LOOSE</text>
        <text x="28" y="290" fontSize="11" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle">TIGHT</text>

        {/* Osy popisky — MEANS dole */}
        <text x="160" y="380" fontSize="11" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle">TIGHT</text>
        <text x="380" y="380" fontSize="11" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle">LOOSE</text>

        {/* Label ENDS = VÝSLEDEK */}
        <g>
          <rect x="2" y="170" width="42" height="34" rx="10" fill={VSE.fm} />
          <text x="23" y="189" fontSize="11" fontFamily={fontMono} fill="#fff" fontWeight="800" textAnchor="middle">ENDS</text>
          <text x="23" y="200" fontSize="7" fontFamily={fontMono} fill="rgba(255,255,255,0.85)" textAnchor="middle">= výsledek</text>
        </g>

        {/* Label MEANS = ZPŮSOB */}
        <g>
          <rect x="248" y="392" width="60" height="24" rx="8" fill={VSE.fm} />
          <text x="278" y="404" fontSize="11" fontFamily={fontMono} fill="#fff" fontWeight="800" textAnchor="middle">MEANS</text>
          <text x="278" y="412" fontSize="7" fontFamily={fontMono} fill="rgba(255,255,255,0.85)" textAnchor="middle">= způsob</text>
        </g>

        {/* Vnější rámek matice */}
        <rect x="60" y="60" width="420" height="290" fill="none" stroke={t.textMuted} strokeWidth="1.5" opacity="0.3"/>
        {/* Dělení na kvadranty — čárky */}
        <line x1="270" y1="60" x2="270" y2="350" stroke={t.textMuted} strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>
        <line x1="60" y1="205" x2="480" y2="205" stroke={t.textMuted} strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>

        {/* 4 kvadranty */}
        {quadrants.map(q => {
          const isHov = hovered === q.id;
          return (
            <g key={q.id} onMouseEnter={() => setHovered(q.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              <rect x={q.x} y={q.y} width={q.w} height={q.h} rx="12"
                fill={q.color} opacity={isHov ? 1 : 0.9}
                style={{ transition: "all 200ms ease", filter: isHov ? `drop-shadow(0 0 16px ${q.color}80)` : "none" }} />
              <text x={q.x + q.w / 2} y={q.y + q.h / 2 - 10} fontSize="17" fontWeight="800" fontFamily={fontSans} fill="#fff" textAnchor="middle">{q.name}</text>
              <text x={q.x + q.w / 2} y={q.y + q.h / 2 + 10} fontSize="10" fontFamily={fontMono} fill="rgba(255,255,255,0.9)" textAnchor="middle">MODEL</text>
              <text x={q.x + q.w / 2} y={q.y + q.h / 2 + 28} fontSize="10" fontFamily={fontSans} fontStyle="italic" fill="rgba(255,255,255,0.95)" textAnchor="middle">{q.analogy}</text>
            </g>
          );
        })}

        {/* Evoluční šipka Planning → Discovery */}
        <path d="M 260 290 Q 340 230 340 180 Q 340 140 380 125" fill="none" stroke={VSE.warning} strokeWidth="3" opacity="0.75" strokeLinecap="round" markerEnd="url(#arrEvo)"/>
        <text x="310" y="250" fontSize="9" fontFamily={fontMono} fill={VSE.warning} fontWeight="800" letterSpacing="1">EVOLUCE</text>
        <text x="310" y="262" fontSize="8.5" fontFamily={fontSans} fill={VSE.warning} fontStyle="italic">moderní mng</text>
      </svg>
      {hovered ? (
        <div style={{ marginTop: 10, padding: "12px 14px", background: `${quadrants.find(q => q.id === hovered).color}15`, border: `1px solid ${quadrants.find(q => q.id === hovered).color}40`, borderRadius: 12, fontSize: 12.5, fontFamily: fontSans, color: t.text, lineHeight: 1.55 }}>
          <div style={{ fontWeight: 800, color: quadrants.find(q => q.id === hovered).color, marginBottom: 4, fontSize: 13, fontFamily: fontMono }}>
            {quadrants.find(q => q.id === hovered).name} MODEL · ENDS: {quadrants.find(q => q.id === hovered).ends} / MEANS: {quadrants.find(q => q.id === hovered).means}
          </div>
          <div style={{ marginBottom: 4 }}>{quadrants.find(q => q.id === hovered).desc}</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, marginTop: 6 }}>
            PŘÍKLADY: {quadrants.find(q => q.id === hovered).examples}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 10, padding: "10px 14px", background: t.surfaceHover, borderRadius: 10, fontSize: 11.5, fontFamily: fontSans, color: t.textMuted, textAlign: "center", lineHeight: 1.55 }}>
          <b style={{ color: t.text }}>MEANS</b> = způsob (koordinace, rozhodování) · <b style={{ color: t.text }}>ENDS</b> = výsledek (cíle, motivace)<br/>
          <span style={{ fontSize: 10.5, color: VSE.warning }}>Žlutá šipka = evoluční trend směrem k modernímu managementu (volnější způsoby + cíle)</span>
        </div>
      )}
    </div>
  );
}

function InnovationPyramid() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const layers = [
    {
      id: "prod", label: "Produktová inovace", duration: "1–2 roky KV",
      color: VSE.danger, width: 140, y: 30,
      desc: "Nový produkt. Rychlé okopírování konkurencí.",
      examples: "iPhone, Tesla Model S, M1 chip, AirPods",
    },
    {
      id: "strat", label: "Strategická inovace", duration: "3–5 let KV",
      color: VSE.fmv, width: 220, y: 110,
      desc: "Nový byznys model. Těžší ke kopírování.",
      examples: "IKEA (flat-pack), Netflix streaming, Amazon Prime, Airbnb",
    },
    {
      id: "mng", label: "Manažerská inovace", duration: "10+ let KV",
      color: VSE.success, width: 320, y: 190,
      desc: "Nový způsob řízení. Nejtěžší okopírovat — hluboce zakořeněné v kultuře.",
      examples: "Google 20 %, Toyota Production System, Holokracie (Zappos), Netflix „Freedom & Responsibility”",
    },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "22px 20px", marginTop: 14 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase" }}>PYRAMIDA INOVACÍ · HAMEL</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center" }}>
        {/* Pyramida vlevo */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg viewBox="0 0 360 290" style={{ width: "100%", maxWidth: 360, height: "auto" }}>
            {layers.map((l, i) => {
              const isHov = hovered === l.id;
              const x = (360 - l.width) / 2;
              return (
                <g key={l.id} onMouseEnter={() => setHovered(l.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                  <rect x={x} y={l.y} width={l.width} height="62" rx="8"
                    fill={l.color} opacity={isHov ? 1 : 0.9}
                    style={{ transition: "all 200ms ease", filter: isHov ? `drop-shadow(0 0 14px ${l.color}80)` : "none" }}/>
                  <text x="180" y={l.y + 26} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800" fontFamily={fontSans}>{l.label}</text>
                  <text x="180" y={l.y + 46} textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="11" fontFamily={fontMono} fontWeight="700" letterSpacing="0.5">{l.duration}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Osa "Doba udržení KV" vpravo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, minWidth: 100, padding: "10px 0" }}>
          <div style={{ fontSize: 10, fontFamily: fontMono, color: VSE.success, fontWeight: 800, letterSpacing: "1.5px", marginBottom: 6, textAlign: "center", lineHeight: 1.3 }}>
            SÍLA KV<br/>↑ roste
          </div>
          <div style={{ width: 4, flex: 1, background: `linear-gradient(to bottom, ${VSE.danger}, ${VSE.fmv}, ${VSE.success})`, borderRadius: 2, minHeight: 180, position: "relative" }}>
            <div style={{ position: "absolute", right: 10, top: 0, fontSize: 9, fontFamily: fontMono, color: VSE.danger, fontWeight: 700, whiteSpace: "nowrap" }}>1-2 roky</div>
            <div style={{ position: "absolute", right: 10, top: "48%", fontSize: 9, fontFamily: fontMono, color: VSE.fmv, fontWeight: 700, whiteSpace: "nowrap" }}>3-5 let</div>
            <div style={{ position: "absolute", right: 10, bottom: 0, fontSize: 9, fontFamily: fontMono, color: VSE.success, fontWeight: 700, whiteSpace: "nowrap" }}>10+ let</div>
          </div>
        </div>
      </div>

      {/* Hover detail */}
      {hovered ? (
        <div style={{ marginTop: 14, padding: "12px 14px", background: `${layers.find(l => l.id === hovered).color}15`, border: `1px solid ${layers.find(l => l.id === hovered).color}40`, borderRadius: 10, fontSize: 12, fontFamily: fontSans, color: t.text, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 800, color: layers.find(l => l.id === hovered).color, fontFamily: fontMono, fontSize: 11, letterSpacing: "1.5px", marginBottom: 5 }}>
            {layers.find(l => l.id === hovered).label.toUpperCase()} · {layers.find(l => l.id === hovered).duration}
          </div>
          <div style={{ marginBottom: 4 }}>{layers.find(l => l.id === hovered).desc}</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, marginTop: 4 }}>
            PŘÍKLADY: {layers.find(l => l.id === hovered).examples}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 12, padding: "8px 12px", fontSize: 11, fontFamily: fontSans, color: t.textMuted, textAlign: "center", fontStyle: "italic", lineHeight: 1.5 }}>
          Čím širší vrstva, tím silnější a trvanlivější KV · Manažerská inovace = základ, který konkurence nedokáže okopírovat
        </div>
      )}
    </div>
  );
}

function BirkinshawMatrix() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const quadrants = [
    { id: "science", x: 40, y: 40, w: 200, h: 140, name: "SCIENCE", fullName: "Science Model", color: "#8E2C5C", ends: "loose", means: "tight",
      desc: "Volné cíle, pevné prostředky. Cesta je cíl — bádání. Farmacie, univerzity, R&D labs.",
      examples: "Bayer, Roche, MIT" },
    { id: "discovery", x: 260, y: 40, w: 200, h: 140, name: "DISCOVERY", fullName: "Discovery Model", color: "#1E6FA8", ends: "loose", means: "loose",
      desc: "Vše volné. Obliquity cíle jako výzva. Prostor pro inovace, experimenty. Nové firmy, startupy.",
      examples: "Google, 3M, Spotify" },
    { id: "planning", x: 40, y: 200, w: 200, h: 140, name: "PLANNING", fullName: "Planning Model", color: "#6B2D82", ends: "tight", means: "tight",
      desc: "Vše úzké. Jasné cíle + standardizované procesy. KPI, MBO, job descriptions. Stabilní prostředí.",
      examples: "McDonald's, Amazon, ČSOB" },
    { id: "quest", x: 260, y: 200, w: 200, h: 140, name: "QUEST", fullName: "Quest Model", color: "#2B45B5", ends: "tight", means: "loose",
      desc: "Pevné cíle, volné prostředky. Manažer je umožňovatel. Rychle se měnící trh, vysoký růst.",
      examples: "Banky, fintech scale-upy" },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "20px 20px 16px", marginBottom: 4, overflow: "hidden" }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 12, fontWeight: 600, textTransform: "uppercase" }}>BIRKINSHAW MATICE — 4 MODELY</div>
      <svg viewBox="0 0 520 400" style={{ width: "100%", height: "auto", maxHeight: 440 }}>
        {/* Osy - popisky */}
        <text x="20" y="115" fontSize="11" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle" transform="rotate(-90, 20, 115)">LOOSE</text>
        <text x="20" y="275" fontSize="11" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle" transform="rotate(-90, 20, 275)">TIGHT</text>
        <text x="140" y="370" fontSize="11" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle">TIGHT</text>
        <text x="360" y="370" fontSize="11" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle">LOOSE</text>
        {/* Osa ENDS (Y) - label */}
        <g>
          <rect x="0" y="170" width="34" height="40" rx="10" fill={VSE.ffu} />
          <text x="17" y="195" fontSize="11" fontFamily={fontMono} fill="#fff" fontWeight="700" textAnchor="middle">ENDS</text>
        </g>
        {/* Osa MEANS (X) - label */}
        <g>
          <rect x="230" y="385" width="60" height="14" rx="7" fill={VSE.ffu} />
          <text x="260" y="395" fontSize="10" fontFamily={fontMono} fill="#fff" fontWeight="700" textAnchor="middle">MEANS</text>
        </g>
        {/* 4 kvadranty */}
        {quadrants.map(q => (
          <g key={q.id} onMouseEnter={() => setHovered(q.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
            <rect x={q.x} y={q.y} width={q.w} height={q.h} rx="4"
              fill={q.color} opacity={hovered === q.id ? 1 : 0.88}
              style={{ transition: "all 200ms ease", filter: hovered === q.id ? `drop-shadow(0 0 14px ${q.color}60)` : "none" }} />
            <text x={q.x + q.w / 2} y={q.y + q.h / 2 - 6} fontSize="16" fontWeight="700" fontFamily={fontSans} fill="#fff" textAnchor="middle">{q.name}</text>
            <text x={q.x + q.w / 2} y={q.y + q.h / 2 + 12} fontSize="11" fontFamily={fontSans} fill="rgba(255,255,255,0.85)" textAnchor="middle">MODEL</text>
          </g>
        ))}
      </svg>

      {/* Definice os — vždy viditelné (klíčové pro zkoušku) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
        <div style={{ padding: "8px 12px", background: `${VSE.ffu}12`, border: `1px solid ${VSE.ffu}35`, borderRadius: 10, fontSize: 11.5, fontFamily: fontSans, color: t.text, lineHeight: 1.5 }}>
          <b style={{ color: VSE.ffu, fontFamily: fontMono, letterSpacing: "0.5px" }}>MEANS = ZPŮSOB</b><br/>
          <span style={{ color: t.textMuted }}>koordinace + přijímání rozhodnutí</span>
        </div>
        <div style={{ padding: "8px 12px", background: `${VSE.ffu}12`, border: `1px solid ${VSE.ffu}35`, borderRadius: 10, fontSize: 11.5, fontFamily: fontSans, color: t.text, lineHeight: 1.5 }}>
          <b style={{ color: VSE.ffu, fontFamily: fontMono, letterSpacing: "0.5px" }}>ENDS = VÝSLEDEK</b><br/>
          <span style={{ color: t.textMuted }}>definování cílů + motivování lidí</span>
        </div>
      </div>

      {hovered ? (
        <div style={{ marginTop: 10, padding: "12px 14px", background: t.surfaceHover, borderRadius: 12, fontSize: 12.5, fontFamily: fontSans, color: t.text, lineHeight: 1.55 }}>
          <div style={{ fontWeight: 700, color: quadrants.find(q => q.id === hovered).color, marginBottom: 4, fontSize: 13 }}>
            {quadrants.find(q => q.id === hovered).fullName}
          </div>
          <div>{quadrants.find(q => q.id === hovered).desc}</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, marginTop: 6 }}>
            PŘÍKLADY: {quadrants.find(q => q.id === hovered).examples}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 10, padding: "8px 12px", fontSize: 11, fontFamily: fontSans, color: t.textMuted, textAlign: "center", fontStyle: "italic" }}>
          Najeď myší na kvadrant pro detail + příklady firem
        </div>
      )}
    </div>
  );
}

function InnovationPyramid9() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const levels = [
    { id: "mng", label: "Manažerská", sub: "10+ let KV", color: VSE.success, y: 210, w: 380,
      desc: "Nový způsob řízení firmy. Nejtěžší okopírovat — musíš změnit kulturu, což trvá roky.",
      examples: "Google 20 % · Holokracie (Zappos) · Netflix Freedom & Responsibility · Toyota Way" },
    { id: "strat", label: "Strategická", sub: "3–5 let KV", color: VSE.fmv, y: 130, w: 280,
      desc: "Nový byznys model. Konkurence tě dožene za 3–5 let, pokud má peníze a lidi.",
      examples: "IKEA (self-assembly) · Netflix streaming · Amazon Prime · Airbnb" },
    { id: "prod", label: "Produktová", sub: "1–2 roky KV", color: VSE.danger, y: 50, w: 180,
      desc: "Nový produkt nebo feature. Konkurence okopíruje do 1–2 let — reverse engineering.",
      examples: "iPhone · Tesla Model S · Apple M1 chip · Dyson vysavač" },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "22px 20px", marginTop: 14, marginBottom: 4 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase" }}>PYRAMIDA INOVACÍ · HAMEL · KV = KONKURENČNÍ VÝHODA</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 16, alignItems: "center" }}>
        {/* Levá strana — pyramida */}
        <div style={{ position: "relative", width: "100%", maxWidth: 420, margin: "0 auto" }}>
          <svg viewBox="0 0 420 290" style={{ width: "100%", height: "auto", display: "block" }}>
            {levels.map(l => {
              const isHov = hovered === l.id;
              const cx = 210;
              return (
                <g key={l.id}
                  onMouseEnter={() => setHovered(l.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}>
                  <rect
                    x={cx - l.w / 2}
                    y={l.y}
                    width={l.w}
                    height="56"
                    rx="8"
                    fill={l.color}
                    opacity={isHov ? 1 : 0.92}
                    style={{ transition: "all 200ms ease", filter: isHov ? `drop-shadow(0 0 14px ${l.color}70)` : "none" }}
                  />
                  <text x={cx} y={l.y + 25} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800" fontFamily={fontSans}>{l.label}</text>
                  <text x={cx} y={l.y + 42} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11" fontFamily={fontMono} fontWeight="700">{l.sub}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Pravá strana — osa doba KV */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: 280, paddingTop: 10, paddingBottom: 10 }}>
          <div style={{ fontSize: 10, fontFamily: fontMono, color: t.textMuted, fontWeight: 700, letterSpacing: "1px", textAlign: "center" }}>NEJKRATŠÍ<br/>KV</div>
          <svg width="24" height="160" viewBox="0 0 24 160">
            <defs>
              <linearGradient id="kvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={VSE.danger} />
                <stop offset="50%" stopColor={VSE.fmv} />
                <stop offset="100%" stopColor={VSE.success} />
              </linearGradient>
            </defs>
            <rect x="9" y="10" width="6" height="140" rx="3" fill="url(#kvGrad)" />
            <path d="M 12 150 L 5 140 L 19 140 Z" fill={VSE.success} transform="rotate(180, 12, 145)"/>
          </svg>
          <div style={{ fontSize: 10, fontFamily: fontMono, color: t.textMuted, fontWeight: 700, letterSpacing: "1px", textAlign: "center" }}>NEJDELŠÍ<br/>KV</div>
        </div>
      </div>

      {/* Hover popis */}
      {hovered && (
        <div style={{ marginTop: 14, padding: "12px 16px", background: `${levels.find(l => l.id === hovered).color}15`, border: `1px solid ${levels.find(l => l.id === hovered).color}40`, borderRadius: 10, fontSize: 12.5, fontFamily: fontSans, color: t.text, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, color: levels.find(l => l.id === hovered).color, fontFamily: fontMono, fontSize: 11, letterSpacing: "1.5px", marginBottom: 4 }}>{levels.find(l => l.id === hovered).label.toUpperCase()} INOVACE · {levels.find(l => l.id === hovered).sub}</div>
          <div style={{ marginBottom: 6 }}>{levels.find(l => l.id === hovered).desc}</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono }}>PŘÍKLADY: {levels.find(l => l.id === hovered).examples}</div>
        </div>
      )}
      {!hovered && (
        <div style={{ marginTop: 12, padding: "8px 12px", fontSize: 11, fontFamily: fontSans, color: t.textMuted, textAlign: "center", fontStyle: "italic", lineHeight: 1.5 }}>
          Čím <b>hlouběji</b> v pyramidě → tím <b>déle</b> drží konkurenční výhodu · manažerská je základ
        </div>
      )}
    </div>
  );
}

const studySections9 = [

  { id: "uvod", title: "Co je management model", subtitle: "= Firemní DNA — 4 otázky, které určují chování", color: VSE.ffu, emoji: "compass",
    content: (<div>
      <Def color={VSE.ffu}>
        <b>Management model</b> podle <b>Juliana Birkinshawa</b> = způsob, jakým firma odpovídá na <b>4 základní otázky</b>. Tyto odpovědi definují kulturu a chování celé organizace.
      </Def>
      <Tag color={VSE.ffu}>Jednoduchá otázka pro firmu</Tag>
      <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.ffu}`, borderRadius: 12, marginTop: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>🎯 „Jak firma rozhoduje, koordinuje, motivuje a cíluje?”</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", lineHeight: 1.5 }}>Odpovědi na tyto 4 otázky = management model firmy.</div>
      </GlassBox>

      <Tag>4 ZÁKLADNÍ OTÁZKY</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { num: "1", name: "Koordinace", color: VSE.nf, q: "Jak se bude koordinovat aktivita týmů a organizace?", axis: "Byrokracie × Emergence" },
          { num: "2", name: "Odpovědnost", color: VSE.fis, q: "Kdo za aktivitu bude zodpovědný?", axis: "Hierarchie × Kolektivní moudrost" },
          { num: "3", name: "Cíle", color: VSE.primary, q: "Jakým způsobem se budou nastavovat cíle?", axis: "Alignment × Obliquity" },
          { num: "4", name: "Motivace", color: VSE.fm, q: "Jaká bude motivace zaměstnanců?", axis: "Vnější × Vnitřní" },
        ].map(o => (
          <GlassBox key={o.num} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${o.color}`, borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: o.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, fontFamily: fontMono }}>{o.num}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: o.color, fontFamily: fontSans }}>{o.name}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 6 }}>{o.q}</div>
            <div style={{ fontSize: 10.5, color: o.color, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.3px", opacity: 0.9 }}>→ {o.axis}</div>
          </GlassBox>
        ))}
      </div>
    </div>) },

  { id: "osy", title: "MEANS × ENDS — osy matice", subtitle: "= Způsob × Výsledek — 4 otázky zjednodušené do 2 dimenzí", color: VSE.primary, emoji: "scale",
    content: (<div>
      <Def color={VSE.primary}>
        Birkinshaw zjednodušil 4 otázky do <b>2 dimenzí</b>, ze kterých vzniká <b>matice 2×2 se 4 modely</b>.
      </Def>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.ffu}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 2 }}>MEANS</div>
          <div style={{ fontSize: 12, color: VSE.ffu, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= ZPŮSOB (jak firma funguje)</div>
          <Bullet items={[
            "Koordinace činností (otázka 1)",
            "Přijímání rozhodnutí (otázka 2)",
            "TIGHT = byrokracie + hierarchie",
            "LOOSE = emergence + kolektivní moudrost",
          ]} color={VSE.ffu} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.fmv}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: VSE.fmv, fontFamily: fontSans, marginBottom: 2 }}>ENDS</div>
          <div style={{ fontSize: 12, color: VSE.fmv, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85 }}>= VÝSLEDEK (kam firma jde)</div>
          <Bullet items={[
            "Definování cílů (otázka 3)",
            "Motivování lidí (otázka 4)",
            "TIGHT = alignment + vnější motivace",
            "LOOSE = obliquity + vnitřní motivace",
          ]} color={VSE.fmv} />
        </GlassBox>
      </div>
    </div>) },

  { id: "matice", title: "Matice Birkinshaw — 4 modely", subtitle: "Vizuální mapa: kam firmu zařadit a kam se posunout", color: VSE.ffu, emoji: "globe",
    content: (<div>
      <Def color={VSE.ffu}>
        Kombinace 2 os (MEANS × ENDS) = <b>4 kvadranty</b>, každý s jiným typem firmy. Žlutá šipka = <b>evoluční trend</b> moderního managementu (Planning → Discovery).
      </Def>
      <BirkinshawMatrixV2 />
      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 12, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Klíčová myšlenka:</b> Většina moderních firem se snaží posunout <b>od Planning k Discovery</b> — uvolňovat procesy i cíle, aby byly flexibilnější.
      </div>
    </div>) },

  { id: "4modely", title: "4 modely v detailu", subtitle: "Každý model má analogii + typické firmy", color: VSE.primary, emoji: "hive",
    content: (<div>
      <Def color={VSE.primary}>
        Každý ze 4 modelů má svoje typické prostředí, aspekty a firmy. <b>Znej analogii</b> — pomůže si každý model zapamatovat.
      </Def>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        {[
          {
            name: "Planning Model",
            axis: "TIGHT / TIGHT",
            analogy: "= Hodinový strojek",
            color: VSE.primary,
            when: "Stabilní prostředí, pevná pozice na trhu, rutinní práce",
            items: [
              "Jasné cíle + standardizované procesy",
              "Formální pravidla a rozhodování",
              "Každý má svou roli, odpovědnost = jednotlivec",
              "Krátkodobé úspěchy, měřitelné KPI",
              "Nástroje: KPI, MBO, job descriptions",
            ],
            example: "McDonald's — standardy a normy, všechny fastfoody stejné. Amazon sklady, ČSOB.",
            plusy: ["Funguje ve stabilním prostředí", "Každý ví co dělat"],
            minusy: ["Neflexibilní", "Potlačuje kreativitu"],
          },
          {
            name: "Discovery Model",
            axis: "LOOSE / LOOSE",
            analogy: "= Sandbox pro experimenty",
            color: VSE.fis,
            when: "Nové firmy, startupy, nestabilní prostředí",
            items: [
              "Vše volné — cíle i prostředky",
              "Neformální struktury, otevřená komunikace",
              "Obliquity cíle jako výzva (cíl je, ale není jasné jak)",
              "Dosažení = představivost + pokusy",
              "Prostor pro inovace",
            ],
            example: "Google 20 % — zaměstnanci 1 den v týdnu na vlastních projektech. Vzniklo: Gmail, AdSense. 3M, Spotify.",
            plusy: ["Vysoká angažovanost", "Flexibilita + inovace"],
            minusy: ["Může nastat chaos", "Hlavně v menších firmách"],
          },
          {
            name: "Science Model",
            axis: "LOOSE ends / TIGHT means",
            analogy: "= Laborka s pravidly",
            color: VSE.fm,
            when: "Věda, R&D, architektura, farmacie",
            items: [
              "Volné cíle, pevné prostředky",
              "Cíl práce = zkoumání a bádání, ne konkrétní produkt",
              "Dobře stanovená struktura komunikace",
              "Lidé = profesionálové v oboru",
              "„Cesta je cíl”",
            ],
            example: "Výrobci léčiv (Bayer, Roche), univerzity (MIT), architekti, stavaři.",
            plusy: ["Kreativita + loajálnost", "Nízká fluktuace"],
            minusy: ["Vysoká finanční náročnost", "Pomalé výsledky"],
          },
          {
            name: "Quest Model",
            axis: "TIGHT ends / LOOSE means",
            analogy: "= Expedice s jasným cílem",
            color: VSE.fmv,
            when: "Rychle se měnící trh, firmy s vysokým růstem",
            items: [
              "Jasné cíle, způsob dosažení je na lidech",
              "Snaha zjednodušit byrokracii",
              "Manažer = umožňovatel, ne diktátor",
              "Kreativita + flexibilní reakce",
              "Motivace vlastním způsobem dosažení",
            ],
            example: "Banky, fintech scale-upy, Tesla (cíl = Mars, jak tam — na inženýrech).",
            plusy: ["Inovace + motivace", "Vysoký růst v krátké době"],
            minusy: ["Těžké udržet pod kontrolou", "Riziko velké ztráty"],
          },
        ].map((m, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${m.color}`, borderRadius: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: m.color, fontFamily: fontSans, marginBottom: 2 }}>{m.name}</div>
            <div style={{ fontSize: 10.5, color: m.color, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 2, opacity: 0.85 }}>{m.axis}</div>
            <div style={{ fontSize: 11.5, color: m.color, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8, opacity: 0.85, fontStyle: "italic" }}>{m.analogy}</div>
            <div style={{ background: `${m.color}08`, borderRadius: 6, padding: "6px 10px", marginBottom: 8, fontSize: 11.5, fontFamily: fontSans, color: "var(--text)" }}>
              <b style={{ color: m.color }}>Kdy použít:</b> {m.when}
            </div>
            <Bullet items={m.items} color={m.color} />
            <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}30`, borderRadius: 8, padding: "8px 10px", marginTop: 8, fontSize: 11, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.5 }}>
              <b style={{ color: VSE.warning }}>Příklad:</b> {m.example}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
              <div style={{ fontSize: 10.5, color: VSE.success, fontFamily: fontSans }}>✓ {m.plusy.join(" · ")}</div>
              <div style={{ fontSize: 10.5, color: VSE.danger, fontFamily: fontSans }}>✗ {m.minusy.join(" · ")}</div>
            </div>
          </GlassBox>
        ))}
      </div>
    </div>) },

  { id: "trendy", title: "Výzvy 21. století", subtitle: "= Co hýbe současným managementem — proč modely už nestačí", color: VSE.fmv, emoji: "bolt",
    content: (<div>
      <Def color={VSE.fmv}>
        Svět je turbulentní — <b>VUCA</b> (Volatility, Uncertainty, Complexity, Ambiguity). Firmy potřebují <b>5 manažerských výzev</b>, aby přežily.
      </Def>

      <Tag>5 VÝZEV PRO INOVACI MANAGEMENTU</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 6 }}>
        {[
          { num: "1", name: "Demokracie nápadů", color: VSE.nf, desc: "Pokud zaměstnanec nemůže mluvit uvnitř, bude si stěžovat externě. Dát všem hlas." },
          { num: "2", name: "Zesílení přitažlivosti", color: VSE.fis, desc: "Udělat ze zaměstnanců inovátory. Máme na to zdroje?" },
          { num: "3", name: "Relokace zdrojů", color: VSE.primary, desc: "Manažeři pod tlakem kvartálních cílů těžko investují do nejistých projektů." },
          { num: "4", name: "Mentální modely", color: VSE.fm, desc: "Staré paradigma blokuje inovace. Je potřeba nové myšlení." },
          { num: "5", name: "Příležitost pro všechny", color: VSE.success, desc: "Ne jen top management. Inovovat mohou všichni." },
        ].map(v => (
          <GlassBox key={v.num} opacity={0.5} style={{ padding: "10px 12px", borderLeft: `3px solid ${v.color}`, borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: v.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, fontFamily: fontMono }}>{v.num}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: v.color, fontFamily: fontSans }}>{v.name}</div>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: fontSans, lineHeight: 1.5, paddingLeft: 30 }}>{v.desc}</div>
          </GlassBox>
        ))}
      </div>

      <Tag color={VSE.fmv}>Konkrétní trendy v praxi</Tag>
      <Bullet items={[
        "AI a automatizace — dramaticky mění roli manažera",
        "Průmysl 4.0 — IoT, smart továrny, digitální dvojčata",
        "Remote/hybrid práce — flexibilita lokace",
        "Zkracování životního cyklu produktů",
        "ESG a udržitelnost jako součást strategie",
        "Generace Y/Z — work-life balance, smysluplná práce",
        "Hyperkonkurence díky volnému pohybu kapitálu a lidí",
      ]} color={VSE.fmv} />

      {/* Bočková/Nový warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MILUJE — BOČKOVÁ / NOVÝ / KOLOUCHOVÁ</div>
          <span>Chtějí <b>Výzvy 21. století zasadit do paradigmatu Birkinshaw</b> — propojit trendy s matice a navrhnout posun firmy.</span>
        </div>
      </div>
    </div>) },

  { id: "inovaceKV", title: "Inovace managementu = silnější KV", subtitle: "= Proč manažerská inovace drží déle než produktová", color: VSE.success, emoji: "lightbulb",
    content: (<div>
      <Def color={VSE.success}>
        Podle <b>Gary Hamela</b> existují <b>3 typy inovací</b>, každý jiné trvanlivosti. Manažerská je <b>nejsilnější</b> — konkurence ji nedokáže okopírovat.
      </Def>

      <InnovationPyramid />

      <Tag color={VSE.success}>Proč manažerská inovace přináší silnější KV</Tag>
      <Bullet items={[
        "Hard to copy — management je hluboce zakořeněný v kultuře, nejde ho vykopírovat",
        "Systémový dopad — nemění jen produkt, ale jak celá firma myslí a pracuje",
        "Dlouhodobá výhoda — typicky drží 10+ let vs. produktová 1-2 roky",
        "Multiplikace — jedna manažerská inovace zvyšuje efektivitu ve všech oblastech",
        "Kulturní bariéra — konkurenti musí změnit kulturu, což trvá roky",
        "Talent magnet — inovativní firmy přitahují top lidi",
      ]} color={VSE.success} />

      {/* Netflix vsuvka */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — NETFLIX „FREEDOM & RESPONSIBILITY”</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          Reed Hastings (zakladatel Netflixu) v roce 2009 publikoval 125-slide „culture deck” — manifest manažerské inovace. <b>Keeper test</b> („Kdybych přišel za manažerem a řekl, že končím — udělal by všechno, aby mě přemluvil?”). <b>Neomezená dovolená</b>. <b>Žádné expense reporty</b>. Cílem je mít jen <b>A-hráče</b> — průměrní dostanou odstupné. <b>Přes 15 let se to žádná firma nedokázala okopírovat</b> — protože by musela změnit celou kulturu. Manažerská inovace v čisté podobě.
        </div>
      </GlassBox>

      {/* Stříteský warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MILUJE — STŘÍTESKÝ / MÜLLEROVÁ</div>
          <span>Stříteský chce <b>logiku, ne memorování</b>. Musíš umět vysvětlit: <i>„Proč manažerská inovace dává silnější KV než produktová?”</i> Odpověď: hard to copy + systémový dopad + 10+ let.</span>
        </div>
      </div>
    </div>) },

  { id: "app9", title: "Aplikace na případovku", subtitle: "Postup 4 kroků pro komisi", color: VSE.ffu, emoji: "target",
    content: (<div>
      <Def color={VSE.ffu}>
        Na PS musíš <b>zařadit firmu do kvadrantu</b>, najít potenciální problémy a doporučit posun na vhodnější model.
      </Def>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 1 — Identifikuj 4 charakteristiky</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>Koordinace · Odpovědnost · Cíle · Motivace → pro každou zjisti, zda je TIGHT nebo LOOSE.</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 2 — Zařaď firmu do kvadrantu</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Planning / Discovery / Science / Quest — podle MEANS × ENDS.</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 3 — Najdi potenciální problémy</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>Hlavně pokud se prostředí mění:<br/>→ Stabilní firma (Planning) v turbulentní době = neflexibilita<br/>→ Startup (Discovery) s 200 zaměstnanci = chaos bez procesů</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 4 — Doporuč posun a jak to provést</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Planning → Quest: přidat OKR místo MBO, dát větší volnost<br/>→ Discovery → Science: přidat procesy pro core byznys<br/>→ Zmiňuj <b>manažerskou inovaci</b> — dává dlouhodobou KV</div>
        </GlassBox>
      </div>

      <Tag color={VSE.ffu}>Typické situace v případovkách</Tag>
      <Bullet items={[
        "Stará výrobní firma (Planning) v digitalizaci → posun k Quest",
        "Startup (Discovery) s 200 zaměstnanci → částečný posun k Science",
        "Banka (Planning/Quest) s fintech konkurencí → přidat Discovery prvky",
        "Neziskovka bez struktury → přidat Planning pro efektivitu",
      ]} color={VSE.ffu} />

      {/* Viktora / Svobodová warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>POZOR NA KOMISI</div>
          <span><b>Viktora</b> NECHCE teorii — ptá se přímo na aplikaci na PS. Přeskoč definice, jdi rovnou k zařazení firmy.<br/><b>Svobodová + Mládková</b> chtějí přesné definice — slovíčkaření. Planning ≠ „plánování obecně”, je to <b>tight/tight</b> kvadrant.</span>
        </div>
      </div>
    </div>) },

];

const flashcards9 = [
  { term: "4 otázky Birkinshaw", def: "1) Jak koordinovat? 2) Kdo odpovídá? 3) Jaké cíle? 4) Jaká motivace? Odpovědi definují management model.", tag: "ZÁKLAD" },
  { term: "MEANS vs ENDS", def: "MEANS = způsob (koordinace, rozhodování — tight/loose). ENDS = výsledek (cíle, motivace — tight/loose). 2 osy matice.", tag: "OSY" },
  { term: "Planning Model", def: "Tight/Tight. Vše úzké. Stabilní prostředí, standardizace, KPI, MBO. Příklad: McDonald's, Amazon sklady.", tag: "MODEL" },
  { term: "Discovery Model", def: "Loose/Loose. Vše volné. Startupy, Google, nestabilní prostředí. Obliquity, prostor pro inovace.", tag: "MODEL" },
  { term: "Science Model", def: "Loose ends / Tight means. Volné cíle, pevné prostředky. Cesta je cíl — bádání. Farmacie, architekti.", tag: "MODEL" },
  { term: "Quest Model", def: "Tight ends / Loose means. Pevné cíle, volné prostředky. Banky, fintech, scale-upy. Manažer je umožňovatel.", tag: "MODEL" },
  { term: "5 výzev pro inovaci mng", def: "Demokracie nápadů, Zesílení přitažlivosti, Relokace zdrojů, Zbavit se mentálních modelů, Dát příležitost všem.", tag: "VÝZVY" },
  { term: "3 typy inovací (Hamel)", def: "1) Produktová (1-2 roky KV), 2) Strategická (3-5 let KV), 3) Manažerská (10+ let KV — nejtěžší kopie).", tag: "KV" },
  { term: "Proč inovace mng = KV", def: "Hard to copy, systémový dopad, dlouhodobá výhoda, multiplikace efektivity, kulturní bariéra, talent magnet.", tag: "KV" },
  { term: "Planning model — kde funguje?", def: "Stabilní prostředí, pevná pozice na trhu, předvídatelnost vývoje. Rutinní standardizovaná práce.", tag: "APLIKACE" },
  { term: "Discovery model — kde funguje?", def: "Nové firmy, startupy, firmy v nestabilním prostředí. Menší organizace — velká se může utopit v chaosu.", tag: "APLIKACE" },
  { term: "Science model — příklady", def: "Výrobci léčiv (Bayer, Roche), architekti, stavaři, univerzity, R&D labs.", tag: "APLIKACE" },
  { term: "Quest model — příklady", def: "Banky, fintech scale-upy, firmy s vysokým růstem v krátké době.", tag: "APLIKACE" },
  { term: "Obliquity v Discovery", def: "Cíl je, ale není jasné jak ho splnit. Vyžaduje představivost + pokusy. Nepřímé dosahování cílů.", tag: "KONCEPT" },
  { term: "Trendy v managementu", def: "AI, Průmysl 4.0, remote práce, ESG, Generace Y/Z, hyperkonkurence, zkracování ŽC, síťové struktury.", tag: "TRENDY" },
  { term: "5 výzev (Hamel)", def: "Demokracie nápadů · Zesílení přitažlivosti · Relokace zdrojů · Mentální modely · Příležitost pro všechny.", tag: "VÝZVY" },
];

const quiz9 = [
  { q: "Jaké 2 osy má Birkinshawova matice?", opts: ["North × South","MEANS × ENDS","Loose × Tight","Inside × Outside"], correct: 1 },
  { q: "MEANS znamená:", opts: ["Výsledek","Způsob (koordinace + rozhodování)","Motivace","Cíle"], correct: 1 },
  { q: "ENDS znamená:", opts: ["Způsob","Výsledek (cíle + motivace)","Koordinace","Byrokracie"], correct: 1 },
  { q: "Planning model je:", opts: ["Loose/Loose","Tight/Tight","Loose/Tight","Tight/Loose"], correct: 1 },
  { q: "Discovery model používá:", opts: ["McDonald's","Google","Banka","Pošta"], correct: 1 },
  { q: "Science model je charakteristický:", opts: ["Volné cíle + pevné prostředky","Pevné cíle + volné prostředky","Vše volné","Vše úzké"], correct: 0 },
  { q: "Quest model je typický pro:", opts: ["Výrobu hamburgerů","Farmacii","Rychle se měnící trh, banky","Neziskovky"], correct: 2 },
  { q: "Proč inovace managementu přináší silnější KV než produktová?", opts: ["Je levnější","Je hard to copy a má systémový dopad","Je rychlejší","Nic z toho"], correct: 1 },
  { q: "Kolik základních otázek má Birkinshawův model?", opts: ["2","3","4","5"], correct: 2 },
  { q: "Která z otázek NENÍ součástí 4 Birkinshawových?", opts: ["Jak koordinovat?","Kdo je zodpovědný?","Jaká je cena produktu?","Jaká je motivace?"], correct: 2 },
  { q: "5 výzev pro inovaci managementu zahrnuje:", opts: ["Demokracie nápadů","Maximalizace zisku","Snížení počtu lidí","Outsourcing"], correct: 0 },
  { q: "Manažer v Quest modelu je:", opts: ["Diktátor","Umožňovatel","Kontrolor","Administrátor"], correct: 1 },
];

const praxe9 = {
  caseStudy: {
    company: "Netflix — jak změna modelu zachránila firmu",
    subtitle: "Klasický příklad přechodu mezi Birkinshawovými modely",
    content: (<>
      Netflix v roce 2007 byl <b>Planning model</b> — DVD v obálkách, jasné procesy, standardizovaná logistika, KPI na počet doručených disků. Všechno tight/tight. Fungovalo to, dokud trh byl stabilní.<br/><br/>
      Pak přišel streaming a s ním úplně jiná pravidla. Netflix musel rychle přejít na <b>Quest model</b>: jasný cíl (být #1 ve streamingu) ale volné prostředky (testovat, experimentovat, pivotovat).<br/><br/>
      <b style={{ color: VSE.fis }}>Co Reed Hastings konkrétně udělal:</b><br/>
      Zrušil schvalovací procesy pro výdaje pod 1 000 $, zavedl pravidlo „neomezená dovolená” (zaměstnanec sám rozhodne), pustil manažery, aby si platy mezi sebou řekli. <b>Loose means</b> — nech lidi dělat, co umí nejlíp.<br/><br/>
      Cíl ale zůstal jasný: vyhrát streaming. <b>Tight ends</b>. Každé čtvrtletí se měří: noví předplatitelé, retention, hodiny sledování. Kdo nedodává, odchází.<br/><br/>
      <b>Výsledek:</b> z 7 miliard tržeb v roce 2012 na 40 miliard v roce 2024. Inovace management modelu (ne jen produktu) = konkurenční výhoda, kterou se Disney+ a Apple TV dodnes snaží kopírovat.
    </>),
    lessons: "Netflix je učebnicový příklad <b>inovace managementu</b> — ne nového produktu. Konkurenti vidí, co Netflix dělá, ale nedokážou to zkopírovat, protože by museli přepsat celou svoji kulturu. To je ta KV, na kterou komise ptá."
  },
  miniExamples: [
    { company: "Haier (Čína)", tag: "DISCOVERY EXTRÉMNĚ", color: "#1E6FA8", content: "Haier rozdělil firmu na 4 000 mikropodniků po 10-15 lidech. Každý mikropodnik si sám určuje strategii, P&L, může prodávat i mimo firmu. Z obří korporace se stala Discovery struktura. Obrat: 35 mld USD." },
    { company: "SpaceX", tag: "QUEST", color: "#2B45B5", content: "Pevný cíl — Mars. Volné prostředky — inženýři můžou navrhovat raketu od nuly. Pracují 80 hodin týdně, ale sami se rozhodují jak. Elon není diktátor detailů, je umožňovatel vize. Tight ends, loose means." },
    { company: "Valve", tag: "DISCOVERY", color: "#1E6FA8", content: "Valve (Counter-Strike, Steam) nemá manažery ani formální role. Stoly mají kolečka — kdo chce na jiný projekt, prostě přijede. Loose/loose. 400 zaměstnanců, obrat miliardy. Funguje, protože mají top talenty." },
    { company: "Bayer", tag: "SCIENCE", color: "#8E2C5C", content: "Farmaceutická firma Bayer — výzkum léků. Cíl „najít lék na rakovinu” je volný (nevíš, kdy a jestli vůbec), ale prostředky jsou pevné — laboratoře, protokoly, klinické studie. Loose ends, tight means." }
  ]
};

const examQuestions9 = [
  { komise: "2.2.2026 — Střítěský, Lorencová, Pernica (Neziskovka: handicapovaní)", otazka: "Moderní trendy v HR, aplikovat na případovku", pozn: "Za mě byla komise milá, doptávali se, ale neměla jsem z nich pocit, že by nás chtěli potopit. Obecně byli milí. Lorencová to chtěla nasadit i na případovku, což jsem na potítku nevěděla jak, s ohledem na téma, ale doptávala se tak, že mě to navádělo co chce a nějak jsme to daly dohromady." },
  { komise: "2.2.2026 — Schönfeld, Legnerová, Zamazalová (Prádlo)", otazka: "Jaké jsou nové trendy v managementu? Proč a jak inovace managementu přináší konkurenční výhodu organizaci?", pozn: "Boží komise. Důležité je tvářit se sebevědomě a jakože víš, o čem mluvíš, ale i když jsem něco nevěděla, tak navedli." },
  { komise: "16.6.2025 — Špaček, Kučera, Zamazalová (Víno)", otazka: "Management: Modell řízení + měkké a tvrdé prvky + najít v případovce + najít příležitosti pro zlepšení a proč", pozn: "Vinařství, akciová společnost, management: planning model, HR: špatně motivace, odměňování, dobře vztah k zákazníkům, kultura prostředí, CEO + 5 náměstků, #3-4 na trhu, hodně o produktech, hraje roli turbuletní doba - potřeba rychle se přizpůsobit Jinak komise příjemná, Kučera hodně filosof, hodně otevřených otázek, ale v pohodě týpek, chce si p..." },
  { komise: "10.6.2025 — Double Stříteský, Müllerová (Neziskovka)", otazka: "Trendy v managementu, inovace managementu, proč přinášejí KV, modely management model - popsat na případovce" },
  { komise: "5.2.2025 — Nový, Kolouchová, Svobodová", otazka: "inovace managementu" },
  { komise: "4.2.2025 — Vrbová, Tahal, Svobodová (Vinařská firma)", otazka: "Trendy v managementu, management modely (Birkinshaw), vztahnout na případovku" },
  { komise: "4.2.2025 — Mikovcová, Kolouchová, Viktora (Firma vyrábějící hrnce (má to být asi Tescoma))", otazka: "Trendy v managementu, inovace managementu, proč přinášejí KV, modely management modelu… (Viktora nechce vůbec teorii, ptal se pouze na ty trendy, jaké jsou a něco najít v případovce)" },
  { komise: "3.2.2025 — Stříteský, Bočková, Lorenzová (Horská chata)", otazka: "HR trendy a strategie HR" },
  { komise: "28.1.2025 — Tahal, Kuděj , Nový (Pripadovka: spolenost na sanace, plisne, odvhlcovani :D)", otazka: "Trendy HR, strategie HR" },
];

const podcast9 = {
  title: "Trendy v managementu a Birkinshaw modely",
  description: "10-minutový souhrn 4 modelů (Planning, Discovery, Science, Quest), 5 výzev pro inovaci managementu a proč manažerská inovace přináší dlouhodobou KV.",
  audioUrl: "/audio/mng-9.mp3",
  notebookLmUrl: null,
  transcript: null,
};

const examStrategy9 = `
  <b style="color:#A82A5F">1.</b> Management model (Birkinshaw: 4 otázky — koordinace, odpovědnost, cíle, motivace).<br/>
  <b style="color:#A82A5F">2.</b> MEANS × ENDS — osy matice (způsob × výsledek).<br/>
  <b style="color:#A82A5F">3.</b> <b>4 modely</b> (Planning, Discovery, Science, Quest) — aspekty + příklady firem.<br/>
  <b style="color:#A82A5F">4.</b> Výzvy 21. století (AI, ESG, Gen Y/Z, Průmysl 4.0) — propojit s Birkinshawem.<br/>
  <b style="color:#A82A5F">5.</b> <b>3 typy inovací (Hamel)</b> — proč manažerská = 10+ let KV (Stříteský chce logiku!).<br/>
  <b style="color:#A82A5F">6.</b> Aplikace na PS — zařaď firmu + doporuč posun.<br/>
  <b style="color:#A82A5F">7.</b> ⚠️ Viktora nechce teorii · Svobodová/Mládková přesné definice.
`;

function OkruhMng9Panel() {
  return (<OkruhPanel subject="Management" subjectId="mng" number={9} title="Trendy v managementu + Birkinshaw modely" subtitle="4 modely / MEANS × ENDS / Inovace managementu = KV" color={VSE.ffu}
    questionText="Trendy v managementu, management modely (Birkinshaw), vztáhnout na případovku, inovace managementu, proč přinášejí KV."
    questionDesc="4 základní otázky Birkinshaw. 4 modely (Planning/Discovery/Science/Quest) na matici MEANS × ENDS. Moderní trendy. Proč inovace managementu dává silnější KV než produktová. Aplikace na PS."
    sloz={3} roz={3} freq={3}
    examStrategy={examStrategy9}
    studySections={studySections9} flashcards={flashcards9} quiz={quiz9}
    praxe={praxe9} examQuestions={examQuestions9} podcast={podcast9} />);
}

/* ════════════════════════════════════════════════════════
   OKRUH 10 — Globální × Lokální řízení firmy
   ════════════════════════════════════════════════════════ */

function GlobLokSpectrum() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const items = [
    {
      id: "glob", label: "Globalizace", icon: "globe",
      color: VSE.fph, x: 15,
      analogy: "= Jeden recept pro celý svět",
      desc: "Světový proces prolínání mezi zeměmi (lidé, info, technika, politika, kultura, kapitál).",
      examples: "Apple, Coca-Cola classic, IKEA kuchyně",
    },
    {
      id: "glok", label: "Glokalizace", icon: "scale",
      color: VSE.fmv, x: 50,
      analogy: "= Think globally, act locally",
      desc: "Globální firma se přizpůsobí lokálním podmínkám — kromě standardních produktů má i lokální varianty.",
      examples: "McDonald's McSmažák, Starbucks, Google Doodles",
    },
    {
      id: "lok", label: "Lokalizace", icon: "map",
      color: VSE.fis, x: 85,
      analogy: "= Každé město svůj recept",
      desc: "Rozložení trhu, ekonomických, politicko-správních aktivit na menší územní celky.",
      examples: "Rodinné firmy, regionální značky, farmářské trhy",
    },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "22px 20px", marginTop: 14, marginBottom: 4 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase" }}>SPEKTRUM 3 PŘÍSTUPŮ</div>
      <div style={{ position: "relative", padding: "10px 0 30px" }}>
        {/* Osa */}
        <svg viewBox="0 0 600 140" style={{ width: "100%", height: "auto", display: "block" }}>
          <defs>
            <linearGradient id="spectrumGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={VSE.fph} stopOpacity="0.6"/>
              <stop offset="50%" stopColor={VSE.fmv} stopOpacity="0.6"/>
              <stop offset="100%" stopColor={VSE.fis} stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          {/* Čára spektra */}
          <line x1="60" y1="70" x2="540" y2="70" stroke="url(#spectrumGrad)" strokeWidth="6" strokeLinecap="round"/>

          {/* 3 bubliny */}
          {items.map(it => {
            const cx = 60 + (it.x / 100) * 480;
            const isHov = hovered === it.id;
            return (
              <g key={it.id} onMouseEnter={() => setHovered(it.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                <circle cx={cx} cy="70" r={isHov ? 34 : 30} fill={it.color} opacity={isHov ? 1 : 0.92}
                  style={{ transition: "all 200ms ease", filter: isHov ? `drop-shadow(0 0 14px ${it.color}90)` : "none" }}/>
                <text x={cx} y="75" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800" fontFamily={fontSans}>{it.label.slice(0,5).toUpperCase()}</text>
                <text x={cx} y="125" textAnchor="middle" fill={t.text} fontSize="12" fontWeight="700" fontFamily={fontSans}>{it.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover detail */}
      {hovered ? (
        <div style={{ marginTop: 4, padding: "12px 16px", background: `${items.find(i => i.id === hovered).color}15`, border: `1px solid ${items.find(i => i.id === hovered).color}40`, borderRadius: 12, fontSize: 12.5, fontFamily: fontSans, color: t.text, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 800, color: items.find(i => i.id === hovered).color, fontFamily: fontMono, fontSize: 11, letterSpacing: "1.5px", marginBottom: 3 }}>
            {items.find(i => i.id === hovered).label.toUpperCase()}
          </div>
          <div style={{ fontSize: 11.5, color: items.find(i => i.id === hovered).color, fontFamily: fontMono, fontStyle: "italic", marginBottom: 6 }}>
            {items.find(i => i.id === hovered).analogy}
          </div>
          <div style={{ marginBottom: 4 }}>{items.find(i => i.id === hovered).desc}</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, marginTop: 4 }}>
            PŘÍKLADY: {items.find(i => i.id === hovered).examples}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 4, padding: "8px 12px", fontSize: 11, fontFamily: fontSans, color: t.textMuted, textAlign: "center", fontStyle: "italic", lineHeight: 1.5 }}>
          Glokalizace = most mezi globálním a lokálním · Najeď myší na bubliny pro detail
        </div>
      )}
    </div>
  );
}

function StrategyMatrix2x2() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const quadrants = [
    {
      id: "global", x: 60, y: 60, w: 200, h: 130,
      name: "GLOBAL", color: VSE.success,
      cost: "HIGH", local: "LOW",
      analogy: "= Jeden recept všude",
      desc: "Úspory z rozsahu, centrální řízení, unifikovaný produkt globálně.",
      examples: "Apple, Samsung, IKEA",
    },
    {
      id: "trans", x: 280, y: 60, w: 200, h: 130,
      name: "TRANSNATIONAL", color: VSE.fmv,
      cost: "HIGH", local: "HIGH",
      analogy: "= Nejlepší z obou světů",
      desc: "Úspory z rozsahu + lokální přizpůsobení. Sdílení know-how napříč pobočkami.",
      examples: "McDonald's, Nestlé, Unilever",
    },
    {
      id: "inter", x: 60, y: 220, w: 200, h: 130,
      name: "INTERNATIONAL", color: VSE.fis,
      cost: "LOW", local: "LOW",
      analogy: "= Export z domova",
      desc: "Vše vyráběno v domovské zemi, malé lokální manufaktury exportují do sousedních zemí.",
      examples: "Menší exportéři, začínající firmy",
    },
    {
      id: "multi", x: 280, y: 220, w: 200, h: 130,
      name: "MULTINATIONAL", color: VSE.fm,
      cost: "LOW", local: "HIGH",
      analogy: "= Lokální suverén",
      desc: "Decentralizovaná struktura, každá země si jede svoje. Reaguje na lokální preference.",
      examples: "Philips (historicky), MTV lokální obsah",
    },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "20px 20px 16px", marginBottom: 4, overflow: "hidden" }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 12, fontWeight: 600, textTransform: "uppercase" }}>STRATEGIE MATICE — 4 TYPY PŘÍSTUPU</div>
      <svg viewBox="0 0 540 430" style={{ width: "100%", height: "auto", maxHeight: 480 }}>
        {/* Popisky os */}
        <text x="28" y="115" fontSize="10" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle">HIGH</text>
        <text x="28" y="125" fontSize="8" fontFamily={fontMono} fill={t.textMuted} textAnchor="middle">cost</text>
        <text x="28" y="135" fontSize="8" fontFamily={fontMono} fill={t.textMuted} textAnchor="middle">reduc.</text>
        <text x="28" y="285" fontSize="10" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle">LOW</text>

        <text x="160" y="380" fontSize="10" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle">LOW local</text>
        <text x="160" y="392" fontSize="8" fontFamily={fontMono} fill={t.textMuted} textAnchor="middle">responsiveness</text>
        <text x="380" y="380" fontSize="10" fontFamily={fontMono} fill={t.textMuted} fontWeight="700" textAnchor="middle">HIGH local</text>
        <text x="380" y="392" fontSize="8" fontFamily={fontMono} fill={t.textMuted} textAnchor="middle">responsiveness</text>

        {/* Label COST REDUCTION */}
        <g>
          <rect x="2" y="170" width="42" height="40" rx="10" fill={VSE.fm} />
          <text x="23" y="186" fontSize="9" fontFamily={fontMono} fill="#fff" fontWeight="800" textAnchor="middle">COST</text>
          <text x="23" y="198" fontSize="9" fontFamily={fontMono} fill="#fff" fontWeight="800" textAnchor="middle">RED.</text>
        </g>

        {/* Label LOCAL RESP */}
        <g>
          <rect x="230" y="400" width="80" height="20" rx="8" fill={VSE.fm} />
          <text x="270" y="414" fontSize="9" fontFamily={fontMono} fill="#fff" fontWeight="800" textAnchor="middle">LOCAL RESP.</text>
        </g>

        {/* Vnější rámec + dělítka */}
        <rect x="60" y="60" width="420" height="290" fill="none" stroke={t.textMuted} strokeWidth="1.5" opacity="0.3"/>
        <line x1="270" y1="60" x2="270" y2="350" stroke={t.textMuted} strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>
        <line x1="60" y1="205" x2="480" y2="205" stroke={t.textMuted} strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>

        {/* 4 kvadranty */}
        {quadrants.map(q => {
          const isHov = hovered === q.id;
          return (
            <g key={q.id} onMouseEnter={() => setHovered(q.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              <rect x={q.x} y={q.y} width={q.w} height={q.h} rx="12"
                fill={q.color} opacity={isHov ? 1 : 0.9}
                style={{ transition: "all 200ms ease", filter: isHov ? `drop-shadow(0 0 16px ${q.color}80)` : "none" }} />
              <text x={q.x + q.w / 2} y={q.y + q.h / 2 - 10} fontSize="16" fontWeight="800" fontFamily={fontSans} fill="#fff" textAnchor="middle">{q.name}</text>
              <text x={q.x + q.w / 2} y={q.y + q.h / 2 + 10} fontSize="9" fontFamily={fontMono} fill="rgba(255,255,255,0.9)" textAnchor="middle">STRATEGIE</text>
              <text x={q.x + q.w / 2} y={q.y + q.h / 2 + 28} fontSize="10" fontFamily={fontSans} fontStyle="italic" fill="rgba(255,255,255,0.95)" textAnchor="middle">{q.analogy}</text>
            </g>
          );
        })}
      </svg>

      {hovered ? (
        <div style={{ marginTop: 10, padding: "12px 14px", background: `${quadrants.find(q => q.id === hovered).color}15`, border: `1px solid ${quadrants.find(q => q.id === hovered).color}40`, borderRadius: 12, fontSize: 12.5, fontFamily: fontSans, color: t.text, lineHeight: 1.55 }}>
          <div style={{ fontWeight: 800, color: quadrants.find(q => q.id === hovered).color, marginBottom: 4, fontSize: 13, fontFamily: fontMono }}>
            {quadrants.find(q => q.id === hovered).name} · Cost: {quadrants.find(q => q.id === hovered).cost} / Local: {quadrants.find(q => q.id === hovered).local}
          </div>
          <div style={{ marginBottom: 4 }}>{quadrants.find(q => q.id === hovered).desc}</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, marginTop: 6 }}>
            PŘÍKLADY: {quadrants.find(q => q.id === hovered).examples}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 10, padding: "10px 14px", background: t.surfaceHover, borderRadius: 10, fontSize: 11.5, fontFamily: fontSans, color: t.textMuted, textAlign: "center", lineHeight: 1.55 }}>
          <b style={{ color: t.text }}>COST REDUCTION</b> = tlak na úspory z rozsahu · <b style={{ color: t.text }}>LOCAL RESPONSIVENESS</b> = tlak na přizpůsobení místním potřebám<br/>
          <span style={{ fontSize: 10.5 }}>Najeď myší na kvadrant pro detail + příklady firem</span>
        </div>
      )}
    </div>
  );
}

const studySections10 = [

  { id: "uvod", title: "3 základní pojmy", subtitle: "= Jak firma funguje napříč zeměmi", color: VSE.ffu, emoji: "globe",
    content: (<div>
      <Def color={VSE.ffu}>
        Existují <b>3 přístupy</b>, jak firma může řídit mezinárodní působení: <b>Globalizace</b>, <b>Lokalizace</b> a <b>Glokalizace</b> — a každá má svoji logiku.
      </Def>
      <Tag color={VSE.ffu}>Otázka pro firmu</Tag>
      <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.ffu}`, borderRadius: 12, marginTop: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>🎯 „Máme pro celý svět jeden recept, nebo každá země svoji verzi?”</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", lineHeight: 1.5 }}>Odpověď určuje strategii, org. strukturu i náklady.</div>
      </GlassBox>

      <GlobLokSpectrum />
    </div>) },

  { id: "glob", title: "Globální řízení firmy", subtitle: "= Jeden recept pro celý svět — centrální řízení", color: VSE.fph, emoji: "pillar",
    content: (<div>
      <Def color={VSE.fph}>
        <b>Globalizace</b> = světový proces prolínání mezi zeměmi (lidé, informace, technika, politika, kultura, kapitál, zboží a služby). Firma jede <b>jednotnou strategii pro celý svět</b>.
      </Def>

      <Tag color={VSE.fph}>Charakteristiky globálně řízené firmy</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.fph}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fph, fontFamily: fontSans, marginBottom: 6 }}>Jak firma funguje</div>
          <Bullet items={[
            "Do okolí se šíří postupně (ne všude najednou)",
            "Drží si stejné know-how napříč zeměmi",
            "Mezinárodní management — neřídí se z 1 místa",
            "Jednotná strategie pro celý svět",
            "Unifikace produktu — stejná verze všude",
          ]} color={VSE.fph} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.fph}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.fph, fontFamily: fontSans, marginBottom: 6 }}>Globální leadership</div>
          <Bullet items={[
            "Flexibilita a jednání v rámci firmy",
            "Neformální networking mezi odděleními",
            "Cross-culture thinking — vzít to nejlepší z každé kultury",
            "Lídři propojují světové trhy",
          ]} color={VSE.fph} />
        </GlassBox>
      </div>

      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Ukázkový příklad:</b> <b>Apple</b> — stejný iPhone, stejný design, stejný MacBook po celém světě. Jen přidá jazyk. Úspory z rozsahu v maximální formě.
      </div>

      <Tag color={VSE.success}>Výhody globalizace (pro firmu)</Tag>
      <Bullet items={[
        "Snížení nákladů — úspory z rozsahu",
        "Růst na trhu, obsluhuji větší trh",
        "Větší stabilita — když selže 1 dodavatel, mám další",
        "Standardizace norem — srovnatelná kvalita",
        "Přenositelnost marketingu — globální kampaně",
      ]} color={VSE.success} />

      <Tag color={VSE.danger}>Nevýhody globalizace (pro firmu)</Tag>
      <Bullet items={[
        "Neflexibilita — pomalá reakce na lokální změny",
        "Unifikovaný produkt — nemusí sedět všem trhům",
        "Závislost na globálním trhu",
        "Rozdíly kultur a jazyků jako překážka",
      ]} color={VSE.danger} />
    </div>) },

  { id: "globvyhody", title: "Globalizace — dopady na svět", subtitle: "Kompletní tabulka výhod × nevýhod", color: VSE.primary, emoji: "scale",
    content: (<div>
      <Def color={VSE.primary}>
        Globalizace má dopady na celou společnost, ne jen firmy. Komise chce, abys uměl obě strany — <b>výhody i nevýhody</b>.
      </Def>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.success}`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: VSE.success, fontFamily: fontMono, letterSpacing: "1.5px", marginBottom: 8 }}>✓ VÝHODY</div>
          <Bullet items={[
            "Dělba práce mezi regiony",
            "Růst objemu globálně obchodovatelného zboží a služeb",
            "Snižování cen — klesají výrobní i prodejní ceny",
            "Společnosti dosahují úspor z rozsahu",
            "Šíření informací, znalostí, technologií",
            "Ekonomický růst původně rozvojových zemí",
            "Standardizace norem — srovnatelná kvalita",
            "Nové pracovní příležitosti",
            "Přenositelnost marketingu, konkurenční výhody",
            "Možnosti cestování, kulturní obohacení",
            "Širší škála výrobků a služeb",
          ]} color={VSE.success} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.danger}`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: VSE.danger, fontFamily: fontMono, letterSpacing: "1.5px", marginBottom: 8 }}>✗ NEVÝHODY</div>
          <Bullet items={[
            "Objem dopravy a vliv na životní prostředí",
            "Kvantita na úkor kvality",
            "Unifikace výrobků (ztráta unikátnosti)",
            "Nepodpora místní zaměstnanosti — vývoz práce do levných krajin",
            "Vzájemná závislost a propojenost ekonomik",
            "Nerovnost v přístupu ke společenskému růstu",
            "20 % populace v nejchudších částech neroste spotřeba",
            "Roste nezaměstnanost v rozvinutých zemích",
            "Boj o zdroje nerostných surovin",
            "Novodobé otroctví",
            "Závislost na globálním trhu",
          ]} color={VSE.danger} />
        </GlassBox>
      </div>

      <Tag color={VSE.danger}>Hrozby globalizace (pro firmu)</Tag>
      <Bullet items={[
        "Globální leadership — nároky na lídry jsou vyšší",
        "Rozdíly kultur — konflikty, nedorozumění",
        "Poškození životního prostředí",
        "Finanční náročnost",
        "„Kolonizace” lokálních trhů",
        "Ovlivňování — reputační rizika v mezinárodním měřítku",
      ]} color={VSE.danger} />
    </div>) },

  { id: "lok", title: "Lokální řízení firmy", subtitle: "= Každé město svůj recept — decentralizace", color: VSE.fis, emoji: "map",
    content: (<div>
      <Def color={VSE.fis}>
        <b>Lokalizace</b> = rozložení trhu, ekonomických, politicko-správních a jiných aktivit na <b>menší územní celky</b>. Opak globalizace, aktuální trend.
      </Def>

      <Tag color={VSE.fis}>Charakteristiky lokálně řízené firmy</Tag>
      <Bullet items={[
        "Umí reagovat na místní podmínky",
        "Schopná měnit produkt podle požadavků trhu",
        "Lokální manažeři v různých zemích",
        "Zvyklá na nestabilní systém (malé trhy se mění)",
        "Zrychlená internacionalizace — know-how z vyspělých zemí",
      ]} color={VSE.fis} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.success}`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: VSE.success, fontFamily: fontMono, letterSpacing: "1.5px", marginBottom: 8 }}>✓ VÝHODY</div>
          <Bullet items={[
            "Přímé vztahy mezi výrobci a spotřebiteli",
            "Přehlednost",
            "Soběstačnost",
            "Dlouhodobě udržitelné procesy",
            "Minimalizace dopravy zboží (menší dopad na ŽP)",
            "Využití místních zdrojů (suroviny, lidé, energie)",
          ]} color={VSE.success} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.danger}`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: VSE.danger, fontFamily: fontMono, letterSpacing: "1.5px", marginBottom: 8 }}>✗ NEVÝHODY</div>
          <Bullet items={[
            "Náročnost na realizaci",
            "Užší sortiment výrobků",
            "Menší tlak na inovace a efektivitu",
            "Omezené zdroje",
            "Závislost na místním trhu",
          ]} color={VSE.danger} />
        </GlassBox>
      </div>

      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Příklady:</b> Rodinné pekařství, regionální pivovar (Bernard, Svijany), farmářské trhy, lokální módní značky.
      </div>
    </div>) },

  { id: "glok", title: "Glokalizace — řešení paradoxu", subtitle: "= Think globally, act locally", color: VSE.fmv, emoji: "bolt",
    content: (<div>
      <Def color={VSE.fmv}>
        <b>Glokalizace</b> = globální firmy se přizpůsobují <b>lokálním podmínkám</b>. Kromě standardních produktů nabízí i lokální varianty, aby oslovily místní trh.
      </Def>

      <Tag color={VSE.fmv}>Co glokalizace přináší</Tag>
      <Bullet items={[
        "Kombinuje úspory z rozsahu (globální) s přizpůsobením (lokální)",
        "Vyšší zisky — přizpůsobení = spokojenější zákazníci",
        "Spojení výhod globalizace i lokalizace",
        "Přizpůsobuje se: názvy, barvy, složení, receptury, marketing",
      ]} color={VSE.fmv} />

      <Tag color={VSE.fmv}>Konkrétní příklady glokalizace</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { name: "McDonald's", color: VSE.danger, what: "McSmažák v ČR, McLobster v Kanadě, Samurai burger v Japonsku. V Indii nemá hovězí — Maharaja Mac z kuřecího." },
          { name: "Starbucks", color: VSE.success, what: "Přizpůsobuje vzhled kaváren lokálnímu prostředí — v Kjótu tradiční japonský dům, v Miláně elegantní palác." },
          { name: "Google", color: VSE.nf, what: "Různá loga (Doodles) k lokálním svátkům a událostem. Překládá produkty do 100+ jazyků." },
          { name: "Tesco", color: VSE.fph, what: "V USA jede pod názvem Fresh & Easy (s ohledem na místní asociace značky). Jiný sortiment pro každý trh." },
        ].map((ex, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${ex.color}`, borderRadius: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: ex.color, fontFamily: fontSans, marginBottom: 6 }}>{ex.name}</div>
            <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5 }}>{ex.what}</div>
          </GlassBox>
        ))}
      </div>

      {/* Komise warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MILUJE — MIKOVCOVÁ / KOLOUCHOVÁ / VIKTORA</div>
          <span>Ptají se na <b>PARADOX globálního vs lokálního</b> — „proč to tak je” + <b>řešení</b>. Odpověď: glokalizace kombinuje obojí. Jako příklad zmiň McDonald's McSmažák — to komise slyší rád.</span>
        </div>
      </div>
    </div>) },

  { id: "matice", title: "4 typy mezinárodních strategií", subtitle: "Matice: Cost Reduction × Local Responsiveness", color: VSE.primary, emoji: "compass",
    content: (<div>
      <Def color={VSE.primary}>
        Firmy se při vstupu na mezinárodní trh rozhodují podle <b>2 os</b>: kolik tlaku je na <b>úspory z rozsahu</b> (cost reduction) a kolik na <b>lokální přizpůsobení</b> (local responsiveness). Ze 2 os vzniká <b>4 typy strategií</b>.
      </Def>

      <StrategyMatrix2x2 />

      <Tag color={VSE.primary}>Jak si 4 strategie vybrat</Tag>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
        {[
          { name: "MULTINATIONAL", color: VSE.fm, when: "Silná lokální přítomnost, vysoká vnímavost k místním problémům. Vhodné pro potraviny, móda." },
          { name: "GLOBAL", color: VSE.success, when: "Nákladová výhoda z centralizovaných aktivit. Vhodné pro tech produkty (Apple, Samsung)." },
          { name: "INTERNATIONAL", color: VSE.fis, when: "Využívání znalostí mateřské společnosti v cizině, menší přizpůsobení. Začínající exportéři." },
          { name: "TRANSNATIONAL", color: VSE.fmv, when: "Kombinuje úspory z rozsahu + flexibilitu + učení po celém světě. Nejnáročnější, nejvyspělejší. McDonald's." },
        ].map((s, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "10px 14px", borderLeft: `4px solid ${s.color}`, borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: fontMono, letterSpacing: "1px", minWidth: 130 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, flex: 1 }}>{s.when}</div>
            </div>
          </GlassBox>
        ))}
      </div>
    </div>) },

  { id: "hnaci", title: "Hnací síly internacionalizace", subtitle: "= Proč firmy jdou do zahraničí", color: VSE.success, emoji: "bolt",
    content: (<div>
      <Def color={VSE.success}>
        <b>Internacionalizace</b> = reakce firmy na globalizaci, firemní angažovanost v cizích zemích. <b>5 hlavních hnacích sil</b> určuje, zda a kam jít.
      </Def>

      <Tag color={VSE.success}>5 HNACÍCH SIL</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 6 }}>
        {[
          { num: "1", name: "Trh", color: VSE.nf, desc: "Poptávka v cizině, marketing, přesycenost domácího trhu." },
          { num: "2", name: "Vláda", color: VSE.fis, desc: "Odstranění bariér, dohody o volném obchodu, podpora exportu." },
          { num: "3", name: "Náklady", color: VSE.primary, desc: "Úspory z rozsahu, levnější pracovní síla, suroviny." },
          { num: "4", name: "Konkurence", color: VSE.fm, desc: "Kooperace s mezinárodními firmami, tlak na expanzi." },
          { num: "5", name: "Diverzifikace rizika", color: VSE.fmv, desc: "Rozložení rizika přes více zemí — ekonomické cykly, výkyvy poptávky." },
        ].map(s => (
          <GlassBox key={s.num} opacity={0.5} style={{ padding: "10px 12px", borderLeft: `3px solid ${s.color}`, borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, fontFamily: fontMono }}>{s.num}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: s.color, fontFamily: fontSans }}>{s.name}</div>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: fontSans, lineHeight: 1.5, paddingLeft: 30 }}>{s.desc}</div>
          </GlassBox>
        ))}
      </div>

      <Tag color={VSE.fmv}>3 mechanismy integrace</Tag>
      <Bullet items={[
        "Standardizace — zákazník dostane to samé všude",
        "Koordinace — sladění aktivit napříč zeměmi",
        "Centralizace — úspory z rozsahu nebo využití specifické výhody jedné země",
      ]} color={VSE.fmv} />
    </div>) },

  { id: "app10", title: "Aplikace na případovku", subtitle: "Postup 4 kroků pro komisi", color: VSE.ffu, emoji: "target",
    content: (<div>
      <Def color={VSE.ffu}>
        Na PS musíš <b>zařadit firmu</b> (globální / lokální / glokální), najít <b>strategii</b> v matici, identifikovat <b>hrozby a výhody</b> a navrhnout <b>posun</b>.
      </Def>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 1 — Zařaď firmu do 3 pojmů</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Jednotný produkt všude? → <b>Globální</b><br/>→ Každý trh jiné řešení? → <b>Lokální</b><br/>→ Globální s lokálními variantami? → <b>Glokální</b></div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 2 — Najdi strategii v matici 2×2</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>Cost reduction (LOW/HIGH) × Local responsiveness (LOW/HIGH):<br/>→ Global / Transnational / International / Multinational</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 3 — Identifikuj hrozby a výhody</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Kulturní rozdíly? Environmentální dopad? Závislost na globálním trhu?<br/>→ Jaké výhody firma z globalizace/lokalizace má?</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 4 — Navrhni posun</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>→ Rigidně globální firma ztrácí trh → přidat lokální varianty (glokalizace)<br/>→ Lokální firma s potenciálem → zvážit internacionalizaci (5 hnacích sil)<br/>→ Transnational = ideální cíl pro většinu firem</div>
        </GlassBox>
      </div>

      {/* Schönfeld warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE SCHÖNFELD / LEGNEROVÁ / ZAMAZALOVÁ — ZLATÁ, ALE CHCE APLIKACI</div>
          <span>Komise 2.2.2026 byla „totálně zlatá”, ale Schönfeld <b>chce přímé napojení na případovku</b>. Neřeš moc teorii — rovnou jdi: <i>„Tato firma je globální, což v jejím kontextu znamená...”</i></span>
        </div>
      </div>

      <Tag color={VSE.ffu}>Typické situace v případovkách</Tag>
      <Bullet items={[
        "Firma s jednotným produktem v turbulentním trhu → přidat glokalizaci",
        "Lokální značka s potenciálem expandovat → internacionalizace (zvaž 5 hnacích sil)",
        "Multinational firma s nejednotným brandem → sjednotit přes Transnational strategii",
        "Firma v konzervativním odvětví (potraviny, móda) → Multinational nebo Transnational",
      ]} color={VSE.ffu} />
    </div>) },

];

const flashcards10 = [
  { term: "Globalizace", def: "Světový proces prolínání mezi zeměmi (lidé, info, technika, politika, kultura, kapitál).", tag: "DEFINICE" },
  { term: "Lokalizace", def: "Rozložení trhu, ekonomických a politicko-správních aktivit na menší územní celky. Opak globalizace.", tag: "DEFINICE" },
  { term: "Glokalizace", def: "Globální firmy se přizpůsobují lokálním podmínkám. Think globally, act locally.", tag: "DEFINICE" },
  { term: "Internacionalizace", def: "Reakce firmy na globalizaci, firemní angažovanost v cizích zemích.", tag: "DEFINICE" },
  { term: "Globálně řízená firma", def: "Jednotná strategie pro celý svět, unifikace produktu, mezinárodní management. Příklad: Apple.", tag: "TYP" },
  { term: "Lokálně řízená firma", def: "Umí reagovat na místní podmínky, lokální manažeři, mění produkt podle požadavků trhu.", tag: "TYP" },
  { term: "Cross-culture thinking", def: "Globální leadership — vzít to nejlepší z každé kultury a propojit.", tag: "LEADERSHIP" },
  { term: "Global strategy", def: "HIGH cost reduction / LOW local responsiveness. Úspory z rozsahu, centrální řízení. Apple, Samsung.", tag: "STRATEGIE" },
  { term: "Multinational strategy", def: "LOW cost reduction / HIGH local responsiveness. Silná lokální přítomnost, reakce na lokální problémy.", tag: "STRATEGIE" },
  { term: "International strategy", def: "LOW cost reduction / LOW local responsiveness. Vše vyráběno v domovské zemi, exportuje do sousedních.", tag: "STRATEGIE" },
  { term: "Transnational strategy", def: "HIGH cost reduction / HIGH local responsiveness. Úspory z rozsahu + lokální přizpůsobení + učení. McDonald's.", tag: "STRATEGIE" },
  { term: "5 hnacích sil internacionalizace", def: "Trh, Vláda, Náklady, Konkurence, Diverzifikace rizika.", tag: "HNACÍ SÍLY" },
  { term: "3 mechanismy integrace", def: "Standardizace, Koordinace, Centralizace.", tag: "INTEGRACE" },
  { term: "Výhody globalizace", def: "Dělba práce, úspory z rozsahu, šíření znalostí, standardizace, nové příležitosti.", tag: "VÝHODY" },
  { term: "Nevýhody globalizace", def: "Doprava + ŽP, kvantita na úkor kvality, unifikace, vývoz práce, závislost na globálním trhu.", tag: "NEVÝHODY" },
  { term: "Paradox globální × lokální", def: "Tlak na úspory z rozsahu vs tlak na přizpůsobení. Řešení: glokalizace.", tag: "PARADOX" },
];

const quiz10 = [
  { q: "Co znamená glokalizace?", opts: ["Jen globální přístup", "Jen lokální přístup", "Globální firma přizpůsobená lokálním podmínkám", "Odmítnutí globalizace"], correct: 2 },
  { q: "Apple je klasický příklad:", opts: ["Lokální firmy", "Globálně řízené firmy", "Multinational strategy", "International strategy"], correct: 1 },
  { q: "McSmažák v ČR je příklad:", opts: ["Globalizace", "Lokalizace", "Glokalizace", "Kulturní apropriace"], correct: 2 },
  { q: "Cross-culture thinking znamená:", opts: ["Ignorovat kultury", "Unifikovat vše", "Vzít to nejlepší z každé kultury", "Jen domácí kultura"], correct: 2 },
  { q: "Transnational strategy má:", opts: ["LOW cost / LOW local", "HIGH cost / LOW local", "LOW cost / HIGH local", "HIGH cost / HIGH local"], correct: 3 },
  { q: "Která strategie je pro začínající exportéry?", opts: ["Global", "Multinational", "International", "Transnational"], correct: 2 },
  { q: "Která z těchto NENÍ hnací síla internacionalizace?", opts: ["Trh", "Vláda", "Konkurence", "Počasí"], correct: 3 },
  { q: "Globálně řízená firma typicky:", opts: ["Má lokální manažery v každé zemi", "Drží si stejné know-how napříč zeměmi", "Vyrábí jen v domovské zemi", "Nemá strategii"], correct: 1 },
  { q: "Která hrozba NENÍ typická pro globalizaci?", opts: ["Rozdíly kultur", "Poškození ŽP", "Finanční náročnost", "Nedostatek zákazníků"], correct: 3 },
  { q: "Glokalizace kombinuje:", opts: ["Jen úspory z rozsahu", "Úspory z rozsahu + lokální přizpůsobení", "Jen lokální kulturu", "Centralizaci a diktaturu"], correct: 1 },
  { q: "Která firma NENÍ dobrým příkladem glokalizace?", opts: ["McDonald's (McSmažák)", "Starbucks (design kaváren)", "Apple (iPhone všude stejný)", "Google (Doodles)"], correct: 2 },
  { q: "3 mechanismy integrace:", opts: ["Standardizace, Koordinace, Centralizace", "Hierarchie, Autonomie, Kontrola", "Cíl, Plán, Výsledek", "Zisk, Růst, Stabilita"], correct: 0 },
];

const praxe10 = {
  caseStudy: {
    company: "McDonald's — král glokalizace",
    subtitle: "Jak globální gigant prodává v každé zemi něco jiného",
    content: (<>
      McDonald's působí ve <b>100+ zemích</b> a má v každé úplně jiný menu lístek. Místo toho, aby tlačil jeden „světový burger”, použil <b>glokalizaci</b> — kombinaci globální značky se 100% lokálním produktem:<br/><br/>
      <b style={{ color: VSE.danger }}>Indie</b> — žádný hovězí burger (krávy jsou posvátné). Místo toho <b>Maharaja Mac</b> z kuřecího a vegetariánská <b>McAloo Tikki</b>.<br/>
      <b style={{ color: VSE.fmv }}>Japonsko</b> — <b>Samurai Pork Burger</b> a teriyaki burger, sezónní matcha shake.<br/>
      <b style={{ color: VSE.fis }}>Česká republika</b> — <b>McSmažák</b> (smažený sýr v housce) — klasický český komfort food v globálním fastfoodu.<br/>
      <b style={{ color: VSE.success }}>Kanada</b> — <b>McLobster</b> — sezónní humrový sandwich pro východní pobřeží.<br/><br/>
      <b>Klíč k úspěchu:</b> McDonald's drží <b>globálně</b> stejné — značku, logo, žluté oblouky, rychlost obsluhy, kvalitu hygieny. Ale <b>lokálně</b> upravuje produkt podle chutí, náboženství a tradic. To je definice <b>Transnational strategy</b> — HIGH cost reduction (úspory z rozsahu globální dodavatelské sítě) + HIGH local responsiveness (lokální menu).
    </>),
    lessons: "McDonald's ukazuje, že glokalizace není zradou globální značky, ale <b>její posílením</b>. Když Apple v Číně tvrdošíjně držel jednotný iPhone, ztratil trh ve prospěch lokálních konkurentů (Xiaomi, Huawei). McDonald's naopak rostl. <b>Lekce pro PS:</b> firma s globální značkou v zemích s odlišnou kulturou musí přidat lokální varianty produktu — jinak ji konkurence vytlačí.",
  },
  miniExamples: [
    { company: "Apple", tag: "GLOBAL STRATEGY", color: VSE.success, content: "Stejný iPhone všude na světě, jen přidá jazyk a regionální nabíjecí konektor. Úspory z rozsahu jsou maximální. Mínus: v Číně ztrácí podíl, protože Xiaomi a Huawei nabízí to, co místní chtějí — duální SIM, lepší foťák na selfie, integraci s WeChat." },
    { company: "Starbucks v Kjótu", tag: "GLOKALIZACE", color: VSE.fmv, content: "Místo skleněné kavárny ve stylu Seattle si Starbucks v Kjótu pronajal tradiční japonský dům s tatami a šódži dveřmi. Menu zůstává globální (Frappuccino), ale prostor respektuje místní architekturu. Návštěvníci ji berou jako „japonský Starbucks”, ne „americký rušič klidu”." },
    { company: "Tesco → Fresh & Easy", tag: "REBRANDING", color: VSE.fis, content: "Když Tesco v 2007 vstupovalo na americký trh, zjistilo, že značka „Tesco” v USA neexistuje a vyvolává zmatek. Spustilo proto <b>Fresh & Easy</b> — nový brand šitý na míru americkému zákazníkovi. Ukázka, že někdy je lepší se zbavit globální značky než ji nutit do trhu." },
    { company: "Google Doodles", tag: "GLOKALIZACE V MARKETINGU", color: VSE.nf, content: "Google používá lokální Doodles (variace loga) k oslavě národních svátků, výročí a kulturních ikon dané země. V ČR oslavuje Karla IV., v Japonsku sakuru, v Indii Diwali. Drobnost, ale silně signalizuje: <b>známe vás, ne jen vyděláváme na vás</b>." },
  ],
};

const examQuestions10 = [
  { komise: "6.2.2026 — Střítestký, Krause, Zamazalová (Realitní firma)", otazka: "Globální a lokální HR - základ teorie a navázat na případovku", pozn: "Super hodná komise, stačí docela základy, chtěli to navazovat na tu PS hodně. Občas umí potrápit, ale pak jsou mírní v hodnocení." },
  { komise: "2.2.2026 — Schönfeld, Legnerová, Zamazalová (Prádlo)", otazka: "Rozdíl mezi lokálním a globálním HR, specifika různých HR útvarů", pozn: "Totálně zlatá komise, Schonfeld chce napojení na případovku, u teorie stačil relativně základ, doptávali se minimálně. Důležité je tvářit se sebevědomě a jakože víš, o čem mluvíš, ale i když jsem něco nevěděla, tak navedli. Fakt super kombo" },
  { komise: "5.2.2025 — Krause, Viktora, Tahal (Neziskovka)", otazka: "Globální vs. Lokální HR" },
  { komise: "3.2.2025 — Stříteský, Bočková, Viktora (IT firma)", otazka: "HR - lokální x globální. Specifika a aplikace na případovku." },
  { komise: "30.1.2025 — Vávra, Nový, Heřman", otazka: "HR lokální vs. globální, aplikovat na případovku" },
  { komise: "18.6. — Mládková, Vávra, Hönig (Prádlo)", otazka: "Specifika různých HR oblastí, rozdíl mezi lokálním a globálním HR" },
];

const podcast10 = {
  title: "Globální × Lokální řízení firmy",
  description: "10-minutový souhrn 3 základních pojmů (globalizace/lokalizace/glokalizace), 4 strategií z matice cost × local, 5 hnacích sil internacionalizace a jak paradox řešit přes glokalizaci.",
  audioUrl: "/audio/mng-10.mp3",
  notebookLmUrl: null,
  transcript: null,
};

const examStrategy10 = `
  <b style="color:#A82A5F">1.</b> Definuj 3 pojmy: <b>Globalizace / Lokalizace / Glokalizace</b>.<br/>
  <b style="color:#A82A5F">2.</b> Globálně řízená firma — charakteristika (Apple jako příklad).<br/>
  <b style="color:#A82A5F">3.</b> Lokálně řízená firma — charakteristika (rodinné firmy, regionální značky).<br/>
  <b style="color:#A82A5F">4.</b> <b>Glokalizace</b> jako řešení paradoxu (McDonald's McSmažák — komise to miluje!).<br/>
  <b style="color:#A82A5F">5.</b> <b>4 strategie v matici</b> (Global / Transnational / International / Multinational).<br/>
  <b style="color:#A82A5F">6.</b> <b>5 hnacích sil internacionalizace</b> (Trh, Vláda, Náklady, Konkurence, Diverzifikace).<br/>
  <b style="color:#A82A5F">7.</b> Výhody × nevýhody globalizace (obě strany!).<br/>
  <b style="color:#A82A5F">8.</b> ⚠️ Schönfeld chce aplikaci, ne teorii · Svobodová přesné definice · Mikovcová paradox + řešení.
`;

function OkruhMng10Panel() {
  return (<OkruhPanel subject="Management" subjectId="mng" number={10} title="Globální × Lokální řízení firmy" subtitle="Globalizace / Lokalizace / Glokalizace + 4 strategie" color={VSE.ffu}
    questionText="Globální a lokální řízení firmy."
    questionDesc="3 pojmy (globalizace, lokalizace, glokalizace). 4 strategie (Global/Transnational/International/Multinational). Paradox + řešení přes glokalizaci. 5 hnacích sil internacionalizace. Aplikace na PS."
    sloz={2} roz={3} freq={3}
    examStrategy={examStrategy10}
    studySections={studySections10} flashcards={flashcards10} quiz={quiz10}
    praxe={praxe10} examQuestions={examQuestions10} podcast={podcast10} />);
}

/* ════════════════════════════════════════════════════════
   OKRUH 11 — Etika v managementu, CSR/ESG
   ════════════════════════════════════════════════════════ */

function EthicsTrilemma() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const items = [
    {
      id: "abs", label: "Absolutistická", color: VSE.fph,
      x: 200, y: 60,
      analogy: "= Existují univerzální pravidla",
      desc: "Vždy je něco správně a něco špatně. Existuje univerzální morální rámec — lidská práva, zákazy zabíjení, krádeží.",
      example: "OSN, Všeobecná deklarace lidských práv",
    },
    {
      id: "rel", label: "Relativistická", color: VSE.fmv,
      x: 80, y: 240,
      analogy: "= Každá situace je jiná",
      desc: "Není univerzální recept. Co je etické v jedné kultuře, nemusí být v druhé. Záleží na kontextu a hodnotách.",
      example: "Dárky obchodním partnerům — v Asii zdvořilost, v EU korupce",
    },
    {
      id: "nek", label: "Nekognitivní", color: VSE.danger,
      x: 320, y: 240,
      analogy: "= Etika neexistuje objektivně",
      desc: "Etika není objektivní — každý si dělá, co chce. Pokud je to pravda, etika nemá smysl. Hraniční filozofický postoj.",
      example: "„Já mám svoji pravdu, ty máš svoji”",
    },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "22px 20px", marginTop: 14, marginBottom: 4 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase" }}>3 POJETÍ ETIKY</div>
      <div style={{ width: "100%", maxWidth: 420, margin: "0 auto" }}>
        <svg viewBox="0 0 400 340" style={{ width: "100%", height: "auto" }}>
          {/* Trojúhelník mezi vrcholy */}
          <path d={`M ${items[0].x} ${items[0].y} L ${items[1].x} ${items[1].y} L ${items[2].x} ${items[2].y} Z`}
            fill="none" stroke={t.border} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4"/>
          {/* 3 vrcholy */}
          {items.map(it => {
            const isHov = hovered === it.id;
            return (
              <g key={it.id} onMouseEnter={() => setHovered(it.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                <circle cx={it.x} cy={it.y} r={isHov ? 64 : 58} fill={it.color} opacity={isHov ? 1 : 0.92}
                  style={{ transition: "all 200ms ease", filter: isHov ? `drop-shadow(0 0 14px ${it.color}90)` : "none" }}/>
                <text x={it.x} y={it.y - 4} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800" fontFamily={fontSans}>{it.label.split("ská")[0]}</text>
                <text x={it.x} y={it.y + 12} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800" fontFamily={fontSans}>SKÁ</text>
              </g>
            );
          })}
        </svg>
      </div>
      {hovered ? (
        <div style={{ marginTop: 14, padding: "12px 16px", background: `${items.find(i => i.id === hovered).color}15`, border: `1px solid ${items.find(i => i.id === hovered).color}40`, borderRadius: 12, fontSize: 12.5, fontFamily: fontSans, color: t.text, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 800, color: items.find(i => i.id === hovered).color, fontFamily: fontMono, fontSize: 11, letterSpacing: "1.5px", marginBottom: 3 }}>
            {items.find(i => i.id === hovered).label.toUpperCase()} ETIKA
          </div>
          <div style={{ fontSize: 11.5, color: items.find(i => i.id === hovered).color, fontFamily: fontMono, fontStyle: "italic", marginBottom: 6 }}>
            {items.find(i => i.id === hovered).analogy}
          </div>
          <div style={{ marginBottom: 4 }}>{items.find(i => i.id === hovered).desc}</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, marginTop: 4 }}>
            PŘÍKLAD: {items.find(i => i.id === hovered).example}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 4, padding: "8px 12px", fontSize: 11, fontFamily: fontSans, color: t.textMuted, textAlign: "center", fontStyle: "italic", lineHeight: 1.5 }}>
          Najeď myší na pojetí pro detail · V praxi většina firem používá <b>kombinaci</b> — univerzální základ + lokální přizpůsobení
        </div>
      )}
    </div>
  );
}

function TripleBottomLine() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const circles = [
    { id: "people", label: "PEOPLE", subtitle: "Lidé", color: VSE.nf,
      cx: 130, cy: 130, items: ["Lidská práva", "Diverzita", "Benefity", "Místní komunity", "Rovnost"],
      desc: "Sociální pilíř — jak firma jedná s lidmi (zaměstnanci, zákazníci, komunita).",
    },
    { id: "planet", label: "PLANET", subtitle: "Planeta", color: VSE.success,
      cx: 270, cy: 130, items: ["Snižování emisí", "Recyklace", "Lokální suroviny", "Biodiverzita", "Energie"],
      desc: "Environmentální pilíř — dopady na životní prostředí, odpadové hospodářství.",
    },
    { id: "profit", label: "PROFIT", subtitle: "Zisk", color: VSE.warning,
      cx: 200, cy: 240, items: ["Etické chování", "Transparentnost", "Dobré řízení", "Anti-korupce", "Reálný eko dopad"],
      desc: "Ekonomický pilíř — ne jen zisk, ale celkový reálný ekonomický dopad pro společnost.",
    },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "22px 20px", marginTop: 14, marginBottom: 4 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase" }}>3P ETICKÉHO MANAGEMENTU · TRIPLE BOTTOM LINE</div>
      <div style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
        <svg viewBox="0 0 400 360" style={{ width: "100%", height: "auto" }}>
          {/* 3 překrývající se kruhy */}
          {circles.map(c => {
            const isHov = hovered === c.id;
            return (
              <g key={c.id} onMouseEnter={() => setHovered(c.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                <circle cx={c.cx} cy={c.cy} r="90" fill={c.color}
                  opacity={hovered ? (isHov ? 0.85 : 0.35) : 0.55}
                  style={{ transition: "all 250ms ease", filter: isHov ? `drop-shadow(0 0 16px ${c.color}90)` : "none" }}/>
              </g>
            );
          })}
          {/* Labely */}
          {circles.map(c => {
            const lx = c.id === "people" ? 90 : c.id === "planet" ? 310 : 200;
            const ly = c.id === "profit" ? 295 : 95;
            return (
              <g key={c.id + "_label"} style={{ pointerEvents: "none" }}>
                <text x={lx} y={ly} textAnchor="middle" fill={c.color} fontSize="14" fontWeight="800" fontFamily={fontMono} letterSpacing="1.5">{c.label}</text>
                <text x={lx} y={ly + 14} textAnchor="middle" fill={t.text} fontSize="10" fontFamily={fontSans}>{c.subtitle}</text>
              </g>
            );
          })}
          {/* Centrální průnik */}
          <circle cx="200" cy="170" r="36" fill={t.surfaceSolid} stroke={VSE.ffu} strokeWidth="2"/>
          <text x="200" y="166" textAnchor="middle" fill={t.text} fontSize="10" fontWeight="800" fontFamily={fontSans}>UDRŽI-</text>
          <text x="200" y="180" textAnchor="middle" fill={t.text} fontSize="10" fontWeight="800" fontFamily={fontSans}>TELNOST</text>
        </svg>
      </div>
      {hovered ? (
        <div style={{ marginTop: 4, padding: "12px 16px", background: `${circles.find(c => c.id === hovered).color}15`, border: `1px solid ${circles.find(c => c.id === hovered).color}40`, borderRadius: 12, fontSize: 12.5, fontFamily: fontSans, color: t.text, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 800, color: circles.find(c => c.id === hovered).color, fontFamily: fontMono, fontSize: 11, letterSpacing: "1.5px", marginBottom: 4 }}>
            {circles.find(c => c.id === hovered).label} · {circles.find(c => c.id === hovered).subtitle}
          </div>
          <div style={{ marginBottom: 6 }}>{circles.find(c => c.id === hovered).desc}</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono }}>
            ZAHRNUJE: {circles.find(c => c.id === hovered).items.join(" · ")}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 4, padding: "8px 12px", fontSize: 11, fontFamily: fontSans, color: t.textMuted, textAlign: "center", fontStyle: "italic", lineHeight: 1.5 }}>
          Průnik 3 kruhů = <b>Udržitelnost</b>. Firma je udržitelná, jen když má všechny 3 pilíře v rovnováze.
        </div>
      )}
    </div>
  );
}

function CSREvolutionTimeline() {
  const t = useTheme();
  const [hovered, setHovered] = useState(null);
  const stages = [
    {
      id: "fried", year: "1970", x: 10, label: "Friedman",
      tag: "SHAREHOLDER", color: VSE.danger,
      title: "Maximalizace zisku akcionářů",
      desc: "Milton Friedman: „Jediná společenská odpovědnost firmy je zvyšovat zisky pro akcionáře.” Etika a CSR jsou jen marketing.",
      example: "Klasický korporát 70.–80. let, GE pod Jackem Welchem",
    },
    {
      id: "csr", year: "1980s", x: 33, label: "CSR",
      tag: "STAKEHOLDER", color: VSE.fmv,
      title: "Corporate Social Responsibility",
      desc: "R. Edward Freeman: firma má odpovědnost vůči všem stakeholderům (zaměstnanci, komunita, ŽP). Často filantropie a sponzoring.",
      example: "Shell sponzoruje umění, Coca-Cola charita pro děti",
    },
    {
      id: "csv", year: "2011", x: 60, label: "CSV",
      tag: "SDÍLENÁ HODNOTA", color: VSE.fis,
      title: "Creating Shared Value",
      desc: "Michael Porter: tvorba hodnoty pro byznys + společnost zároveň. Není to filantropie navíc — je to součást strategie.",
      example: "Nestlé fortifikuje potraviny v rozvojových zemích — pomáhá + roste",
    },
    {
      id: "esg", year: "2020s", x: 87, label: "ESG",
      tag: "MĚŘITELNÝ DOPAD", color: VSE.success,
      title: "Environmental, Social, Governance",
      desc: "Měřitelné metriky pro investory. EU regulace (CSRD), povinný reporting. ESG ratings ovlivňují přístup ke kapitálu.",
      example: "Patagonia, Tesla, Unilever — top ESG ratings od MSCI",
    },
  ];
  return (
    <div style={{ ...cardStyle(t), padding: "22px 20px", marginTop: 14, marginBottom: 4 }}>
      <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase" }}>EVOLUCE: FRIEDMAN → CSR → CSV → ESG</div>

      <svg viewBox="0 0 600 220" style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="csrGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={VSE.danger} stopOpacity="0.6"/>
            <stop offset="33%" stopColor={VSE.fmv} stopOpacity="0.6"/>
            <stop offset="66%" stopColor={VSE.fis} stopOpacity="0.6"/>
            <stop offset="100%" stopColor={VSE.success} stopOpacity="0.6"/>
          </linearGradient>
          <marker id="arrCSR" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill={VSE.success}/>
          </marker>
        </defs>
        {/* Časová osa */}
        <line x1="40" y1="120" x2="560" y2="120" stroke="url(#csrGrad)" strokeWidth="6" strokeLinecap="round" markerEnd="url(#arrCSR)"/>

        {/* 4 stages */}
        {stages.map(s => {
          const cx = 60 + (s.x / 100) * 480;
          const isHov = hovered === s.id;
          return (
            <g key={s.id} onMouseEnter={() => setHovered(s.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              {/* Rok nahoře */}
              <text x={cx} y="55" textAnchor="middle" fill={s.color} fontSize="13" fontWeight="800" fontFamily={fontMono}>{s.year}</text>
              {/* Tag pod rokem */}
              <text x={cx} y="72" textAnchor="middle" fill={t.textMuted} fontSize="8" fontWeight="700" fontFamily={fontMono} letterSpacing="0.8">{s.tag}</text>
              {/* Bublina */}
              <circle cx={cx} cy="120" r={isHov ? 32 : 28} fill={s.color} opacity={isHov ? 1 : 0.92}
                style={{ transition: "all 200ms ease", filter: isHov ? `drop-shadow(0 0 12px ${s.color}90)` : "none" }}/>
              <text x={cx} y="125" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800" fontFamily={fontSans}>{s.label}</text>
              {/* Krátký popis pod */}
              <text x={cx} y="170" textAnchor="middle" fill={t.text} fontSize="9" fontWeight="600" fontFamily={fontSans}>{s.title.split(" ").slice(0, 2).join(" ")}</text>
              <text x={cx} y="183" textAnchor="middle" fill={t.text} fontSize="9" fontWeight="600" fontFamily={fontSans}>{s.title.split(" ").slice(2).join(" ")}</text>
            </g>
          );
        })}
      </svg>

      {hovered ? (
        <div style={{ marginTop: 4, padding: "12px 16px", background: `${stages.find(s => s.id === hovered).color}15`, border: `1px solid ${stages.find(s => s.id === hovered).color}40`, borderRadius: 12, fontSize: 12.5, fontFamily: fontSans, color: t.text, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 800, color: stages.find(s => s.id === hovered).color, fontFamily: fontMono, fontSize: 11, letterSpacing: "1.5px", marginBottom: 3 }}>
            {stages.find(s => s.id === hovered).year} · {stages.find(s => s.id === hovered).label} · {stages.find(s => s.id === hovered).tag}
          </div>
          <div style={{ fontWeight: 700, color: stages.find(s => s.id === hovered).color, fontSize: 13, marginBottom: 5 }}>
            {stages.find(s => s.id === hovered).title}
          </div>
          <div style={{ marginBottom: 4 }}>{stages.find(s => s.id === hovered).desc}</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, marginTop: 4 }}>
            PŘÍKLAD: {stages.find(s => s.id === hovered).example}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 4, padding: "8px 12px", fontSize: 11, fontFamily: fontSans, color: t.textMuted, textAlign: "center", fontStyle: "italic", lineHeight: 1.5 }}>
          Najeď myší na fázi pro detail · Trend: od „zisk pro akcionáře” k <b>měřitelnému dopadu na společnost</b>
        </div>
      )}
    </div>
  );
}

const studySections11 = [

  { id: "uvod", title: "Co je etika a proč to řešit", subtitle: "= Kdy je to ještě byznys, a kdy už podraz?", color: VSE.ffu, emoji: "scale",
    content: (<div>
      <Def color={VSE.ffu}>
        <b>Etika</b> v managementu = morální chování, hodnoty a principy, které by se měly dodržovat. Jsou to <b>mimozákonní doporučení</b> — nad rámec toho, co nařizuje zákon.
      </Def>

      <Tag color={VSE.ffu}>Otázka pro firmu</Tag>
      <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.ffu}`, borderRadius: 12, marginTop: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>🎯 „Kde končí byznys a začíná podraz?”</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: fontSans, fontStyle: "italic", lineHeight: 1.5 }}>Etika je o rozhodování v zóně mezi „povolené zákonem” a „spravedlivé pro všechny”.</div>
      </GlassBox>

      <Tag>4 KLÍČOVÉ POJMY</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { num: "1", name: "Etika", color: VSE.ffu, what: "Zkoumá morálku a morálně relevantní jednání + jeho normy.", note: "Mimozákonní doporučení" },
          { num: "2", name: "Etické dilema", color: VSE.danger, what: "Mám možnosti a musím vybrat tu méně horší. Obě zahrnují konflikt.", note: "Není 100% řešení" },
          { num: "3", name: "Etický kodex", color: VSE.fmv, what: "Normy, pravidla a zásady chování v organizaci. Tím že to podepíšu, souhlasím.", note: "Součást corporate governance" },
          { num: "4", name: "Udržitelnost", color: VSE.success, what: "Schopnost uspokojit dnešní potřeby bez kompromitování budoucích generací.", note: "Brundtland, 1987" },
        ].map(p => (
          <GlassBox key={p.num} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${p.color}`, borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: p.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, fontFamily: fontMono }}>{p.num}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: p.color, fontFamily: fontSans }}>{p.name}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 6 }}>{p.what}</div>
            <div style={{ fontSize: 10.5, color: p.color, fontFamily: fontMono, fontWeight: 600, letterSpacing: "0.3px", opacity: 0.85 }}>→ {p.note}</div>
          </GlassBox>
        ))}
      </div>
    </div>) },

  { id: "pojeti", title: "3 pojetí etiky", subtitle: "Filozofické rámce — komise se ptá, který zastáváš", color: VSE.primary, emoji: "brain",
    content: (<div>
      <Def color={VSE.primary}>
        Existují <b>3 základní pojetí etiky</b>. V praxi firmy kombinují absolutismus (univerzální základ, např. lidská práva) s relativismem (přizpůsobení kultuře).
      </Def>

      <EthicsTrilemma />
    </div>) },

  { id: "dilema", title: "Etické dilema — 6 kroků řešení", subtitle: "= Jak se správně rozhodnout, když nic není 100% správně", color: VSE.danger, emoji: "scale",
    content: (<div>
      <Def color={VSE.danger}>
        <b>Etické dilema</b> = stav, kdy nelze najít 100% uspokojivé řešení pro všechny strany. Vnímání je <b>individuální</b> — záleží na zkušenostech a hodnotách.
      </Def>

      <Tag color={VSE.danger}>6 KROKŮ ŘEŠENÍ DILEMATU</Tag>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
        {[
          { num: "1", name: "Rozpoznání problému", what: "Cítím nutnost to vyřešit? Není to jen nepříjemnost?" },
          { num: "2", name: "Shromažďování faktů", what: "Sbírám info, kterého se to týká. Kdo je dotčen?" },
          { num: "3", name: "Identifikace možností", what: "Jaké mám reálné varianty řešení? Minimálně 3." },
          { num: "4", name: "Testování možností", what: "Jak by každá varianta dopadla pro dotčené strany?" },
          { num: "5", name: "Výběr řešení", what: "Vybírám tu nejméně špatnou. Žádné dilema nemá ideální řešení." },
          { num: "6", name: "Double-check + akce", what: "Otázky „na tělo”: Jak bych se cítil, kdyby o tom psali v novinách? Vědela by to rodina?" },
        ].map(s => (
          <GlassBox key={s.num} opacity={0.5} style={{ padding: "10px 14px", borderLeft: `3px solid ${VSE.danger}`, borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: VSE.danger, fontFamily: fontMono, minWidth: 24 }}>{s.num}.</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: VSE.danger, fontFamily: fontSans, marginBottom: 2 }}>{s.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5 }}>→ {s.what}</div>
              </div>
            </div>
          </GlassBox>
        ))}
      </div>

      <Tag color={VSE.fm}>5 STRATEGIÍ ŘEŠENÍ DILEMAT</Tag>
      <Bullet items={[
        "Volba organizace + pozice — cítím se dobře v této kultuře?",
        "Racionalizace — řešit s minimem emocí, čistě fakta",
        "Alternativní řešení — nepropustím člověka, dám ho na nový projekt",
        "Odsouvání problému — v domnění, že to udělá někdo jiný (rizikové!)",
        "Odejít ze zaměstnání — pokud jsou dilemata systémová",
      ]} color={VSE.fm} />

      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Při rozhodování myslet i na:</b><br/>
        → Jaké zákony se vztahují k danému problému?<br/>
        → Jak to ovlivní akcionáře a stakeholdery?<br/>
        → Jaký to bude mít dopad na firmu (krátkodobě i dlouhodobě)?
      </div>

      {/* Mládková warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MILUJE — MLÁDKOVÁ / VÁVRA / ŠTAMFESTOVÁ</div>
          <span>Chtějí <b>najít dilema přímo v případovce</b> a popsat, jak ho řešit. Nestačí teorie — musíš ukázat na konkrétní situaci v PS, kde by dilema bylo, a projít <b>6 kroků</b>.</span>
        </div>
      </div>
    </div>) },

  { id: "manazeri", title: "4 typy manažerů podle postoje k etice", subtitle: "Komise: identifikuj typ manažera v případovce", color: VSE.fmv, emoji: "people",
    content: (<div>
      <Def color={VSE.fmv}>
        Manažeři přistupují k etice <b>4 různými způsoby</b>. Každý typ má jinou prioritu, jiné riziko a jiný dopad na firmu.
      </Def>

      <Tag>3 ZÁKLADNÍ KATEGORIE</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { name: "Nemorální", color: VSE.danger, analogy: "= „Mně je to fuk”", what: "Konají schválně nemorálně. Vědí, že je to špatně, ale nezajímá je to.", risk: "Skandály, žaloby, odchod talentu" },
          { name: "Amorální", color: VSE.warning, analogy: "= „To mě nenapadlo”", what: "Zapomínají zvážit etiku. Ne ze zlé vůle, ale z nevšímavosti.", risk: "Dlouhodobé zhoršování kultury" },
          { name: "Morální", color: VSE.success, analogy: "= „Etika je cíl”", what: "Etika je součástí jejich rozhodování. Nesoutěží mezi ziskem a etikou.", risk: "Žádné — staví dlouhodobou důvěru" },
        ].map((m, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${m.color}`, borderRadius: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: m.color, fontFamily: fontSans, marginBottom: 2 }}>{m.name}</div>
            <div style={{ fontSize: 11, color: m.color, fontFamily: fontMono, fontStyle: "italic", marginBottom: 6, opacity: 0.85 }}>{m.analogy}</div>
            <div style={{ fontSize: 11.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 6 }}>{m.what}</div>
            <div style={{ fontSize: 10.5, color: VSE.danger, fontFamily: fontSans, lineHeight: 1.4 }}>⚠️ {m.risk}</div>
          </GlassBox>
        ))}
      </div>

      <Tag color={VSE.fmv}>4 TYPY PODLE POSTOJE (DETAIL)</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { name: "Ekonomista", color: VSE.danger, analogy: "= „Peníze a tečka”", what: "Etiku přehlížejí. Racionální, ekonomický cíl je priorita. Může být hrozba pro firmu (skandál).", example: "Wells Fargo — manažeři tlačili na otevírání falešných účtů kvůli bonusům" },
          { name: "Konvencionalista", color: VSE.fmv, analogy: "= „To řeší TOP management”", what: "Etika se jich moc netýká. Řeší to vyšší vedení nebo právní oddělení. Nepřebírají odpovědnost.", example: "Středně velká korporace — manažer nepodepíše nic neetického, ale taky nic neřeší" },
          { name: "Idealista", color: VSE.fis, analogy: "= „Morálka nad penězi”", what: "Morální hledisko jasně před ekonomickým. Ekonomicky to může být nákladné, ale dlouhodobě je etika priorita.", example: "Patagonia — Yvon Chouinard daroval celou firmu trustům na ochranu klimatu" },
          { name: "Reformista", color: VSE.success, analogy: "= „Etika = výhoda”", what: "Etika může být ekonomickou výhodou. Snaží se o syntézu — CSR + zisk se nevylučují.", example: "Unilever — Sustainable Living Plan zvyšuje zisky i ESG ratings" },
        ].map((m, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${m.color}`, borderRadius: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: m.color, fontFamily: fontSans, marginBottom: 2 }}>{m.name}</div>
            <div style={{ fontSize: 11, color: m.color, fontFamily: fontMono, fontStyle: "italic", marginBottom: 6, opacity: 0.85 }}>{m.analogy}</div>
            <div style={{ fontSize: 11.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 8 }}>{m.what}</div>
            <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}25`, borderRadius: 6, padding: "6px 10px", fontSize: 10.5, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.4 }}>
              <b style={{ color: VSE.warning }}>Příklad:</b> {m.example}
            </div>
          </GlassBox>
        ))}
      </div>
    </div>) },

  { id: "3p", title: "3P etického managementu + Carrollova pyramida", subtitle: "= People · Planet · Profit — všechny 3 v rovnováze", color: VSE.success, emoji: "globe",
    content: (<div>
      <Def color={VSE.success}>
        <b>Triple Bottom Line</b> (3P) = etický management musí brát ohled na 3 oblasti — <b>People</b>, <b>Planet</b>, <b>Profit</b>. Když chybí jedna, firma není udržitelná.
      </Def>

      <TripleBottomLine />

      <Tag color={VSE.fmv}>CARROLLOVA PYRAMIDA — 4 ÚROVNĚ ODPOVĚDNOSTI</Tag>
      <div style={{ background: `${VSE.fmv}05`, border: `1px solid ${VSE.fmv}25`, borderRadius: 10, padding: "10px 14px", marginTop: 6, marginBottom: 10, fontSize: 12, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.fmv }}>Archie Carroll (1991):</b> firma má 4 hierarchické odpovědnosti. Bez nižší úrovně nelze plnit vyšší.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
        {[
          { lvl: "4. Filantropická", color: VSE.success, what: "Být dobrým občanem. Charita, sponzoring, dobrovolnictví.", motto: "„Chceme přispět společnosti”" },
          { lvl: "3. Etická", color: VSE.fis, what: "Chovat se eticky. Nad rámec zákona — fér jednání, transparentnost.", motto: "„Děláme správnou věc”" },
          { lvl: "2. Právní", color: VSE.fmv, what: "Respektovat zákon. Nikdy ho neporušit.", motto: "„Hrajeme podle pravidel”" },
          { lvl: "1. Ekonomická", color: VSE.danger, what: "Tvořit zisk. Bez zisku firma neexistuje a nemůže plnit ostatní.", motto: "„Vyděláváme peníze”" },
        ].map((l, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "10px 14px", borderLeft: `4px solid ${l.color}`, borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: l.color, fontFamily: fontMono, minWidth: 130 }}>{l.lvl}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5 }}>{l.what}</div>
                <div style={{ fontSize: 11, color: l.color, fontFamily: fontMono, fontStyle: "italic", marginTop: 3, opacity: 0.85 }}>{l.motto}</div>
              </div>
            </div>
          </GlassBox>
        ))}
      </div>
      <div style={{ background: `${VSE.warning}10`, border: `1px solid ${VSE.warning}35`, borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 12, fontFamily: fontSans, color: "var(--text)", lineHeight: 1.6 }}>
        <b style={{ color: VSE.warning }}>Klíčová myšlenka:</b> Pyramidu čteš zdola nahoru. <b>Bez zisku nelze platit zákony, bez zákonů nelze být etický, bez etiky nelze být dobrým občanem.</b>
      </div>
    </div>) },

  { id: "csr", title: "CSR × CSV × ESG — evoluce přístupů", subtitle: "Friedman → CSR → CSV → ESG (50 let vývoje)", color: VSE.fmv, emoji: "chart",
    content: (<div>
      <Def color={VSE.fmv}>
        Pohled na společenskou odpovědnost se za 50 let dramaticky změnil. <b>Komise Stříteský/Bočková</b> chce znát všechny 4 fáze a rozdíl mezi nimi.
      </Def>

      <CSREvolutionTimeline />

      <Tag color={VSE.fmv}>FRIEDMAN × FREEMAN — TEORETICKÝ SOUBOJ</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.danger}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: VSE.danger, fontFamily: fontSans, marginBottom: 2 }}>Milton Friedman (1970)</div>
          <div style={{ fontSize: 11, color: VSE.danger, fontFamily: fontMono, fontStyle: "italic", marginBottom: 8, opacity: 0.85 }}>= Shareholder perspektiva</div>
          <Bullet items={[
            "Jediná odpovědnost firmy = zisk akcionářů",
            "CSR a etika jsou jen marketingový nástroj",
            "Manažer = agent akcionářů",
            "Nositelé Nobelovy ceny ekonomické (1976)",
          ]} color={VSE.danger} />
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.success}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 2 }}>R. Edward Freeman (1984)</div>
          <div style={{ fontSize: 11, color: VSE.success, fontFamily: fontMono, fontStyle: "italic", marginBottom: 8, opacity: 0.85 }}>= Stakeholder perspektiva</div>
          <Bullet items={[
            "Firma má odpovědnost vůči všem stakeholderům",
            "Zaměstnanci, komunita, ŽP, dodavatelé",
            "Etika a CSR = součást strategie, ne marketing",
            "Základ moderního managementu",
          ]} color={VSE.success} />
        </GlassBox>
      </div>

      <Tag color={VSE.success}>3 KLÍČOVÉ ROZDÍLY</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 6 }}>
        {[
          { name: "CSR", subtitle: "Corporate Social Responsibility", color: VSE.fmv, what: "Reakce na vnější tlak. Filantropie navíc, často izolovaná od byznysu.", example: "Coca-Cola charita" },
          { name: "CSV", subtitle: "Creating Shared Value", color: VSE.fis, what: "Tvorba hodnoty pro byznys + společnost zároveň. Součást strategie, ne navíc.", example: "Nestlé fortifikace potravin" },
          { name: "ESG", subtitle: "Environmental, Social, Governance", color: VSE.success, what: "Měřitelné metriky pro investory. EU regulace (CSRD), povinný reporting.", example: "MSCI ESG ratings" },
        ].map((c, i) => (
          <GlassBox key={i} opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${c.color}`, borderRadius: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: c.color, fontFamily: fontMono }}>{c.name}</div>
            <div style={{ fontSize: 10.5, color: c.color, fontFamily: fontSans, fontStyle: "italic", marginBottom: 6, opacity: 0.8 }}>{c.subtitle}</div>
            <div style={{ fontSize: 11.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 6 }}>{c.what}</div>
            <div style={{ fontSize: 10.5, color: VSE.warning, fontFamily: fontMono }}>→ {c.example}</div>
          </GlassBox>
        ))}
      </div>

      {/* Patagonia vsuvka */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.warning}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.warning, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>💡 ZAJÍMAVOST — PATAGONIA „EARTH IS OUR ONLY SHAREHOLDER”</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          V září 2022 zakladatel Yvon Chouinard <b>daroval celou firmu Patagonia (3 mld. USD)</b> trustům na ochranu klimatu. Žádné akcie, žádný IPO. „Earth is now our only shareholder”. <b>100 % zisku</b> jde na boj proti klimatické krizi. Ukázka extrémního idealisty — etika jako jediný cíl.
        </div>
      </GlassBox>

      {/* Stříteský warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MILUJE — STŘÍTESKÝ / BOČKOVÁ / VIKTORA</div>
          <span>Chtějí <b>Friedman × Freeman + CSR pilíře + CSV</b>. Spojit s misí a vizí firmy v PS. ESG je bonus pro nadstandard.</span>
        </div>
      </div>
    </div>) },

  { id: "udrz", title: "Udržitelný management", subtitle: "= Uspokojit dnešní potřeby bez ohrožení budoucích generací", color: VSE.success, emoji: "globe",
    content: (<div>
      <Def color={VSE.success}>
        <b>Udržitelný management</b> = praktická schopnost uspokojit dnešní potřeby bez kompromitování schopnosti budoucích generací uspokojit jejich potřeby. <i>(Brundtland Commission, 1987)</i>
      </Def>

      <Tag color={VSE.success}>KLÍČOVÉ POJMY UDRŽITELNOSTI</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.fis}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: VSE.fis, fontFamily: fontSans, marginBottom: 2 }}>Eco-efficiency</div>
          <div style={{ fontSize: 11, color: VSE.fis, fontFamily: fontMono, fontStyle: "italic", marginBottom: 8, opacity: 0.85 }}>= Dělat víc s méně</div>
          <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 6 }}>
            Snížit ekologický dopad a využívat zdroje efektivněji v celém životním cyklu produktu.
          </div>
          <div style={{ fontSize: 10.5, color: VSE.warning, fontFamily: fontMono }}>→ Tesla — efektivní baterie, méně emisí na km</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `4px solid ${VSE.success}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: VSE.success, fontFamily: fontSans, marginBottom: 2 }}>Eco-effectiveness</div>
          <div style={{ fontSize: 11, color: VSE.success, fontFamily: fontMono, fontStyle: "italic", marginBottom: 8, opacity: 0.85 }}>= Dělat správné věci</div>
          <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, marginBottom: 6 }}>
            Transformace produktů a materiálů pro <b>regenerativní</b> ekonomický růst (cradle-to-cradle).
          </div>
          <div style={{ fontSize: 10.5, color: VSE.warning, fontFamily: fontMono }}>→ P&G — recyklovatelné výrobky, kruhový obal</div>
        </GlassBox>
      </div>

      <Tag color={VSE.success}>UDRŽITELNOST V PRAXI</Tag>
      <Bullet items={[
        "Firma nezničí přírodu, kterou bude potřebovat za 20 let",
        "Cradle-to-cradle: výrobky jsou navrženy tak, aby se znovu rozložily nebo recyklovaly",
        "Kruhová ekonomika: žádný odpad — vše je vstup pro něco jiného",
        "ESG ratings: měřitelný dopad na ŽP, společnost, governance",
        "EU CSRD: od 2024 povinný reporting udržitelnosti pro velké firmy",
      ]} color={VSE.success} />

      {/* VW Dieselgate vsuvka — opačný příklad */}
      <GlassBox opacity={0.5} style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${VSE.danger}35`, borderRadius: 12 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: VSE.danger, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>⚠️ NEGATIVNÍ PŘÍKLAD — VOLKSWAGEN „DIESELGATE” (2015)</div>
        <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.7 }}>
          VW <b>falšoval emisní testy</b> u 11 milionů aut po celém světě. Software detekoval testovací podmínky a snižoval emise. V reálném provozu ale auta vypouštěla <b>40× víc oxidů dusíku</b> než povoleno.<br/><br/>
          <b>Důsledky:</b> pokuty <b>30+ mld. USD</b>, ztráta důvěry, pokles akcií o 40 %, manažeři ve vězení. Klasický příklad <b>nemorálního managementu</b> — vědomé porušování pro krátkodobé zisky.<br/><br/>
          <b>Lekce:</b> etika není luxus, ale existenční strategie. Nemorální chování firmu může zničit.
        </div>
      </GlassBox>
    </div>) },

  { id: "kultura", title: "Etika v mezinárodní firmě", subtitle: "= Absolutismus × relativismus — jak nastavit etiku napříč zeměmi", color: VSE.nf, emoji: "globe",
    content: (<div>
      <Def color={VSE.nf}>
        Když firma působí v <b>různých kulturách</b>, naráží na rozdíly v hodnotách. Klíčová otázka: má etika být <b>univerzální</b> (absolutismus) nebo <b>přizpůsobená</b> (relativismus)?
      </Def>

      <Tag color={VSE.nf}>ABSOLUTISMUS × RELATIVISMUS</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.fph}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: VSE.fph, fontFamily: fontSans, marginBottom: 2 }}>Kulturní absolutismus</div>
          <div style={{ fontSize: 11, color: VSE.fph, fontFamily: fontMono, fontStyle: "italic", marginBottom: 8, opacity: 0.85 }}>= „Existují univerzální pravidla, všude stejná”</div>
          <Bullet items={[
            "Lidská práva platí všude — bez výjimek",
            "Korupce je vždy špatná",
            "Dětská práce je vždy špatná",
            "Riziko: arogantní vnucování západních hodnot",
          ]} color={VSE.fph} />
          <div style={{ fontSize: 10.5, color: VSE.warning, fontFamily: fontMono, marginTop: 8 }}>→ OSN, Všeobecná deklarace lidských práv</div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "14px 16px", borderLeft: `4px solid ${VSE.fmv}`, borderRadius: 12 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: VSE.fmv, fontFamily: fontSans, marginBottom: 2 }}>Kulturní relativismus</div>
          <div style={{ fontSize: 11, color: VSE.fmv, fontFamily: fontMono, fontStyle: "italic", marginBottom: 8, opacity: 0.85 }}>= „Když jsi v Římě, dělej jako Římané”</div>
          <Bullet items={[
            "Etika závisí na kultuře a kontextu",
            "Dárky obchodním partnerům — v Asii zdvořilost, v EU korupce",
            "Hierarchie a autorita — v Asii respekt, na Západě odpor",
            "Riziko: ospravedlnění čehokoli kulturou",
          ]} color={VSE.fmv} />
          <div style={{ fontSize: 10.5, color: VSE.warning, fontFamily: fontMono, marginTop: 8 }}>→ Hofstede dimenze, GLOBE studie</div>
        </GlassBox>
      </div>

      <Tag color={VSE.nf}>HOFSTEDE — 5 KULTURNÍCH DIMENZÍ</Tag>
      <Bullet items={[
        "Maskulinita / Femininita — kompetitivnost vs spolupráce",
        "Individualismus / Kolektivismus — já vs my",
        "Vztah k nejistotě — tolerance dvojznačnosti",
        "Vzdálenost od moci — akceptace hierarchie",
        "Dlouhodobost / Krátkodobost — horizont rozhodování",
      ]} color={VSE.nf} />

      <Tag color={VSE.nf}>JAK NASTAVIT ETICKÉ CHOVÁNÍ V MEZINÁRODNÍ FIRMĚ</Tag>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
        {[
          { num: "1", what: "Stanov univerzální základ — lidská práva, anti-korupce, ŽP. Žádné kompromisy." },
          { num: "2", what: "Lokální přizpůsobení v rámci tohoto základu — komunikace, hierarchie, dárky." },
          { num: "3", what: "Pravidelný trénink etiky pro všechny pobočky — kulturní citlivost." },
          { num: "4", what: "Whistleblowing kanál — anonymní hlášení neetického chování." },
          { num: "5", what: "Měření a reporting — ESG metriky napříč zeměmi." },
        ].map(s => (
          <GlassBox key={s.num} opacity={0.5} style={{ padding: "10px 14px", borderLeft: `3px solid ${VSE.nf}`, borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: VSE.nf, fontFamily: fontMono, minWidth: 24 }}>{s.num}.</div>
              <div style={{ fontSize: 12, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.5, flex: 1 }}>{s.what}</div>
            </div>
          </GlassBox>
        ))}
      </div>

      {/* Nový/Vávra/Heřman warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.danger}15, ${VSE.danger}05)`, border: `1px solid ${VSE.danger}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.danger, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>KOMISE MILUJE — NOVÝ / VÁVRA / HEŘMAN</div>
          <span>Konkrétně se ptali na <b>kulturní absolutismus a relativismus</b>, kulturní rozdíly v etice a <b>jak nastavit etické chování v mezinárodní firmě</b>. Zmínit Hofstede + příklad Nike v Asii (dětská práce — řešili to absolutisticky).</span>
        </div>
      </div>
    </div>) },

  { id: "app11", title: "Aplikace na případovku", subtitle: "Postup 4 kroků pro komisi", color: VSE.ffu, emoji: "target",
    content: (<div>
      <Def color={VSE.ffu}>
        Na PS musíš <b>najít etické dilema</b>, <b>identifikovat typ manažera</b>, projít <b>3P / Carrollovu pyramidu</b> a navrhnout <b>CSV nebo ESG</b> opatření.
      </Def>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 1 — Najdi etické dilema v případovce</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>
            → Konflikt zájmů (zákazník × zaměstnanec, zisk × ŽP)?<br/>
            → Krátkodobý zisk × dlouhodobá důvěra?<br/>
            → Šedá zóna mezi „zákonné” a „spravedlivé”?
          </div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 2 — Identifikuj typ manažera</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>
            → Tlačí na zisk za každou cenu? <b>Ekonomista</b><br/>
            → Vše řeší TOP management, on jen čeká? <b>Konvencionalista</b><br/>
            → Etika je priorita? <b>Idealista</b><br/>
            → Kombinuje etiku a zisk? <b>Reformista</b>
          </div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 3 — 3P / Carrollova pyramida analýza</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>
            → People: jak firma jedná se zaměstnanci a komunitou?<br/>
            → Planet: dopad na ŽP, recyklace, emise?<br/>
            → Profit: transparentnost, anti-korupce, governance?<br/>
            → Která úroveň Carrollovy pyramidy chybí?
          </div>
        </GlassBox>
        <GlassBox opacity={0.5} style={{ padding: "12px 14px", borderLeft: `3px solid ${VSE.ffu}`, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: VSE.ffu, fontFamily: fontSans, marginBottom: 4 }}>Krok 4 — Navrhni řešení (CSV nebo ESG)</div>
          <div style={{ fontSize: 12.5, color: "var(--text)", fontFamily: fontSans, lineHeight: 1.6 }}>
            → Etický kodex + tréning manažerů<br/>
            → CSV iniciativa — najít překryv mezi byznysem a společenským dopadem<br/>
            → ESG metriky a reporting (E + S + G)<br/>
            → Whistleblowing kanál pro mezinárodní firmu
          </div>
        </GlassBox>
      </div>

      <Tag color={VSE.ffu}>TYPICKÉ SITUACE V PŘÍPADOVKÁCH</Tag>
      <Bullet items={[
        "Firma šetří na bezpečnosti práce → dilema krátkodobý zisk × zdraví zaměstnanců",
        "Mezinárodní firma s dětskou prací u dodavatele → kulturní absolutismus vyhrává",
        "Manažer pod tlakem kvartálních cílů → dilema falšování čísel",
        "Greenwashing — firma předstírá udržitelnost → nemorální → ESG riziko",
        "CSR jen jako PR → komise: navrhnout CSV (sdílená hodnota místo charity)",
      ]} color={VSE.ffu} />

      {/* Hlavní strategie warning */}
      <div style={{ background: `linear-gradient(90deg, ${VSE.warning}15, ${VSE.warning}05)`, border: `1px solid ${VSE.warning}40`, borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 12, fontFamily: fontSans, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>💡</div>
        <div>
          <div style={{ fontWeight: 700, color: VSE.warning, fontFamily: fontMono, fontSize: 10.5, letterSpacing: "1.5px", marginBottom: 3 }}>HLAVNÍ TIP NA ZKOUŠKU</div>
          <span>Komise <b>vždy chce aplikaci na PS</b>. Mládková chce <b>najít dilema přímo v případovce</b>. Stříteský chce <b>spojit s misí a vizí</b>. Nový chce <b>kulturní rozdíly</b>. Připrav se na všechny 3 úhly.</span>
        </div>
      </div>
    </div>) },

];

const flashcards11 = [
  { term: "Etika", def: "Zkoumá morálku a morálně relevantní jednání + jeho normy. Mimozákonní doporučení.", tag: "POJEM" },
  { term: "Etické dilema", def: "Stav, kdy nelze najít 100% uspokojivé řešení. Mám možnosti, vybírám tu méně horší.", tag: "POJEM" },
  { term: "Etický kodex", def: "Normy, pravidla a zásady chování v organizaci. Součást corporate governance.", tag: "POJEM" },
  { term: "Udržitelnost", def: "Schopnost uspokojit dnešní potřeby bez kompromitování budoucích generací (Brundtland 1987).", tag: "POJEM" },
  { term: "3 pojetí etiky", def: "Nekognitivní (etika neexistuje) / Relativistická (situace je jiná) / Absolutistická (univerzální dobro a zlo).", tag: "TEORIE" },
  { term: "6 kroků řešení dilematu", def: "1. Rozpoznání · 2. Fakta · 3. Možnosti · 4. Testování · 5. Výběr · 6. Double-check + akce.", tag: "PROCES" },
  { term: "4 typy manažerů", def: "Ekonomista (zisk) · Konvencionalista (TOP řeší) · Idealista (morálka) · Reformista (etika = výhoda).", tag: "TYPY" },
  { term: "3P / Triple Bottom Line", def: "People (lidé) · Planet (planeta) · Profit (zisk). Průnik = udržitelnost.", tag: "MODEL" },
  { term: "Carrollova pyramida", def: "4 úrovně: 1. Ekonomická · 2. Právní · 3. Etická · 4. Filantropická. Čteme zdola.", tag: "MODEL" },
  { term: "Friedman (1970)", def: "Shareholder perspektiva. Jediná odpovědnost firmy = zisk akcionářů.", tag: "TEORIE" },
  { term: "Freeman (1984)", def: "Stakeholder perspektiva. Firma má odpovědnost vůči všem stakeholderům.", tag: "TEORIE" },
  { term: "CSR", def: "Corporate Social Responsibility. Reakce na vnější tlak, často filantropie. 80. léta.", tag: "PŘÍSTUP" },
  { term: "CSV", def: "Creating Shared Value (Porter 2011). Sdílená hodnota — byznys + společnost zároveň.", tag: "PŘÍSTUP" },
  { term: "ESG", def: "Environmental, Social, Governance. Měřitelné metriky pro investory. EU CSRD od 2024.", tag: "PŘÍSTUP" },
  { term: "Eco-efficiency", def: "Dělat víc s méně. Snížit ekologický dopad, efektivně využívat zdroje.", tag: "UDRŽITELNOST" },
  { term: "Eco-effectiveness", def: "Dělat správné věci. Cradle-to-cradle, regenerativní ekonomický růst.", tag: "UDRŽITELNOST" },
  { term: "Kulturní absolutismus", def: "Existují univerzální etické principy (lidská práva). Riziko: vnucování západních hodnot.", tag: "KULTURA" },
  { term: "Kulturní relativismus", def: "Etika závisí na kultuře a kontextu. Riziko: ospravedlnění čehokoli kulturou.", tag: "KULTURA" },
  { term: "Hofstede 5 dimenzí", def: "Maskulinita/Femininita · Individualismus/Kolektivismus · Vztah k nejistotě · Vzdálenost od moci · Dlouhodobost.", tag: "KULTURA" },
  { term: "Nemorální × Amorální × Morální", def: "3 kategorie manažerů: Schválně špatně / Nezvažuje etiku / Etika je cíl.", tag: "TYPY" },
];

const quiz11 = [
  { q: "Co je etické dilema?", opts: ["Volba mezi 2 dobrými možnostmi", "Stav, kdy nelze najít 100% uspokojivé řešení", "Porušení zákona", "Marketing aktivita"], correct: 1 },
  { q: "Které pojetí etiky tvrdí, že každá situace je jiná?", opts: ["Absolutistické", "Relativistické", "Nekognitivní", "Marxistické"], correct: 1 },
  { q: "Carrollova pyramida má kolik úrovní?", opts: ["3", "4", "5", "7"], correct: 1 },
  { q: "Kdo zastává shareholder perspektivu?", opts: ["Friedman", "Freeman", "Porter", "Carroll"], correct: 0 },
  { q: "Kdo zavedl pojem CSV (Creating Shared Value)?", opts: ["Friedman", "Freeman", "Porter", "Carroll"], correct: 2 },
  { q: "Co je 3P etického managementu?", opts: ["People · Planet · Profit", "Plan · Prepare · Perform", "Promise · Persist · Prosper", "Power · Politics · People"], correct: 0 },
  { q: "Manažer, který vidí etiku jako konkurenční výhodu, je:", opts: ["Ekonomista", "Konvencionalista", "Idealista", "Reformista"], correct: 3 },
  { q: "ESG zkratka znamená:", opts: ["Economy · Strategy · Growth", "Environmental · Social · Governance", "Ethics · Society · Goals", "Energy · Sustainability · Green"], correct: 1 },
  { q: "Eco-effectiveness znamená:", opts: ["Dělat víc s méně", "Dělat správné věci (cradle-to-cradle)", "Šetřit peníze", "Marketing udržitelnosti"], correct: 1 },
  { q: "Která firma je extrémním idealistou?", opts: ["Apple", "Tesla", "Patagonia", "Coca-Cola"], correct: 2 },
  { q: "VW Dieselgate je příklad:", opts: ["Eco-efficiency", "Idealismu", "Nemorálního managementu", "Reformismu"], correct: 2 },
  { q: "Hofstede 5 dimenzí NEZAHRNUJE:", opts: ["Maskulinita/Femininita", "Individualismus/Kolektivismus", "Vzdálenost od moci", "Tržní orientace"], correct: 3 },
  { q: "V mezinárodní firmě je nejlepší kombinace:", opts: ["Pouze absolutismus", "Pouze relativismus", "Univerzální základ + lokální přizpůsobení", "Jen lokální zákony"], correct: 2 },
  { q: "Friedman (1970) tvrdil, že:", opts: ["Firma má odpovědnost vůči všem stakeholderům", "Jediná odpovědnost firmy je zisk akcionářů", "CSR je důležitější než zisk", "ESG je povinné"], correct: 1 },
  { q: "Která etapa je nejnovější v evoluci CSR?", opts: ["Friedman shareholder", "CSR (filantropie)", "CSV (sdílená hodnota)", "ESG (měřitelný dopad)"], correct: 3 },
];

const praxe11 = {
  caseStudy: {
    company: "Volkswagen Dieselgate — když nemorální management zničí značku",
    subtitle: "Jak falšování emisí stálo VW 30+ mld. USD a 40 % hodnoty akcií",
    content: (<>
      V září 2015 vyšlo najevo, že <b>Volkswagen falšoval emisní testy</b> u <b>11 milionů aut</b> po celém světě. Software detekoval testovací podmínky laboratoře a snižoval emise oxidů dusíku. V reálném provozu ale auta vypouštěla <b>40× víc</b> než povolené normy.<br/><br/>
      <b style={{ color: VSE.danger }}>Etické dilema:</b> manažeři byli pod tlakem dostat čisté diesly na americký trh. Místo investice do nové technologie zvolili <b>krátkodobý podvod</b>.<br/>
      <b style={{ color: VSE.fmv }}>Typ manažerů:</b> klasičtí <b>ekonomisté</b> — etiku přehlédli, racionálně optimalizovali kvartální výsledky.<br/>
      <b style={{ color: VSE.fis }}>Carrollova pyramida:</b> firma porušila <b>2. úroveň (Právní)</b> — nelegální podvod. Tím automaticky padly i 3. (Etická) a 4. (Filantropická).<br/>
      <b style={{ color: VSE.success }}>Důsledky:</b> pokuty <b>30+ mld. USD</b>, akcie -40 %, ztráta důvěry, několik manažerů ve vězení (CEO Winterkorn obviněn z podvodu).<br/><br/>
      <b>Co se dalo udělat jinak:</b> přijmout, že nesplní emisní cíle v daném termínu, a investovat do dlouhodobého řešení (elektrifikace). VW to nakonec udělal — ale po skandálu, ne před ním. <b>Audi e-tron, ID.3, ID.4</b> jsou výsledkem této vynucené transformace.
    </>),
    lessons: "VW Dieselgate je <b>učebnicový příklad nemorálního managementu</b>. Manažeři volili krátkodobý zisk před etikou — a firma málem zkrachovala. Lekce: <b>etika není luxus, ale existenční strategie</b>. V éře sociálních sítí a ESG ratings se každý podvod dříve nebo později provalí. Na PS najdi podobné riziko (greenwashing, falšování čísel, šetření na bezpečnosti) a navrhni etický kodex + whistleblowing kanál.",
  },
  miniExamples: [
    { company: "Patagonia", tag: "IDEALISTA", color: VSE.success, content: "Yvon Chouinard v 2022 daroval celou firmu (3 mld. USD) trustům na ochranu klimatu. „Earth is our only shareholder.” 100 % zisku jde na boj proti klimatické krizi. Extrémní idealismus — etika jako jediný cíl. Mínus: nepřenositelný model pro většinu firem." },
    { company: "Unilever", tag: "REFORMISTA / CSV", color: VSE.fmv, content: "Sustainable Living Plan (2010-2020) — cíl zdvojnásobit byznys při polovinčím dopadu na ŽP. Snížili emise o 50 %, zvýšili příjmy o 20 %. Důkaz, že CSV funguje — etika a zisk se nevylučují. Příklad pro PS, jak doporučit posun od CSR k CSV." },
    { company: "Nike v Asii (90. léta)", tag: "KULTURNÍ ABSOLUTISMUS", color: VSE.fis, content: "Nike čelil skandálu kvůli dětské práci u asijských dodavatelů. Argument relativismu („v Asii to je normální”) se neuspěl. Nike musel přijmout absolutistický postoj — globální kodex zakazující dětskou práci. Ukázka: lidská práva jsou univerzální, ne kulturní." },
    { company: "Coca-Cola Indie", tag: "ETICKÉ DILEMA", color: VSE.danger, content: "Coca-Cola v Indii čerpala ohromné množství podzemní vody pro výrobu — způsobila sucho v okolí továren. Dilema: pokračovat v lokálním byznysu × ohrozit komunity? Tlak veřejnosti vedl k investicím do <b>vodní udržitelnosti</b> — dnes Coca-Cola vrací více vody, než spotřebuje. Pozdní, ale správný posun." },
  ],
};

const examQuestions11 = [
  { komise: "6.2.2026 — Mládková, Kolouchová, Mikan (Horská chata)", otazka: "Management diverzity - jaké dimenze jsou v managementu diverzity (věk, národnost...), výhody a nevýhody diverzity na pracovišti, aplikovat na případovku - řekl jsem, že by tam měli vzít studenty (dimenze věku), a možná přijmout více žen, protože tam je ta manželka, ale to se jim tolik nelíbílo, říkali, že by ta manželka stejně byla manželka majitele/spolumajitelka a víc žen v chatě by to moc neovlivnilo.", pozn: "Co bych doporučil nejvíc je Notebook LM. Já jsem tam říkal různý příklady (právě z podcastů, co notebook LM vytvořil) a komise říkala, že tyhle příklady ještě neslyšeli a že to je osvěžující. Tak jsem jim říkal, že jsem se učil pomocí toho Notebook LM a Mládková říkala, že to je asi důvod, proč celková kvalita vystoupení studentů u státnic v tom..." },
  { komise: "2.2.2026 — špaček, Nový, Machek (Káva)", otazka: "Etika, etické dilema, management udržitelnosti, aplikovat na případovku", pozn: "Nový docela potrápil, občas se tak nepříjemně zeptal, Machek mega typek, nehcá mluvit a pak se pripadne doptává, Spacek taky mega v klidu, nechal mluvit a ani se mě skoro na nic nedoptal. Takze overall dobra komise, i kdyz hrotili, tak ve finale v hodnoceni byli mirni." },
  { komise: "16.6.2025 — Vávra, Mládková, Štamfestová (Software)", otazka: "Etika v managementu, etický problém, najít v případovce", pozn: "Štamfestová moc milá, v ničem nešťourala, doptala se, ale žádný záludný otázky. Mládková nenechá mluvit, ptá se na otázky. U etiky se jí nelíbilo prakticky nic, co jsem řekla, i přes to, že na bakalářských státnicích jsem si to vytáhla taky a říkala jsem to stejný a bylo to ok. Vávra úplná pohoda. Případovku jsme vůbec neřešili." },
  { komise: "12.6.2025 — Pichanič, Kuděj, Martin Machek (Podnik s kávou)", otazka: "Etika, proč je pro společnost důležitá, etická dilemata v managementu, jak je řešit, management udržitelnosti, aplikace na případovku", pozn: "Nikdo z nich to nechtěl do hloubky, byl to v pohodě pokec. Stačilo mít přehled a vařit z vody :D" },
  { komise: "10.6.2025 — Nový, Svobodová, Kolouchová (Neziskovka)", otazka: "Etika v managementu, Etický dilema, co to je, najít v případovce, jaké jsou typy", pozn: "Nový byl hodně v klidu, měl konstruktivní dotazy, šlo mu hlavně ale o to si pokecat. Kolouchová se každýho ptala, kde pracuje a pak jsme místo o segemtnaci povídali hlavně o možnostech targetingu v digitální reklamě. Svobodová potrápila (chtěla u strategického myšlení Metody Koncepčního myšlení)" },
  { komise: "9.6.2025 — Tahal, Lorencová, Schonfeld (Sucho)", otazka: "Motivace a ovlivňování zaměstnanců (Lorencová vyloženě požadovala moderní teoretický přístupy k motivaci zaměstnanců, tj. metoda 4 driverů, zaměření na cíl a seberealizace. Vroom, McGregor, Masslow, Herzberg jí doslova nezajímaly. -> Na tomhle mě vyrazily)", pozn: "Tahal i Schönfeld v pohodě chlapi. Jediný vofuky dělala Lorencová, která se vyloženě nechtěla bavit o tý případový studii a zajímala jí čistě teorie spolu s názvy. Lorencovou jsem měl první a ve finále u ní bylo jasné, že mě na svojí otázce vylije jak dítě z vaničky (zjevně její oblíbená problematika). Pak už se komise moc ani nechtěla zdržovat ..." },
  { komise: "4.2.2025 — Vrbová, Tahal, Svobodová (víno)", otazka: "Etika v mngmntu, proč se tím zabívat, jaká jsou základní etická dilemata, najít v případovce a jak ho vyřešit. Udržitelný mngmnt a najít v případovce. Ptala se na ESG." },
  { komise: "30.1.2025 — Nový, Vávra, Heřman (Horská chata)", otazka: "Etika v managementu + najit problémy v případovce. Ptal se na kulturní absolutismus a relativismus, kulturní rozdíly v etice a jak nastavit etické chování v mezinárodní společnosti" },
  { komise: "28.1.2025 — Tahal, Kuděj, Kučera", otazka: "Team Excellence (chtěl slyšet jako jeden bod udržitelnost)" },
];

const podcast11 = {
  title: "Etika v managementu, CSR/ESG",
  description: "10-minutový souhrn etiky v managementu — 4 pojmy, 3 pojetí etiky, etické dilema (6 kroků), 4 typy manažerů, 3P, Carrollova pyramida, evoluce Friedman → CSR → CSV → ESG, kulturní absolutismus × relativismus.",
  audioUrl: "/audio/mng-11.mp3",
  notebookLmUrl: null,
  transcript: null,
};

const examStrategy11 = `
  <b style="color:#A82A5F">1.</b> Definuj 4 pojmy: <b>Etika · Etické dilema · Etický kodex · Udržitelnost</b>.<br/>
  <b style="color:#A82A5F">2.</b> 3 pojetí etiky (Nekognitivní / Relativistická / Absolutistická).<br/>
  <b style="color:#A82A5F">3.</b> <b>Etické dilema — 6 kroků řešení</b> (Mládková chce najít v PS!).<br/>
  <b style="color:#A82A5F">4.</b> 4 typy manažerů (Ekonomista / Konvencionalista / Idealista / Reformista).<br/>
  <b style="color:#A82A5F">5.</b> <b>3P / Triple Bottom Line</b> (People · Planet · Profit) + <b>Carrollova pyramida</b>.<br/>
  <b style="color:#A82A5F">6.</b> <b>Friedman × Freeman</b> + evoluce CSR → CSV → ESG (Stříteský!).<br/>
  <b style="color:#A82A5F">7.</b> Udržitelný management (eco-efficiency × eco-effectiveness).<br/>
  <b style="color:#A82A5F">8.</b> Kulturní absolutismus × relativismus + Hofstede (Nový/Vávra/Heřman!).<br/>
  <b style="color:#A82A5F">9.</b> Aplikace na PS — najdi dilema, identifikuj typ manažera, navrhni CSV/ESG.
`;

function OkruhMng11Panel() {
  return (<OkruhPanel subject="Management" subjectId="mng" number={11} title="Etika v managementu, CSR/ESG" subtitle="3P · Carrollova pyramida · Friedman × Freeman · Hofstede" color={VSE.ffu}
    questionText="Etika v managementu, proč se tím zabývat. Morální dilemata na případovku, jak je řešit. Udržitelný management. ESG. Kulturní absolutismus a relativismus."
    questionDesc="Etika a etické dilema. 4 typy manažerů. 3P / Triple Bottom Line. Carrollova pyramida. Friedman × Freeman. Evoluce CSR → CSV → ESG. Udržitelnost. Kulturní rozdíly. Aplikace na PS."
    sloz={2} roz={3} freq={3}
    examStrategy={examStrategy11}
    studySections={studySections11} flashcards={flashcards11} quiz={quiz11}
    praxe={praxe11} examQuestions={examQuestions11} podcast={podcast11} />);
}

/* ════════════════════════════════════════════════════════
   SKOOL-STYLE NAVIGATION
   ════════════════════════════════════════════════════════ */
const NAV_TABS = [
  { id: "okruhy", label: "Okruhy", iconName: "chart" },
  { id: "komunita", label: "Komunita", iconName: "people" },
  { id: "kalendar", label: "Kalendář", iconName: "target" },
  { id: "about", label: "O nás", iconName: "scroll" },
];

function SkoolNav({ activeTab, setActiveTab, themeMode, setThemeMode }) {
  const t = useTheme();
  const [streakOpen, setStreakOpen] = useState(false);
  const isDark = themeMode === "dark";
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${t.border}`, background: t.bg }}>
      {/* Top bar — flat, ink on dark / paper on light */}
      <div style={{ background: t.bg, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.borderSoft}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: RADIUS.sm, background: t.text, color: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: fontSans, letterSpacing: "-0.02em" }}>n</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, fontFamily: fontSans, color: t.text, letterSpacing: "-0.02em" }}>Nabombuj<span style={{ color: t.cta }}>.</span></div>
            <div style={{ fontSize: 10.5, color: t.textMuted, fontFamily: fontMono, letterSpacing: "1.4px", textTransform: "uppercase" }}>Ing · Státnice 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ color: t.textMuted, fontSize: 11, fontFamily: fontMono, letterSpacing: "1.4px", textTransform: "uppercase" }}>
            {DONE}/{TOTAL} hotovo
          </div>
          <StreakBadge onClick={() => setStreakOpen(true)} />
          <button onClick={() => setThemeMode(isDark ? "light" : "dark")} style={{ background: "transparent", border: `1px solid ${t.border}`, color: t.text, borderRadius: RADIUS.pill, padding: "6px 14px", fontSize: 11.5, fontFamily: fontSans, fontWeight: 500, cursor: "pointer" }}>
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </div>
      <StreakModal open={streakOpen} onClose={() => setStreakOpen(false)} />
      {/* Tab bar */}
      <div style={{ background: t.bg, padding: "0 28px", display: "flex", gap: 0 }}>
        {NAV_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "14px 18px", border: "none", borderBottom: activeTab === tab.id ? `2px solid ${t.text}` : "2px solid transparent",
            background: "transparent", color: activeTab === tab.id ? t.text : t.textMuted,
            fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 500, fontFamily: fontSans,
            cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8, letterSpacing: "-0.01em",
          }}>
            <Icon name={tab.iconName} size={15} color={activeTab === tab.id ? t.text : t.textMuted} />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   OKRUHY TAB — Two-panel Skool layout
   ════════════════════════════════════════════════════════ */
function OkruhySidebar({ selectedSubject, setSelectedSubject, selectedOkruh, setSelectedOkruh, onBackToDashboard }) {
  const t = useTheme();
  const subject = SUBJECTS.find(s => s.id === selectedSubject);
  const done = subject ? subject.okruhy.filter(o => o.status === "done").length : 0;
  const total = subject ? subject.okruhy.length : 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{ width: 320, minWidth: 320, borderRight: `1px solid ${t.borderSoft}`, height: "calc(100vh - 105px)", overflowY: "auto", background: t.bgDeep, display: "flex", flexDirection: "column" }}>
      {onBackToDashboard && (
        <div style={{ padding: "14px 18px 0" }}>
          <button onClick={onBackToDashboard} style={{
            background: "transparent", border: "none", color: t.textMuted,
            cursor: "pointer", fontSize: 11, fontFamily: fontMono, padding: "4px 0",
            display: "flex", alignItems: "center", gap: 6, letterSpacing: "1.4px", textTransform: "uppercase", fontWeight: 600,
          }}>← Dashboard</button>
        </div>
      )}
      <div style={{ padding: "16px 18px", borderBottom: `1px solid ${t.borderSoft}` }}>
        <div style={{ fontSize: 10, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", fontWeight: 600, marginBottom: 12, textTransform: "uppercase" }}>Předmět</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SUBJECTS.map(s => {
            const isActive = s.id === selectedSubject;
            return (
              <button key={s.id} onClick={() => { setSelectedSubject(s.id); setSelectedOkruh(null); }} style={{
                padding: "6px 12px", borderRadius: RADIUS.pill, border: `1px solid ${isActive ? t.text : t.border}`,
                background: isActive ? t.text : "transparent",
                color: isActive ? t.bg : t.textMuted,
                fontSize: 11.5, fontWeight: 500, fontFamily: fontSans, cursor: "pointer", transition: "all 0.2s",
                display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: "-0.01em",
              }}>
                <Icon name={s.icon} size={13} color={isActive ? t.bg : t.textMuted} />
                {s.name.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {subject && (
        <>
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${t.borderSoft}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text, fontFamily: fontSans, letterSpacing: "-0.015em" }}>{subject.name}</div>
              <span style={{ fontSize: 11, fontFamily: fontMono, color: t.textMuted, fontWeight: 500, letterSpacing: "1.4px" }}>{pct}%</span>
            </div>
            <div style={{ height: 3, background: t.borderSoft, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: t.accent, borderRadius: 99, transition: "width 0.4s" }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
            {subject.okruhy.map((okruh) => {
              const isDone = okruh.status === "done";
              const isSelected = selectedOkruh === okruh.n;
              return (
                <div key={okruh.n} onClick={() => isDone && setSelectedOkruh(okruh.n)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 12px", borderRadius: RADIUS.sm,
                    cursor: isDone ? "pointer" : "not-allowed",
                    background: isSelected ? t.surface : "transparent",
                    border: `1px solid ${isSelected ? t.borderStrong : "transparent"}`,
                    marginBottom: 2, transition: "all 0.2s",
                    opacity: isDone ? 1 : 0.45,
                  }}
                  onMouseEnter={(e) => { if (isDone && !isSelected) e.currentTarget.style.background = t.surfaceMuted; }}
                  onMouseLeave={(e) => { if (isDone && !isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: 99, flexShrink: 0,
                    background: isDone ? t.accent : "transparent",
                    border: isDone ? "none" : `1.5px solid ${t.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: BOMBIK.paper, fontSize: 11, fontWeight: 600, fontFamily: fontMono,
                  }}>
                    {isDone ? "✓" : <span style={{ color: t.textMuted }}>{okruh.n}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontFamily: fontSans, fontWeight: isSelected ? 600 : 500,
                      color: isDone ? t.text : t.textMuted,
                      lineHeight: 1.4, letterSpacing: "-0.01em",
                      overflow: "hidden", textOverflow: "ellipsis",
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    }}>
                      {okruh.n}. {okruh.title}
                    </div>
                    <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                      {[1,2,3].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: 99, background: i <= okruh.difficulty ? t.cta : t.borderSoft, display: "inline-block" }} />)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function OkruhContent({ subjectId, okruhN }) {
  const t = useTheme();
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const okruh = subject?.okruhy.find(o => o.n === okruhN);

  if (!okruh) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, background: t.bg }}>
        <BombikEmpty mood="think" size={120} caption="Vyber okruh v seznamu vlevo" sub="Klikni na nějaký okruh — Bombík tě prohoní látkou." />
      </div>
    );
  }

  if (okruh.status !== "done") {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, background: t.bg }}>
        <div style={{ textAlign: "center", maxWidth: 460 }}>
          <Bombik mood="think" size={120} />
          <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", marginTop: 18, textTransform: "uppercase" }}>{subject.name} · Okruh {String(okruh.n).padStart(2, "0")}</div>
          <div style={{ fontSize: 28, fontFamily: fontSans, fontWeight: 600, color: t.text, marginTop: 8, letterSpacing: "-0.025em", lineHeight: 1.15, textWrap: "balance" }}>{okruh.title}</div>
          <div style={{ fontSize: 14, color: t.textMuted, fontFamily: fontSans, marginTop: 12, lineHeight: 1.6, textWrap: "pretty" }}>Tento okruh zatím není zpracovaný. Bombik na něm makaa.</div>
        </div>
      </div>
    );
  }

  // Route to specific okruh content
  if (subjectId === "mng" && okruhN === 3) return <OkruhMng3Panel />;
  if (subjectId === "mng" && okruhN === 4) return <OkruhMng4Panel />;
  if (subjectId === "mng" && okruhN === 1) return <OkruhMng1Panel />;
  if (subjectId === "mng" && okruhN === 2) return <OkruhMng2Panel />;
  if (subjectId === "mng" && okruhN === 5) return <OkruhMng5Panel />;
  if (subjectId === "mng" && okruhN === 6) return <OkruhMng6Panel />;
  if (subjectId === "mng" && okruhN === 7) return <OkruhMng7Panel />;
  if (subjectId === "mng" && okruhN === 8) return <OkruhMng8Panel />;
  if (subjectId === "mng" && okruhN === 9) return <OkruhMng9Panel />;
  if (subjectId === "mng" && okruhN === 10) return <OkruhMng10Panel />;
  if (subjectId === "mng" && okruhN === 11) return <OkruhMng11Panel />;

  return null;
}

// Adapted Okruh panels (no back button, fit into right panel)
/* ════════════════════════════════════════════════════════
   NEW TABS — Praxe, Tažené otázky, Podcast
   ════════════════════════════════════════════════════════ */
function PraxeTab({ data, color }) {
  const t = useTheme();
  if (!data) return (
    <GlassBox opacity={0.5} style={{ padding: 24, borderRadius: 14, textAlign: "center" }}>
      <div style={{ fontSize: 13, color: t.textMuted, fontFamily: fontSans }}>Praktické příklady připravujeme.</div>
    </GlassBox>
  );
  return (
    <div>
      {data.caseStudy && (
        <div style={{ ...cardStyle(t), padding: "22px 24px", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Icon name="microscope" size={16} color={t.accent} />
            <span style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase" }}>Hlavní case study</span>
          </div>
          <div style={{ fontSize: 22, fontFamily: fontSans, color: t.text, marginBottom: 4, letterSpacing: "-0.02em", fontWeight: 600 }}>{data.caseStudy.company}</div>
          <div style={{ fontSize: 13, color: t.textMuted, fontFamily: fontItalic, fontStyle: "italic", marginBottom: 14 }}>{data.caseStudy.subtitle}</div>
          <div style={{ fontSize: 14.5, color: t.text, fontFamily: fontSans, lineHeight: 1.7, textWrap: "pretty" }}>
            {data.caseStudy.content}
          </div>
          {data.caseStudy.lessons && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: t.surfaceMuted, borderRadius: RADIUS.sm, borderLeft: `3px solid ${t.accent}` }}>
              <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", marginBottom: 6, textTransform: "uppercase" }}>Co si zapamatovat</div>
              <div style={{ fontSize: 13, color: t.text, fontFamily: fontSans, lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: data.caseStudy.lessons }} />
            </div>
          )}
        </div>
      )}

      {data.miniExamples && data.miniExamples.length > 0 && (
        <>
          <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", marginBottom: 10, marginTop: 8, textTransform: "uppercase" }}>Mini příklady</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.miniExamples.map((ex, i) => (
              <div key={i} style={{ background: t.surface, border: `1px solid ${t.borderSoft}`, borderRadius: RADIUS.md, padding: "14px 16px", borderLeft: `3px solid ${ex.color || t.accent}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: t.text, fontFamily: fontSans, letterSpacing: "-0.01em" }}>{ex.company}</div>
                  <div style={{ fontSize: 10.5, color: t.textMuted, fontFamily: fontMono, fontWeight: 600, letterSpacing: "1.4px", textTransform: "uppercase" }}>{ex.tag}</div>
                </div>
                <div style={{ fontSize: 13, color: t.textMuted, fontFamily: fontSans, lineHeight: 1.6 }}>{ex.content}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ExamTab({ data, color }) {
  const t = useTheme();
  if (!data || data.length === 0) return (
    <div style={{ ...cardStyle(t), padding: 28, textAlign: "center" }}>
      <div style={{ fontSize: 13.5, color: t.textMuted, fontFamily: fontSans }}>Tažené otázky připravujeme.</div>
    </div>
  );
  return (
    <div>
      <div style={{ background: t.surfaceMuted, border: `1px solid ${t.borderSoft}`, borderLeft: `3px solid ${t.cta}`, borderRadius: RADIUS.md, padding: "14px 18px", marginBottom: 16, fontSize: 13, fontFamily: fontSans, color: t.text, lineHeight: 1.6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 10.5, fontFamily: fontMono, color: t.cta, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase" }}>Reálné otázky z komisí</span>
        </div>
        Celkem <b>{data.length}</b> zaznamenaných případů. Studuj examiner notes ke každé komisi — styl otázek se liší člověk od člověka.
      </div>
      {data.map((e, i) => (
        <ExamQ key={i} komise={e.komise} otazka={e.otazka} pozn={e.pozn} />
      ))}
      {data[0]?.strategy && (
        <div style={{ ...cardStyle(t, "muted"), padding: 18, marginTop: 14, borderLeft: `3px solid ${t.accent}` }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: t.textMuted, fontFamily: fontMono, marginBottom: 10, letterSpacing: "1.6px", textTransform: "uppercase" }}>Strategie na zkoušku</div>
          <div style={{ fontSize: 13, color: t.text, lineHeight: 1.7, fontFamily: fontSans }} dangerouslySetInnerHTML={{ __html: data[0].strategy }} />
        </div>
      )}
    </div>
  );
}

function PodcastTab({ data, color }) {
  const t = useTheme();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(() => {
    try {
      const saved = localStorage.getItem("nabombuj_podcast_speed");
      return saved ? parseFloat(saved) : 1;
    } catch { return 1; }
  });
  const audioRef = useRef(null);

  // Aplikuje rychlost při změně audio prvku (např. po načtení dat)
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate, data?.audioUrl]);

  if (!data || !data.audioUrl) {
    return (
      <div style={{ ...cardStyle(t), padding: 32, textAlign: "center" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 99, background: t.surfaceMuted, border: `1px solid ${t.borderSoft}` }}>
            <Icon name="lightbulb" size={24} color={t.textMuted} />
          </div>
        </div>
        <div style={{ fontSize: 17, color: t.text, fontFamily: fontSans, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.015em" }}>Podcast se připravuje</div>
        <div style={{ fontSize: 13.5, color: t.textMuted, fontFamily: fontSans, lineHeight: 1.6, maxWidth: 420, margin: "0 auto", textWrap: "pretty" }}>
          K této otázce vznikne krátký audio souhrn generovaný v Notebook LM. Ideální na cesty a opakování.
        </div>
      </div>
    );
  }

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else {
      audioRef.current.play();
      // Streak při startu přehrávání
      try { recordActivity(); window.dispatchEvent(new Event("streak-updated")); } catch {}
    }
    setPlaying(!playing);
  };

  const seek = (e) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 1.75, 2];
    const currentIdx = speeds.indexOf(playbackRate);
    const nextRate = speeds[(currentIdx + 1) % speeds.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) audioRef.current.playbackRate = nextRate;
    try { localStorage.setItem("nabombuj_podcast_speed", String(nextRate)); } catch {}
  };

  const skipBack = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
  };

  return (
    <div style={{ ...cardStyle(t), padding: "24px 26px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon name="lightbulb" size={14} color={t.textMuted} />
        <span style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase" }}>Notebook LM podcast</span>
      </div>
      <div style={{ fontSize: 22, fontFamily: fontSans, fontWeight: 600, color: t.text, marginBottom: 4, letterSpacing: "-0.02em" }}>{data.title || "Mini podcast"}</div>
      {data.description && <div style={{ fontSize: 13, color: t.textMuted, fontFamily: fontSans, marginBottom: 18, lineHeight: 1.55, textWrap: "pretty" }}>{data.description}</div>}

      <audio ref={audioRef} src={data.audioUrl} preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onTimeUpdate={(e) => { setCurrentTime(e.target.currentTime); setProgress((e.target.currentTime / e.target.duration) * 100); }}
        onEnded={() => setPlaying(false)}
      />

      <div onClick={seek} style={{ height: 4, background: t.borderSoft, borderRadius: 99, cursor: "pointer", marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: t.accent, borderRadius: 99, transition: "width 0.1s linear" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={togglePlay} style={{
          width: 44, height: 44, borderRadius: 99, border: "none",
          background: t.text, color: t.bg, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <button onClick={skipBack} title="Skok zpět o 10 s" style={{
          width: 36, height: 36, borderRadius: 99, border: `1px solid ${t.border}`,
          background: "transparent", color: t.textMuted, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 600, fontFamily: fontMono, transition: "all 0.2s",
        }}>−10s</button>

        <button onClick={skipForward} title="Skok vpřed o 10 s" style={{
          width: 36, height: 36, borderRadius: 99, border: `1px solid ${t.border}`,
          background: "transparent", color: t.textMuted, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 600, fontFamily: fontMono, transition: "all 0.2s",
        }}>+10s</button>

        <div style={{ fontSize: 12, fontFamily: fontMono, color: t.textMuted, letterSpacing: "0.8px" }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <button onClick={cycleSpeed} title="Změnit rychlost přehrávání" style={{
          padding: "6px 12px", borderRadius: RADIUS.pill, fontSize: 12, fontWeight: 600, fontFamily: fontMono,
          background: playbackRate === 1 ? "transparent" : t.text,
          color: playbackRate === 1 ? t.textMuted : t.bg,
          border: `1px solid ${playbackRate === 1 ? t.border : t.text}`,
          cursor: "pointer", transition: "all 0.2s",
          minWidth: 52, letterSpacing: "0.5px",
        }}>
          {playbackRate}×
        </button>

        {data.notebookLmUrl && (
          <a href={data.notebookLmUrl} target="_blank" rel="noreferrer" style={{
            marginLeft: "auto", fontSize: 12, color: t.textMuted, fontFamily: fontSans,
            textDecoration: "none", padding: "6px 14px", borderRadius: RADIUS.pill,
            border: `1px solid ${t.border}`, transition: "all 0.2s",
          }}>Notebook LM ↗</a>
        )}
      </div>

      {data.transcript && (
        <details style={{ marginTop: 18, fontSize: 13, color: t.textMuted, fontFamily: fontSans }}>
          <summary style={{ cursor: "pointer", fontWeight: 600, color: t.text, marginBottom: 8 }}>Přepis</summary>
          <div style={{ lineHeight: 1.7, paddingTop: 8 }}>{data.transcript}</div>
        </details>
      )}
    </div>
  );
}

function OkruhPanel({ subject, subjectId, number, title, subtitle, color, questionText, questionDesc, sloz, roz, freq, studySections, flashcards, quiz, checklist, praxe, examQuestions, podcast, examStrategy }) {
  const t = useTheme();
  const [tab, setTab] = useState("study");
  const [open, setOpen] = useState(new Set([studySections[0]?.id]));
  const [cheatOpen, setCheatOpen] = useState(false);
  const toggle = (id) => setOpen(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const tabs = [
    { id: "study", label: "Studium", color, icon: "book" },
    { id: "praxe", label: "Praxe", color: VSE.fmv, icon: "microscope" },
    { id: "exam", label: "Tažené", color: VSE.danger, icon: "graduation" },
    { id: "flashcards", label: "Kartičky", color: VSE.fis, icon: "brain" },
    { id: "quiz", label: "Kvíz", color: VSE.success, icon: "target" },
    { id: "podcast", label: "Podcast", color: VSE.primary, icon: "lightbulb" },
  ];

  const hasCheatSheet = subject === "Management" && number === 1;

  if (cheatOpen && hasCheatSheet) {
    return (
      <div style={{ flex: 1, overflowY: "auto", height: "calc(100vh - 105px)", background: "#f5f5f5" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#fff", borderBottom: "1px solid #ddd", padding: "12px 20px", display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>📄 Cheat sheet — {subject} okruh {number}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => window.print()} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#A82A5F", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>🖨️ Tisk / PDF</button>
            <button onClick={() => setCheatOpen(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", color: "#666", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>← Zpět do okruhu</button>
          </div>
        </div>
        <CheatSheet1 />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", height: "calc(100vh - 105px)", padding: "32px 36px 48px", background: t.bg }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase" }}>{subject} · Okruh {String(number).padStart(2, "0")}</span>
          </div>
          <h1 style={{ margin: "4px 0 6px", fontSize: 40, fontWeight: 600, fontFamily: fontSans, color: t.text, letterSpacing: "-0.025em", lineHeight: 1.05 }}>{title}</h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <p style={{ margin: 0, color: t.textMuted, fontSize: 14, fontFamily: fontSans, lineHeight: 1.55, textWrap: "pretty", maxWidth: 600 }}>{subtitle}</p>
            {hasCheatSheet && (
              <button onClick={() => setCheatOpen(true)} title="Otevři tisknutelný cheat sheet" style={{
                padding: "8px 14px", borderRadius: RADIUS.pill, border: `1px solid ${t.border}`,
                background: t.surface, color: t.text,
                cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: fontSans,
                whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <Icon name="file" size={12} color={t.text} />
                Cheat sheet
              </button>
            )}
          </div>
        </div>

        {/* Question */}
        <div style={{ ...cardStyle(t, "muted"), padding: "16px 20px", marginBottom: 12, marginTop: 18, borderLeft: `3px solid ${t.cta}` }}>
          <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", marginBottom: 6, textTransform: "uppercase" }}>Znění otázky</div>
          <div style={{ fontSize: 15, color: t.text, fontFamily: fontSans, lineHeight: 1.55, fontWeight: 500, textWrap: "pretty" }}>{questionText}</div>
          {questionDesc && <div style={{ fontSize: 13, color: t.textMuted, fontFamily: fontSans, marginTop: 8, lineHeight: 1.55, textWrap: "pretty" }}>{questionDesc}</div>}
        </div>

        <Difficulty sloz={sloz} roz={roz} freq={freq} />

        {/* Tabs — flat segmented control */}
        <div style={{ display: "flex", gap: 0, marginBottom: 18, marginTop: 14, borderBottom: `1px solid ${t.border}`, overflowX: "auto" }}>
          {tabs.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{
              padding: "12px 16px", border: "none", background: "transparent",
              borderBottom: tab === tb.id ? `2px solid ${t.text}` : "2px solid transparent",
              color: tab === tb.id ? t.text : t.textMuted,
              fontSize: 13, fontWeight: tab === tb.id ? 600 : 500, fontFamily: fontSans, cursor: "pointer",
              transition: "all 0.15s", whiteSpace: "nowrap", marginBottom: -1,
            }}>{tb.label}</button>
          ))}
        </div>

        {tab === "study" && (
          <>
            {examStrategy ? (
              <GlassBox opacity={0.6} style={{ border: `1px solid ${VSE.warning}40`, borderRadius: 16, padding: "16px 20px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Icon name="target" size={16} color={VSE.warning} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: VSE.warning, fontFamily: fontMono, letterSpacing: "1.5px" }}>STRATEGIE NA ZKOUŠKU</div>
                </div>
                <div style={{ fontSize: 13, color: t.text, lineHeight: 1.75, fontFamily: fontSans }} dangerouslySetInnerHTML={{ __html: examStrategy }} />
              </GlassBox>
            ) : (
              <>
                <ChecklistGeneric items={checklist} />
                <div style={{ height: 10 }} />
              </>
            )}
            {studySections.map((s) => <Section key={s.id} s={s} isOpen={open.has(s.id)} onToggle={() => toggle(s.id)} subjectId={subjectId} okruhN={number} subjectLabel={subject} />)}
          </>
        )}
        {tab === "praxe" && <PraxeTab data={praxe} color={color} />}
        {tab === "exam" && <ExamTab data={examQuestions} color={color} />}
        {tab === "flashcards" && <FlashcardsTab data={flashcards} />}
        {tab === "quiz" && <QuizTab data={quiz} />}
        {tab === "podcast" && <PodcastTab data={podcast} color={color} />}
      </div>
    </div>
  );
}

function OkruhMng3Panel() {
  const praxe3 = {
    caseStudy: {
      company: "Valve — firma bez šéfů",
      subtitle: "Emergence v extrémní podobě",
      content: (<>
        <b>Valve</b> (Half-Life, Counter-Strike, Steam) nemá manažery. Má 400 zaměstnanců, obrat miliardy dolarů — a <b>nikdo nikomu nešéfuje</b>.<br/><br/>
        <b style={{ color: VSE.fis }}>Jak to funguje:</b> Stoly ve firmě mají kolečka. Když chceš na jiném projektu, prostě si tam přijedeš. Projekty vznikají zdola — někdo má nápad, snaží se přesvědčit ostatní, aby s ním šli. Pokud ho nepřesvědčí, projekt nevznikne. Pokud ano, tým se časem může rozrůst i zase rozpadnout.<br/><br/>
        <b style={{ color: VSE.success }}>Kde to funguje:</b> Kreativní práce, kde top talenti sami vědí, co má smysl dělat. Valve má Steam (nejvíc používanou herní platformu) a vydělává nepřetržitě.<br/><br/>
        <b style={{ color: VSE.danger }}>Kde to drhne:</b> Někteří bývalí zaměstnanci si stěžují, že ve skutečnosti tam šéfové jsou — jen neformální. Kdo přesvědčí ostatní, má moc. Kdo neumí networkovat, ztrácí vliv. Emergence není dokonalá.
      </>),
      lessons: "Valve ukazuje krajní emergenci. Většina firem bude někde uprostřed — část procesů je byrokratická (účetnictví, právo), část emergentní (produkt, inovace). To je <b>flexibilní byrokracie</b> — hybridní model, který komise ráda slyší."
    },
    miniExamples: [
      { company: "Česká pošta", tag: "BYROKRACIE", color: VSE.danger, content: "Česká pošta funguje podle jasných pravidel, hierarchie, tabulkových platů. Každý úkol má přesný postup. Funguje to pro rutinní operace (doručit dopis), selhává to u změn (digitalizace trvá roky)." },
      { company: "W.L. Gore (Gore-Tex)", tag: "EMERGENCE", color: VSE.success, content: "W.L. Gore nemá tituly ani manažery. Zaměstnanci se sami přihlásí na projekty. Pravidlo 150 — když tým překročí 150 lidí, rozdělí se. Funguje 60+ let, firma má 11 000 zaměstnanců." },
      { company: "Toyota", tag: "HYBRID", color: VSE.fmv, content: "Toyota má tvrdou hierarchii pro výrobu (přesné procesy, SOP), ale emergence pro zlepšování. Každý dělník může zastavit linku, když najde problém. Kombinace obojího — kaizen." }
    ]
  };
  const examQuestions3 = [
  { komise: "6.2.2026 — Kupec, Mládková, Kolouchová (Coffee Pot)", otazka: "Koordinování", pozn: "Kupec super týpek, nechá mluvit, žádný zákeřnosti, Kolouchová taky v pohodě, ideálně se trefit na nějaký téma, co má ráda a o tom mluvit, stačil fakt základ, Mládková vám dá fakt grilovačku, jestli neznáte definice, ale pak je důležitý se nějak chytnout a něco říkat, overall komise good" },
  { komise: "16.6.2025 — Double Stříteský, Mareš (Firma vyrábějící nádobí)", otazka: "Jak jsou v případovce prvky firmy (kultura, org. struktura, business approach) propsané do motivačního a rozvojového programu. Jak by se mohly tyto prvky propsat aby to reflektovalo styl firemního fungování, kterého nástroje by firma mohla použít nebo které použivá pro rozvoj a motivaci a jak je to sladěný s celým business přístupem.", pozn: "Mareš nejvíc v pohodě, pánové Stříteští doptávající se směry, kde jsem občas netušila, co po mně chtějí (zvlášť protože vzorec na zvětšování existujícího trhu jsem neznala a hned potom co ho Stříteský řekl jsem to bohužel i zapomněla, tj, nemůžu pomoct dalším studentům), ve všech případech ale stačilo udělat kombinaci obecně aplikovatelné teorie..." },
  { komise: "10.6.2025 — Píchánič, Machek, Svobodová", otazka: "Emergence byrokracie" },
  { komise: "5.6.2025 — (asi) Kolouchova, Viktora, Honig (Firma vyrábějící nadobi)", otazka: "Přístupy ke koordinováni aktivit. Jaky přístup používá fma v PS. Co byste doporučili", pozn: "Všichni byli hodní a usměvaví. Teorie k otázkám je moc nezajímala, hlavně to, jak to udělat v praxi. Stačily ale pouze velice rámcové kecy. Nic těžkého." },
  { komise: "5.6.2025 — (asi) Kolouchova, Viktora, Honig (Firma vyrábějící nadobi)", otazka: "Ovlivňování vnější a vnitřní motivace (job crafting a job design)", pozn: "moc příjemní, moc hodní, nebyli zlý ani protivný, nerejpali" },
  { komise: "28.1.2025 — Tahal, Kuděj, Nový (Pripadovka: spolenost na sanace, plisne, odvhlcovani :D)", otazka: "Organizační struktura a strategie ve vztahu k motivaci" },
];
  const podcast3 = { title: "Koordinování — byrokracie × emergence", description: "Oba póly, hybridní modely, Job Design vs Job Crafting. 8 minut.", audioUrl: "/audio/mng-3.mp3", notebookLmUrl: null };
  const examStrategy3 = `
    <b style="color:#A82A5F">1.</b> Definuj koordinaci aktivit (Birkinshaw dimenze 1).<br/>
    <b style="color:#A82A5F">2.</b> Byrokracie — 6 principů (Svobodová chce přesně!) + plusy/mínusy.<br/>
    <b style="color:#A82A5F">3.</b> Emergence — principy + plusy/mínusy.<br/>
    <b style="color:#A82A5F">4.</b> Rozdíl Job Design × Job Crafting.<br/>
    <b style="color:#A82A5F">5.</b> Hybridní modely (flexibilní byrokracie, vnitřní trh, síť).<br/>
    <b style="color:#A82A5F">6.</b> Aplikace na PS — kde je firma a kam by měla jít.<br/>
    <b style="color:#A82A5F">7.</b> ⚠️ Machek se hodně doptává — připrav si příklady (Česká pošta / Valve / Toyota).
  `;
  return (
    <OkruhPanel
      subject="Management" subjectId="mng" number={3} title="Koordinace aktivit" subtitle="Byrokracie x Emergence / Hybridní modely" color={VSE.ffu}
      questionText="Koordinování (byrokracie × emergence)"
      questionDesc="Popiš přístupy ke koordinaci aktivit. Vysvětli byrokracii a emergenci. Uveď hybridní modely. Aplikuj na případovku."
      sloz={2} roz={3} freq={2}
      examStrategy={examStrategy3}
      studySections={studySections3}
      flashcards={flashcards3}
      quiz={quiz3}
      praxe={praxe3}
      examQuestions={examQuestions3}
      podcast={podcast3}
    />
  );
}

function OkruhMng4Panel() {
  const praxe4 = {
    caseStudy: {
      company: "Zappos a holokracie — experiment, který málem zabil firmu",
      subtitle: "Kolektivní moudrost má své limity",
      content: (<>
        V roce 2013 CEO Zappos <b>Tony Hsieh</b> prohlásil: „Zrušíme všechny manažerské pozice. Přejdeme na <b>holokracii</b> — firmu bez šéfů.” 1500 zaměstnanců dostalo nové uspořádání: žádní manažeři, pouze „kruhy” s rolemi, které si každý může vzít.<br/><br/>
        <b style={{ color: VSE.danger }}>Co se stalo:</b> 14 % zaměstnanců okamžitě dalo výpověď (Hsieh jim nabídl 3měsíční odstupné, pokud nesouhlasí). Rozhodování trvalo hodiny místo minut. Nikdo nevěděl, kdo má pravomoc rozhodnout.<br/><br/>
        <b style={{ color: VSE.warning }}>Po 2 letech:</b> Zappos holokracii <b>částečně zrušil</b>. Vrátil seniorní role pro strategická rozhodnutí. Inovace ve stylu „všichni rozhodují o všem” nefunguje u velké firmy.<br/><br/>
        <b style={{ color: VSE.nf }}>Co z toho plyne:</b> Collective wisdom funguje pro <b>generování nápadů</b> (brainstorming, Delphi). Ale finální strategická rozhodnutí musí někdo udělat — hierarchie není zlo, je to nástroj. Problém Zappos byl, že šel z extrému do extrému.
      </>),
      lessons: "Na zkoušce komise (hlavně Mikovcová) chce slyšet, že moderní struktury NEJSOU automaticky lepší. Záleží na kontextu — startup s 20 lidmi vs korporát s 15 000. Kolektivní moudrost je skvělá pro nápady, hierarchie pro realizaci."
    },
    miniExamples: [
      { company: "Armáda", tag: "HIERARCHIE", color: VSE.danger, content: "V armádě je jasná linie velení — generál rozhoduje, seržant plní. Funguje to, protože v boji nemáš čas na diskuzi. Klasická hierarchie, Weberova legitimní moc." },
      { company: "Wikipedia", tag: "COLLECTIVE WISDOM", color: VSE.success, content: "Wikipedia nemá redakci. Článek může editovat kdokoli, ostatní opravují chyby. Z tohoto chaosu vzniká nejpřesnější encyklopedie na světě. Funguje, protože přispěvatelů jsou miliony — tzv. moudrost davu." },
      { company: "Haier", tag: "MIKROPODNIKY", color: VSE.fmv, content: "Čínský Haier (elektro) rozdělil firmu na 4 000 mikropodniků. Každý má 10-15 lidí, vlastní P&L, sami si dělají strategii. Vnitřní trh — kdo není ziskový, zaniká. Hybrid mezi hierarchií a emergencí." },
      { company: "Steve Jobs — expertní moc", tag: "FRENCH-RAVEN", color: VSE.primary, content: "Jobs neměl formální moc (byl jen CEO Applu, ne vlastník). Jeho moc byla expertní (rozuměl designu) a referenční (lidé ho obdivovali). Proto mohl vyhodit jakýkoli produkt a tým šel do toho." }
    ]
  };
  const examQuestions4 = [
  { komise: "4.2.2026 — Mikovcová, Viktora, Vávra (Vinařství)", otazka: "Motivace zaměstnanců", pozn: "Snová komice, největší strach asi vzbuzovala Mikovcová, ale třeba v rozhodování mi do toho neskočila ani jednou (těžko říct jak by to bylo u strategie), Vávra (marketing) je dědeček hříbeček, otázky pokládal dost zmateně a uplně jsem nepochopila smysl naší konverzace, prostě si nechal odvyprávět co jsem měla připravené a občas položil nesmyslnou..." },
  { komise: "3.2.2026 — Bočková, Nový, Kolouchová (Software)", otazka: "Zdroje moci French Raven. Aplikovat na případovku, jaké zdroje moci manažer využívá, jaká jsou rizika a co bych jim doporučila", pozn: "Kolouchova je super, snaží se pomoct, U nového je duležité tomu rozumět, ptal se na záludné otázky, ale dalo se to odvodit. Bočková se moc netváří, ale ve výsledku hodná" },
  { komise: "2.2.2026 — Schönfeld, Legnerová, Zamazalová (Prádlo)", otazka: "Zdroje moci French Raven. Aplikovat na případovku, jaké zdroje moci manažer využívá, jaká jsou rizika a co bych jim doporučila", pozn: "Skvělá komise" },
  { komise: "2.2.2026 — Střítěský, Lorencová, Pernica (Neziskovka: handicapovaní)", otazka: "rozhodování a distribuce moci, aplikace na případovku", pozn: "Komise milá, hodně chce ukázat na případovce ale chtěla i na praktických příkladech" },
  { komise: "30.1.2026 — Svobodová, Tahal, Cejthamr (Vino)", otazka: "Distribuce moci", pozn: "Boží komise" },
  { komise: "29.1.2026 — Svobodová, Nový, Machek (Horská chata)", otazka: "Zdroje moci French Raven. Aplikovat na případovku, jaké zdroje moci manažer využívá, jaká jsou rizika a co bych jim doporučila" },
  { komise: "28.1.2026 — Stříteský, Sieber, Vítečková (Káva)", otazka: "Jaka organizacni struktura byla pouzita v pripadove studii? Jak je v pripadove studii rozlozena moc? Jake jsou jeji vyhody/nevyhody?", pozn: "Bylo to docela narocne, kazdej tam byl min pul hodiny, ale zli vylozene nebyli. Bylo hlavni mluvit a zkouset se chytat podle jejich otazek" },
  { komise: "11.9.2025 — Stříteský, Schönfeld, Cejthamr (Lázně)", otazka: "Kreativita v organizaci - doporučení pro rozvoj kreativity v případovce", pozn: "Top komise! Stříteského teorie moc nezajímala, hned přešel na případovku a dost tam toho odkecal za mě. Cejthamr je zlatíčko - stačila mu jen aplikace na případovku a vůbec na nic se nedoptával. U otázky z rozhodování jsem nestihla aplikaci na případovku - problem tree, kritéria atd., Schönfeldovi jsem to hned prokecla a řekl, že to nevadí, že m..." },
  { komise: "18.6.2025 — Mládková, Mareš, Vávra (Horská chata)", otazka: "Rozdělení moci v organizaci, aplikace na případovku", pozn: "Mládková nechtěla hierarchii a collective wisdom, chtěla formální a neformální. Na případkovku to skoro nešlo navázat, ale Mládková byla relativně otevřená diskusi..." },
  { komise: "17.6.2025 — Vávra, Lorencová, Krause (Kola)", otazka: "Rozdělení moci v organizaci, hierarchie x collective wisdom", pozn: "Všichni byli moc hodní. S Vávrou a Lorencovou to bylo spíš jako přátelský rozhovor. Krause nechal mluvit a pak se doptával na úplně jednoduché otázky. Všichni chtěli propojit na případovku. HIERARCHIE - doporučit strukturu (buď vymyslet novou a nebo si prosadit přísnou hierarchii - Lorencové šlo hlavně o to, abych o tom přemýšlel). Doporučuju vz..." },
  { komise: "16.6.2025 — Double Stříteský, Mareš (Firma vyrábějící nádobí)", otazka: "Rozhodování - hierarchie x kolektivní moudrost. Typy, principy, atd... najít v případovce a popsat co dělá špatně/dobře", pozn: "Dobrá komise, stačí ukázat že rozumíte tomu předmětu jako takovému. V. Stříteský se doptával na specifika, ale to jen když už viděl, že je to v pohodě." },
  { komise: "16.6.2025 — Špaček, Háša, Zamazalová (Neziskovka)", otazka: "Přístupy k change managementu a využití change platform v případovce, bariéry, Kotter a U model - v čem se liší", pozn: "Komise v pohodě, největším překvapením byl Háša, který se na všechny smál, nepokládal složité otázky a oceňoval přístup, jak nad nimi přemýšlíme - u Kottera chtěl vyjmenovat chronologicky všechny body. Zamazalová nechala mluvit, řekl jsem celou teroii ze Zuzky a ani se na nic nedoptala. Špaček hodnotí mírně a snaží se pomoci. Mluvte u něj nahlas..." },
  { komise: "10.6.2025 — Double Stříteský, Müllerová (Neziskovka)", otazka: "Distribuce moci a rozhodování v organizaci. Jaký přístup je použitý v případovce? Jaké jsou výhody nebo nevýhody? Jak byste zlepšili organizaci na modernější variantu?" },
  { komise: "10.6.2025 — Nepamatuju si ale byli to 3 týpci", otazka: "Zdroje moci (French, Raven) aplikovat na případovku, navrhnout řešení jaké moci by měl manažer uplatňovat více", pozn: "v kapitálové struktuře mám pocit že se můžou zeptat opravdu na cokoliv, mě se hodně vyptával na kapitálové fondy a chtěl všechny možné druhy financování toho VK." },
  { komise: "10.6.2025 — Mikovcová, Vávra, Viktora (Lázně)", otazka: "HR controlling - k čemu je ve společnosti obecně, jaké jsou metriky, ukazatele, navázat na případovku", pozn: "Viktora chtěl přesah do praxe, doptával se, ale když bylo vidět že to člověk chápal, tak mu stačilo vastně celkem málo, Mikovcová celkem přísná, ale z teorie jí stačil jen základ- vyjmenovat základní postup Kepner Tregoe rozhodovací proces a pak to chtěla konkrétně rozebrat přesně na případovce bod po bodu, u variant chtěla alespoň 4 vymyslet, a..." },
  { komise: "4.6.2025 — Tahal, Cajthamer, Schonfield (Anitivirus)", otazka: "Zdroje moci (French, Raven), followership", pozn: "hodně dobrá komise, pomáhá pořád mluvit" },
  { komise: "5.2.2025 — Krause, Viktora, Tahal (Neziskovka)", otazka: "Zdroje moci v leadershipu, najit nejvic vyuzivany pristup v pripadovce, vztahnout na leadera, co dela dobre/spatne, poradit mu…" },
  { komise: "4.2.2025 — Mikovcová, Kolouchová, Viktora (Firma vyrábějící hrnce)", otazka: "Rozdělení moci v organizaci (hierarchie, kolektiv. moudrost), jakou má společnost strukturu, jakou moderní strukturu bych doporučila pro firmu" },
  { komise: "30.1.2025 — Nový, Vávra, Heřman (Horská chata)", otazka: "distribuce moci, zdroje moci a aplikace na případovku + zvolit organizační stukturu (planning x discovery bylo v případovce, ale šlo vybrat i jinou. Já jsem řekla že bych zůstala u planning než začnou něco inovovat, protože tam nefungují procesy)" },
];
  const podcast4 = { title: "Rozhodování a distribuce moci", description: "Distribuce moci, hierarchie × collective wisdom, French-Ravenových 5 zdrojů moci, moderní struktury (améba, holokracie, špagety, adhokracie), Job Design × Job Crafting. Ideální pro upevnění před zkouškou — 9 minut.", audioUrl: "/audio/mng-4.mp3", notebookLmUrl: null };
  const examStrategy4 = `
    <b style="color:#A82A5F">1.</b> Definuj distribuci moci + rozhodování (Birkinshaw dimenze 2).<br/>
    <b style="color:#A82A5F">2.</b> Hierarchie × Collective Wisdom — principy, plusy/mínusy.<br/>
    <b style="color:#A82A5F">3.</b> Koncept <b>3S</b> (self-management, -organization, -control).<br/>
    <b style="color:#A82A5F">4.</b> Metody CW (brainstorming, Delphi, nominální technika).<br/>
    <b style="color:#A82A5F">5.</b> ⚠️ <b>French-Raven — všech 5 typů s příklady</b> (4× v ZS 2026!).<br/>
    <b style="color:#A82A5F">6.</b> Weberovy zdroje moci + mikropolitika.<br/>
    <b style="color:#A82A5F">7.</b> Teorie X × Y (McGregor).<br/>
    <b style="color:#A82A5F">8.</b> Moderní org. struktury (améby, holokracie, špagety, network).<br/>
    <b style="color:#A82A5F">9.</b> Aplikace na PS — zařadit strukturu + navrhnout <b>modernější variantu</b> (Nový/Vávra/Heřman!).<br/>
    <b style="color:#A82A5F">10.</b> ⚠️ U Mládkové: FORMÁLNÍ vs NEFORMÁLNÍ moc (ne hierarchie/CW).
  `;
  return (
    <OkruhPanel
      subject="Management" subjectId="mng" number={4} title="Rozhodování + distribuce moci" subtitle="Hierarchie x Collective Wisdom / French-Raven / Org. struktury" color={VSE.ffu}
      questionText="Rozhodování (Hierarchie × collective wisdom) a distribuce moci"
      questionDesc="Popiš oba přístupy. Vysvětli zdroje moci (Weber, French-Raven). Moderní org. struktury. Identifikuj v PS, doporuč modernější variantu."
      sloz={3} roz={3} freq={3}
      examStrategy={examStrategy4}
      studySections={studySections4}
      flashcards={flashcards4}
      quiz={quiz4}
      praxe={praxe4}
      examQuestions={examQuestions4}
      podcast={podcast4}
    />
  );
}

function OkruhyTab({ navTarget, clearNavTarget }) {
  const t = useTheme();
  const [selectedSubject, setSelectedSubject] = useState(null); // null = Dashboard
  const [selectedOkruh, setSelectedOkruh] = useState(null);

  // Reaguje na search navigation
  useEffect(() => {
    if (navTarget) {
      setSelectedSubject(navTarget.subjectId);
      setSelectedOkruh(navTarget.okruhN);
      if (clearNavTarget) clearNavTarget();
    }
  }, [navTarget]);

  // Pokud uživatel vybere předmět, opustí dashboard
  const handleSelectSubject = (subjectId) => {
    setSelectedSubject(subjectId);
    setSelectedOkruh(null);
  };

  // Watchlist click — okruh i subject najednou
  const handleSelectFromDashboard = (subjectId, okruhN) => {
    setSelectedSubject(subjectId);
    setSelectedOkruh(okruhN);
  };

  // Pokud nic není vybráno, zobraz Dashboard
  if (selectedSubject === null) {
    return <Dashboard onSelectOkruh={handleSelectFromDashboard} />;
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 105px)" }}>
      <OkruhySidebar
        selectedSubject={selectedSubject}
        setSelectedSubject={handleSelectSubject}
        selectedOkruh={selectedOkruh}
        setSelectedOkruh={setSelectedOkruh}
        onBackToDashboard={() => { setSelectedSubject(null); setSelectedOkruh(null); }}
      />
      <OkruhContent subjectId={selectedSubject} okruhN={selectedOkruh} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PLACEHOLDER TABS
   ════════════════════════════════════════════════════════ */
function KomunitaTab() {
  const t = useTheme();
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 32px", textAlign: "center" }}>
      <BombikEmpty mood="think" size={120} caption="Komunita se rodí." sub="Prostor pro studenty — tipy, otázky, sdílení materiálů. Brzy." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 36, maxWidth: 540, margin: "36px auto 0" }}>
        {[
          { label: "Diskuze", desc: "Obecné dotazy a tipy", icon: "people" },
          { label: "Studijní skupiny", desc: "Najdi svou skupinu", icon: "hive" },
          { label: "Materiály", desc: "Sdílení zdrojů", icon: "book" },
        ].map((item, i) => (
          <div key={i} style={{ ...cardStyle(t), padding: 18, textAlign: "left" }}>
            <div style={{ marginBottom: 10 }}>
              <Icon name={item.icon} size={18} color={t.text} />
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text, fontFamily: fontSans, marginBottom: 4, letterSpacing: "-0.01em" }}>{item.label}</div>
            <div style={{ fontSize: 12, color: t.textMuted, fontFamily: fontSans, lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KalendarTab() {
  const t = useTheme();
  const dayLabels = ["Po","Út","St","Čt","Pá","So","Ne"];
  // Generate April 2026 calendar
  const days = [];
  // April 2026 starts on Wednesday (index 2)
  for (let i = 0; i < 2; i++) days.push(null); // empty slots for Mon, Tue
  for (let d = 1; d <= 30; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);

  const events = {
    16: { text: "Dnes", color: VSE.primary },
    28: { text: "Deadline přihlášky", color: VSE.danger },
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontFamily: fontSans, color: t.text, margin: 0, fontWeight: 600, letterSpacing: "-0.025em" }}>Duben 2026</h2>
        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, letterSpacing: "1.4px", textTransform: "uppercase" }}>Prague time</span>
      </div>

      <div style={{ ...cardStyle(t), padding: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0, marginBottom: 4, borderBottom: `1px solid ${t.borderSoft}` }}>
          {dayLabels.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, padding: "8px 0", letterSpacing: "1.4px", textTransform: "uppercase" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0 }}>
          {days.map((d, i) => {
            const ev = d ? events[d] : null;
            const isToday = d === 16;
            return (
              <div key={i} style={{
                minHeight: 76, padding: 10, borderRight: ((i+1) % 7 !== 0) ? `1px solid ${t.borderSoft}` : "none",
                borderBottom: `1px solid ${t.borderSoft}`,
                background: isToday ? t.surfaceMuted : "transparent",
              }}>
                {d && (
                  <>
                    <div style={{
                      fontSize: 13, fontWeight: isToday ? 600 : 400, fontFamily: fontSans,
                      width: 24, height: 24, borderRadius: 99,
                      background: isToday ? t.text : "transparent",
                      color: isToday ? t.bg : t.text,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{d}</div>
                    {ev && <div style={{ fontSize: 10, color: t.textMuted, fontFamily: fontMono, fontWeight: 500, marginTop: 6, letterSpacing: "0.4px" }}>{ev.text}</div>}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 28, ...cardStyle(t), padding: 22 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", marginBottom: 14, textTransform: "uppercase" }}>Důležité termíny</div>
        {[
          { date: "28. 4. 2026", label: "Deadline přihlášky na státnice" },
          { date: "2. 6. 2026", label: "Začátek zkouškového období" },
          { date: "Červen 2026", label: "Státnice — přesný termín TBD" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${t.borderSoft}` : "none" }}>
            <div style={{ fontSize: 12, fontFamily: fontMono, color: t.text, fontWeight: 600, minWidth: 110, letterSpacing: "0.4px" }}>{item.date}</div>
            <div style={{ fontSize: 14, fontFamily: fontSans, color: t.text }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutTab() {
  const t = useTheme();
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "72px 32px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 18 }}>
        <Bombik mood="happy" size={120} />
        <div>
          <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase", marginBottom: 8 }}>O Bombikovi</div>
          <h2 style={{ fontSize: 40, fontFamily: fontSans, color: t.text, margin: "0 0 10px", fontWeight: 600, letterSpacing: "-0.025em" }}>Směna v Lokalu, když ti hrabě ze státnic.</h2>
          <p style={{ color: t.textMuted, fontSize: 15, fontFamily: fontSans, lineHeight: 1.6, maxWidth: 520, margin: "0 auto", textWrap: "pretty" }}>
            Komplexní studijní platforma pro přípravu na inženýrské oborové státnice na VŠE. Bombik tě proveďe, než teď.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 40 }}>
        {[
          { label: "8 předmětů", desc: "Management, Leadership, HR, Marketing, Strategie, Rozhodování, Inovace, Finance" },
          { label: `${TOTAL} okruhů`, desc: "Kompletní pokrytí všech zkouškových otázek" },
          { label: "Kartičky a kvízy", desc: "Testuj se s okamžitým feedbackem" },
          { label: "Tažené otázky", desc: "Reálné zkušenosti z komisí s tipy na zkoušející" },
        ].map((item, i) => (
          <div key={i} style={{ ...cardStyle(t), padding: 22 }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: t.text, fontFamily: fontSans, marginBottom: 6, letterSpacing: "-0.02em" }}>{item.label}</div>
            <div style={{ fontSize: 13, color: t.textMuted, fontFamily: fontSans, lineHeight: 1.55, textWrap: "pretty" }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, ...cardStyle(t, "muted"), padding: 22 }}>
        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", marginBottom: 8, textTransform: "uppercase" }}>Kontakt</div>
        <div style={{ fontSize: 14, color: t.text, fontFamily: fontSans, lineHeight: 1.65 }}>
          Máš otázku nebo návrh? Napiš na <span style={{ fontWeight: 600 }}>josef@vse-statnice.cz</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   BACKGROUND
   ════════════════════════════════════════════════════════ */
function GradientMesh({ themeMode }) {
  // Bombík je plochý — žádné mesh gradienty.
  return null;
}

/* ════════════════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════════════════ */




/* ════════════════════════════════════════════════════════
   DASHBOARD — landing page
   ════════════════════════════════════════════════════════ */

function Dashboard({ onSelectOkruh }) {
  const t = useTheme();
  const [streak, setStreak] = useState(getStreakStatus());
  const [watchlist, setWatchlist] = useState(loadWatchlist());

  useEffect(() => {
    const handler = () => {
      setStreak(getStreakStatus());
      setWatchlist(loadWatchlist());
    };
    window.addEventListener("streak-updated", handler);
    window.addEventListener("watchlist-updated", handler);
    return () => {
      window.removeEventListener("streak-updated", handler);
      window.removeEventListener("watchlist-updated", handler);
    };
  }, []);

  // Spočítej progress per subject
  const progressBySubject = SUBJECTS.map(subj => {
    const okruhy = subj.okruhy;
    const done = okruhy.filter(o => o.status === "done").length;
    return {
      ...subj,
      done,
      total: okruhy.length,
      pct: okruhy.length > 0 ? Math.round((done / okruhy.length) * 100) : 0,
    };
  });

  // Spočítej best quiz score napříč management okruhy (heuristicky z localStorage)
  let totalQuizScore = 0;
  let totalQuizMax = 0;
  let quizzesCompleted = 0;
  let totalCardsKnown = 0;
  let totalCardsAvailable = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("nabombuj_quiz_")) {
        const data = JSON.parse(localStorage.getItem(key));
        if (data && data.score !== undefined) {
          totalQuizScore += data.score;
          totalQuizMax += data.total;
          quizzesCompleted++;
        }
      }
      if (key && key.startsWith("nabombuj_flashcards_")) {
        const arr = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(arr)) totalCardsKnown += arr.length;
      }
    }
  } catch {}

  const streakMsg = {
    today: "Bombík hoří. Pokračuj zítra.",
    yesterday: "Zapal bombíka ještě dnes — jinak streak skončí.",
    freeze_available: "Freeze tě zachrání — udělej dnes 1 aktivitu.",
    broken: "Streak skončil. Začni novou sérii dnes.",
    none: "Začni svou bombometnou sérii — 1 aktivita denně.",
  }[streak.status] || "";

  return (
    <div style={{ flex: 1, overflowY: "auto", height: "calc(100vh - 105px)", padding: "40px 32px 60px", background: t.bg }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {/* Hero — Bombík + welcome */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, marginBottom: 36, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 480px", minWidth: 0 }}>
            <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase", marginBottom: 12 }}>Nabombuj státnice</div>
            <h1 style={{ margin: "0 0 10px", fontSize: 56, fontWeight: 600, fontFamily: fontSans, color: t.text, letterSpacing: "-0.03em", lineHeight: 1.02, textWrap: "balance" }}>
              Ahoj. Bombík tě provede.
            </h1>
            <p style={{ margin: 0, color: t.textMuted, fontSize: 16, fontFamily: fontSans, lineHeight: 1.5, textWrap: "pretty", maxWidth: 540 }}>
              Tvůj přehled — pokrok, streak, uložené sekce a co studovat dál. Bez stresu, bez panik. Jen postupně.
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Bombik mood={streak.status === "today" ? "happy" : streak.status === "broken" ? "sad" : "think"} size={140} />
          </div>
        </div>

        {/* Top row: Streak + Quiz + Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          <div style={{ ...cardStyle(t), padding: 24 }}>
            <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase", marginBottom: 12 }}>Streak</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 64, fontWeight: 600, color: t.text, fontFamily: fontSans, lineHeight: 0.9, letterSpacing: "-0.04em" }}>{streak.current}</div>
              <div style={{ fontSize: 14, color: t.textMuted, fontFamily: fontSans }}>dní v řadě</div>
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11.5, color: t.textMuted, fontFamily: fontMono, letterSpacing: "0.4px", marginBottom: 12 }}>
              <span>best <b style={{ color: t.text }}>{streak.best}</b></span>
              <span>·</span>
              <span>{streak.freezes} freeze{streak.freezes !== 1 ? "y" : ""}</span>
            </div>
            <div style={{ fontSize: 13, color: t.text, fontFamily: fontSans, lineHeight: 1.5, textWrap: "pretty" }}>
              {streakMsg}
            </div>
          </div>

          <div style={{ ...cardStyle(t), padding: 24 }}>
            <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase", marginBottom: 12 }}>Quiz score</div>
            <div style={{ fontSize: 56, fontWeight: 600, color: t.text, fontFamily: fontSans, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
              {totalQuizMax > 0 ? Math.round((totalQuizScore / totalQuizMax) * 100) : 0}<span style={{ fontSize: 28, color: t.textMuted, fontWeight: 500 }}>%</span>
            </div>
            <div style={{ fontSize: 12, color: t.textMuted, fontFamily: fontMono, marginTop: 10, letterSpacing: "0.4px" }}>
              {totalQuizScore}/{totalQuizMax} · {quizzesCompleted} dokončen{quizzesCompleted === 1 ? "" : "ých"}
            </div>
          </div>

          <div style={{ ...cardStyle(t), padding: 24 }}>
            <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase", marginBottom: 12 }}>Kartičky</div>
            <div style={{ fontSize: 56, fontWeight: 600, color: t.text, fontFamily: fontSans, lineHeight: 0.9, letterSpacing: "-0.03em" }}>{totalCardsKnown}</div>
            <div style={{ fontSize: 12, color: t.textMuted, fontFamily: fontMono, marginTop: 10, letterSpacing: "0.4px" }}>označeno „umím"</div>
          </div>
        </div>

        {/* Předměty progress */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: t.text, fontFamily: fontSans, marginBottom: 14, letterSpacing: "-0.02em" }}>Pokrok per předmět</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
            {progressBySubject.map(subj => (
              <div key={subj.id} onClick={() => onSelectOkruh && onSelectOkruh(subj.id, null)} style={{
                ...cardStyle(t), padding: 18, cursor: "pointer", transition: "all 0.15s",
              }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.text; }}
                 onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text, fontFamily: fontSans, letterSpacing: "-0.01em" }}>{subj.name}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, letterSpacing: "0.4px" }}>{subj.done}/{subj.total}</div>
                </div>
                <div style={{ height: 4, background: t.borderSoft, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${subj.pct}%`, background: t.text, transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, marginTop: 8, letterSpacing: "0.4px" }}>{subj.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Watchlist */}
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: t.text, fontFamily: fontSans, marginBottom: 14, letterSpacing: "-0.02em", display: "flex", alignItems: "baseline", gap: 10 }}>
            Watchlist
            <span style={{ fontSize: 13, color: t.textMuted, fontFamily: fontMono, fontWeight: 500, letterSpacing: "0.4px" }}>{watchlist.length}</span>
          </h2>
          {watchlist.length === 0 ? (
            <div style={{ ...cardStyle(t, "muted"), padding: 32, textAlign: "center" }}>
              <div style={{ marginBottom: 12 }}>
                <Bombik mood="think" size={64} />
              </div>
              <div style={{ color: t.text, fontSize: 14, fontFamily: fontSans, lineHeight: 1.55, textWrap: "pretty", maxWidth: 420, margin: "0 auto" }}>
                Zatím nic neuloženo. V sekcích studia klikni na <b>Uložit</b> pro označení důležitých témat.
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 8 }}>
              {watchlist.slice().reverse().map((w, i) => (
                <div key={i} onClick={() => onSelectOkruh && onSelectOkruh(w.subjectId, w.okruhN)} style={{
                  ...cardStyle(t), padding: "14px 16px", cursor: "pointer",
                  borderLeft: `3px solid ${t.cta}`, transition: "all 0.15s",
                }} onMouseEnter={(e) => { e.currentTarget.style.background = t.surfaceMuted; }}
                   onMouseLeave={(e) => { e.currentTarget.style.background = t.surface; }}>
                  <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, fontWeight: 600, letterSpacing: "1.4px", marginBottom: 5, textTransform: "uppercase" }}>
                    {w.subjectLabel || w.subjectId} · Okruh {String(w.okruhN).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text, fontFamily: fontSans, lineHeight: 1.35, letterSpacing: "-0.01em" }}>{w.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   STREAK SYSTEM — Duolingo-style s bombičkou 💣
   ════════════════════════════════════════════════════════ */

const STREAK_KEY = "nabombuj_streak";

function loadStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { current: 0, best: 0, lastDate: null, freezes: 0, lastFreezeAdded: null };
    return JSON.parse(raw);
  } catch { return { current: 0, best: 0, lastDate: null, freezes: 0, lastFreezeAdded: null }; }
}

function saveStreak(s) {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(s)); } catch {}
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function diffDays(d1, d2) {
  // d1, d2 jsou stringy YYYY-MM-DD
  const t1 = new Date(d1).getTime();
  const t2 = new Date(d2).getTime();
  return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
}

// Volá se po dokončení activity (sekce/quiz/kartička/podcast)
function recordActivity() {
  const s = loadStreak();
  const today = todayStr();

  if (s.lastDate === today) return s; // už dnes

  // Add freeze každých 7 dní studia
  if (!s.lastFreezeAdded || diffDays(s.lastFreezeAdded, today) >= 7) {
    if (s.freezes < 2) {
      s.freezes += 1;
      s.lastFreezeAdded = today;
    }
  }

  if (!s.lastDate) {
    s.current = 1;
  } else {
    const gap = diffDays(s.lastDate, today);
    if (gap === 1) {
      s.current += 1;
    } else if (gap === 2 && s.freezes > 0) {
      s.freezes -= 1;
      s.current += 1;
    } else {
      s.current = 1;
    }
  }

  if (s.current > s.best) s.best = s.current;
  s.lastDate = today;
  saveStreak(s);
  return s;
}

// Streak status pro zobrazení (bez záznamu activity)
function getStreakStatus() {
  const s = loadStreak();
  const today = todayStr();
  if (!s.lastDate) return { ...s, status: "none" };
  const gap = diffDays(s.lastDate, today);
  if (gap === 0) return { ...s, status: "today" };
  if (gap === 1) return { ...s, status: "yesterday" }; // dnes ještě nepokračoval
  if (gap === 2 && s.freezes > 0) return { ...s, status: "freeze_available" };
  return { ...s, status: "broken" };
}

// 💣 Bombička ikona — animace zapálení když status === "today"
function BombIcon({ size = 20, lit = false }) {
  return (
    <span style={{
      display: "inline-block", fontSize: size,
      filter: lit ? `drop-shadow(0 0 6px #FFA500)` : "grayscale(0.7) opacity(0.55)",
      transition: "filter 0.4s",
    }}>
      {lit ? "💣" : "💣"}
    </span>
  );
}

function StreakBadge({ onClick }) {
  const t = useTheme();
  const [streak, setStreak] = useState(getStreakStatus());

  useEffect(() => {
    const handler = () => setStreak(getStreakStatus());
    window.addEventListener("streak-updated", handler);
    // Refresh při focusu (např. když se vrátíš následující den)
    window.addEventListener("focus", handler);
    return () => {
      window.removeEventListener("streak-updated", handler);
      window.removeEventListener("focus", handler);
    };
  }, []);

  const lit = streak.status === "today";
  const broken = streak.status === "broken";

  return (
    <button onClick={onClick} title="Streak — klikni pro detail" style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "5px 10px", borderRadius: 8,
      background: lit ? `${VSE.warning}15` : t.surfaceHover,
      border: `1px solid ${lit ? VSE.warning + "40" : t.border}`,
      cursor: "pointer", color: t.text, fontSize: 12, fontFamily: fontMono, fontWeight: 700,
      transition: "all 0.2s",
    }}>
      <BombIcon size={16} lit={lit} />
      <span style={{ color: lit ? VSE.warning : (broken ? VSE.danger : t.textMuted) }}>{streak.current}</span>
    </button>
  );
}

function StreakModal({ open, onClose }) {
  const t = useTheme();
  const s = open ? getStreakStatus() : null;

  if (!open || !s) return null;

  const titleByStatus = {
    today: "Dneska to klape.",
    yesterday: "Zapal Bombíka ještě dnes.",
    freeze_available: "Freeze ti zachrání den.",
    broken: "Streak skončil.",
    none: "Začni svou sérii.",
  };
  const subByStatus = {
    today: `Dnes jsi už cvičil. Bombík hoří dál.`,
    yesterday: `Včera jsi cvičil — pokud dnes neuděláš nic, streak se přeruší. Otevři kvíz, kartičku nebo podcast.`,
    freeze_available: `Vynechal jsi den, ale máš freeze (${s.freezes}). Použije se automaticky, jakmile dnes uděláš aktivitu.`,
    broken: `Tvoje série padla. Začni novou — stačí dnes 1 aktivita.`,
    none: `Stačí 1 aktivita denně — sekce studia, 1 kartička, 1 quiz nebo poslech podcastu.`,
  };

  const mood = s.status === "today" ? "happy" : s.status === "broken" ? "sad" : "think";

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15, 17, 22, 0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 460,
        background: t.surface, borderRadius: RADIUS.lg,
        border: `1px solid ${t.border}`, padding: 32,
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Bombik mood={mood} size={120} />
          <div style={{ fontSize: 72, fontWeight: 600, fontFamily: fontSans, color: t.text, lineHeight: 0.95, marginTop: 8, letterSpacing: "-0.04em" }}>{s.current}</div>
          <div style={{ fontSize: 10.5, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.6px", marginTop: 4, fontWeight: 600, textTransform: "uppercase" }}>dní v řadě</div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: t.text, fontFamily: fontSans, marginBottom: 8, letterSpacing: "-0.02em" }}>{titleByStatus[s.status]}</div>
          <div style={{ fontSize: 14, color: t.textMuted, fontFamily: fontSans, lineHeight: 1.55, textWrap: "pretty" }}>{subByStatus[s.status]}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginBottom: 18, border: `1px solid ${t.borderSoft}`, borderRadius: RADIUS.md, overflow: "hidden" }}>
          <div style={{ padding: 16, textAlign: "center", borderRight: `1px solid ${t.borderSoft}` }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: t.text, fontFamily: fontSans, letterSpacing: "-0.02em" }}>{s.best}</div>
            <div style={{ fontSize: 10, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.4px", marginTop: 4, textTransform: "uppercase", fontWeight: 600 }}>nejlepší</div>
          </div>
          <div style={{ padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: t.text, fontFamily: fontSans, letterSpacing: "-0.02em" }}>{s.freezes}</div>
            <div style={{ fontSize: 10, fontFamily: fontMono, color: t.textMuted, letterSpacing: "1.4px", marginTop: 4, textTransform: "uppercase", fontWeight: 600 }}>freezů</div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: t.textMuted, fontFamily: fontSans, lineHeight: 1.6, padding: "12px 14px", background: t.surfaceMuted, borderRadius: RADIUS.sm, marginBottom: 16, textWrap: "pretty" }}>
          <b style={{ color: t.text }}>Jak to funguje.</b> 1 aktivita denně = Bombík hoří. 1 freeze automaticky každých 7 dní (max 2). Dva dny v kuse vynecháš → streak končí.
        </div>

        <button onClick={onClose} style={{
          width: "100%", padding: "13px 16px", borderRadius: RADIUS.pill,
          border: "none", background: t.text, color: t.bg,
          cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: fontSans, letterSpacing: "-0.01em",
        }}>Jdu na to</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   WATCHLIST — markování důležitých sekcí
   ════════════════════════════════════════════════════════ */

const WATCHLIST_KEY = "nabombuj_watchlist";

function loadWatchlist() {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveWatchlist(list) {
  try { localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list)); } catch {}
}

function isWatched(subjectId, okruhN, sectionId) {
  return loadWatchlist().some(w => w.subjectId === subjectId && w.okruhN === okruhN && w.sectionId === sectionId);
}

function toggleWatch(subjectId, okruhN, sectionId, sectionTitle, subjectLabel) {
  const list = loadWatchlist();
  const idx = list.findIndex(w => w.subjectId === subjectId && w.okruhN === okruhN && w.sectionId === sectionId);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push({ subjectId, okruhN, sectionId, title: sectionTitle, subjectLabel, addedAt: new Date().toISOString() });
  }
  saveWatchlist(list);
  window.dispatchEvent(new Event("watchlist-updated"));
  return idx < 0; // true = right add
}

function WatchToggleButton({ subjectId, okruhN, sectionId, sectionTitle, subjectLabel }) {
  const t = useTheme();
  const [watched, setWatched] = useState(isWatched(subjectId, okruhN, sectionId));

  const handle = (e) => {
    e.stopPropagation();
    const newState = toggleWatch(subjectId, okruhN, sectionId, sectionTitle, subjectLabel);
    setWatched(newState);
  };

  return (
    <button onClick={handle} title={watched ? "Odebrat z watchlistu" : "Označit pro pozdější opakování"} style={{
      padding: "4px 10px", borderRadius: 8,
      border: `1px solid ${watched ? VSE.warning + "60" : t.border}`,
      background: watched ? `${VSE.warning}20` : "transparent",
      color: watched ? VSE.warning : t.textMuted,
      cursor: "pointer", fontSize: 11, fontFamily: fontMono, fontWeight: 700,
      letterSpacing: "0.5px", whiteSpace: "nowrap", transition: "all 0.15s",
    }}>
      {watched ? "★ ULOŽENO" : "☆ ULOŽIT"}
    </button>
  );
}

/* ════════════════════════════════════════════════════════
   CHEAT SHEET — okruh 1 (A4 print)
   ════════════════════════════════════════════════════════ */

function CheatSheet1() {
  return (
    <>
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .cheatsheet-no-print { display: none !important; }
          .cheatsheet-page { box-shadow: none !important; margin: 0 !important; }
        }
        .cheatsheet-page {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #1a1a1a;
        }
        .cs-headline { color: #A82A5F; font-weight: 800; }
        .cs-subhead { color: #5A2F5F; font-weight: 700; }
        .cs-tag { color: #5FA4CA; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
        .cs-warn { color: #E06D1E; font-weight: 700; }
      `}</style>
      <div className="cheatsheet-no-print" style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#fff", borderBottom: "1px solid #ddd",
        padding: "12px 20px", display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>📄 Cheat sheet — Okruh 1</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => window.print()} style={{
            padding: "8px 16px", borderRadius: 8, border: "none",
            background: "#A82A5F", color: "#fff",
            cursor: "pointer", fontWeight: 600, fontSize: 13,
          }}>🖨️ Vytisknout / Uložit jako PDF</button>
          <button onClick={() => window.history.back()} style={{
            padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd",
            background: "#fff", color: "#666",
            cursor: "pointer", fontWeight: 600, fontSize: 13,
          }}>← Zpět</button>
        </div>
      </div>

      <div className="cheatsheet-page" style={{
        width: "210mm", minHeight: "297mm", padding: "10mm 12mm",
        margin: "20px auto", background: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        boxSizing: "border-box", fontSize: 9.5, lineHeight: 1.45,
      }}>
        {/* Header */}
        <div style={{ borderBottom: "2px solid #A82A5F", paddingBottom: 6, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h1 style={{ margin: 0, fontSize: 18, color: "#A82A5F", fontWeight: 800 }}>OKRUH 1 — Současné přístupy k managementu</h1>
            <span style={{ fontSize: 9, color: "#888", fontFamily: "JetBrains Mono, monospace" }}>nabombuj.cz</span>
          </div>
          <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>
            Definice managementu · Birkinshawovy 4 dimenze · Business model × Management model · Inovace v managementu
          </div>
        </div>

        {/* 3-sloupcový grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>

          {/* === SLOUPEC 1: 4 ZÁKLADNÍ POJMY === */}
          <div style={{ border: "1px solid #ddd", borderRadius: 4, padding: "6px 8px" }}>
            <div className="cs-tag" style={{ fontSize: 8, marginBottom: 5, letterSpacing: 1 }}>4 ZÁKLADNÍ POJMY</div>

            <div style={{ marginBottom: 6 }}>
              <div className="cs-subhead" style={{ fontSize: 10 }}>Management</div>
              <div style={{ fontSize: 8.5 }}>Proces plánování, organizování, vedení a kontroly k dosažení cílů. <b>3 chápání:</b> činnost / lidé / disciplína.</div>
            </div>

            <div style={{ marginBottom: 6 }}>
              <div className="cs-subhead" style={{ fontSize: 10 }}>Business Model (BM)</div>
              <div style={{ fontSize: 8.5 }}><b>Co</b> firma dělá pro zákazníka. Logika tvorby a zachycení hodnoty. → BMC, Lean Canvas.</div>
            </div>

            <div style={{ marginBottom: 6 }}>
              <div className="cs-subhead" style={{ fontSize: 10 }}>Management Model (MM)</div>
              <div style={{ fontSize: 8.5 }}><b>Jak</b> firma řídí. Volby v 4 dimenzích podle Birkinshawa.</div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div className="cs-subhead" style={{ fontSize: 10 }}>BMC × Lean Canvas</div>
              <div style={{ fontSize: 8.5 }}>
                <b>BMC</b> (Osterwalder, 9 bloků) — etablované firmy.<br />
                <b>Lean</b> (Maurya, 9 bloků) — startupy, problém + řešení místo Key Partners.
              </div>
            </div>

            <div className="cs-tag" style={{ fontSize: 8, marginTop: 8, marginBottom: 4, letterSpacing: 1 }}>4 FÁZE VÝVOJE MNG</div>
            <ol style={{ margin: 0, paddingLeft: 14, fontSize: 8.5 }}>
              <li><b>Klasický</b> (Taylor) — vědecké řízení, časové studie</li>
              <li><b>Paternalistický</b> (Baťa) — péče o zaměstnance + tvrdá disciplína</li>
              <li><b>Lidské vztahy</b> (Mayo) — Hawthorne, motivace</li>
              <li><b>Humanistický</b> (Drucker) — znalostní pracovníci, smysl</li>
            </ol>
          </div>

          {/* === SLOUPEC 2: BIRKINSHAW === */}
          <div style={{ border: "1px solid #ddd", borderRadius: 4, padding: "6px 8px" }}>
            <div className="cs-tag" style={{ fontSize: 8, marginBottom: 5, letterSpacing: 1 }}>BIRKINSHAW — 4 DIMENZE MM</div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8 }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ padding: 3, border: "1px solid #ddd", textAlign: "left" }}>Dimenze</th>
                  <th style={{ padding: 3, border: "1px solid #ddd", textAlign: "left" }}>Tradiční</th>
                  <th style={{ padding: 3, border: "1px solid #ddd", textAlign: "left" }}>Alternativní</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}><b>Koordinace</b></td>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}>Byrokracie</td>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}>Emergence</td>
                </tr>
                <tr>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}><b>Rozhodování</b></td>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}>Hierarchie</td>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}>Kolektiv. moudrost</td>
                </tr>
                <tr>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}><b>Cíle (ends)</b></td>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}>Alignment (tight)</td>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}>Obliquity (loose)</td>
                </tr>
                <tr>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}><b>Motivace</b></td>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}>Vnější (peníze)</td>
                  <td style={{ padding: 3, border: "1px solid #ddd" }}>Vnitřní (smysl)</td>
                </tr>
              </tbody>
            </table>

            <div className="cs-tag" style={{ fontSize: 8, marginTop: 8, marginBottom: 4, letterSpacing: 1 }}>4 TYPY MODELŮ (means × ends)</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8 }}>
              <tbody>
                <tr>
                  <td style={{ padding: 3, border: "1px solid #ddd", background: "#fff8e1" }}>
                    <b>PLANNING</b><br />
                    <span style={{ fontSize: 7.5 }}>tight means + tight ends</span><br />
                    <span style={{ fontSize: 7.5, color: "#666" }}>Toyota, McDonald's</span>
                  </td>
                  <td style={{ padding: 3, border: "1px solid #ddd", background: "#fff0e1" }}>
                    <b>QUEST</b><br />
                    <span style={{ fontSize: 7.5 }}>loose means + tight ends</span><br />
                    <span style={{ fontSize: 7.5, color: "#666" }}>Tesla (mise: Mars)</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: 3, border: "1px solid #ddd", background: "#e1f5e1" }}>
                    <b>SCIENCE</b><br />
                    <span style={{ fontSize: 7.5 }}>tight means + loose ends</span><br />
                    <span style={{ fontSize: 7.5, color: "#666" }}>Pfizer R&D, MIT</span>
                  </td>
                  <td style={{ padding: 3, border: "1px solid #ddd", background: "#e1f0fa" }}>
                    <b>DISCOVERY</b><br />
                    <span style={{ fontSize: 7.5 }}>loose means + loose ends</span><br />
                    <span style={{ fontSize: 7.5, color: "#666" }}>Google 20 %, startupy</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ fontSize: 7.5, color: "#666", marginTop: 4, fontStyle: "italic" }}>
              <b>Means</b> = jak (procesy/prostředky). <b>Ends</b> = co (cíle).
            </div>
          </div>

          {/* === SLOUPEC 3: INOVACE + GASSMANN === */}
          <div style={{ border: "1px solid #ddd", borderRadius: 4, padding: "6px 8px" }}>
            <div className="cs-tag" style={{ fontSize: 8, marginBottom: 5, letterSpacing: 1 }}>INOVATION PYRAMID (HAMEL)</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ background: "#A82A5F", color: "#fff", padding: "4px 8px", borderRadius: 3, fontSize: 8.5 }}>
                <b>1. Manažerská</b> — KV 10+ let<br />
                <span style={{ fontSize: 7.5 }}>Toyota Production · Google free time</span>
              </div>
              <div style={{ background: "#5A2F5F", color: "#fff", padding: "4px 8px", borderRadius: 3, fontSize: 8.5 }}>
                <b>2. Strategická</b> — KV 3-5 let<br />
                <span style={{ fontSize: 7.5 }}>Apple iPhone, Netflix streaming</span>
              </div>
              <div style={{ background: "#E06D1E", color: "#fff", padding: "4px 8px", borderRadius: 3, fontSize: 8.5 }}>
                <b>3. Produktová</b> — KV 1-2 roky<br />
                <span style={{ fontSize: 7.5 }}>Nový iPhone model, nový BMW</span>
              </div>
              <div style={{ background: "#1E938D", color: "#fff", padding: "4px 8px", borderRadius: 3, fontSize: 8.5 }}>
                <b>4. Operační</b> — KV {`<`} 1 rok<br />
                <span style={{ fontSize: 7.5 }}>Optimalizace logistiky, nová verze SW</span>
              </div>
            </div>

            <div style={{ fontSize: 7.5, color: "#666", marginTop: 4, fontStyle: "italic" }}>
              Manažerská inovace = nejsilnější + nejtěžší napodobit
            </div>

            <div className="cs-tag" style={{ fontSize: 8, marginTop: 8, marginBottom: 4, letterSpacing: 1 }}>GASSMANN — 4 OTÁZKY (4W)</div>
            <ol style={{ margin: 0, paddingLeft: 14, fontSize: 8.5 }}>
              <li><b>WHO</b> — kdo je zákazník?</li>
              <li><b>WHAT</b> — co nabízíme (value prop)?</li>
              <li><b>HOW</b> — jak to vyrobíme?</li>
              <li><b>WHY</b> — proč to vydělává (revenue)?</li>
            </ol>
            <div style={{ fontSize: 7.5, color: "#666", marginTop: 4, fontStyle: "italic" }}>
              55 vzorových modelů (subscription, freemium, razor-blade, …)
            </div>

            <div className="cs-tag" style={{ fontSize: 8, marginTop: 8, marginBottom: 4, letterSpacing: 1 }}>5 VÝZEV (HAMEL)</div>
            <ol style={{ margin: 0, paddingLeft: 14, fontSize: 8.5 }}>
              <li>Demokracie nápadů</li>
              <li>Zesílení přitažlivosti</li>
              <li>Relokace zdrojů (rychle k novým příležitostem)</li>
              <li>Mentální modely (zbavit se dogmat)</li>
              <li>Příležitost pro všechny</li>
            </ol>
          </div>
        </div>

        {/* Spodní pruh: Komise tipy */}
        <div style={{ marginTop: 10, padding: "6px 10px", border: "1.5px solid #A82A5F", borderRadius: 4, background: "#fff5f8" }}>
          <div className="cs-warn" style={{ fontSize: 9, marginBottom: 3, letterSpacing: 1 }}>⚠️ NA ZKOUŠCE</div>
          <div style={{ fontSize: 8.5, lineHeight: 1.5 }}>
            <b>Vrbová/Tahal/Svobodová</b> — <i>vztáhni Birkinshaw 4 dimenze na případovku</i>. ·
            <b> Bočková/Nový/Kolouchová</b> — <i>výzvy 21. století + Birkinshaw</i>. ·
            <b> Heřman/Schovancová/Vávra</b> — <i>výzvy 21. století (globalizace, Průmysl 4.0, automatizace)</i>. ·
            <b style={{ color: "#A82A5F" }}> Vždy:</b> definuj BM × MM, najdi v PS, navrhni posun směrem k alternativnímu modelu (Discovery / emergence) pokud je odvětví turbulentní.
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 8, fontSize: 7.5, color: "#888", textAlign: "center", borderTop: "1px solid #eee", paddingTop: 4 }}>
          Nabombuj · Příprava na státnice VŠE · Vygenerováno z poznámek + tažených otázek 2025-26
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════
   SEARCH — globální vyhledávání napříč obsahem
   ════════════════════════════════════════════════════════ */

// Helper: rekurzivně extrahuje text z JSX node (pro studySections.content)
function extractText(node) {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join(" ");
  if (typeof node === "object" && node.props) {
    const children = node.props.children;
    return extractText(children);
  }
  return "";
}

// Build search index ze všech dat
function buildSearchIndex() {
  const idx = [];
  const subjects = {
    mng: {
      label: "Management",
      data: {
        1: { sections: typeof studySections1 !== "undefined" ? studySections1 : [], cards: typeof flashcards1 !== "undefined" ? flashcards1 : [], quiz: typeof quiz1 !== "undefined" ? quiz1 : [], exam: typeof examQuestions1 !== "undefined" ? examQuestions1 : [] },
        2: { sections: typeof studySections2 !== "undefined" ? studySections2 : [], cards: typeof flashcards2 !== "undefined" ? flashcards2 : [], quiz: typeof quiz2 !== "undefined" ? quiz2 : [], exam: typeof examQuestions2 !== "undefined" ? examQuestions2 : [] },
        3: { sections: typeof studySections3 !== "undefined" ? studySections3 : [], cards: typeof flashcards3 !== "undefined" ? flashcards3 : [], quiz: typeof quiz3 !== "undefined" ? quiz3 : [] },
        4: { sections: typeof studySections4 !== "undefined" ? studySections4 : [], cards: typeof flashcards4 !== "undefined" ? flashcards4 : [], quiz: typeof quiz4 !== "undefined" ? quiz4 : [] },
        5: { sections: typeof studySections5 !== "undefined" ? studySections5 : [], cards: typeof flashcards5 !== "undefined" ? flashcards5 : [], quiz: typeof quiz5 !== "undefined" ? quiz5 : [], exam: typeof examQuestions5 !== "undefined" ? examQuestions5 : [] },
        6: { sections: typeof studySections6 !== "undefined" ? studySections6 : [], cards: typeof flashcards6 !== "undefined" ? flashcards6 : [], quiz: typeof quiz6 !== "undefined" ? quiz6 : [], exam: typeof examQuestions6 !== "undefined" ? examQuestions6 : [] },
        7: { sections: typeof studySections7 !== "undefined" ? studySections7 : [], cards: typeof flashcards7 !== "undefined" ? flashcards7 : [], quiz: typeof quiz7 !== "undefined" ? quiz7 : [], exam: typeof examQuestions7 !== "undefined" ? examQuestions7 : [] },
        8: { sections: typeof studySections8 !== "undefined" ? studySections8 : [], cards: typeof flashcards8 !== "undefined" ? flashcards8 : [], quiz: typeof quiz8 !== "undefined" ? quiz8 : [], exam: typeof examQuestions8 !== "undefined" ? examQuestions8 : [] },
        9: { sections: typeof studySections9 !== "undefined" ? studySections9 : [], cards: typeof flashcards9 !== "undefined" ? flashcards9 : [], quiz: typeof quiz9 !== "undefined" ? quiz9 : [], exam: typeof examQuestions9 !== "undefined" ? examQuestions9 : [] },
        10: { sections: typeof studySections10 !== "undefined" ? studySections10 : [], cards: typeof flashcards10 !== "undefined" ? flashcards10 : [], quiz: typeof quiz10 !== "undefined" ? quiz10 : [], exam: typeof examQuestions10 !== "undefined" ? examQuestions10 : [] },
        11: { sections: typeof studySections11 !== "undefined" ? studySections11 : [], cards: typeof flashcards11 !== "undefined" ? flashcards11 : [], quiz: typeof quiz11 !== "undefined" ? quiz11 : [], exam: typeof examQuestions11 !== "undefined" ? examQuestions11 : [] },
      }
    }
  };

  Object.entries(subjects).forEach(([subjId, subj]) => {
    Object.entries(subj.data).forEach(([okruhN, okruh]) => {
      // Sekce — title + subtitle + extracted content text
      (okruh.sections || []).forEach((s) => {
        const contentText = extractText(s.content);
        idx.push({
          type: "section",
          typeLabel: "Studium",
          subject: subj.label,
          subjectId: subjId,
          okruhN: parseInt(okruhN),
          sectionId: s.id,
          title: s.title,
          subtitle: s.subtitle,
          searchText: `${s.title} ${s.subtitle || ""} ${contentText}`.toLowerCase(),
          color: s.color,
        });
      });
      // Flashcards
      (okruh.cards || []).forEach((c, i) => {
        idx.push({
          type: "flashcard",
          typeLabel: "Kartičky",
          subject: subj.label,
          subjectId: subjId,
          okruhN: parseInt(okruhN),
          title: c.term,
          subtitle: c.def,
          tag: c.tag,
          searchText: `${c.term} ${c.def} ${c.tag || ""}`.toLowerCase(),
        });
      });
      // Quiz
      (okruh.quiz || []).forEach((q, i) => {
        idx.push({
          type: "quiz",
          typeLabel: "Quiz",
          subject: subj.label,
          subjectId: subjId,
          okruhN: parseInt(okruhN),
          title: q.q,
          subtitle: q.opts ? `Správně: ${q.opts[q.correct]}` : "",
          searchText: `${q.q} ${(q.opts || []).join(" ")}`.toLowerCase(),
        });
      });
      // Tažené otázky
      (okruh.exam || []).forEach((e, i) => {
        idx.push({
          type: "exam",
          typeLabel: "Tažené",
          subject: subj.label,
          subjectId: subjId,
          okruhN: parseInt(okruhN),
          title: e.otazka,
          subtitle: e.komise,
          pozn: e.pozn,
          searchText: `${e.komise} ${e.otazka} ${e.pozn || ""}`.toLowerCase(),
        });
      });
    });
  });

  return idx;
}

// Highlight match
function HighlightMatch({ text, query }) {
  if (!query || !text) return <>{text}</>;
  const lower = String(text).toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.substring(0, idx)}
      <mark style={{ background: VSE.warning + "40", color: "inherit", padding: "0 2px", borderRadius: 3, fontWeight: 700 }}>{text.substring(idx, idx + q.length)}</mark>
      {text.substring(idx + q.length)}
    </>
  );
}

function SearchModal({ open, onClose, onNavigate }) {
  const t = useTheme();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const inputRef = useRef(null);
  const [searchIdx, setSearchIdx] = useState(null);

  // Lazy init searchIdx jen když se otevře
  useEffect(() => {
    if (open && !searchIdx) {
      try { setSearchIdx(buildSearchIndex()); } catch (e) { console.error("Search index build failed:", e); setSearchIdx([]); }
    }
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Cmd+K / Esc handling
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  let results = [];
  if (q && searchIdx) {
    results = searchIdx.filter(item => {
      if (filter !== "all" && item.type !== filter) return false;
      return item.searchText.includes(q);
    }).slice(0, 50);
  }

  const filterTabs = [
    { id: "all", label: "Vše" },
    { id: "section", label: "Studium" },
    { id: "flashcard", label: "Kartičky" },
    { id: "quiz", label: "Quiz" },
    { id: "exam", label: "Tažené" },
  ];

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      paddingTop: "10vh", paddingLeft: 16, paddingRight: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 720, maxHeight: "75vh",
        background: t.surfaceSolid, borderRadius: 16,
        border: `1px solid ${t.border}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Search input */}
        <div style={{ padding: "16px 18px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledej napříč okruhy, kartičkami, kvízem, taženými otázkami…"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: 16, color: t.text, fontFamily: fontSans,
            }}
          />
          <kbd style={{
            padding: "3px 8px", fontSize: 11, fontFamily: fontMono,
            background: t.surfaceHover, border: `1px solid ${t.border}`,
            borderRadius: 6, color: t.textMuted,
          }}>ESC</kbd>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 4, padding: "10px 14px", borderBottom: `1px solid ${t.border}`, overflowX: "auto" }}>
          {filterTabs.map(tab => (
            <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
              padding: "6px 12px", borderRadius: 8, fontSize: 11.5, fontWeight: 600, fontFamily: fontMono,
              border: `1px solid ${filter === tab.id ? VSE.primary : t.border}`,
              background: filter === tab.id ? `${VSE.primary}15` : "transparent",
              color: filter === tab.id ? VSE.primary : t.textMuted,
              cursor: "pointer", whiteSpace: "nowrap", letterSpacing: "0.5px",
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: "auto", padding: q ? "8px 12px" : "40px 20px" }}>
          {!q ? (
            <div style={{ textAlign: "center", color: t.textMuted, fontSize: 13, fontFamily: fontSans, lineHeight: 1.6 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: 6, color: t.text }}>Hledej v celém obsahu</div>
              <div>Definice, modely, jména, komise, tažené otázky, quiz odpovědi…</div>
              <div style={{ marginTop: 16, fontSize: 11, fontFamily: fontMono }}>
                Stisknout <kbd style={{ padding: "1px 6px", background: t.surfaceHover, border: `1px solid ${t.border}`, borderRadius: 4 }}>⌘K</kbd> kdykoli pro otevření
              </div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: "center", color: t.textMuted, fontSize: 13, padding: 40, fontFamily: fontSans }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🤷</div>
              Pro „<b style={{ color: t.text }}>{query}</b>” nic nenalezeno
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: t.textMuted, fontFamily: fontMono, padding: "4px 8px 8px", letterSpacing: "0.5px" }}>
                {results.length} VÝSLEDEK{results.length === 1 ? "" : results.length < 5 ? "Y" : "Ů"}
              </div>
              {results.map((r, i) => (
                <div key={i} onClick={() => { onNavigate(r); onClose(); }} style={{
                  padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                  marginBottom: 4, transition: "background 0.15s",
                  borderLeft: `3px solid ${typeColor(r.type)}`,
                }} onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceHover}
                   onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 9.5, fontFamily: fontMono, fontWeight: 700, color: typeColor(r.type), letterSpacing: "1px" }}>
                      {r.typeLabel.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 10, color: t.textMuted, fontFamily: fontMono }}>·</span>
                    <span style={{ fontSize: 10, color: t.textMuted, fontFamily: fontMono }}>
                      {r.subject} · Okruh {r.okruhN}
                    </span>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text, fontFamily: fontSans, marginBottom: 2, lineHeight: 1.4 }}>
                    <HighlightMatch text={r.title} query={q} />
                  </div>
                  {r.subtitle && (
                    <div style={{ fontSize: 11.5, color: t.textMuted, fontFamily: fontSans, lineHeight: 1.4 }}>
                      <HighlightMatch text={r.subtitle.length > 140 ? r.subtitle.substring(0, 140) + "…" : r.subtitle} query={q} />
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function typeColor(type) {
  switch (type) {
    case "section": return VSE.fis;
    case "flashcard": return VSE.fmv;
    case "quiz": return VSE.success;
    case "exam": return VSE.danger;
    default: return VSE.primary;
  }
}

// Floating search button
function SearchButton({ onClick }) {
  const t = useTheme();
  return (
    <button onClick={onClick} title="Hledat (⌘K / Ctrl+K)" style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 100,
      width: 52, height: 52, borderRadius: 26,
      background: VSE.primary, color: "#fff", border: "none",
      cursor: "pointer", fontSize: 22,
      boxShadow: `0 8px 24px ${VSE.primary}50`,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.2s",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
      🔍
    </button>
  );
}

function App() {
  const [themeMode, setThemeMode] = useState("light");
  const [activeTab, setActiveTab] = useState("okruhy");
  const [searchOpen, setSearchOpen] = useState(false);
  const [navTarget, setNavTarget] = useState(null);
  const t = THEMES[themeMode];

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleNavigate = (result) => {
    setActiveTab("okruhy");
    setNavTarget({ subjectId: result.subjectId, okruhN: result.okruhN, type: result.type, sectionId: result.sectionId });
  };

  return (
    <ThemeCtx.Provider value={t}>
      <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{
        minHeight: "100vh", background: t.bg, color: t.text, fontFamily: fontSans,
        transition: "background 0.3s, color 0.3s", position: "relative",
        "--text": t.text, "--text-muted": t.textMuted, "--text-subtle": t.textSubtle,
        "--border": t.border, "--surface": t.surface, "--bg": t.bg,
      }}>
        <GradientMesh themeMode={themeMode} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <SkoolNav activeTab={activeTab} setActiveTab={setActiveTab} themeMode={themeMode} setThemeMode={setThemeMode} />
          {activeTab === "okruhy" && <OkruhyTab navTarget={navTarget} clearNavTarget={() => setNavTarget(null)} />}
          {activeTab === "komunita" && <KomunitaTab />}
          {activeTab === "kalendar" && <KalendarTab />}
          {activeTab === "about" && <AboutTab />}
        </div>
        <SearchButton onClick={() => setSearchOpen(true)} />
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={handleNavigate} />
      </div>
    </ThemeCtx.Provider>
  );
}

export default App;
