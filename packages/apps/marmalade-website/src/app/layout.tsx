import './globals.css'

import { Footer } from './partials/Footer'
import { fontCode,fontMain } from './fonts'

import React from 'react';

export const metadata : {
  title: string,
  description: string
} = {
  title: 'Marmalade | Powered by Kadena',
  description: 'Share what you love on the most advanced NFT marketplaces.',
}

export default function RootLayout({ children }: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body className={`${fontMain.className} ${fontCode.variable}`}>
        {children}
        <Footer></Footer>
      </body>
    </html>
  )
}
