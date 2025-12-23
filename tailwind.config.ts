import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // preserve existing families and set display to Orbitron for headings
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
      },
      colors: {
        // preserved existing tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
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
        // existing custom tokens
        sky: {
          glow: "hsl(var(--sky-glow))",
        },
        radar: {
          green: "hsl(var(--radar-green))",
        },
        alert: {
          orange: "hsl(var(--alert-orange))",
        },
        midnight: "hsl(var(--midnight))",
        glass: "hsl(var(--glass))",
        // additions from user's config (only added if not present)
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        aviation: {
          blue: "hsl(var(--aviation-blue))",
          sky: "hsl(var(--sky-blue))",
          indigo: "hsl(var(--deep-indigo))",
          sunset: "hsl(var(--sunset-orange))",
          cloud: "hsl(var(--cloud-white))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.4)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.6)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        // added keyframes from user config (non-destructive)
        "plane-move": {
          "0%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "25%": { transform: "translateX(25%) translateY(-10px) rotate(2deg)" },
          "50%": { transform: "translateX(50%) translateY(0) rotate(0deg)" },
          "75%": { transform: "translateX(75%) translateY(10px) rotate(-2deg)" },
          "100%": { transform: "translateX(100%) translateY(0) rotate(0deg)" },
        },
        "aurora": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-up": "slide-in-up 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "plane-move": "plane-move 20s linear infinite",
        "aurora": "aurora 15s ease infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-sky': 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(199 89% 48%) 100%)',
        'gradient-card': 'linear-gradient(180deg, hsl(222 47% 13%) 0%, hsl(222 47% 9%) 100%)',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'aurora-gradient': 'linear-gradient(135deg, hsl(210, 100%, 50%) 0%, hsl(200, 80%, 60%) 50%, hsl(230, 50%, 35%) 100%)',
        'sky-gradient': 'linear-gradient(180deg, hsl(220, 25%, 3%) 0%, hsl(230, 50%, 15%) 50%, hsl(210, 100%, 20%) 100%)',
      },
      boxShadow: {
        'glow': '0 0 40px hsl(var(--primary) / 0.3)',
        'glow-accent': '0 0 40px hsl(var(--accent) / 0.3)',
        'card': '0 4px 30px hsl(0 0% 0% / 0.3)',
        'elevated': '0 8px 40px hsl(0 0% 0% / 0.4)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
