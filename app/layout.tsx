import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "نظام إدارة العطاءات والمناقصات",
  description: "نظام شامل لإدارة العطاءات والمناقصات",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar">
      <body className={inter.className}>
        <LanguageProvider>
          <main className="min-h-screen bg-gray-50">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  )
}
