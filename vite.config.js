import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'



// https://vite.dev/config/

export default defineConfig({

plugins: [react()],

// ⚠️ 關鍵修正：這一行告訴 Vite 網站在 GitHub Pages 的子路徑在哪裡

base: '/element-shooter/',

})
