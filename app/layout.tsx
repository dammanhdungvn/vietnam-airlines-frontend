import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "@/components/ui/sonner"
import { ClientLayout } from "@/components/client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vietnam Airlines - Hệ thống quản lý sự kiện",
  description: "Hệ thống quản lý sự kiện và hội nghị Vietnam Airlines",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={inter.className} suppressHydrationWarning={true}>
      <body>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
