import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0D12",
        slate: "#101827",
        haze: "#E6EEF9",
        neon: "#7CFF6B",
        ember: "#FF7A59",
        flux: "#5EE4FF",
        aura: "#FFE37A"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(94, 228, 255, 0.2)",
        ember: "0 0 40px rgba(255, 122, 89, 0.25)"
      },
      backgroundImage: {
        "grid-glow": "radial-gradient(circle at 20% 20%, rgba(94, 228, 255, 0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255, 227, 122, 0.2), transparent 35%), linear-gradient(120deg, rgba(16, 24, 39, 0.9), rgba(11, 13, 18, 0.95))"
      }
    }
  },
  plugins: []
};

export default config;
