import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
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
    <html lang="vi" className={inter.className}>
      <body className="bg-gray-50">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
