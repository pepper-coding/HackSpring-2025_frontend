import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/app/store-provider"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "3D Store Planner",
  description: "Plan your store layout in 3D",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'