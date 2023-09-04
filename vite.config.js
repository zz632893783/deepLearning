import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import mkcert from 'vite-plugin-mkcert';
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue(), mkcert()],
  // plugins: [vue()],
  plugins: [vue(), basicSsl()],
  server: {
    https: true
  }
})
