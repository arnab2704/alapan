/**
 * Shared design tokens for the Alapon design system.
 *
 * Palette intent: "Modern Bengal" - warm, premium and editorial rather than
 * festive-decorative or generic-SaaS. Exact hex values are the ShobdoShakti
 * V1 visual spec; the rest of the site (homepage, Discover, Theke Adda)
 * shares the same tokens so the whole product reads as one system rather
 * than the game having a bolted-on separate skin.
 */
module.exports = {
  colors: {
    // Terracotta/deep saffron - brand wordmark, subtle accents.
    alpona: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#ea580c",
      600: "#c2410c",
      700: "#9a3412",
      800: "#7c2d12",
      900: "#5c2109"
    },
    // Bengal red - primary interaction color (ShobdoShakti spec: #C62828 / deep #7A1F1F).
    sindoor: {
      50: "#fdf2f2",
      100: "#fbe3e3",
      200: "#f5c6c8",
      300: "#ea9ca1",
      400: "#dc6b74",
      500: "#bf2f3a",
      600: "#a02530",
      700: "#7d1d28",
      800: "#5e1620",
      900: "#3f0f16"
    },
    // Muted gold - secondary accents, score, celebratory moments (ShobdoShakti spec: #C89B3C).
    marigold: {
      50: "#fffbf0",
      100: "#fdf1cf",
      200: "#f9e29b",
      300: "#f0cb64",
      400: "#e5b445",
      500: "#d9a02b",
      600: "#b5811f",
      700: "#8a6119",
      800: "#6b4c19",
      900: "#563d18"
    },
    // Water lily green - success states (not specified by the game palette; kept distinct from red/gold so success never collides with error/score colors).
    shapla: {
      50: "#eefaf5",
      100: "#d7f3e7",
      200: "#aee6cf",
      300: "#79d3b0",
      400: "#41b98d",
      500: "#17795a",
      600: "#11624a",
      700: "#0d4d3b",
      800: "#0a3a2d",
      900: "#072820"
    },
    // Warm ivory backgrounds (ShobdoShakti spec: bg #FFF9F0, panel #FFFCF7, tile #F7EEDC, border #E7DDCB).
    cream: {
      50: "#fffaf2",
      100: "#fffdf8",
      200: "#f8eedd",
      300: "#eadfca"
    },
    // Warm neutrals for text (ShobdoShakti spec: text #202020, muted #756F68).
    ink: {
      50: "#f9f5f1",
      100: "#eee6de",
      200: "#ddd2c8",
      300: "#c0b3a8",
      400: "#8d8480",
      500: "#766d6a",
      600: "#4d4346",
      700: "#3a2f34",
      800: "#2a2126",
      900: "#1c1518"
    }
  },
  fontFamily: {
    bengali: ["var(--font-bengali)", "'Noto Sans Bengali'", "'Hind Siliguri'", "sans-serif"],
    bengaliDisplay: ["var(--font-bengali-display)", "'Noto Serif Bengali'", "'Noto Sans Bengali'", "serif"],
    latin: ["var(--font-latin)", "'Inter'", "system-ui", "sans-serif"]
  },
  borderRadius: {
    alpona: "1.25rem"
  }
};
