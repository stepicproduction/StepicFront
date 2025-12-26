import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import {visualizer} from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cssInjectedByJsPlugin(),
    visualizer({ open: true }),
  ],
  build : {
    sourcemap : true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
});
