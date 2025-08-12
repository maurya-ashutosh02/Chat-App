import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import daisyui from "daisyui";



export default defineConfig({
  plugins: [tailwindcss(), react()],
});