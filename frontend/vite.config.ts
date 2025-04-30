import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
   
    define: {
      'process.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
      'process.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL),
      'process.env.VITE_IS_PRODUCTION': JSON.stringify(env.VITE_IS_PRODUCTION)
    },
   
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode !== 'production'
    }
  }
})