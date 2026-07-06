// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'node:path'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//       '@/components': path.resolve(__dirname, './src/components'),
//       '@/pages': path.resolve(__dirname, './src/pages'),
//       '@/data': path.resolve(__dirname, './src/data'),
//       '@/styles': path.resolve(__dirname, './src/styles'),
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/DM-2026/',
})