import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve, dirname } from "path";
import { fileURLToPath } from 'url';  

const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), 'src');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '#components': resolve(srcDir, 'components'),
      '#constants': resolve(srcDir, 'constants'),
      '#store': resolve(srcDir, 'store'),
      '#hoc': resolve(srcDir, 'hoc'),
      '#windows': resolve(srcDir, 'windows'),
    }
  }
});
