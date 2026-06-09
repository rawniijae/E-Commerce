/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "#122036",
        "surface": "#1d2d46",
        "surface-dim": "#0e1a2c",
        "surface-bright": "#273b5a",
        "surface-container-lowest": "#0f1c30",
        "surface-container-low": "#15253e",
        "surface-container": "#1a2c49",
        "surface-container-high": "#223555",
        "surface-container-highest": "#2c4166",
        "on-surface": "#ffffff",
        "on-surface-variant": "#cbd5e1",
        "outline": "#64748b",
        "outline-variant": "#334155",
        "primary": "#60a5fa",
        "on-primary": "#0f172a",
        "primary-container": "#2563eb",
        "on-primary-container": "#ffffff",
        "secondary": "#38bdf8",
        "on-secondary": "#0f172a",
        "secondary-container": "#0284c7",
        "on-secondary-container": "#ffffff",
        "error": "#ef4444",
        "on-error": "#ffffff",
        "error-container": "#7f1d1d",
        "on-error-container": "#fca5a5",
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "sm": "0.25rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "base": "8px",
        "container-max": "1280px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "section-padding-desktop": "80px",
        "section-padding-mobile": "40px",
        "section-gap": "8rem",
        "stack-sm": "0.5rem",
        "stack-md": "1rem",
        "stack-lg": "2rem"
      },
      fontFamily: {
        "label-md": ["Geist", "monospace"],
        "label-sm": ["Geist", "monospace"],
        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "display-lg": ["Plus Jakarta Sans", "sans-serif"]
      },
      fontSize: {
        "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
        "headline-md": ["28px", {"lineHeight": "36px", "fontWeight": "600"}],
        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
      },
      boxShadow: {
        "card": "0 4px 20px 0 rgba(0, 0, 0, 0.04)",
        "card-hover": "0 8px 30px 0 rgba(0, 0, 0, 0.08)",
        "glass-inset": "inset 0 1px 0 0 rgba(255, 255, 255, 0.2)"
      }
    }
  },
  plugins: [],
}
