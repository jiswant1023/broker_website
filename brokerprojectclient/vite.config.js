import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/broker':{
        target:'http://localhost:1000',
        secure:false,
      },
    },
  },
  plugins: [react()],
});
