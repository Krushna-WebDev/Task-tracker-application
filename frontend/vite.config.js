import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        theme: {
          extend: {
            fontFamily: {
              heading: ["Poppins", "sans-serif"], // Clean and modern font for headings
              display: ["Playfair Display", "serif"], // Elegant serif font for headings
              body: ["Roboto", "sans-serif"], // Popular sans-serif font for paragraphs
              mono: ["Source Code Pro", "monospace"], // Monospace font for code or technical text
              casual: ["Lora", "serif"], // Stylish serif font for casual text
              alt: ["Inter", "sans-serif"], // Versatile sans-serif font for alternative use
            },
          },
        },
      },
    }),
  ],
});
