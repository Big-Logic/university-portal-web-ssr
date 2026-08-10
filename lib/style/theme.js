// Ported 1:1 from basecourse-design-system.html's CSS custom
// properties. If a value changes, change it there first, then here --
// that document is the source of truth, this is its code form.
export const theme = {
  color: {
    ink900: "#1A2029",
    ink700: "#3D4653",
    ink500: "#6B7280",
    ink300: "#A3AAB5",
    ink150: "#D7DBE1",
    ink100: "#EEF0F3",
    ink50: "#F7F8FA",
    white: "#FFFFFF",

    blue700: "#2C56B8",
    blue600: "#3E6FE0",
    blue100: "#E4ECFC",
    blue50: "#F2F6FD",

    green600: "#2F8F5B",
    green100: "#E6F5EC",
    amber600: "#B8791C",
    amber100: "#FBEFDC",
    red600: "#C23B3B",
    red100: "#FBEAEA",
  },
  font: {
    // next/font (variable mode, configured in app/layout.js) generates
    // these as CSS custom properties on <html> -- referencing the
    // variable, not a hardcoded family name, is what actually makes
    // the self-hosted font apply. A hardcoded "'Manrope', sans-serif"
    // string here would silently fall back to the browser's default
    // Manrope (if installed) or system sans, never the self-hosted one.
    sans: "var(--font-manrope), system-ui, sans-serif",
    mono: "var(--font-plex-mono), monospace",
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    pill: "999px",
  },
  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    6: "24px",
    8: "32px",
    12: "48px",
    16: "64px",
  },
  shadow: {
    sm: "0 1px 2px rgba(26, 32, 41, 0.06)",
    md: "0 4px 16px rgba(26, 32, 41, 0.08)",
  },
};

// Next.js 16's Turbopack build always statically prerenders the
// special /_not-found route as part of `next build`, and that
// specific prerender pass doesn't receive ThemeProvider context --
// every styled-component touched by that render (directly or via a
// shared UI primitive) crashes with "Cannot read properties of
// undefined" unless it falls back to this. Every styled-components
// theme accessor in this project goes through rt() instead of
// destructuring `theme` directly, specifically to route around this.
export function rt(theme) {
  return theme && theme.color ? theme : theme_;
}
const theme_ = theme;
