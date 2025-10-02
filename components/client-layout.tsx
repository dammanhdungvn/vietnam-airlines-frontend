"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])
  const toggleSidebar = useCallback(() => setIsSidebarOpen((v) => !v), [])

  // Giữ trạng thái sidebar trên desktop khi điều hướng; chỉ auto-close trên mobile/tablet
  const handleNavigate = useCallback(() => {
    if (typeof window === "undefined") return
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches
    if (!isDesktop) {
      closeSidebar()
    }
  }, [closeSidebar])

  // Set initial sidebar state: open on desktop (>= 1024px), closed on mobile/tablet
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches
        setIsSidebarOpen(isDesktop)
      }
    } catch (_) {
      // noop
    }
  }, [])

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
        {/* Sidebar for desktop (always visible), mobile (overlay) */}
        <Sidebar
          className={
            // Visibility: mobile conditional display, desktop always render
            (isSidebarOpen ? "block" : "hidden") +
            " lg:block " +
            // Slide behavior for both mobile and desktop
            (isSidebarOpen ? " translate-x-0 lg:translate-x-0" : " -translate-x-full lg:-translate-x-full") +
            " transform transition-transform duration-300 ease-in-out"
          }
          onNavigate={handleNavigate}
        />

        {/* Top bar with toggle button (all sizes) */}
        <div
          className={
            "fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur border-b " +
            (isSidebarOpen ? "lg:pl-64" : "lg:pl-0")
          }
        >
          <div className="flex items-center justify-between px-3 py-3">
            <button
              aria-label="Mở menu"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border bg-white text-gray-700 hover:bg-gray-50"
              onClick={toggleSidebar}
            >
              {/* Hamburger icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-sm font-medium text-gray-700 truncate px-2">
              Vietnam Airlines
            </div>
            <div className="w-9" />
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className={"flex-1 p-4 sm:p-6 bg-gray-50/50 w-full " + (isSidebarOpen ? "lg:ml-64" : "lg:ml-0") }>
          {/* Spacing to avoid under fixed top bar */}
          <div className="h-12" />
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    )
  }

  return null
}
