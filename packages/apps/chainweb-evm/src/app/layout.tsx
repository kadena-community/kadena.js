"use client";

import { Inter, Kode_Mono } from "next/font/google";
import { mediaProviderStyles, Version } from '@kadena/kode-ui';
import "../styles/global.css";
import { Nav } from "../components/Nav/Header";
import { Overlay } from "../components/Overlay";
import { Providers } from "../providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = Kode_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Chainweb EVM</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="description" content="Chainweb EVM Application" />
        <meta content="#020E1B" name="theme-color" />
        <meta content="text/html; charset=UTF-8" name="Content-Type" />
        <link
          rel="icon"
          href="/icon.svg"
          sizes="128x128"
        />
        <link
          rel="shortcut icon"
          href="/icon.svg"
        />
        {/* Android Shortcut icon */}
        <link rel="shortcut icon" href="/icon.svg" />
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/icon.svg" />
        <style
          key="fresnel-css"
          dangerouslySetInnerHTML={{ __html: mediaProviderStyles }}
          type="text/css"
        />
      </head>
      <body
        className={`${inter.variable} ${mono.variable} antialiased`}
      >
        <Version
          sha={process.env.NEXT_PUBLIC_COMMIT_SHA}
          SSRTime={process.env.NEXT_PUBLIC_BUILD_TIME}
          repo={`https://github.com/kadena-community/kadena.js/tree/${process.env.NEXT_PUBLIC_COMMIT_SHA || 'main'}/packages/apps/chainweb-evm`}
        />
        <Nav />
        <Providers>
          {children}
        </Providers>
        <Overlay />
      </body>
    </html>
  );
}
