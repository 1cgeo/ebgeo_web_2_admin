import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      }),
      viteCompression()
    ],
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false // Adicionar para desenvolvimento com HTTPS
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-core': ['react', 'react-dom', 'react-router-dom'],
            'vendor-mui': [
              '@mui/material',
              '@mui/icons-material', 
              '@mui/x-data-grid',
              '@mui/x-date-pickers',
              '@emotion/react',
              '@emotion/styled'
            ],
            'vendor-utils': ['axios', 'lodash', 'date-fns'], // Removi SWR pois não estamos usando
            'vendor-charts': ['recharts']
          }
        }
      },
      sourcemap: mode === 'development', // Sourcemap apenas em desenvolvimento
      chunkSizeWarningLimit: 1000,
      target: 'esnext',
      minify: 'esbuild'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})