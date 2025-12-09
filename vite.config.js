import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // 檢查這裡後面有沒有逗號，還有最後的 }) 有沒有少
})
