import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.xianji.guitar',
  appName: '弦迹',
  webDir: 'dist',
  server: { hostname: 'localhost', androidScheme: 'https' },
}

export default config
