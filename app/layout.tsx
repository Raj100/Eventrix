import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/app/providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Eventrix Exhibition & Studio - Premium Print-On-Demand",
  description:
    "Create stunning custom prints on mugs, t-shirts, business cards, and more. Professional design services and templates available.",
  keywords: "print on demand, custom mugs, business cards, t-shirts, design services, personalized gifts",
  authors: [{ name: "Eventrix Exhibition & Studio" }],
  creator: "Eventrix",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eventrix.com",
    siteName: "Eventrix Exhibition & Studio",
    title: "Eventrix Exhibition & Studio",
    description: "Premium Print-On-Demand Platform",
  }
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a1a1a" },
    { media: "(prefers-color-scheme: dark)", color: "#f7f7f7" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
