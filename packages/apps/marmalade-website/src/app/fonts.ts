import { IBM_Plex_Sans } from 'next/font/google'
import localFont from 'next/font/local'

export const fontMain = IBM_Plex_Sans({
  weight: ['400', '700'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-main',
})

// todo: change to @kadena/font package
export const fontCode = localFont({
  src: [
    {
      path: './resources/fonts/Kode-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './resources/fonts/Kode-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-code',
  fallback: ['Courier New', 'monospace'],
})