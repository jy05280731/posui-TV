import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@/app/styles/main.css'
import { ThemeProvider } from 'next-themes'
import AppRouter from './router'
import { Toaster } from '@/shared/components/ui/sonner'
import { TooltipProvider } from '@/shared/components/ui/tooltip'

// 👇 新增：从你改好的配置文件里导入视频源
import { initialConfig } from '@/shared/config/initialConfig'
import { useVideoStore } from '@/shared/stores/videos'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

const root = document.getElementById('root')!

const app = (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <TooltipProvider>
      <AppRouter />
      <Toaster richColors position="top-center" />
      {import.meta.env.OKI_DISABLE_ANALYTICS !== 'true' && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </TooltipProvider>
  </ThemeProvider>
)

// 👇 新增：初始化视频源数据
useVideoStore.getState().addVideos(initialConfig.videoSources)

createRoot(root).render(import.meta.env.DEVELOPMENT ? <StrictMode>{app}</StrictMode> : app)
