/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "secondary": "#ffffff",
        "secondary-fixed": "var(--color-secondary-fixed)",
        "surface": "#10131b",
        "background": "#10131b",
        "surface-container": "#1c2027",
        "on-secondary-container": "#00716a",
        "error": "#ffb4ab",
        "inverse-surface": "#e0e2ed",
        "surface-dim": "#10131b",
        "primary-container": "var(--color-primary-container)",
        "outline": "#88929d",
        "surface-variant": "#31353d",
        "on-background": "#e0e2ed",
        "tertiary": "#c1c7d0",
        "on-error-container": "#ffdad6",
        "on-primary-fixed": "#001d31",
        "primary-fixed-dim": "#93ccff",
        "surface-container-low": "#181c23",
        "on-tertiary": "#2b3138",
        "on-error": "#690005",
        "on-secondary-fixed": "#00201d",
        "on-surface-variant": "#bec7d3",
        "tertiary-container": "#9ca2aa",
        "on-primary-fixed-variant": "#004b73",
        "error-container": "#93000a",
        "surface-container-lowest": "#0a0e16",
        "secondary-fixed-dim": "#00ded1",
        "on-primary-container": "#003c5d",
        "on-secondary-fixed-variant": "#00504b",
        "primary-fixed": "#cce5ff",
        "outline-variant": "#3e4851",
        "primary": "#93ccff",
        "on-surface": "#e0e2ed",
        "surface-container-highest": "#31353d",
        "inverse-on-surface": "#2d3039",
        "on-tertiary-fixed": "#161c22",
        "on-tertiary-fixed-variant": "#41474f",
        "surface-container-high": "#262a32",
        "surface-bright": "#363942",
        "on-tertiary-container": "#323940",
        "tertiary-fixed-dim": "#c1c7d0",
        "surface-tint": "#93ccff",
        "on-secondary": "#003733",
        "inverse-primary": "#006398",
        "secondary-container": "#00fdee",
        "on-primary": "#003351",
        "tertiary-fixed": "#dde3ec"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "section-gap": "8rem",
        "stack-md": "1rem",
        "stack-lg": "2rem",
        "container-max": "1440px",
        "margin-mobile": "1.5rem",
        "stack-sm": "0.5rem",
        "gutter": "2rem"
      },
      fontFamily: {
        "label-md": ["Outfit", "sans-serif"],
        "body-md": ["Outfit", "sans-serif"],
        "headline-md": ["Syne", "sans-serif"],
        "body-lg": ["Outfit", "sans-serif"],
        "headline-lg": ["Syne", "sans-serif"],
        "display-lg": ["Syne", "sans-serif"]
      },
      fontSize: {
        "label-md": ["14px", {"lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "600"}],
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-md": ["32px", {"lineHeight": "1.3", "fontWeight": "600"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-lg": ["48px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700"}],
        "display-lg": ["72px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "800"}]
      }
    }
  },
  plugins: [],
}
