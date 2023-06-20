import './globals.css'
import { fontMain, fontCode } from './fonts'
import { Footer } from './components/Footer'

export const metadata = {
  title: 'Marmalade | Powered by Kadena',
  description: 'Share what you love on the most advanced NFT marketplaces.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${fontMain.className} ${fontCode.variable}`}>
        {children}
        <Footer></Footer>
      </body>
    </html>
  )
}
