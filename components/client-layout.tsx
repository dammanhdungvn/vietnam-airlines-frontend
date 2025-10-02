"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/context/AuthContext"
import { getCookie } from "@/lib/cookies"

/**
 * @fileoverview ClientLayout component - Layout chính cho ứng dụng
 * @description Xử lý authentication check và redirect, hiển thị sidebar cho trang đã auth
 * @version 2.0.0
 * @since 2025-10-03
 * @author Dũng Đàm
 */
export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const isLoginPage = pathname === "/login"

  /**
   * Effect để xử lý redirect dựa trên trạng thái authentication
   * Sử dụng router.replace để tránh tạo history entry, giúp redirect nhanh hơn
   */
  useEffect(() => {
    if (!isLoading) {
      // Nếu chưa đăng nhập và không ở trang login, chuyển đến trang login
      if (!isAuthenticated && !isLoginPage) {
        router.replace("/login")
      }
      // Nếu đã đăng nhập và đang ở trang login, chuyển đến dashboard
      if (isAuthenticated && isLoginPage) {
        router.replace("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, isLoginPage, router])

  /**
   * Effect để check cookie trực tiếp và redirect ngay lập tức
   * Giúp tránh flash loading screen khi đã có cookie
   */
  useEffect(() => {
    if (isLoginPage) {
      const token = getCookie("accessToken")
      if (token) {
        // Đã có token, redirect ngay không cần chờ AuthContext
        router.replace("/dashboard")
      }
    }
  }, [isLoginPage, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
            role="status"
          ></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (isLoginPage) {
    return <div className="min-h-screen">{children}</div>
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 bg-gray-50/50">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    )
  }

  return null
}
