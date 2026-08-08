import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        "inter-tight": ["var(--font-inter-tight)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        helvetica: ["var(--font-helvetica)"],
      },
      colors: {
        background: "var(--color-background)",
        heading: "var(--color-heading)",
        strong: "var(--color-strong)",
        muted: {
          DEFAULT: "var(--color-muted)",
          light: "var(--color-muted-light)",
          mid: "var(--color-muted-mid)",
        },
        border: "var(--color-border)",
        input: "var(--color-input-bg)",
        accent: {
          DEFAULT: "var(--color-accent)",
          from: "var(--color-accent-from)",
          to: "var(--color-accent-to)",
        },
        sidebar: "var(--color-sidebar-bg)",
        card: "var(--color-card-bg)",
        grid: {
          border: "var(--color-grid-border)",
          weekend: "var(--color-grid-weekend)",
          today: "var(--color-grid-today)",
          muted: "var(--color-grid-muted)",
        },
        "now-line": "var(--color-now-line)",
        booking: {
          mine: "var(--color-booking-mine)",
          "mine-subtle": "var(--color-booking-mine-subtle)",
          "other-bg": "var(--color-booking-other-bg)",
          "other-border": "var(--color-booking-other-border)",
          "other-text": "var(--color-booking-other-text)",
          "other-subtle": "var(--color-booking-other-subtle)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          bg: "var(--color-error-bg)",
        },
        rating: "var(--color-rating)",
        google: {
          from: "var(--color-google-from)",
          to: "var(--color-google-to)",
        },
        cta: {
          from: "var(--color-cta-from)",
          via: "var(--color-cta-via)",
          to: "var(--color-cta-to)",
        },
      },
      borderRadius: {
        card: "var(--radius-card)",
        panel: "var(--radius-panel)",
        logo: "var(--radius-logo)",
        input: "var(--radius-input)",
        button: "var(--radius-button)",
        widget: "var(--radius-widget)",
        "room-card": "var(--radius-room-card)",
      },
      boxShadow: {
        google: "var(--shadow-google)",
        cta: "var(--shadow-cta)",
        widget: "var(--shadow-widget)",
      },
      fontSize: {
        hero: ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "500" }],
        subtitle: ["16px", { lineHeight: "26px", fontWeight: "400" }],
        label: ["12px", { lineHeight: "16px", letterSpacing: "-0.01em", fontWeight: "500" }],
        caption: ["11px", { lineHeight: "16px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "google-btn": ["14px", { lineHeight: "20px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "cta-btn": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        testimonial: ["24px", { lineHeight: "28px", fontWeight: "500" }],
        "testimonial-author": ["16px", { lineHeight: "28px", fontWeight: "400" }],
        "widget-title": ["18px", { lineHeight: "26px", fontWeight: "500" }],
        eyebrow: ["11px", { lineHeight: "12px", letterSpacing: "0.02em", fontWeight: "500" }],
        "room-name": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "room-meta": ["12px", { lineHeight: "17px", fontWeight: "400" }],
      },
    },
  },
};

export default config;
