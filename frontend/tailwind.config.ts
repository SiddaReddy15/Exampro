import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#F8FAFC",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#4F46E5",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#7C3AED",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#2563EB",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: "#FFFFFF",
        textPrimary: "#0F172A",
        textSecondary: "#475569",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#06B6D4",
        "brand-blue": "#2563EB",
        "brand-indigo": "#4F46E5",
        "brand-purple": "#7C3AED",
        "brand-teal": "#14B8A6",
        "brand-emerald": "#10B981",
        "brand-sky": "#38BDF8",
        "brand-orange": "#F97316",
        "brand-pink": "#EC4899",
        "brand-yellow": "#FACC15",
        "dark": "#0F172A",
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(to right, #4F46E5, #7C3AED)",
        "hero-gradient": "linear-gradient(135deg, #4F46E5, #06B6D4)",
        "cta-gradient": "linear-gradient(135deg, #10B981, #14B8A6)",
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "16px",
      },
      fontFamily: {
        heading: ["var(--font-inter)", "Inter", "Poppins", "sans-serif"],
        body: ["var(--font-roboto)", "Roboto", "Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
